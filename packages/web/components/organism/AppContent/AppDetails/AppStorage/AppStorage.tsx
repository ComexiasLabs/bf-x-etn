import React, { useState } from 'react';
import styles from './AppStorage.module.scss';
import { App } from '@modules/firebase';
import StorageBrowser from '@components/organism/StorageBrowser/StorageBrowser';
import { Alert, Box, Button } from '@mui/material';
import { GREENFIELD_TESTNET } from '@modules/greenfield/constants';
import ManageFilesDialog from '@components/dialogs/ManageFilesDialog/ManageFilesDialog';

interface AppStorageProps {
  app: App;
  walletAddress: string;
}

export default function AppStorage({ app, walletAddress }: AppStorageProps) {
  const [showManageDialog, setShowManageDialog] = useState(false);

  const handleManageClick = () => {
    setShowManageDialog(true);
  };

  return (
    <div className={styles.container}>
      <Alert severity="info" style={{ margin: 16 }}>
        Only showing files in folder "/{app.name}"
      </Alert>

      <StorageBrowser
        walletAddress={walletAddress}
        defaultBucketName={GREENFIELD_TESTNET.greenfieldBucketName}
        defaultFolderName={app.name}
        showDelete={false}
      />
      <Box mt={2}>
        <Button variant="outlined" onClick={() => handleManageClick()}>
          Manage Files
        </Button>
      </Box>
      {showManageDialog && <ManageFilesDialog show={showManageDialog} onCancel={() => setShowManageDialog(false)} />}
    </div>
  );
}
