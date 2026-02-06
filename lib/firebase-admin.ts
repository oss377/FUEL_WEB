import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const adminApp = getApps()[0] || initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/\\n/g, '\n'),      // Convert \n to actual newlines
  }),
});

// Export instances
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export { adminApp };