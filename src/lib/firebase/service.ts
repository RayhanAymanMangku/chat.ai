import { getFirestore, Firestore } from 'firebase/firestore';
import { initializeFirebaseApp } from './config';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseApp = initializeFirebaseApp();
const db: Firestore = getFirestore(firebaseApp);
const adminDb = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();


export { db, adminDb, auth, googleProvider };