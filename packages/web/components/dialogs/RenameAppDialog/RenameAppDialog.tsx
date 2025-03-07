import React, { useContext, useState } from 'react';
import styles from './RenameAppDialog.module.scss';
import { Modal, Button, Form } from 'react-bootstrap';
import MessageDialogContext from '@components/context/MessageDialogContext';

interface RenameAppDialogProps {
  show: boolean;
  name: string;
  onCancel: () => void;
  onRename: (newName: string) => void;
}

export default function RenameAppDialog({ show, name, onCancel, onRename }: RenameAppDialogProps) {
  const [input, setInput] = useState<string>(name);

  return (
    <Modal show={show} size="lg" onHide={onCancel} backdrop="static" centered={true} keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Rename app</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="input"
              placeholder="Enter a name for this app"
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
        <Button variant="primary" onClick={() => onRename(input)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
