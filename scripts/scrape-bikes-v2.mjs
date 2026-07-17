/**
 * Enhanced scraper – Phase 2
 * Uses the Shopify products.json endpoint (paginated) to bulk-fetch all
 * bicycle products from BumsOnTheSaddle, then matches them against our
 * target list. Also scrapes individual product pages for full details.
 *
 * Usage:  node scripts/scrape-bikes-v2.mjs
 * Output: src/data/scraped-bikes.json  (overwrites previous)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Step 1: Bulk-fetch every product from BOTS ──────────────────────────────

async function fetchAllBOTSProducts() {
  const allProducts = [];
  let page = 1;

  while (true) {
    const url = `https://bumsonthesaddle.com/products.json?limit=250&page=${page}`;
    console.log(`  Fetching page ${page}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const data = await res.json();
      if (!data.products || data.products.length === 0) break;
      allProducts.push(...data.products);
      console.log(`    Got ${data.products.length} products (total: ${allProducts.length})`);
      if (data.products.length < 250) break;
      page++;
      await delay(1000);
    } catch (err) {
      console.error(`  Error on page ${page}: ${err.message}`);
      break;
    }
  }

  return allProducts;
}

// ── Step 2: Match targets against the full catalog ──────────────────────────

function normalise(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchScore(target, product) {
  const tNorm = normalise(target);
  const pTitle = normalise(product.title);
  const pVendor = normalise(product.vendor || '');

  // Exact substring
  if (pTitle.includes(tNorm)) return 100;

  // Check each word of target
  const tWords = tNorm.split(' ');
  const matchedWords = tWords.filter((w) => pTitle.includes(w) || pVendor.includes(w));
  const score = (matchedWords.length / tWords.length) * 80;

  // Bonus if vendor matches
  if (tWords[0] && pVendor.includes(tWords[0])) return score + 10;

  return score;
}

function findBestMatch(target, products, threshold = 55) {
  let best = null;
  let bestScore = 0;

  // Only match bikes (type=Bicycles or similar)
  const bikes = products.filter((p) => {
    const t = (p.product_type || '').toLowerCase();
    return t.includes('bicycle') || t.includes('bike') || t.includes('cycle') || t === '';
  });

  for (const p of bikes) {
    const s = matchScore(target, p);
    if (s > bestScore) {
      bestScore = s;
      best = p;
    }
  }

  return bestScore >= threshold ? { product: best, score: bestScore } : null;
}

// ── Step 3: Parse the full product JSON into our schema ─────────────────────

function parseProductBody(html) {
  if (!html) return { features: [], specifications: {}, components: {} };

  const $ = cheerio.load(html);
  const result = { features: [], specifications: {}, components: {} };

  let currentSection = 'features';

  $('h3, h4, h5, h6').each((_, el) => {
    const heading = $(el).text().trim().toLowerCase();
    const nextUl = $(el).next('ul');

    if (heading.includes('feature')) currentSection = 'features';
    else if (heading.includes('specification')) currentSection = 'specifications';
    else if (heading.includes('component')) currentSection = 'components';
    else if (heading.includes('additional')) currentSection = 'additional';

    if (nextUl.length) {
      nextUl.children('li').each((_, li) => {
        const strongEl = $(li).find('strong').first();
        const strongText = strongEl.text().trim();
        const fullText = $(li).text().trim();

        if (strongText && fullText.startsWith(strongText)) {
          const key = strongText.replace(/[-:]+$/g, '').trim();
          const value = fullText.substring(strongText.length).replace(/^[-:\s]+/, '').trim();

          if (currentSection === 'specifications') result.specifications[key] = value;
          else if (currentSection === 'components') result.components[key] = value;
          else if (currentSection !== 'additional') result.features.push(fullText);
        } else if (fullText.length > 10 && !fullText.includes('Country of Origin')) {
          if (currentSection === 'features') result.features.push(fullText);
        }
      });
    }
  });

  // Fallback: if nothing was parsed via heading detection, walk all <li>
  if (
    result.features.length === 0 &&
    Object.keys(result.specifications).length === 0 &&
    Object.keys(result.components).length === 0
  ) {
    $('li').each((_, li) => {
      const strongEl = $(li).find('strong').first();
      const strongText = strongEl.text().trim();
      const fullText = $(li).text().trim();

      if (strongText && fullText.startsWith(strongText)) {
        const key = strongText.replace(/[-:]+$/g, '').trim();
        const value = fullText.substring(strongText.length).replace(/^[-:\s]+/, '').trim();

        if (
          [
            'Intended Use',
            'Wheel Size',
            'Braking System',
            'Frame Material',
            'Fork Material',
          ].includes(key)
        ) {
          result.specifications[key] = value;
        } else if (key.length < 30) {
          result.components[key] = value;
        }
      } else if (fullText.length > 15 && !fullText.includes('Country of Origin')) {
        result.features.push(fullText);
      }
    });
  }

  return result;
}

function parseTags(tags) {
  if (!tags || !Array.isArray(tags)) return {};
  const info = {};
  for (const t of tags) {
    if (t.startsWith('Brand-')) info.brand = t.split('-').slice(1).join('-');
    if (t.startsWith('Frame-')) info.frameMaterial = t.split('-').slice(1).join('-');
    if (t.startsWith('Wheel-')) info.wheelSize = t.split('-').slice(1).join('-');
    if (t.startsWith('Speed-')) info.gears = t.split('-').slice(1).join('-');
    if (t.startsWith('Brake-')) info.brakeType = t.split('-').slice(1).join('-');
    if (t.startsWith('Group-')) info.groupset = t.split('-').slice(1).join('-');
    if (t.startsWith('Use-')) info.intendedUse = t.split('-').slice(1).join('-');
    if (t.startsWith('Condition-')) info.condition = t.split('-').slice(1).join('-').toLowerCase();
    if (t.startsWith('Warranty-')) info.warranty = t.split('-').slice(1).join('-');
  }
  return info;
}

function transformProduct(target, product) {
  const parsed = parseProductBody(product.body_html);
  const tagInfo = parseTags(product.tags);

  const images = (product.images || []).map((img) => img.src);

  const variants = (product.variants || []).map((v) => ({
    id: v.id,
    size: v.title || v.option1,
    price: parseFloat(v.price),
    compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
    available: v.available,
    sku: v.sku,
    weight: v.weight,
  }));

  const price = variants.length > 0 ? variants[0].price : null;
  const compareAtPrice =
    variants.length > 0 && variants[0].compareAtPrice ? variants[0].compareAtPrice : null;

  return {
    sourceQuery: target,
    source: 'bumsonthesaddle',
    shopifyId: product.id,
    handle: product.handle,
    name: product.title,
    brand: product.vendor || tagInfo.brand || target.split(' ')[0],
    price,
    compareAtPrice,
    image: images[0] || null,
    images,
    url: `https://bumsonthesaddle.com/products/${product.handle}`,
    available: variants.some((v) => v.available),
    variants,
    tags: product.tags,
    tagInfo,
    ...parsed,
  };
}

// ── Step 4: Try fetching from Dbykstore for not-found bikes ─────────────────

async function fetchFromDbykProductsJson() {
  const allProducts = [];
  let page = 1;

  while (true) {
    const url = `https://www.dbykstore.com/products.json?limit=250&page=${page}`;
    console.log(`  Fetching dbyk page ${page}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const data = await res.json();
      if (!data.products || data.products.length === 0) break;
      allProducts.push(...data.products);
      console.log(`    Got ${data.products.length} products (total: ${allProducts.length})`);
      if (data.products.length < 250) break;
      page++;
      await delay(1000);
    } catch (err) {
      console.error(`  Dbyk error on page ${page}: ${err.message}`);
      break;
    }
  }

  return allProducts;
}

// ── Targets ─────────────────────────────────────────────────────────────────

const targets = [
  // existingBikes
  'Argon 18 Nitrogen',
  'Lapierre Aircode DRS 5.0',
  'Scott Plasma 10',
  'Scott Addict RC',
  'Trek Domane AL 5',
  'Lapierre Xelius SL 5.0',
  'Argon 18 Gallium Pro',
  'Scott Speedster CX 20',
  'Marin Nicasio 2',
  'Trek Marlin 5',
  'Scott Spark 960',
  'Scott Scale 970',
  'Marin Rift Zone 29',
  'Avanti Giro F1W',
  'Avanti Giro FM 1W',
  'Trek FX 3 Disc',

  // jsonStock – road
  'Trek Speed Concept',
  'Trek Madone SL6',
  'Trek Madone SL7',
  'Trek Madone SL5',
  'Trek Emonda ALR 5',
  'Trek Domane AL5',
  'Trek Emonda SL5',
  'Trek Domane AL4',
  'Scott Addict 20',
  'Scott Addict 50',
  'Scott Speedster Gravel 50',
  'Scott Speedster 40',
  'Scott Speedster 10',
  'Scott Foil RC 20',
  'Pinarello Granger',
  'Cannondale SuperSix Evo',
  'Cannondale Synapse Carbon',
  'Cannondale Synapse Hi-Mod',
  'Cannondale Synapse AL',
  'Cannondale Optimo',
  'Merida Reacto 4000',
  'Merida Scultura Endurance 4000',
  'Merida Scultura 4000',
  'Colnago V4RS',
  'Guerciotti Eureka Air',
  'Wilier GTR',
  'Lapierre Xelius SL7',
  'Lapierre Aircode DRS',
  'Bergamont Grandurance Elite',
  'Bergamont Grandurance RB3',
  'Cipollini Bond',
  'Polygon Stratos S5D',
  'Polygon Stratos S2',
  'Polygon Stratos 3',
  'Polygon Stratos 4',
  'Bottachia Duello',
  'Java Fuoco Disc',

  // jsonStock – hybrid
  'Trek FX3',
  'Trek FX2',
  'Trek Dual Sport',
  'Scott Sub Cross 50',

  // jsonStock – MTB
  'Trek Marlin 4',
  'Scott Aspect 960',
  'Polygon Cascade 2',
];

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║   Pro Riders Hub – Bike Scraper V2 (Full Catalog Approach)    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // Phase 1: Fetch all products from BOTS
  console.log('── Phase 1: Fetching BumsOnTheSaddle catalog ──');
  const botsProducts = await fetchAllBOTSProducts();
  console.log(`  Total BOTS products: ${botsProducts.length}\n`);

  // Phase 2: Fetch all products from Dbykstore
  console.log('── Phase 2: Fetching Dbykstore catalog ──');
  const dbykProducts = await fetchFromDbykProductsJson();
  console.log(`  Total Dbyk products: ${dbykProducts.length}\n`);

  // Phase 3: Match targets
  console.log('── Phase 3: Matching targets ──\n');
  const results = [];
  let found = 0;
  let notFound = 0;

  for (const target of targets) {
    process.stdout.write(`  ${target.padEnd(40)}`);

    // Try BOTS first
    const botsMatch = findBestMatch(target, botsProducts);
    if (botsMatch) {
      const data = transformProduct(target, botsMatch.product);
      results.push(data);
      console.log(`✓ BOTS  ₹${data.price}  (score: ${botsMatch.score})`);
      found++;
      continue;
    }

    // Try Dbyk
    const dbykMatch = findBestMatch(target, dbykProducts);
    if (dbykMatch) {
      const data = transformProduct(target, dbykMatch.product);
      data.source = 'dbykstore';
      data.url = `https://www.dbykstore.com/products/${dbykMatch.product.handle}`;
      results.push(data);
      console.log(`✓ DBYK  ₹${data.price}  (score: ${dbykMatch.score})`);
      found++;
      continue;
    }

    // Not found
    results.push({
      sourceQuery: target,
      source: 'not_found',
      name: target,
      brand: target.split(' ')[0],
      price: null,
      image: null,
      images: [],
      url: null,
      available: false,
      variants: [],
      tags: [],
      tagInfo: {},
      features: [],
      specifications: {},
      components: {},
    });
    console.log('✗ NOT FOUND');
    notFound++;
  }

  // Write output
  const outPath = path.join(__dirname, '..', 'src', 'data', 'scraped-bikes.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(`  Total: ${targets.length}  |  Found: ${found}  |  Not Found: ${notFound}`);
  console.log(`  Output: ${outPath}`);
  console.log('════════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
