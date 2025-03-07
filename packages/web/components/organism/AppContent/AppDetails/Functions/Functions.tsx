import React, { useState } from 'react';
import styles from './Functions.module.scss';
import { Box, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { App, AppCreationModes } from '@modules/firebase';
import InvokeFunctionDialog, { ViewOrTransact } from '@components/dialogs/InvokeFunctionDialog/InvokeFunctionDialog';
import { Blockchains } from '@core/enums/blockchains';
import MethodItem from './MethodItem';
import { Environments } from '@core/enums/environments';
import useCheckContracts from 'hooks/useCheckContracts';

interface FunctionsProps {
  app: App;
  blockchain: Blockchains;
  isDemo: boolean;
}

export default function Functions({ app, blockchain, isDemo }: FunctionsProps) {
  const [showInvokeDialog, setShowInvokeDialog] = useState(false);
  const [invokeMethodName, setInvokeMethodName] = useState('');
  const [invokeArgs, setInvokeArgs] = useState<any[]>([]);
  const [viewOrTransact, setViewOrTransact] = useState<ViewOrTransact>();
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<Environments>(null);

  const {
    isLoading: isCheckContractsLoading,
    isTestnetDeployed,
    isMainnetDeployed,
    updatedApp,
  } = useCheckContracts(app, blockchain, isDemo);

  const contractAbi = app.contractAbi;

  const parseContractAbi = (contractAbi) => {
    if (!contractAbi) {
      return null;
    }

    return contractAbi.filter((item) => item.type === 'function');
  };

  const [parsedAbi, setParsedAbi] = useState(parseContractAbi(contractAbi));

  const handleInvoke = (methodName: string, args: any[], stateMutability: ViewOrTransact) => {
    setInvokeMethodName(methodName);
    setViewOrTransact(stateMutability);
    setInvokeArgs(args);
    setShowInvokeDialog(true);
  };

  const handleSelectEnvironment = (event: React.MouseEvent<HTMLElement>, environment: Environments | null) => {
    setSelectedEnvironment(environment);
  };

  return (
    <div className={styles.container}>
      {app.appCreationMode === AppCreationModes.Import && (
        <Box mb={2}>
          <Alert severity="warning">This feature is currently not available for imported contracts.</Alert>
        </Box>
      )}

      {app.appCreationMode === AppCreationModes.Template && (
        <Box mb={2}>
          <ToggleButtonGroup value={selectedEnvironment} exclusive onChange={handleSelectEnvironment}>
            <ToggleButton value={Environments.Testnet} disabled={!isTestnetDeployed}>
              Testnet
            </ToggleButton>
            <ToggleButton value={Environments.Mainnet} disabled={!isMainnetDeployed}>
              Mainnet
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {parsedAbi &&
        parsedAbi.map((func, index) => {
          return (
            <MethodItem
              key={index}
              func={func}
              onInvoke={(methodName, args) =>
                handleInvoke(methodName, args, func.stateMutability === 'view' ? 'View' : 'Transact')
              }
            />
          );
        })}

      {showInvokeDialog && (
        <InvokeFunctionDialog
          show={showInvokeDialog}
          app={app}
          blockchain={blockchain}
          methodName={invokeMethodName}
          viewOrTransact={viewOrTransact}
          args={invokeArgs}
          isDemo={isDemo}
          onCancel={() => setShowInvokeDialog(false)}
        />
      )}
    </div>
  );
}
