import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://yeejxvxyabrmnpdnziek.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZWp4dnh5YWJybW5wZG56aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDcwNjcsImV4cCI6MjA5Nzc4MzA2N30.3GdoadfMVfDVpa3YQkYRd6zAxbdBoY1BnEk-ejFQOeM';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAllStoreProducts(storeUrl, storeName) {
  const allProducts = [];
  let page = 1;

  console.log(`\nFetching ${storeName} catalog...`);
  while (true) {
    const url = `${storeUrl}/products.json?limit=250&page=${page}`;
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const data = await res.json();
      if (!data.products || data.products.length === 0) break;
      
      // Filter out bikes, keep accessories/apparel/components
      const filtered = data.products.filter(p => {
        const t = (p.product_type || '').toLowerCase();
        return !t.includes('bicycle') && !t.includes('bike') && !t.includes('cycle');
      });
      
      allProducts.push(...filtered);
      process.stdout.write(`\r  Got page ${page} (${allProducts.length} items collected)`);
      if (data.products.length < 250) break;
      page++;
      await delay(100);
    } catch (err) {
      console.error(`\n  Error on page ${page}: ${err.message}`);
      break;
    }
  }
  console.log(`\n  ✅ Done. Total non-bike items from ${storeName}: ${allProducts.length}`);
  return allProducts;
}

function normalise(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchScore(targetName, targetBrand, product) {
  const tNorm = normalise(`${targetBrand} ${targetName}`);
  const pTitle = normalise(product.title);
  const pVendor = normalise(product.vendor || '');

  // Exact substring
  if (pTitle.includes(normalise(targetName))) return 100;

  // Word match
  const tWords = normalise(targetName).split(' ');
  const matchedWords = tWords.filter((w) => pTitle.includes(w) || pVendor.includes(w));
  let score = (matchedWords.length / tWords.length) * 80;

  // Bonus for vendor match
  if (targetBrand && pVendor.includes(normalise(targetBrand))) score += 20;

  return score;
}

function findBestMatch(targetName, targetBrand, catalogs) {
  let best = null;
  let bestScore = 0;

  for (const p of catalogs) {
    const s = matchScore(targetName, targetBrand, p);
    if (s > bestScore) {
      bestScore = s;
      best = p;
    }
  }

  return bestScore >= 70 ? { product: best, score: bestScore } : null; // strict matching
}

async function main() {
  console.log('Fetching missing image accessories from DB...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/db_products?type=in.(accessory,apparel)&select=id,name,brand`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
  });
  const dbItems = await res.json();
  console.log(`Found ${dbItems.length} accessories/apparels to process.`);

  const botsCatalog = await fetchAllStoreProducts('https://bumsonthesaddle.com', 'BOTS');
  const dbykCatalog = await fetchAllStoreProducts('https://dbykstore.com', 'Dbyk');
  
  const allCatalog = [...botsCatalog, ...dbykCatalog];

  const updates = [];
  const notFound = [];

  console.log('\nMatching products to catalog images...');
  for (const item of dbItems) {
    const match = findBestMatch(item.name, item.brand, allCatalog);
    
    if (match && match.product.images && match.product.images.length > 0) {
      const imageUrl = match.product.images[0].src;
      updates.push({
        id: item.id,
        name: item.name,
        brand: item.brand,
        matchedTitle: match.product.title,
        score: match.score,
        imageUrl: imageUrl
      });
    } else {
      notFound.push(item);
    }
  }

  console.log(`\nResults:`);
  console.log(`  Found images for: ${updates.length}`);
  console.log(`  Not found: ${notFound.length}`);

  const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'accessory-images-to-update.json');
  fs.writeFileSync(outputPath, JSON.stringify(updates, null, 2));
  console.log(`\nSaved matches to ${outputPath}`);
}

main().catch(console.error);
