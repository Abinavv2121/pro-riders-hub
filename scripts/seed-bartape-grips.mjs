/**
 * Seed script: uploads Bar Tape, Grips, Skewers & Fenders to Supabase db_products.
 * Source: Accessories stock list — BAR_TAPE.pdf
 *
 * Usage:  node scripts/seed-bartape-grips.mjs
 *
 * NOTE: If inserts fail with 401/403, temporarily disable RLS in Supabase SQL Editor:
 *   ALTER TABLE db_products DISABLE ROW LEVEL SECURITY;
 *   -- run script --
 *   ALTER TABLE db_products ENABLE ROW LEVEL SECURITY;
 */

const SUPABASE_URL = 'https://yeejxvxyabrmnpdnziek.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZWp4dnh5YWJybW5wZG56aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDcwNjcsImV4cCI6MjA5Nzc4MzA2N30.3GdoadfMVfDVpa3YQkYRd6zAxbdBoY1BnEk-ejFQOeM';

function stockStatus(qty) {
  if (!qty || qty === 0) return 'Out of Stock';
  if (qty <= 3) return 'Limited Stock';
  return 'In Stock';
}

const products = [

  // ═══════════════════════════════════════════════════════════════════════════
  // BAR TAPE — CICLOVATITON
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Silicon Touch Bar Tape (Black)',
    brand: 'Ciclovatiton',
    category: 'bar-tape',
    type: 'accessory',
    price: 3399,
    original_price: null,
    description:
      'The Ciclovatiton Silicon Touch bar tape delivers a premium silicone grip feel that stays comfortable over long rides. Its smooth surface resists moisture and road grime, while the extra-thin profile allows you to feel the bars clearly. Pairs perfectly with both road and endurance bikes seeking a clean, modern aesthetic.',
    images: [],
    specifications: {
      'Material': 'Silicone with polyurethane backing',
      'Width': '30 mm',
      'Thickness': '3.5 mm',
      'Length': '2000 mm',
      'Finish': 'Smooth surface',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Premium silicone grip feel | Moisture and dirt resistant | Thin profile for direct bar feel | Includes end plugs | Easy to apply | Black',
    },
    stock_quantity: 8,
    stock_status: stockStatus(8),
    color: 'Black',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Poly Touch Vapour Metallic Bar Tape (Gem Black)',
    brand: 'Ciclovatiton',
    category: 'bar-tape',
    type: 'accessory',
    price: 2799,
    original_price: null,
    description:
      'Ciclovatiton\'s Poly Touch Vapour Metallic bar tape combines a subtle metallic sheen with an advanced polymer construction that cushions vibrations without sacrificing bar feel. The Gem Black finish catches light beautifully, adding a premium touch to any build.',
    images: [],
    specifications: {
      'Material': 'High-density polymer',
      'Finish': 'Vapour metallic',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Metallic gem finish | Vibration-absorbing polymer | Premium grip feel | Clean bar look | Includes end plugs | Black metallic',
    },
    stock_quantity: 3,
    stock_status: stockStatus(3),
    color: 'Vapour Metallic Gem Black',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Seitex Ballistic Kanok Art Bar Tape (Glossy Black)',
    brand: 'Ciclovatiton',
    category: 'bar-tape',
    type: 'accessory',
    price: 2899,
    original_price: null,
    description:
      'The Ciclovatiton Seitex Ballistic Kanok Art bar tape features a unique woven Kanok Art texture that delivers exceptional grip and an eye-catching visual pattern. The ballistic-weave construction provides durability above the norm, surviving thousands of kilometres of riding with minimal wear.',
    images: [],
    specifications: {
      'Material': 'Seitex ballistic weave',
      'Design': 'Kanok Art woven pattern',
      'Finish': 'Glossy',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Ballistic weave construction | Kanok Art woven texture | High grip surface | Glossy Black finish | Durable long-service life | End plugs included',
    },
    stock_quantity: 5,
    stock_status: stockStatus(5),
    color: 'Glossy Black',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Leather Touch Topo Bar Tape (Jet Black)',
    brand: 'Ciclovatiton',
    category: 'bar-tape',
    type: 'accessory',
    price: 2999,
    original_price: null,
    description:
      'Ciclovatiton\'s Leather Touch Topo bar tape replicates the feel of genuine leather using advanced synthetic material — warm, supple, and long-lasting. The raised topographical texture adds character and improves grip through gloves or bare-handed. A premium choice for road, audax, and retro builds.',
    images: [],
    specifications: {
      'Material': 'Synthetic leather with raised topo texture',
      'Feel': 'Leather-like tactile surface',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Leather-feel synthetic surface | Raised topographical texture | Warm all-weather grip | Premium road aesthetic | Jet Black | End plugs included',
    },
    stock_quantity: 4,
    stock_status: stockStatus(4),
    color: 'Jet Black',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Seitex Ballistic Bar Tape (Glossy Black)',
    brand: 'Ciclovatiton',
    category: 'bar-tape',
    type: 'accessory',
    price: 2899,
    original_price: null,
    description:
      'The Ciclovatiton Seitex Ballistic bar tape is engineered for durability and consistent grip across all conditions. Its ballistic-weave polyurethane construction resists abrasion and stretching while maintaining a comfortable feel over long distances. A workhorse tape that looks as good as it performs.',
    images: [],
    specifications: {
      'Material': 'Seitex ballistic weave polyurethane',
      'Finish': 'Glossy',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Ballistic weave durability | Abrasion and stretch resistant | Consistent grip surface | Glossy Black | Suitable for racing and training | End plugs included',
    },
    stock_quantity: 3,
    stock_status: stockStatus(3),
    color: 'Glossy Black',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Grind Touch Bar Tape (Matt Black)',
    brand: 'Ciclovatiton',
    category: 'bar-tape',
    type: 'accessory',
    price: 2799,
    original_price: null,
    description:
      'The Ciclovatiton Grind Touch bar tape earns its name from a subtle textured "grind" surface that locks your hands in place during hard efforts. Its matte black finish resists fingerprints and looks sharp on any build. Ideal for riders who prefer a performance-first tape without the gloss.',
    images: [],
    specifications: {
      'Material': 'High-grip polyurethane with grind texture',
      'Finish': 'Matte',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Grind texture for enhanced grip | Fingerprint-resistant matte finish | Performance-focused design | Matt Black | End plugs included | 2 units in stock',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Matt Black',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Cyclone Galaxy Bar Tape',
    brand: 'Ciclovatiton',
    category: 'bar-tape',
    type: 'accessory',
    price: 3399,
    original_price: null,
    description:
      'Make your bars a statement — the Ciclovatiton Cyclone Galaxy bar tape features a stunning swirling galaxy pattern that captures the iridescent colours of a nebula. Premium polymer construction, excellent vibration damping, and a unique appearance that sets your build apart from every bike at the café stop.',
    images: [],
    specifications: {
      'Material': 'Premium polymer with printed galaxy pattern',
      'Design': 'Cyclone galaxy iridescent print',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Unique galaxy swirl pattern | Iridescent multi-colour finish | Premium polymer cushioning | Eye-catching build detail | End plugs included | Limited stock',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Galaxy Multicolour',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Leather Touch Bar Tape (Steampunk Copper)',
    brand: 'Ciclovatiton',
    category: 'bar-tape',
    type: 'accessory',
    price: 2799,
    original_price: null,
    description:
      'Ciclovatiton\'s Leather Touch Steampunk Copper bar tape brings a vintage industrial aesthetic to modern road bikes. The rich copper-tone synthetic leather surface evokes classic workshop craftsmanship while delivering modern grip performance and moisture resistance.',
    images: [],
    specifications: {
      'Material': 'Synthetic leather',
      'Finish': 'Steampunk copper metallic',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Steampunk Copper aesthetic | Leather-feel surface | Moisture resistant | Classic copper metallic finish | End plugs included | Limited stock',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Steampunk Copper',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Seitex 2D Carbon Bar Tape (Ice Gray)',
    brand: 'Ciclovatiton',
    category: 'bar-tape',
    type: 'accessory',
    price: 2999,
    original_price: null,
    description:
      'The Ciclovatiton Seitex 2D Carbon bar tape features a printed two-dimensional carbon fibre weave pattern on a durable ballistic surface — giving your bars a carbon look without the cost. Ice Gray colouring adds a cool, modern finish that pairs well with all-black or silver builds.',
    images: [],
    specifications: {
      'Material': 'Seitex ballistic weave with 2D carbon print',
      'Finish': 'Carbon print over Ice Gray base',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        '2D carbon fibre visual | Ice Gray colourway | Ballistic weave durability | Premium carbon aesthetic | End plugs included | Limited stock',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Ice Gray',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BAR TAPE — PRO'S PRO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Ultralight Bar Tape (Wood)',
    brand: "Pro's Pro",
    category: 'bar-tape',
    type: 'accessory',
    price: 2499,
    original_price: null,
    description:
      "Pro's Pro bar tape in a natural wood-effect finish — for riders who want their build to have a touch of organic character. Lightweight construction, excellent grip, and easy application make it a trusted choice for club cyclists and touring riders who value both comfort and aesthetics.",
    images: [],
    specifications: {
      'Material': 'High-density EVA foam',
      'Finish': 'Natural wood effect',
      'Width': '30 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Natural wood-effect print | Lightweight EVA construction | Comfortable vibration absorption | Easy wrap application | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Wood Effect',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Ultralight Bar Tape (Yellow)',
    brand: "Pro's Pro",
    category: 'bar-tape',
    type: 'accessory',
    price: 2499,
    original_price: null,
    description:
      "Pro's Pro bar tape in vibrant yellow — a bold, race-inspired colourway that adds a pop of colour to any build. Lightweight EVA construction delivers comfortable vibration damping across all road surfaces, with an easy-wrap surface that stays put once applied.",
    images: [],
    specifications: {
      'Material': 'High-density EVA foam',
      'Finish': 'Solid colour',
      'Width': '30 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Vibrant Yellow colourway | Lightweight EVA foam | Vibration-damping construction | Easy wrap | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Yellow',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BAR TAPE — GUEE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'SL Bar Tape',
    brand: 'Guee',
    category: 'bar-tape',
    type: 'accessory',
    price: 1999,
    original_price: null,
    description:
      'Guee SL bar tape offers a reliable, everyday road tape with a comfortable EVA foam core and a clean, smooth outer surface. Straightforward to wrap, it delivers consistent grip whether you are in the hoods, the drops, or the tops — at a price that makes frequent replacement practical.',
    images: [],
    specifications: {
      'Material': 'EVA foam with synthetic outer',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Comfortable EVA core | Smooth easy-grip surface | Clean road aesthetic | Easy application | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Assorted',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BAR TAPE — TREK GEL CORK
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Gel Cork Handlebar Tape (Baha Yellow)',
    brand: 'Trek',
    category: 'bar-tape',
    type: 'accessory',
    price: 1999,
    original_price: null,
    description:
      'Trek\'s Gel Cork Handlebar Tape combines a natural cork texture with a gel-filled cushioning layer for exceptional vibration damping over long rides. The Baha Yellow finish brings a warm, cheerful touch to any build while the moisture-resistant surface keeps its colour and grip across all conditions.',
    images: [],
    specifications: {
      'Material': 'Cork with gel cushioning layer',
      'Finish': 'Natural cork texture',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Gel-filled cushioning layer | Natural cork texture | Moisture-resistant surface | Baha Yellow colourway | Trek quality | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Baha Yellow',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Gel Cork Handlebar Tape (Juniper)',
    brand: 'Trek',
    category: 'bar-tape',
    type: 'accessory',
    price: 2099,
    original_price: null,
    description:
      'Trek Gel Cork Handlebar Tape in Juniper — a muted, earthy green that complements both neutral and colourful builds. Cork and gel layered construction absorbs road vibration effectively while maintaining a natural feel in your hands across all day rides.',
    images: [],
    specifications: {
      'Material': 'Cork with gel cushioning',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Gel-cushion cork construction | Juniper earthy green | Trek OEM quality | End plugs included | Moisture resistant',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Juniper',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Gel Cork Handlebar Tape (Power Surge)',
    brand: 'Trek',
    category: 'bar-tape',
    type: 'accessory',
    price: 3999,
    original_price: null,
    description:
      'The premium edition of Trek\'s Gel Cork Handlebar Tape — Power Surge colourway features high-contrast graphics and an enhanced gel layer for maximum vibration damping. Designed for performance-oriented builds that demand the best in long-distance comfort and aesthetics.',
    images: [],
    specifications: {
      'Material': 'Enhanced cork with performance gel layer',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Enhanced performance gel layer | Power Surge graphics | Trek premium tier | Maximum vibration damping | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Power Surge',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Gel Cork Handlebar Tape (Brown Wall)',
    brand: 'Trek',
    category: 'bar-tape',
    type: 'accessory',
    price: 1999,
    original_price: null,
    description:
      'Classic Brown Wall — Trek\'s Gel Cork Handlebar Tape in a retro tan-brown colourway that perfectly complements vintage, randonneuring, and heritage road builds. Cork and gel cushioning delivers the comfort your hands need over long audax or touring distances.',
    images: [],
    specifications: {
      'Material': 'Cork with gel cushioning',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Retro Brown Wall colourway | Cork + gel cushioning | Great for heritage/audax builds | End plugs included | 2 units in stock',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Brown Wall',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },
  {
    name: 'Gel Cork Handlebar Tape (Hex Blue)',
    brand: 'Trek',
    category: 'bar-tape',
    type: 'accessory',
    price: 2099,
    original_price: null,
    description:
      'Trek Gel Cork Handlebar Tape in Hex Blue — a cool, contemporary blue with a hexagonal texture pattern that enhances grip and visual interest. Cork and gel construction ensures hours of comfortable riding without hand fatigue.',
    images: [],
    specifications: {
      'Material': 'Cork with gel cushioning',
      'Texture': 'Hexagonal surface pattern',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Hex Blue with hexagonal texture | Cork + gel construction | Contemporary colour | End plugs included | 3 units in stock',
    },
    stock_quantity: 3,
    stock_status: stockStatus(3),
    color: 'Hex Blue',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BAR TAPE — PRO (Shimano owned brand)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Griplite 2000 Bar Tape (30 mm)',
    brand: 'PRO',
    category: 'bar-tape',
    type: 'accessory',
    price: 2690,
    original_price: null,
    description:
      'PRO Griplite 2000 bar tape — from Shimano\'s own component brand — features a high-grip synthetic surface with 30 mm width for excellent hand coverage. The Griplite texture delivers confident grip in wet and dry conditions, making it a favourite among sportive and training riders who want professional-grade tape without a premium price.',
    images: [],
    specifications: {
      'Brand': 'PRO (by Shimano)',
      'Material': 'High-grip synthetic polyurethane',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Shimano PRO brand quality | Griplite textured surface | 30 mm wide coverage | Wet and dry grip performance | End plugs included | 10 units in stock',
    },
    stock_quantity: 10,
    stock_status: stockStatus(10),
    color: 'Black',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BAR TAPE — BURGH (Australian premium brand)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Ossa Bar Tape (Stealth)',
    brand: 'Burgh',
    category: 'bar-tape',
    type: 'accessory',
    price: 3900,
    original_price: null,
    description:
      'The Burgh Ossa is a premium Australian bar tape with a bold perforated design that reduces weight while maintaining structural integrity. Stealth Black colouring and the distinctive Ossa pattern make it one of the most visually striking tapes available. High-density EVA foam provides excellent vibration damping across Australia\'s rough roads and beyond.',
    images: [],
    specifications: {
      'Material': 'High-density EVA foam with perforated design',
      'Finish': 'Stealth Black',
      'Width': '32 mm',
      'Length': '2100 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Ossa perforated design | Stealth Black finish | Premium Australian brand | High-density EVA cushioning | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Stealth Black',
    size: '2100 × 32 mm',
    tag: 'Premium Bar Tape',
    is_active: true,
  },
  {
    name: 'Grunge Bar Tape (White)',
    brand: 'Burgh',
    category: 'bar-tape',
    type: 'accessory',
    price: 3900,
    original_price: null,
    description:
      'The Burgh Grunge bar tape features a raw, textured pattern inspired by urban cycling culture — rebellious design meets premium performance. The white colourway creates a striking contrast on dark builds, while the high-density EVA foam delivers the vibration-damping properties to keep your hands fresh for the long haul.',
    images: [],
    specifications: {
      'Material': 'High-density EVA foam',
      'Finish': 'Grunge textured surface',
      'Width': '32 mm',
      'Length': '2100 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Grunge urban texture | White colourway | Premium EVA cushioning | Contrasting aesthetic | End plugs included | 2 units in stock',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'White',
    size: '2100 × 32 mm',
    tag: 'Premium Bar Tape',
    is_active: true,
  },
  {
    name: 'Wattbombs Bar Tape (Stealth)',
    brand: 'Burgh',
    category: 'bar-tape',
    type: 'accessory',
    price: 3900,
    original_price: null,
    description:
      'Burgh Wattbombs bar tape takes its name from the explosive efforts of track and criterium racing. Its dynamic diagonal-stripe pattern and Stealth Black finish give your bars a sense of speed even standing still. Premium EVA foam cushioning and a secure grip surface make it as functional as it is distinctive.',
    images: [],
    specifications: {
      'Material': 'High-density EVA foam',
      'Design': 'Wattbombs diagonal stripe pattern',
      'Finish': 'Stealth Black',
      'Width': '32 mm',
      'Length': '2100 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Wattbombs race-inspired pattern | Stealth Black | Premium EVA cushion | Dynamic diagonal design | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Stealth Black',
    size: '2100 × 32 mm',
    tag: 'Premium Bar Tape',
    is_active: true,
  },
  {
    name: 'Hex Bar Tape (Stealth)',
    brand: 'Burgh',
    category: 'bar-tape',
    type: 'accessory',
    price: 3900,
    original_price: null,
    description:
      'Burgh Hex bar tape is defined by its repeating hexagonal surface pattern that improves grip by increasing surface contact and adding a structural visual depth. Stealth Black colourway keeps your build stealthy while the premium EVA foam core ensures every road imperfection is absorbed before it reaches your hands.',
    images: [],
    specifications: {
      'Material': 'High-density EVA foam',
      'Design': 'Hexagonal surface pattern',
      'Finish': 'Stealth Black',
      'Width': '32 mm',
      'Length': '2100 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Hexagonal pattern for enhanced grip | Stealth Black finish | Premium EVA core | Structural visual depth | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Stealth Black',
    size: '2100 × 32 mm',
    tag: 'Premium Bar Tape',
    is_active: true,
  },
  {
    name: 'Mosaic Bar Tape (Stealth)',
    brand: 'Burgh',
    category: 'bar-tape',
    type: 'accessory',
    price: 3900,
    original_price: null,
    description:
      'The Burgh Mosaic bar tape is a work of art as much as a functional riding component. Its intricate mosaic tile pattern creates a rich visual texture across the bars while the premium EVA foam beneath delivers the same excellent vibration-damping performance that has made Burgh a favourite among Australian roadies.',
    images: [],
    specifications: {
      'Material': 'High-density EVA foam',
      'Design': 'Mosaic tile pattern',
      'Finish': 'Stealth Black',
      'Width': '32 mm',
      'Length': '2100 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Intricate mosaic tile design | Stealth Black | Premium EVA damping | Australian craft brand | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Stealth Black',
    size: '2100 × 32 mm',
    tag: 'Premium Bar Tape',
    is_active: true,
  },
  {
    name: 'Matter Bar Tape (Stealth)',
    brand: 'Burgh',
    category: 'bar-tape',
    type: 'accessory',
    price: 3900,
    original_price: null,
    description:
      'Burgh Matter bar tape strips things back to what matters — an extremely clean, minimalist smooth surface in deep Stealth Black. No patterns, no textures, just premium EVA foam and a refined finish that lets your build\'s other details shine. For riders who believe less is more.',
    images: [],
    specifications: {
      'Material': 'High-density EVA foam',
      'Design': 'Minimalist smooth surface',
      'Finish': 'Deep Stealth Black',
      'Width': '32 mm',
      'Length': '2100 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Minimalist clean design | Deep Stealth Black | Premium smooth EVA surface | Less is more aesthetic | End plugs included | 2 units in stock',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Stealth Black',
    size: '2100 × 32 mm',
    tag: 'Premium Bar Tape',
    is_active: true,
  },
  {
    name: 'Nexus Bar Tape (White)',
    brand: 'Burgh',
    category: 'bar-tape',
    type: 'accessory',
    price: 3900,
    original_price: null,
    description:
      'The Burgh Nexus bar tape in white features a bold geometric web pattern that creates a structured visual network across your bars. Clean white finish makes it ideal for all-white builds or as a contrast accent on dark bikes. Premium EVA construction and the trusted Burgh quality are baked in.',
    images: [],
    specifications: {
      'Material': 'High-density EVA foam',
      'Design': 'Nexus geometric web pattern',
      'Finish': 'White',
      'Width': '32 mm',
      'Length': '2100 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Geometric Nexus pattern | Clean White finish | Premium EVA cushioning | Great for white builds | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'White',
    size: '2100 × 32 mm',
    tag: 'Premium Bar Tape',
    is_active: true,
  },
  {
    name: 'Nexus Bar Tape (Stealth)',
    brand: 'Burgh',
    category: 'bar-tape',
    type: 'accessory',
    price: 3900,
    original_price: null,
    description:
      'Burgh Nexus in Stealth Black — the same bold geometric web pattern as the white version, now in a deep black finish for builds that demand a unified, sophisticated look. Premium EVA foam and Burgh\'s renowned construction quality make every ride a little more refined.',
    images: [],
    specifications: {
      'Material': 'High-density EVA foam',
      'Design': 'Nexus geometric web pattern',
      'Finish': 'Stealth Black',
      'Width': '32 mm',
      'Length': '2100 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Geometric Nexus pattern | Stealth Black | Premium EVA cushioning | Unified dark build aesthetic | End plugs included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Stealth Black',
    size: '2100 × 32 mm',
    tag: 'Premium Bar Tape',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BAR TAPE — GOOD HORSE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Classic Bar Tape',
    brand: 'Good Horse',
    category: 'bar-tape',
    type: 'accessory',
    price: 1595,
    original_price: null,
    description:
      'Good Horse Classic bar tape is a high-value everyday road tape that delivers reliable grip, easy application, and decent vibration absorption at an accessible price. A go-to choice for training bikes, commuters, and budget-conscious riders who replace tape frequently and want a dependable, no-fuss product.',
    images: [],
    specifications: {
      'Material': 'EVA foam with synthetic outer',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Great value everyday tape | Easy wrap application | EVA foam cushioning | Includes end plugs | 18 units in stock',
    },
    stock_quantity: 18,
    stock_status: stockStatus(18),
    color: 'Assorted',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BAR TAPE — SELLE ITALIA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Nastro Smart Bar Tape',
    brand: 'Selle Italia',
    category: 'bar-tape',
    type: 'accessory',
    price: 1499,
    original_price: null,
    description:
      'Selle Italia Nastro Smart bar tape — from the legendary Italian saddle maker — brings Italian craftsmanship to your handlebars. The Nastro Smart features a comfortable foam-backed polyurethane construction with a smooth, tactile surface that feels great on long road rides and sportives.',
    images: [],
    specifications: {
      'Brand': 'Selle Italia (Italy)',
      'Material': 'Foam-backed polyurethane',
      'Finish': 'Smooth tactile surface',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + finishing tape',
      'Key Features':
        'Italian craftsmanship | Foam-backed polyurethane | Smooth tactile finish | Comfortable for long rides | End plugs included | 9 units in stock',
    },
    stock_quantity: 9,
    stock_status: stockStatus(9),
    color: 'Assorted',
    size: '2000 × 30 mm',
    tag: 'Bar Tape',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BAR TAPE — SILCA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Nastro Cuscino Bar Tape',
    brand: 'SILCA',
    category: 'bar-tape',
    type: 'accessory',
    price: 4399,
    original_price: null,
    description:
      'SILCA Nastro Cuscino is among the finest bar tapes available — a velvet-backed, micro-cork-infused silicone tape that achieves the near-impossible combination of extreme cushioning and precise bar feel. Trusted by WorldTour mechanics and used on the bikes of Grand Tour winners. If you spend thousands of kilometres on your bars, this tape pays for itself in comfort.',
    images: [],
    specifications: {
      'Material': 'Silicone + micro-cork with velvet backing',
      'Construction': 'Premium multilayer construction',
      'Width': '30 mm',
      'Length': '2000 mm',
      'Includes': 'End plugs + Italian finishing tape',
      'Key Features':
        'WorldTour grade premium tape | Silicone + micro-cork compound | Velvet-backed comfort | Outstanding vibration damping | Direct bar feel | Italian finishing tape included',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Assorted',
    size: '2000 × 30 mm',
    tag: 'Premium Bar Tape',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRIPS — SHAKE / SHIMANO COMPATIBLE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Lock-On Road Bar Grip SH-8000/7000 (Black)',
    brand: 'Shake Grip',
    category: 'grips',
    type: 'accessory',
    price: 2280,
    original_price: null,
    description:
      'Shake Grip lock-on road grips for Shimano SH-8000/7000 series compatibility — engineered for the precise grip feel demanded by road and endurance cyclists. The dual lock-on clamp system eliminates any possibility of rotation or slippage, while the ergonomic rubber compound adapts to your grip pressure for all-day comfort.',
    images: [],
    specifications: {
      'Compatibility': 'Shimano SH-8000 / SH-7000 series',
      'Type': 'Lock-on dual clamp',
      'Material': 'Ergonomic rubber compound',
      'Clamps': 'Alloy dual clamp (included)',
      'Key Features':
        'Dual lock-on clamp system | SH-8000/7000 compatible | Zero rotation guarantee | Ergonomic rubber compound | 5 units in stock | Black',
    },
    stock_quantity: 5,
    stock_status: stockStatus(5),
    color: 'Black',
    size: 'Standard',
    tag: 'Road Grip',
    is_active: true,
  },
  {
    name: 'Lock-On Road Bar Grip SH-8000/7000 (Blue)',
    brand: 'Shake Grip',
    category: 'grips',
    type: 'accessory',
    price: 2280,
    original_price: null,
    description:
      'Shake Grip lock-on road bar grips in blue for Shimano SH-8000/7000 series — the same trusted dual lock-on construction and ergonomic rubber compound in a bold blue colourway. A subtle colour accent that adds character to your cockpit.',
    images: [],
    specifications: {
      'Compatibility': 'Shimano SH-8000 / SH-7000 series',
      'Type': 'Lock-on dual clamp',
      'Material': 'Ergonomic rubber compound',
      'Key Features':
        'Dual lock-on system | SH-8000/7000 compatible | Blue colourway | Zero slippage | Alloy clamps included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Blue',
    size: 'Standard',
    tag: 'Road Grip',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRIPS — SRAM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'MTB Comfort Grips (133 mm)',
    brand: 'SRAM',
    category: 'grips',
    type: 'accessory',
    price: 990,
    original_price: null,
    description:
      'SRAM MTB Comfort Grips offer a soft, ergonomic grip surface for trail and mountain bike riders who want extra cushioning on long, rough rides. At 133 mm, the grip length suits most bar/glove combinations, and the durable rubber compound remains tacky in wet and muddy conditions.',
    images: [],
    specifications: {
      'Type': 'Open-end slide-on MTB grip',
      'Length': '133 mm',
      'Material': 'Soft ergonomic rubber compound',
      'Fit': 'Universal 22.2 mm bar',
      'Key Features':
        'Ergonomic MTB comfort design | 133 mm length | Tacky rubber surface | Wet and dry grip | Universal 22.2 mm bar fit',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Black',
    size: '133 mm',
    tag: 'MTB Grip',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRIPS — SPRGRIPS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Inner Bar End Grip (White)',
    brand: 'SprGrips',
    category: 'grips',
    type: 'accessory',
    price: 599,
    original_price: null,
    description:
      'SprGrips inner bar end grips plug into the open ends of flat or riser bars, transforming them into alternative hand positions. Ideal for commuters and fitness cyclists who want more bar options without a full drop-bar conversion. The white finish suits hybrid and urban bikes with lighter colourways.',
    images: [],
    specifications: {
      'Type': 'Inner bar end plug-in grips',
      'Bar Diameter': 'Standard 22.2 mm inner',
      'Material': 'Durable rubber compound',
      'Key Features':
        'Inner bar end design | Creates additional hand position | Universal 22.2 mm bar end fit | White finish | Great for commuter and hybrid bikes',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'White',
    size: 'Universal',
    tag: 'Bar End Grip',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRIPS — PROBIKE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Bar End Grip (Black/Grey)',
    brand: 'Probike',
    category: 'grips',
    type: 'accessory',
    price: 1050,
    original_price: null,
    description:
      'Probike Bar End Grips add an ergonomic alternative hand position to flat-bar bikes — reducing wrist fatigue on longer rides and giving you more control during climbs. The black and grey two-tone rubber construction provides good durability and grip while keeping a clean, purposeful look.',
    images: [],
    specifications: {
      'Type': 'External bar end grip',
      'Bar Diameter': '22.2 mm end',
      'Material': 'Two-tone rubber compound',
      'Clamp': 'Alloy clamp bolt',
      'Key Features':
        'Ergonomic bar end position | Reduces wrist fatigue | Two-tone Black/Grey | Alloy clamp bolt | 3 units in stock | Universal fit',
    },
    stock_quantity: 3,
    stock_status: stockStatus(3),
    color: 'Black / Grey',
    size: '22.2 mm',
    tag: 'Bar End Grip',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRIPS — CICLOVATITON
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Grip Fusion Bar Grip (Neon Yellow)',
    brand: 'Ciclovatiton',
    category: 'grips',
    type: 'accessory',
    price: 807,
    original_price: null,
    description:
      'Ciclovatiton Grip Fusion bar grips in high-visibility Neon Yellow — a comfortable, durable MTB and hybrid grip with a dual-compound construction that provides a firm outer shell and a soft inner contact layer. The neon yellow colourway adds excellent visibility and a bold visual statement to any build.',
    images: [],
    specifications: {
      'Type': 'Slide-on dual compound grip',
      'Material': 'Dual-compound rubber (firm outer + soft inner)',
      'Length': '130 mm',
      'Bar Fit': '22.2 mm',
      'Key Features':
        'Dual-compound construction | Neon Yellow high-visibility | Firm outer + soft inner layer | Comfortable long-ride grip | 11 units in stock',
    },
    stock_quantity: 11,
    stock_status: stockStatus(11),
    color: 'Neon Yellow',
    size: '130 mm',
    tag: 'MTB Grip',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SKEWERS — TOKEN / ALLOY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Alloy Skewers (SH-8000/7000)',
    brand: 'TOKEN',
    category: 'skewers',
    type: 'accessory',
    price: 1590,
    original_price: null,
    description:
      'TOKEN alloy quick-release skewers engineered for precise compatibility with Shimano SH-8000/7000 series wheels. CNC machined from 6061 alloy for a clean, lightweight finish. The cam mechanism delivers consistent, reliable clamping force for safe, quick wheel changes on road and training bikes.',
    images: [],
    specifications: {
      'Material': '6061 CNC machined alloy',
      'Compatibility': 'Shimano SH-8000 / SH-7000',
      'Mechanism': 'Cam quick-release',
      'Axle': 'Stainless steel',
      'Set': 'Front + rear pair',
      'Key Features':
        'CNC machined 6061 alloy | Cam QR mechanism | SH-8000/7000 wheel compatibility | Reliable clamping force | Stainless steel axle | Front + rear set',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Alloy Silver',
    size: '10 mm F / 130 mm R',
    tag: 'Skewers',
    is_active: true,
  },
  {
    name: 'Alloy Skewers (10 mm F / 130 mm R)',
    brand: 'TOKEN',
    category: 'skewers',
    type: 'accessory',
    price: 1390,
    original_price: null,
    description:
      'TOKEN alloy quick-release skewers in standard 10 mm front / 130 mm rear sizing — fitting the vast majority of road bike wheels. CNC machined alloy construction, stainless steel axle, and a smooth cam mechanism ensure every wheel change is fast, safe, and repeatable.',
    images: [],
    specifications: {
      'Material': 'CNC machined alloy',
      'Front Axle': '10 mm',
      'Rear Axle': '130 mm',
      'Mechanism': 'Cam quick-release',
      'Set': 'Front + rear pair',
      'Key Features':
        'Standard 10 mm F / 130 mm R sizing | CNC alloy machined | Smooth cam QR | Stainless steel axle | 7 sets in stock',
    },
    stock_quantity: 7,
    stock_status: stockStatus(7),
    color: 'Alloy Silver',
    size: '10 mm F / 130 mm R',
    tag: 'Skewers',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FENDERS — SKS GERMANY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Flap Guard Mudguard',
    brand: 'SKS Germany',
    category: 'fenders',
    type: 'accessory',
    price: 950,
    original_price: null,
    description:
      'The SKS Germany Flap Guard is a compact rear tyre flap that clips directly onto your brake bridge or seat stay to deflect spray and mud away from the drivetrain, your back, and following riders. Made from flexible polypropylene, it installs in seconds without tools and is compatible with a wide range of road and hybrid tyre clearances.',
    images: [],
    specifications: {
      'Material': 'Flexible polypropylene',
      'Fit': 'Universal clip-on to seat stay / brake bridge',
      'Mount': 'Tool-free installation',
      'Brand': 'SKS Germany',
      'Key Features':
        'Tool-free clip-on installation | Deflects spray from drivetrain and rider | Wide tyre compatibility | Flexible polypropylene | SKS Germany quality | 18 units in stock',
    },
    stock_quantity: 18,
    stock_status: stockStatus(18),
    color: 'Black',
    size: 'Universal',
    tag: 'Fender',
    is_active: true,
  },
];

// ---------------------------------------------------------------------------
// INSERT INTO SUPABASE
// ---------------------------------------------------------------------------

async function seed() {
  console.log('\n🎀  Pro Riders Hub — Bar Tape, Grips & Accessories Seed Script');
  console.log(`📦  Preparing ${products.length} products for upload...\n`);

  const BATCH_SIZE = 20;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/db_products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `❌  Batch ${Math.floor(i / BATCH_SIZE) + 1} failed — ${res.status}: ${errText}`,
      );

      if (res.status === 401 || res.status === 403) {
        console.error(
          '\n⚠️  Row-Level Security is blocking the insert.',
          '\n    Run in Supabase SQL Editor:',
          '\n      ALTER TABLE db_products DISABLE ROW LEVEL SECURITY;',
          '\n    Then re-enable after:',
          '\n      ALTER TABLE db_products ENABLE ROW LEVEL SECURITY;\n',
        );
        process.exit(1);
      }

      failed += batch.length;
      continue;
    }

    inserted += batch.length;
    console.log(
      `  ✅  Batch ${Math.floor(i / BATCH_SIZE) + 1} — inserted ${batch.length} products (total: ${inserted})`,
    );
  }

  console.log(`\n${'─'.repeat(55)}`);
  console.log(`✅  Done!  ${inserted} products inserted,  ${failed} failed.`);
  if (inserted > 0) {
    console.log(
      `\n  → Browse at /accessories (filter by "bar-tape", "grips", "skewers", "fenders")`,
      `\n  → Add product images via /admin/dashboard → Products tab.\n`,
    );
  }
}

seed().catch(console.error);
