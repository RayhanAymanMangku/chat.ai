import admin, { ServiceAccount } from 'firebase-admin';

// Type for our Firebase admin credentials
interface FirebaseAdminConfig extends ServiceAccount {
  databaseURL: string;
}

// Function to get Firebase admin configuration
const getFirebaseAdminConfig = (): FirebaseAdminConfig => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  }
  if (!process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error('Missing FIREBASE_CLIENT_EMAIL');
  }
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('Missing FIREBASE_PRIVATE_KEY');
  }

  return {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  };
};

// Initialize Firebase Admin if it hasn't been initialized already
if (!admin.apps.length) {
  const config = getFirebaseAdminConfig();

  try {
    admin.initializeApp({
      credential: admin.credential.cert(config),
      databaseURL: config.databaseURL,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
}

// Export the Firestore instance
const adminDb = admin.firestore();

// Ensure settings are applied only once
if (!adminDb.settings) {
  adminDb.settings({
    ignoreUndefinedProperties: true,
  });
  
}

// Export auth and other admin services if needed
const adminAuth = admin.auth();

export { adminDb, adminAuth, admin };
export default adminDb;