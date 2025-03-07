import { Blockchains } from '@core/enums/blockchains';
import { FantomProvider } from './fantom/provider';
import { BscProvider } from './bsc/provider';
import { TronProvider } from './tron/provider';
import { AreonProvider } from './areon/provider';
import { ElectroneumProvider } from './electroneum/provider';
import { Environments } from '@core/enums/environments';

export const createBlockchainProvider = (blockchain: Blockchains) => {
  if (blockchain === Blockchains.Fantom) {
    return new FantomProvider();
  }
  if (blockchain === Blockchains.BNBChain) {
    return new BscProvider();
  }
  if (blockchain === Blockchains.TRON) {
    return new TronProvider();
  }
  if (blockchain === Blockchains.Areon) {
    return new AreonProvider();
  }
  if (blockchain === Blockchains.Electroneum) {
    return new ElectroneumProvider();
  }

  throw new Error('Unable to create provider. Unrecognized blockchain.');
};

export const getExplorerAddressUrl = (blockchain: Blockchains, environment: Environments, hash: string): string => {
  if (!blockchain) {
    return '';
  }

  const blockchainProvider = createBlockchainProvider(blockchain);
  return blockchainProvider.getExplorerAddressUrl(environment, hash);
};

export const getExplorerTxUrl = (blockchain: Blockchains, environment: Environments, hash: string): string => {
  if (!blockchain) {
    return '';
  }

  const blockchainProvider = createBlockchainProvider(blockchain);
  return blockchainProvider.getExplorerTxUrl(environment, hash);
};
