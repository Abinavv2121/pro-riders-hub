/**
 * Seed script: reads bikes.json, flattens variants, and inserts into Supabase bikes table.
 * 
 * Usage:  node scripts/seed-bikes.mjs
 * 
 * Prerequisites: The bikes table must already exist in Supabase (run supabase_schema.sql first).
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://iceqsvlfblehkislxhbw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZXFzdmxmYmxlaGtpc2x4aGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk2MTIsImV4cCI6MjA4NzE3NTYxMn0.cT9dw1CgSQDPvHXzPLurQYKUJBD1Egx1fzjAKLhNLQI';

// Placeholder prices by category (in INR)
const PRICE_MAP = {
  road: {
    'Shimano Dura-Ace': 350000,
    'Shimano Ultegra Di2': 280000,
    'Shimano Ultegra': 250000,
    'Shimano Ultegra (11-speed)': 220000,
    'Shimano 105 Di2': 200000,
    'Shimano 105': 150000,
    'Shimano 105 (11-speed)': 140000,
    'Shimano Tiagra': 100000,
    'Shimano Sora': 80000,
    'Shimano Claris': 60000,
    'Shimano GRX': 170000,
    'Campagnolo': 200000,
  },
  hybrid: {
    'Shimano Deore': 75000,
    'Shimano Altus': 55000,
    'Shimano Tourney': 40000,
  },
  mtb: {
    'Shimano Cues': 65000,
    'Shimano Essa': 50000,
    'Shimano Tourney': 45000,
  },
};

function getPrice(category, groupset, condition) {
  const catPrices = PRICE_MAP[category] || PRICE_MAP.road;
  let price = catPrices[groupset] || 120000; // default fallback
  if (condition === 'used') {
    price = Math.round(price * 0.65); // 35% discount for used
  }
  return price;
}

// Placeholder image URLs — using Unsplash for real bike images
const IMAGE_MAP = {
  road: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
  hybrid: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80',
  mtb: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&q=80',
};

async function main() {
  // 1. Read bikes.json
  const jsonPath = resolve(__dirname, '..', 'src', 'data', 'bikes.json');
  const raw = readFileSync(jsonPath, 'utf-8');
  const bikesJson = JSON.parse(raw);

  // 2. Flatten variants into individual rows
  const rows = [];
  for (const bike of bikesJson) {
    for (const variant of bike.variants) {
      const condition = variant.condition || 'new';
      const price = getPrice(bike.category, variant.groupset, condition);
      rows.push({
        brand: bike.brand,
        category: bike.category,
        product: bike.product,
        name: `${bike.brand} ${bike.product}`,
        size: variant.size || null,
        color: variant.color || null,
        groupset: variant.groupset || null,
        condition: condition,
        year: variant.year || null,
        price: price,
        image_url: IMAGE_MAP[bike.category] || IMAGE_MAP.road,
      });
    }
  }

  console.log(`Prepared ${rows.length} bike rows to insert.`);

  // 3. Insert into Supabase via REST API (in batches of 50)
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bikes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Error inserting batch starting at index ${i}: ${res.status} ${errText}`);
      // If table doesn't exist, inform user
      if (errText.includes('relation') && errText.includes('does not exist')) {
        console.error('\n⚠️  The "bikes" table does not exist yet.');
        console.error('Please run the SQL in supabase_schema.sql in the Supabase SQL Editor first.');
        console.error('Dashboard → SQL Editor → paste the contents of supabase_schema.sql → Run');
        process.exit(1);
      }
      continue;
    }

    inserted += batch.length;
    console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} rows (total: ${inserted})`);
  }

  console.log(`\n✅ Done! Inserted ${inserted} bike rows into Supabase.`);
}

main().catch(console.error);
