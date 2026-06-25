-- ============================================================
-- ENQUIRIES
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

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='enquiries' AND policyname='Allow public insert on enquiries') THEN
    CREATE POLICY "Allow public insert on enquiries" ON enquiries FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='enquiries' AND policyname='Allow public select on enquiries') THEN
    CREATE POLICY "Allow public select on enquiries" ON enquiries FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='enquiries' AND policyname='Allow public update on enquiries') THEN
    CREATE POLICY "Allow public update on enquiries" ON enquiries FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='enquiries' AND policyname='Allow public delete on enquiries') THEN
    CREATE POLICY "Allow public delete on enquiries" ON enquiries FOR DELETE USING (true);
  END IF;
END $$;

-- ============================================================
-- DB_PRODUCTS
-- ============================================================
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='db_products' AND policyname='Allow public read on db_products') THEN
    CREATE POLICY "Allow public read on db_products" ON db_products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='db_products' AND policyname='Allow public insert on db_products') THEN
    CREATE POLICY "Allow public insert on db_products" ON db_products FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='db_products' AND policyname='Allow public update on db_products') THEN
    CREATE POLICY "Allow public update on db_products" ON db_products FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='db_products' AND policyname='Allow public delete on db_products') THEN
    CREATE POLICY "Allow public delete on db_products" ON db_products FOR DELETE USING (true);
  END IF;
END $$;

-- ============================================================
-- SALES
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

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sales' AND policyname='Allow public read on sales') THEN
    CREATE POLICY "Allow public read on sales" ON sales FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sales' AND policyname='Allow public insert on sales') THEN
    CREATE POLICY "Allow public insert on sales" ON sales FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sales' AND policyname='Allow public update on sales') THEN
    CREATE POLICY "Allow public update on sales" ON sales FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sales' AND policyname='Allow public delete on sales') THEN
    CREATE POLICY "Allow public delete on sales" ON sales FOR DELETE USING (true);
  END IF;
END $$;

-- ============================================================
-- ORDERS
-- ============================================================
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Allow public insert on orders') THEN
    CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Allow public select on orders') THEN
    CREATE POLICY "Allow public select on orders" ON orders FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Allow public update on orders') THEN
    CREATE POLICY "Allow public update on orders" ON orders FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Allow public delete on orders') THEN
    CREATE POLICY "Allow public delete on orders" ON orders FOR DELETE USING (true);
  END IF;
END $$;

-- ============================================================
-- PRODUCT_QUERIES
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
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE product_queries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='product_queries' AND policyname='Allow public insert on product_queries') THEN
    CREATE POLICY "Allow public insert on product_queries" ON product_queries FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='product_queries' AND policyname='Allow public select on product_queries') THEN
    CREATE POLICY "Allow public select on product_queries" ON product_queries FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='product_queries' AND policyname='Allow public update on product_queries') THEN
    CREATE POLICY "Allow public update on product_queries" ON product_queries FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='product_queries' AND policyname='Allow public delete on product_queries') THEN
    CREATE POLICY "Allow public delete on product_queries" ON product_queries FOR DELETE USING (true);
  END IF;
END $$;

-- ============================================================
-- PRODUCT REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL,
  product_name text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  admin_reply text,
  replied_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='product_reviews' AND policyname='Allow public insert on product_reviews') THEN
    CREATE POLICY "Allow public insert on product_reviews" ON product_reviews FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='product_reviews' AND policyname='Allow public select on product_reviews') THEN
    CREATE POLICY "Allow public select on product_reviews" ON product_reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='product_reviews' AND policyname='Allow public update on product_reviews') THEN
    CREATE POLICY "Allow public update on product_reviews" ON product_reviews FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='product_reviews' AND policyname='Allow public delete on product_reviews') THEN
    CREATE POLICY "Allow public delete on product_reviews" ON product_reviews FOR DELETE USING (true);
  END IF;
END $$;

-- ============================================================
-- STORAGE BUCKET (manual step - cannot be done via SQL)
-- Go to Storage > New Bucket > "product-images" > Check "Public bucket"
-- ============================================================
