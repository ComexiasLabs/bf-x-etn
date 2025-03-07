import { Environments } from '@core/enums/environments';
import axios from 'axios';
import { MAINNET_API_URL, TESTNET_API_URL } from './constants';
import logger from '@core/logger/logger';
import { Config } from '@core/config/config';
import { getCurrentTimestampInSeconds } from '@core/helpers/datetimeHelper';
import { Blockchains } from '@core/enums/blockchains';
import { AnalyticsData, AnalyticsTransaction, AnalyticsTransactionData } from '@modules/firebase';

interface TransactionsResponse {
  success: boolean;
  result: ContractInfo;
}

interface ContractInfo {
  compiler_version: string;
  optimization: boolean;
  source_code: string;
  abi: string;
  address: string;
  is_verified: boolean;
  block_number: string;
  deployer: string;
  tx_hash: string;
  contract_bytecode: string;
  contract_name: string;
  contract_symbol: string;
  contract_total_supply: string;
  contract_arc_type: string;
  areaBalance: string;
  count: number;
  transactions: Transaction[];
}

interface Transaction {
  id: number;
  tx_hash: string;
  from_address: string;
  to_address: string;
  coin_amount: string;
  coin_amountdec: string;
  block_number: string;
  timestamp: string;
  block_hash: string;
  gas_price: string;
  gas_limit: string;
  nonce: string;
  txn_type: string;
  txn_index: string;
  tx_fee: string;
  tx_priority_fee: string;
  token_amount: string;
  tx_spec: string;
  contract_address: string;
  tx_status: string;
  tx_arc_type: string;
  tx_data: string;
  tx_errors: string;
}

class AreonScanApi {
  fetchTransactionsByAddress = async (environment: Environments, address: string): Promise<TransactionsResponse> => {
    try {
      logger.logInfo('AreonScanApi.fetchTransactionsByAddress', 'Begin');

      const host =
        environment === Environments.Testnet
          ? TESTNET_API_URL
          : environment === Environments.Mainnet
          ? MAINNET_API_URL
          : null;

      // https://api.areonscan.com/main/contract/0x76bcab80e70a863bca64773bfc93da845bcd16b1?page=0
      const params = {
        // page: '0'
      };
      const urlParams = new URLSearchParams(params);
      const apiUrl = `${host}/contract/${address}?${urlParams.toString()}`;

      const response = await axios.get<TransactionsResponse>(apiUrl);

      if (response.status !== 200) {
        logger.logError('fetchTransactionsByAddress', response.statusText);
      }

      return response.data;
    } catch {
      return null;
    }
  };

  adaptAnalyticsData = (
    data: ContractInfo,
    appId: string,
    blockchain: Blockchains,
    environment: Environments,
    contractAddress: string,
    fetchTime: number,
    startBlock: number,
    endBlock: number,
  ): AnalyticsData => {
    if (!data) {
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

    data.transactions.forEach((element: Transaction) => {
      const transaction: AnalyticsTransaction = {
        transactionHash: element.tx_hash,
        dateTimeUTC: Number(element.timestamp),
        data: {
          blockNumber: element.block_number,
          blockHash: element.block_hash,
          timeStamp: element.timestamp,
          hash: element.tx_hash,
          from: element.from_address,
          to: element.to_address,
          value: element.token_amount,
          gas: element.gas_limit,
          gasPrice: element.gas_price,
          gasUsed: element.tx_fee,
          methodId: element.tx_spec,
          functionName: element.tx_spec,
          contractAddress: element.contract_address,
          cumulativeGasUsed: element.tx_fee,
          txreceipt_status: element.tx_status,
          isError: element.tx_errors,
        },
      };

      result.transactions.push(transaction);
    });

    return result;
  };
}

export default new AreonScanApi();
