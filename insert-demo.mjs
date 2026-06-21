import fs from 'fs';
import { MongoClient } from 'mongodb';

// Parse .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');
let uri = '';
for (const line of lines) {
  if (line.startsWith('MONGODB_URI=')) {
    uri = line.substring(line.indexOf('=') + 1).trim();
  }
}

if (!uri) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

const DEMO_ASSESSMENT = {
  transport: { vehicleType: 'sedan', dailyDistance: 25, weeklyFrequency: 5 },
  food: { dietType: 'mixed', mealsPerWeek: 6 },
  energy: { monthlyBill: 120, acUsage: 4, applianceUsage: 'moderate' },
  shopping: { monthlyPurchases: 8, fashionPurchases: 3 },
  waste: { recyclingHabits: 'sometimes', wasteGeneration: 'average' },
  completedAt: new Date().toISOString(),
};

const demoResults = {
  totalMonthlyCO2: 450,
  dailyCO2: 15,
  rating: 'medium',
  categories: [],
  calculatedAt: new Date().toISOString()
};

const demoHistory = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  const dailyCO2 = demoResults.dailyCO2;
  const savings = Math.random() * 5 + 2;
  return {
    date: date.toISOString().split('T')[0],
    totalCO2: dailyCO2,
    actionsSavings: Math.round(savings * 100) / 100,
    netCO2: Math.round((dailyCO2 - savings) * 100) / 100,
  };
});

const body = {
  sessionId: "demo-session-" + Date.now(),
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  assessmentData: DEMO_ASSESSMENT,
  carbonResults: demoResults,
  dailyActions: [],
  history: demoHistory
};

async function insert() {
  console.log("Connecting directly to MongoDB...");
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('carboniq');
    const collection = db.collection('submissions');
    
    await collection.insertOne(body);
    console.log("Successfully inserted 14-day demo data into MongoDB!");
  } catch (err) {
    console.error("Failed to insert into MongoDB:", err.message);
  } finally {
    await client.close();
  }
}

insert();
