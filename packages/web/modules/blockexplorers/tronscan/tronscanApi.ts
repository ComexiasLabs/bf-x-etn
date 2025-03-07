import { Environments } from '@core/enums/environments';
import axios from 'axios';
import logger from '@core/logger/logger';
import { getCurrentTimestampInSeconds } from '@core/helpers/datetimeHelper';
import { MAINNET_API_URL, TESTNET_API_URL } from './constants';
import { Blockchains } from '@core/enums/blockchains';
import { AnalyticsData, AnalyticsTransaction, AnalyticsTransactionData } from '@modules/firebase';

interface TransactionsResponse {
  total: number;
  rangeTotal: number;
  data: TransactionItem[];
  contractInfo: unknown;
}

interface TransactionItem {
  block: number;
  hash: string;
  timestamp: number;
  ownerAddress: string;
  toAddressList: string[];
  toAddress: string;
  contractType: number;
  confirmed: boolean;
  revert: boolean;
  // contractData: ContractData;
  SmartCalls: string;
  Events: string;
  id: string;
  data: string;
  fee: string;
  contractRet: string;
  result: string;
  amount: string;
  cheatStatus: boolean;
  cost: {
    net_fee: number;
    energy_penalty_total: number;
    energy_usage: number;
    fee: number;
    energy_fee: number;
    energy_usage_total: number;
    origin_energy_usage: number;
    net_usage: number;
  };
  tokenInfo: {
    tokenId: string;
    tokenAbbr: string;
    tokenName: string;
    tokenDecimal: number;
    tokenCanShow: number;
    tokenType: string;
    tokenLogo: string;
    tokenLevel: string;
    vip: boolean;
  };
  tokenType: string;
  trigger_info?: {
    method: string;
    data: string;
    parameter: {
      conversationType?: string;
      conversationId?: string;
    };
    methodId: string;
    methodName: string;
    contract_address: string;
    call_value: number;
  };
  riskTransaction: boolean;
}

interface LatestBlockResponse {
  number: number;
  hash: string;
  size: number;
  timestamp: number;
  txTrieRoot: string;
  parentHash: string;
  witnessId: number;
  witnessAddress: string;
  nrOfTrx: number;
  witnessName: string;
  version: string;
  fee: number;
  confirmed: boolean;
  confirmations: number;
  netUsage: number;
  energyUsage: number;
  blockReward: number;
  voteReward: number;
  revert: boolean;
}

interface TransactionInfoResponse {
  info: {
    contract_info: {
      balance: number;
      date_created: number;
      consume_user_resource_percent: number;
      name: string;
      owner_address: string;
      contract_address: string;
      confirmed: boolean;
      trxCount: number;
    };
    contract_address: string;
  };
}

class TronScanApi {
  fetchTransactionsByAddress = async (
    environment: Environments,
    address: string,
    startBlock: number,
    endBlock: number,
  ): Promise<TransactionsResponse> => {
    try {
      logger.logInfo('tronscanApi.fetchTransactionsByAddress', 'Begin', { environment, address, startBlock, endBlock });

      const host =
        environment === Environments.Testnet
          ? TESTNET_API_URL
          : environment === Environments.Mainnet
          ? MAINNET_API_URL
          : null;

      // Ref: https://docs.tronscan.org/api-endpoints/transactions-and-transfers#get-a-list-of-transactions
      const params = {
        sort: '-timestamp',
        count: 'true',
        limit: '60',
        start: '0',
        // start_timestamp: '1529856000000',
        // end_timestamp: '1680503191391',
        address,
      };

      // Testnet: https://nileapi.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=TRaGggHkr9YVswe3e5ZYCit1rdSCKXaoN6
      // Mainnet: https://apilist.tronscanapi.com/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=TSirzn8bNjqQsfKokKpGrz3LtfLuoBkuRg
      const urlParams = new URLSearchParams(params);
      const apiUrl = `${host}/transaction?${urlParams.toString()}`;

      const response = await axios.get<TransactionsResponse>(apiUrl);

      if (response.status !== 200) {
        logger.logError('tronscanApi.fetchTransactionsByAddress', response.statusText);
      }

      // Take only records between the start and end block
      // TODO: This implementation is temporary, ideally we should convert use the start and end time and let TronScanApi handle the filtering
      response.data.data = response.data.data.filter((item) => item.block >= startBlock);
      if (endBlock > 0) {
        response.data.data = response.data.data.filter((item) => item.block <= endBlock);
      }

      return response.data;
    } catch (e) {
      logger.logError('tronscanApi.fetchTransactionsByAddress', e);
      return null;
    }
  };

  fetchLatestBlock = async (environment: Environments): Promise<LatestBlockResponse> => {
    try {
      logger.logInfo('tronscanApi.fetchLatestBlock', 'Begin');

      const host =
        environment === Environments.Testnet
          ? TESTNET_API_URL
          : environment === Environments.Mainnet
          ? MAINNET_API_URL
          : null;

      const timestamp = getCurrentTimestampInSeconds();

      const params = {
        start: '0',
        limit: '1',
      };

      const urlParams = new URLSearchParams(params);
      const apiUrl = `${host}/block?${urlParams.toString()}`;

      const response = await axios.get<LatestBlockResponse>(apiUrl);

      if (response.status !== 200) {
        logger.logError('tronscanApi.fetchLatestBlock', response.statusText);
      }

      return response && response.data && response.data[0];
    } catch (e) {
      logger.logError('tronscanApi.fetchLatestBlock', e);
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
        dateTimeUTC: Number(element.timestamp) / 1000,
        data: {
          blockNumber: element.block?.toString() || null,
          blockHash: '',
          timeStamp: element.timestamp ? (Number(element.timestamp) / 1000).toString() : null,
          hash: element.hash || null,
          from: element.ownerAddress || null,
          to: element.toAddress || null,
          value: element.amount || null,
          gas: element.cost?.energy_fee?.toString() || null,
          gasPrice: element.cost?.fee?.toString() || null,
          gasUsed: element.cost?.energy_usage_total?.toString() || null,
          methodId: element.trigger_info?.methodId || null,
          functionName: element.trigger_info?.methodName ?? 'Contract Creation',
          contractAddress: contractAddress || null,
          cumulativeGasUsed: element.cost?.energy_usage_total?.toString() || null,
          txreceipt_status: 'Confirmed',
          isError: element.result === 'SUCCESS' ? 'false' : 'true',
        } as AnalyticsTransactionData,
      };

      result.transactions.push(transaction);
    });

    return result;
  };

  fetchTransactionInfo = async (
    environment: Environments,
    transactionHash: string,
  ): Promise<TransactionInfoResponse> => {
    try {
      logger.logInfo('tronscanApi.fetchTransactionInfo', 'Begin');

      const host =
        environment === Environments.Testnet
          ? TESTNET_API_URL
          : environment === Environments.Mainnet
          ? MAINNET_API_URL
          : null;

      const params = {
        hash: transactionHash,
      };

      // https://nileapi.tronscan.org/api/transaction-info?hash=17e84247a31622392e8948379083942bdb259452453723cd76a94d8d3838b194
      const urlParams = new URLSearchParams(params);
      const apiUrl = `${host}/transaction-info?${urlParams.toString()}`;

      const response = await axios.get<TransactionInfoResponse>(apiUrl);

      if (response.status !== 200) {
        logger.logError('tronscanApi.fetchTransactionInfo', response.statusText);
      }

      return response && response.data;
    } catch (e) {
      logger.logError('tronscanApi.fetchTransactionInfo', e);
      return null;
    }
  };
}

export default new TronScanApi();
