import { Environments } from '@core/enums/environments';
import TronWeb from 'tronweb';
import logger from '@core/logger/logger';
import TronScanApi from '@modules/blockexplorers/tronscan/tronscanApi';

declare let window: any;

type ProviderConfig = {
  mainnetExplorerAddressURL: string;
  testnetExplorerAddressURL: string;
  mainnetExplorerTxURL: string;
  testnetExplorerTxURL: string;
  mainnetRPC: string;
  testnetRPC: string;
};

export interface BlockchainWallet {
  address: string;
  environment: Environments;
}

export interface TransactionInfo {
  transactionHash: string;
  walletAddress: string;
  dateTime: Date;
  contractAddress: string;
}

export abstract class BaseTronProvider {
  protected providerConfig: ProviderConfig;

  constructor(providerConfig: ProviderConfig) {
    this.providerConfig = providerConfig;
  }

  getProvider = (): any => {
    return window.tronWeb;
  };

  isProviderAvailable = (): boolean => {
    return !!window.tronWeb;
  };

  connectWallet = async () => {
    await window.tronLink?.request({ method: 'tron_requestAccounts' });
  };

  isWalletReady = (): boolean => {
    return !!window.tronWeb && window.tronWeb.defaultAddress.base58;
  };

  isWalletConnected = (): boolean => {
    return !!window.tronWeb && !!window.tronWeb.defaultAddress.base58;
  };

  getWallet = async (): Promise<BlockchainWallet | null> => {
    if (this.isWalletConnected()) {
      return {
        address: window.tronWeb.defaultAddress.base58,
        environment: this.getConnectedEnvironment(),
      };
    } else {
      return null;
    }
  };

  abstract getConnectedNetwork(): string;
  abstract getConnectedEnvironment(): Environments;
  abstract isConnectedToEnvironment(environment: Environments): boolean;

  getExplorerAddressUrl = (environment: Environments, hash: string): string => {
    if (environment === Environments.Testnet) {
      return this.providerConfig.testnetExplorerAddressURL.replace('{{hash}}', hash);
    }
    if (environment === Environments.Mainnet) {
      return this.providerConfig.mainnetExplorerAddressURL.replace('{{hash}}', hash);
    }
    return null;
  };

  getExplorerTxUrl = (environment: Environments, hash: string): string => {
    if (environment === Environments.Testnet) {
      return this.providerConfig.testnetExplorerTxURL.replace('{{hash}}', hash);
    }
    if (environment === Environments.Mainnet) {
      return this.providerConfig.mainnetExplorerTxURL.replace('{{hash}}', hash);
    }
    return null;
  };

  deployContract = async (
    byteCode: string,
    abi: any,
    args: string[],
    environment: Environments,
    energyLimit: string,
  ): Promise<{ contractAddress: string; transactionHash: string }> => {
    if (!this.isProviderAvailable()) {
      throw new Error('Tron provider is not available');
    }

    if (!this.isWalletConnected()) {
      throw new Error('Wallet is not connected');
    }

    if (!this.isConnectedToEnvironment(environment)) {
      throw new Error('The connected network does not match the selected environment');
    }

    // const contractInstance = window.tronWeb.contract(abi);
    // const result = await contractInstance.new({
    //   abi: abi,
    //   bytecode: byteCode,
    //   parameters: args,
    //   feeLimit: energyLimit,
    // });

    const transaction = await window.tronWeb.transactionBuilder.createSmartContract(
      {
        abi: abi,
        bytecode: byteCode,
        feeLimit: 5000000000,
        callValue: 0,
        userFeePercentage: 30,
        // originEnergyLimit: 10,
        parameters: args,
      },
      window.tronWeb.defaultAddress.hex,
    );

    const signedTransaction = await window.tronWeb.trx.sign(transaction);
    const contractInstance = await window.tronWeb.trx.sendRawTransaction(signedTransaction);

    /*
    {
      result: true
      transaction: {
        contract_address: "413d277d507e5d733f260c980687729d137441caa7",
        txID: "1fad6d1ff8c36ab2ee2b18a5437ed2dfa7e5d1eeb54c3d7afb260e8076ae38d4"
      }
      txid: "1fad6d1ff8c36ab2ee2b18a5437ed2dfa7e5d1eeb54c3d7afb260
    }
    */

    if (!contractInstance.result) {
      logger.logError('deployContract', 'Failed to deploy contract to TRON, result is not true.');
      throw new Error('Failed to deploy contract.');
    }

    return {
      contractAddress: this.hexToTronAddress(contractInstance.transaction.contract_address),
      transactionHash: contractInstance.transaction.txID,
    };
  };

  signSignature = async (message: string): Promise<string> => {
    const tronWeb = window.tronWeb;
    if (tronWeb) {
      const walletAddress = tronWeb.defaultAddress.base58;
      const messageHash = tronWeb.sha3(message);
      const signature = await tronWeb.trx.sign(messageHash);

      return signature;
    } else {
      return '';
    }
  };

  verifySignature = async (message: string, signature: string, address: string): Promise<boolean> => {
    const FULL_NODE = this.providerConfig.mainnetRPC;
    const SOLIDITY_NODE = this.providerConfig.mainnetRPC;
    const EVENT_SERVER = this.providerConfig.mainnetRPC;
    const tronWeb = new TronWeb(FULL_NODE, SOLIDITY_NODE, EVENT_SERVER);

    const messageHash = tronWeb.sha3(message);

    const isValid = tronWeb.trx.verifyMessage(messageHash, signature, message);

    return isValid;
  };

  invokeViewMethod = async (abi: any, contractAddress: string, methodName: string, args: any[] = []): Promise<any> => {
    const contract = window.tronWeb.contract(abi, contractAddress);
    const method = contract[methodName];
    return await method(...args).call();
  };

  invokeTransactMethod = async (
    abi: any,
    contractAddress: string,
    methodName: string,
    args: any[] = [],
    energyLimit?: any,
  ): Promise<string> => {
    if (!this.isWalletConnected()) {
      throw new Error('Wallet is not connected');
    }

    const contract = window.tronWeb.contract(abi, contractAddress);
    const method = contract[methodName];
    const transactionResponse = await method(...args).send({
      feeLimit: energyLimit,
    });

    return transactionResponse.transaction.txID;
  };

  retrieveTransactionInfo = async (
    environment: Environments,
    transactionHash: string,
  ): Promise<TransactionInfo | null> => {
    try {
      const txInfo = await TronScanApi.fetchTransactionInfo(environment, transactionHash);
      if (!txInfo) {
        return null;
      }

      const data: TransactionInfo = {
        transactionHash: transactionHash,
        walletAddress: txInfo.info.contract_info.owner_address,
        dateTime: new Date(Number(txInfo.info.contract_info.date_created)),
        contractAddress: txInfo.info.contract_address,
      };

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  hexToTronAddress = (hex: string): string => {
    const FULL_NODE = this.providerConfig.mainnetRPC;
    const SOLIDITY_NODE = this.providerConfig.mainnetRPC;
    const EVENT_SERVER = this.providerConfig.mainnetRPC;
    const tronWeb = new TronWeb(FULL_NODE, SOLIDITY_NODE, EVENT_SERVER);

    return tronWeb.address.fromHex(hex);
  };
}
