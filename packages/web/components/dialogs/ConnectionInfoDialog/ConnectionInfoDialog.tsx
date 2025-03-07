import React from 'react';
import styles from './ConnectionInfoDialog.module.scss';
import { Modal, Button } from 'react-bootstrap';
import { Chip, Typography } from '@mui/material';
import { Blockchains } from '@core/enums/blockchains';
import { getBlockchainLogoImage } from '@modules/blockchains/blockchainHelper';

interface ConnectionInfoDialogProps {
  show: boolean;
  blockchain: Blockchains;
  walletAddress: string;
  userId: string;
  isDemo: boolean;
  onCancel: () => void;
  onLogout: () => void;
  onSwitchNetwork: () => void;
}

export default function ConnectionInfoDialog({
  show,
  blockchain,
  walletAddress,
  userId,
  isDemo,
  onCancel,
  onLogout,
  onSwitchNetwork,
}: ConnectionInfoDialogProps) {
  return (
    <>
      <Modal show={show} size="lg" onHide={onCancel} backdrop="static" centered={true} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            {!isDemo && (
              <>
                <img className={styles.iconImage} src={getBlockchainLogoImage(blockchain)} alt="Icon" width={50} />
                Connected to {blockchain}
              </>
            )}
            {isDemo && <>You are in demo mode.</>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className={styles.displayItem}>
              <Typography variant="h6" color="InfoText">
                Block Fabric account
              </Typography>
              <Chip label={userId} variant="filled" />
            </div>
            {walletAddress && (
              <div className={styles.displayItem}>
                <Typography variant="h6" color="InfoText">
                  Connected wallet address
                </Typography>
                <Chip label={walletAddress} variant="filled" />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onCancel()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onSwitchNetwork()}>
            Switch Network
          </Button>
          <Button variant="primary" onClick={() => onLogout()}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
