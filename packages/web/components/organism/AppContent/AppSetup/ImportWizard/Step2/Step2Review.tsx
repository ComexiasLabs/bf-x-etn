import React, { useState } from 'react';
import styles from './Step2Review.module.scss';
import { App } from '@modules/firebase';
import { Box, Card, CardContent, CardHeader, Chip, Paper, Typography } from '@mui/material';
import { ImportedData } from '@core/entities/importedData';
import { formatDate, formatDate2 } from '@core/helpers/datetimeHelper';

interface Step2ReviewProps {
  app: App;
  importedData: ImportedData;
}

export default function Step2Review({ app, importedData }: Step2ReviewProps) {
  return (
    <div>
      <h4>{app.name} Contract Details</h4>
      <Typography variant="body1">Here are the details we have found, ready for your review.</Typography>
      <Box mt={2}>
        <Card>
          <CardHeader
            title={'Testnet'}
            subheader={`Transaction: ${importedData.testnet.txHash ? importedData.testnet.txHash : 'N/A'}`}
          />
          <CardContent>
            {importedData.testnet.txHash && importedData.testnet.isSuccessful && (
              <>
                <Typography variant="body1" color="InfoText">
                  Contract Address
                </Typography>
                <Typography variant="caption" color="InfoText">
                  {importedData.testnet.data?.contractAddress}
                </Typography>

                <Typography variant="body1" color="InfoText">
                  Wallet Address
                </Typography>
                <Typography variant="caption" color="InfoText">
                  {importedData.testnet.data?.walletAddress}
                </Typography>

                <Typography variant="body1" color="InfoText">
                  Transaction Date
                </Typography>
                <Typography variant="caption" color="InfoText">
                  {formatDate2(importedData.testnet.data?.dateTime)}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box mt={2}>
        <Card>
          <CardHeader
            title={'Mainnet'}
            subheader={`Transaction: ${importedData.mainnet.txHash ? importedData.mainnet.txHash : 'N/A'}`}
          />
          <CardContent>
            {importedData.mainnet.txHash && importedData.mainnet.isSuccessful && (
              <>
                <Typography variant="body1" color="InfoText">
                  Contract Address
                </Typography>
                <Typography variant="caption" color="InfoText">
                  {importedData.mainnet.data?.contractAddress}
                </Typography>

                <Typography variant="body1" color="InfoText">
                  Wallet Address
                </Typography>
                <Typography variant="caption" color="InfoText">
                  {importedData.mainnet.data?.walletAddress}
                </Typography>

                <Typography variant="body1" color="InfoText">
                  Transaction Date
                </Typography>
                <Typography variant="caption" color="InfoText">
                  {formatDate2(importedData.mainnet.data?.dateTime)}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
