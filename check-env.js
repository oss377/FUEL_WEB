// check-env.js - Simple environment checker
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Firebase Environment Setup...\n');

// Try to read .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const equalsIndex = line.indexOf('=');
    if (equalsIndex !== -1) {
      const key = line.substring(0, equalsIndex).trim();
      const value = line.substring(equalsIndex + 1).trim();
      // Remove surrounding quotes
      envVars[key] = value.replace(/^["']|["']$/g, '');
    }
  }
});

// Check required variables
console.log('1. Required Environment Variables:');
const required = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
let allPresent = true;

required.forEach(key => {
  if (envVars[key]) {
    console.log(`   ✅ ${key}: Present (${envVars[key].length} chars)`);
  } else {
    console.log(`   ❌ ${key}: MISSING`);
    allPresent = false;
  }
});

if (!allPresent) {
  console.error('\n❌ Missing required environment variables!');
  process.exit(1);
}

console.log('\n2. Private Key Format Check:');
const privateKey = envVars.FIREBASE_PRIVATE_KEY;

// Check format
const checks = [
  { name: 'Contains BEGIN PRIVATE KEY', check: privateKey.includes('BEGIN PRIVATE KEY') },
  { name: 'Contains END PRIVATE KEY', check: privateKey.includes('END PRIVATE KEY') },
  { name: 'Contains \\n characters', check: privateKey.includes('\\n') },
  { name: 'NO actual newlines (good)', check: !privateKey.includes('\n') || privateKey.indexOf('\n') === -1 },
];

checks.forEach(({ name, check }) => {
  console.log(`   ${check ? '✅' : '❌'} ${name}`);
});

// Show samples (safe)
console.log('\n3. Key Samples (safe to share):');
console.log(`   First 60 chars: ${privateKey.substring(0, 60).replace(/\n/g, '\\n')}`);
console.log(`   Last 60 chars: ${privateKey.substring(privateKey.length - 60).replace(/\n/g, '\\n')}`);

// Test Firebase initialization
console.log('\n4. Testing Firebase Initialization...');
try {
  // Check if firebase-admin is installed
  require.resolve('firebase-admin');
  
  const { initializeApp, cert } = require('firebase-admin/app');
  
  // Process the private key
  const processedKey = privateKey.replace(/\\n/g, '\n');
  
  const app = initializeApp({
    credential: cert({
      projectId: envVars.FIREBASE_PROJECT_ID,
      clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
      privateKey: processedKey,
    }),
  });
  
  console.log('   ✅ Firebase Admin initialized successfully!');
  console.log('\n🎉 All checks passed! Your setup looks good.');
  
} catch (error) {
  console.error(`   ❌ Initialization failed: ${error.message}`);
  
  if (error.message.includes('MODULE_NOT_FOUND')) {
    console.log('\n💡 Install firebase-admin: npm install firebase-admin');
  } else if (error.message.includes('invalid_grant')) {
    console.log('\n💡 Your private key might be expired. Generate a new one in Firebase Console.');
  } else if (error.message.includes('PEM')) {
    console.log('\n💡 Private key format issue. Ensure it has \\n not actual newlines.');
    console.log('   Example: "-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n"');
  }
  
  process.exit(1);
}

console.log('\n✅ Ready to use Firebase Admin!');