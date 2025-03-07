import { useState, useEffect } from 'react';
import { isAppDeployedToEnvironment } from '@core/helpers/appHelper';
import { Environments } from '@core/enums/environments';
import { App } from '@modules/firebase/models/app';
import { createBlockchainProvider } from '@modules/blockchains/blockchains';
import { Blockchains } from '@core/enums/blockchains';
import { updateApp } from '@services/web/appService';

const useCheckContracts = (app: App, blockchain: Blockchains, isDemo: boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updatedApp, setUpdatedApp] = useState(app);
  const [isTestnetDeployed, setIsTestnetDeployed] = useState(false);
  const [isMainnetDeployed, setIsMainnetDeployed] = useState(false);

  const checkContracts = async () => {
    if (isDemo) {
      setIsTestnetDeployed(true);
      setIsMainnetDeployed(true);
      setIsLoading(false);
      return;
    }

    if (!updatedApp) {
      return;
    }

    if (!app.deployments) {
      setIsTestnetDeployed(false);
      setIsMainnetDeployed(false);
      return;
    }

    setIsLoading(true);

    const blockchainProvider = createBlockchainProvider(blockchain);

    setIsTestnetDeployed(isAppDeployedToEnvironment(app, Environments.Testnet));
    setIsMainnetDeployed(isAppDeployedToEnvironment(app, Environments.Mainnet));

    let hasUpdate = false;

    await Promise.all(
      app.deployments.map(async (item) => {
        if (item.transactionHash && !item.contractAddress) {
          hasUpdate = true;
          const transactionInfo = await blockchainProvider.retrieveTransactionInfo(
            item.environment,
            item.transactionHash,
          );
          item.contractAddress = transactionInfo.contractAddress;
        }
      }),
    );

    if (hasUpdate) {
      await updateApp({ app });
      setUpdatedApp(app);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    console.log(`[useCheckContracts] useEffect.`);
    if (blockchain) {
      checkContracts();
    }
  }, [app]);

  return { isLoading, isTestnetDeployed, isMainnetDeployed, updatedApp };
};

export default useCheckContracts;
