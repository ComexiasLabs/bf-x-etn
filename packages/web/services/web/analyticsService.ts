import { Blockchains } from '@core/enums/blockchains';
import axios from 'axios';
import logger from '@core/logger/logger';
import { UserWallet } from '@modules/firebase/models/userWallet';
import { ApiRefreshAnalyticsResponse } from '@handlers/apiAnalyticsHandler';
import { Environments } from '@core/enums/environments';
import localStorageHelper from '@core/storage/localStorageHelper';
import { AnalyticsTransaction } from '@modules/firebase';

interface RefreshAnalyticsProps {
  appId: string;
  blockchain: Blockchains;
  contractAddress: string;
  environment: Environments;
}

interface RefreshAnalyticsResponse {
  lastRefreshDateUTC: number;
}

export const refreshAnalytics = async ({
  appId,
  blockchain,
  contractAddress,
  environment,
}: RefreshAnalyticsProps): Promise<RefreshAnalyticsResponse> => {
  try {
    logger.logInfo('refreshAnalytics', 'Begin');

    if (!blockchain || !contractAddress || !environment) {
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${localStorageHelper.getAuthToken()}` },
    };

    const response = await axios.post<ApiRefreshAnalyticsResponse>(
      '/api/analytics/refresh',
      {
        appId,
        blockchain,
        contractAddress,
        environment,
      },
      config,
    );

    if (response.status !== 200 || !response.data) {
      return null;
    }

    return {
      lastRefreshDateUTC: response.data?.analyticsStats?.lastRefreshDateUTC || 0,
    };
  } catch (e) {
    logger.logError('refreshAnalytics', 'Failed', e);
    return null;
  }
};

export interface FetchAnalyticsTransactionsProps {
  appId: string;
  blockchain: Blockchains;
  environment: Environments;
  contractAddress: string;
  startTimestamp: number;
  endTimestamp: number;
}

export const fetchAnalyticsTransactions = async ({
  appId,
  blockchain,
  contractAddress,
  environment,
  startTimestamp,
  endTimestamp,
}: FetchAnalyticsTransactionsProps): Promise<AnalyticsTransaction[] | null> => {
  try {
    logger.logInfo('fetchAnalyticsTransactions', 'Begin');

    const params = {
      appId,
      blockchain,
      contractAddress,
      environment,
      startTimestamp: startTimestamp.toString(),
      endTimestamp: endTimestamp.toString(),
    };

    const config = {
      headers: { Authorization: `Bearer ${localStorageHelper.getAuthToken()}` },
    };

    const urlParams = new URLSearchParams(params);
    const response = await axios.get<AnalyticsTransaction[]>(`/api/analytics/data?${urlParams.toString()}`, config);

    return response.data;
  } catch (e) {
    logger.logError('fetchAnalyticsTransactions', 'Failed', e);
    return null;
  }
};
