# Pro Riders Hub — Application Architecture

## Overview

Pro Riders Hub (ProBikers) is a full-stack e-commerce and bike service platform for Chennai's premier cycling store. It combines a React/TypeScript SPA frontend with a Supabase (PostgreSQL) backend, providing product browsing, cart/checkout, admin management, user authentication, and service booking.

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | React | 18.3.1 |
| Language | TypeScript | 5.x |
| Build tool | Vite + SWC | Latest |
| Routing | React Router DOM | 6.30.1 |
| State management | React Context API | — |
| Server state | TanStack React Query | 5.83.0 |
| Styling | Tailwind CSS | 3.4.17 |
| Component library | shadcn/ui (Radix UI) | Latest |
| Animations | Framer Motion | 12.34.2 |
| Backend / DB | Supabase (PostgreSQL) | 2.97.0 |
| Authentication | Supabase Auth | — |
| File storage | Supabase Storage | — |
| Email notifications | EmailJS | 4.4.1 |
| Form handling | React Hook Form + Zod | 7.61.1 / 3.25.76 |
| Charts | Recharts | 2.15.4 |
| Toasts | Sonner | Latest |
| Dev server | localhost:8080 | — |

---

## Project Structure

```
pro-riders-hub/
├── public/                        Static assets served directly
├── scripts/                       Node.js utility scripts
│   ├── add-user-columns.mjs       Detect & print missing Supabase column SQL
│   ├── create-table.mjs           Table creation helper
│   ├── seed-bikes.mjs             Seed bike data to Supabase
│   └── parse-excel.mjs            Parse Excel stock data
├── src/
│   ├── main.tsx                   App entry point
│   ├── App.tsx                    Router setup, provider tree
│   ├── index.css                  Global styles, CSS variables
│   ├── assets/                    Images, logos, video
│   ├── components/                All React components
│   │   ├── ui/                    shadcn/ui primitives (45+ components)
│   │   ├── home/                  Homepage section components
│   │   ├── services/              Service booking components
│   │   └── admin/                 Admin panel sub-components
│   ├── contexts/                  React Context providers
│   ├── data/                      Static product/brand data files
│   ├── hooks/                     Custom React hooks
│   ├── lib/                       External integrations & utilities
│   ├── pages/                     Route-level page components
│   └── test/                      Unit test setup
├── supabase_schema.sql            Full DB schema reference (not auto-applied)
├── .env                           Environment variables (not committed)
├── vite.config.ts                 Vite build configuration
├── tailwind.config.ts             Tailwind theme configuration
├── tsconfig.json                  TypeScript configuration
└── package.json                   Dependencies & scripts
```

---

## Routes & Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `pages/Index.tsx` | Homepage — hero, deals, brands, testimonials |
| `/shop` | `pages/Shop.tsx` | Bike catalog with filtering and sorting |
| `/shop/:category` | `pages/Shop.tsx` | Category-filtered shop view |
| `/product/:id` | `pages/ProductPage.tsx` | Static bike product detail (auth required) |
| `/db-product/:id` | `pages/DBProductPage.tsx` | Admin-created product detail |
| `/product/apparel/:id` | `pages/ApparelAccessoryPage.tsx` | Apparel product detail |
| `/product/accessory/:id` | `pages/ApparelAccessoryPage.tsx` | Accessory product detail |
| `/apparels` | `pages/CategoryListingPage.tsx` | Apparel listing with filters |
| `/accessories` | `pages/CategoryListingPage.tsx` | Accessory listing with filters |
| `/brand/:brandSlug` | `pages/BrandGallery.tsx` | Brand-specific product gallery |
| `/services` | `pages/Services.tsx` | Services landing page |
| `/servicing` | `pages/BikeServicing.tsx` | Bike servicing detail page |
| `/rental` | `pages/Rental.tsx` | Bike rental page |
| `/community` | `pages/Community.tsx` | Community events & rides |
| `/about` | `pages/About.tsx` | About the store |
| `/contact` | `pages/Contact.tsx` | Contact/enquiry form |
| `/brands` | `pages/Brands.tsx` | All brands listing |
| `/auth` | `pages/Auth.tsx` | Login / Sign Up (Supabase Auth) |
| `/dashboard` | `pages/UserDashboard.tsx` | User orders & enquiry history |
| `/admin` | `pages/AdminLogin.tsx` | Admin login (email/password from .env) |
| `/admin/dashboard` | `pages/AdminDashboard.tsx` | Full admin management panel |
| `*` | `pages/NotFound.tsx` | 404 page |

---

## Provider Tree (`App.tsx`)

```
QueryClientProvider          (TanStack React Query)
  └── AuthProvider           (Supabase auth session)
        └── CartProvider     (shopping cart state)
              └── TooltipProvider
                    └── BrowserRouter
                          └── Routes
                                ├── CartDrawer   (rendered at root level — always mounted)
                                └── <Route> ...  (all pages)
```

---

## State Management

### `contexts/AuthContext.tsx`
Manages Supabase authentication state.

| Export | Description |
|--------|-------------|
| `AuthProvider` | Wraps the app; calls `supabase.auth.getSession()` on mount and subscribes to `onAuthStateChange` |
| `useAuth()` | Returns `{ session, user, loading, signOut }` |

**Key behaviour:**
- On initial load: restores existing session from Supabase
- On `SIGNED_IN` event: calls `upsertProfile()` to create/update the user's row in the `profiles` table
- `signOut()` calls `supabase.auth.signOut()`

### `contexts/CartContext.tsx`
In-memory shopping cart (not persisted across page refreshes).

| Export | Description |
|--------|-------------|
| `CartProvider` | Holds cart state in `useState` |
| `useCart()` | Returns `{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, isOpen, setIsOpen }` |

**CartItem shape:**
```ts
{
  id: number          // hashId for DB products, static id for catalog bikes
  name: string
  brand: string
  image: string
  color: string
  size: string
  quantity: number
  price?: number      // stored at add-time for DB products (db_products.price)
  dbProductId?: string // Supabase UUID; present only for admin-created products
}
```

---

## Component Architecture

### Shared Layout Components

| Component | File | Role |
|-----------|------|------|
| `Header` | `components/Header.tsx` | Fixed top nav — logo, desktop nav with mega dropdowns (Bikes/Apparels/Accessories/Sale), search (CommandDialog), auth dropdown, cart icon |
| `AnnouncementBar` | `components/AnnouncementBar.tsx` | Scrolling ticker above header; fetches active sales from Supabase and builds ticker text |
| `Footer` | `components/Footer.tsx` | Site footer with links, contact, social |
| `PageShell` | `components/PageShell.tsx` | Layout wrapper used by all pages — applies header offset padding |
| `WhatsAppButton` | `components/WhatsAppButton.tsx` | Floating WhatsApp chat button |
| `CustomCursor` | `components/CustomCursor.tsx` | Custom cursor overlay |

### Cart & Checkout

| Component | File | Role |
|-----------|------|------|
| `CartDrawer` | `components/CartDrawer.tsx` | Side drawer (Sheet) showing cart items, quantity controls, Place Order button, Enquire About Cart button. Auth-gates both actions. |
| `CheckoutModal` | `components/CheckoutModal.tsx` | Full checkout form (name, phone, email, address, COD/UPI). Inserts order to Supabase with fallback for missing `user_id` column. Deducts stock from `db_products` on success. |

### Product Cards

| Component | File | Used For |
|-----------|------|---------|
| `BikeCard` | `components/BikeCard.tsx` | Static catalog bikes (from `data/bikes.ts`) |
| `ProductCard` | `components/ProductCard.tsx` | General products |
| `DbProductCard` | `components/DbProductCard.tsx` | Admin-created products from Supabase `db_products` table; navigates to `/db-product/:id` |

### Homepage Sections (`components/home/`)

| Component | Renders |
|-----------|---------|
| `HomeHero` | Video/image hero banner |
| `HotDealsGrid` | Promotional deal cards |
| `TrustBar` | Trust badges (warranty, delivery, etc.) |
| `ShopByCategory` | Category browsing tiles |
| `FeaturedBrands` | Brand logo carousel |
| `NewArrivalsGrid` | New product cards |
| `WhyChoose` | Value proposition section |
| `CustomerTestimonials` | Customer review quotes |

### Admin Sub-Components (`components/admin/`)

| Component | Manages |
|-----------|---------|
| `ProductsManagement` | Full CRUD for `db_products`; image upload to Supabase Storage |
| `SalesManagement` | Create/edit/delete sales promotions |
| `OrdersManagement` | View orders, update `order_status` |
| `QueriesManagement` | View product queries, send replies via EmailJS |
| `ReviewsManagement` | View reviews, send admin replies |

### Service Components (`components/services/`)

Specialised booking forms rendered within `/servicing`:
`ServiceRequestForm`, `BikeFittingForm`, `SuspensionTuningForm`, `CustomBuildForm`, `PickupDeliveryForm`, `BookingCalendar`, `TimeSlotSelector`, `ServiceStatusTracker`, `EstimateApproval`, `ServicePackages`, `ReminderSettings`

---

## Data Layer

### Static Data (`src/data/`)

| File | Contents |
|------|----------|
| `bikes.ts` | ~100+ hardcoded bike products with full specs. Defines the `Bike` interface and all filter option arrays (`bikeCategories`, `bikeTypes`, `priceRanges`, etc.) |
| `brands.ts` | Brand lists: `cycleBrandsDealing` (Trek, Scott, Merida, Lapierre) and 30+ additional brands. Brand-by-subcategory maps (helmets, jerseys, etc.) |
| `products.ts` | Static apparel/accessory product catalog |
| `accessories.ts` | Accessory products with categories and brands |
| `rentalBikes.ts` | Rental bike inventory |

### Supabase (`src/lib/supabase.ts`)

Single `supabase` client instance; all components import from here. Also exports TypeScript interfaces for all DB tables.

---

## Database Schema (Supabase / PostgreSQL)

### Tables

#### `enquiries`
Customer contact and cart enquiry submissions.
```
id             uuid PK (auto)
name           text
email          text
subject        text
message        text
created_at     timestamptz
status         text (default: 'pending')
```
RLS: Public insert allowed; admin reads all.

#### `db_products`
Admin-managed product catalog (bikes, apparels, accessories).
```
id             uuid PK (auto)
name           text
brand          text
category       text
type           'bike' | 'apparel' | 'accessory'
price          numeric
original_price numeric (nullable)
description    text (nullable)
images         text[]
specifications jsonb
stock_quantity integer
stock_status   'In Stock' | 'Limited Stock' | 'Out of Stock'
tag            text (nullable)
size           text (nullable)
color          text (nullable)
is_active      boolean (default: true)
created_at     timestamptz
```
RLS: Public reads active products; admin full access.

#### `sales`
Admin-created promotional sales.
```
id                  uuid PK (auto)
title               text
description         text (nullable)
discount_percentage integer (nullable)
banner_image        text (nullable, URL)
valid_from          timestamptz (nullable)
valid_until         timestamptz (nullable)
is_active           boolean
created_at          timestamptz
```
RLS: Public reads active sales; admin full access.

#### `orders`
Customer orders placed via checkout.
```
id               uuid PK (auto)
user_id          uuid (nullable, FK → auth.users)  ← requires migration
customer_name    text
customer_email   text (nullable)
customer_phone   text
delivery_address text
items            jsonb  (array of OrderItem)
total_amount     numeric
payment_method   'cod' | 'upi'
order_status     'to_be_delivered' | 'delivered'
created_at       timestamptz
```
RLS: Public insert allowed; admin reads all; user reads own orders by `user_id`.

#### `product_queries`
Customer questions about specific products.
```
id             uuid PK (auto)
product_id     text
product_name   text
customer_name  text
customer_email text
query_message  text
admin_reply    text (nullable)
replied_at     timestamptz (nullable)
status         'pending' | 'replied'
created_at     timestamptz
```
RLS: Public insert; admin full access.

#### `product_reviews`
Customer reviews and star ratings.
```
id             uuid PK (auto)
product_id     text
product_name   text
customer_name  text
customer_email text
rating         integer (1–5)
review_text    text
admin_reply    text (nullable)
replied_at     timestamptz (nullable)
created_at     timestamptz
```
RLS: Public insert and read; admin can update (for replies).

#### `profiles`
User profile linked to Supabase Auth. *(Requires manual migration — see below.)*
```
id          uuid PK (FK → auth.users ON DELETE CASCADE)
email       text (nullable)
full_name   text (nullable)
created_at  timestamptz
```
RLS: Users can only read/write their own row (`auth.uid() = id`).

### Storage
- **Bucket:** `product-images` (public)
- Used by `ProductsManagement` for uploading product images

---

## Authentication Flow

```
User visits /auth
  └── supabase.auth.signInWithPassword({ email, password })
        ├── Success → navigate(redirect || '/dashboard')
        └── Error   → toast.error(message)

AuthProvider (on mount)
  └── supabase.auth.getSession()         → restores existing session
  └── supabase.auth.onAuthStateChange()  → keeps session in sync
        └── SIGNED_IN event → upsertProfile(userId, email)
                               writes/updates profiles table row

Protected routes:
  - /product/:id (ProductPage)    → shows sign-in screen if !user
  - /dashboard   (UserDashboard)  → redirects to /auth if !user
  - Cart: Place Order button      → redirects to /auth?redirect=/shop if !user
  - Cart: Enquire About Cart      → redirects to /auth?redirect=/shop if !user
```

---

## Order Placement Flow

```
CartDrawer (Place Order clicked)
  └── Auth check → if !user → navigate('/auth?redirect=/shop')
  └── Opens CheckoutModal

CheckoutModal (form submitted)
  ├── Validates name, phone, address
  ├── Builds orderPayload { customer_*, items[], total_amount, payment_method, order_status }
  │   └── Includes user_id if user is logged in
  ├── supabase.from('orders').insert([orderPayload])
  │   └── On error 42703 (user_id column missing) → retry without user_id field
  └── On success:
        ├── Deducts stock from db_products for each dbProductId item
        ├── setSuccess(true) → shows success screen
        └── clearCart()
```

---

## Admin Flow

```
/admin → AdminLogin.tsx
  └── Credentials: VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD (env vars)
  └── Navigates to /admin/dashboard on success

/admin/dashboard → AdminDashboard.tsx
  ├── Products tab  → ProductsManagement  → db_products CRUD + image upload
  ├── Sales tab     → SalesManagement     → sales CRUD
  ├── Orders tab    → OrdersManagement    → view orders, update status
  └── Queries tab   → QueriesManagement   → read product_queries, send reply emails
```

---

## Email Notification System (`lib/emailjs.ts`)

Uses **EmailJS** (browser-side, no server required).

| Function | Trigger | Recipient |
|----------|---------|-----------|
| `sendAdminNotification()` | New enquiry submitted | Admin (VITE_ADMIN_EMAIL) |
| `sendCustomerAutoReply()` | Enquiry submitted | Customer |
| `sendReplyEmail()` | Admin replies to a query | Customer (HTML template with product name and reply) |

Configured via env vars:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_TEMPLATE_ID_CUSTOMER`

---

## Custom Hooks (`src/hooks/`)

| Hook | File | Purpose |
|------|------|---------|
| `useCountUp` | `useCountUp.tsx` | Animates a number incrementing to a target value |
| `useCardParallax` | `useCardParallax.ts` | Parallax tilt effect on product cards |
| `useMobile` | `use-mobile.tsx` | Returns true if viewport is mobile-width |
| `useParallax` | `use-parallax.tsx` | Scroll-based parallax offset calculation |
| `useToast` | `use-toast.ts` | shadcn/ui toast imperative API |

---

## Build & Scripts

### NPM Scripts (`package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server on port 8080 with HMR |
| `build` | `vite build` | Production build to `dist/` |
| `build:dev` | `vite build --mode development` | Dev-mode build |
| `lint` | `eslint .` | ESLint check |
| `preview` | `vite preview` | Preview production build locally |
| `test` | `vitest run` | Run unit tests once |
| `test:watch` | `vitest` | Run tests in watch mode |

### Utility Scripts (`scripts/`)

| Script | Run With | Purpose |
|--------|----------|---------|
| `add-user-columns.mjs` | `node scripts/add-user-columns.mjs` | Checks if `user_id` column exists on `orders` table; if not, prints the required SQL to run in Supabase SQL Editor |
| `seed-bikes.mjs` | `node scripts/seed-bikes.mjs` | Seeds bike data into Supabase `db_products` table |
| `create-table.mjs` | `node scripts/create-table.mjs` | Table creation helper |
| `parse-excel.mjs` | `node scripts/parse-excel.mjs` | Parses Excel stock list into usable format |

---

## Environment Variables (`.env`)

| Variable | Used In | Purpose |
|----------|---------|---------|
| `VITE_SUPABASE_URL` | `lib/supabase.ts` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `lib/supabase.ts` | Supabase anonymous/public key |
| `VITE_EMAILJS_SERVICE_ID` | `lib/emailjs.ts` | EmailJS service identifier |
| `VITE_EMAILJS_PUBLIC_KEY` | `lib/emailjs.ts` | EmailJS public key |
| `VITE_EMAILJS_TEMPLATE_ID_CUSTOMER` | `lib/emailjs.ts` | EmailJS template for customer emails |
| `VITE_ADMIN_EMAIL` | `pages/AdminLogin.tsx` | Admin login credential |
| `VITE_ADMIN_PASSWORD` | `pages/AdminLogin.tsx` | Admin login credential |

---

## Pending Database Migrations

The following SQL must be manually run in the **Supabase SQL Editor** to fully enable user-order linking and profile creation:

```sql
-- Link orders to auth users
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id uuid
  REFERENCES auth.users ON DELETE SET NULL;

-- User profile table
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email       text,
  full_name   text,
  created_at  timestamp with time zone DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

Until this runs: orders are stored without `user_id` (checkout still works via fallback), "My Orders" in UserDashboard shows empty, and profile auto-creation silently no-ops.

---

## Key Design Decisions

- **Static catalog + dynamic DB products**: Bikes are hardcoded in `data/bikes.ts` for fast, zero-latency browsing. Admin-created products live in Supabase `db_products` and are fetched at runtime.
- **Cart is in-memory**: `CartContext` uses React state only — cart is lost on page refresh. This avoids the complexity of cart persistence without compromising the checkout flow.
- **Resilient order insertion**: `CheckoutModal` tries to insert with `user_id`; if Supabase returns a column-not-found error (migration pending), it retries without it so checkout never breaks.
- **Admin auth is env-var based**: No Supabase auth for admin — credentials are compared directly in `AdminLogin.tsx` against `VITE_ADMIN_*` env vars.
- **EmailJS for emails**: All email sending happens in the browser with no backend needed, using EmailJS templates.
- **Path alias `@`**: All imports use `@/` which maps to `src/` — configured in both `vite.config.ts` and `tsconfig.json`.
