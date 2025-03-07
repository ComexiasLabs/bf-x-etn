import React, { useEffect, useState } from 'react';
import styles from './Step1EnterDetails.module.scss';
import { TextField } from '@mui/material';
import { Blockchains } from '@core/enums/blockchains';

interface Step1EnterDetailsProps {
  blockchain: Blockchains;
  onInputUpdated: (key: string, value: string) => void;
}

export default function Step1EnterDetails({ blockchain, onInputUpdated }: Step1EnterDetailsProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputUpdated(event.target.id, event.target.value);
  };

  return (
    <div>
      <h4>Enter Repository Details</h4>

      <div className={styles.inputContainer}>
        <TextField
          id="repoUrl"
          label="Public Repository URL"
          helperText={`Example: https://github.com/ComexiasLabs/blockfabric-templates`}
          variant="outlined"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
