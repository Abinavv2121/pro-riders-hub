-- ============================================================
-- Pro Riders Hub — PostgreSQL Schema + Seed Data
-- ============================================================
-- Run with:
--   psql -h localhost -U postgres -p 5432 -c "CREATE DATABASE bike_store;"
--   psql -h localhost -U postgres -p 5432 -d bike_store -f bike_store_schema.sql
--
-- Password: sudhir666 (will be prompted or use PGPASSWORD env var)
-- ============================================================

-- ========================
-- EXTENSIONS
-- ========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================
-- ENUM TYPES
-- ========================
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'staff');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('upi', 'card', 'emi', 'cod', 'wallet');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE service_type AS ENUM ('bike_servicing', 'bike_fitting', 'custom_build', 'pickup_delivery', 'suspension_tuning');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

-- ========================
-- 1. USERS
-- ========================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- NULL for guest checkout
    full_name VARCHAR(150),
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    is_guest BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ========================
-- 2. SESSIONS
-- ========================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);

-- ========================
-- 3. CATEGORIES
-- ========================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ========================
-- 4. BRANDS
-- ========================
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    country VARCHAR(100),
    website_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brands_slug ON brands(slug);

-- ========================
-- 5. PRODUCTS
-- ========================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    brand_id INTEGER NOT NULL REFERENCES brands(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    base_price NUMERIC(12,2) NOT NULL CHECK (base_price >= 0),
    sale_price NUMERIC(12,2) CHECK (sale_price >= 0),
    emi_available BOOLEAN DEFAULT FALSE,
    emi_min_months INTEGER DEFAULT 3,
    emi_max_months INTEGER DEFAULT 24,
    frame_material VARCHAR(50), -- Carbon, Aluminum, Steel, Titanium
    specifications JSONB DEFAULT '{}',
    -- Example specs: {"weight": "8.2kg", "groupset": "Shimano 105", "wheel_size": "700c", ...}
    size_guide JSONB DEFAULT '[]',
    -- Example: [{"size": "S", "height_cm_min": 155, "height_cm_max": 165}, ...]
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(base_price);
CREATE INDEX idx_products_frame ON products(frame_material);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
-- GIN index for JSONB specs search
CREATE INDEX idx_products_specs ON products USING GIN (specifications);

-- ========================
-- 6. SKUS (Product Variants)
-- ========================
CREATE TABLE skus (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku_code VARCHAR(50) NOT NULL UNIQUE,
    size VARCHAR(20),
    color VARCHAR(50),
    price_override NUMERIC(12,2), -- NULL = use product base_price
    weight_grams INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skus_product ON skus(product_id);
CREATE INDEX idx_skus_code ON skus(sku_code);

-- ========================
-- 7. INVENTORY
-- ========================
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    sku_id INTEGER NOT NULL REFERENCES skus(id) ON DELETE CASCADE UNIQUE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0),
    low_stock_threshold INTEGER DEFAULT 3,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_sku ON inventory(sku_id);

-- ========================
-- 8. IMAGES
-- ========================
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'product', 'blog', 'event', 'banner', 'gallery'
    entity_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    width INTEGER,
    height INTEGER,
    format VARCHAR(10) DEFAULT 'webp',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_images_entity ON images(entity_type, entity_id);

-- ========================
-- 9. COUPONS
-- ========================
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    min_order_amount NUMERIC(12,2) DEFAULT 0,
    max_discount_amount NUMERIC(12,2), -- cap for percentage discounts
    usage_limit INTEGER, -- NULL = unlimited
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);

-- ========================
-- 10. ORDERS
-- ========================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    status order_status NOT NULL DEFAULT 'pending',
    subtotal NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    shipping_amount NUMERIC(12,2) DEFAULT 0,
    tax_amount NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    coupon_id INTEGER REFERENCES coupons(id),
    shipping_name VARCHAR(150),
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_pincode VARCHAR(10),
    shipping_phone VARCHAR(20),
    notes TEXT,
    invoice_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ========================
-- 11. ORDER ITEMS
-- ========================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    sku_id INTEGER REFERENCES skus(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL,
    product_snapshot JSONB, -- snapshot of product at time of order
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ========================
-- 12. PAYMENTS
-- ========================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    payment_method payment_method NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    provider VARCHAR(50), -- 'razorpay', 'stripe', etc.
    provider_payment_id VARCHAR(255),
    provider_order_id VARCHAR(255),
    provider_signature VARCHAR(255),
    emi_months INTEGER, -- NULL if not EMI
    emi_monthly_amount NUMERIC(12,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_provider ON payments(provider_payment_id);

-- ========================
-- 13. SERVICES
-- ========================
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    type service_type NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    base_price NUMERIC(10,2),
    duration_minutes INTEGER DEFAULT 60,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_type ON services(type);

-- ========================
-- 14. BOOKINGS
-- ========================
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    service_id INTEGER NOT NULL REFERENCES services(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    assigned_staff_id UUID REFERENCES users(id),
    customer_name VARCHAR(150),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    bike_details TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Prevent double-booking for same service at same time
    CONSTRAINT no_overlap EXCLUDE USING gist (
        service_id WITH =,
        tsrange(
            (booking_date + start_time)::timestamp,
            (booking_date + end_time)::timestamp
        ) WITH &&
    ) WHERE (status NOT IN ('cancelled'))
);

-- Note: the EXCLUDE constraint requires btree_gist extension
-- We'll handle this via application-level locking if the extension isn't available

CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ========================
-- 15. REVIEWS
-- ========================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    body TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE UNIQUE INDEX idx_reviews_unique ON reviews(product_id, user_id); -- one review per user per product

-- ========================
-- 16. EVENTS
-- ========================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    event_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location VARCHAR(255),
    location_url TEXT, -- Google Maps link
    max_participants INTEGER,
    registered_count INTEGER DEFAULT 0,
    registration_fee NUMERIC(10,2) DEFAULT 0,
    image_url TEXT,
    status content_status DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);

-- Event registrations
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, email)
);

CREATE INDEX idx_event_reg_event ON event_registrations(event_id);

-- ========================
-- 17. BLOGS
-- ========================
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt VARCHAR(500),
    body TEXT NOT NULL,
    author_id UUID REFERENCES users(id),
    cover_image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    status content_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_published ON blogs(published_at DESC);
CREATE INDEX idx_blogs_tags ON blogs USING GIN (tags);

-- ========================
-- 18. TESTIMONIALS
-- ========================
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    customer_title VARCHAR(100), -- e.g., "Weekend Rider"
    avatar_url TEXT,
    body TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- 19. BANNERS
-- ========================
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    image_url TEXT NOT NULL,
    link_url TEXT,
    link_text VARCHAR(100),
    placement VARCHAR(50) DEFAULT 'homepage', -- 'homepage', 'shop', 'services'
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_banners_placement ON banners(placement);

-- ========================
-- UPDATED_AT TRIGGER FUNCTION
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_blogs_updated BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_inventory_updated BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED DATA
-- ============================================================

-- -------
-- USERS (3)
-- -------
INSERT INTO users (id, email, password_hash, full_name, phone, role, city, state, pincode) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-111111111111', 'admin@proriders.com', crypt('admin123', gen_salt('bf')), 'Pro Riders Admin', '+919876543210', 'admin', 'Coimbatore', 'Tamil Nadu', '641001'),
  ('a1b2c3d4-e5f6-7890-abcd-222222222222', 'sudhir@example.com', crypt('password123', gen_salt('bf')), 'Sudhir Kumar', '+919876543211', 'customer', 'Chennai', 'Tamil Nadu', '600001'),
  ('a1b2c3d4-e5f6-7890-abcd-333333333333', 'priya@example.com', crypt('password123', gen_salt('bf')), 'Priya Sharma', '+919876543212', 'customer', 'Bangalore', 'Karnataka', '560001');

-- -------
-- CATEGORIES (6)
-- -------
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  (1, 'Road Bikes', 'road-bikes', 'Performance road bicycles for racing and endurance', 1),
  (2, 'Mountain Bikes', 'mtb', 'Mountain bikes for trail, XC, and downhill', 2),
  (3, 'Hybrid Bikes', 'hybrid', 'Versatile bikes for commuting and light off-road', 3),
  (4, 'Pre-owned', 'pre-owned', 'Certified pre-owned bikes at great prices', 4),
  (5, 'Accessories', 'accessories', 'Helmets, lights, locks, jerseys and more', 5),
  (6, 'Components', 'components', 'Frames, wheels, groupsets, handlebars and parts', 6);
SELECT setval('categories_id_seq', 6);

-- -------
-- BRANDS (3)
-- -------
INSERT INTO brands (id, name, slug, logo_url, description, country) VALUES
  (1, 'Scott', 'scott', '/images/brands/scott.webp', 'Swiss performance cycling brand', 'Switzerland'),
  (2, 'Trek', 'trek', '/images/brands/trek.webp', 'American bicycle manufacturer since 1976', 'USA'),
  (3, 'Argon 18', 'argon-18', '/images/brands/argon18.webp', 'Canadian high-performance bike maker', 'Canada');
SELECT setval('brands_id_seq', 3);

-- -------
-- PRODUCTS (10)
-- -------
INSERT INTO products (id, name, slug, description, short_description, brand_id, category_id, base_price, sale_price, emi_available, frame_material, specifications, size_guide, is_featured) VALUES
(1, 'Scott Addict RC Ultimate', 'scott-addict-rc-ultimate', 'The lightest production road frame ever made. Designed for climbing and all-round racing.', 'Lightweight carbon road bike for racing', 1, 1, 450000.00, 425000.00, TRUE, 'Carbon',
  '{"weight": "6.8 kg", "groupset": "SRAM Red AXS", "wheel_size": "700c", "brakes": "Disc", "gears": "2x12", "fork": "Scott Carbon"}',
  '[{"size": "S", "height_min": 160, "height_max": 170}, {"size": "M", "height_min": 170, "height_max": 180}, {"size": "L", "height_min": 180, "height_max": 190}]',
  TRUE),

(2, 'Trek Domane SLR 7', 'trek-domane-slr-7', 'Endurance road bike with IsoSpeed decoupler for unmatched comfort over long distances.', 'Endurance carbon road bike', 2, 1, 380000.00, NULL, TRUE, 'Carbon',
  '{"weight": "8.1 kg", "groupset": "Shimano Ultegra Di2", "wheel_size": "700c", "brakes": "Disc", "gears": "2x12", "fork": "Trek Carbon IsoSpeed"}',
  '[{"size": "S", "height_min": 155, "height_max": 165}, {"size": "M", "height_min": 165, "height_max": 178}, {"size": "L", "height_min": 178, "height_max": 190}]',
  TRUE),

(3, 'Argon 18 Nitrogen', 'argon-18-nitrogen', 'Aero road bike optimized for speed. Wind-tunnel tested geometry.', 'Aero carbon road bike', 3, 1, 190000.00, NULL, TRUE, 'Carbon',
  '{"weight": "8.0 kg", "groupset": "Shimano 105", "wheel_size": "700c", "brakes": "Rim", "gears": "2x11", "fork": "Argon 18 Carbon"}',
  '[{"size": "M", "height_min": 170, "height_max": 180}, {"size": "L", "height_min": 180, "height_max": 190}]',
  FALSE),

(4, 'Scott Spark 960', 'scott-spark-960', 'Full-suspension trail mountain bike. 120mm travel, perfect for XC and trail riding.', 'Full-suspension trail MTB', 1, 2, 185000.00, 175000.00, TRUE, 'Aluminum',
  '{"weight": "12.8 kg", "suspension": "120mm/120mm", "groupset": "Shimano Deore", "wheel_size": "29\\"", "brakes": "Disc Hydraulic", "gears": "1x12"}',
  '[{"size": "M", "height_min": 168, "height_max": 178}, {"size": "L", "height_min": 178, "height_max": 188}]',
  TRUE),

(5, 'Trek Marlin 7', 'trek-marlin-7', 'Hardtail mountain bike for trail and cross-country. Great value for entry-level riders.', 'Hardtail trail MTB', 2, 2, 75000.00, NULL, FALSE, 'Aluminum',
  '{"weight": "13.2 kg", "suspension": "100mm front", "groupset": "Shimano Deore", "wheel_size": "29\\"", "brakes": "Disc Hydraulic", "gears": "1x10"}',
  '[{"size": "S", "height_min": 155, "height_max": 165}, {"size": "M", "height_min": 165, "height_max": 178}, {"size": "L", "height_min": 178, "height_max": 190}, {"size": "XL", "height_min": 190, "height_max": 200}]',
  FALSE),

(6, 'Scott Sub Cross 30', 'scott-sub-cross-30', 'Sporty hybrid for daily commuting and weekend rides. Lightweight aluminum frame.', 'Sporty hybrid commuter bike', 1, 3, 62000.00, 58000.00, FALSE, 'Aluminum',
  '{"weight": "11.5 kg", "groupset": "Shimano Altus", "wheel_size": "700c", "brakes": "Disc Hydraulic", "gears": "3x8"}',
  '[{"size": "M", "height_min": 168, "height_max": 178}, {"size": "L", "height_min": 178, "height_max": 190}]',
  FALSE),

(7, 'Trek FX 3 Disc', 'trek-fx-3-disc', 'Premium fitness hybrid with carbon fork. Best in class for fitness commuting.', 'Carbon fork fitness hybrid', 2, 3, 68000.00, NULL, FALSE, 'Aluminum',
  '{"weight": "10.8 kg", "groupset": "Shimano Alivio", "wheel_size": "700c", "brakes": "Disc Hydraulic", "gears": "2x9", "fork": "Carbon"}',
  '[{"size": "M", "height_min": 165, "height_max": 178}, {"size": "L", "height_min": 178, "height_max": 190}]',
  FALSE),

(8, 'Scott Addict RC 30 (Pre-owned)', 'scott-addict-rc-30-preowned', 'Well-maintained 2023 model. Full service done. Shimano Ultegra groupset.', 'Certified pre-owned road bike', 1, 4, 210000.00, 185000.00, TRUE, 'Carbon',
  '{"weight": "7.8 kg", "groupset": "Shimano Ultegra", "wheel_size": "700c", "brakes": "Disc", "gears": "2x11", "condition": "Excellent", "year": 2023}',
  '[{"size": "M", "height_min": 170, "height_max": 180}]',
  TRUE),

(9, 'Shimano Ultegra R8100 Groupset', 'shimano-ultegra-r8100', 'Complete 12-speed Di2 electronic groupset. New in box.', 'Electronic 12-speed groupset', 2, 6, 125000.00, NULL, TRUE, NULL,
  '{"type": "Groupset", "speeds": "2x12", "shifting": "Di2 Electronic", "brake_type": "Disc Hydraulic", "weight": "2,434g"}',
  '[]',
  FALSE),

(10, 'Giro Aether MIPS Helmet', 'giro-aether-mips-helmet', 'Top-tier road cycling helmet with MIPS and Spherical technology.', 'Premium road cycling helmet', 2, 5, 28000.00, 25000.00, FALSE, NULL,
  '{"type": "Helmet", "technology": "MIPS Spherical", "weight": "250g", "ventilation": "21 vents", "certification": "CPSC, CE"}',
  '[{"size": "S", "head_cm_min": 51, "head_cm_max": 55}, {"size": "M", "head_cm_min": 55, "head_cm_max": 59}, {"size": "L", "head_cm_min": 59, "head_cm_max": 63}]',
  FALSE);

SELECT setval('products_id_seq', 10);

-- -------
-- SKUS + INVENTORY
-- -------
INSERT INTO skus (id, product_id, sku_code, size, color, is_active) VALUES
  (1,  1, 'SCOTT-ARC-ULT-M-BLK', 'M', 'Black/Red', TRUE),
  (2,  1, 'SCOTT-ARC-ULT-L-BLK', 'L', 'Black/Red', TRUE),
  (3,  2, 'TREK-DOM-SLR7-M-RED', 'M', 'Crimson Red', TRUE),
  (4,  2, 'TREK-DOM-SLR7-L-RED', 'L', 'Crimson Red', TRUE),
  (5,  3, 'ARG18-NIT-M-SIL',     'M', 'Silver Blue', TRUE),
  (6,  4, 'SCOTT-SP960-M-BLU',   'M', 'Stellar Blue', TRUE),
  (7,  4, 'SCOTT-SP960-L-BLU',   'L', 'Stellar Blue', TRUE),
  (8,  5, 'TREK-MAR7-M-DARK',    'M', 'Matte Dark', TRUE),
  (9,  5, 'TREK-MAR7-L-DARK',    'L', 'Matte Dark', TRUE),
  (10, 6, 'SCOTT-SC30-M-GRY',    'M', 'Grey', TRUE),
  (11, 7, 'TREK-FX3-M-GRY',      'M', 'Lithium Grey', TRUE),
  (12, 8, 'SCOTT-ARC30-PO-M',    'M', 'Black', TRUE),
  (13, 9, 'SHIM-ULT-R8100',      NULL, NULL, TRUE),
  (14, 10, 'GIRO-AETH-M',         'M', 'White/Silver', TRUE),
  (15, 10, 'GIRO-AETH-L',         'L', 'White/Silver', TRUE);
SELECT setval('skus_id_seq', 15);

INSERT INTO inventory (sku_id, quantity, reserved, low_stock_threshold) VALUES
  (1, 2, 0, 1), (2, 3, 0, 1), (3, 1, 0, 1), (4, 2, 0, 1), (5, 4, 0, 2),
  (6, 3, 0, 1), (7, 2, 1, 1), (8, 5, 0, 2), (9, 4, 0, 2), (10, 3, 0, 1),
  (11, 6, 0, 2), (12, 1, 0, 1), (13, 8, 0, 3), (14, 10, 0, 3), (15, 7, 0, 3);

-- -------
-- IMAGES (product images)
-- -------
INSERT INTO images (entity_type, entity_id, url, alt_text, sort_order, is_primary) VALUES
  ('product', 1, '/images/products/scott-addict-rc-1.webp', 'Scott Addict RC Ultimate', 0, TRUE),
  ('product', 1, '/images/products/scott-addict-rc-2.webp', 'Scott Addict RC Ultimate side view', 1, FALSE),
  ('product', 2, '/images/products/trek-domane-slr7-1.webp', 'Trek Domane SLR 7', 0, TRUE),
  ('product', 3, '/images/products/argon18-nitrogen-1.webp', 'Argon 18 Nitrogen', 0, TRUE),
  ('product', 4, '/images/products/scott-spark-960-1.webp', 'Scott Spark 960', 0, TRUE),
  ('product', 5, '/images/products/trek-marlin7-1.webp', 'Trek Marlin 7', 0, TRUE),
  ('product', 6, '/images/products/scott-subcross-1.webp', 'Scott Sub Cross 30', 0, TRUE),
  ('product', 7, '/images/products/trek-fx3-1.webp', 'Trek FX 3 Disc', 0, TRUE),
  ('product', 8, '/images/products/scott-addict-used-1.webp', 'Scott Addict RC 30 Pre-owned', 0, TRUE),
  ('product', 9, '/images/products/ultegra-r8100-1.webp', 'Shimano Ultegra R8100', 0, TRUE),
  ('product', 10, '/images/products/giro-aether-1.webp', 'Giro Aether MIPS', 0, TRUE);

-- -------
-- SERVICES (5)
-- -------
INSERT INTO services (id, name, slug, type, description, short_description, base_price, duration_minutes) VALUES
  (1, 'Basic Bike Servicing', 'basic-servicing', 'bike_servicing', 'Complete tune-up: brake and gear adjustment, chain lubrication, tyre pressure check, safety inspection.', 'Complete maintenance tune-up', 999.00, 60),
  (2, 'Professional Bike Fitting', 'pro-bike-fitting', 'bike_fitting', 'Advanced fitting using Retül motion capture: saddle height, reach, cleat position, handlebar setup.', 'Precision biomechanical fitting', 2499.00, 90),
  (3, 'Custom Dream Build', 'custom-build', 'custom_build', 'Build your dream bike from scratch. Choose frame, groupset, wheels, cockpit — we assemble and tune everything.', 'Bespoke bike assembly', NULL, 480),
  (4, 'Pickup & Delivery', 'pickup-delivery', 'pickup_delivery', 'We pick up your bike, service it, and deliver it back. Available within 30km of our store.', 'Doorstep collection & delivery', 299.00, 30),
  (5, 'Suspension Tuning', 'suspension-tuning', 'suspension_tuning', 'Expert fork and shock setup: sag setting, compression/rebound tuning, air spring service.', 'Fork and shock optimization', 1499.00, 60);
SELECT setval('services_id_seq', 5);

-- -------
-- BOOKINGS (3)
-- -------
INSERT INTO bookings (user_id, service_id, booking_date, start_time, end_time, status, customer_name, customer_email, customer_phone, bike_details) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-222222222222', 1, '2026-03-10', '10:00', '11:00', 'confirmed', 'Sudhir Kumar', 'sudhir@example.com', '+919876543211', 'Scott Addict RC - needs brake adjustment'),
  ('a1b2c3d4-e5f6-7890-abcd-333333333333', 2, '2026-03-12', '14:00', '15:30', 'pending', 'Priya Sharma', 'priya@example.com', '+919876543212', 'Trek Domane SLR 7 - first fitting'),
  ('a1b2c3d4-e5f6-7890-abcd-222222222222', 5, '2026-03-15', '11:00', '12:00', 'confirmed', 'Sudhir Kumar', 'sudhir@example.com', '+919876543211', 'Scott Spark 960 - rebound too soft');

-- -------
-- COUPONS (3)
-- -------
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, valid_until) VALUES
  ('WELCOME10', 'First purchase 10% off', 'percentage', 10.00, 5000.00, 10000.00, 100, '2026-12-31'),
  ('FLAT5K', '₹5,000 off on orders above ₹50,000', 'fixed', 5000.00, 50000.00, NULL, 50, '2026-06-30'),
  ('MONSOON20', 'Monsoon sale 20% off', 'percentage', 20.00, 10000.00, 25000.00, NULL, '2026-09-30');

-- -------
-- ORDERS (2)
-- -------
INSERT INTO orders (id, order_number, user_id, status, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, coupon_id, shipping_name, shipping_address_line1, shipping_city, shipping_state, shipping_pincode, shipping_phone) VALUES
  (1, 'PRH-2026-0001', 'a1b2c3d4-e5f6-7890-abcd-222222222222', 'delivered', 75000.00, 7500.00, 0.00, 12150.00, 79650.00, 1, 'Sudhir Kumar', '42 Anna Salai', 'Chennai', 'Tamil Nadu', '600001', '+919876543211'),
  (2, 'PRH-2026-0002', 'a1b2c3d4-e5f6-7890-abcd-333333333333', 'processing', 450000.00, 0.00, 0.00, 81000.00, 531000.00, NULL, 'Priya Sharma', '10 MG Road', 'Bangalore', 'Karnataka', '560001', '+919876543212');
SELECT setval('orders_id_seq', 2);

INSERT INTO order_items (order_id, product_id, sku_id, quantity, unit_price, total_price) VALUES
  (1, 5, 8, 1, 75000.00, 75000.00),
  (2, 1, 1, 1, 450000.00, 450000.00);

INSERT INTO payments (order_id, payment_method, payment_status, amount, provider, provider_payment_id) VALUES
  (1, 'upi', 'captured', 79650.00, 'razorpay', 'pay_test_001'),
  (2, 'emi', 'authorized', 531000.00, 'razorpay', 'pay_test_002');

-- -------
-- REVIEWS
-- -------
INSERT INTO reviews (product_id, user_id, rating, title, body, is_verified_purchase, is_approved) VALUES
  (5, 'a1b2c3d4-e5f6-7890-abcd-222222222222', 5, 'Perfect entry-level MTB', 'Great bike for weekend trails. Shimano Deore shifting is crisp. Highly recommend for beginners.', TRUE, TRUE),
  (1, 'a1b2c3d4-e5f6-7890-abcd-333333333333', 4, 'Incredibly light frame', 'The Addict RC is phenomenal for climbing. Took a star off because the stock saddle isn''t great.', FALSE, TRUE);

-- -------
-- EVENTS (5)
-- -------
INSERT INTO events (title, slug, description, short_description, event_date, end_date, location, max_participants, registration_fee, status) VALUES
  ('Coimbatore Century Ride', 'coimbatore-century-2026', 'Join us for a 100km ride through the scenic Western Ghats. SAG support and hydration provided.', '100km scenic ride through Western Ghats', '2026-04-15 05:30:00+05:30', '2026-04-15 13:00:00+05:30', 'Pro Riders Hub Store, Coimbatore', 50, 500.00, 'published'),
  ('MTB Trail Day', 'mtb-trail-day-march', '3 guided trail loops for beginners and intermediates. Bike rental available.', 'Guided mountain bike trails for all levels', '2026-03-22 07:00:00+05:30', '2026-03-22 12:00:00+05:30', 'Ooty Trails, Nilgiris', 30, 750.00, 'published'),
  ('Bike Maintenance Workshop', 'maintenance-workshop-apr', 'Learn essential bike maintenance: puncture repair, brake adjustment, gear indexing.', 'Hands-on bike maintenance skills', '2026-04-05 10:00:00+05:30', '2026-04-05 14:00:00+05:30', 'Pro Riders Hub Store, Coimbatore', 20, 0.00, 'published'),
  ('Nandi Hills Sunrise Ride', 'nandi-hills-sunrise', 'Ride up Nandi Hills for sunrise. 60km round trip from Bangalore.', 'Sunrise climb ride to Nandi Hills', '2026-05-10 04:00:00+05:30', '2026-05-10 10:00:00+05:30', 'Cubbon Park, Bangalore', 40, 300.00, 'published'),
  ('Monsoon Mud Fest', 'monsoon-mud-fest-2026', 'Embrace the mud! Off-road gravel ride through monsoon trails.', 'Off-road monsoon adventure ride', '2026-07-20 06:00:00+05:30', '2026-07-20 14:00:00+05:30', 'Wayanad, Kerala', 25, 1000.00, 'draft');

-- -------
-- BLOGS (5)
-- -------
INSERT INTO blogs (title, slug, excerpt, body, author_id, tags, status, published_at) VALUES
  ('How to Choose Your First Road Bike', 'choose-first-road-bike', 'A beginner''s guide to picking the perfect road bike based on your riding style and budget.',
   '# How to Choose Your First Road Bike\n\nBuying your first road bike is exciting — and overwhelming. Here''s how to make the right choice.\n\n## Budget\nSet a realistic budget. Entry-level road bikes start around ₹50,000. For a solid bike with Shimano 105, expect ₹1,50,000+.\n\n## Frame Material\n- **Aluminum**: Affordable, stiff, slightly heavier\n- **Carbon**: Lighter, more comfortable, higher price\n- **Steel**: Classic feel, very comfortable, heavier\n\n## Sizing\nGet a professional fitting. A bike that doesn''t fit will cause discomfort and potential injury.\n\n## Where to Buy\nAlways buy from an authorized dealer for warranty and support.',
   'a1b2c3d4-e5f6-7890-abcd-111111111111', ARRAY['beginner', 'road-bikes', 'buying-guide'], 'published', '2026-02-15'),

  ('Essential MTB Maintenance Tips', 'mtb-maintenance-tips', 'Keep your mountain bike running smooth with these weekly maintenance routines.',
   '# Essential MTB Maintenance Tips\n\nMountain bikes take a beating. Regular maintenance prevents expensive repairs.\n\n## After Every Ride\n1. Wipe down frame and drivetrain\n2. Check tyre pressure\n3. Inspect brake pads\n\n## Weekly\n- Clean and lube chain\n- Check spoke tension\n- Inspect suspension seals\n\n## Monthly\n- Full drivetrain clean\n- Brake bleed check\n- Bearing checks',
   'a1b2c3d4-e5f6-7890-abcd-111111111111', ARRAY['mtb', 'maintenance', 'tips'], 'published', '2026-02-20'),

  ('Why Bike Fitting Matters', 'why-bike-fitting-matters', 'A professional bike fit can prevent injury and dramatically improve your performance.',
   '# Why Bike Fitting Matters\n\nMost cyclists ride bikes that don''t fit them properly. A professional fitting changes everything.\n\n## Performance Gains\n- Improved aerodynamics\n- More efficient pedaling\n- Better power transfer\n\n## Injury Prevention\n- Knee pain from saddle height\n- Back pain from reach\n- Neck strain from handlebar position\n\n## What to Expect\nA full fitting takes 60-90 minutes and includes motion analysis.',
   'a1b2c3d4-e5f6-7890-abcd-111111111111', ARRAY['bike-fitting', 'performance', 'health'], 'published', '2026-02-25'),

  ('Best Cycling Routes Near Coimbatore', 'cycling-routes-coimbatore', 'Discover the best road and gravel routes within 100km of Coimbatore.',
   '# Best Cycling Routes Near Coimbatore\n\nCoimbatore is a cyclist''s paradise. Here are our top picks.\n\n## 1. Valparai Hill Climb (82km)\nElevation: 1,500m gain. 40 hairpin bends. The ultimate test.\n\n## 2. Pollachi Loop (65km)\nFlat to rolling. Beautiful coconut groves. Great for beginners.\n\n## 3. Ooty via Coonoor (95km)\nScenic hill climb through tea plantations.\n\n## 4. Masinagudi Circuit (70km)\nMixed terrain. Watch for wildlife!',
   'a1b2c3d4-e5f6-7890-abcd-111111111111', ARRAY['routes', 'coimbatore', 'cycling'], 'published', '2026-03-01'),

  ('2026 Season Preview: What''s New', '2026-season-preview', 'Preview of the latest bikes and tech coming to Pro Riders Hub in 2026.',
   '# 2026 Season Preview\n\nExciting times ahead! Here''s what''s landing at the store.\n\n## New Arrivals\n- Scott Addict RC Ultimate\n- Trek Domane SLR 7\n- Argon 18 Sum Pro\n\n## Tech Trends\n- Electronic shifting becoming standard\n- Wider tyres for road\n- Integrated cockpits\n\n## Events\nStay tuned for our ride calendar.',
   'a1b2c3d4-e5f6-7890-abcd-111111111111', ARRAY['news', '2026', 'preview'], 'draft', NULL);

-- -------
-- TESTIMONIALS
-- -------
INSERT INTO testimonials (customer_name, customer_title, body, rating, is_featured, sort_order) VALUES
  ('Rajesh Menon', 'Weekend Warrior', 'Pro Riders Hub helped me find the perfect bike for my weekend rides. Their fitting service is top notch!', 5, TRUE, 1),
  ('Ananya Krishnan', 'Triathlete', 'Best cycling store in Tamil Nadu. Knowledgeable staff and genuine products.', 5, TRUE, 2),
  ('Vikram Sethi', 'Commuter', 'Bought my Trek FX 3 here. Excellent after-sales service and quick turnaround on servicing.', 4, TRUE, 3);

-- -------
-- BANNERS
-- -------
INSERT INTO banners (title, subtitle, image_url, link_url, link_text, placement, sort_order, is_active) VALUES
  ('New Season Collection', 'Discover the 2026 lineup from Scott, Trek & Argon 18', '/images/banners/hero-2026.webp', '/shop', 'Shop Now', 'homepage', 1, TRUE),
  ('Professional Bike Fitting', 'Ride faster, ride longer, ride pain-free', '/images/banners/fitting-promo.webp', '/services', 'Book Now', 'homepage', 2, TRUE),
  ('Pre-owned Deals', 'Certified bikes at great prices — limited stock', '/images/banners/preowned-sale.webp', '/shop?category=pre-owned', 'View Deals', 'shop', 1, TRUE);

-- ============================================================
-- SAMPLE QUERIES (for testing filters & related products)
-- ============================================================

-- Products filtered by category + price range + brand
-- SELECT p.*, b.name as brand_name, c.name as category_name
-- FROM products p
-- JOIN brands b ON p.brand_id = b.id
-- JOIN categories c ON p.category_id = c.id
-- WHERE p.is_active = TRUE
--   AND c.slug = 'road-bikes'
--   AND p.base_price BETWEEN 100000 AND 300000
--   AND b.slug = 'scott'
-- ORDER BY p.base_price ASC
-- LIMIT 12 OFFSET 0;

-- Product detail with stock status
-- SELECT p.*, b.name as brand_name, c.name as category_name,
--   COALESCE(SUM(inv.quantity - inv.reserved), 0) as available_stock
-- FROM products p
-- JOIN brands b ON p.brand_id = b.id
-- JOIN categories c ON p.category_id = c.id
-- LEFT JOIN skus s ON s.product_id = p.id
-- LEFT JOIN inventory inv ON inv.sku_id = s.id
-- WHERE p.slug = 'scott-addict-rc-ultimate'
-- GROUP BY p.id, b.name, c.name;

-- Related products (same category, different product)
-- SELECT p.id, p.name, p.slug, p.base_price, p.sale_price
-- FROM products p
-- WHERE p.category_id = 1 AND p.id != 1 AND p.is_active = TRUE
-- ORDER BY RANDOM() LIMIT 4;

-- Available time slots for a service on a date
-- SELECT b.start_time, b.end_time
-- FROM bookings b
-- WHERE b.service_id = 1
--   AND b.booking_date = '2026-03-10'
--   AND b.status NOT IN ('cancelled')
-- ORDER BY b.start_time;
