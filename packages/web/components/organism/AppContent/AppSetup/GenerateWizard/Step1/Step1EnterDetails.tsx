import React, { useEffect, useState } from 'react';
import styles from './Step1EnterDetails.module.scss';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { Template } from '@core/entities/template';
import { App } from '@modules/firebase';

interface Step1EnterDetailsProps {
  app: App;
  template: Template;
  onInputUpdated: (key: string, value: string) => void;
}

export default function Step1EnterDetails({ app, template, onInputUpdated }: Step1EnterDetailsProps) {

  return (
    <div>
      <h4>About your contract do</h4>

      <div>
        <TextField
          id="contractName"
          label="Describe what your contract do"
          defaultValue={''}
          helperText=""
          variant="outlined"
          required
          fullWidth
        />
      </div>

    </div>
  );
}
