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
import { BscNetworks } from '@modules/blockchains/bsc';

const BSCAppPage: NextPage = () => {
  const blockchain = Blockchains.BNBChain;

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

  const showMessage = (title: string, message: string) => {
    setMessageDialogTitle(title);
    setMessageDialogDescription(message);
    setShowMessageDialog(true);
  };

  useEffect(() => {
    const init = async () => {
      const reconnect = async () => {
        const walletConnected = await blockchainProvider.isWalletConnected();
        if (walletConnected) {
          const wallet = await blockchainProvider.getWallet();
          const network = blockchainProvider.getConnectedNetwork();
          if (network !== BscNetworks.Mainnet && network !== BscNetworks.Testnet) {
            showMessage(
              'Not connected to BNB Smart Chain',
              'Your wallet is connected to a different chain. Please switch to BSC in order to sign in to Block Fabric for BNB Smart Chain.',
            );
            return;
          }

          logger.logInfo('reconnect', 'Wallet connected on address ' + wallet.address);

          setIsWalletConnected(true);
          if (walletAddress !== wallet.address) {
            setWalletAddress(wallet.address);
          }

          localStorageHelper.storeWalletAddress(walletAddress);

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

          setIsLoading(false);
        } else {
          logger.logInfo('reconnect', 'Wallet not connected.');
        }
      };

      if (localStorageHelper.getWalletAddress()) {
        reconnect();
      }

      setIsReady(true);
    };
    init();
  }, [walletAddress]);

  const handleOnConnectClick = async () => {
    if (!blockchainProvider.isProviderAvailable()) {
      showMessage(
        'Install MetaMask',
        'MetaMask extension is not installed. Please install it from the Chrome Web Store.',
      );
      return;
    }
    if (!blockchainProvider.isWalletReady()) {
      showMessage(
        'Open MetaMask Extension First',
        'MetaMask is not connected. Please open the extension and connect to a wallet.',
      );
      return;
    }

    await blockchainProvider.connectWallet();
    const wallet = await blockchainProvider.getWallet();
    const walletAddress = wallet?.address;

    const network = blockchainProvider.getConnectedNetwork();
    if (network !== BscNetworks.Mainnet && network !== BscNetworks.Testnet) {
      showMessage(
        'Not connected to BNB Smart Chain',
        'Your wallet is connected to a different chain. Please switch to BSC in order to sign in to Block Fabric for BNB Smart Chain.',
      );
      return;
    }

    if (walletAddress) {
      localStorageHelper.storeWalletAddress(walletAddress);
      localStorageHelper.storeConnectedChain(blockchain);
      setWalletAddress(walletAddress);
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

export default BSCAppPage;
