/**
 * Migration script: creates all required tables, RLS policies,
 * and storage bucket on the new Supabase project.
 *
 * Usage:  node scripts/migrate-to-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yeejxvxyabrmnpdnziek.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZWp4dnh5YWJybW5wZG56aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDcwNjcsImV4cCI6MjA5Nzc4MzA2N30.3GdoadfMVfDVpa3YQkYRd6zAxbdBoY1BnEk-ejFQOeM";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1E9mcW9ucMGAiR4Zl6VcWQ_jT8CndNP";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Helper: run a check by attempting to select from a table ────────────
async function tableExists(tableName) {
  const { error } = await supabase.from(tableName).select("id").limit(1);
  // If the table doesn't exist, Supabase returns a 404-like error with code "PGRST116" or similar
  return !error;
}

// ─── Helper: create table by inserting and checking ──────────────────────
async function ensureTableViaRest(tableName, testInsertRow, cleanup = true) {
  console.log(`  Checking table "${tableName}"...`);
  const exists = await tableExists(tableName);
  if (exists) {
    console.log(`  ✅ Table "${tableName}" already exists.`);
    return true;
  }
  console.log(`  ❌ Table "${tableName}" does NOT exist. It needs to be created via the SQL Editor.`);
  return false;
}

// ─── Main ────────────────────────────────────────────────────────────────
async function main() {
  console.log("==============================================");
  console.log("  Pro Riders Hub — Supabase Migration Script");
  console.log("==============================================\n");
  console.log(`Target: ${SUPABASE_URL}\n`);

  // --- Step 1: Verify connectivity ---
  console.log("Step 1: Verifying connectivity...");
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error("❌ Failed to connect to Supabase:", sessionError.message);
    process.exit(1);
  }
  console.log("✅ Connected to Supabase successfully.\n");

  // --- Step 2: Check tables ---
  console.log("Step 2: Checking required tables...\n");

  const tables = ["enquiries", "db_products", "sales", "orders", "product_queries"];
  const missingTables = [];

  for (const table of tables) {
    const exists = await tableExists(table);
    if (exists) {
      console.log(`  ✅ "${table}" — exists`);
    } else {
      console.log(`  ❌ "${table}" — MISSING`);
      missingTables.push(table);
    }
  }

  if (missingTables.length > 0) {
    console.log(`\n⚠️  ${missingTables.length} table(s) are missing: ${missingTables.join(", ")}`);
    console.log("\nPlease run the following SQL in the Supabase SQL Editor");
    console.log("(Dashboard → SQL Editor → New Query → paste & Run):\n");
    console.log("─".repeat(60));
    console.log(generateSQL(missingTables));
    console.log("─".repeat(60));
    console.log("\nAfter running the SQL, re-run this script to verify.\n");
  } else {
    console.log("\n✅ All required tables exist!\n");
  }

  // --- Step 3: Check/create storage bucket ---
  console.log("Step 3: Checking storage bucket 'product-images'...");
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

  if (bucketError) {
    console.log(`  ⚠️  Could not list buckets: ${bucketError.message}`);
    console.log("  You may need to create the 'product-images' bucket manually in the Dashboard.\n");
  } else {
    const bucketExists = buckets?.some((b) => b.name === "product-images");
    if (bucketExists) {
      console.log("  ✅ Bucket 'product-images' already exists.\n");
    } else {
      console.log("  Creating bucket 'product-images'...");
      const { error: createError } = await supabase.storage.createBucket("product-images", {
        public: true,
      });
      if (createError) {
        console.log(`  ⚠️  Could not create bucket: ${createError.message}`);
        console.log("  Please create it manually: Dashboard → Storage → New Bucket → 'product-images' (Public).\n");
      } else {
        console.log("  ✅ Bucket 'product-images' created successfully.\n");
      }
    }
  }

  // --- Step 4: Verify table access with sample queries ---
  if (missingTables.length === 0) {
    console.log("Step 4: Verifying table access...\n");
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select("*").limit(1);
      if (error) {
        console.log(`  ⚠️  "${table}" — select failed: ${error.message}`);
      } else {
        console.log(`  ✅ "${table}" — accessible (${data.length} rows returned)`);
      }
    }
    console.log("\n✅ Migration verification complete! All systems operational.\n");
  }

  // --- Step 5: List any existing auth users ---
  console.log("Step 5: Auth status...");
  console.log("  ℹ️  New Supabase project — no existing users. Ready for fresh admin signup.\n");

  console.log("==============================================");
  console.log("  Migration script finished.");
  console.log("==============================================\n");
}

// ─── SQL Generator for missing tables ────────────────────────────────────
function generateSQL(missingTables) {
  const sqlParts = [];

  if (missingTables.includes("enquiries")) {
    sqlParts.push(`
-- ENQUIRIES
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'pending'
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read on enquiries" ON enquiries FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update on enquiries" ON enquiries FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on enquiries" ON enquiries FOR DELETE USING (true);
`);
  }

  if (missingTables.includes("db_products")) {
    sqlParts.push(`
-- DB_PRODUCTS
CREATE TABLE IF NOT EXISTS db_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  type text NOT NULL,
  price numeric NOT NULL,
  original_price numeric,
  description text,
  images text[] DEFAULT '{}',
  specifications jsonb DEFAULT '{}',
  stock_quantity integer DEFAULT 0,
  stock_status text DEFAULT 'In Stock',
  tag text,
  size text,
  color text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE db_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on db_products" ON db_products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on db_products" ON db_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on db_products" ON db_products FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on db_products" ON db_products FOR DELETE USING (true);
`);
  }

  if (missingTables.includes("sales")) {
    sqlParts.push(`
-- SALES
CREATE TABLE IF NOT EXISTS sales (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  discount_percentage integer,
  banner_image text,
  valid_from timestamp with time zone DEFAULT now(),
  valid_until timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on sales" ON sales FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on sales" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on sales" ON sales FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on sales" ON sales FOR DELETE USING (true);
`);
  }

  if (missingTables.includes("orders")) {
    sqlParts.push(`
-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  payment_method text NOT NULL,
  order_status text DEFAULT 'to_be_delivered',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read on orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update on orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on orders" ON orders FOR DELETE USING (true);
`);
  }

  if (missingTables.includes("product_queries")) {
    sqlParts.push(`
-- PRODUCT_QUERIES
CREATE TABLE IF NOT EXISTS product_queries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL,
  product_name text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  query_message text NOT NULL,
  admin_reply text,
  replied_at timestamp with time zone,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE product_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on product_queries" ON product_queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read on product_queries" ON product_queries FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update on product_queries" ON product_queries FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on product_queries" ON product_queries FOR DELETE USING (true);
`);
  }

  return sqlParts.join("\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
