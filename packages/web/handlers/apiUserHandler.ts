import { JWT } from '@core/entities/jwt';
import logger from '@core/logger/logger';
import { generateToken } from '@modules/jwt/jwtHelper';
import { generateUUID } from '@core/helpers/generateHelper';
import { Blockchains } from '@core/enums/blockchains';
import { FirestoreDB } from '@modules/firebase/firestore';
import { UserWallet } from '@modules/firebase/models/userWallet';
import { getCurrentTimestamp } from '@core/helpers/datetimeHelper';
import { createBlockchainProvider } from '@modules/blockchains/blockchains';
import { UserProfile } from '@modules/firebase/models/userProfile';

export interface ApiSignInUserParams {
  blockchain: string;
  walletAddress: string;
  signature: string;
}

export interface ApiSignInResponse {
  token: JWT | null;
  userId: string;
}

export const apiSignInUser = async (params: ApiSignInUserParams): Promise<ApiSignInResponse> => {
  try {
    logger.logInfo('apiSignInUser', 'Begin', params);

    const { blockchain, walletAddress, signature } = params;

    const blockchainProvider = createBlockchainProvider(blockchain as Blockchains);

    // TODO: Handle verification for TRON
    if (blockchain !== Blockchains.TRON) {
      const message = 'BlockFabric Login';
      const isSignatureValid = blockchainProvider.verifySignature(message, signature, walletAddress);
      if (!isSignatureValid) {
        logger.logWarning('apiSignInUser', 'Invalid signature');
        return null;
      }
    }

    const database = new FirestoreDB();

    let userId = null;

    // Create new user profile if not already exist
    let userProfile: UserProfile = await apiFetchUserProfile({ walletAddress });
    if (!userProfile) {
      userId = generateUUID();
      userProfile = {
        userId,
        walletAddress: walletAddress,
        createdDateUTC: getCurrentTimestamp(),
        isDemo: false,
      };

      logger.logInfo('apiSignInUser', `Creating new user profile ${userId}.`);
      await database.userProfile.addUserProfile(userProfile);
    } else {
      userId = userProfile.userId;
    }

    // Create new user wallet if not already exist
    let userWallet: UserWallet = await apiFetchUserWallet({ walletAddress, blockchain });
    if (!userWallet) {
      userWallet = {
        userId,
        walletAddress: walletAddress,
        blockchain: blockchain,
        createdDateUTC: getCurrentTimestamp(),
      };

      logger.logInfo('apiSignInUser', `Creating new user wallet ${walletAddress}.`);
      await database.userWallets.addUserWallet(userWallet);
    }

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
    logger.logError('apiSignInUser', 'Failed', e);
    return null;
  }
};

export interface ApiFetchUserProfileRequest {
  email?: string;
  walletAddress?: string;
}

export const apiFetchUserProfile = async (params: ApiFetchUserProfileRequest): Promise<UserProfile | null> => {
  try {
    logger.logInfo('apiFetchUserProfile', 'Begin', params);

    const { walletAddress, email } = params;
    if (!walletAddress && !email) {
      return null;
    }

    let result = null;

    const database = new FirestoreDB();

    if (walletAddress) {
      result = await database.userProfile.getUserProfileByWallet(walletAddress);
    }

    if (email) {
      result = await database.userProfile.getUserProfileByEmail(email);
    }

    return result;
  } catch (e) {
    logger.logError('apiFetchUserProfile', 'Failed', e);
    return null;
  }
};

export interface ApiFetchUserWalletRequest {
  walletAddress: string;
  blockchain: string;
}

export const apiFetchUserWallet = async (params: ApiFetchUserWalletRequest): Promise<UserWallet | null> => {
  try {
    logger.logInfo('apiFetchUserWallet', 'Begin', params);

    const { walletAddress, blockchain } = params;
    if (!walletAddress) {
      return null;
    }

    const database = new FirestoreDB();
    const result = await database.userWallets.getUserWallet(walletAddress, blockchain);
    return result;
  } catch (e) {
    logger.logError('apiFetchUserWallet', 'Failed', e);
    return null;
  }
};
