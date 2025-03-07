import type { NextPage } from 'next';
import styles from '@styles/Dashboard.module.scss';
import PageHead from '@components/templates/PageHead/PageHead';
import { useEffect, useState } from 'react';
import { Blockchains } from '@core/enums/blockchains';
import MessageDialog from '@components/dialogs/MessageDialog/MessageDialog';
import MessageDialogContext from '@components/context/MessageDialogContext';
import MainPanel from '@components/templates/MainPanel/MainPanel';
import logger from '@core/logger/logger';
import { authenticateUser } from '@modules/user/userHelper';
import ConnectWallet from '@components/molecules/ConnectWallet/ConnectWallet';
import localStorageHelper from '@core/storage/localStorageHelper';
import { createBlockchainProvider } from '@modules/blockchains/blockchains';
import { TronNetworks } from '@modules/blockchains/tron';

const TronAppPage: NextPage = () => {
  const blockchain = Blockchains.TRON;

  const blockchainProvider = createBlockchainProvider(blockchain as Blockchains);

  const [messageDialogTitle, setMessageDialogTitle] = useState('');
  const [messageDialogDescription, setMessageDialogDescription] = useState('');
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [hasReconnected, setHasReconnected] = useState(false);

  const showMessage = (title: string, message: string) => {
    setMessageDialogTitle(title);
    setMessageDialogDescription(message);
    setShowMessageDialog(true);
  };

  useEffect(() => {
    if (hasReconnected) return;

    const init = async () => {
      const localWalletAddress = localStorageHelper.getWalletAddress();
      if (localWalletAddress) {
        await reconnect();
      }

      setIsReady(true);
    };
    init();
  }, [hasReconnected]);

  const reconnect = async () => {
    const walletConnected = await blockchainProvider.isWalletConnected();

    if (walletConnected) {
      const wallet = await blockchainProvider.getWallet();
      const network = blockchainProvider.getConnectedNetwork();
      if (network !== TronNetworks.Mainnet && network !== TronNetworks.Testnet) {
        if (network === TronNetworks.TestnetShasta) {
          showMessage(
            'Shasta Testnet Not Supported',
            'Your wallet is connected to Shasta Testnet which is not yet supported on BlockFabric. Please try switching to Nile Testnet.',
          );
          return;
        }
        showMessage(
          'Not connected to TRON',
          'Your wallet is connected to a different chain. Please switch your network in order to sign in to Block Fabric for TRON.',
        );
        return;
      }

      logger.logInfo('reconnect', 'Wallet connected on address ' + wallet.address);

      setIsWalletConnected(true);
      if (walletAddress !== wallet.address) {
        setWalletAddress(wallet.address);
      }

      localStorageHelper.storeWalletAddress(wallet.address);

      setIsLoading(true);
      const authResult = await authenticateUser(blockchain, walletAddress);
      // if (!authResult.isSuccessful) {
      //   showMessage(
      //     'Failed to connect',
      //     'We could not connect you to Block Fabric platform at this time. Please try again later.',
      //   );
      // }

      localStorageHelper.storeAuthToken(authResult.token);
      localStorageHelper.storeUserId(authResult.userId);

      setIsUserAuthenticated(authResult.isSuccessful);
      setUserId(authResult.userId);

      setHasReconnected(true);
      setIsLoading(false);
    } else {
      logger.logInfo('reconnect', 'Wallet not connected.');
    }
  };

  const handleOnConnectClick = async () => {
    if (!blockchainProvider.isProviderAvailable()) {
      showMessage(
        'Install TronLink',
        'TronLink extension is not installed. Please install it from the Chrome Web Store.',
      );
      return;
    }
    if (!blockchainProvider.isWalletReady()) {
      showMessage(
        'Open TronLink Extension First',
        'TronLink is not connected. Please open the extension and connect to a wallet.',
      );
      return;
    }

    // await blockchainProvider.connectWallet();
    const wallet = await blockchainProvider.getWallet();
    const walletAddress = wallet?.address;

    const network = blockchainProvider.getConnectedNetwork();
    if (network !== TronNetworks.Mainnet && network !== TronNetworks.Testnet) {
      if (network === TronNetworks.TestnetShasta) {
        showMessage(
          'Shasta Testnet Not Supported',
          'Your wallet is connected to Shasta Testnet which is not yet supported on BlockFabric. Please try switching to Nile Testnet.',
        );
        return;
      }
      showMessage(
        'Not connected to TRON',
        'Your wallet is connected to a different chain. Please switch your network in order to sign in to Block Fabric for TRON.',
      );
      return;
    }

    if (walletAddress) {
      localStorageHelper.storeWalletAddress(walletAddress);
      localStorageHelper.storeConnectedChain(blockchain);
      setWalletAddress(walletAddress);
      setHasReconnected(false);
      await reconnect();
      setIsReady(true);
    }
  };

  return (
    <MessageDialogContext.Provider value={{ showMessage }}>
      <div className={styles.container}>
        <PageHead />
        <main className={styles.main}>
          {isReady && (!isWalletConnected || !isUserAuthenticated) && (
            <ConnectWallet
              blockchain={blockchain}
              onConnectClick={() => handleOnConnectClick()}
              isLoading={isLoading}
            />
          )}
          {isReady && isWalletConnected && isUserAuthenticated && (
            <MainPanel blockchain={blockchain} walletAddress={walletAddress} userId={userId} />
          )}
        </main>
        {showMessageDialog && (
          <MessageDialog
            show={true}
            title={messageDialogTitle}
            description={messageDialogDescription}
            onClose={() => setShowMessageDialog(false)}
          />
        )}
      </div>
    </MessageDialogContext.Provider>
  );
};

export default TronAppPage;
