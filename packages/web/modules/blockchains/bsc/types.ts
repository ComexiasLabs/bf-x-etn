export interface BscWallet {
  address: string;
  network: BscNetworks;
}

export enum BscNetworks {
  Mainnet = 'BscMainnet',
  Testnet = 'BscTestnet',
}
