/**
 * Creates the bikes table in Supabase using the SQL API.
 * Usage: node scripts/create-table.mjs
 */

const SUPABASE_URL = 'https://iceqsvlfblehkislxhbw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZXFzdmxmYmxlaGtpc2x4aGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk2MTIsImV4cCI6MjA4NzE3NTYxMn0.cT9dw1CgSQDPvHXzPLurQYKUJBD1Egx1fzjAKLhNLQI';

const sql = `
CREATE TABLE IF NOT EXISTS bikes (
  id serial PRIMARY KEY,
  brand text NOT NULL,
  category text NOT NULL,
  product text NOT NULL,
  name text NOT NULL,
  size text,
  color text,
  groupset text,
  condition text DEFAULT 'new',
  year integer,
  price integer DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bikes_public_read' AND tablename = 'bikes') THEN
    CREATE POLICY "bikes_public_read" ON bikes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bikes_public_insert' AND tablename = 'bikes') THEN
    CREATE POLICY "bikes_public_insert" ON bikes FOR INSERT WITH CHECK (true);
  END IF;
END $$;
`;

async function main() {
  // Try method 1: Supabase SQL API (pg_net or rpc)
  console.log('Attempting to create bikes table via Supabase...');
  
  // Method: Try the /sql endpoint (available in newer Supabase versions)
  const endpoints = [
    { url: `${SUPABASE_URL}/rest/v1/rpc/exec_sql`, method: 'rpc' },
  ];

  // First try: use the pg_meta API
  const pgMetaRes = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (pgMetaRes.ok) {
    console.log('✅ Table created successfully via pg/query!');
    return;
  }

  console.log(`pg/query response: ${pgMetaRes.status} ${await pgMetaRes.text()}`);

  // Fallback: Print instructions
  console.log('\n' + '='.repeat(60));
  console.log('MANUAL STEP REQUIRED');
  console.log('='.repeat(60));
  console.log('');
  console.log('Please create the bikes table manually:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Sign in and navigate to your project');
  console.log('3. Go to SQL Editor');
  console.log('4. Paste and run the SQL from supabase_schema.sql');
  console.log('5. Then run: node scripts/seed-bikes.mjs');
}

main().catch(console.error);
