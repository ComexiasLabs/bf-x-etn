import { Config } from '@core/config/config';
import { Environments } from '@core/enums/environments';
import { QuerySnapshot } from '@google-cloud/firestore';
import { AnalyticsStats } from '../models/analyticsStats';

export class DBCollectionAnalyticsStats {
  private firestore: FirebaseFirestore.Firestore;
  private analyticsStatsCollection;

  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
    this.analyticsStatsCollection =
      Config.environment === Environments.Mainnet ? 'prod-analyticsStats' : 'staging-analyticsStats';
  }

  async addAnalyticsStats(analyticsStats: AnalyticsStats): Promise<void> {
    await this.firestore.collection(this.analyticsStatsCollection).add(analyticsStats);
  }

  async getAnalyticsStats(
    appId: string,
    environment: Environments,
    contractAddress: string,
  ): Promise<AnalyticsStats | null> {
    const ref = this.firestore.collection(this.analyticsStatsCollection);
    const snapshot: QuerySnapshot = await ref
      .where('appId', '==', appId)
      .where('environment', '==', environment)
      .where('contractAddress', '==', contractAddress)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const app = snapshot.docs[0].data() as AnalyticsStats;
    return app;
  }

  async updateAnalyticsStats(analyticsStats: AnalyticsStats): Promise<void> {
    const ref = this.firestore.collection(this.analyticsStatsCollection);
    const snapshot = await ref
      .where('appId', '==', analyticsStats.appId)
      .where('environment', '==', analyticsStats.environment)
      .where('contractAddress', '==', analyticsStats.contractAddress)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await this.firestore.collection(this.analyticsStatsCollection).doc(doc.id).set(analyticsStats, { merge: true });
    } else {
      console.log('No document found with the provided appId');
    }
  }

  async deleteAnalyticsStats(appId: string, environment: Environments, contractAddress: string): Promise<void> {
    const ref = this.firestore.collection(this.analyticsStatsCollection);
    const snapshot = await ref
      .where('appId', '==', appId)
      .where('environment', '==', environment)
      .where('contractAddress', '==', contractAddress)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await ref.doc(doc.id).delete();
    } else {
      console.log(`No document found with contractAddress: ${contractAddress}`);
    }
  }
}
