-- Run this in the Supabase SQL Editor to create all required tables

-- ============================================================
-- EXISTING TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'pending'
);

-- ============================================================
-- ADMIN-CREATED PRODUCTS
-- ============================================================

CREATE TABLE IF NOT EXISTS db_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  type text NOT NULL,                      -- 'bike' | 'apparel' | 'accessory'
  price numeric NOT NULL,
  original_price numeric,
  description text,
  images text[] DEFAULT '{}',
  specifications jsonb DEFAULT '{}',
  stock_quantity integer DEFAULT 0,
  stock_status text DEFAULT 'In Stock',   -- 'In Stock' | 'Limited Stock' | 'Out of Stock'
  tag text,                               -- 'New Arrival' | 'Sale' | null
  size text,
  color text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- SALES / PROMOTIONS
-- ============================================================

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

-- ============================================================
-- CUSTOMER ORDERS
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  items jsonb NOT NULL,                   -- array of { name, brand, image, color, size, quantity, price }
  total_amount numeric NOT NULL,
  payment_method text NOT NULL,           -- 'cod' | 'upi'
  order_status text DEFAULT 'to_be_delivered',  -- 'to_be_delivered' | 'delivered'
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- PRODUCT QUERIES / FEEDBACKS
-- ============================================================

CREATE TABLE IF NOT EXISTS product_queries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL,
  product_name text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  query_message text NOT NULL,
  admin_reply text,
  replied_at timestamp with time zone,
  status text DEFAULT 'pending',          -- 'pending' | 'replied'
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- USER PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update only their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Add user_id to orders table (run only if orders table already exists)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users ON DELETE SET NULL;

-- ============================================================
-- SUPABASE STORAGE SETUP (do in Dashboard)
-- ============================================================
-- 1. Go to Storage in the Supabase dashboard
-- 2. Create a new bucket named:  product-images
-- 3. Enable "Public bucket" so images are publicly accessible
-- 4. Add the following RLS policy to allow uploads:
--    Policy name: Allow admin uploads
--    Operation: INSERT
--    Check: true   (allow all inserts — protected by your admin auth layer)

-- ============================================================
-- BIKE SERVICING REQUESTS
-- ============================================================

CREATE TABLE IF NOT EXISTS service_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  package_id text NOT NULL,
  package_name text NOT NULL,
  service_date text NOT NULL,
  service_time_slot text NOT NULL,
  priority_booking boolean DEFAULT false,
  pickup_delivery boolean DEFAULT false,
  total_price numeric NOT NULL,
  bike_brand text,
  bike_model text,
  problem_description text NOT NULL,
  bike_photos text[] DEFAULT '{}',
  invoice_url text,
  status text DEFAULT 'received',          -- 'received' | 'diagnosing' | 'in-service' | 'ready' | 'delivered'
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='service_requests' AND policyname='Allow public insert on service_requests') THEN
    CREATE POLICY "Allow public insert on service_requests" ON service_requests FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='service_requests' AND policyname='Allow public select on service_requests') THEN
    CREATE POLICY "Allow public select on service_requests" ON service_requests FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='service_requests' AND policyname='Allow public update on service_requests') THEN
    CREATE POLICY "Allow public update on service_requests" ON service_requests FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='service_requests' AND policyname='Allow public delete on service_requests') THEN
    CREATE POLICY "Allow public delete on service_requests" ON service_requests FOR DELETE USING (true);
  END IF;
END $$;

