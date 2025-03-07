import { AnalyticsRequest, AnalyticsResponse, BaseBlockExplorer } from '../base/baseBlockExplorer';
import BscScanApi from './bscscanApi';
import logger from '@core/logger/logger';
import { Blockchains } from '@core/enums/blockchains';

export class BscScanBlockExplorer extends BaseBlockExplorer {
  private blockchain = Blockchains.BNBChain;

  async getAnalytics(request: AnalyticsRequest): Promise<AnalyticsResponse> {
    const { appId, environment, contractAddress, currentTime, startBlock = 0 } = request;

    // Get latest block
    const latestBlockResponse = await BscScanApi.fetchLatestBlock(environment);
    const endBlock = latestBlockResponse.status === '1' ? Number(latestBlockResponse.result) : 0;

    // Fetch new blocks from scanner API
    const data = await BscScanApi.fetchTransactionsByAddress(environment, contractAddress, startBlock, endBlock);
    if (data.status !== '1' && data.message !== 'No transactions found') {
      logger.logError('apiRefreshAnalytics', 'Failed', { status: data.status, message: data.message });
      return;
    }

    // Adapt data
    const analyticsData = BscScanApi.adaptAnalyticsData(
      data.result,
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
