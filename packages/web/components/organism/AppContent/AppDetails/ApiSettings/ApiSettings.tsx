import React, { useContext, useState } from 'react';
import styles from './ApiSettings.module.scss';
import { App, AppCreationModes } from '@modules/firebase';
import { Box, Button } from '@mui/material';

interface ApiSettingsProps {
  app: App;
}

export default function ApiSettings({ app }: ApiSettingsProps) {
  return (
    <div className={styles.container}>
      <Box className={styles.borderedBox}>
        <div className={styles.row}>
          <div>
            <h5>Enable Contract API</h5>
            <p>Invoke your contract through a REST API managed by BlockFabric.</p>
          </div>
          <Button color="primary" variant="outlined">
            Create API Key
          </Button>
        </div>
      </Box>
    </div>
  );
}
