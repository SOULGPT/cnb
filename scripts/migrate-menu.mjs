
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import dotenv from 'dotenv';

// Load .env.local manually
if (fs.existsSync('.env.local')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin credentials in environment');
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = getFirestore();

const menuData = [
  {
    category: "Burgers",
    description: "Premium beef, chicken, and veggie burgers",
    order: 1,
    items: [
      { name: "Classic Burger", description: "Carne di manzo, insalata, pomodoro, cipolla, maionese", price: 4.99 },
      { name: "Cheeseburger", description: "Carne di manzo, formaggio fuso, cetrioli, ketchup", price: 5.49 },
      { name: "Chicken Burger", description: "Pollo croccante, insalata, maionese", price: 5.49 },
      { name: "Double Cheese Burger", description: "Doppia carne di manzo, doppio formaggio, salse", price: 7.99 },
      { name: "Spicy Zinger Burger", description: "Filetto di pollo piccante impanato, lattuga, salsa chili", price: 6.49 },
      { name: "Egg Burger", description: "Carne di manzo, uovo fritto, formaggio, insalata", price: 6.99 },
      { name: "Fish Burger", description: "Filetto di pesce impanato, salsa tartara, insalata", price: 5.99 },
      { name: "Veggie Burger", description: "Burger di verdure, formaggio, pomodoro, insalata", price: 5.49 },
      { name: "Bacon Beef Burger (Halal)", description: "Manzo, bacon di vitello, cipolla caramellata, BBQ", price: 7.49 },
      { name: "Curry Burger", description: "Carne di manzo, salsa curry speciale, peperoni", price: 6.99 },
      { name: "BBQ Monster Burger", description: "Carne di manzo, anelli di cipolla, salsa BBQ, bacon di vitello", price: 8.49 },
      { name: "Tikka Burger", description: "Pollo tikka speziato, yogurt, cipolla rossa, menta", price: 6.99 },
      { name: "Mushroom Burger", description: "Carne di manzo, funghi trifolati, formaggio svizzero", price: 7.49 },
      { name: "Jalapeño Fire Burger", description: "Manzo, jalapeños sott'oil, salsa piccante, formaggio", price: 6.99 },
      { name: "Grand Burger", description: "Tripla carne, triplo formaggio, bacon, uovo, salse miste", price: 10.99 }
    ]
  },
  {
    category: "Taccos",
    description: "Delicious Mexican-style tacos with an Asian twist",
    order: 2,
    items: [
      { name: "Tacco Classic Manzo", description: "Carne macinata di manzo, insalata, salsa yogurt", price: 5.99 },
      { name: "Tacco Chicken Tikka", description: "Dadini di pollo tikka, cipolla, coriandolo, salsa verde", price: 6.49 },
      { name: "Tacco Seekh Kebab", description: "Kebab di carne macinata, insalata, salsa piccante", price: 6.49 },
      { name: "Tacco Shrimps", description: "Gamberetti saltati, cavolo rosso, salsa lime", price: 7.99 },
      { name: "Tacco Vegetariano", description: "Paneer speziato, peperoni, mais, salsa bianca", price: 5.99 },
      { name: "Tacco Mix Meat", description: "Mix di manzo e pollo, formaggio, salse miste", price: 7.49 },
      { name: "Tacco Hot Chili", description: "Carne piccante, fagioli, jalapeños, salsa curry", price: 6.99 }
    ]
  },
  {
    category: "Rice",
    description: "Traditional Basmati rice dishes",
    order: 3,
    items: [
      { name: "White Rice", description: "Riso basmati cotto al vapore", price: 3.99 },
      { name: "Zeera Rice", description: "Riso basmati con cumino cotto al vapore", price: 4.99 },
      { name: "Kesar Rice", description: "Riso basmati con zafferano cotto al vapore", price: 4.99 },
      { name: "Rice Plater", description: "Riso basmati con 4pz chicken tikka, 4pz malai boti, 4pz wings tandoori, 2pz leg tandoori", price: 29.99 },
      { name: "Chicken Briyani", description: "Riso Basmati con pollo speziato cotto al vapore", price: 7.99 },
      { name: "Shrimps Briyani", description: "Gamberetti con spezie e riso basmati cotto al vapore", price: 10.99 },
      { name: "Lamb Briyani", description: "Riso basmati con agnello speziato cotto al vapore", price: 9.99 },
      { name: "Beef Briyani", description: "Riso basmati con manzo speziato cotto al vapore", price: 8.99 }
    ]
  },
  {
    category: "Family Deals",
    description: "Great value meals for the whole family",
    order: 4,
    items: [
      { name: "Family Deal 1", description: "10pz. cosce di pollo, 4x patatine fritte, 1.5Lt bibita", price: 24.99 },
      { name: "Family Deal 2", description: "10pz. alette di pollo piccante, 6pz. pollo grandi, 4x patatine fritte, 1.5Lt bibita", price: 24.99 },
      { name: "Family Deal 3", description: "24pz. alette di pollo piccante, 4x patatine fritte, 1.5Lt bibita", price: 24.99 },
      { name: "Family Deal 4", description: "19pz. alette di pollo grigliate, 4x patatine fritte, 1.5Lt bibita", price: 24.99 }
    ]
  },
  {
    category: "Dolci",
    description: "Traditional sweets and desserts",
    order: 5,
    items: [
      { name: "Gulab Jamun", description: "Balla fritto con sciroppo di zucchero", price: 2.99 },
      { name: "Baklava", description: "Pasta sfoglia con pistacchio e sciroppo di zucchero", price: 1.99 },
      { name: "Soufflé al Cioccolato", description: "Tortino con cuore caldo al cioccolato", price: 3.99 },
      { name: "Kheer", description: "Budino di riso con latte, zucchero, cocco e mandorle", price: 3.99 },
      { name: "Kulfi", description: "Gelato pakistano con latte", price: 2.99 }
    ]
  },
  {
    category: "Patatine",
    description: "Crispy fries and potato sides",
    order: 6,
    items: [
      { name: "Patate Fritte", description: "Classic french fries", price: 2.99 },
      { name: "Patate Smile", description: "Happy face potatoes", price: 2.99 },
      { name: "Patate Wedges", description: "Crispy potato wedges", price: 2.49 },
      { name: "Patate Spirale", description: "Spiral cut potatoes", price: 2.99 },
      { name: "Patate Dipper", description: "Potato dippers", price: 2.99 },
      { name: "Loaded Fries", description: "Fries topped with cheese and more", price: 2.99 }
    ]
  },
  {
    category: "Snacks",
    description: "Quick bites and finger food",
    order: 7,
    items: [
      { name: "Chicken Nuggets (6pz)", description: "6 pieces of crispy chicken nuggets", price: 4.99 },
      { name: "Pop Corn di Pollo", description: "Bite-sized fried chicken", price: 4.99 },
      { name: "Chilli Cheese Nuggets", description: "Spicy cheese nuggets", price: 3.99 },
      { name: "Red Hot Jalapeños", description: "Fried spicy jalapeños", price: 3.99 },
      { name: "Mozzarella Sticks", description: "Crispy melted mozzarella sticks", price: 3.99 },
      { name: "Camember Bites", description: "Fried Camembert cheese bites", price: 3.99 },
      { name: "Onion Rings", description: "Crispy fried onion rings", price: 3.99 }
    ]
  },
  {
    category: "Insalata",
    description: "Fresh and healthy salads",
    order: 8,
    items: [
      { name: "Insalata con Pollo Bianco Grill", description: "3pz pollo bianco grigliato", price: 6.00 },
      { name: "Insalata con Pollo Tikka", description: "3pz pollo in marinate tandoori", price: 6.00 }
    ]
  },
  {
    category: "Chicken Combo",
    description: "Complete chicken meals with fries and drink",
    order: 9,
    items: [
      { name: "3 x Chicken", description: "3pz cosce impanate fritte + patatine + bibita", price: 7.99 },
      { name: "Chicken Mix", description: "2pz cosce impanate fritte, 3pz alette fritte piccanti + patatine + bibita", price: 7.99 },
      { name: "Alette di Pollo", description: "6pz alette impanate fritte piccanti + patatine + bibita", price: 7.99 },
      { name: "Strisce di Pollo", description: "5pz petto di pollo impanato fritto + patatine + bibita", price: 7.99 }
    ]
  },
  {
    category: "Naan",
    description: "Freshly baked traditional breads",
    order: 10,
    items: [
      { name: "Plain Naan", description: "Pane naan classico", price: 1.30 },
      { name: "Butter Naan", description: "Pane naan con burro", price: 1.50 },
      { name: "Garlic Naan", description: "Pane naan con aglio e burro", price: 1.99 },
      { name: "Cheese Naan", description: "Pane naan con formaggio e burro", price: 2.50 },
      { name: "Garlic & Cheese Naan", description: "Pane naan con aglio, formaggio e burro", price: 2.70 },
      { name: "Qeema Naan", description: "Pane naan con carne macinata e burro", price: 5.99 },
      { name: "Tikka Naan", description: "Pane naan con pollo tikka e mozzarella", price: 5.99 }
    ]
  },
  {
    category: "Vegetariano",
    description: "Authentic vegetarian dishes",
    order: 11,
    items: [
      { name: "Dal Makhni", description: "Lenticchie nere cotte in salsa curry, spezie e burro", price: 6.99 },
      { name: "Palak Paneer", description: "Cubetti di formaggio indiano con spinaci in salsa curry", price: 7.99 },
      { name: "Alu Palak", description: "Spinaci con patate e spezie", price: 7.99 },
      { name: "Matar Paneer", description: "Cubetti di formaggio indiano con piselli in salsa curry", price: 7.99 },
      { name: "Lahori Chany", description: "Ceci in salsa speziata", price: 6.99 },
      { name: "Shahi Paneer", description: "Cubetti di formaggio indiano in salsa speziata", price: 7.99 }
    ]
  },
  {
    category: "Chicken",
    description: "Authentic chicken curry dishes",
    order: 12,
    items: [
      { name: "Chicken Curry", description: "Pollo with salsa curry", price: 8.99 },
      { name: "Chicken Madras", description: "Pollo with curry al madras e spezie", price: 8.99 },
      { name: "Chicken Jal Frazi", description: "Pollo with patate, peperoni, pomodoro, spezie e curry", price: 9.99 },
      { name: "Chicken Vindaloo", description: "Pollo with patate e salsa piccante vindaloo", price: 8.99 },
      { name: "Chicken Tikka Masala", description: "Pollo with pomodoro, peperoni, spezie e curry", price: 9.99 },
      { name: "Butter Chicken", description: "Pollo with salsa di pomodoro, anacardi, mandorle e burro", price: 9.99 },
      { name: "Chicken Qorma", description: "Pollo with salsa delicata qorma", price: 9.99 },
      { name: "Chicken Palak", description: "Pollo with spinaci e spezie", price: 9.99 },
      { name: "Chicken Tikka Palak", description: "Pollo with spinaci e spezie", price: 9.99 },
      { name: "Butt Karahi", description: "Pollo cotto with curry in burro chiarificato", price: 11.99 }
    ]
  },
  {
    category: "Lamb",
    description: "Premium lamb curry dishes",
    order: 13,
    items: [
      { name: "Lamb Curry", description: "Agnello with salsa curry", price: 12.99 },
      { name: "Lamb Shahi Qorma", description: "Agnello with salsa delicata qorma", price: 13.99 },
      { name: "Lamb Vindaloo", description: "Agnello with patate e salsa piccante vindaloo", price: 12.99 },
      { name: "Lamb Butt Karahi", description: "Agnello cotto with curry in burro chiarificato", price: 15.99 }
    ]
  },
  {
    category: "Beef",
    description: "Quality beef curry dishes",
    order: 14,
    items: [
      { name: "Beef Curry", description: "Vitello with salsa curry", price: 10.99 },
      { name: "Beef Madras", description: "Vitello with curry al madras e spezie", price: 10.99 },
      { name: "Beef Shahi Korma", description: "Vitello with salsa delicata korma", price: 11.99 },
      { name: "Beef Masala", description: "Vitello with peperoni, spezie e salsa curry", price: 11.99 },
      { name: "Beef Butt Karahi", description: "Vitello cotto with curry in burro chiarificato", price: 13.99 }
    ]
  },
  {
    category: "Shrimps",
    description: "Fresh shrimp curry dishes",
    order: 15,
    items: [
      { name: "Shrimps Curry", description: "Gamberetti with salsa curry", price: 13.99 },
      { name: "Shrimps Madras", description: "Gamberetti with salsa curry al madras", price: 13.99 },
      { name: "Shrimps Masala", description: "Gamberetti with peperoni e salsa curry", price: 14.99 },
      { name: "Shrimps Shahi Qorma", description: "Gamberetti with salsa delicata qorma", price: 14.99 }
    ]
  },
  {
    category: "Grigliata",
    description: "Grilled and Tandoori specialties",
    order: 16,
    items: [
      { name: "Chicken Tikka", description: "5pz dadini di pollo marinati tandoori", price: 5.99 },
      { name: "Malai Boti", description: "5pz dadini di pollo marinati con yogurt, panna e spezie", price: 5.99 },
      { name: "Seekh Kebab", description: "Spiedo di carne macinata cotto in forno", price: 5.99 },
      { name: "Wings Tandoori", description: "6pz alette di pollo cotte in forno di argilla", price: 5.99 },
      { name: "Leg Tandoori", description: "2pz cosce di pollo marinate tandoori", price: 5.99 },
      { name: "Shrimps Tandoori", description: "6pz gamberi marinati tandoori", price: 11.99 },
      { name: "Mix Grill Tandoori", description: "4pz chicken tikka, 4pz malai boti, 4pz wings tandoori, 2pz leg tandoori", price: 24.99 }
    ]
  }
];

async function wipeCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`Wiped collection: ${collectionPath}`);
}

async function migrate() {
  console.log('Starting EXTENDED migration with Burgers and Taccos...');

  // 1. Wipe existing data
  await wipeCollection('menu_items');
  await wipeCollection('menu_categories');

  // 2. Populate data
  for (const catData of menuData) {
    const catRef = await db.collection('menu_categories').add({
      name: catData.category,
      description: catData.description,
      order: catData.order,
      published: true,
      isActive: true,
      imageUrl: ""
    });

    console.log(`Added category: ${catData.category} (${catRef.id})`);

    for (const item of catData.items) {
      await db.collection('menu_items').add({
        name: item.name,
        description: item.description,
        priceEur: item.price,
        categoryId: catRef.id,
        imageUrl: "",
        available: true,
        published: true,
        isActive: true,
        orderCount: 0,
        preparationTime: 15,
        calories: null,
        allergens: [],
        isVegetarian: catData.category === "Vegetariano" || item.name.toLowerCase().includes("veggie"),
        isVegan: false,
        isGlutenFree: false,
        spicyLevel: item.name.toLowerCase().includes("spicy") || item.name.toLowerCase().includes("hot") ? 3 : 0
      });
      console.log(`  Added item: ${item.name}`);
    }
  }

  console.log('EXTENDED Migration completed successfully!');
}

migrate().catch(console.error);
