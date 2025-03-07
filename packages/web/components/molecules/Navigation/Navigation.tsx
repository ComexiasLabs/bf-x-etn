import React, { useState } from 'react';
import { Navbar } from 'react-bootstrap';
import styles from './Navigation.module.scss';
import { Blockchains } from '@core/enums/blockchains';
import SelectBlockchainDialog from '@components/dialogs/SelectBlockchainDialog/SelectBlockchainDialog';
import { trackGAEvent } from '@modules/analytics/ga';

const Navigation = () => {
  const [showSelectBlockchainDialog, setShowSelectBlockchainDialog] = useState(false);

  const handleEnterApp = async () => {
    trackGAEvent('Button', 'Click', 'Nav - Enter App');
    setShowSelectBlockchainDialog(true);
  };

  const handleViewDemo = async () => {
    trackGAEvent('Button', 'Click', 'Nav - View Demo');
    location.href = '/app';
  };

  const handleEnterAppCancelled = async () => {
    trackGAEvent('Button', 'Click', 'Nav - Enter App Cancelled');
    setShowSelectBlockchainDialog(false);
  };

  const handleOnSelectBlockchain = async (blockchain: Blockchains) => {
    trackGAEvent('Button', 'Click', `Nav - Select Blockchain - ${blockchain}`);
    setShowSelectBlockchainDialog(false);
    if (blockchain === Blockchains.Fantom) {
      location.href = '/fantom/app/';
    }
    if (blockchain === Blockchains.BNBChain) {
      location.href = '/bsc/app/';
    }
    if (blockchain === Blockchains.TRON) {
      location.href = '/tron/app/';
    }
    if (blockchain === Blockchains.Areon) {
      location.href = '/areon/app/';
    }
    if (blockchain === Blockchains.Electroneum) {
      location.href = '/electroneum/app/';
    }
  };

  return (
    <>
      <Navbar fixed="top" className={styles.nav} collapseOnSelect expand="sm">
        <Navbar.Brand className={styles.brand} href="/">
          <img src="/assets/blockfabric/bf-logo-dark.svg" alt="BlockFabric" />
        </Navbar.Brand>
        <Navbar.Text>
          <a className={styles.linkItemBoldWhite} href="#learn-more">
            OVERVIEW
          </a>
        </Navbar.Text>
        <Navbar.Text>
          <a className={styles.linkItemBoldWhite} href="#github">
            BUILD
          </a>
        </Navbar.Text>
        <Navbar.Text>
          <a className={styles.linkItemBoldWhite} href="#ai">
            AI
          </a>
        </Navbar.Text>
        <Navbar.Text>
          <a className={styles.linkItemBoldWhite} href="#analytics">
            ANALYTICS
          </a>
        </Navbar.Text>
        <Navbar.Text>
          <a className={styles.linkItemBoldWhite} href="#pricing">
            PRICING
          </a>
        </Navbar.Text>
        <Navbar.Toggle aria-controls="navbar-scroll" data-bs-target="navbar-scroll" />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <a className={styles.linkItemBoldWhite} href="https://docs.blockfabric.dev">
              DOCS
            </a>
          </Navbar.Text>
          <Navbar.Text>
            <a className={styles.linkItemBoldWhite} onClick={() => handleViewDemo()}>
              DEMO
            </a>
          </Navbar.Text>
          <Navbar.Text>
            <a className={styles.linkItemBoldWhite} onClick={() => handleEnterApp()}>
              CONNECT
            </a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>

      <SelectBlockchainDialog
        show={showSelectBlockchainDialog}
        onCancel={() => handleEnterAppCancelled()}
        onSelect={(blockchain: Blockchains) => handleOnSelectBlockchain(blockchain)}
      />
    </>
  );
};

export default Navigation;
