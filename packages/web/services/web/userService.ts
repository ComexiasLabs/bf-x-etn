import { Blockchains } from '@core/enums/blockchains';
import axios from 'axios';
import { JWT } from '@core/entities/jwt';
import logger from '@core/logger/logger';
import { UserWallet } from '@modules/firebase/models/userWallet';
import { ApiSignInResponse } from '@handlers/apiUserHandler';

interface SignInUserProps {
  blockchain: Blockchains;
  walletAddress: string;
  signature: string;
}

interface SignInResponse {
  token: string;
  userId: string;
}

export const signInUser = async ({
  blockchain,
  walletAddress,
  signature,
}: SignInUserProps): Promise<SignInResponse> => {
  try {
    logger.logInfo('signInUser', 'Begin');

    if (!walletAddress) {
      return;
    }

    const response = await axios.post<ApiSignInResponse>('/api/auth/signin', {
      blockchain,
      walletAddress,
      signature,
    });

    if (response.status !== 200 || !response.data) {
      return null;
    }

    return {
      token: (response.data.token as JWT)?.token,
      userId: response.data.userId,
    };
  } catch (e) {
    logger.logError('signInUser', 'Failed', e);
    return null;
  }
};

export const fetchUserWallet = async (walletAddress: string, blockchain: string): Promise<UserWallet | null> => {
  try {
    logger.logInfo('fetchUserWallet', 'Begin');

    if (!walletAddress) {
      return null;
    }

    const response = await axios.get<UserWallet>(`/api/users/wallets/${blockchain}/${walletAddress}`);

    return response.data;
  } catch (e) {
    logger.logError('fetchUserWallet', 'Failed', e);
    return null;
  }
};
