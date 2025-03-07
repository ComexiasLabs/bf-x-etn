import React, { useContext, useState } from 'react';
import styles from './AppSettings.module.scss';
import { App, AppCreationModes } from '@modules/firebase';
import { Box, Button } from '@mui/material';

interface AppSettingsProps {
  app: App;
  onDeleteClick: () => void;
  onRenameClick: () => void;
}

export default function AppSettings({ app, onDeleteClick, onRenameClick }: AppSettingsProps) {
  return (
    <div className={styles.container}>
      {app.appCreationMode && (
        <Box className={styles.borderedBox}>
          <div className={styles.row}>
            <div>
              <h5>Contract Source</h5>
              <div>
                {app.appCreationMode === AppCreationModes.Template && <p>This contract was created from a template.</p>}
                {app.appCreationMode === AppCreationModes.Import && (
                  <p>This contract was imported from an existing deployed contract.</p>
                )}
                {app.appCreationMode === AppCreationModes.GitHub && (
                  <p>This contract was created from a GitHub repository.</p>
                )}
              </div>
              {app.appCreationSource && app.appCreationMode === AppCreationModes.Template && (
                <div>
                  <p>
                    <b>Template:</b> {app.appCreationSource.templateName}
                  </p>
                </div>
              )}
              {app.appCreationSource && app.appCreationMode === AppCreationModes.Import && (
                <div>
                  <p>
                    <b>Mainnet Tx:</b> {app.appCreationSource.transactionHashMainnet}
                  </p>
                  <p>
                    <b>Testnet Tx:</b> {app.appCreationSource.transactionHashTestnet}
                  </p>
                </div>
              )}
              {app.appCreationSource && app.appCreationMode === AppCreationModes.GitHub && (
                <div>
                  <p>
                    <b>URL:</b> {app.appCreationSource.githubUrl}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Box>
      )}

      <Box className={styles.borderedBox}>
        <div className={styles.row}>
          <div>
            <h5>App name</h5>
            <p>{app.name}</p>
          </div>
          <Button color="primary" variant="outlined" onClick={() => onRenameClick()}>
            Rename
          </Button>
        </div>
      </Box>

      <Box className={styles.borderedBox}>
        <div className={styles.row}>
          <div>
            <h5>Delete this app</h5>
            <p>This will not change any contract that has already been deployed.</p>
          </div>
          <Button color="error" variant="outlined" onClick={() => onDeleteClick()}>
            Delete
          </Button>
        </div>
      </Box>
    </div>
  );
}
