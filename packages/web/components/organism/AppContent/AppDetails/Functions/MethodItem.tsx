import React, { useState } from 'react';
import styles from './MethodItem.module.scss';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

interface MethodItemProps {
  func: any;
  onInvoke: (methodName: string, args: any) => void;
}

export default function MethodItem({ func, onInvoke }: MethodItemProps) {
  const [invokeArgs, setInvokeArgs] = useState<any[]>([]);

  const handleInputChange = (index: number, value: any) => {
    setInvokeArgs((prevArgs) => {
      const newArgs = [...prevArgs];
      newArgs[index] = value;
      return newArgs;
    });
  };

  const handleInvoke = () => {
    onInvoke(func.name, invokeArgs);
  };

  return (
    <Accordion sx={{ marginBottom: '20px' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {func.name} <span className={styles.muted}>{func.stateMutability === 'view' ? 'View' : 'Transaction'}</span>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {func.inputs.map((input, inputIndex) => (
            <TextField
              key={inputIndex}
              label={input.name}
              helperText={`Type: ${input.type}`}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => handleInputChange(inputIndex, e.target.value)}
            />
          ))}
        </Box>
        <div className={styles.buttonContainer}>
          <Button variant="outlined" onClick={() => handleInvoke()}>
            Invoke <ArrowRightIcon />
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
