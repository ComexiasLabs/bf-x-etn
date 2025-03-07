import { Blockchains } from '@core/enums/blockchains';
import { Environments } from '@core/enums/environments';

export interface AnalyticsData {
  appId: string;
  blockchain: Blockchains;
  environment: Environments;
  contractAddress: string;
  fetchTimeUTC: number;
  startBlock: number;
  endBlock: number;
  transactions: AnalyticsTransaction[];
}

export interface AnalyticsTransaction {
  transactionHash: string;
  dateTimeUTC: number;
  data: AnalyticsTransactionData;
}

export interface AnalyticsTransactionData {
  blockNumber: string;
  blockHash: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  methodId: string;
  functionName: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  txreceipt_status: string;
  // input: string;
  // confirmations: string;
  // nonce: string;
  // transactionIndex: string;
  isError: string;
}
