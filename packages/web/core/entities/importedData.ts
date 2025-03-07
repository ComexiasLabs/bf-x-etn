import { TransactionInfo } from '@modules/blockchains/base/baseProvider';

export interface ImportedData {
  canProceed: boolean;
  testnet?: {
    txHash: string;
    isSuccessful: boolean;
    data?: TransactionInfo;
  };
  mainnet?: {
    txHash: string;
    isSuccessful: boolean;
    data?: TransactionInfo;
  };
}
