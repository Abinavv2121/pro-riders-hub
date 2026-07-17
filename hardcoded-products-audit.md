# Pro Riders Hub — Hardcoded Products Audit

**Products defined in frontend source code only — not yet in Supabase `db_products`**

- **Date:** 7 July 2026
- **Sources:** `src/data/bikes.ts` · `src/data/rentalBikes.ts` · `src/data/products.ts` · `src/data/accessories.ts` · `src/data/brands.ts`
- **DB products already seeded:** 149 (accessories + 1 bike)

---

## Summary

| # | Category | Source | Brands | Est. Products |
|---|---|---|---|---|
| 1 | Fully-specified bikes | `bikes.ts → existingBikes` | 8 | 16 |
| 2 | JSON stock bikes — Road | `bikes.ts → jsonStock` | 18 | 50 |
| 3 | JSON stock bikes — Hybrid & MTB | `bikes.ts → jsonStock` | 3 | 16 |
| 4 | Pre-owned bikes | `bikes.ts → excelPreOwned` | 18 | 19 |
| 5 | Rental bikes | `rentalBikes.ts` | 4 | 9 |
| 6 | Cycling Jerseys | `products.ts` | 5 | 10–15 |
| 7 | Cycling Shorts | `products.ts` | 4 | 8–12 |
| 8 | Cycling Bib Shorts | `products.ts` | 13 | 26–39 |
| 9 | Gloves | `products.ts` | 4 | 8–12 |
| 10 | Arm Covers | `products.ts` | 3 | 6–9 |
| 11 | Leg Covers | `products.ts` | 3 | 6–9 |
| 12 | Cycling Shoes | `products.ts` | 5 | 10–15 |
| 13 | Cycling Shoe Covers | `products.ts` | 3 | 6–9 |
| 14 | Helmets (accessory) | `products.ts` | 14 | 28–42 |
| 15 | Lights | `products.ts` | 8 | 16–24 |
| 16 | Hydration / Bottle Cage | `products.ts` | 6 | 12–18 |
| 17 | Bags | `products.ts` | 4 | 8–12 |
| 18 | Car Racks | `products.ts` | 3 | 6–9 |
| 19 | Record Your Training | `products.ts` | 4 | 8–12 |
| 20 | Indoor Training | `products.ts` | 5 | 10–15 |
| — | **TOTAL** | | **~140 brands** | **~270–370 products** |

> **Note on apparel & accessory products (Sections 6–20):** `src/data/products.ts` auto-generates these at runtime — 2–3 products per brand per category. Prices are `Math.random()` each page load. Images are blank (`""`). All products have generic names like `"Castelli Pro Cycling Jerseys V1"`. They are **placeholder data** — not real products with real prices or images.

---

## Section 1 — Fully-Specified New Bikes (16)

> **Source:** `src/data/bikes.ts → existingBikes[]`
> Complete data: images, features, specs, components

### Race Road

| # | Brand | Model | Frame | Groupset | Size | Color | Status | Tag | MRP (₹) | Orig (₹) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Argon 18 | Nitrogen | Carbon | Shimano Ultegra | L | Silver Blue | In Stock | New Arrival | 1,90,000 | — |
| 2 | Lapierre | Aircode DRS 5.0 | Carbon | Shimano 105 | M / L | Gold / Black | Limited Stock | Sale | 2,15,000 | 2,45,000 |
| 3 | Scott | Plasma 10 | Carbon | Shimano Ultegra | M | Yellow / Black | In Stock | Triathlon | 2,20,000 | — |
| 4 | Scott | Addict RC | Carbon | Shimano Dura-Ace | M / L | Black / Red | Preorder | Preorder | 2,45,000 | 2,85,000 |

### Endurance Road

| # | Brand | Model | Frame | Groupset | Size | Color | Status | Tag | MRP (₹) | Orig (₹) |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | Trek | Domane AL 5 | Aluminum | Shimano 105 | M / L | Crimson Red | In Stock | Sale | 1,15,000 | 1,35,000 |
| 6 | Lapierre | Xelius SL 5.0 | Carbon | Shimano Ultegra | M / L | Blue / White | In Stock | — | 1,95,000 | — |
| 7 | Argon 18 | Gallium Pro | Carbon | Shimano Dura-Ace | M / L | Matte Black | Limited | Premium | 2,10,000 | — |

### Gravel & Adventure

| # | Brand | Model | Frame | Groupset | Size | Color | Status | Tag | MRP (₹) | Orig (₹) |
|---|---|---|---|---|---|---|---|---|---|---|
| 8 | Scott | Speedster CX 20 Disc | Carbon | Shimano 105 | M / L | Dark Grey | In Stock | Adventure | 1,65,000 | — |
| 9 | Marin | Nicasio 2 | Steel | Shimano Deore | M / L | Satin Black | In Stock | Gravel | 85,000 | 95,000 |

### MTB (XC & Trail)

| # | Brand | Model | Frame | Groupset | Size | Color | Status | Tag | MRP (₹) | Orig (₹) |
|---|---|---|---|---|---|---|---|---|---|---|
| 10 | Trek | Marlin 5 Gen 3 | Aluminum | Shimano Deore | M / L / XL | Matte Dark | In Stock | Popular | 65,000 | 75,000 |
| 11 | Scott | Spark 960 | Carbon | Shimano XT | M / L | Stellar Blue | In Stock | Trail | 1,85,000 | — |
| 12 | Scott | Scale 970 | Carbon | Shimano XT | M / L | Prism Green | Limited | XC | 1,55,000 | — |
| 13 | Marin | Rift Zone 29 | Aluminum | Shimano XT | M / L | Gloss Black | In Stock | Trail | 1,75,000 | — |

### City & Fitness

| # | Brand | Model | Frame | Groupset | Size | Color | Status | Tag | MRP (₹) | Orig (₹) |
|---|---|---|---|---|---|---|---|---|---|---|
| 14 | Avanti | Giro F1W | Aluminum | Shimano Deore | M | Metallic Blue | In Stock | Sale | 36,000 | 42,000 |
| 15 | Avanti | Giro FM 1W | Aluminum | Shimano 105 | M | White | In Stock | — | 39,000 | — |
| 16 | Trek | FX 3 Disc | Aluminum | Shimano Deore | M / L | Lithium Grey | In Stock | Fitness | 68,000 | — |

---

## Section 2 — JSON Stock Bikes — Road (50 variants)

> **Source:** `src/data/bikes.ts → jsonStock[]` (category: "road")
> Prices computed at runtime from groupset/frame tier

### Trek

| Brand | Model | Size | Color | Groupset | Frame | Condition | Price (₹) | Orig (₹) |
|---|---|---|---|---|---|---|---|---|
| Trek | Speed Concept | M | Black | Shimano Ultegra Di2 | Carbon | New | 3,00,000 | — |
| Trek | Madone SL6 Gen8 | M/L | Crimson | Shimano 105 Di2 | Carbon | New | 2,20,000 | — |
| Trek | Madone SL7 Gen8 | M/L | Purple | Shimano Ultegra Di2 | Carbon | New | 3,00,000 | — |
| Trek | Madone SL5 Gen8 | L | Black | Shimano 105 | Carbon | New | 1,85,000 | — |
| Trek | Emonda ALR 5 | L | Red | Shimano 105 | Aluminum | New | 1,45,000 | — |
| Trek | Emonda ALR 5 | S | Black / Grey | Shimano 105 | Aluminum | New | 1,45,000 | — |
| Trek | Domane AL5 Gen4 | L | Black | Shimano 105 | Aluminum | New | 1,45,000 | — |
| Trek | Domane AL5 Gen4 | XXXS | Black | Shimano 105 | Aluminum | New | 1,45,000 | — |
| Trek | Emonda SL5 | XS | White | Shimano 105 (11-sp) | Carbon | New | 1,60,000 | — |
| Trek | Domane AL4 Gen4 | M | Blue | Shimano Tiagra | Aluminum | New | 95,000 | — |

### Scott

| Brand | Model | Size | Color | Groupset | Frame | Condition | Price (₹) | Orig (₹) |
|---|---|---|---|---|---|---|---|---|
| Scott | Addict 20 | L | Green | Shimano 105 | Carbon | New | 1,85,000 | 2,12,750 |
| Scott | Addict 20 | S | Green | Shimano 105 | Carbon | New | 1,85,000 | 2,12,750 |
| Scott | Addict 50 | M | Grey | Shimano 105 | Carbon | New Arrival | 1,85,000 | — |
| Scott | Speedster Gravel 50 | S | Olive Green | Shimano Claris | Carbon | New | 85,000 | — |
| Scott | Speedster 40 Rim | L | Black / Green | Shimano Sora | Carbon | New | 1,00,000 | — |
| Scott | Speedster 10 | XXS | Black | Shimano 105 | Carbon | New | 1,85,000 | — |
| Scott | Speedster 10 | S | Green | Shimano 105 | Carbon | New | 1,85,000 | — |
| Scott | Foil RC 20 | M | Light Blue / Black | Shimano Ultegra Di2 | Carbon | New | 3,00,000 | — |

### Cannondale

| Brand | Model | Size | Color | Groupset | Frame | Condition | Price (₹) | Orig (₹) |
|---|---|---|---|---|---|---|---|---|
| Cannondale | SuperSix Evo | 48 | Black | Shimano 105 | Carbon | New | 1,85,000 | — |
| Cannondale | SuperSix Evo | 54 | Black | Shimano 105 | Carbon | New | 1,85,000 | — |
| Cannondale | SuperSix Evo | 51 | Black | Shimano 105 | Carbon | New | 1,85,000 | — |
| Cannondale | Synapse Carbon | 51 | Red | Shimano 105 Di2 | Carbon | New | 2,20,000 | — |
| Cannondale | Synapse Hi-Mod | 54 | Black | Shimano Ultegra | Carbon | New | 2,50,000 | — |
| Cannondale | Synapse AL | 54 | Yellow | Shimano Claris | Aluminum | New | 60,000 | — |
| Cannondale | Synapse AL | 54 | Grey | Shimano Sora | Aluminum | New | 75,000 | — |
| Cannondale | Synapse AL | 51 | Black | Shimano 105 | Aluminum | New | 1,45,000 | — |
| Cannondale | Synapse AL | 51 | White | Shimano 105 | Aluminum | New | 1,45,000 | — |
| Cannondale | Optimo | 51 | Blue | Shimano Claris | Aluminum | New | 60,000 | — |
| Cannondale | Optimo | 54 | Blue | Shimano Claris | Aluminum | New | 60,000 | — |

### Merida

| Brand | Model | Size | Color | Groupset | Frame | Condition | Price (₹) |
|---|---|---|---|---|---|---|---|
| Merida | Reacto 4000 | XS | Dark Blue | Shimano 105 | Carbon | New | 1,85,000 |
| Merida | Reacto 4000 | XXS | Dark Blue | Shimano 105 | Carbon | New | 1,85,000 |
| Merida | Reacto 4000 | S | Dark Blue | Shimano 105 | Carbon | New | 1,85,000 |
| Merida | Scultura Endurance 4000 | XS | Grey | Shimano 105 | Carbon | New | 1,85,000 |
| Merida | Scultura 4000 | S | Silver | Shimano 105 | Carbon | New | 1,85,000 |

### Others — Road

| Brand | Model | Size | Color | Groupset | Frame | Condition | Price (₹) | Orig (₹) |
|---|---|---|---|---|---|---|---|---|
| Colnago | V4RS | M | Black | Shimano Ultegra Di2 | Carbon | New | 3,00,000 | — |
| Guerciotti | Eureka Air | L | Black | Shimano 105 (11-sp) | Carbon | New | 1,60,000 | — |
| Wilier | GTR Rim | M | Red | Shimano 105 (11-sp) | Carbon | New | 1,60,000 | — |
| Lapierre | Xelius SL7 | L | Blue | Shimano Ultegra Di2 | Carbon | New | 3,00,000 | — |
| Lapierre | Aircode DRS | XL | Gold | Shimano 105 (11-sp) | Carbon | New | 1,60,000 | — |
| Lapierre | Aircode DRS | M | Blue | Shimano 105 (11-sp) | Carbon | Pre-Owned | 96,000 | 1,60,000 |
| Argon 18 | Nitrogen | L | Blue / Grey | Shimano 105 | Carbon | New | 1,85,000 | — |
| Bergamont | Grandurance Elite | L | Black | Shimano 105 | Aluminum | New | 1,45,000 | — |
| Bergamont | Grandurance RB3 | L | Silver | Shimano Claris | Aluminum | New | 60,000 | — |
| Cipollini | Bond | XS | Blue | Shimano 105 | Carbon | New | 1,85,000 | — |
| Pinarello | Granger Gravel | S | Olive Green | Shimano GRX | Carbon | Pre-Owned | 1,08,000 | 1,80,000 |
| Polygon | Stratos S5D | M | White | Shimano 105 | Aluminum | New | 1,45,000 | — |
| Polygon | Stratos S2 | S | Light Blue | Shimano Claris | Aluminum | New | 60,000 | — |
| Polygon | Stratos S2 | M | Light Blue | Shimano Claris | Aluminum | New | 60,000 | — |
| Polygon | Stratos S2 | L | Light Blue | Shimano Claris | Aluminum | New | 60,000 | — |
| Polygon | Stratos 3 | S | Dark Brown | Shimano Sora | Aluminum | New | 75,000 | — |
| Polygon | Stratos 4 | M | Orangish Brown | Shimano Tourney | Aluminum | New | 45,000 | — |
| Bottachia | Duello | L | Red | Campagnolo | Carbon | New | 1,80,000 | — |
| Java | Fuoco Disc | S | Ash | Shimano 105 (11-sp) | Carbon | Pre-Owned | 96,000 | 1,60,000 |
| Trek | Domane AL5 Gen4 (Used) | S | Green | Shimano 105 (11-sp) | Aluminum | Pre-Owned | 75,000 | 1,25,000 |

---

## Section 3 — JSON Stock Bikes — Hybrid & MTB (16 variants)

> **Source:** `src/data/bikes.ts → jsonStock[]` (category: "hybrid" | "mtb")

### Hybrid

| Brand | Model | Size | Color | Groupset | Frame | Price (₹) |
|---|---|---|---|---|---|---|
| Trek | FX3 | S | Grey | Shimano Deore | Aluminum | 70,000 |
| Trek | FX3 | M | Red | Shimano Deore | Aluminum | 70,000 |
| Trek | FX3 | L | Maroon | Shimano Deore | Aluminum | 70,000 |
| Trek | FX3 | XL | Grey | Shimano Deore | Aluminum | 70,000 |
| Trek | FX2 | L | Blue | Shimano Altus | Aluminum | 55,000 |
| Trek | Dual Sport | M | Black | Shimano Altus | Aluminum | 55,000 |
| Scott | Sub Cross 50 | M | Olive Green | Shimano Tourney | Aluminum | 45,000 |

### MTB

| Brand | Model | Size | Color | Groupset | Frame | Price (₹) |
|---|---|---|---|---|---|---|
| Trek | Marlin 5 | M | Blue | Shimano Cues | Aluminum | 60,000 |
| Trek | Marlin 4 | M | Purple | Shimano Essa | Aluminum | 48,000 |
| Trek | Marlin 4 | L | Black | Shimano Essa | Aluminum | 48,000 |
| Scott | Aspect 960 | L | Orange | Shimano Tourney | Aluminum | 45,000 |
| Polygon | Cascade 2 | M | Blue | Shimano Tourney | Aluminum | 45,000 |

---

## Section 4 — Pre-Owned Bikes (19 variants)

> **Source:** `src/data/bikes.ts → excelPreOwned[]`
> All condition: used — price = 60% of new-equivalent

### Hybrid

| Brand | Model | Size | Color | Groupset | Used Price (₹) | New Equiv (₹) |
|---|---|---|---|---|---|---|
| Bergamont | Helix 1.5i | M | Blue | Shimano Tourney | 27,000 | 45,000 |
| Firefox | Meteor | M | Blue | Shimano Tourney | 27,000 | 45,000 |
| Giant | Escape | XL | Blue | Shimano Altus | 33,000 | 55,000 |
| Veloce | Junior | 24" | Red | Shimano Tourney | 27,000 | 45,000 |
| Shnell | 1000 | L | Grey | Shimano Tourney | 27,000 | 45,000 |
| Fantom | SS | M | Red / Black | Shimano Tourney | 27,000 | 45,000 |
| Keysto | Hybrid | M | Black | Shimano Tourney | 27,000 | 45,000 |
| Polygon | Kids 20 | 20" | Black / Blue | Shimano Tourney | 27,000 | 45,000 |
| Schwinn | Hybrid | M | Blue | Shimano Tourney | 27,000 | 45,000 |

### Road

| Brand | Model | Size | Color | Groupset | Used Price (₹) | New Equiv (₹) |
|---|---|---|---|---|---|---|
| Marin | Nicasio | S | Black | Shimano Claris | 51,000 | 85,000 |
| Urban | Track | M | White | Shimano Tourney | 27,000 | 45,000 |
| Trek | Domane AL5 Claris | XXS | Black | Shimano Claris | 36,000 | 60,000 |
| Trek | Domane AL5 | XL | Green | Shimano 105 | 87,000 | 1,45,000 |
| Titanium | Road Bike | M | Silver | Shimano 105 | 1,11,000 | 1,85,000 |
| Lapierre | Road | M | Black | Shimano 105 | 1,11,000 | 1,85,000 |

### MTB

| Brand | Model | Size | Color | Groupset | Used Price (₹) | New Equiv (₹) |
|---|---|---|---|---|---|---|
| Marin | MTB | M | Blue | Shimano Deore | 72,000 | 1,20,000 |
| GT | Avalanche Sport | M | Black | Shimano Deore | 72,000 | 1,20,000 |
| Scott | Scale 940 | S | Red | SRAM Eagle NX | 1,11,000 | 1,85,000 |
| Surly | Moonlander Fat Bike | L | Light Brown | Shimano XT | 1,14,000 | 1,90,000 |

---

## Section 5 — Rental Bikes (9)

> **Source:** `src/data/rentalBikes.ts → rentalBikes[]`
> Rental only — not listed for sale in the shop

| # | Brand | Model | Category | Features | Per Day (₹) | Available |
|---|---|---|---|---|---|---|
| 1 | Argon 18 | Nitrogen | Road | Carbon frame, Ultegra groupset, disc brakes | 2,500 | 5 |
| 2 | Scott | Plasma 10 | Road | Triathlon geometry, aero cockpit, time-trial spec | 3,000 | 3 |
| 3 | Lapierre | Aircode DRS | Road | Aero carbon frame, hydraulic disc, 22-speed | 2,800 | 4 |
| 4 | Avanti | Giro F1W | Hybrid | Lightweight aluminum, city geometry, rim brakes | 800 | 8 |
| 5 | Avanti | Giro FM 1W | Hybrid | Step-through frame, comfortable saddle, upright fit | 700 | 6 |
| 6 | Trek | FX 3 Disc | Hybrid | Carbon fork, hydraulic disc, fitness-ready spec | 900 | 5 |
| 7 | Trek | Marlin 5 Gen 3 | MTB | 29" wheels, hydraulic disc, 100mm travel fork | 1,200 | 10 |
| 8 | Scott | Spark 960 | MTB | Carbon full-suspension, XT groupset, 29" trail | 2,000 | 4 |
| 9 | Scott | Scale 970 | MTB | Carbon hardtail, XT drivetrain, XC geometry | 1,800 | 3 |

---

## Section 6 — Apparel Products (~80–120 products)

> **Source:** `src/data/products.ts` · `src/data/accessories.ts` · `src/data/brands.ts`
> IDs: 2000–2999 · 2–3 products generated per brand per category at runtime
> **WARNING: Prices are `Math.random()` on every page load. Images are blank (`""`). Names are generic (e.g. "Castelli Pro Cycling Jerseys V1").**

### Cycling Jerseys — `category: "jerseys"` · Price range: ₹1,500–5,000

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Castelli | 2–3 | Castelli Pro Cycling Jerseys V1, V2, V3 |
| Gambit | 2–3 | Gambit Pro Cycling Jerseys V1, V2, V3 |
| Probikers-Prong Horn | 2–3 | Probikers-Prong Horn Pro Cycling Jerseys V1, V2, V3 |
| Polygon | 2–3 | Polygon Pro Cycling Jerseys V1, V2, V3 |
| Probikers-Psychallov | 2–3 | Probikers-Psychallov Pro Cycling Jerseys V1, V2, V3 |
| **Total** | **10–15** | |

### Cycling Shorts — `category: "shorts"` · Price range: ₹2,000–6,000

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Castelli | 2–3 | Castelli Pro Cycling Shorts V1, V2, V3 |
| Shimano | 2–3 | Shimano Pro Cycling Shorts V1, V2, V3 |
| Apace | 2–3 | Apace Pro Cycling Shorts V1, V2, V3 |
| Scott | 2–3 | Scott Pro Cycling Shorts V1, V2, V3 |
| **Total** | **8–12** | |

### Cycling Bib Shorts — `category: "bib-shorts"` · Price range: ₹3,000–8,000

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Castelli | 2–3 | Castelli Pro Cycling Bib Shorts V1, V2, V3 |
| Gambit | 2–3 | Gambit Pro Cycling Bib Shorts V1, V2, V3 |
| Shimano | 2–3 | Shimano Pro Cycling Bib Shorts V1, V2, V3 |
| Sportful | 2–3 | Sportful Pro Cycling Bib Shorts V1, V2, V3 |
| Scott | 2–3 | Scott Pro Cycling Bib Shorts V1, V2, V3 |
| Gist | 2–3 | Gist Pro Cycling Bib Shorts V1, V2, V3 |
| Assos | 2–3 | Assos Pro Cycling Bib Shorts V1, V2, V3 |
| Prong Horn | 2–3 | Prong Horn Pro Cycling Bib Shorts V1, V2, V3 |
| 2XU | 2–3 | 2XU Pro Cycling Bib Shorts V1, V2, V3 |
| Apace | 2–3 | Apace Pro Cycling Bib Shorts V1, V2, V3 |
| Tenn | 2–3 | Tenn Pro Cycling Bib Shorts V1, V2, V3 |
| RBX | 2–3 | RBX Pro Cycling Bib Shorts V1, V2, V3 |
| Bianchi | 2–3 | Bianchi Pro Cycling Bib Shorts V1, V2, V3 |
| **Total** | **26–39** | |

### Gloves — `category: "gloves"` · Price range: ₹800–2,500

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Castelli | 2–3 | Castelli Pro Gloves V1, V2, V3 |
| Zakpro | 2–3 | Zakpro Pro Gloves V1, V2, V3 |
| Prong Horn | 2–3 | Prong Horn Pro Gloves V1, V2, V3 |
| Giro | 2–3 | Giro Pro Gloves V1, V2, V3 |
| **Total** | **8–12** | |

### Arm Covers — `category: "arm-covers"` · Price range: ₹500–1,500

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Castelli | 2–3 | Castelli Pro Arm Covers V1, V2, V3 |
| Apace | 2–3 | Apace Pro Arm Covers V1, V2, V3 |
| Prong Horn | 2–3 | Prong Horn Pro Arm Covers V1, V2, V3 |
| **Total** | **6–9** | |

### Leg Covers — `category: "leg-covers"` · Price range: ₹800–2,000

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Castelli | 2–3 | Castelli Pro Leg Covers V1, V2, V3 |
| Apace | 2–3 | Apace Pro Leg Covers V1, V2, V3 |
| Prong Horn | 2–3 | Prong Horn Pro Leg Covers V1, V2, V3 |
| **Total** | **6–9** | |

### Cycling Shoes — `category: "shoes"` · Price range: ₹5,000–25,000

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Shimano | 2–3 | Shimano Pro Cycling Shoes V1, V2, V3 |
| Sidi | 2–3 | Sidi Pro Cycling Shoes V1, V2, V3 |
| Giro | 2–3 | Giro Pro Cycling Shoes V1, V2, V3 |
| Specialized | 2–3 | Specialized Pro Cycling Shoes V1, V2, V3 |
| Scott | 2–3 | Scott Pro Cycling Shoes V1, V2, V3 |
| **Total** | **10–15** | |

### Cycling Shoe Covers — `category: "shoe-covers"` · Price range: ₹1,000–3,000

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Castelli | 2–3 | Castelli Pro Cycling Shoe Covers V1, V2, V3 |
| Shimano | 2–3 | Shimano Pro Cycling Shoe Covers V1, V2, V3 |
| Giro | 2–3 | Giro Pro Cycling Shoe Covers V1, V2, V3 |
| **Total** | **6–9** | |

---

## Section 7 — Accessory Products (~90–135 products)

> **Source:** `src/data/products.ts` · `src/data/accessories.ts` · `src/data/brands.ts`
> IDs: 3000–3999 · 2–3 products generated per brand per category at runtime
> **WARNING: Same as above — random prices, blank images, generic names.**

### Helmets — `category: "helmets"` · Price range: ₹2,000–15,000 · Subcategories: Aero, Road, MTB, Commute, Kids

| Brand | Est. Products | Name Pattern |
|---|---|---|
| HJC | 2–3 | HJC Elite [Subcategory] Helmets 1, 2, 3 |
| GIRO | 2–3 | GIRO Elite [Subcategory] Helmets 1, 2, 3 |
| Bell | 2–3 | Bell Elite [Subcategory] Helmets 1, 2, 3 |
| Trek | 2–3 | Trek Elite [Subcategory] Helmets 1, 2, 3 |
| Gist | 2–3 | Gist Elite [Subcategory] Helmets 1, 2, 3 |
| Kask | 2–3 | Kask Elite [Subcategory] Helmets 1, 2, 3 |
| Bontrager | 2–3 | Bontrager Elite [Subcategory] Helmets 1, 2, 3 |
| Lazer | 2–3 | Lazer Elite [Subcategory] Helmets 1, 2, 3 |
| Met | 2–3 | Met Elite [Subcategory] Helmets 1, 2, 3 |
| Scott | 2–3 | Scott Elite [Subcategory] Helmets 1, 2, 3 |
| Abus | 2–3 | Abus Elite [Subcategory] Helmets 1, 2, 3 |
| POC | 2–3 | POC Elite [Subcategory] Helmets 1, 2, 3 |
| Raleigh | 2–3 | Raleigh Elite [Subcategory] Helmets 1, 2, 3 |
| Zakpro | 2–3 | Zakpro Elite [Subcategory] Helmets 1, 2, 3 |
| **Total** | **28–42** | |

> Note: 70 real helmet products were already seeded to Supabase via `scripts/seed-helmets.mjs` — those are NOT hardcoded.

### Lights — `category: "lights"` · Price range: ₹1,000–5,000 · Subcategories: Front, Rear, Combo, Mounts

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Cat-eye | 2–3 | Cat-eye Elite [Subcategory] Lights 1, 2, 3 |
| Blackburn | 2–3 | Blackburn Elite [Subcategory] Lights 1, 2, 3 |
| Magicsign | 2–3 | Magicsign Elite [Subcategory] Lights 1, 2, 3 |
| Ravemen | 2–3 | Ravemen Elite [Subcategory] Lights 1, 2, 3 |
| NR | 2–3 | NR Elite [Subcategory] Lights 1, 2, 3 |
| Knog | 2–3 | Knog Elite [Subcategory] Lights 1, 2, 3 |
| Syncross | 2–3 | Syncross Elite [Subcategory] Lights 1, 2, 3 |
| 91 | 2–3 | 91 Elite [Subcategory] Lights 1, 2, 3 |
| **Total** | **16–24** | |

### Hydration & Bottle Cage — `category: "hydration"` · Price range: ₹500–2,000 · Subcategories: Bottles, Bottle Cage

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Trek | 2–3 | Trek Elite [Subcategory] Bottle Cage 1, 2, 3 |
| Zipp | 2–3 | Zipp Elite [Subcategory] Bottle Cage 1, 2, 3 |
| TopPeak | 2–3 | TopPeak Elite [Subcategory] Bottle Cage 1, 2, 3 |
| Zefal | 2–3 | Zefal Elite [Subcategory] Bottle Cage 1, 2, 3 |
| Probike | 2–3 | Probike Elite [Subcategory] Bottle Cage 1, 2, 3 |
| Krutials | 2–3 | Krutials Elite [Subcategory] Bottle Cage 1, 2, 3 |
| **Total** | **12–18** | |

> Note: 38 real bar tape / grips / skewer products were already seeded via `scripts/seed-bartape-grips.mjs` — those are NOT hardcoded.

### Bags — `category: "bags"` · Price range: ₹1,500–8,000

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Trek | 2–3 | Trek Elite Bags 1, 2, 3 |
| Bontrager | 2–3 | Bontrager Elite Bags 1, 2, 3 |
| Topeak | 2–3 | Topeak Elite Bags 1, 2, 3 |
| Ortlieb | 2–3 | Ortlieb Elite Bags 1, 2, 3 |
| **Total** | **8–12** | |

### Car Racks — `category: "car-racks"` · Price range: ₹5,000–20,000

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Thule | 2–3 | Thule Elite Car Racks 1, 2, 3 |
| Saris | 2–3 | Saris Elite Car Racks 1, 2, 3 |
| Yakima | 2–3 | Yakima Elite Car Racks 1, 2, 3 |
| **Total** | **6–9** | |

### Record Your Training — `category: "training-tech"` · Price range: ₹10,000–50,000 · Subcategories: Computers, Sensors, Mounts, HRM, Power Meters, Smartwatches, Earphones

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Garmin | 2–3 | Garmin Elite [Subcategory] Record 1, 2, 3 |
| Wahoo | 2–3 | Wahoo Elite [Subcategory] Record 1, 2, 3 |
| Bryton | 2–3 | Bryton Elite [Subcategory] Record 1, 2, 3 |
| Magene | 2–3 | Magene Elite [Subcategory] Record 1, 2, 3 |
| **Total** | **8–12** | |

### Indoor Training — `category: "indoor-training"` · Price range: ₹15,000–80,000 · Subcategories: Trainers & Rollers, Floor Mats, Trainer Accessories

| Brand | Est. Products | Name Pattern |
|---|---|---|
| Wahoo | 2–3 | Wahoo Elite [Subcategory] Indoor 1, 2, 3 |
| Tacx | 2–3 | Tacx Elite [Subcategory] Indoor 1, 2, 3 |
| Elite | 2–3 | Elite Elite [Subcategory] Indoor 1, 2, 3 |
| Minoura | 2–3 | Minoura Elite [Subcategory] Indoor 1, 2, 3 |
| Magene | 2–3 | Magene Elite [Subcategory] Indoor 1, 2, 3 |
| **Total** | **10–15** | |

---

## Action Required

The table below shows what action is needed for each data source:

| Source File | Status | Action |
|---|---|---|
| `src/data/bikes.ts → existingBikes` | Hardcoded — not in DB | Seed to `db_products` (type: bike) |
| `src/data/bikes.ts → jsonStock` | Hardcoded — not in DB | Seed to `db_products` (type: bike) |
| `src/data/bikes.ts → excelPreOwned` | Hardcoded — not in DB | Seed to `db_products` (type: bike, condition: used) |
| `src/data/rentalBikes.ts` | Hardcoded — rental only | Keep separate or create a `db_rentals` table |
| `src/data/products.ts` — apparels | Auto-generated placeholders | Replace with real products; remove generator |
| `src/data/products.ts` — accessories | Auto-generated placeholders | Replace with real products; remove generator |
| `scripts/seed-helmets.mjs` | Already seeded ✓ | 70 helmet products in DB |
| `scripts/seed-bartape-grips.mjs` | Already seeded ✓ | 38 bar tape / grips / accessories in DB |

---

*Pro Riders Hub — Hardcoded Products Audit · 7 July 2026*
