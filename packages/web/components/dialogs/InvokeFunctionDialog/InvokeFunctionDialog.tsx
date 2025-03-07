import React, { useEffect, useContext } from 'react';
import styles from './InvokeFunctionDialog.module.scss';
import { Modal } from 'react-bootstrap';
import { Chip, Typography, ToggleButtonGroup, ToggleButton, Skeleton, Alert, Button } from '@mui/material';
import { Blockchains } from '@core/enums/blockchains';
import { App } from '@modules/firebase';
import { Environments } from '@core/enums/environments';
import { getDeploymentForEnvironment, isAppDeployedToEnvironment } from '@core/helpers/appHelper';
import { createBlockchainProvider } from '@modules/blockchains/blockchains';
import { updateApp } from '@services/web/appService';
import logger from '@core/logger/logger';
import CircularProgress from '@mui/material/CircularProgress';
import MessageDialogContext from '@components/context/MessageDialogContext';

export type ViewOrTransact = 'View' | 'Transact';

interface InvokeFunctionDialogProps {
  show: boolean;
  blockchain: Blockchains;
  app: App;
  methodName: string;
  viewOrTransact: ViewOrTransact;
  args: any[];
  isDemo: boolean;
  onCancel: () => void;
}

export default function InvokeFunctionDialog({
  show,
  blockchain,
  app,
  methodName,
  viewOrTransact,
  args,
  isDemo,
  onCancel,
}: InvokeFunctionDialogProps) {
  const { showMessage } = useContext(MessageDialogContext);

  const blockchainProvider = createBlockchainProvider(blockchain as Blockchains);

  const [currentApp, setCurrentApp] = React.useState<App>(app);
  const [isTestnetDeployed, setIsTestnetDeployed] = React.useState<boolean>(false);
  const [isMainnetDeployed, setIsMainnetDeployed] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [invokeResults, setInvokeResults] = React.useState<React.ReactNode>();

  const [selectedEnvironment, setSelectedEnvironment] = React.useState<Environments>(null);
  const [selectedContractAddress, setSelectedContractAddress] = React.useState<string>();

  const handleSelectEnvironment = (event: React.MouseEvent<HTMLElement>, environment: Environments | null) => {
    setSelectedEnvironment(environment);

    const deployment = getDeploymentForEnvironment(app, environment);
    setSelectedContractAddress(deployment?.contractAddress);
  };

  useEffect(() => {
    checkContracts();
  }, []);

  const checkContracts = async () => {
    if (!currentApp) {
      return;
    }

    if (!app.deployments) {
      setIsTestnetDeployed(false);
      setIsMainnetDeployed(false);
      return;
    }

    setIsLoading(true);

    setIsTestnetDeployed(isAppDeployedToEnvironment(app, Environments.Testnet));
    setIsMainnetDeployed(isAppDeployedToEnvironment(app, Environments.Mainnet));

    let hasUpdate = false;

    await Promise.all(
      app.deployments.map(async (item) => {
        if (item.transactionHash && !item.contractAddress) {
          hasUpdate = true;
          const transactionInfo = await blockchainProvider.retrieveTransactionInfo(
            item.environment,
            item.transactionHash,
          );
          item.contractAddress = transactionInfo.contractAddress;
        }
      }),
    );

    if (hasUpdate) {
      await updateApp({ app });
      setCurrentApp(app);
    }

    setIsLoading(false);
  };

  const handleInvoke = async () => {
    if (isDemo) {
      showMessage('Demo mode', 'This feature is not available in demo mode as it requires a connected wallet.');
      return;
    }

    logger.logInfo(
      'handleInvoke',
      `selectedContractAddress: ${selectedContractAddress}, methodName: ${methodName}, args: ${JSON.stringify(args)}`,
    );

    try {
      setIsLoading(true);

      if (viewOrTransact === 'View') {
        const response = await blockchainProvider.invokeViewMethod(
          currentApp.contractAbi,
          selectedContractAddress,
          methodName,
          args,
        );
        setInvokeResults(`${response}`);
      }
      if (viewOrTransact === 'Transact') {
        const txHash = await blockchainProvider.invokeTransactMethod(
          currentApp.contractAbi,
          selectedContractAddress,
          methodName,
          args,
        );
        setInvokeResults(
          <>
            Transaction hash:{' '}
            <a href={blockchainProvider.getExplorerTxUrl(selectedEnvironment, txHash)} target="_blank" rel="noreferrer">
              {txHash}
            </a>
          </>,
        );
      }

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setInvokeResults(<>Error: {e.message ? e.message : e}</>);
    }
  };

  return (
    <>
      <Modal show={show} size="lg" onHide={onCancel} backdrop="static" centered={true} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            Invoke {methodName}{' '}
            <span className={styles.muted}>{viewOrTransact === 'View' ? 'View' : 'Transaction'}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading && (
            <div>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          )}
          {!isLoading && (
            <div>
              <div className={styles.displayItem}>
                <Typography variant="h6" color="InfoText">
                  Environment
                </Typography>
                {!isTestnetDeployed && !isMainnetDeployed && (
                  <Alert severity="warning">App is not deployed to testnet or mainnet.</Alert>
                )}
                {(isTestnetDeployed || isMainnetDeployed) && (
                  <ToggleButtonGroup value={selectedEnvironment} exclusive onChange={handleSelectEnvironment}>
                    <ToggleButton value={null}>None</ToggleButton>
                    <ToggleButton value={Environments.Testnet} disabled={!isTestnetDeployed}>
                      Testnet
                    </ToggleButton>
                    <ToggleButton value={Environments.Mainnet} disabled={!isMainnetDeployed}>
                      Mainnet
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              </div>
              {selectedContractAddress && (
                <div className={styles.displayItem}>
                  <Typography variant="h6" color="GrayText">
                    Contract Address
                  </Typography>
                  <Chip label={selectedContractAddress} variant="filled" />
                </div>
              )}
              {args && args.length > 0 && (
                <div className={styles.displayItem}>
                  <Typography variant="h6" color="InfoText">
                    Arguments
                  </Typography>
                  {args.map((item, index) => (
                    <Chip key={index} label={item} variant="filled" />
                  ))}
                </div>
              )}
              {invokeResults && (
                <div className={styles.displayItem}>
                  <Typography variant="h6" color="InfoText">
                    Results
                  </Typography>
                  {invokeResults}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="secondary" variant="outlined" onClick={() => onCancel()}>
            Close
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleInvoke()}
            endIcon={isLoading ? <CircularProgress size="1rem" /> : <></>}
            disabled={!selectedEnvironment || isLoading}
          >
            Invoke
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
