import { App, AppCreationModes, AppStatuses } from '@modules/firebase';
import React, { useEffect, useState } from 'react';
import CreateAppSelection from './AppSetup/CreateAppSelection/CreateAppSelection';
import styles from './AppContent.module.scss';
import TemplateWizard from './AppSetup/TemplateWizard/TemplateWizard';
import { Button } from '@mui/material';
import { deleteDapp, updateApp } from '@services/web/appService';
import ConfirmDialog from '@components/dialogs/ConfirmDialog/ConfirmDialog';
import AppDetails from './AppDetails/AppDetails';
import { Blockchains } from '@core/enums/blockchains';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ImportWizard from './AppSetup/ImportWizard/ImportWizard';
import GitHubWizard from './AppSetup/GitHubWizard/GitHubWizard';
import RenameAppDialog from '@components/dialogs/RenameAppDialog/RenameAppDialog';
import GenerateWizard from './AppSetup/GenerateWizard/GenerateWizard';

interface AppContentProps {
  app: App;
  blockchain: Blockchains;
  walletAddress: string;
  isDemo: boolean;
  onDeletedApp: () => void;
  onRefreshApp: () => void;
}

const AppContent = ({ app, blockchain, walletAddress, isDemo, onDeletedApp, onRefreshApp }: AppContentProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [currentApp, setCurrentApp] = useState(app);
  const [selectedAppCreationMode, setSelectedAppCreationMode] = useState<AppCreationModes>(AppCreationModes.Template);
  const [beginSetup, setBeginSetup] = useState<boolean>(false);

  // TODO: temporary assign TRON to demo
  if (isDemo) {
    blockchain = Blockchains.Electroneum;
  }

  const handleDeleteApp = async () => {
    await deleteDapp({ appId: currentApp.appId });
    setShowConfirmDialog(false);
    onDeletedApp && onDeletedApp();
  };

  const handleAppRename = async (newName: string) => {
    if (newName) {
      let updatedApp = app;
      updatedApp.name = newName;

      await updateApp({ app: updatedApp });
    }

    setShowRenameDialog(false);
    onRefreshApp && onRefreshApp();
  };

  const handleSetupFinish = async () => {
    onRefreshApp && onRefreshApp();
  };

  const handleSetupCancelled = () => {
    setBeginSetup(false);
  };

  useEffect(() => {
    setBeginSetup(false);
    setCurrentApp(app);
  }, [app]);

  return (
    <>
      {currentApp.status === AppStatuses.PendingContract && !beginSetup && (
        <>
          <h3>Select an option to begin</h3>
          <CreateAppSelection onSelect={(selected) => setSelectedAppCreationMode(selected)} />
          <div className={styles.actionButtonsContainer}>
            <Button color="error" variant="outlined" onClick={() => setShowConfirmDialog(true)}>
              Delete App
            </Button>
            <Button color="primary" variant="contained" onClick={() => setBeginSetup(true)}>
              Begin Setup <ArrowRightIcon />
            </Button>
          </div>
        </>
      )}

      {beginSetup &&
        currentApp.status === AppStatuses.PendingContract &&
        selectedAppCreationMode === AppCreationModes.GitHub && (
          <>
            <h3>Import from GitHub</h3>
            <GitHubWizard
              app={currentApp}
              blockchain={blockchain}
              onSetupFinish={() => handleSetupFinish()}
              onCancel={() => handleSetupCancelled()}
            />
          </>
        )}

      {beginSetup &&
        currentApp.status === AppStatuses.PendingContract &&
        selectedAppCreationMode === AppCreationModes.Template && (
          <>
            <h3>Create Contract from Template</h3>
            <TemplateWizard
              app={currentApp}
              onSetupFinish={() => handleSetupFinish()}
              onCancel={() => handleSetupCancelled()}
            />
          </>
        )}

      {beginSetup &&
        currentApp.status === AppStatuses.PendingContract &&
        selectedAppCreationMode === AppCreationModes.Import && (
          <>
            <h3>Import Existing Contract</h3>
            <ImportWizard
              app={currentApp}
              blockchain={blockchain}
              onSetupFinish={() => handleSetupFinish()}
              onCancel={() => handleSetupCancelled()}
            />
          </>
        )}

{beginSetup &&
        currentApp.status === AppStatuses.PendingContract &&
        selectedAppCreationMode === AppCreationModes.Generated && (
          <>
            <h3>Generate Contract</h3>
            <GenerateWizard
              app={currentApp}
              onSetupFinish={() => handleSetupFinish()}
              onCancel={() => handleSetupCancelled()}
            />
          </>
        )}

      {currentApp.status !== AppStatuses.PendingContract && (
        <>
          <AppDetails
            app={currentApp}
            blockchain={blockchain}
            walletAddress={walletAddress}
            onDeleteClick={() => setShowConfirmDialog(true)}
            onRenameClick={() => setShowRenameDialog(true)}
            isDemo={isDemo}
          />
        </>
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          show={true}
          title="Confirm Delete?"
          description="WARNING: This action cannot be undone. Are you sure you want to delete this app? "
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={() => handleDeleteApp()}
        />
      )}

      {showRenameDialog && (
        <RenameAppDialog
          show={true}
          name={app.name}
          onCancel={() => setShowConfirmDialog(false)}
          onRename={(newName: string) => handleAppRename(newName)}
        />
      )}
    </>
  );
};

export default AppContent;
