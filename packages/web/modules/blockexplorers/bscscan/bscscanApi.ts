import { Environments } from '@core/enums/environments';
import axios from 'axios';
import { MAINNET_API_URL, TESTNET_API_URL } from './constants';
import logger from '@core/logger/logger';
import { Config } from '@core/config/config';
import { getCurrentTimestampInSeconds } from '@core/helpers/datetimeHelper';
import { Blockchains } from '@core/enums/blockchains';
import { AnalyticsData, AnalyticsTransaction, AnalyticsTransactionData } from '@modules/firebase';

interface TransactionsResponse {
  status: string;
  message: string;
  result: TransactionItem[];
}

interface TransactionItem {
  blockNumber: string;
  blockHash: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  methodId: string;
  functionName: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  txreceipt_status: string;
  gasUsed: string;
  confirmations: string;
  isError: string;
}

interface LatestBlockResponse {
  status: string;
  message: string;
  result: string;
}

class BscScanApi {
  fetchTransactionsByAddress = async (
    environment: Environments,
    address: string,
    startBlock: number,
    endBlock: number,
  ): Promise<TransactionsResponse> => {
    try {
      logger.logInfo('bscscanApi.fetchTransactionsByAddress', 'Begin');

      const host =
        environment === Environments.Testnet
          ? TESTNET_API_URL
          : environment === Environments.Mainnet
          ? MAINNET_API_URL
          : null;

      const params = {
        module: 'account',
        action: 'txlist',
        address,
        startblock: startBlock.toString(),
        endblock: endBlock.toString(),
        // page: '1',
        // offset: '10',
        sort: 'asc',
        apikey: Config.bscscanApiKey,
      };

      const urlParams = new URLSearchParams(params);
      const apiUrl = `${host}?${urlParams.toString()}`;

      const response = await axios.get<TransactionsResponse>(apiUrl);

      if (response.status !== 200) {
        logger.logError('fetchTransactionsByAddress', response.statusText);
      }

      return response.data;
    } catch {
      return null;
    }
  };

  fetchLatestBlock = async (environment: Environments): Promise<LatestBlockResponse> => {
    try {
      logger.logInfo('bscscanApi.fetchLatestBlock', 'Begin');

      const host =
        environment === Environments.Testnet
          ? TESTNET_API_URL
          : environment === Environments.Mainnet
          ? MAINNET_API_URL
          : null;

      const timestamp = getCurrentTimestampInSeconds();

      const params = {
        module: 'block',
        action: 'getblocknobytime',
        timestamp: timestamp.toString(),
        closest: 'before',
        apikey: Config.bscscanApiKey,
      };

      const urlParams = new URLSearchParams(params);
      const apiUrl = `${host}?${urlParams.toString()}`;

      const response = await axios.get<LatestBlockResponse>(apiUrl);

      if (response.status !== 200) {
        logger.logError('bscscanApi.fetchLatestBlock', response.statusText);
      }

      return response.data;
    } catch {
      return null;
    }
  };

  adaptAnalyticsData = (
    data: TransactionItem[],
    appId: string,
    blockchain: Blockchains,
    environment: Environments,
    contractAddress: string,
    fetchTime: number,
    startBlock: number,
    endBlock: number,
  ): AnalyticsData => {
    if (!data || data.length === 0) {
      return null;
    }

    const result: AnalyticsData = {
      appId,
      blockchain,
      environment,
      contractAddress,
      fetchTimeUTC: fetchTime,
      startBlock,
      endBlock,
      transactions: [],
    };

    data.forEach((element) => {
      const transaction: AnalyticsTransaction = {
        transactionHash: element.hash,
        dateTimeUTC: Number(element.timeStamp),
        data: {
          ...element,
          functionName: element.to === '' ? 'Contract Creation' : element.functionName,
        } as AnalyticsTransactionData,
      };

      result.transactions.push(transaction);
    });

    return result;
  };
}

export default new BscScanApi();
