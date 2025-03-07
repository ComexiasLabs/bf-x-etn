import React, { useContext, useState } from 'react';
import styles from './LinkWalletDialog.module.scss';
import { Modal, Button, Form } from 'react-bootstrap';
import MessageDialogContext from '@components/context/MessageDialogContext';

interface LinkWalletDialogProps {
  show: boolean;
  onCancel: () => void;
  onSave: (address: string) => void;
}

export default function LinkWalletDialog({ show, onCancel, onSave }: LinkWalletDialogProps) {
  const { showMessage } = useContext(MessageDialogContext);

  const [input, setInput] = useState<string>();

  return (
    <Modal show={show} size="lg" onHide={onCancel} backdrop="static" centered={true} keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Link Storage Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>BNB Greenfield Wallet Address</Form.Label>
            <Form.Control
              type="input"
              placeholder="Enter wallet address read from Greenfield"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onSave(input)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
