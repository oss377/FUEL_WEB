// fix-env-format.js
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
let content = fs.readFileSync(envPath, 'utf8');

console.log('🔧 Fixing .env.local format...\n');

// Find the FIREBASE_PRIVATE_KEY line
const lines = content.split('\n');
let fixedLines = [];

for (let line of lines) {
  if (line.startsWith('FIREBASE_PRIVATE_KEY=')) {
    console.log('Found FIREBASE_PRIVATE_KEY line');
    
    // Extract the value
    const match = line.match(/FIREBASE_PRIVATE_KEY=(.*)/);
    if (match) {
      let value = match[1];
      
      // Remove surrounding quotes
      value = value.replace(/^["']|["']$/g, '');
      
      // Replace actual newlines with \n
      value = value.replace(/\r?\n/g, '\\n');
      
      // Ensure it starts with BEGIN and ends with END
      if (!value.includes('BEGIN PRIVATE KEY')) {
        value = '-----BEGIN PRIVATE KEY-----\\n' + value;
      }
      if (!value.includes('END PRIVATE KEY')) {
        value = value + '\\n-----END PRIVATE KEY-----\\n';
      }
      
      // Add quotes back
      const fixedLine = `FIREBASE_PRIVATE_KEY="${value}"`;
      
      console.log('Fixed line length:', fixedLine.length);
      console.log('Fixed line preview:', fixedLine.substring(0, 100) + '...');
      
      fixedLines.push(fixedLine);
    }
  } else {
    fixedLines.push(line);
  }
}

// Write back
fs.writeFileSync(envPath, fixedLines.join('\n'));
console.log('\n✅ .env.local has been fixed!');
console.log('\n⚠️  IMPORTANT: Restart your Next.js dev server:');
console.log('   rm -rf .next && npm run dev');