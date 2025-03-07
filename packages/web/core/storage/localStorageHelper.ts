import { Blockchains } from '@core/enums/blockchains';
import { UserWallet } from '@modules/firebase';

class LocalStorageHelper {
  // HELPERS
  clearUserSession(): void {
    this.clearAuthToken();
    this.clearWalletAddress();
    this.clearConnectedChain();
    this.clearUserId();
  }

  // WALLET ADDRESS
  storeWalletAddress(address: string): void {
    window?.localStorage?.setItem(`bf_walletaddress`, address);
  }
  getWalletAddress(): string | null {
    return window?.localStorage?.getItem(`bf_walletaddress`) || null;
  }
  clearWalletAddress(): void {
    window?.localStorage?.removeItem(`bf_walletaddress`);
  }

  // AUTH TOKEN
  storeAuthToken(token: string): void {
    window?.localStorage?.setItem('bf_authToken', token);
  }
  getAuthToken(): string | null {
    return window?.localStorage?.getItem('bf_authToken') || null;
  }
  clearAuthToken(): void {
    window?.localStorage?.removeItem('bf_authToken');
  }
  hasAuthToken(): boolean {
    return this.getAuthToken() !== null;
  }

  // CONNECTED CHAIN
  storeConnectedChain(blockchain: Blockchains): void {
    window?.localStorage?.setItem('bf_connectedChain', blockchain);
  }
  getConnectedChain(): string | null {
    return window?.localStorage?.getItem('bf_connectedChain') || null;
  }
  clearConnectedChain(): void {
    window?.localStorage?.removeItem('bf_connectedChain');
  }

  // USERID
  storeUserId(userId: string): void {
    window?.localStorage?.setItem('bf_userId', userId);
  }
  getUserId(): string | null {
    return window?.localStorage?.getItem('bf_userId') || null;
  }
  clearUserId(): void {
    window?.localStorage?.removeItem('bf_userId');
  }

  // STORAGE WALLET ADDRESS
  storeStorageWallet(address: string): void {
    window?.localStorage?.setItem(`bf_storagewallet`, address);
  }
  getStorageWallet(): string | null {
    return window?.localStorage?.getItem(`bf_storagewallet`) || null;
  }
  clearStorageWallet(): void {
    window?.localStorage?.removeItem(`bf_storagewallet`);
  }

  getStorageWalletAddress(): string | null {
    const storageWallet = this.getStorageWallet();
    if (storageWallet) {
      const wallet = JSON.parse(storageWallet) as UserWallet;
      if (wallet) {
        return wallet.walletAddress;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

export default new LocalStorageHelper();
