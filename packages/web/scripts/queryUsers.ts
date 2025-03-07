import { firestore } from '../modules/firebase/firebaseAdmin';

export async function queryUserProfiles() {
  try {
    const userProfileSnapshot = await firestore.collection('prod-userProfile').get();
    let profiles = [];
    userProfileSnapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    return profiles;
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
}

export async function queryUserWallets() {
  try {
    const userProfileSnapshot = await firestore.collection('prod-userWallets').get();
    let wallets = [];
    userProfileSnapshot.forEach((doc) => {
      wallets.push({ id: doc.id, ...doc.data() });
    });
    return wallets;
  } catch (error) {
    console.error('Error fetching user wallets:', error);
    return [];
  }
}
