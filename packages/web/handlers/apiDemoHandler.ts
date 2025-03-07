import { JWT } from '@core/entities/jwt';
import logger from '@core/logger/logger';
import { generateToken } from '@modules/jwt/jwtHelper';
import { generateUUID } from '@core/helpers/generateHelper';
import { FirestoreDB } from '@modules/firebase/firestore';
import { getCurrentTimestamp } from '@core/helpers/datetimeHelper';
import { UserProfile } from '@modules/firebase/models/userProfile';
import { DEMO_APPS_ETN } from '@modules/demo/demoPresetsEtn';
import { AnalyticsData, AnalyticsTransaction } from '@modules/firebase';
import { Blockchains } from '@core/enums/blockchains';
import { Environments } from '@core/enums/environments';
import { subDays } from 'date-fns';

export interface ApiSignInResponse {
  token: JWT | null;
  userId: string;
}

export const apiCreateDemoProfile = async (): Promise<ApiSignInResponse> => {
  try {
    logger.logInfo('apiCreateDemoProfile', 'Begin');

    const database = new FirestoreDB();

    const userId = generateUUID();
    const userProfile: UserProfile = {
      userId,
      createdDateUTC: getCurrentTimestamp(),
      isDemo: true,
    };

    logger.logInfo('apiCreateDemoProfile', `Creating demo user profile ${userId}.`);
    await database.userProfile.addUserProfile(userProfile);

    const appsCreationPromises = DEMO_APPS_ETN.map(async (app) => {
      const appId = generateUUID();
      app.appId = appId;
      app.userId = userId;
      app.createdDateUTC = getCurrentTimestamp();

      await database.apps.addApp(app);

      const analyticsPromises = app.deployments.map((deployment) => {
        const analyticsData = generateDemoAnalyticsData(
          appId,
          deployment.blockchain,
          deployment.environment,
          deployment.contractAddress,
        );
        return database.analyticsData.addAnalyticsData(analyticsData);
      });

      await Promise.all(analyticsPromises);
    });

    await Promise.all(appsCreationPromises);

    // Generate JWT token
    const tokenPayload = generateToken({ userId });
    const result: ApiSignInResponse = {
      userId,
      token: {
        token: tokenPayload,
      },
    };

    return result;
  } catch (e) {
    logger.logError('apiCreateDemoProfile', 'Failed', e);
    return null;
  }
};

const generateDemoAnalyticsData = (
  appId: string,
  blockchain: Blockchains,
  environment: Environments,
  contractAddress: string,
): AnalyticsData => {
  const result: AnalyticsData = {
    appId,
    blockchain,
    environment,
    contractAddress,
    fetchTimeUTC: Date.now(),
    startBlock: 0,
    endBlock: 0,
    transactions: [],
  };

  const days = 100;
  const functions = ['setOwner', 'createConversation', 'applyChanges', 'editRecord'];
  const methodId = '13af4035';
  let currentBlockNumber = 36862674;

  for (let i = days; i >= 0; i--) {
    const numTransactions = Math.floor(Math.random() * 11);
    const date = subDays(new Date(), i);
    const timeStamp = Math.floor(date.getTime() / 1000);

    for (let j = 0; j < numTransactions; j++) {
      const gasUsed = Math.floor(Math.random() * 6001 + 2000).toString();
      const functionName =
        j === 0 && i === days ? 'Contract Creation' : functions[Math.floor(Math.random() * functions.length)];

      const transaction: AnalyticsTransaction = {
        transactionHash: '75eb0135b6bf80b3e1608daadf668b1120cfd2e2499d7f877742fb3f0f165db0',
        dateTimeUTC: timeStamp,
        data: {
          blockNumber: (currentBlockNumber - i).toString(),
          blockHash: '',
          timeStamp: timeStamp.toString(),
          hash: '75eb0135b6bf80b3e1608daadf668b1120cfd2e2499d7f877742fb3f0f165db0',
          from: 'TDZvnc36AtKwrg4MiWu4PonVRkbEzx688z',
          to: contractAddress,
          value: '0',
          gas: '0',
          gasPrice: '0',
          gasUsed: gasUsed,
          methodId: functionName === 'Contract Creation' ? null : methodId,
          functionName: functionName,
          contractAddress: contractAddress,
          cumulativeGasUsed: gasUsed,
          txreceipt_status: 'Confirmed',
          isError: 'false',
        },
      };

      result.transactions.push(transaction);
    }
  }

  return result;
};
