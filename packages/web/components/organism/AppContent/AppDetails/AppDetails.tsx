import React, { useContext, useState } from 'react';
import styles from './AppDetails.module.scss';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import { App } from '@modules/firebase';
import Overview from './Overview/Overview';
import BuildSource from './BuildSource/BuildSource';
import Functions from './Functions/Functions';
import Analytics from './Analytics/Analytics';
import { Blockchains } from '@core/enums/blockchains';
import AppSettings from './AppSettings/AppSettings';
import { TabPanel, tabProperties } from '@components/atoms/CustomTabs/CustomTabs';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FunctionsIcon from '@mui/icons-material/Functions';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import ApiIcon from '@mui/icons-material/Api';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AICodeReview from '@components/molecules/AICodeReview/AICodeReview';
import AI from './AI/AI';
import ApiSettings from './ApiSettings/ApiSettings';

interface AppDetailsProps {
  app: App;
  blockchain: Blockchains;
  walletAddress: string;
  isDemo: boolean;
  onDeleteClick: () => void;
  onRenameClick: () => void;
}

export default function AppDetails({
  app,
  blockchain,
  walletAddress,
  isDemo = false,
  onDeleteClick,
  onRenameClick,
}: AppDetailsProps) {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab icon={<CloudQueueIcon />} iconPosition="start" label="Deployments" {...tabProperties(0)} />
          <Tab icon={<AnalyticsIcon />} iconPosition="start" label="Analytics" {...tabProperties(1)} />
          <Tab icon={<FunctionsIcon />} iconPosition="start" label="Functions" {...tabProperties(2)} />
          <Tab icon={<CodeIcon />} iconPosition="start" label="Code" {...tabProperties(3)} />
          <Tab icon={<AutoFixHighIcon />} iconPosition="start" label="AI" {...tabProperties(4)} />
          <Tab icon={<ApiIcon />} iconPosition="start" label="API" {...tabProperties(5)} />
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" {...tabProperties(5)} />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <Overview app={app} blockchain={blockchain} walletAddress={walletAddress} isDemo={isDemo} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Analytics app={app} blockchain={blockchain} isDemo={isDemo} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <Functions app={app} blockchain={blockchain} isDemo={isDemo} />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <BuildSource app={app} />
      </TabPanel>
      <TabPanel value={tabIndex} index={4}>
        <AI app={app} />
      </TabPanel>
      <TabPanel value={tabIndex} index={5}>
        <ApiSettings app={app} />
      </TabPanel>
      <TabPanel value={tabIndex} index={6}>
        <AppSettings app={app} onDeleteClick={() => onDeleteClick()} onRenameClick={() => onRenameClick()} />
      </TabPanel>
    </>
  );
}
