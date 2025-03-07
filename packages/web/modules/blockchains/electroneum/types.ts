export interface ElectroneumWallet {
  address: string;
  network: ElectroneumNetworks;
}

export enum ElectroneumNetworks {
  Mainnet = 'ElectroneumMainnet',
  Testnet = 'ElectroneumTestnet',
}
