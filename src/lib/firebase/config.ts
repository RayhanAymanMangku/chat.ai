import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function initializeFirebaseApp(): FirebaseApp {
  try {
    if (!firebaseConfig.apiKey) {
      throw new Error('Firebase API key is missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your environment variables.');
    }

    if (getApps().length > 0) {
      console.log("Using existing Firebase app.");
      return getApp();
    } else {
      console.log("Initializing new Firebase app...");
      return initializeApp(firebaseConfig);
    }
  } catch (error) {
    console.error("Error initializing Firebase app:", error);
    throw error;
  }
}