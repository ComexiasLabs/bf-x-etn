import { firestore } from './firebaseAdmin';
import { DBCollectionUserWallets } from './collections/userWallets.collections';
import { DBCollectionApps } from './collections/apps.collections';
import { DBCollectionAnalyticsStats } from './collections/analyticsStats.collections';
import { DBCollectionAnalyticsData } from './collections/analyticsData.collections';
import { DBCollectionUserProfile } from './collections/userProfile.collections';

export class FirestoreDB {
  public apps: DBCollectionApps;
  public analyticsStats: DBCollectionAnalyticsStats;
  public analyticsData: DBCollectionAnalyticsData;
  public userWallets: DBCollectionUserWallets;
  public userProfile: DBCollectionUserProfile;

  constructor() {
    this.apps = new DBCollectionApps(firestore);
    this.analyticsStats = new DBCollectionAnalyticsStats(firestore);
    this.analyticsData = new DBCollectionAnalyticsData(firestore);
    this.userWallets = new DBCollectionUserWallets(firestore);
    this.userProfile = new DBCollectionUserProfile(firestore);
  }
}
