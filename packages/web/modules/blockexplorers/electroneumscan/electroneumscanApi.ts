// Reference doc: https://blockexplorer.thesecurityteam.rocks/api-docs#transaction

import { Environments } from '@core/enums/environments';
import axios from 'axios';
import { MAINNET_API_URL, TESTNET_API_URL } from './constants';
import logger from '@core/logger/logger';
import { Config } from '@core/config/config';
import { getCurrentTimestampInSeconds } from '@core/helpers/datetimeHelper';
import { Blockchains } from '@core/enums/blockchains';
import { AnalyticsData, AnalyticsTransaction, AnalyticsTransactionData } from '@modules/firebase';

interface TransactionsResponse {
  message: string;
  result: TransactionItem[];
  status: string;
}

interface TransactionItem {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  isError: string;
  nonce: string;
  timeStamp: string;
  to: string;
  transactionIndex: string;
  txreceipt_status: string;
  value: string;
}

interface LatestBlockResponse {
  jsonrpc: string;
  result: string;
  id: number;
}

class ElectroneumScanApi {
  fetchTransactionsByAddress = async (
    environment: Environments,
    address: string,
    startBlock: number,
    endBlock: number,
  ): Promise<TransactionsResponse> => {
    try {
      logger.logInfo('electroneumscanApi.fetchTransactionsByAddress', 'Begin');

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
        sort: 'asc',
      };

      const urlParams = new URLSearchParams(params);
      const apiUrl = `${host}?${urlParams.toString()}`;

      const response = await axios.get<TransactionsResponse>(apiUrl);

      if (response.status !== 200) {
        logger.logError('fetchTransactionsByAddress', response.statusText);
      }

      return response.data;
    } catch (e) {
      logger.logError('fetchTransactionsByAddress', 'Failed', e);
      return null;
    }
  };

  fetchLatestBlock = async (environment: Environments): Promise<LatestBlockResponse> => {
    try {
      logger.logInfo('electroneumscanApi.fetchLatestBlock', 'Begin');

      const host =
        environment === Environments.Testnet
          ? TESTNET_API_URL
          : environment === Environments.Mainnet
          ? MAINNET_API_URL
          : null;

      const timestamp = getCurrentTimestampInSeconds();

      const params = {
        module: 'block',
        action: 'eth_block_number',
      };

      const urlParams = new URLSearchParams(params);
      const apiUrl = `${host}?${urlParams.toString()}`;

      const response = await axios.get<LatestBlockResponse>(apiUrl);

      if (response.status !== 200) {
        logger.logError('electroneumscanApi.fetchLatestBlock', response.statusText);
      }

      return response.data;
    } catch (e) {
      logger.logError('electroneumscanApi.fetchLatestBlock', 'Failed', e);
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
          blockNumber: element.blockNumber || null,
          blockHash: element.blockHash,
          timeStamp: element.timeStamp,
          hash: element.hash || null,
          from: element.from || null,
          to: element.to || null,
          value: element.value || null,
          gas: element.gas || null,
          gasPrice: element.gasPrice || null,
          gasUsed: element.gasUsed || null,
          methodId: null,
          functionName: element.to === '' ? 'Contract Creation' : "Transfer",
          contractAddress: contractAddress || null,
          cumulativeGasUsed: element.cumulativeGasUsed || null,
          txreceipt_status: 'Confirmed',
          isError: element.isError,
        } as AnalyticsTransactionData,
      };

      result.transactions.push(transaction);
    });

    return result;
  };
}

export default new ElectroneumScanApi();
