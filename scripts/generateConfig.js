const fs = require('fs');
const path = require('path');
require('dotenv').config();

const outPath = path.join(__dirname, '..', 'js', 'firebase-config.js');

const config = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || ''
};

const content = `import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';

const firebaseConfig = ${JSON.stringify(config, null, 2)};

export const app = initializeApp(firebaseConfig);\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Wrote', outPath);
