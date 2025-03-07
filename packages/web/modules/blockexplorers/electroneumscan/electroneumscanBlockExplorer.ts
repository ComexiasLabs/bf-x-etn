import { AnalyticsRequest, AnalyticsResponse, BaseBlockExplorer } from '../base/baseBlockExplorer';
import ElectroneumScanApi from './electroneumscanApi';
import logger from '@core/logger/logger';
import { Blockchains } from '@core/enums/blockchains';

export class ElectroneumScanBlockExplorer extends BaseBlockExplorer {
  private blockchain = Blockchains.BNBChain;

  async getAnalytics(request: AnalyticsRequest): Promise<AnalyticsResponse> {
    const { appId, environment, contractAddress, currentTime, startBlock = 0 } = request;

    // Get latest block
    const latestBlockResponse = await ElectroneumScanApi.fetchLatestBlock(environment);
    const endBlock = latestBlockResponse.result ? parseInt(latestBlockResponse.result, 16) : 0;

    // Fetch new blocks from scanner API
    // const data = await ElectroneumScanApi.fetchTransactionsByAddress(environment, contractAddress, startBlock, endBlock);
    const data = await ElectroneumScanApi.fetchTransactionsByAddress(environment, contractAddress, 0, endBlock);

    if (data.status !== '1' && data.message !== 'No transactions found') {
      logger.logError('apiRefreshAnalytics', 'Failed', { status: data.status, message: data.message });
      return;
    }

    // Adapt data
    const analyticsData = ElectroneumScanApi.adaptAnalyticsData(
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
