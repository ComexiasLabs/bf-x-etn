import { Blockchains } from '@core/enums/blockchains';
import { FantomNetworks } from '@modules/blockchains/fantom';
import { BscNetworks } from './bsc';
import { TronNetworks } from './tron';
import { AreonNetworks } from './areon';
import { ElectroneumNetworks } from './electroneum';

const blockchainNetworks = {
  testnet: {
    [Blockchains.Fantom]: FantomNetworks.Testnet,
    [Blockchains.BNBChain]: BscNetworks.Testnet,
    [Blockchains.TRON]: TronNetworks.Testnet,
    [Blockchains.Areon]: AreonNetworks.Testnet,
    [Blockchains.Electroneum]: ElectroneumNetworks.Testnet,
  },
  mainnet: {
    [Blockchains.Fantom]: FantomNetworks.Mainnet,
    [Blockchains.BNBChain]: BscNetworks.Mainnet,
    [Blockchains.TRON]: TronNetworks.Mainnet,
    [Blockchains.Areon]: AreonNetworks.Mainnet,
    [Blockchains.Electroneum]: ElectroneumNetworks.Mainnet,
  },
};

export const getBlockchainNetwork = (blockchain: Blockchains, environment: string): FantomNetworks | null => {
  return blockchainNetworks[environment]?.[blockchain] || null;
};

const blockchainNetworkLabels = {
  testnet: {
    [Blockchains.Fantom]: 'Fantom Testnet',
    [Blockchains.BNBChain]: 'BNB Smart Chain Testnet',
    [Blockchains.TRON]: 'TRON Testnet',
    [Blockchains.Areon]: 'Areon Testnet',
    [Blockchains.Electroneum]: 'Electroneum Testnet',
  },
  mainnet: {
    [Blockchains.Fantom]: 'Fantom Mainnet',
    [Blockchains.BNBChain]: 'BNB Smart Chain Mainnet',
    [Blockchains.TRON]: 'TRON Mainnet',
    [Blockchains.Areon]: 'Areon Mainnet',
    [Blockchains.Electroneum]: 'Electroneum Mainnet',
  },
};

export const getBlockchainNetworkLabel = (blockchain: Blockchains, environment: string): string => {
  return blockchainNetworkLabels[environment]?.[blockchain] || '';
};

export const getBlockchainLogoImage = (blockchain: Blockchains): string => {
  switch (blockchain) {
    case Blockchains.Fantom:
      return '/assets/brands/fantom-logo-round.svg';
    case Blockchains.BNBChain:
      return '/assets/brands/bnb-logo.svg';
    case Blockchains.TRON:
      return '/assets/brands/tron-trx-logo.svg';
    case Blockchains.Areon:
      return '/assets/brands/areon-logo-round.svg';
    case Blockchains.Electroneum:
      return '/assets/brands/electroneum-etn-logo.svg';
    default:
      return '';
  }
};

export const maskWalletAddress = (address: string): string => {
  if (address.length <= 10) {
    return address;
  }
  const start = address.substring(0, 6);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
};

export const shortenHash = (hash: string, startLength = 6, endLength = 4): string => {
  return hash ? `${hash.substring(0, startLength)}...${hash.substring(hash.length - endLength)}` : '';
};
