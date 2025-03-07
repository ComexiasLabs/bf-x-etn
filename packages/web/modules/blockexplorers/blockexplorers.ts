import { Blockchains } from '@core/enums/blockchains';
import { BscScanBlockExplorer } from './bscscan/bscscanBlockExplorer';
import logger from '@core/logger/logger';
import { BaseBlockExplorer } from './base/baseBlockExplorer';
import { TronScanBlockExplorer } from './tronscan/tronscanBlockExplorer';
import { AreonScanBlockExplorer } from './areonscan/areonscanBlockExplorer';
import { ElectroneumScanBlockExplorer } from './electroneumscan/electroneumscanBlockExplorer';

export const createBlockExplorer = (blockchain: Blockchains): BaseBlockExplorer => {
  if (blockchain === Blockchains.BNBChain) {
    return new BscScanBlockExplorer();
  }
  if (blockchain === Blockchains.TRON) {
    return new TronScanBlockExplorer();
  }
  if (blockchain === Blockchains.Areon) {
    return new AreonScanBlockExplorer();
  }
  if (blockchain === Blockchains.Electroneum) {
    return new ElectroneumScanBlockExplorer();
  }

  logger.logWarning('createBlockExplorer', 'Unable to create block explorer. Blockchain not supported.');

  return null;
};
