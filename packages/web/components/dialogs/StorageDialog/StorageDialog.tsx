import React from 'react';
import { Modal } from 'react-bootstrap';
import StorageBrowser from '@components/organism/StorageBrowser/StorageBrowser';

interface StorageDialogProps {
  show: boolean;
  walletAddress: string;
  onCancel: () => void;
  onSelect: (value: string) => void;
}

export default function StorageDialog({ show, walletAddress, onCancel, onSelect }: StorageDialogProps) {
  return (
    <Modal show={show} size="lg" onHide={onCancel} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Select blockchain network</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StorageBrowser walletAddress={walletAddress} selectFolder={true} onSelect={(value) => onSelect(value)} />
      </Modal.Body>
    </Modal>
  );
}
