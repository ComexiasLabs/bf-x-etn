import { Blockchains } from '@core/enums/blockchains';
import { Environments } from '@core/enums/environments';

export interface AnalyticsStats {
  appId: string;
  blockchain: Blockchains;
  environment: Environments;
  contractAddress: string;
  lastRefreshBlock: number;
  lastRefreshDateUTC: number;
}
