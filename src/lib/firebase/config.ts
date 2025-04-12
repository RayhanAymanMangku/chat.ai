
import { initializeApp, getApps, FirebaseApp, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

declare global {
  // eslint-disable-next-line no-var
  var firebaseApp: FirebaseApp | undefined;
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function createFirebaseApp(): FirebaseApp {
  try {
    if (!firebaseConfig.apiKey) {
      console.error('Firebase API key is missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your environment variables.');
      throw new Error('Firebase API key is missing');
    }

    if (getApps().length) {
      return getApp();
    } else {
      return initializeApp(firebaseConfig);
    }
  } catch (error) {
    console.error('Error initializing Firebase app:', error);
    throw error;
  }
}

const firebaseApp = globalThis.firebaseApp ?? createFirebaseApp();
if (process.env.NODE_ENV !== 'production') {
  globalThis.firebaseApp = firebaseApp;
}

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export { firebaseApp, auth, googleProvider };

