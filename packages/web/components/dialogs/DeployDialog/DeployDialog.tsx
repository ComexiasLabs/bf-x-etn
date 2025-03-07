import React, { useContext, useState, useEffect } from 'react';
import styles from './DeployDialog.module.scss';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { Blockchains } from '@core/enums/blockchains';
import { Environments } from '@core/enums/environments';
import { App } from '@modules/firebase';
import FolderIcon from '@mui/icons-material/Folder';
import StorageDialog from '../StorageDialog/StorageDialog';

interface DeployDialogProps {
  show: boolean;
  app: App;
  blockchain: Blockchains;
  environment: Environments;
  walletAddress: string;
  isDeploying: boolean;
  onCancel: () => void;
  onDeploy: (gasLimit: string, args: Record<string, string>) => void;
}

export default function DeployDialog({
  show,
  app,
  blockchain,
  environment,
  walletAddress,
  isDeploying,
  onCancel,
  onDeploy,
}: DeployDialogProps) {
  const [gasLimit, setGasLimit] = useState<string>('4500000');
  const [constructorInputs, setConstructorInputs] = useState<Record<string, string>>({});
  const [showStorageDialog, setShowStorageDialog] = useState(false);
  const [showConstructorInputParamName, setShowConstructorInputParamName] = useState('');

  const constructorParams = app.contractAbi.find((item) => item.type === 'constructor')?.inputs || [];

  useEffect(() => {
    // Initialize state with constructor parameter names
    const initialInputs = constructorParams.reduce((acc, param) => {
      acc[param.name] = '';
      return acc;
    }, {} as Record<string, string>);
    setConstructorInputs(initialInputs);
  }, [constructorParams]);

  const handleDeployClick = () => {
    onDeploy(gasLimit, constructorInputs);
  };

  const handleInputChange = (paramName: string, value: string) => {
    setConstructorInputs((prev) => ({ ...prev, [paramName]: value }));
  };

  const handleConstructorInputClick = (paramName: string) => {
    console.log(`[handleConstructorInputClick]`);
    setShowConstructorInputParamName(paramName);
    setShowStorageDialog(true);
  };

  const handleHandleStorageSelect = (value: string) => {
    console.log(`[handleHandleStorageSelect]`);

    setConstructorInputs((prevState) => ({
      ...prevState,
      [showConstructorInputParamName]: value,
    }));

    setShowStorageDialog(false);
  };

  const isInputTypeStorage = (templateId: string, paramName: string): boolean => {
    // TODO: temporary fix:
    if (paramName === 'baseTokenURI') {
      return true;
    } else {
      return false;
    }
    // const template = TEMPLATES.find(element => element.templateId === templateId);
    // if (template) {
    //   console.log(`isInputTypeStorage: has template`);
    //   const input = template.constructorInput.find(element => element.key === paramName);
    //   return input.inputType === 1;
    // } else {
    //   console.log(`isInputTypeStorage: no template`);
    //   return false;;
    // }
  };

  return (
    <>
      <Modal show={show} size="lg" onHide={onCancel} backdrop="static" centered={true} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Deploy Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            You are about to deploy {app.name} to {blockchain} {environment}.
          </div>
          <Form className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Gas Limit</Form.Label>
              <Form.Control
                type="number"
                placeholder="Eg: 4500000"
                value={gasLimit}
                onChange={(e) => setGasLimit(e.target.value)}
              />
            </Form.Group>
            {constructorParams.map((param) => (
              <Form.Group key={param.name} className="mb-3">
                <Form.Label>{param.name}</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder={param.type}
                    value={constructorInputs[param.name] || ''}
                    onChange={(e) => handleInputChange(param.name, e.target.value)}
                  />
                  {/* {isInputTypeStorage(app.contractTemplateId, param.name) && (
                    <InputGroup.Text>
                      <a style={{ cursor: 'pointer' }} onClick={() => handleConstructorInputClick(param.name)}>
                        <FolderIcon />
                      </a>
                    </InputGroup.Text>
                  )} */}
                </InputGroup>
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeployClick} disabled={isDeploying}>
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </Button>
        </Modal.Footer>
      </Modal>
      {showStorageDialog && (
        <StorageDialog
          show={showStorageDialog}
          walletAddress={walletAddress}
          onCancel={() => setShowStorageDialog(false)}
          onSelect={(value) => handleHandleStorageSelect(value)}
        />
      )}
    </>
  );
}
