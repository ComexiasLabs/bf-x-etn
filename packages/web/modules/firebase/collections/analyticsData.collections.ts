import { Config } from '@core/config/config';
import { Environments } from '@core/enums/environments';
import { QuerySnapshot } from '@google-cloud/firestore';
import { AnalyticsData } from '../models/analyticsData';

export class DBCollectionAnalyticsData {
  private firestore: FirebaseFirestore.Firestore;
  private analyticsDataCollection;

  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
    this.analyticsDataCollection =
      Config.environment === Environments.Mainnet ? 'prod-analyticsData' : 'staging-analyticsData';
  }

  async addAnalyticsData(analyticsData: AnalyticsData): Promise<void> {
    await this.firestore.collection(this.analyticsDataCollection).add(analyticsData);
  }

  async getAnalyticsData(
    appId: string,
    environment: Environments,
    contractAddress: string,
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<AnalyticsData[] | null> {
    const ref = this.firestore.collection(this.analyticsDataCollection);
    const snapshot: QuerySnapshot = await ref
      .where('appId', '==', appId)
      .where('environment', '==', environment)
      .where('contractAddress', '==', contractAddress)
      // .where('transactions.dateTimeUTC', '>=', startTimestamp)
      // .where('transactions.dateTimeUTC', '<=', endTimestamp)
      .get();

    if (snapshot.empty) {
      return [];
    }

    const data = snapshot.docs.map((doc) => doc.data() as AnalyticsData);
    return data;
  }
}
