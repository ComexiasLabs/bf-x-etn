import React, { useContext, useEffect, useState } from 'react';
import styles from './GitHubWizard.module.scss';
import { Button, Step, StepLabel, Stepper } from '@mui/material';
import { App, AppCreationModes, AppCreationSource } from '@modules/firebase';
import Step1EnterDetails from './Step1/Step1EnterDetails';
import MessageDialogContext from '@components/context/MessageDialogContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress';
import { createBlockchainProvider } from '@modules/blockchains/blockchains';
import { Blockchains } from '@core/enums/blockchains';
import Step4Ready from './Step4/Step4Ready';
import Step3Review from './Step3/Step3Review';
import { fetchGitHubFileContent, fetchGitHubRepository } from '@services/web/gitHubService';
import { GitHubFile, GitHubRepository } from '@modules/github/github';
import { CompileCodeParams, compileCode } from '@services/web/compileService';
import Step2SelectFiles from './Step2/Step2SelectFiles';
import { GitHubLoadedFile } from '@core/entities/githubLoadedFile';
import { omitBeforeAt } from '@core/helpers/textHelper';
import { updateAppCreationSource } from '@services/web/appService';

interface GitHubWizardProps {
  app: App;
  blockchain: Blockchains;
  onSetupFinish: () => void;
  onCancel: () => void;
}

export default function GitHubWizard({ app, blockchain, onSetupFinish, onCancel }: GitHubWizardProps) {
  const { showMessage } = useContext(MessageDialogContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [githubRepoUrl, setGithubRepoUrl] = useState<string>();
  const [githubRepo, setGithubRepo] = useState<GitHubRepository>();

  const [smartContractFile, setSmartContractFile] = useState<GitHubFile>(undefined);
  const [dependencyFiles, setDependencyFiles] = useState<GitHubFile[]>([]);
  const [smartContractLoadedFile, setSmartContractLoadedFile] = useState<GitHubLoadedFile>();
  const [dependencyLoadedFiles, setDependencyLoadedFiles] = useState<GitHubLoadedFile[]>([]);

  const [reviewedCode, setReviewedCode] = useState<string>();

  const blockchainProvider = createBlockchainProvider(blockchain as Blockchains);

  useEffect(() => {
    setCurrentStep(0);
    setGithubRepoUrl(undefined);
    setIsLoading(false);
  }, [app]);

  const steps = ['Enter Repository', 'Select Files', 'Review & Build', 'Ready'];

  const handleNext = async () => {
    if (currentStep === 0) {
      // Enter Details > Select Files
      setIsLoading(true);

      if (!githubRepoUrl) {
        showMessage('Enter Repository Url', 'Please enter the GitHub repository URL.');
        return;
      }

      const githubRepo = await fetchGitHubRepository(githubRepoUrl);

      setIsLoading(false);

      if (githubRepo.status === 'Found') {
        setGithubRepo(githubRepo);
        setCurrentStep(currentStep + 1);
      } else {
        setGithubRepo(undefined);
        showMessage('Not Found', 'The repository URL does not exist or is not public.');
        return;
      }
    }

    if (currentStep === 1) {
      // Select Files > Review

      const fileContent = await fetchGitHubFileContent(githubRepo.url, smartContractFile.path);
      const loadedSmartContractFile: GitHubLoadedFile = {
        file: smartContractFile,
        content: fileContent.content,
      };

      const loadedDependencyFiles: GitHubLoadedFile[] = await Promise.all(
        dependencyFiles.map(async (dependentFile) => {
          const fileContent = await fetchGitHubFileContent(githubRepo.url, dependentFile.path);
          return {
            file: dependentFile,
            content: fileContent.content,
          };
        }),
      );

      setSmartContractLoadedFile(loadedSmartContractFile);
      setDependencyLoadedFiles(loadedDependencyFiles);

      setReviewedCode(fileContent.content.trim());
      setCurrentStep(currentStep + 1);
    }

    if (currentStep === 2) {
      // Review > (Compile) > Ready
      // Compile code and call API to save
      setIsLoading(true);

      const contractName = smartContractFile.name.replace('.sol', '');

      const dependencies = dependencyLoadedFiles.map((item) => ({
        path: omitBeforeAt(item.file.path),
        fileContent: item.content,
      }));

      const param: CompileCodeParams = {
        appId: app.appId,
        contractName: contractName,
        code: reviewedCode,
        dependencies,
      };

      const isSuccessful = await compileCode(param);

      setIsLoading(false);
      if (isSuccessful) {
        setCurrentStep(currentStep + 1);

        const appCreationSource: AppCreationSource = { githubUrl: githubRepoUrl };
        await updateAppCreationSource({
          appId: app.appId,
          appCreationMode: AppCreationModes.GitHub,
          appCreationSource,
        });
      } else {
        showMessage('Compilation Failed', 'There were errors compiling your contract.');
      }
    }
  };

  const handleFinish = async () => {
    onSetupFinish && onSetupFinish();
  };

  const handleBack = async () => {
    if (currentStep === 0) return;
    setCurrentStep(currentStep - 1);
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
          <Step1EnterDetails blockchain={blockchain} onInputUpdated={(key, value) => setGithubRepoUrl(value)} />
          <div className={styles.actionButtonsContainer}>
            <Button color="primary" disabled={false} variant="outlined" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleNext()}
              endIcon={isLoading ? <CircularProgress size="1rem" /> : <ArrowForwardIcon />}
              disabled={isLoading || !githubRepoUrl}
            >
              Select Files
            </Button>
          </div>
        </>
      )}

      {currentStep === 1 && (
        <>
          <Step2SelectFiles
            app={app}
            repo={githubRepo}
            onSelectContractFile={(file) => setSmartContractFile(file)}
            onSelectDependentFiles={(files) => setDependencyFiles(files)}
          />
          <div className={styles.actionButtonsContainer}>
            <Button color="primary" disabled={false} variant="outlined" onClick={() => handleBack()}>
              Back
            </Button>
            <Button
              color="primary"
              disabled={isLoading || !smartContractFile}
              variant="contained"
              endIcon={isLoading ? <CircularProgress size="1rem" /> : <ArrowForwardIcon />}
              onClick={() => handleNext()}
            >
              Review Code
            </Button>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <Step3Review app={app} code={reviewedCode} />
          <div className={styles.actionButtonsContainer}>
            <Button color="primary" disabled={isLoading} variant="outlined" onClick={() => handleBack()}>
              Back
            </Button>
            <Button
              color="primary"
              disabled={isLoading}
              variant="contained"
              endIcon={isLoading ? <CircularProgress size="1rem" /> : <ArrowForwardIcon />}
              onClick={() => handleNext()}
            >
              Compile
            </Button>
          </div>
        </>
      )}

      {currentStep === 3 && (
        <>
          <Step4Ready app={app} />

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
