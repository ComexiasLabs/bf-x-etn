import { Config } from '@core/config/config';
import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Reference: https://firebase.google.com/docs/reference/admin/node/firebase-admin.app.md#cert
let firestore;
const apps = getApps();
if (!apps.length) {
  const firebaseApp = initializeApp({
    credential: cert({
      projectId: Config.firebaseProjectId,
      clientEmail: Config.firebaseClientEmail,
      privateKey: (Config.firebasePrivateKey as string).replace(/\\n/g, '\n'),
    }),
  });
  firestore = getFirestore(firebaseApp);
} else {
  firestore = getFirestore(apps[0]);
}

export { firestore };
