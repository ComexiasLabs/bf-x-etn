export interface AreonWallet {
  address: string;
  network: AreonNetworks;
}

export enum AreonNetworks {
  Mainnet = 'AreonMainnet',
  Testnet = 'AreonTestnet',
}
