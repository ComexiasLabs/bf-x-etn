import React, { useContext, useEffect, useState } from 'react';
import styles from './ImportWizard.module.scss';
import { Alert, Button, Step, StepLabel, Stepper } from '@mui/material';
import { App, AppCreationModes, AppCreationSource, AppStatuses } from '@modules/firebase';
import Step1EnterDetails, { ImportAddressTypes } from './Step1/Step1EnterDetails';
import Step3Finish from './Step3/Step3Finish';
import Step2Review from './Step2/Step2Review';
import MessageDialogContext from '@components/context/MessageDialogContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress';
import { createBlockchainProvider } from '@modules/blockchains/blockchains';
import { Blockchains } from '@core/enums/blockchains';
import { Environments } from '@core/enums/environments';
import { ImportedData } from '@core/entities/importedData';
import { updateApp, updateAppCreationSource, updateAppDeployment } from '@services/web/appService';
import { convertDateToTimestamp } from '@core/helpers/datetimeHelper';

interface ImportWizardProps {
  app: App;
  blockchain: Blockchains;
  onSetupFinish: () => void;
  onCancel: () => void;
}

export default function ImportWizard({ app, blockchain, onSetupFinish, onCancel }: ImportWizardProps) {
  const { showMessage } = useContext(MessageDialogContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [importAddressType, setImportAddressType] = useState<ImportAddressTypes>(ImportAddressTypes.TransactionHash);
  const [testnetTxHash, setTestnetTxHash] = useState<string>();
  const [mainnetTxHash, setMainnetTxHash] = useState<string>();
  const [importedData, setImportedData] = useState<ImportedData>();

  const blockchainProvider = createBlockchainProvider(blockchain as Blockchains);

  useEffect(() => {
    setCurrentStep(0);
    setTestnetTxHash(undefined);
    setMainnetTxHash(undefined);
    setImportedData(undefined);
    setIsLoading(false);
  }, [app]);

  const steps = ['Enter Details', 'Review', 'Ready'];

  const handleNext = async () => {
    if (currentStep === 0) {
      // Enter Details > Review
      setIsLoading(true);

      if (!testnetTxHash && !mainnetTxHash) {
        showMessage('Enter Contract Address', 'At least one contract address must be available.');
        return;
      }

      // Initialize
      const importedData: ImportedData = {
        canProceed: true,
        testnet: {
          txHash: testnetTxHash,
          isSuccessful: false,
        },
        mainnet: {
          txHash: mainnetTxHash,
          isSuccessful: false,
        },
      };

      // Fetch testnet data
      if (testnetTxHash) {
        const data = await blockchainProvider.retrieveTransactionInfo(Environments.Testnet, testnetTxHash);
        if (!data) {
          importedData.canProceed = false;
          importedData.testnet.isSuccessful = false;
        } else {
          importedData.testnet.isSuccessful = true;
          importedData.testnet.data = data;
        }
      }

      // Fetch mainnet data
      if (mainnetTxHash) {
        const data = await blockchainProvider.retrieveTransactionInfo(Environments.Mainnet, mainnetTxHash);
        if (!data) {
          importedData.canProceed = false;
          importedData.mainnet.isSuccessful = false;
        } else {
          importedData.mainnet.isSuccessful = true;
          importedData.mainnet.data = data;
        }
      }

      setImportedData(importedData);

      setIsLoading(false);
      setCurrentStep(currentStep + 1);
    }

    if (currentStep === 1) {
      // Review > Ready
      setIsLoading(true);

      let isSuccessful = true;

      app.status = AppStatuses.Deployed;
      app.appCreationMode = AppCreationModes.Import;

      await updateApp({ app });

      if (importedData.testnet?.data) {
        const response = await updateAppDeployment({
          app,
          walletAddress: importedData.testnet.data.walletAddress,
          environment: Environments.Testnet,
          blockchain,
          transactionHash: importedData.testnet.data.transactionHash,
          contractAddress: importedData.testnet.data.contractAddress,
          createdDateUTC: convertDateToTimestamp(importedData.testnet.data.dateTime),
        });
        if (!response) {
          isSuccessful = false;
        }
      }

      if (importedData.mainnet?.data) {
        const response = await updateAppDeployment({
          app,
          walletAddress: importedData.mainnet.data.walletAddress,
          environment: Environments.Mainnet,
          blockchain,
          transactionHash: importedData.mainnet.data.transactionHash,
          contractAddress: importedData.mainnet.data.contractAddress,
          createdDateUTC: convertDateToTimestamp(importedData.mainnet.data.dateTime),
        });
        if (!response) {
          isSuccessful = false;
        }
      }

      setIsLoading(false);

      if (!isSuccessful) {
        showMessage('Import Failed', 'Your import was not successfully saved. Please try again later.');
      } else {
        const appCreationSource: AppCreationSource = {
          transactionHashTestnet: mainnetTxHash,
          transactionHashMainnet: testnetTxHash,
        };
        await updateAppCreationSource({
          appId: app.appId,
          appCreationMode: AppCreationModes.Import,
          appCreationSource,
        });

        setCurrentStep(currentStep + 1);
      }
    }

    if (currentStep === 2) {
      return;
    }
  };

  const handleFinish = async () => {
    onSetupFinish && onSetupFinish();
  };

  const handleBack = async () => {
    if (currentStep === 0) return;
    setCurrentStep(currentStep - 1);
  };

  const handleAddressTypeUpdated = (addressType: ImportAddressTypes) => {
    setImportAddressType(addressType);
  };

  const handleInputUpdated = (key: string, value: string) => {
    console.log(key);
    if (key === 'testnetTxHash') {
      setTestnetTxHash(value);
    }
    if (key === 'mainnetTxHash') {
      setMainnetTxHash(value);
    }
  };

  return (
    <>
      <div className={styles.stepContainer}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      {currentStep === 0 && (
        <>
          <Step1EnterDetails
            blockchain={blockchain}
            onAddressTypeUpdated={(value) => handleAddressTypeUpdated(value)}
            onInputUpdated={(key, value) => handleInputUpdated(key, value)}
          />
          <div className={styles.actionButtonsContainer}>
            <Button color="primary" disabled={false} variant="outlined" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleNext()}
              endIcon={isLoading ? <CircularProgress size="1rem" /> : <ArrowForwardIcon />}
              disabled={isLoading || importAddressType === ImportAddressTypes.ContractAddress}
            >
              Review
            </Button>
          </div>
        </>
      )}

      {currentStep === 1 && (
        <>
          <Step2Review app={app} importedData={importedData} />
          {!importedData.canProceed && (
            <Alert severity="warning">
              Unable to proceed with import. There were errors retrieving information for the given transactions. Please
              check your transaction hash.
            </Alert>
          )}
          <div className={styles.actionButtonsContainer}>
            <Button
              color="primary"
              disabled={isLoading}
              variant="outlined"
              onClick={() => handleBack()}
              hidden={isLoading}
            >
              Back
            </Button>
            <Button
              color="primary"
              disabled={isLoading || !importedData.canProceed}
              variant="contained"
              endIcon={isLoading ? <CircularProgress size="1rem" /> : <ArrowForwardIcon />}
              onClick={() => handleNext()}
            >
              Confirm
            </Button>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <Step3Finish app={app} />

          <div className={styles.actionButtonsContainer}>
            <Button color="primary" disabled={false} variant="contained" onClick={() => handleFinish()}>
              Finish
            </Button>
          </div>
        </>
      )}
    </>
  );
}
