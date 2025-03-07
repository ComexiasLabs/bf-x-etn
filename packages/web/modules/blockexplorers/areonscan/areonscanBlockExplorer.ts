import { AnalyticsRequest, AnalyticsResponse, BaseBlockExplorer } from '../base/baseBlockExplorer';
import AreonScanApi from './areonscanApi';
import logger from '@core/logger/logger';
import { Blockchains } from '@core/enums/blockchains';

export class AreonScanBlockExplorer extends BaseBlockExplorer {
  private blockchain = Blockchains.BNBChain;

  async getAnalytics(request: AnalyticsRequest): Promise<AnalyticsResponse> {
    const { appId, environment, contractAddress, currentTime, startBlock = 0 } = request;

    // Note: AreonScan API doc is currently unavailable, so there is no known option to fetch transactions by blocks
    // Current solution is to fetch all transactions and then filter them here

    // Fetch new blocks from scanner API
    const data = await AreonScanApi.fetchTransactionsByAddress(environment, contractAddress);
    if (!data.success) {
      logger.logError('apiRefreshAnalytics', 'Failed', { success: data.success });
      return;
    }

    // Filter transactions based on the block_number condition
    if (startBlock > 0) {
      data.result.transactions = data.result.transactions.filter(
        (transaction) => parseInt(transaction.block_number) > startBlock,
      );
    }

    // Find the maximum block_number
    const endBlock = data.result.transactions.reduce((max, transaction) => {
      const blockNumber = parseInt(transaction.block_number);
      return blockNumber > max ? blockNumber : max;
    }, 0);

    // Adapt data
    const analyticsData = AreonScanApi.adaptAnalyticsData(
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
