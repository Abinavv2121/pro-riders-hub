/**
 * Migration: adds user_id column to orders + creates profiles table.
 *
 * Usage:  node scripts/add-user-columns.mjs
 */

const SUPABASE_URL = "https://yeejxvxyabrmnpdnziek.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZWp4dnh5YWJybW5wZG56aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDcwNjcsImV4cCI6MjA5Nzc4MzA2N30.3GdoadfMVfDVpa3YQkYRd6zAxbdBoY1BnEk-ejFQOeM";

const SQL = `
-- Add user_id to orders (safe to run multiple times)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users ON DELETE SET NULL;

-- Create profiles table (safe to run multiple times)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;
`;

async function checkColumnExists() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?select=user_id&limit=0`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  // If the column doesn't exist PostgREST returns 400
  return res.ok;
}

async function main() {
  console.log("Pro Riders Hub — User Columns Migration\n");

  console.log("Checking if user_id column already exists on orders...");
  const alreadyMigrated = await checkColumnExists();

  if (alreadyMigrated) {
    console.log("✅  user_id column already exists — nothing to do.\n");
    return;
  }

  console.log("❌  user_id column is missing.\n");
  console.log("The anon key cannot execute DDL statements.");
  console.log("Please run the following SQL in your Supabase SQL Editor:\n");
  console.log("  1. Go to: https://supabase.com/dashboard/project/yeejxvxyabrmnpdnziek/sql/new");
  console.log("  2. Paste the SQL below and click Run\n");
  console.log("─".repeat(60));
  console.log(SQL);
  console.log("─".repeat(60));
  console.log("\nAfter running the SQL, re-run this script to confirm.");
}

main().catch(console.error);
