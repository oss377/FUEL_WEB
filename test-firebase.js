// test-firebase.js
require('dotenv').config({ path: '.env.local' });

console.log('Testing Firebase Admin Setup...\n');

// Check env vars
if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
  console.error('ERROR: Missing environment variables!');
  process.exit(1);
}

// Process the key
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

console.log('✓ Environment variables loaded');
console.log(`✓ Private key length: ${privateKey.length} characters`);
console.log(`✓ Starts with: ${privateKey.substring(0, 30)}`);
console.log(`✓ Ends with: ${privateKey.substring(privateKey.length - 30)}`);

// Test initialization
try {
  const { initializeApp, cert } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');
  
  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
  
  const auth = getAuth(app);
  console.log('\n✅ SUCCESS: Firebase Admin initialized!');
  
  // Optional: Test with a simple API call
  auth.listUsers(1)
    .then(() => console.log('✅ Connection to Firebase successful!'))
    .catch(err => console.log('⚠️  Connection test failed:', err.message));
    
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error('\nTroubleshooting tips:');
  console.error('1. Ensure private key is on ONE line in .env.local');
  console.error('2. Make sure you have \\n not actual newlines');
  console.error('3. Check if service account has proper permissions');
  console.error('4. Verify project ID is correct');
}