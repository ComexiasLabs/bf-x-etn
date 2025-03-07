import { Blockchains } from '@core/enums/blockchains';
import React, { useEffect, useState } from 'react';
import styles from './Storage.module.scss';
import StorageBrowser from '@components/organism/StorageBrowser/StorageBrowser';
import { Box, Button } from '@mui/material';
import ManageFilesDialog from '@components/dialogs/ManageFilesDialog/ManageFilesDialog';

interface StorageProps {
  blockchain: Blockchains;
  walletAddress: string;
}

const Storage = ({ blockchain, walletAddress }: StorageProps) => {
  const [showManageDialog, setShowManageDialog] = useState(false);

  const handleManageClick = () => {
    setShowManageDialog(true);
  };

  return (
    <>
      <h3>Storage Browser</h3>
      <StorageBrowser walletAddress={walletAddress} />
      <Box mt={2}>
        <Button variant="outlined" onClick={() => handleManageClick()}>
          Manage Files
        </Button>
      </Box>
      {showManageDialog && <ManageFilesDialog show={showManageDialog} onCancel={() => setShowManageDialog(false)} />}
    </>
  );
};

export default Storage;
