import { Environments } from '@core/enums/environments';
import { AnalyticsData } from '@modules/firebase';

export interface AnalyticsRequest {
  appId: string;
  environment: Environments;
  contractAddress: string;
  currentTime: number;
  startBlock?: number;
}

export interface AnalyticsResponse {
  analyticsData: AnalyticsData;
  endBlock: number;
}

export abstract class BaseBlockExplorer {
  abstract getAnalytics(request: AnalyticsRequest): Promise<AnalyticsResponse>;
}
