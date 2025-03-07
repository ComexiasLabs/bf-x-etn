import React, { useContext, useEffect, useState } from 'react';
import styles from './GenerateWizard.module.scss';
import { Button, Step, StepLabel, Stepper } from '@mui/material';
import { Template } from '@core/entities/template';
import { App, AppCreationModes, AppCreationSource } from '@modules/firebase';
import { UserTemplateInput } from '@core/entities/userTemplateInput';
import MessageDialogContext from '@components/context/MessageDialogContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress';
import { CompileCodeParams, compileCode } from '@services/web/compileService';
import { loadTemplateFromMetadata } from '@services/web/gitHubService';
import { omitBeforeAt } from '@core/helpers/textHelper';
import { updateAppCreationSource } from '@services/web/appService';
import Step1EnterDetails from './Step1/Step1EnterDetails';
import Step2Review from './Step2/Step2Review';
import Step3Ready from './Step3/Step3Ready';

interface GenerateWizardProps {
  app: App;
  onSetupFinish: () => void;
  onCancel: () => void;
}

export default function GenerateWizard({ app, onSetupFinish, onCancel }: GenerateWizardProps) {
  const { showMessage } = useContext(MessageDialogContext);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>();
  const [userInput, setUserInput] = useState<UserTemplateInput>();
  const [reviewedCode, setReviewedCode] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setCurrentStep(0);
    setSelectedTemplate(undefined);
    setUserInput(undefined);
    setReviewedCode(undefined);
    setIsLoading(false);
  }, [app]);

  const steps = ['Choose Template', 'Enter Details', 'Review & Build', 'Ready'];

  const handleNext = async () => {
    if (currentStep === 3) return;

    if (currentStep === 0) {
      // Choose Template > Enter Details

      const loadedTemplate = await loadTemplateFromMetadata(selectedTemplate.templateId, selectedTemplate.folder);
      setSelectedTemplate(loadedTemplate);

      setCurrentStep(currentStep + 1);
    }

    if (currentStep === 1) {
      // Enter Details > Review
      const mergedCode = mergeInput(selectedTemplate.code, userInput);

      if (mergedCode.indexOf('{{') > 0 || mergedCode.indexOf('}}') > 0) {
        showMessage('Enter all fields', 'Please enter all required fields');
        return;
      }
      setReviewedCode(mergedCode);
      setCurrentStep(currentStep + 1);
    }

    if (currentStep === 2) {
      // Review > (Compile) > Ready
      // Compile code and call API to save
      setIsLoading(true);

      const contractName = userInput.userInputs.find((item) => item.key === 'contractName').value;

      const dependencies = selectedTemplate.dependencies.map((item) => ({
        path: omitBeforeAt(item.path),
        fileContent: item.fileContent,
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
        const appCreationSource: AppCreationSource = {
          templateId: selectedTemplate.templateId,
          templateName: selectedTemplate.name,
        };
        await updateAppCreationSource({
          appId: app.appId,
          appCreationMode: AppCreationModes.Template,
          appCreationSource,
        });

        setCurrentStep(currentStep + 1);
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

  const handleInputUpdated = (key: string, value: string) => {
    setUserInput((prevState) => {
      // Check if input with the same key already exists
      const existingInputIndex = prevState?.userInputs.findIndex((input) => input.key === key);

      // Copy the existing inputs to a new array or create a new empty array if no inputs exist
      const newUserInputs = [...(prevState?.userInputs || [])];

      if (existingInputIndex != null && existingInputIndex >= 0) {
        // If input with the same key exists, update its value
        newUserInputs[existingInputIndex] = { key, value };
      } else {
        // If it doesn't exist, add it to the array
        newUserInputs.push({ key, value });
      }

      // Return the new state
      return { userInputs: newUserInputs };
    });
  };

  const mergeInput = (code: string, userInput: UserTemplateInput) => {
    if (!userInput?.userInputs || userInput.userInputs.length === 0) {
      return code;
    }

    // Create a key-value map from userInput
    const inputMap = new Map(userInput.userInputs.map((input) => [input.key, input.value]));

    // Use regex to replace placeholders with values from userInput
    let newCode = code.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return inputMap.get(key) || match; // If the key doesn't exist, return the original placeholder
    });

    newCode = newCode.replaceAll('\\n', '\n');

    return newCode;
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
            app={app}
            template={selectedTemplate}
            onInputUpdated={(key, value) => handleInputUpdated(key, value)}
          />
          <div className={styles.actionButtonsContainer}>
            <Button color="primary" disabled={false} variant="outlined" onClick={() => handleBack()}>
              Back
            </Button>
            <Button
              color="primary"
              disabled={false}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => handleNext()}
            >
              Review Code
            </Button>
          </div>
        </>
      )}

      {currentStep === 1 && (
        <>
          <Step2Review app={app} code={reviewedCode} />
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

      {currentStep === 2 && (
        <>
          <Step3Ready app={app} />

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
