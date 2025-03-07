import logger from '@core/logger/logger';
import { Blockchains } from '@core/enums/blockchains';
import { FirestoreDB } from '@modules/firebase/firestore';
import { Environments } from '@core/enums/environments';
import BscScanApi from '@modules/blockexplorers/bscscan/bscscanApi';
import TronScanApi from '@modules/blockexplorers/tronscan/tronscanApi';
import { AnalyticsData, AnalyticsStats, AnalyticsTransaction } from '@modules/firebase';
import { getCurrentTimestampInSeconds } from '@core/helpers/datetimeHelper';
import { createBlockExplorer } from '@modules/blockexplorers/blockexplorers';

export interface ApiRefreshAnalyticsParams {
  appId: string;
  blockchain: string;
  contractAddress: string;
  environment: Environments;
}

export interface ApiRefreshAnalyticsResponse {
  status: string;
  analyticsStats: AnalyticsStats;
}

export const apiRefreshAnalytics = async (params: ApiRefreshAnalyticsParams): Promise<ApiRefreshAnalyticsResponse> => {
  try {
    logger.logInfo('apiRefreshAnalytics', 'Begin', params);

    const { appId, blockchain, environment, contractAddress } = params;

    // Get last refresh block
    const database = new FirestoreDB();
    let analyticsStats = await database.analyticsStats.getAnalyticsStats(appId, environment, contractAddress);

    const currentTime = getCurrentTimestampInSeconds();
    const startBlock = analyticsStats ? analyticsStats.lastRefreshBlock : 0;
    const hasAnalyticsStats = analyticsStats ? true : false;

    const refreshRateInSeconds = 60 * 10; //10 minutes

    // TODO:
    // const shouldRefresh = hasAnalyticsStats
    //   ? currentTime > analyticsStats.lastRefreshDateUTC + refreshRateInSeconds
    //   : true;
    const shouldRefresh = true;

    if (!analyticsStats) {
      analyticsStats = {
        appId,
        blockchain: blockchain as Blockchains,
        environment,
        contractAddress,
        lastRefreshBlock: 0,
        lastRefreshDateUTC: 0,
      };
    }

    if (!shouldRefresh) {
      logger.logInfo('apiRefreshAnalytics', 'Skipping due to controlled refresh rate.');
      return;
    }

    // Create block explorer
    const blockExplorer = createBlockExplorer(blockchain as Blockchains);
    if (!blockExplorer) {
      logger.logWarning('apiRefreshAnalytics', `Analytics for ${blockchain} is not yet supported.`);
      return;
    }

    const { analyticsData, endBlock } = await blockExplorer.getAnalytics({
      appId,
      environment,
      contractAddress,
      currentTime,
      startBlock,
    });

    // Save analytics data
    if (analyticsData) {
      await database.analyticsData.addAnalyticsData(analyticsData);
    }

    // Update analytics stats
    analyticsStats.lastRefreshBlock = endBlock;
    analyticsStats.lastRefreshDateUTC = currentTime;

    if (!hasAnalyticsStats) {
      await database.analyticsStats.addAnalyticsStats(analyticsStats);
    } else {
      await database.analyticsStats.updateAnalyticsStats(analyticsStats);
    }

    return {
      status: 'success',
      analyticsStats,
    };
  } catch (e) {
    logger.logError('apiRefreshAnalytics', 'Failed', e);
    return null;
  }
};

export interface ApiFetchAnalyticsStatsParams {
  appId: string;
  blockchain: string;
  contractAddress: string;
  environment: Environments;
}

export const apiFetchAnalyticsStats = async (params: ApiFetchAnalyticsStatsParams): Promise<AnalyticsStats | null> => {
  try {
    logger.logInfo('apiFetchAnalyticsStats', 'Begin');

    const { appId, blockchain, environment, contractAddress } = params;

    if (!environment || !contractAddress) {
      return null;
    }

    const database = new FirestoreDB();
    const result = await database.analyticsStats.getAnalyticsStats(appId, environment, contractAddress);

    return result;
  } catch (e) {
    logger.logError('apiFetchAnalyticsStats', 'Failed', e);
    return null;
  }
};

export interface ApiFetchAnalyticsTransactionsParams {
  appId: string;
  blockchain: string;
  contractAddress: string;
  environment: Environments;
  startTimestamp: number;
  endTimestamp: number;
}

export const apiFetchAnalyticsTransactions = async (
  params: ApiFetchAnalyticsTransactionsParams,
): Promise<AnalyticsTransaction[] | null> => {
  try {
    logger.logInfo('apiFetchAnalyticsTransactions', 'Begin', params);

    const { appId, blockchain, environment, contractAddress, startTimestamp, endTimestamp } = params;

    if (!environment || !contractAddress) {
      return null;
    }

    const database = new FirestoreDB();
    const data = await database.analyticsData.getAnalyticsData(
      appId,
      environment,
      contractAddress,
      startTimestamp,
      endTimestamp,
    );

    const result: AnalyticsTransaction[] = [];
    data.forEach((element) => {
      element.transactions.forEach((tx) => {
        if (tx.dateTimeUTC >= startTimestamp && tx.dateTimeUTC <= endTimestamp) {
          result.push(tx);
        }
      });
    });

    return result;
  } catch (e) {
    logger.logError('apiFetchAnalyticsTransactions', 'Failed', e);
    return null;
  }
};
