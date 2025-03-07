export enum Blockchains {
  None = '',
  Fantom = 'Fantom',
  BNBChain = 'BNBChain',
  TRON = 'TRON',
  Areon = 'Areon',
  Electroneum = 'Electroneum',
  BNBGreenfield = 'BNBGreenfield',
}

export const BlockchainLabelMap = new Map<Blockchains, string>([
  [Blockchains.None, ''],
  [Blockchains.Fantom, 'Fantom'],
  [Blockchains.BNBChain, 'BNB Smart Chain'],
  [Blockchains.TRON, 'TRON'],
  [Blockchains.Areon, 'Areon'],
  [Blockchains.Electroneum, 'Electroneum'],
]);

export const getBlockchainLabel = (blockchain: Blockchains): string | undefined => BlockchainLabelMap.get(blockchain);

export const getBlockchainBySlug = (slug: string): Blockchains => {
  switch (slug) {
    case 'fantom':
      return Blockchains.Fantom;
    case 'bsc':
      return Blockchains.BNBChain;
    case 'tron':
      return Blockchains.TRON;
    case 'areon':
      return Blockchains.Areon;
    case 'electroneum':
      return Blockchains.Electroneum;
    default:
      return Blockchains.None;
  }
};
