import ContentHeader from '@components/molecules/ContentHeader/ContentHeader';
import SideBar from '@components/molecules/SideBar/SideBar';
import { Blockchains } from '@core/enums/blockchains';
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { SelectedMenu } from '@core/enums/menu';
import { App } from '@modules/firebase';
import Dashboard from '@components/organism/Dashboard/Dashboard';
import AppContent from '@components/organism/AppContent/AppContent';
import Wallets from '@components/organism/Wallets/Wallets';
import Storage from '@components/organism/Storage/Storage';
import AddVersionDialog from '@components/dialogs/AddVersionDialog/AddVersionDialog';
import MessageDialogContext from '@components/context/MessageDialogContext';
import ConnectionInfoDialog from '@components/dialogs/ConnectionInfoDialog/ConnectionInfoDialog';
import localStorageHelper from '@core/storage/localStorageHelper';
import SelectBlockchainDialog from '@components/dialogs/SelectBlockchainDialog/SelectBlockchainDialog';

interface MainPanelProps {
  blockchain?: Blockchains;
  walletAddress?: string;
  userId: string;
  isDemo?: boolean;
}

const MainPanel = ({ blockchain, walletAddress, userId, isDemo = false }: MainPanelProps) => {
  const { showMessage } = useContext(MessageDialogContext);

  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>(SelectedMenu.Dashboard);
  const [appListRefreshTrigger, setAppListRefreshTrigger] = useState(0);
  const [selectedApp, setSelectedApp] = useState<App>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [showAddVersionDialog, setShowAddVersionDialog] = useState(false);
  const [showConnectionInfo, setShowConnectionInfo] = useState(false);
  const [showSelectBlockchainDialog, setShowSelectBlockchainDialog] = useState(false);

  const handleSelectMenu = async (selectedMenu: SelectedMenu, selectedApp?: App) => {
    if (isDemo && (selectedMenu === SelectedMenu.Storage || selectedMenu === SelectedMenu.Wallets)) {
      showMessage('Demo mode', 'This feature is not available in demo mode as it requires a connected wallet.');
      return;
    }

    if (selectedMenu === SelectedMenu.Connected) {
      setShowConnectionInfo(true);
      return;
    }

    setSelectedMenu(selectedMenu);
    setSelectedApp(selectedApp);
  };

  const getHeaderTitle = () => {
    if (selectedMenu === SelectedMenu.App) {
      return selectedApp.name;
    } else {
      if (selectedMenu === SelectedMenu.Dashboard) {
        return 'Dashboard';
      }
      if (selectedMenu === SelectedMenu.Wallets) {
        return 'Wallets';
      }
      if (selectedMenu === SelectedMenu.Storage) {
        return 'Storage';
      }
    }
  };

  const getHeaderSubtitle = () => {
    if (selectedMenu === SelectedMenu.App) {
      return 'Version 1.0.0';
    } else {
      if (selectedMenu === SelectedMenu.Dashboard) {
        return 'Overview of your apps';
      }
      if (selectedMenu === SelectedMenu.Wallets) {
        return 'Linked wallets';
      }
      if (selectedMenu === SelectedMenu.Storage) {
        return 'Your files on BNB Greenfield';
      }
    }
  };

  const handleAppListRefresh = () => {
    setAppListRefreshTrigger((prev) => prev + 1);
    handleSelectMenu(SelectedMenu.Dashboard);
  };

  const handleAddVersion = (version: string) => {
    showMessage('Coming Soon', 'Adding new version feature will be available soon.');
  };

  const handleLogout = () => {
    localStorageHelper.clearUserSession();
    location.href = '/';
  };

  const handleSwitchNetwork = () => {
    setShowSelectBlockchainDialog(true);
  };

  const handleOnSelectBlockchain = (selectedBlockchain: Blockchains) => {
    setShowSelectBlockchainDialog(false);
    setShowConnectionInfo(false);

    if (selectedBlockchain === blockchain) {
      return;
    }

    localStorageHelper.clearUserSession();

    if (selectedBlockchain === Blockchains.Fantom) {
      location.href = '/fantom/app/';
    }
    if (selectedBlockchain === Blockchains.BNBChain) {
      location.href = '/bsc/app/';
    }
    if (selectedBlockchain === Blockchains.TRON) {
      location.href = '/tron/app/';
    }
    if (selectedBlockchain === Blockchains.Areon) {
      location.href = '/areon/app/';
    }
    if (selectedBlockchain === Blockchains.Electroneum) {
      location.href = '/electroneum/app/';
    }
  };

  return (
    <>
      <Container fluid>
        <Row className="flex-container">
          <SideBar
            isOpen={isMenuOpen}
            selectedMenu={selectedMenu}
            selectedApp={selectedApp}
            refreshTrigger={appListRefreshTrigger}
            blockchain={blockchain}
            walletAddress={walletAddress}
            isDemo={isDemo}
            onSelectMenu={(selectedMenu, selectedApp) => handleSelectMenu(selectedMenu, selectedApp)}
          />

          <div id="page-content-wrapper">
            <ContentHeader
              title={getHeaderTitle()}
              subtitle={getHeaderSubtitle()}
              onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
              onNewVersionClick={() => setShowAddVersionDialog(true)}
              isMenuOpen={isMenuOpen}
            />
            <div className="page-content">
              {selectedMenu === SelectedMenu.Dashboard && (
                <Dashboard onSelectApp={(app) => handleSelectMenu(SelectedMenu.App, app)} />
              )}
              {selectedMenu === SelectedMenu.Wallets && (
                <Wallets blockchain={blockchain} walletAddress={walletAddress} />
              )}
              {selectedMenu === SelectedMenu.Storage && (
                <Storage blockchain={blockchain} walletAddress={walletAddress} />
              )}
              {selectedMenu === SelectedMenu.App && (
                <AppContent
                  app={selectedApp}
                  blockchain={blockchain}
                  walletAddress={walletAddress}
                  isDemo={isDemo}
                  onDeletedApp={() => handleAppListRefresh()}
                  onRefreshApp={() => handleAppListRefresh()}
                />
              )}
            </div>
          </div>
        </Row>
      </Container>

      <AddVersionDialog
        show={showAddVersionDialog}
        onCancel={() => setShowAddVersionDialog(false)}
        onAddedVersion={(version) => handleAddVersion(version)}
      />

      <ConnectionInfoDialog
        show={showConnectionInfo}
        blockchain={blockchain}
        walletAddress={walletAddress}
        userId={userId}
        isDemo={isDemo}
        onCancel={() => setShowConnectionInfo(false)}
        onLogout={() => handleLogout()}
        onSwitchNetwork={() => handleSwitchNetwork()}
      />

      <SelectBlockchainDialog
        show={showSelectBlockchainDialog}
        onCancel={() => setShowSelectBlockchainDialog(false)}
        onSelect={(blockchain: Blockchains) => handleOnSelectBlockchain(blockchain)}
      />
    </>
  );
};

export default MainPanel;
