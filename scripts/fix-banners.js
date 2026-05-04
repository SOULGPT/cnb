
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

async function fixBannersAndCategories() {
  console.log('Fetching all categories and items...');
  const catSnapshot = await db.collection('menu_categories').get();
  const categories = {};
  catSnapshot.docs.forEach(doc => {
    categories[doc.data().name] = doc.id;
  });

  const itemsSnapshot = await db.collection('menu_items').get();
  const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log('Found categories:', Object.keys(categories));

  // 1. Find Zinger Bundle components
  const zinger = items.find(i => i.name.toLowerCase().includes('zinger'));
  const fries = items.find(i => i.name.toLowerCase().includes('patate fritte') || i.name.toLowerCase().includes('fries'));
  const drink = items.find(i => i.name.toLowerCase().includes('bibita') || i.name.toLowerCase().includes('drink') || i.name.toLowerCase().includes('cola'));

  const bundleIds = [zinger?.id, fries?.id, drink?.id].filter(Boolean);

  // 2. Prepare Banners
  const bannerData = [
    {
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
      order: 0
    },
    {
      title: "PAK/INDIAN FEAST",
      subtitle: "Biryani & Curry Specials",
      price: "From €12.99",
      imageUrl: "https://images.unsplash.com/photo-1517244681291-03eb308f5d0d?q=80&w=1000&auto=format&fit=crop",
      templateId: "dark-emerald",
      backgroundColor: "#064E3B",
      actionType: "category",
      actionValue: categories["Rice"] || categories["Chicken"] || "Rice",
      isActive: true,
      order: 1
    },
    {
      title: "CHICKEN SUPER DEALS",
      subtitle: "Fried Chicken + Wings + Sides",
      price: "From €15.99",
      imageUrl: "/chicken_combo_banner_1777827801272.png",
      templateId: "split",
      backgroundColor: "#B91C1C",
      actionType: "category",
      actionValue: categories["Chicken Combo"] || "Chicken Combo",
      isActive: true,
      order: 2
    }
  ];

  console.log('Updating all banners in "banners" collection...');
  const bannersRef = db.collection('banners');
  
  // Wipe and replace to be sure
  const existing = await bannersRef.get();
  const batch = db.batch();
  existing.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  for (const banner of bannerData) {
    await bannersRef.add({
      ...banner,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`Synced banner: ${banner.title}`);
  }

  console.log('Banner and Category fix complete!');
  process.exit(0);
}

fixBannersAndCategories().catch(console.error);
