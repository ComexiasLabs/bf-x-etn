import React, { useEffect, useState } from 'react';
import styles from './Step1EnterDetails.module.scss';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Template } from '@core/entities/template';
import { App } from '@modules/firebase';
import { Blockchains, getBlockchainLabel } from '@core/enums/blockchains';

export enum ImportAddressTypes {
  TransactionHash = 'TransactionHash',
  ContractAddress = 'ContractAddress',
}

interface Step1EnterDetailsProps {
  blockchain: Blockchains;
  onAddressTypeUpdated: (addressType: ImportAddressTypes) => void;
  onInputUpdated: (key: string, value: string) => void;
}

export default function Step1EnterDetails({
  blockchain,
  onAddressTypeUpdated,
  onInputUpdated,
}: Step1EnterDetailsProps) {
  const [addressType, setAddressType] = React.useState<ImportAddressTypes>(ImportAddressTypes.TransactionHash);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputUpdated(event.target.id, event.target.value);
  };

  const handleSelectAddressType = (event: React.MouseEvent<HTMLElement>, addressType: ImportAddressTypes) => {
    if (addressType) {
      setAddressType(addressType);
    }
    onAddressTypeUpdated(addressType);
  };

  return (
    <div>
      <h4>Enter Contract Details</h4>

      <div>
        <ToggleButtonGroup value={addressType} exclusive onChange={handleSelectAddressType}>
          <ToggleButton value={ImportAddressTypes.TransactionHash}>Transaction Hash</ToggleButton>
          <ToggleButton value={ImportAddressTypes.ContractAddress}>Contract Address</ToggleButton>
        </ToggleButtonGroup>
      </div>

      {addressType === ImportAddressTypes.TransactionHash && (
        <>
          <div className={styles.inputContainer}>
            <TextField
              id="testnetTxHash"
              label="Testnet Transaction Hash"
              helperText={`The transaction hash of the contract deployment on ${getBlockchainLabel(
                blockchain,
              )} testnet.`}
              variant="outlined"
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <TextField
              id="mainnetTxHash"
              label="Mainnet Transaction Hash"
              helperText={`The transaction hash of the contract deployment on ${getBlockchainLabel(
                blockchain,
              )} mainnet.`}
              variant="outlined"
              onChange={handleInputChange}
            />
          </div>
        </>
      )}

      {addressType === ImportAddressTypes.ContractAddress && (
        <>
          <div className={styles.inputContainer}>
            <TextField
              id="testnetContractAddress"
              label="Testnet Contract Address"
              helperText={`The contract address which has been deployed on ${getBlockchainLabel(blockchain)} testnet.`}
              variant="outlined"
              onChange={handleInputChange}
              disabled
            />
          </div>
          <div className={styles.inputContainer}>
            <TextField
              id="mainnetContractAddress"
              label="Mainnet Contract Name"
              helperText={`The contract address which has been deployed on ${getBlockchainLabel(blockchain)} mainnet.`}
              variant="outlined"
              onChange={handleInputChange}
              disabled
            />
          </div>
        </>
      )}
    </div>
  );
}
