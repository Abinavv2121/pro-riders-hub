/**
 * Scrape bike data from BumsOnTheSaddle (Shopify suggest API) and Dbykstore.
 *
 * Usage:  node scripts/scrape-bikes.mjs
 *
 * Output: src/data/scraped-bikes.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Query the BumsOnTheSaddle Shopify predictive-search endpoint.
 * Returns the first matching product object or null.
 */
async function fetchFromBOTS(query) {
  const url = `https://bumsonthesaddle.com/search/suggest.json?q=${encodeURIComponent(
    query
  )}&resources[type]=product`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const products = data?.resources?.results?.products ?? [];
    return products.length > 0 ? products[0] : null;
  } catch (err) {
    console.error(`  ✗ BOTS fetch error for "${query}": ${err.message}`);
    return null;
  }
}

/**
 * Query the Dbykstore website search page and scrape the first result.
 * Returns { title, price, image, url } or null.
 */
async function fetchFromDbyk(query) {
  const url = `https://www.dbykstore.com/search?q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Dbykstore uses a standard Shopify theme
    const firstProduct = $('.product-card, .grid-product, .product-item').first();
    if (!firstProduct.length) return null;

    const title =
      firstProduct.find('.product-card__title, .grid-product__title, .product-item__title, a').first().text().trim() ||
      null;
    const priceText =
      firstProduct.find('.price, .product-card__price, .grid-product__price').first().text().trim() || '';
    const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || null;
    const image = firstProduct.find('img').first().attr('src') || null;
    const link = firstProduct.find('a').first().attr('href') || null;

    if (!title) return null;

    return {
      title,
      price,
      image: image ? (image.startsWith('//') ? `https:${image}` : image) : null,
      url: link ? `https://www.dbykstore.com${link}` : null,
    };
  } catch (err) {
    console.error(`  ✗ Dbyk fetch error for "${query}": ${err.message}`);
    return null;
  }
}

/**
 * Parse the HTML body returned by the Shopify suggest API into structured
 * features / specifications / components.
 */
function parseHtmlBody(html) {
  if (!html) return { features: [], specifications: {}, components: {} };

  const $ = cheerio.load(html);
  const result = { features: [], specifications: {}, components: {} };

  // Detect sections by heading text
  const sectionOrder = [];
  $('h3, h4, h5, h6, strong').each((_, el) => {
    const t = $(el).text().trim().toLowerCase();
    if (t.includes('feature')) sectionOrder.push('features');
    else if (t.includes('specification')) sectionOrder.push('specifications');
    else if (t.includes('component')) sectionOrder.push('components');
    else if (t.includes('additional')) sectionOrder.push('additional');
  });

  // Walk <li> elements and assign to sections
  let sectionIdx = 0;
  $('ul').each((i, ul) => {
    const section = sectionOrder[sectionIdx] || 'features';
    $(ul)
      .children('li')
      .each((_, li) => {
        const strongEl = $(li).find('strong').first();
        const strongText = strongEl.text().trim();
        const fullText = $(li).text().trim();

        if (strongText && fullText.startsWith(strongText)) {
          const key = strongText.replace(/[-:]+$/g, '').trim();
          const value = fullText.substring(strongText.length).replace(/^[-:\s]+/, '').trim();

          if (
            section === 'specifications' ||
            [
              'Intended Use',
              'Wheel Size',
              'Braking System',
              'Frame Material',
              'Fork Material',
            ].includes(key)
          ) {
            result.specifications[key] = value;
          } else if (section === 'components') {
            result.components[key] = value;
          } else if (section === 'additional') {
            // skip additional info (importer address etc.)
          } else {
            result.features.push(fullText);
          }
        } else if (fullText.length > 10 && !fullText.includes('Country of Origin')) {
          result.features.push(fullText);
        }
      });
    sectionIdx++;
  });

  return result;
}

/**
 * Extract structured tag info from the Shopify tags array.
 */
function parseTags(tags) {
  if (!tags) return {};
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

// ── Target bike list ─────────────────────────────────────────────────────────
// Built from hardcoded-products-audit.md and src/data/bikes.ts

const targets = [
  // existingBikes (16 fully-specified bikes)
  'Argon 18 Nitrogen',
  'Lapierre Aircode DRS 5.0',
  'Scott Plasma 10',
  'Scott Addict RC',
  'Trek Domane AL 5',
  'Lapierre Xelius SL 5.0',
  'Argon 18 Gallium Pro',
  'Scott Speedster CX 20 Disc',
  'Marin Nicasio 2',
  'Trek Marlin 5 Gen 3',
  'Scott Spark 960',
  'Scott Scale 970',
  'Marin Rift Zone 29',
  'Avanti Giro F1W',
  'Avanti Giro FM 1W',
  'Trek FX 3 Disc',

  // jsonStock – road bikes
  'Trek Speed Concept',
  'Trek Madone SL6 Gen8',
  'Trek Madone SL7 Gen8',
  'Trek Madone SL5 Gen8',
  'Trek Emonda ALR 5',
  'Trek Domane AL5 Gen4',
  'Trek Emonda SL5',
  'Trek Domane AL4 Gen4',
  'Scott Addict 20',
  'Scott Addict 50',
  'Scott Speedster Gravel 50',
  'Scott Speedster 40',
  'Scott Speedster 10',
  'Scott Foil RC 20',
  'Pinarello Granger Gravel',
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
  'Trek Marlin 5',
  'Trek Marlin 4',
  'Scott Aspect 960',
  'Polygon Cascade 2',
];

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   Pro Riders Hub – Bike Scraper (BumsOnTheSaddle API)   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  const results = [];
  let found = 0;
  let notFound = 0;

  for (let i = 0; i < targets.length; i++) {
    const query = targets[i];
    process.stdout.write(`[${i + 1}/${targets.length}] ${query}... `);

    // Try BumsOnTheSaddle first
    let product = await fetchFromBOTS(query);

    if (product) {
      const parsed = parseHtmlBody(product.body);
      const tagInfo = parseTags(product.tags);

      results.push({
        sourceQuery: query,
        source: 'bumsonthesaddle',
        shopifyId: product.id,
        name: product.title,
        brand: product.vendor || tagInfo.brand || 'Unknown',
        price: parseFloat(product.price),
        compareAtPrice: product.compare_at_price_max
          ? parseFloat(product.compare_at_price_max)
          : null,
        image: product.image,
        images: product.featured_image?.url ? [product.featured_image.url] : [],
        url: `https://bumsonthesaddle.com${product.url?.split('?')[0] || ''}`,
        available: product.available,
        variants: (product.variants || []).map((v) => ({
          size: v.title,
          price: parseFloat(v.price),
          available: v.available,
        })),
        tags: product.tags,
        tagInfo,
        ...parsed,
      });

      console.log(`✓ FOUND  ₹${product.price}`);
      found++;
    } else {
      // Fallback: try Dbykstore
      const dbykResult = await fetchFromDbyk(query);
      if (dbykResult && dbykResult.title) {
        results.push({
          sourceQuery: query,
          source: 'dbykstore',
          name: dbykResult.title,
          brand: query.split(' ')[0],
          price: dbykResult.price,
          image: dbykResult.image,
          url: dbykResult.url,
          available: true,
          features: [],
          specifications: {},
          components: {},
          tags: [],
          tagInfo: {},
          variants: [],
        });
        console.log(`✓ FOUND (dbyk)  ₹${dbykResult.price || '??'}`);
        found++;
      } else {
        results.push({
          sourceQuery: query,
          source: 'not_found',
          name: query,
          brand: query.split(' ')[0],
          price: null,
          image: null,
          url: null,
          available: false,
          features: [],
          specifications: {},
          components: {},
          tags: [],
          tagInfo: {},
          variants: [],
        });
        console.log('✗ NOT FOUND');
        notFound++;
      }
    }

    // Polite delay
    await delay(800);
  }

  // Write output
  const outPath = path.join(__dirname, '..', 'src', 'data', 'scraped-bikes.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');

  console.log('\n════════════════════════════════════════════════════════════');
  console.log(`  Total: ${targets.length}  |  Found: ${found}  |  Not Found: ${notFound}`);
  console.log(`  Output: ${outPath}`);
  console.log('════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
