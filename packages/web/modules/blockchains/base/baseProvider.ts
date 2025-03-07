import { Environments } from '@core/enums/environments';
import Web3 from 'web3';
import Big from 'big.js';

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

export abstract class BaseEthereumProvider {
  protected providerConfig: ProviderConfig;

  constructor(providerConfig: ProviderConfig) {
    this.providerConfig = providerConfig;
  }

  getProvider = (): any => {
    return window.ethereum;
  };

  isProviderAvailable = (): boolean => {
    return typeof window.ethereum !== 'undefined';
  };

  connectWallet = async () => {
    await window.ethereum?.request({ method: 'eth_requestAccounts' });
  };

  isWalletReady = (): boolean => {
    return window.ethereum && window.ethereum.isMetaMask;
  };

  isWalletConnected = (): boolean => {
    return window.ethereum?.selectedAddress;
  };

  getWallet = async (): Promise<BlockchainWallet | null> => {
    const isConnected = this.isWalletConnected();
    if (isConnected) {
      return {
        address: window.ethereum.selectedAddress,
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
    args: any,
    environment: Environments,
    gasLimit: string,
  ): Promise<{ contractAddress: string; transactionHash: string }> => {
    console.log(`[deployContract] environment: ${environment}`);
    console.log(`[deployContract] gasLimit: ${gasLimit}`);

    // validate parameters
    if (JSON.stringify(args) === '[""]') {
      throw new Error('Contract args not provided.');
    }

    // check if provider is available
    if (!this.isProviderAvailable()) {
      throw new Error('Ethereum provider is not available');
    }

    // connect to the wallet
    await this.connectWallet();

    // check if the wallet is connected
    if (!this.isWalletConnected()) {
      throw new Error('Wallet is not connected');
    }

    // check if the network matches the selected environment
    if (!this.isConnectedToEnvironment(environment)) {
      throw new Error('The connected network does not match the selected environment');
    }

    // create a new web3 instance
    const web3 = new Web3(this.getProvider());

    // get the connected account
    const accounts = await web3.eth.getAccounts();

    if (!accounts || accounts.length === 0) {
      throw new Error('No account is connected');
    }

    // create a new contract instance
    const contract = new web3.eth.Contract(abi);

    // TODO: Calling below function throws this error: {code: 3, message: 'execution reverted: ERC20: mint to the zero address', data: '0x08c379a00000000000000000000000000000000000000000…d696e7420746f20746865207a65726f206164647265737300'}
    // estimate the gas required to deploy the contract
    // const gas = await contract.deploy({ data: byteCode, arguments: [initialSupply] }).estimateGas();

    // deploy the contract
    // const receipt = await contract.deploy({ data: byteCode, arguments: args }).send({ from: accounts[0], gas: gasLimit });

    // return the contract address and the transaction hash
    // return { contractAddress: receipt.options.address, transactionHash: receipt.transactionHash };
    let transactionHash: string;

    const result = await new Promise((resolve, reject) => {
      contract
        .deploy({ data: byteCode, arguments: args })
        .send({ from: accounts[0], gas: gasLimit })
        .on('transactionHash', (hash: string) => {
          transactionHash = hash;
        })
        .on('receipt', resolve)
        .on('error', reject);
    });

    // console.log('deployment result');
    // console.log(result);

    // Cast result to any to be able to access methods not defined in the types
    // const contractAddress = (result as any).options.address;
    const contractAddress = (result as any).contractAddress;

    // Return the contract address and the transaction hash
    return { contractAddress, transactionHash };
  };

  signSignature = async (message: string): Promise<string> => {
    const ethereum = window.ethereum;
    if (ethereum && ethereum.isMetaMask) {
      const web3 = new Web3(ethereum);
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [message, account],
      });

      return signature;
    } else {
      return '';
    }
  };

  verifySignature = async (message: string, signature: string, address: string): Promise<boolean> => {
    const web3 = new Web3(this.providerConfig.mainnetRPC);

    const messageHash = web3.utils.sha3(message);
    const pubKey = web3.eth.accounts.recover(messageHash, signature);
    const signer = web3.utils.toChecksumAddress(pubKey);
    const original = web3.utils.toChecksumAddress(address);

    return signer === original;
  };

  async invokeViewMethod(abi: any, contractAddress: string, methodName: string, args: any[] = []): Promise<any> {
    const web3 = new Web3(this.getProvider());
    const contract = new web3.eth.Contract(abi, contractAddress);
    const method = contract.methods[methodName] as any;
    return await method(...args).call();
  }

  async invokeTransactMethod(
    abi: any,
    contractAddress: string,
    methodName: string,
    args: any[] = [],
    gas?: any,
  ): Promise<string> {
    const web3 = new Web3(this.getProvider());

    // Ensure the wallet is connected before proceeding
    if (!this.isWalletConnected()) {
      throw new Error('Wallet is not connected');
    }

    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(abi, contractAddress);
    const method = contract.methods[methodName] as any;
    const gasEstimate = gas ? gas : await method(...args).estimateGas({ from: accounts[0] });

    const transactionResponse = await method(...args).send({
      from: accounts[0],
      gas: gasEstimate,
    });

    return transactionResponse.transactionHash;
  }

  async retrieveTransactionInfo(environment: Environments, transactionHash: string): Promise<TransactionInfo | null> {
    const rpc =
      environment === Environments.Testnet
        ? this.providerConfig.testnetRPC
        : Environments.Mainnet
        ? this.providerConfig.mainnetRPC
        : '';

    const web3 = new Web3(rpc);

    try {
      // Get transaction receipt
      const receipt = await web3.eth.getTransactionReceipt(transactionHash);

      // Get block data for timestamp
      const block = await web3.eth.getBlock(receipt.blockNumber);
      let bigTimestamp = Big(block.timestamp.toString());
      let bigMultiplier = Big('1000');
      let blockTimestamp = bigTimestamp.times(bigMultiplier);

      // Prepare response
      const data: TransactionInfo = {
        transactionHash: receipt.transactionHash.toString(),
        walletAddress: receipt.from,
        dateTime: new Date(Number(blockTimestamp.toString())),
        contractAddress: receipt.contractAddress,
      };

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
