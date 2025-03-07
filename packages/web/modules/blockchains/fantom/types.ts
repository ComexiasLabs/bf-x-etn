export interface FantomWallet {
  address: string;
  network: FantomNetworks;
}

export enum FantomNetworks {
  Mainnet = 'FantomMainnet',
  Testnet = 'FantomTestnet',
}
