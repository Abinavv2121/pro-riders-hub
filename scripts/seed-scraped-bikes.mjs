/**
 * Seed script: reads scraped-bikes.json and uploads correctly-scraped bike
 * data to Supabase db_products table, replacing inaccurate hardcoded data.
 *
 * Usage:  node scripts/seed-scraped-bikes.mjs
 *
 * NOTE: If inserts fail with 401/403, temporarily disable RLS:
 *   ALTER TABLE db_products DISABLE ROW LEVEL SECURITY;
 * Then re-enable after seeding:
 *   ALTER TABLE db_products ENABLE ROW LEVEL SECURITY;
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://yeejxvxyabrmnpdnziek.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZWp4dnh5YWJybW5wZG56aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDcwNjcsImV4cCI6MjA5Nzc4MzA2N30.3GdoadfMVfDVpa3YQkYRd6zAxbdBoY1BnEk-ejFQOeM';

// ── Helpers ──────────────────────────────────────────────────────────────────

function inferCategory(bike) {
  const tags = bike.tags || [];
  const tagInfo = bike.tagInfo || {};
  const name = (bike.name || '').toLowerCase();

  // From BOTS tags
  const useTag = tagInfo.intendedUse?.toLowerCase() || '';
  if (useTag.includes('road')) return 'road';
  if (useTag.includes('mtb') || useTag.includes('mountain')) return 'mtb';
  if (useTag.includes('hybrid') || useTag.includes('fitness')) return 'hybrid';
  if (useTag.includes('gravel')) return 'gravel';
  if (useTag.includes('city')) return 'city';

  // From Dbyk tags
  for (const t of tags) {
    const tl = t.toLowerCase();
    if (tl.includes('road')) return 'road';
    if (tl.includes('mtb') || tl.includes('mountain')) return 'mtb';
    if (tl.includes('hybrid')) return 'hybrid';
    if (tl.includes('gravel')) return 'gravel';
  }

  // From name
  if (name.includes('marlin') || name.includes('scale') || name.includes('spark') || name.includes('aspect') || name.includes('rift zone') || name.includes('cascade')) return 'mtb';
  if (name.includes('fx') || name.includes('dual sport') || name.includes('sub cross')) return 'hybrid';
  if (name.includes('gravel') || name.includes('nicasio') || name.includes('speedster gravel') || name.includes('granger')) return 'gravel';

  return 'road';
}

function inferBikeType(category) {
  const map = {
    road: 'Road Bike',
    mtb: 'Mountain Bike',
    hybrid: 'Hybrid',
    gravel: 'Gravel',
    city: 'City & Fitness',
  };
  return map[category] || 'Road Bike';
}

function stockStatus(available) {
  return available ? 'In Stock' : 'Out of Stock';
}

function buildDescription(bike) {
  const features = bike.features || [];
  if (features.length > 0) {
    return features.slice(0, 5).join('. ') + '.';
  }
  return `${bike.name} – a premium bicycle from ${bike.brand}. Visit our store for full specifications and test rides.`;
}

function buildSpecifications(bike) {
  const specs = { ...(bike.specifications || {}) };
  const tagInfo = bike.tagInfo || {};

  // Fill in from tags if specs are missing
  if (!specs['Frame Material'] && tagInfo.frameMaterial) specs['Frame Material'] = tagInfo.frameMaterial;
  if (!specs['Wheel Size'] && tagInfo.wheelSize) specs['Wheel Size'] = tagInfo.wheelSize;
  if (!specs['Braking System'] && tagInfo.brakeType) specs['Braking System'] = tagInfo.brakeType;
  if (!specs['Groupset'] && tagInfo.groupset) specs['Groupset'] = tagInfo.groupset;
  if (!specs['Gears'] && tagInfo.gears) specs['Gears'] = tagInfo.gears;

  // Merge components into specs for the db_products format
  const components = bike.components || {};
  for (const [key, val] of Object.entries(components)) {
    if (val && val.length > 0 && !specs[key]) {
      specs[key] = val;
    }
  }

  return specs;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Pro Riders Hub — Seed Scraped Bikes to db_products      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // 1. Read scraped data
  const jsonPath = resolve(__dirname, '..', 'src', 'data', 'scraped-bikes.json');
  const raw = readFileSync(jsonPath, 'utf-8');
  const scrapedBikes = JSON.parse(raw);

  // 2. Filter to only found bikes (skip not_found)
  const foundBikes = scrapedBikes.filter((b) => b.source !== 'not_found' && b.price);

  console.log(`  Total scraped: ${scrapedBikes.length}`);
  console.log(`  Found (with price): ${foundBikes.length}`);
  console.log(`  Not found (skipped): ${scrapedBikes.length - foundBikes.length}\n`);

  // 3. Transform into db_products rows
  // Each variant becomes a separate row (matching the pattern of seed-accessories.mjs)
  const rows = [];

  for (const bike of foundBikes) {
    const category = inferCategory(bike);
    const bikeType = inferBikeType(category);
    const description = buildDescription(bike);
    const specifications = buildSpecifications(bike);

    if (bike.variants && bike.variants.length > 0) {
      // One row per variant (size)
      for (const variant of bike.variants) {
        rows.push({
          name: bike.name,
          brand: bike.brand,
          category: category,
          type: 'bike',
          price: variant.price || bike.price,
          original_price: variant.compareAtPrice || bike.compareAtPrice || null,
          description: description,
          images: bike.images || [],
          specifications: specifications,
          stock_quantity: variant.available ? 1 : 0,
          stock_status: variant.available ? 'In Stock' : 'Out of Stock',
          color: null,
          size: variant.size || null,
          tag: bikeType,
          is_active: true,
        });
      }
    } else {
      // Single row (no variants)
      rows.push({
        name: bike.name,
        brand: bike.brand,
        category: category,
        type: 'bike',
        price: bike.price,
        original_price: bike.compareAtPrice || null,
        description: description,
        images: bike.images || [],
        specifications: specifications,
        stock_quantity: bike.available ? 1 : 0,
        stock_status: stockStatus(bike.available),
        color: null,
        size: null,
        tag: bikeType,
        is_active: true,
      });
    }
  }

  console.log(`  Total rows to insert: ${rows.length}\n`);

  // 4. Insert into Supabase (batches of 20)
  const BATCH_SIZE = 20;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/db_products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `  ❌  Batch ${Math.floor(i / BATCH_SIZE) + 1} failed — ${res.status}: ${errText}`,
      );

      if (res.status === 401 || res.status === 403) {
        console.error(
          '\n⚠️  Row-Level Security is blocking the insert.',
          '\n    Run this in Supabase SQL Editor:',
          '\n    ALTER TABLE db_products DISABLE ROW LEVEL SECURITY;',
          '\n    Then re-run this script.',
          '\n    Re-enable after: ALTER TABLE db_products ENABLE ROW LEVEL SECURITY;\n',
        );
        process.exit(1);
      }

      failed += batch.length;
      continue;
    }

    inserted += batch.length;
    console.log(
      `  ✅  Batch ${Math.floor(i / BATCH_SIZE) + 1} — inserted ${batch.length} rows (total: ${inserted})`,
    );
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ✅  Done! ${inserted} bike products inserted, ${failed} failed.`);
  console.log(`  → Visit the bikes page to see scraped data from real stores.\n`);

  // 5. Print summary of what was seeded
  console.log('── Seeded bikes summary ──\n');
  for (const bike of foundBikes) {
    console.log(`  ${bike.brand.padEnd(15)} ${bike.name.padEnd(50)} ₹${bike.price}`);
  }
}

main().catch(console.error);
