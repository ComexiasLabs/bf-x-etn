import { AnalyticsRequest, AnalyticsResponse, BaseBlockExplorer } from '../base/baseBlockExplorer';
import TronScanApi from './tronscanApi';
import logger from '@core/logger/logger';
import { Blockchains } from '@core/enums/blockchains';

export class TronScanBlockExplorer extends BaseBlockExplorer {
  private blockchain = Blockchains.TRON;

  async getAnalytics(request: AnalyticsRequest): Promise<AnalyticsResponse> {
    const { appId, environment, contractAddress, currentTime, startBlock = 0 } = request;

    // Get latest block
    const latestBlockResponse = await TronScanApi.fetchLatestBlock(environment);
    const endBlock = latestBlockResponse ? Number(latestBlockResponse.number) : 0;

    // Fetch new blocks from scanner API
    const data = await TronScanApi.fetchTransactionsByAddress(environment, contractAddress, startBlock, endBlock);
    if (!data.total) {
      logger.logError('apiRefreshAnalytics', 'Failed to fetch transactions.');
      return;
    }

    // Adapt data
    const analyticsData = TronScanApi.adaptAnalyticsData(
      data.data,
      appId,
      this.blockchain,
      environment,
      contractAddress,
      currentTime,
      startBlock,
      endBlock,
    );

    const result: AnalyticsResponse = {
      analyticsData,
      endBlock,
    };

    return result;
  }
}
