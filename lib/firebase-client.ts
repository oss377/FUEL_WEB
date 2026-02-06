import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  sendPasswordResetEmail
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth, sendPasswordResetEmail };

// Helper functions
export const loginWithCustomToken = async (customToken: string) => {
  try {
    const userCredential = await signInWithCustomToken(auth, customToken);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error: any) {
    console.error('Login with custom token error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};