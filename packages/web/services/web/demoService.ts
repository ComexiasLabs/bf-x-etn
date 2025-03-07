import axios from 'axios';
import { JWT } from '@core/entities/jwt';
import logger from '@core/logger/logger';
import { ApiSignInResponse } from '@handlers/apiUserHandler';

interface SignInResponse {
  token: string;
  userId: string;
}

export const createDemoProfile = async (): Promise<SignInResponse> => {
  try {
    logger.logInfo('createDemoProfile', 'Begin');

    const response = await axios.post<ApiSignInResponse>('/api/demo/create');

    if (response.status !== 200 || !response.data) {
      return null;
    }

    return {
      token: (response.data.token as JWT)?.token,
      userId: response.data.userId,
    };
  } catch (e) {
    logger.logError('createDemoProfile', 'Failed', e);
    return null;
  }
};
