export interface TronWallet {
  address: string;
  network: TronNetworks;
}

export enum TronNetworks {
  Mainnet = 'TronMainnet',
  Testnet = 'TronTestnet',
  TestnetNile = 'TronTestnetNile',
  TestnetShasta = 'TronTestnetShasta',
}
