
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

async function seedCheckoutOffers() {
  console.log('Fetching categories and items...');
  const catSnapshot = await db.collection('menu_categories').get();
  const categories = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const itemsSnapshot = await db.collection('menu_items').get();
  const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Helper to find category by name
  const getCatId = (name) => categories.find(c => c.name.toLowerCase().includes(name.toLowerCase()))?.id;
  // Helper to find items by category name
  const getItemIdsByCat = (catName, limit = 5) => {
    const catId = getCatId(catName);
    return items.filter(i => i.categoryId === catId).slice(0, limit).map(i => i.id);
  };

  const riceId = getCatId('Rice');
  const chickenId = getCatId('Chicken'); // Assuming Curry might be here
  const burgerId = getCatId('Burgers');
  const taccoId = getCatId('Taccos');
  
  const naanIds = getItemIdsByCat('Naan');
  const drinkIds = getItemIdsByCat('Snacks'); // Assuming drinks are in snacks or bibita
  const dolciIds = getItemIdsByCat('Dolci');
  const friesIds = getItemIdsByCat('Patatine');

  const offers = [
    {
      title: "Rice/Curry Upsell",
      sourceCategoryId: riceId,
      suggestedItemIds: [...naanIds, ...drinkIds].slice(0, 8),
      isGlobalFallback: false,
      isActive: true,
      createdAt: new Date()
    },
    {
      title: "Burger/Tacco Upsell",
      sourceCategoryId: burgerId,
      suggestedItemIds: [...friesIds, ...dolciIds].slice(0, 8),
      isGlobalFallback: false,
      isActive: true,
      createdAt: new Date()
    },
    {
      title: "Global Fallback Recommendations",
      suggestedItemIds: [...drinkIds, ...dolciIds].slice(0, 10),
      isGlobalFallback: true,
      isActive: true,
      createdAt: new Date()
    }
  ];

  console.log('Updating checkout_offers collection...');
  const offersRef = db.collection('checkout_offers');
  
  // Clear existing
  const existing = await offersRef.get();
  const batch = db.batch();
  existing.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  for (const offer of offers) {
    if (offer.suggestedItemIds.length > 0) {
      await offersRef.add(offer);
      console.log(`Added offer: ${offer.title}`);
    }
  }

  console.log('Checkout Offers seeding complete!');
  process.exit(0);
}

seedCheckoutOffers().catch(console.error);
