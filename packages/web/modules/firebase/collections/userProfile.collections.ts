import { Config } from '@core/config/config';
import { UserProfile } from '@modules/firebase/models/userProfile';
import { Environments } from '@core/enums/environments';
import { QuerySnapshot } from '@google-cloud/firestore';

export class DBCollectionUserProfile {
  private firestore: FirebaseFirestore.Firestore;
  private userProfileCollection;

  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
    this.userProfileCollection =
      Config.environment === Environments.Mainnet ? 'prod-userProfile' : 'staging-userProfile';
  }

  async addUserProfile(userProfile: UserProfile): Promise<void> {
    await this.firestore.collection(this.userProfileCollection).add(userProfile);
  }

  async getUserProfileByWallet(walletAddress: string): Promise<UserProfile | null> {
    const userRef = this.firestore.collection(this.userProfileCollection);

    const snapshot: QuerySnapshot = await userRef.where('walletAddress', '==', walletAddress).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as UserProfile;

    return data;
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
    const userRef = this.firestore.collection(this.userProfileCollection);

    const snapshot: QuerySnapshot = await userRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as UserProfile;

    return data;
  }
}
