import { Environments } from '@core/enums/environments';
import { TronNetworks, TronWallet } from './types';
import {
  MAINNET_BLOCK_EXPLORER_ADDRESS_URL,
  MAINNET_BLOCK_EXPLORER_TX_URL,
  MAINNET_RPC,
  TESTNET_RPC,
  TESTNET_BLOCK_EXPLORER_ADDRESS_URL,
  TESTNET_BLOCK_EXPLORER_TX_URL,
  TESTNET_NILE_RPC,
  TESTNET_SHASTA_RPC,
} from './constants';
import { BaseTronProvider } from '../base/baseTronProvider';

declare let window: any;

export class TronProvider extends BaseTronProvider {
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

  getConnectedNetwork(): string | null {
    if (window.tronWeb && window.tronWeb.fullNode.host === MAINNET_RPC) {
      return TronNetworks.Mainnet;
    } else if (window.tronWeb && window.tronWeb.fullNode.host === TESTNET_NILE_RPC) {
      return TronNetworks.Testnet;
    } else if (window.tronWeb && window.tronWeb.fullNode.host === TESTNET_SHASTA_RPC) {
      return TronNetworks.TestnetShasta;
    } else {
      return null;
    }
  }

  getConnectedEnvironment(): Environments | null {
    if (window.tronWeb && window.tronWeb.fullNode.host === MAINNET_RPC) {
      return Environments.Mainnet;
    } else if (window.tronWeb && window.tronWeb.fullNode.host === TESTNET_RPC) {
      return Environments.Testnet;
    } else {
      return null;
    }
  }

  isConnectedToEnvironment(environment: Environments): boolean {
    const connectedEnvironment = this.getConnectedNetwork();
    if (environment === Environments.Testnet && connectedEnvironment === TronNetworks.Testnet) {
      console.log(
        `[isConnectedToEnvironment]: ${
          environment === Environments.Testnet && connectedEnvironment === TronNetworks.Testnet
        }`,
      );
      return true;
    }
    if (environment === Environments.Mainnet && connectedEnvironment === TronNetworks.Mainnet) {
      return true;
    }

    return false;
  }
}
