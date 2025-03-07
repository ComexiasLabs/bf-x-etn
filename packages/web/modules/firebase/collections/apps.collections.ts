import { Config } from '@core/config/config';
import { Environments } from '@core/enums/environments';
import { QuerySnapshot } from '@google-cloud/firestore';
import { App } from '@modules/firebase';

export class DBCollectionApps {
  private firestore: FirebaseFirestore.Firestore;
  private appsCollection;

  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
    this.appsCollection = Config.environment === Environments.Mainnet ? 'prod-apps' : 'staging-apps';
  }

  async addApp(app: App): Promise<void> {
    await this.firestore.collection(this.appsCollection).add(app);
  }

  async getAppsByUser(userId: string): Promise<App[]> {
    const appRef = this.firestore.collection(this.appsCollection);
    const snapshot: QuerySnapshot = await appRef.where('userId', '==', userId).get();

    if (snapshot.empty) {
      return [];
    }

    const apps = snapshot.docs.map((doc) => doc.data() as App);
    return apps;
  }

  async getApp(appId: string): Promise<App | null> {
    const appRef = this.firestore.collection(this.appsCollection);
    const snapshot: QuerySnapshot = await appRef.where('appId', '==', appId).get();

    if (snapshot.empty) {
      return null;
    }

    const app = snapshot.docs[0].data() as App;
    return app;
  }

  async updateApp(app: App): Promise<void> {
    const appId = app.appId;

    const snapshot = await this.firestore.collection(this.appsCollection).where('appId', '==', appId).get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await this.firestore.collection(this.appsCollection).doc(doc.id).set(app, { merge: true });
    } else {
      console.log('No document found with the provided appId');
    }
  }

  async deleteApp(appId: string): Promise<void> {
    const appsRef = this.firestore.collection(this.appsCollection);
    const snapshot = await appsRef.where('appId', '==', appId).get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await appsRef.doc(doc.id).delete();
    } else {
      console.log(`No document found with appId: ${appId}`);
    }
  }
}
