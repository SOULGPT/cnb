
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

async function seedBundle() {
  console.log('Fetching items...');
  const itemsSnapshot = await db.collection('menu_items').get();
  const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const zinger = items.find(i => i.name.toLowerCase().includes('zinger'));
  const fries = items.find(i => i.name.toLowerCase().includes('patate fritte') || i.name.toLowerCase().includes('fries'));
  const drink = items.find(i => i.name.toLowerCase().includes('bibita') || i.name.toLowerCase().includes('drink') || i.name.toLowerCase().includes('cola'));

  if (!zinger || !fries) {
    console.error('Could not find zinger or fries to create bundle');
    process.exit(1);
  }

  const bundleIds = [zinger.id, fries.id, drink ? drink.id : null].filter(Boolean);

  console.log('Creating Zinger Bundle Banner...');
  
  // Update existing SUMMER COMBO or add new one
  const bannersRef = db.collection('banners');
  const existing = await bannersRef.where('title', '==', 'SUMMER COMBO').get();
  
  const bannerData = {
    title: "ZINGER SUPER COMBO",
    subtitle: "Zinger + Fries + Drink",
    price: "8.99",
    imageUrl: "/burger_combo_banner_1777826710031.png",
    templateId: "orange-heat",
    backgroundColor: "#E78A00",
    actionType: "deal",
    actionValue: "zinger-bundle",
    bundleItems: bundleIds,
    isActive: true,
    order: 0,
    updatedAt: new Date()
  };

  if (!existing.empty) {
    await existing.docs[0].ref.update(bannerData);
    console.log('Updated existing Zinger bundle banner');
  } else {
    await bannersRef.add({ ...bannerData, createdAt: new Date() });
    console.log('Added new Zinger bundle banner');
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seedBundle().catch(console.error);
