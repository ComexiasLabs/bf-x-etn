import { Blockchains } from '@core/enums/blockchains';
import { Environments } from '@core/enums/environments';
import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, Button, Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './Wallets.module.scss';
import { UserWallet } from '@modules/firebase/models/userWallet';
import { fetchUserWallet } from '@services/web/userService';
import { formatDate, getCurrentTimestamp } from '@core/helpers/datetimeHelper';
import localStorageHelper from '@core/storage/localStorageHelper';
import LinkWalletDialog from '@components/dialogs/LinkWalletDialog/LinkWallet';

interface WalletsProps {
  blockchain: Blockchains;
  walletAddress: string;
}

const Wallets = ({ blockchain, walletAddress }: WalletsProps) => {
  const [showLinkWalletDialog, setShowLinkWalletDialog] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userWallets, setUserWallets] = useState<UserWallet[]>();
  const [storageWallets, setStorageWallets] = useState<UserWallet[]>();
  const [userId, setUserId] = useState(localStorageHelper.getUserId);

  useEffect(() => {
    // TODO: change to fetch all wallets
    loadUserWallets();
    loadStorageWallet();
  }, []);

  const loadUserWallets = async () => {
    setIsLoading(true);

    const wallet: UserWallet = await fetchUserWallet(walletAddress, blockchain);

    setUserWallets([wallet]);

    setIsLoading(false);
  };

  const loadStorageWallet = async () => {
    const storageWalletAddress = localStorageHelper.getStorageWallet();
    if (!storageWalletAddress) {
      setStorageWallets([]);
    } else {
      setStorageWallets([JSON.parse(storageWalletAddress)]);
    }
  };

  const handleLinkWalletSave = (address) => {
    const storageWallet: UserWallet = {
      userId,
      walletAddress: address,
      blockchain: Blockchains.BNBGreenfield,
      createdDateUTC: getCurrentTimestamp(),
    };
    localStorageHelper.storeStorageWallet(JSON.stringify(storageWallet));
    loadStorageWallet();
    setShowLinkWalletDialog(false);
  };

  const handleUnlinkWallet = () => {
    localStorageHelper.clearStorageWallet();
    loadStorageWallet();
  };

  return (
    <>
      <h3>Linked Wallets</h3>
      <div className="mb-4">
        Wallets linked to your Block Fabric account <Chip label={userId} variant="outlined" />
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Wallet table">
          <TableHead>
            <TableRow>
              <TableCell>Blockchain</TableCell>
              <TableCell>Wallet Address</TableCell>
              <TableCell>Connected Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userWallets &&
              userWallets.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{row.blockchain}</TableCell>
                  <TableCell>{row.walletAddress}</TableCell>
                  <TableCell>{formatDate(row.createdDateUTC)}</TableCell>
                </TableRow>
              ))}
            {storageWallets &&
              storageWallets.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>Greenfield</TableCell>
                  <TableCell>{row.walletAddress}</TableCell>
                  <TableCell>{formatDate(row.createdDateUTC)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className={styles.buttonContainer}>
        {storageWallets && storageWallets.length > 0 && (
          <Button variant="contained" onClick={() => handleUnlinkWallet()}>
            Unlink storage wallet
          </Button>
        )}
        {!storageWallets ||
          (storageWallets.length <= 0 && (
            <Button variant="contained" onClick={() => setShowLinkWalletDialog(true)}>
              Link storage wallet
            </Button>
          ))}
      </div>

      {showLinkWalletDialog && (
        <LinkWalletDialog
          show={showLinkWalletDialog}
          onCancel={() => setShowLinkWalletDialog(false)}
          onSave={(version) => handleLinkWalletSave(version)}
        />
      )}
    </>
  );
};

export default Wallets;
