import { Config } from '@core/config/config';
import { UserWallet } from '@modules/firebase/models/userWallet';
import { Environments } from '@core/enums/environments';
import { QuerySnapshot } from '@google-cloud/firestore';

export class DBCollectionUserWallets {
  private firestore: FirebaseFirestore.Firestore;
  private userWalletsCollection;

  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
    this.userWalletsCollection =
      Config.environment === Environments.Mainnet ? 'prod-userWallets' : 'staging-userWallets';
  }

  async addUserWallet(userWallet: UserWallet): Promise<void> {
    await this.firestore.collection(this.userWalletsCollection).add(userWallet);
  }

  async getUserWallet(walletAddress: string, blockchain: string): Promise<UserWallet | null> {
    const userRef = this.firestore.collection(this.userWalletsCollection);

    const snapshot: QuerySnapshot = await userRef
      .where('walletAddress', '==', walletAddress)
      .where('blockchain', '==', blockchain)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as UserWallet;

    return data;
  }
}
