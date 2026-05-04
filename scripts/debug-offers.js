
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env.local')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (getApps().length === 0) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

const db = getFirestore();

async function listOffers() {
  console.log('--- CHECKOUT OFFERS ---');
  const offersSnapshot = await db.collection('checkout_offers').get();
  if (offersSnapshot.empty) {
    console.log('No offers found in collection!');
  } else {
    offersSnapshot.docs.forEach(doc => {
      console.log(`ID: ${doc.id}`);
      console.log(JSON.stringify(doc.data(), null, 2));
      console.log('---');
    });
  }

  console.log('--- CATEGORIES ---');
  const catSnapshot = await db.collection('menu_categories').get();
  catSnapshot.docs.forEach(doc => {
    console.log(`${doc.id}: ${doc.data().name}`);
  });

  process.exit(0);
}

listOffers().catch(console.error);
