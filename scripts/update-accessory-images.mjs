import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://yeejxvxyabrmnpdnziek.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZWp4dnh5YWJybW5wZG56aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDcwNjcsImV4cCI6MjA5Nzc4MzA2N30.3GdoadfMVfDVpa3YQkYRd6zAxbdBoY1BnEk-ejFQOeM';

async function updateProductImage(id, imageUrl) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/db_products?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      images: [imageUrl]
    })
  });
  return res.ok;
}

async function main() {
  const dataPath = path.resolve(__dirname, '..', 'src', 'data', 'accessory-images-to-update.json');
  if (!fs.existsSync(dataPath)) {
    console.error('No updates file found. Run research script first.');
    return;
  }
  
  const updates = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`Found ${updates.length} items to update in DB.`);

  let success = 0;
  let failed = 0;

  for (const item of updates) {
    const ok = await updateProductImage(item.id, item.imageUrl);
    if (ok) {
      success++;
      process.stdout.write(`\r  Updated ${success}/${updates.length} successfully`);
    } else {
      failed++;
      console.log(`\n  ❌ Failed to update ${item.name} (${item.id})`);
    }
  }

  console.log(`\n\n✅ Update Complete: ${success} successful, ${failed} failed.`);
}

main().catch(console.error);
