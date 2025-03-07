import React, { useContext, useState } from 'react';
import styles from './BuildSource.module.scss';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Typography } from '@mui/material';
import { App, AppCreationModes } from '@modules/firebase';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface BuildSourceProps {
  app: App;
}

export default function BuildSource({ app }: BuildSourceProps) {
  return (
    <div className={styles.container}>
      {app.appCreationMode === AppCreationModes.Import && (
        <Box mb={2}>
          <Alert severity="warning">This feature is currently not available for imported contracts.</Alert>
        </Box>
      )}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Source Code</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box p={2} className={styles.codeBlock}>
            <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
              <code>{app.contractCode ?? 'Not Available'}</code>
            </pre>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>ABI</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box p={2} className={styles.codeBlock}>
            <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
              <code>{app.contractAbi ? JSON.stringify(app.contractAbi) : 'Not available'}</code>
            </pre>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>ByteCode</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box p={2} className={styles.codeBlock}>
            <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
              <code>{app.contractByteCode ?? 'Not available'}</code>
            </pre>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Verified Contract</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box mb={2}>
            <Alert severity="warning">Automatic source code verification is currently not available.</Alert>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
