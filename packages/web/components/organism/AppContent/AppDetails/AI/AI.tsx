import React, { useContext, useState } from 'react';
import styles from './AI.module.scss';
import { App, AppCreationModes } from '@modules/firebase';
import AICodeReview from '@components/molecules/AICodeReview/AICodeReview';
import AISecurityAnalysis from '@components/molecules/AISecurityAnalysis/AISecurityAnalysis';
import { Alert, Box } from '@mui/material';

interface AIProps {
  app: App;
}

export default function AI({ app }: AIProps) {
  return (
    <div className={styles.container}>
      {app.appCreationMode === AppCreationModes.Import && (
        <Box mb={2}>
          <Alert severity="warning">This feature is currently not available for imported contracts.</Alert>
        </Box>
      )}
      <Box sx={{ margin: 1 }}>
        <AICodeReview code={app.contractCode} />
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <AISecurityAnalysis code={app.contractCode} />
      </Box>
    </div>
  );
}
