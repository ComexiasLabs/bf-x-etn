import { Environments } from '@core/enums/environments';
import Web3 from 'web3';
import { FantomNetworks, FantomWallet } from './types';
import {
  MAINNET_BLOCK_EXPLORER_ADDRESS_URL,
  MAINNET_BLOCK_EXPLORER_TX_URL,
  MAINNET_RPC,
  TESTNET_RPC,
  TESTNET_BLOCK_EXPLORER_ADDRESS_URL,
  TESTNET_BLOCK_EXPLORER_TX_URL,
  MAINNET_CHAINID,
  TESTNET_CHAINID,
} from './constants';
import { BaseEthereumProvider } from '../base/baseProvider';

declare let window: any;

export class FantomProvider extends BaseEthereumProvider {
  constructor() {
    super({
      mainnetExplorerAddressURL: MAINNET_BLOCK_EXPLORER_ADDRESS_URL,
      testnetExplorerAddressURL: TESTNET_BLOCK_EXPLORER_ADDRESS_URL,
      mainnetExplorerTxURL: MAINNET_BLOCK_EXPLORER_TX_URL,
      testnetExplorerTxURL: TESTNET_BLOCK_EXPLORER_TX_URL,
      mainnetRPC: MAINNET_RPC,
      testnetRPC: TESTNET_RPC,
    });
  }

  getConnectedNetwork(): string {
    if (window.ethereum.networkVersion === MAINNET_CHAINID) {
      return FantomNetworks.Mainnet;
    } else if (window.ethereum.networkVersion === TESTNET_CHAINID) {
      return FantomNetworks.Testnet;
    } else {
      return null;
    }
  }

  getConnectedEnvironment(): Environments {
    if (window.ethereum.networkVersion === MAINNET_CHAINID) {
      Environments.Mainnet;
    } else if (window.ethereum.networkVersion === TESTNET_CHAINID) {
      Environments.Testnet;
    } else {
      return null;
    }
  }

  isConnectedToEnvironment(environment: Environments): boolean {
    const connectedEnvironment = this.getConnectedNetwork();
    if (environment === Environments.Testnet && connectedEnvironment === FantomNetworks.Testnet) {
      return true;
    }
    if (environment === Environments.Mainnet && connectedEnvironment === FantomNetworks.Mainnet) {
      return true;
    }

    return false;
  }
}
