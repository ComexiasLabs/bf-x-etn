import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Blockchains } from '@core/enums/blockchains';
import styles from './SelectBlockchainDialog.module.scss';
import { getBlockchainLogoImage } from '@modules/blockchains/blockchainHelper';

interface SelectBlockchainDialogProps {
  show: boolean;
  onCancel: () => void;
  onSelect: (token: Blockchains) => void;
}

export default function SelectBlockchainDialog({ show, onCancel, onSelect }: SelectBlockchainDialogProps) {
  return (
    <Modal show={show} size="lg" onHide={onCancel} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Select blockchain network</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.selection}>
          <a onClick={() => onSelect(Blockchains.Electroneum)}>
            <img src={getBlockchainLogoImage(Blockchains.Electroneum)} alt="ELECTRONEUM" />
            <span>Electroneum</span>
            <span className={styles.tag}>New</span>
            <span className={styles.muted}>MetaMask</span>
          </a>
        </div>
        <div className={styles.selection}>
          <a onClick={() => onSelect(Blockchains.TRON)}>
            <img src={getBlockchainLogoImage(Blockchains.TRON)} alt="TRON" />
            <span>TRON</span>
            <span className={styles.tag}>Popular</span>
            <span className={styles.muted}>TronLink</span>
          </a>
        </div>
        <div className={styles.selection}>
          <a onClick={() => onSelect(Blockchains.BNBChain)}>
            <img src={getBlockchainLogoImage(Blockchains.BNBChain)} alt="BNB Chain" />
            <span>BNB Chain</span>
            <span className={styles.tag}>Popular</span>
            <span className={styles.muted}>MetaMask</span>
          </a>
        </div>
        <div className={styles.selection}>
          <a onClick={() => onSelect(Blockchains.Fantom)}>
            <img src={getBlockchainLogoImage(Blockchains.Fantom)} alt="FANTOM" />
            <span>FANTOM</span>
            <span className={styles.muted}>MetaMask</span>
          </a>
        </div>
        <div className={styles.selection}>
          <a onClick={() => onSelect(Blockchains.Areon)}>
            <img src={getBlockchainLogoImage(Blockchains.Areon)} alt="AREON" />
            <span>Areon</span>
            <span className={styles.muted}>MetaMask</span>
          </a>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onCancel()}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
