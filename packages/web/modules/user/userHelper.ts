import logger from '@core/logger/logger';
import { Blockchains } from '@core/enums/blockchains';
import { generateUUID } from '@core/helpers/generateHelper';
import { signInUser } from '@services/web/userService';
import { createBlockchainProvider } from '@modules/blockchains/blockchains';
import { createDemoProfile } from '@services/web/demoService';

export interface AuthenticateUserResponse {
  isSuccessful: boolean;
  token: string;
  userId: string;
}

export const authenticateUser = async (
  blockchain: Blockchains,
  walletAddress: string,
): Promise<AuthenticateUserResponse> => {
  logger.logInfo('signIn', `blockchain: ${blockchain}, walletAddress: ${walletAddress}`);

  const blockchainProvider = createBlockchainProvider(blockchain as Blockchains);

  try {
    let signature = '';
    if (
      blockchain === Blockchains.Fantom ||
      blockchain === Blockchains.BNBChain ||
      blockchain === Blockchains.TRON ||
      blockchain === Blockchains.Areon ||
      blockchain === Blockchains.Electroneum
    ) {
      signature = await blockchainProvider.signSignature('BlockFabric Login');
    } else {
      // Randomize signature to avoid predictability
      signature = generateUUID();
    }

    const signInResponse = await signInUser({
      blockchain,
      walletAddress,
      signature,
    });
    if (!signInResponse) {
      return {
        token: '',
        userId: '',
        isSuccessful: false,
      };
    }

    return {
      token: signInResponse.token,
      userId: signInResponse.userId,
      isSuccessful: true,
    };
  } catch (e) {
    logger.logWarning('signIn', 'Failed to sign in user.', e);
    return {
      token: '',
      userId: '',
      isSuccessful: false,
    };
  }
};

export const authenticateDemoUser = async (): Promise<AuthenticateUserResponse> => {
  logger.logInfo('authenticateDemoUser', 'Begin');

  try {
    const demoResponse = await createDemoProfile();
    if (!demoResponse) {
      return {
        token: '',
        userId: '',
        isSuccessful: false,
      };
    }

    return {
      token: demoResponse.token,
      userId: demoResponse.userId,
      isSuccessful: true,
    };
  } catch (e) {
    logger.logWarning('authenticateDemoUser', 'Failed to create demo profile.', e);
    return {
      token: '',
      userId: '',
      isSuccessful: false,
    };
  }
};
