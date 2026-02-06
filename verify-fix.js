// verify-simple.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying .env.local format...\n');

// Read .env.local directly
const envPath = path.join(__dirname, '.env.local');
const content = fs.readFileSync(envPath, 'utf8');

// Find FIREBASE_PRIVATE_KEY
const lines = content.split('\n');
let privateKeyLine = '';

for (const line of lines) {
  if (line.startsWith('FIREBASE_PRIVATE_KEY=')) {
    privateKeyLine = line;
    break;
  }
}

if (!privateKeyLine) {
  console.error('❌ FIREBASE_PRIVATE_KEY not found in .env.local');
  process.exit(1);
}

console.log('Found FIREBASE_PRIVATE_KEY line');
console.log('Line length:', privateKeyLine.length);

// Extract the value (after the = sign)
const value = privateKeyLine.substring(privateKeyLine.indexOf('=') + 1).trim();

console.log('\n📊 Analysis:');
console.log('Value starts with:', value.substring(0, 30));
console.log('Value ends with:', value.substring(value.length - 30));

// Check formatting
const checks = [
  { name: 'Starts with quote', check: value.startsWith('"') },
  { name: 'Ends with quote', check: value.endsWith('"') },
  { name: 'Contains BEGIN PRIVATE KEY', check: value.includes('BEGIN PRIVATE KEY') },
  { name: 'Contains END PRIVATE KEY', check: value.includes('END PRIVATE KEY') },
  { name: 'Contains \\\\n (escaped newlines)', check: value.includes('\\n') },
  { name: 'Has NO actual newlines', check: !value.includes('\n') },
];

console.log('\n✅ Format checks:');
checks.forEach(({ name, check }) => {
  console.log(`   ${check ? '✅' : '❌'} ${name}`);
});

// Remove quotes for processing
const processedValue = value.replace(/^"|"$/g, '');

console.log('\n🔧 Processed value (without quotes):');
console.log('Length:', processedValue.length);
console.log('Has \\\\n:', processedValue.includes('\\n'));
console.log('Has actual newlines:', processedValue.includes('\n'));

if (processedValue.includes('\\n') && !processedValue.includes('\n')) {
  console.log('\n🎉 CORRECT FORMAT! The key has escaped newlines (\\n) not actual newlines.');
  console.log('✅ Your .env.local is properly formatted!');
} else if (processedValue.includes('\n')) {
  console.log('\n❌ WRONG FORMAT! The key has actual newlines.');
  console.log('💡 Run the fix script again or manually replace newlines with \\\\n');
} else if (!processedValue.includes('\\n')) {
  console.log('\n⚠️  WARNING: The key has no newlines at all.');
  console.log('💡 Make sure the key includes \\\\n characters');
}

// Test with firebase-admin
console.log('\n🧪 Testing with firebase-admin...');
try {
  require.resolve('firebase-admin');
  
  const { initializeApp, cert } = require('firebase-admin/app');
  
  // Process the key
  const testKey = processedValue.replace(/\\n/g, '\n');
  
  // Create a test credential
  const testCredential = {
    projectId: 'test-project',
    clientEmail: 'test@example.com',
    privateKey: testKey,
  };
  
  console.log('✅ firebase-admin is installed');
  console.log('✅ Private key can be processed');
  
  // Try to create cert (this validates the key format)
  try {
    const credential = cert(testCredential);
    console.log('✅ Certificate created successfully!');
    console.log('\n🎉 Your private key format is VALID!');
  } catch (certError) {
    console.log('❌ Certificate creation failed:', certError.message);
    if (certError.message.includes('PEM')) {
      console.log('💡 PEM format error. The key might still have issues.');
    }
  }
  
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('ℹ️  firebase-admin not installed (this is okay for format check)');
  } else {
    console.log('❌ Error:', error.message);
  }
}