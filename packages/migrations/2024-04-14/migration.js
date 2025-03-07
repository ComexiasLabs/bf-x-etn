/**
 * Migration script to copy data from staging-userWallets to staging-userProfile in Firebase Firestore.
 * Description: Migrate all existing UserWallet to UserProfile by copying selected fields.
 */
// Load environment variables
require('dotenv').config({ path: './.env' });

// Required dependencies
const admin = require('firebase-admin');

// Firebase project credentials using environment variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines properly in private keys
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
  console.log('env variables not defined');
  return;
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateUserWalletsToUserProfiles() {
  // const userWalletsRef = db.collection('staging-userWallets');
  // const userProfilesRef = db.collection('staging-userProfile');
  const userWalletsRef = db.collection('prod-userWallets');
  const userProfilesRef = db.collection('prod-userProfile');

  // Retrieve all documents from UserWallets
  const snapshot = await userWalletsRef.get();

  // Array to hold batched write operations
  const batch = db.batch();

  snapshot.forEach(doc => {
    const data = doc.data();

    // Create a new document in UserProfile with selected fields
    const userProfileDoc = userProfilesRef.doc(doc.id);
    batch.set(userProfileDoc, {
      userId: data.userId,
      walletAddress: data.walletAddress,
      createdDateUTC: data.createdDateUTC,
      isDemo: false
    });
  });

  // Commit the batch write to Firestore
  try {
    await batch.commit();
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error writing to Firestore: ', error);
  }
}

// Execute the migration function
migrateUserWalletsToUserProfiles();
