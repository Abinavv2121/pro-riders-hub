/**
 * Cleanup script: removes duplicate products from db_products,
 * keeping only the first occurrence of each name+brand+category combo.
 *
 * Also validates correctness of existing accessory/apparel data.
 *
 * Usage:  node scripts/cleanup-duplicates.mjs
 */

const SUPABASE_URL = 'https://yeejxvxyabrmnpdnziek.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZWp4dnh5YWJybW5wZG56aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDcwNjcsImV4cCI6MjA5Nzc4MzA2N30.3GdoadfMVfDVpa3YQkYRd6zAxbdBoY1BnEk-ejFQOeM';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAllProducts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/db_products?select=*&order=created_at.asc`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  );
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function deleteProduct(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/db_products?id=eq.${id}`,
    {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
    },
  );
  return res.ok;
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Pro Riders Hub — Duplicate Cleanup & Data Validation    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // 1. Fetch all products
  console.log('── Step 1: Fetching all products from db_products ──\n');
  const allProducts = await fetchAllProducts();
  console.log(`  Total products in DB: ${allProducts.length}\n`);

  // 2. Find duplicates (by name + brand + category)
  console.log('── Step 2: Finding duplicates ──\n');
  const seen = new Map();
  const duplicateIds = [];
  const duplicateDetails = [];

  for (const p of allProducts) {
    const key = `${(p.name || '').toLowerCase().trim()}|${(p.brand || '').toLowerCase().trim()}|${(p.category || '').toLowerCase().trim()}`;

    if (seen.has(key)) {
      duplicateIds.push(p.id);
      duplicateDetails.push({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        keepId: seen.get(key).id,
      });
    } else {
      seen.set(key, p);
    }
  }

  console.log(`  Unique products: ${seen.size}`);
  console.log(`  Duplicates found: ${duplicateIds.length}\n`);

  if (duplicateDetails.length > 0) {
    console.log('  Duplicate entries to remove:');
    for (const d of duplicateDetails) {
      console.log(`    ✗ ${d.name} (${d.brand}) [${d.category}] — ID: ${d.id.slice(0, 8)}...`);
    }
    console.log('');
  }

  // 3. Delete duplicates
  if (duplicateIds.length > 0) {
    console.log('── Step 3: Deleting duplicates ──\n');
    let deleted = 0;
    let failed = 0;

    for (const id of duplicateIds) {
      const ok = await deleteProduct(id);
      if (ok) {
        deleted++;
      } else {
        failed++;
        console.error(`    ✗ Failed to delete ${id}`);
      }
      // Small delay to not overwhelm the API
      if (deleted % 10 === 0) await delay(200);
    }

    console.log(`  ✅ Deleted ${deleted} duplicates, ${failed} failed\n`);
  }

  // 4. Validate remaining products
  console.log('── Step 4: Validating data quality ──\n');
  const remaining = await fetchAllProducts();
  
  const issues = [];
  for (const p of remaining) {
    const pIssues = [];

    // Check for missing name
    if (!p.name || p.name.trim().length === 0) {
      pIssues.push('Missing name');
    }

    // Check for missing brand
    if (!p.brand || p.brand.trim().length === 0) {
      pIssues.push('Missing brand');
    }

    // Check for missing/zero price
    if (!p.price || p.price <= 0) {
      pIssues.push('Missing/zero price');
    }

    // Check for placeholder names (from auto-generated products.ts)
    if (p.name && (p.name.includes(' V1') || p.name.includes(' V2') || p.name.includes(' V3'))) {
      pIssues.push('Placeholder name (V1/V2/V3 suffix)');
    }

    // Check for missing description
    if (!p.description || p.description.trim().length < 10) {
      pIssues.push('Missing/short description');
    }

    // Check for empty specifications
    if (!p.specifications || Object.keys(p.specifications).length === 0) {
      pIssues.push('Empty specifications');
    }

    if (pIssues.length > 0) {
      issues.push({ id: p.id, name: p.name, brand: p.brand, category: p.category, type: p.type, issues: pIssues });
    }
  }

  // Summary by category
  const catCounts = {};
  remaining.forEach((p) => {
    const k = `${p.type}|${p.category}`;
    catCounts[k] = (catCounts[k] || 0) + 1;
  });

  console.log('  Products by category (after cleanup):');
  for (const [k, v] of Object.entries(catCounts).sort()) {
    console.log(`    ${k.padEnd(30)} ${v}`);
  }
  console.log(`\n  Total remaining: ${remaining.length}`);

  if (issues.length > 0) {
    console.log(`\n  ⚠️  Products with data quality issues: ${issues.length}`);
    const byIssue = {};
    issues.forEach((i) => {
      i.issues.forEach((iss) => {
        byIssue[iss] = (byIssue[iss] || 0) + 1;
      });
    });
    for (const [issue, count] of Object.entries(byIssue).sort((a, b) => b[1] - a[1])) {
      console.log(`    ${issue}: ${count} products`);
    }
  } else {
    console.log('\n  ✅ All products pass data quality checks!');
  }

  console.log('\n════════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
