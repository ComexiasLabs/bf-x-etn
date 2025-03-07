import React, { useContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface ManageFilesDialogProps {
  show: boolean;
  onCancel: () => void;
}

export default function ManageFilesDialog({ show, onCancel }: ManageFilesDialogProps) {
  const handleManageClick = () => {
    window.open('https://dcellar.io/', '_blank');
  };

  return (
    <Modal show={show} size="lg" onHide={onCancel} backdrop="static" centered={true} keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Manage Files</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Block Fabric currently supports viewing and selecting files directly from Greenfield. To upload or modify files,
        we recommend you use a readily available platform recommended by Greenfield for this purpose:
        https://dcellar.io/.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onCancel()}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleManageClick()}>
          Manage on DCellar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
