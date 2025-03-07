import React, { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import styles from './SideBar.module.scss';
import { App, AppCreationModes, AppStatuses } from '@modules/firebase';
import CreateAppDialog from '@components/dialogs/CreateAppDialog/CreateAppDialog';
import { SelectedMenu } from '@core/enums/menu';
import { fetchDapps } from '@services/web/appService';
import { getBlockchainLogoImage, maskWalletAddress } from '@modules/blockchains/blockchainHelper';
import { Blockchains } from '@core/enums/blockchains';
import FlatCardItem from '@components/atoms/FlatCardItem/FlatCardItem';

interface SideBarProps {
  isOpen: boolean;
  selectedMenu: SelectedMenu;
  selectedApp: App;
  refreshTrigger: number;
  blockchain?: Blockchains;
  walletAddress?: string;
  isDemo: boolean;
  onSelectMenu: (selectedMenu: SelectedMenu, selectedApp?: App) => void;
}

const SideBar = ({
  isOpen,
  selectedMenu,
  selectedApp,
  refreshTrigger,
  blockchain,
  walletAddress,
  isDemo = false,
  onSelectMenu,
}: SideBarProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCreateAppDialog, setShowCreateAppDialog] = useState(false);
  const [apps, setApps] = useState<App[]>();

  useEffect(() => {
    loadApps();
  }, [refreshTrigger]);

  const loadApps = async () => {
    setIsLoading(true);

    const userApps: App[] = await fetchDapps();

    setApps(userApps);

    setIsLoading(false);
  };

  const handleNewConversationClick = () => {
    setShowCreateAppDialog(true);
  };

  const handleCreatedApp = async (name: string) => {
    setShowCreateAppDialog(false);

    await loadApps();
  };

  const handleSelectMenu = (menu: SelectedMenu) => {
    onSelectMenu && onSelectMenu(menu);
  };

  const handleSelectApp = (app: App) => {
    onSelectMenu && onSelectMenu(SelectedMenu.App, app);
  };

  const getAppSubtitle = (app: App) => {
    if (app.status === AppStatuses.PendingContract) {
      return 'Pending contract creation';
    }
    if (app.appCreationMode === AppCreationModes.Template) {
      return 'Created from template';
    }
    if (app.appCreationMode === AppCreationModes.GitHub) {
      return 'Created from GitHub';
    }
    if (app.appCreationMode === AppCreationModes.Import) {
      return 'Imported from deployed contract';
    }
  };

  return (
    <>
      <div id="sidebar-wrapper" style={{ marginLeft: `${isOpen ? '0' : '-360px'}` }}>
        <div className="sidebar">
          <a href="/">
            <img src="/assets/blockfabric/bf-logo-dark.svg" alt="BlockFabric" width={150} />
          </a>
          {isLoading && (
            <nav className="tree-nav">
              <Skeleton className={styles.skeletonLoader} variant="rounded" height={60} animation="wave" />
              <Skeleton className={styles.skeletonLoader} variant="rounded" height={60} animation="wave" />
              <Skeleton className={styles.skeletonLoader} variant="rounded" height={60} animation="wave" />
            </nav>
          )}
          {isDemo && (
            <a onClick={() => handleSelectMenu(SelectedMenu.Connected)} style={{ cursor: 'pointer' }}>
              <FlatCardItem
                name={`Demo mode`}
                description={`You are in demo mode`}
                iconImage={null}
                isSelected={selectedMenu === SelectedMenu.Connected}
              />
            </a>
          )}
          {blockchain && (
            <a onClick={() => handleSelectMenu(SelectedMenu.Connected)} style={{ cursor: 'pointer' }}>
              <FlatCardItem
                name={`Connected to ${blockchain}`}
                description={maskWalletAddress(walletAddress)}
                iconImage={getBlockchainLogoImage(blockchain)}
                isSelected={selectedMenu === SelectedMenu.Connected}
              />
            </a>
          )}
          <a onClick={() => handleSelectMenu(SelectedMenu.Dashboard)} style={{ cursor: 'pointer' }}>
            <FlatCardItem name="Dashboard" description="" isSelected={selectedMenu === SelectedMenu.Dashboard} />
          </a>
          <a onClick={() => handleSelectMenu(SelectedMenu.Wallets)} style={{ cursor: 'pointer' }}>
            <FlatCardItem name="Wallets" description="" isSelected={selectedMenu === SelectedMenu.Wallets} />
          </a>
          <a onClick={() => handleSelectMenu(SelectedMenu.Storage)} style={{ cursor: 'pointer' }}>
            <FlatCardItem name="Storage" description="" isSelected={selectedMenu === SelectedMenu.Storage} />
          </a>
          <hr />
          <h6 className="text-center">Your Apps</h6>
          {!isLoading && (
            <nav className="tree-nav">
              {apps?.map((app) => {
                return (
                  <a key={app.appId} onClick={() => handleSelectApp(app)} style={{ cursor: 'pointer' }}>
                    <FlatCardItem
                      name={app.name}
                      description={getAppSubtitle(app)}
                      isSelected={selectedMenu === SelectedMenu.App && app.appId === selectedApp?.appId}
                    />
                  </a>
                );
              })}
              <a className="tree-nav__item-title highlight" onClick={() => handleNewConversationClick()}>
                CREATE NEW APP
              </a>
            </nav>
          )}
        </div>
      </div>
      {showCreateAppDialog && (
        <CreateAppDialog
          show={true}
          onCancel={() => setShowCreateAppDialog(false)}
          onCreated={(name) => handleCreatedApp(name)}
        />
      )}
    </>
  );
};

export default SideBar;
