import { Blockchains } from '@core/enums/blockchains';
import { Environments } from '@core/enums/environments';

export interface App {
  appId: string;
  name: string;
  description: string;
  status: AppStatuses;
  createdDateUTC: number;
  userId: string;
  appCreationMode: AppCreationModes;
  appCreationSource?: AppCreationSource;
  contractCode?: string;
  contractAbi?: any;
  contractByteCode?: string;
  deployments?: ContractDeployments[];
  aiCodeReview?: string;
  aiSecurityReview?: string;
}

export interface AppCreationSource {
  templateId?: string;
  templateName?: string;
  githubUrl?: string;
  transactionHashTestnet?: string;
  transactionHashMainnet?: string;
  contractAddressTestnet?: string;
  contractAddressMainnet?: string;
}

export interface ContractDeployments {
  blockchain: Blockchains;
  environment: Environments;
  walletAddress: string;
  transactionHash?: string;
  contractAddress?: string;
  createdDateUTC: number;
}

export enum AppCreationModes {
  Uninitialized = 'Uninitialized',
  Template = 'Template',
  Import = 'Import',
  GitHub = 'GitHub',
  Generated = 'Generated',
}

export enum AppStatuses {
  PendingContract = 'PendingContract',
  Compiled = 'Compiled',
  Deployed = 'Deployed',
}
