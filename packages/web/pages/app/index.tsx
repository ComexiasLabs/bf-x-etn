import type { NextPage } from 'next';
import styles from '@styles/App.module.scss';
import PageHead from '@components/templates/PageHead/PageHead';
import { useEffect, useState } from 'react';
import MainPanel from '@components/templates/MainPanel/MainPanel';
import { Button, CircularProgress } from '@mui/material';
import { prepareDemoUser } from '@modules/user/demoHelper';
import localStorageHelper from '@core/storage/localStorageHelper';
import MessageDialog from '@components/dialogs/MessageDialog/MessageDialog';
import MessageDialogContext from '@components/context/MessageDialogContext';

const AppPage: NextPage = () => {
  const [messageDialogTitle, setMessageDialogTitle] = useState('');
  const [messageDialogDescription, setMessageDialogDescription] = useState('');
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  const [isLoadingConnect, setIsLoadingConnect] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(true);
  const [isReady, setIsReady] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [isDemo, setIsDemo] = useState(false);

  const showMessage = (title: string, message: string) => {
    setMessageDialogTitle(title);
    setMessageDialogDescription(message);
    setShowMessageDialog(true);
  };

  const handleTryDemoClick = async () => {
    setIsLoadingDemo(true);

    const demoResult = await prepareDemoUser();
    if (!demoResult.isSuccessful) {
      showMessage(
        'Failed to launch demo',
        'We could not connect you to Block Fabric platform at this time. Please try again later.',
      );
    }

    localStorageHelper.storeAuthToken(demoResult.token);
    localStorageHelper.storeUserId(demoResult.userId);

    setIsUserAuthenticated(demoResult.isSuccessful);
    setUserId(demoResult.userId);
    setIsDemo(true);

    setIsLoadingDemo(false);
  };

  useEffect(() => {
    handleTryDemoClick();
  }, []);

  const handleConnectClick = async () => {
    setIsLoadingConnect(true);

    setIsLoadingConnect(false);
  };

  return (
    <MessageDialogContext.Provider value={{ showMessage }}>
      <div className={styles.container}>
        <PageHead />
        <main className={styles.main}>
          {isLoadingDemo && (
            <div className={styles.introContainer}>
              <div>
                <img src="/assets/blockfabric/bf-logo-dark.svg" alt="BlockFabric" style={{ height: '48px' }} />
              </div>
              <div className={styles.subtitle}>Preparing your demo account</div>
              <p>Your demo should be available shortly.</p>
              <CircularProgress size="1rem" />
            </div>
          )}
          {/* {isReady && !isUserAuthenticated && (
              // <ConnectWallet
              //   blockchain={blockchain}
              //   onConnectClick={() => handleOnConnectClick()}
              //   isLoading={isLoading}
              // />
              <div>
                <Button color="primary" disabled={false} variant="contained" onClick={() => handleTryDemoClick()}>
                  Try Demo
                </Button>
                <Button color="primary" disabled={false} variant="contained" onClick={() => handleConnectClick()}>
                  Connect
                </Button>
              </div>
            )} */}
          {isReady && isUserAuthenticated && <MainPanel userId={userId} isDemo={isDemo} />}
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

export default AppPage;
