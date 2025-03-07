// Import the Firestore instance from your specified path
import { firestore } from '../modules/firebase/firebaseAdmin';

export async function queryApps() {
  try {
    const appSnapshot = await firestore.collection('prod-apps').get();
    let apps = [];
    appSnapshot.forEach((doc) => {
      const data = doc.data();
      apps.push({
        id: doc.id,
        appId: data.appId,
        name: data.name,
        status: data.status,
        createdDateUTC: data.createdDateUTC,
        userId: data.userId,
        appCreationMode: data.appCreationMode,
      });
    });
    return apps;
  } catch (error) {
    console.error('Error fetching apps:', error);
    return [];
  }
}
