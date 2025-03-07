import React, { useContext, useEffect, useState } from 'react';
import styles from './Overview.module.scss';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { App } from '@modules/firebase';
import { Environments } from '@core/enums/environments';
import MessageDialogContext from '@components/context/MessageDialogContext';
import DeployDialog from '@components/dialogs/DeployDialog/DeployDialog';
import { Blockchains } from '@core/enums/blockchains';
import { updateAppDeployment } from '@services/web/appService';
import { formatDate } from '@core/helpers/datetimeHelper';
import { getBlockchainLogoImage, shortenHash } from '@modules/blockchains/blockchainHelper';
import { createBlockchainProvider, getExplorerAddressUrl, getExplorerTxUrl } from '@modules/blockchains/blockchains';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import { handleCopyToClipboard } from '@core/helpers/textHelper';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface OverviewProps {
  app: App;
  blockchain: Blockchains;
  walletAddress: string;
  isDemo: boolean;
}

type Row = {
  blockchain: Blockchains;
  environment: Environments;
  status: string;
  wallet: string;
  contractAddress: string;
  transactionHash: string;
  date: string;
};

export default function Overview({ app, blockchain, walletAddress, isDemo }: OverviewProps) {
  const { showMessage } = useContext(MessageDialogContext);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployEnvironment, setDeployEnvironment] = useState<Environments>();
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [tableRows, setTableRows] = useState<Row[]>([]);
  const [currentApp, setCurrentApp] = useState<App>(app);

  useEffect(() => {
    refresh(app);
  }, [app]);

  const refresh = (app: App) => {
    // Map the deployments to rows
    const rows: Row[] =
      app.deployments?.map((deployment) => ({
        blockchain: deployment.blockchain,
        environment: deployment.environment,
        status: deployment.transactionHash ? 'Deployed' : 'Not Deployed',
        wallet: deployment.walletAddress,
        contractAddress: deployment.contractAddress || null,
        transactionHash: deployment.transactionHash || null,
        date: formatDate(deployment.createdDateUTC),
      })) || [];

    // Add a default row for each environment if it doesn't already exist
    [Environments.Mainnet, Environments.Testnet].forEach((env) => {
      if (!rows.find((row) => row.environment === env)) {
        rows.push({
          blockchain: null,
          environment: env,
          status: 'Not Deployed',
          wallet: null,
          contractAddress: null,
          transactionHash: null,
          date: null,
        });
      }
    });

    // Sort rows by environment
    rows.sort((a, b) => a.environment.localeCompare(b.environment));

    setTableRows(rows);
    setCurrentApp(app);
  };

  const prepareDeployment = async (environment: Environments) => {
    setDeployEnvironment(environment);
    setShowDeployDialog(true);
  };

  const deploy = async (gasLimit: string, args: Record<string, string>) => {
    if (isDemo) {
      showMessage('Demo mode', 'This feature is not available in demo mode as it requires a connected wallet.');
      return;
    }

    if (!blockchain || !walletAddress) {
      showMessage('Connect Wallet', 'This action requires you to first to connect a wallet.');
      return;
    }

    try {
      setIsDeploying(true);

      // const initialSupply = BigInt(1000) * BigInt(10**18); 1000000000000000000000
      // const parsedArgs = [initialSupply.toString()];

      const parsedArgs = getArgumentValues(args);

      const blockchainProvider = createBlockchainProvider(blockchain as Blockchains);

      const deploymentReceipt = await blockchainProvider.deployContract(
        app.contractByteCode,
        app.contractAbi,
        parsedArgs,
        deployEnvironment,
        gasLimit.toString(),
      );
      console.log(
        `Contract deployed at address: ${deploymentReceipt.contractAddress} on transaction ${deploymentReceipt.transactionHash}`,
      );

      const response = await updateAppDeployment({
        app,
        walletAddress,
        environment: deployEnvironment,
        blockchain,
        transactionHash: deploymentReceipt.transactionHash,
        contractAddress: deploymentReceipt.contractAddress,
      });
      if (response) {
        const updatedApp: App = response as App;
        if (updatedApp) {
          refresh(updatedApp);
        }

        showMessage('Deployment Successful', 'Your contract has been successfully deployed.');
      } else {
        showMessage(
          'Deployment Incomplete',
          'Your contract was deployed successfully but failed to update on BlockFabric.',
        );
      }

      setIsDeploying(false);
    } catch (error) {
      console.error('Error deploying contract: ', error);
      setIsDeploying(false);

      let message = 'An error occured while deploying your contract. Try increasing the gas limit.';

      // TODO: use status code instead of checking on message
      if (error.message.includes('Contract args not provided')) {
        message = 'Some required fields to deploy your contract was not provided. Please enter all required fields.';
      }

      if (error.message.includes('connected network does not match the selected environment')) {
        message =
          'Your wallet is not connected to the environment you are deploying to. Please switch your wallet network.';
      }

      if (blockchain === Blockchains.BNBChain) {
        message = `${message}. IMPORTANT: Please ensure your BNB Chain RPC URL in MetaMask is '***.binance.org' and not '***.omniatech.io'`;
      }
      showMessage('Deployment Failed', message);
    }
  };

  const getArgumentValues = (args: Record<string, string>): string[] => {
    return Object.values(args);
  };

  return (
    <div className={styles.container}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell>Blockchain</TableCell>
              <TableCell>Environment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Transaction</TableCell>
              <TableCell>Contract</TableCell>
              <TableCell>Wallet</TableCell>
              <TableCell>Deployed Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  {row.blockchain && (
                    <>
                      <img
                        src={getBlockchainLogoImage(row.blockchain)}
                        alt={row.blockchain}
                        className={styles.blockchainIcon}
                      />
                      <span>{row.blockchain}</span>
                    </>
                  )}
                  {!row.blockchain && (
                    <>
                      <img
                        src={getBlockchainLogoImage(blockchain)}
                        alt={blockchain}
                        className={styles.blockchainIcon}
                      />
                      <span>{blockchain}</span>
                    </>
                  )}
                </TableCell>
                <TableCell>{row.environment}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  {row.transactionHash ? (
                    <>
                      <Tooltip title="View on Block Explorer">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={getExplorerTxUrl(row.blockchain, row.environment, row.transactionHash)}
                        >
                          {shortenHash(row.transactionHash)}
                        </a>
                      </Tooltip>
                      <Tooltip title="Copy to Clipboard">
                        <IconButton onClick={() => handleCopyToClipboard(row.transactionHash)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  {row.transactionHash && !row.contractAddress && (
                    <Tooltip title="Please check back later">
                      <AccessTimeIcon />
                    </Tooltip>
                  )}
                  {row.contractAddress && (
                    <>
                      <Tooltip title="View on Block Explorer">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={getExplorerAddressUrl(row.blockchain, row.environment, row.contractAddress)}
                        >
                          {shortenHash(row.contractAddress)}
                        </a>
                      </Tooltip>
                      <Tooltip title="Copy to Clipboard">
                        <IconButton onClick={() => handleCopyToClipboard(row.contractAddress)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {!row.transactionHash && !row.contractAddress && 'N/A'}
                </TableCell>
                <TableCell>
                  {row.wallet ? (
                    <>
                      <Tooltip title="View on Block Explorer">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={getExplorerAddressUrl(row.blockchain, row.environment, row.wallet)}
                        >
                          {shortenHash(row.wallet)}
                        </a>
                      </Tooltip>
                      <Tooltip title="Copy to Clipboard">
                        <IconButton onClick={() => handleCopyToClipboard(row.wallet)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  {row.date && <>{row.date}</>}
                  {!row.date && (
                    <Button
                      variant="contained"
                      disabled={isDeploying}
                      endIcon={isDeploying ? <CircularProgress size="1rem" /> : <></>}
                      onClick={() => prepareDeployment(row.environment)}
                    >
                      Deploy
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showDeployDialog && (
        <DeployDialog
          show={showDeployDialog}
          app={currentApp}
          blockchain={blockchain}
          environment={deployEnvironment}
          walletAddress={walletAddress}
          isDeploying={isDeploying}
          onCancel={() => setShowDeployDialog(false)}
          onDeploy={(gasLimit, args) => deploy(gasLimit, args)}
        />
      )}
    </div>
  );
}
