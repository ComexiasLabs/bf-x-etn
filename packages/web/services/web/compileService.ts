import axios from 'axios';
import logger from '@core/logger/logger';
import localStorageHelper from '@core/storage/localStorageHelper';

export interface CompileCodeParams {
  appId: string;
  contractName: string;
  code: string;
  dependencies: {
    path: string;
    fileContent: string;
  }[];
}

export const compileCode = async (params: CompileCodeParams): Promise<boolean> => {
  try {
    logger.logInfo('compile', 'Begin', params);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorageHelper.getAuthToken()}`,
      },
    };

    const response = await axios.post('/api/dapp/compile-code', params, config);

    if (response.status !== 200) {
      return false;
    }

    if (response.data.isSuccessful) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    logger.logError('compile', 'Failed', e);
    return false;
  }
};
