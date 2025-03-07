import React, { useState } from 'react';
import styles from './Step3Review.module.scss';
import { App } from '@modules/firebase';
import { Box, Paper, Tab, Tabs } from '@mui/material';
import AICodeReview from '@components/molecules/AICodeReview/AICodeReview';
import AISecurityAnalysis from '@components/molecules/AISecurityAnalysis/AISecurityAnalysis';
import CodeIcon from '@mui/icons-material/Code';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SecurityIcon from '@mui/icons-material/Security';
import { TabPanel, tabProperties } from '@components/atoms/CustomTabs/CustomTabs';

interface Step3ReviewProps {
  app: App;
  code: string;
}

export default function Step3Review({ app, code }: Step3ReviewProps) {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <h4>{app.name} Contract Code</h4>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab icon={<CodeIcon />} iconPosition="start" label="Source Code" {...tabProperties(0)} />
          <Tab icon={<AutoFixHighIcon />} iconPosition="start" label="AI Code Review" {...tabProperties(0)} />
          <Tab icon={<SecurityIcon />} iconPosition="start" label="AI Security Analysis" {...tabProperties(0)} />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <Box mt={2}>
          <Paper elevation={2}>
            <Box p={2}>
              <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                <code>{code}</code>
              </pre>
            </Box>
          </Paper>
        </Box>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Box mt={2}>
          <AICodeReview code={code} />
        </Box>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <Box mt={2}>
          <AISecurityAnalysis code={code} />
        </Box>
      </TabPanel>
    </div>
  );
}
