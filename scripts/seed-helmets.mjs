/**
 * Seed script: uploads all helmet inventory to Supabase db_products.
 * Data sourced from inventory PDF + scraped specs from dbykstore.com & bumsonthesaddle.com.
 * Descriptions written in Trek / Cannondale product-page style.
 *
 * Usage:  node scripts/seed-helmets.mjs
 *
 * NOTE: If inserts fail with 401/403, temporarily disable RLS in Supabase SQL Editor:
 *   ALTER TABLE db_products DISABLE ROW LEVEL SECURITY;
 *   -- run script --
 *   ALTER TABLE db_products ENABLE ROW LEVEL SECURITY;
 * Or replace SUPABASE_ANON_KEY with your service_role key.
 */

const SUPABASE_URL = 'https://yeejxvxyabrmnpdnziek.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZWp4dnh5YWJybW5wZG56aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDcwNjcsImV4cCI6MjA5Nzc4MzA2N30.3GdoadfMVfDVpa3YQkYRd6zAxbdBoY1BnEk-ejFQOeM';

function stockStatus(qty) {
  if (!qty || qty === 0) return 'Out of Stock';
  if (qty <= 3) return 'Limited Stock';
  return 'In Stock';
}

// ---------------------------------------------------------------------------
// PRODUCT DATA  — grouped by sub-category
// Prices = MRP from inventory PDF.  Stock = showroom + stock-room totals.
// ---------------------------------------------------------------------------

const products = [

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — ABUS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Airbreaker Helmet (Red)',
    brand: 'ABUS',
    category: 'road-helmets',
    type: 'accessory',
    price: 19500,
    original_price: null,
    description:
      'The ABUS Airbreaker is the pinnacle of road helmet engineering — a wind-tunnel-developed shell that optimises air flow from every angle. Its deep ventilation channels keep you cool even on the hardest climbs, while the Zoom Ace fit system delivers a precision-fit dialling down to the millimetre. Race-proven, CE certified, and built to the exacting safety standards ABUS is renowned for.',
    images: [],
    specifications: {
      'Ventilation': 'Wind-tunnel-optimised deep channels',
      'Fit System': 'Zoom Ace',
      'Shell': 'In-mold polycarbonate with EPS liner',
      'Certification': 'CE EN1078',
      'Weight': '~255 g',
      'Key Features':
        'Wind-tunnel-developed aerodynamic shell | Deep ventilation channels | Zoom Ace precision fit | CE EN1078 certified | Showroom & stock room availability',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Red',
    size: 'S (51–55 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Airbreaker Helmet (Purple)',
    brand: 'ABUS',
    category: 'road-helmets',
    type: 'accessory',
    price: 19500,
    original_price: null,
    description:
      'Race in bold purple — the ABUS Airbreaker combines wind-tunnel aerodynamics with deep internal ventilation channels and the Zoom Ace micro-adjust fit system. Designed for cyclists who demand both performance and style at the highest level.',
    images: [],
    specifications: {
      'Ventilation': 'Wind-tunnel-optimised deep channels',
      'Fit System': 'Zoom Ace',
      'Shell': 'In-mold polycarbonate with EPS liner',
      'Certification': 'CE EN1078',
      'Key Features':
        'Wind-tunnel aerodynamics | Deep channelled ventilation | Zoom Ace precision fit | CE EN1078 | Available in Large fit',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Purple',
    size: 'L (59–61 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Airbreaker Helmet (Steel Blue)',
    brand: 'ABUS',
    category: 'road-helmets',
    type: 'accessory',
    price: 19500,
    original_price: null,
    description:
      'Steel blue elegance meets professional performance. The ABUS Airbreaker\'s aerodynamic profile, deep ventilation network, and Zoom Ace fit system make it the choice of riders who take both safety and aesthetics seriously.',
    images: [],
    specifications: {
      'Ventilation': 'Wind-tunnel-optimised deep channels',
      'Fit System': 'Zoom Ace',
      'Shell': 'In-mold polycarbonate with EPS liner',
      'Certification': 'CE EN1078',
      'Key Features':
        'Wind-tunnel aerodynamics | Steel blue anodised finish | Zoom Ace fit | CE certified | Small fit (51–55 cm)',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Steel Blue',
    size: 'S (51–55 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Airbreaker Movistar Team Edition (Blue/Black)',
    brand: 'ABUS',
    category: 'road-helmets',
    type: 'accessory',
    price: 19500,
    original_price: null,
    description:
      'Wear the colours of Movistar Team. The ABUS Airbreaker Movistar Team 18 Edition is the same helmet trusted by the world\'s elite peloton — aerodynamic shell, deep ventilation, and the Zoom Ace fit system — now in the team\'s signature blue and black livery.',
    images: [],
    specifications: {
      'Edition': 'Movistar Team 18 replica',
      'Ventilation': 'Wind-tunnel-optimised deep channels',
      'Fit System': 'Zoom Ace',
      'Shell': 'In-mold polycarbonate',
      'Certification': 'CE EN1078',
      'Key Features':
        'Official Movistar Team 18 livery | Wind-tunnel aerodynamic shell | Zoom Ace precision fit | Available in S & L | CE EN1078 certified',
    },
    stock_quantity: 3,
    stock_status: stockStatus(3),
    color: 'Blue / Black',
    size: 'S (51–55 cm) / L (59–61 cm)',
    tag: 'Limited Edition',
    is_active: true,
  },
  {
    name: 'Airbreaker Helmet (Black/Red)',
    brand: 'ABUS',
    category: 'road-helmets',
    type: 'accessory',
    price: 19500,
    original_price: null,
    description:
      'Aggressive black and red colourway on the world-class ABUS Airbreaker. Wind-tunnel-proven aerodynamics, deep ventilation channels, and the Zoom Ace fit deliver race-day performance for the most demanding road cyclists.',
    images: [],
    specifications: {
      'Ventilation': 'Wind-tunnel-optimised deep channels',
      'Fit System': 'Zoom Ace',
      'Shell': 'In-mold polycarbonate',
      'Certification': 'CE EN1078',
      'Key Features':
        'Black/Red race colourway | Aerodynamic wind-tunnel shell | Deep ventilation | Zoom Ace fit | Small (51–55 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Black / Red',
    size: 'S (51–55 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — GIST
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Veloce Helmet (Matte Black)',
    brand: 'Gist',
    category: 'road-helmets',
    type: 'accessory',
    price: 6900,
    original_price: null,
    description:
      'The Gist Veloce brings Italian design values to an accessible road helmet. In-mold construction keeps weight to a minimum while the internal ventilation channels maintain airflow on climbs and sprints alike. The rear micro-adjust retention system ensures a consistent fit lap after lap.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS liner',
      'Ventilation': 'Deep internal channelling',
      'Fit System': 'Rear micro-adjust dial',
      'Weight': '~240 g',
      'Certification': 'CE EN1078',
      'Key Features':
        'Italian road design | In-mold lightweight construction | Deep ventilation channels | Rear micro-adjust retention | CE EN1078 certified',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Matte Black',
    size: 'S-M (52–56 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Veloce Helmet (Glossy Red)',
    brand: 'Gist',
    category: 'road-helmets',
    type: 'accessory',
    price: 6900,
    original_price: null,
    description:
      'Italian style in glossy red — the Gist Veloce delivers lightweight in-mold construction, deep ventilation channels, and a comfortable micro-adjust retention system. A standout entry-level road helmet with a premium finish.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS liner',
      'Ventilation': 'Deep internal channelling',
      'Fit System': 'Rear micro-adjust dial',
      'Certification': 'CE EN1078',
      'Key Features':
        'Glossy red Italian finish | Lightweight in-mold build | Deep ventilation | Micro-adjust dial fit | CE EN1078',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Glossy Red',
    size: 'S-M (52–56 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — MET
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'MANTA MIPS Helmet (Glossy Red)',
    brand: 'MET',
    category: 'road-helmets',
    type: 'accessory',
    price: 16999,
    original_price: null,
    description:
      'An aerodynamic cycling helmet combining contemporary aesthetics with professional-grade safety features. The Manta MIPS design emphasises four key areas: safety, aerodynamics, fit, and style. Its lower, tube-shaped rear profile was developed through wind-tunnel testing to reduce drag, while the MIPS-C2® system redirects rotational energy during an impact to protect your brain.',
    images: [],
    specifications: {
      'Lumens': '—',
      'MIPS System': 'MIPS-C2®',
      'Vents': '15 with NACA Vent technology',
      'Fit System': 'Safe-T Orbital (360° adjustable)',
      'Magnetic Buckle': 'Fidlock®',
      'Shell': 'In-mold polycarbonate + EPS liner',
      'Certification': 'CE, AS/NZS, US',
      'Key Features':
        'MIPS-C2® brain protection | 15 NACA Vent channels | Fidlock® magnetic buckle | 360° Safe-T Orbital fit | Sunglasses storage ports | USB LED compatible',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Glossy Red',
    size: 'M (56–58 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'MANTA MIPS Helmet (Yellow/Grey)',
    brand: 'MET',
    category: 'road-helmets',
    type: 'accessory',
    price: 16999,
    original_price: null,
    description:
      'Stand out on the road in yellow and grey — the MET Manta MIPS combines wind-tunnel-tested aerodynamics with MIPS-C2® rotational brain protection, 15-vent NACA airflow technology, and the convenient Fidlock® magnetic buckle. Professional-grade performance for the ambitious road cyclist.',
    images: [],
    specifications: {
      'MIPS System': 'MIPS-C2®',
      'Vents': '15 with NACA Vent technology',
      'Fit System': 'Safe-T Orbital (360° adjustable)',
      'Magnetic Buckle': 'Fidlock®',
      'Shell': 'In-mold polycarbonate + EPS liner',
      'Certification': 'CE, AS/NZS, US',
      'Key Features':
        'MIPS-C2® protection | 15-vent NACA system | Fidlock® magnetic buckle | Aero tube-shape rear | 360° orbital fit | Yellow/Grey colourway',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Yellow / Grey',
    size: 'M (56–58 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Rivale MIPS Helmet (Glossy Red)',
    brand: 'MET',
    category: 'road-helmets',
    type: 'accessory',
    price: 10999,
    original_price: null,
    description:
      'The MET Rivale MIPS delivers superior performance and an aggressive presence on the road, designed for ambitious cyclists. It combines aerodynamic refinement, modern MIPS-C2® safety technology, and all-day comfort in an accessible package. A tube-shaped tail reduces air resistance while 18 internally engineered vents maintain constant cooling during intense efforts.',
    images: [],
    specifications: {
      'MIPS System': 'MIPS-C2®',
      'Vents': '18 with internal channelling',
      'Fit System': 'Safe-T Upsilon (360°)',
      'Shell': 'In-mold polycarbonate + EPS liner',
      'Weight': '270 g',
      'Certification': 'CE, AS/NZS, US',
      'Key Features':
        'MIPS-C2® rotational protection | 18-vent air channelling | Safe-T Upsilon fit | Tube-shaped aero tail | Sunglasses ports | Reflective rear decals',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Glossy Red',
    size: 'M (56–58 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'All Road MIPS Helmet (Blue)',
    brand: 'MET',
    category: 'road-helmets',
    type: 'accessory',
    price: 7699,
    original_price: null,
    description:
      'Where road meets gravel — the MET All Road MIPS is engineered for cyclists who refuse to be limited to a single surface. Its extended rear coverage, MIPS brain protection, and multi-directional ventilation system handle everything from smooth tarmac to rough gravel tracks with equal confidence.',
    images: [],
    specifications: {
      'MIPS System': 'MIPS-C2®',
      'Design': 'Extended coverage (road + gravel)',
      'Fit System': 'Safe-T Orbital',
      'Shell': 'In-mold polycarbonate + EPS liner',
      'Certification': 'CE EN1078',
      'Key Features':
        'Road-to-gravel versatility | MIPS-C2® protection | Extended rear coverage | Optimised ventilation | Safe-T Orbital fit | Blue colourway',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Blue',
    size: 'M (56–58 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'TRENTA MIPS Helmet (Black/Red)',
    brand: 'MET',
    category: 'road-helmets',
    type: 'accessory',
    price: 19499,
    original_price: null,
    description:
      'Race-proven at the Tour de France, the MET Trenta MIPS is the choice of champions. Its Kamm-tail inspired rear design, 19-vent NACA airflow system, and MIPS-C2® rotational protection make it one of the most technically advanced road helmets available. Lightweight, aerodynamic, and supremely comfortable — the Trenta sets the benchmark.',
    images: [],
    specifications: {
      'MIPS System': 'MIPS-C2®',
      'Vents': '19 with NACA-profile airflow',
      'Fit System': 'Safe-T Orbital (360°)',
      'Shell': 'In-mold polycarbonate + EPS liner',
      'Certification': 'CE, AS/NZS, US',
      'Key Features':
        'Tour de France-proven design | MIPS-C2® protection | 19-vent NACA airflow | Kamm-tail aero rear | Safe-T Orbital fit | Sunglasses docking',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Black / Red',
    size: 'M (56–58 cm)',
    tag: 'Pro Road Helmet',
    is_active: true,
  },
  {
    name: 'TRENTA 3K Carbon MIPS Helmet (Multicolour)',
    brand: 'MET',
    category: 'road-helmets',
    type: 'accessory',
    price: 26499,
    original_price: null,
    description:
      'The ultimate road helmet. The MET Trenta 3K Carbon MIPS integrates a 3K carbon fibre cage into the shell for exceptional rigidity and weight savings, delivering the same helmet trusted by Tour de France winners. Mips AIR® is woven into the padding itself for seamless protection. 19 vents, Kamm-tail aerodynamics, and a storage bag complete the premium package.',
    images: [],
    specifications: {
      'Carbon Frame': '3K carbon fibre cage',
      'MIPS System': 'MIPS AIR®',
      'Vents': '19 with internal air channelling',
      'Fit System': 'Safe-T Orbital (360°)',
      'Shell': 'In-mold polycarbonate + EPS + 3K carbon',
      'Certification': 'CE, AS/NZS, US',
      'Key Features':
        '3K Carbon fibre cage construction | MIPS AIR® in-padding protection | 19-vent Kamm-tail aero | Tour de France-proven | Safe-T Orbital fit | Includes helmet storage bag',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Multicolour Iridescent',
    size: 'S-M (52–56 cm)',
    tag: 'Premium',
    is_active: true,
  },
  {
    name: 'TRENTA MIPS Helmet (Matte Black)',
    brand: 'MET',
    category: 'road-helmets',
    type: 'accessory',
    price: 11999,
    original_price: null,
    tag: 'Open Box',
    description:
      'Open-box MET Trenta MIPS in matte black — same race-proven performance at a reduced price. MIPS-C2® protection, 19-vent NACA airflow, Kamm-tail aero rear, and the Safe-T Orbital fit. Inspected and confirmed in excellent condition.',
    images: [],
    specifications: {
      'MIPS System': 'MIPS-C2®',
      'Vents': '19 with NACA airflow',
      'Fit System': 'Safe-T Orbital (360°)',
      'Shell': 'In-mold polycarbonate + EPS liner',
      'Certification': 'CE, AS/NZS, US',
      'Key Features':
        'Open-box savings | MIPS-C2® brain protection | 19-vent NACA system | Kamm-tail aero rear | Safe-T Orbital fit | Matte Black finish',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Matte Black',
    size: 'L (58–62 cm)',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — KASK
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Protone Icon Helmet (Orange Matte)',
    brand: 'KASK',
    category: 'road-helmets',
    type: 'accessory',
    price: 23490,
    original_price: null,
    description:
      'The KASK Protone Icon is "the new synonym for victory." Wind-tunnel-developed, this helmet balances aerodynamics with ventilation at the highest level — used by WorldTour riders across the world\'s toughest races. MIT Technology provides comprehensive polystyrene protection, while 3D DRY multi-layer padding and a hypoallergenic chinstrap deliver all-day comfort.',
    images: [],
    specifications: {
      'Safety Technology': 'MIT (comprehensive polystyrene protection)',
      'Padding': '3D DRY multi-layer + Coolmax® removable lining',
      'Chinstrap': 'Hypoallergenic washable',
      'Shell': 'Wind-tunnel-tested aerodynamic polycarbonate',
      'Weight': '230 g',
      'Certification': 'CE EN1078',
      'Key Features':
        'WorldTour race-proven design | MIT Technology EPS protection | 3D DRY multi-layer padding | Coolmax® removable inner lining | Hypoallergenic washable chinstrap | 230 g lightweight',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Orange Matte',
    size: 'S (50–56 cm)',
    tag: 'Pro Road Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — SCOTT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'ARX Helmet (Sparkling Red)',
    brand: 'Scott',
    category: 'road-helmets',
    type: 'accessory',
    price: 6900,
    original_price: null,
    description:
      'The Scott ARX is a high-value road helmet designed for everyday training rides and entry-level racing. In-mold polycarbonate construction keeps weight down while the MRAS fit system adapts to a wide range of head shapes with one-handed ease. A reliable, well-ventilated helmet that earns its place on every ride.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS liner',
      'Fit System': 'MRAS (Micro-Ratchet Adjustment System)',
      'Ventilation': 'Multiple vent channels',
      'Certification': 'CE EN1078 / CPSC',
      'Key Features':
        'Lightweight in-mold construction | MRAS single-hand fit | Multi-vent airflow | Sparkling Red finish | Available in S & M | CE & CPSC certified',
    },
    stock_quantity: 9,
    stock_status: stockStatus(9),
    color: 'Sparkling Red',
    size: 'S (51–55 cm) / M (55–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Cadence Plus Helmet (Blue/Light Blue)',
    brand: 'Scott',
    category: 'road-helmets',
    type: 'accessory',
    price: 16200,
    original_price: null,
    description:
      'The Scott Cadence Plus brings performance ventilation and aerodynamic styling to mid-range road cycling. An enhanced vent configuration maximises airflow on demanding climbs while the MRAS SOLO fit system provides precise rear-head adjustment for hours of comfort on longer rides.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Fit System': 'MRAS SOLO (360° optimised)',
      'Ventilation': 'High-flow vent configuration',
      'Certification': 'CE EN1078',
      'Key Features':
        'Enhanced aerodynamic vent profile | MRAS SOLO fit system | Blue/Light Blue colourway | Medium fit (55–59 cm) | CE certified',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Blue / Light Blue',
    size: 'M (55–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Centric Plus Helmet (Prism Green/Radium Yellow)',
    brand: 'Scott',
    category: 'road-helmets',
    type: 'accessory',
    price: 15200,
    original_price: null,
    description:
      'High-visibility Prism Green and Radium Yellow colourway on the Scott Centric Plus — a performance road helmet with deep ventilation grooves, MRAS SOLO 360° fit, and in-mold construction. Designed to keep you safe, comfortable, and visible on every road.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Fit System': 'MRAS SOLO (360° optimised)',
      'Ventilation': 'Deep groove ventilation',
      'Certification': 'CE EN1078',
      'Key Features':
        'Hi-vis Prism Green/Radium Yellow finish | Deep ventilation grooves | MRAS SOLO 360° fit | Small fit (51–55 cm) | In-mold construction',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Prism Green / Radium Yellow',
    size: 'S (51–55 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — HJC
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Furion 2.0 Helmet (Navy Blue)',
    brand: 'HJC',
    category: 'road-helmets',
    type: 'accessory',
    price: 12499,
    original_price: null,
    description:
      'The HJC Furion 2.0 merges aerodynamic efficiency with superior ventilation, saving riders approximately 7% energy versus competing models at equivalent speeds. Drawing from HJC\'s MotoGP racing heritage, it features the SELFIT self-adjusting system, COOLPATH air circulation technology, and advanced IN-MOLD IBEX 2.0 construction — race-day performance at an accessible price.',
    images: [],
    specifications: {
      'Fit System': 'SELFIT (self-adjusting)',
      'Ventilation': 'COOLPATH air circulation',
      'Construction': 'IN-MOLD IBEX 2.0',
      'Weight': '~200 g',
      'Reinforcement': 'Internal skeletal structure',
      'Key Features':
        'SELFIT self-adjusting system | COOLPATH ventilation | IN-MOLD IBEX 2.0 construction | MotoGP heritage engineering | ~200 g ultra-light | Internal reinforcement structure',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Navy Blue',
    size: 'L (58–61 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Furion 3 Semi-Aero Helmet (Black)',
    brand: 'HJC',
    category: 'road-helmets',
    type: 'accessory',
    price: 14200,
    original_price: null,
    description:
      'HJC\'s latest semi-aero helmet — wind-tunnel developed and used at the highest level of professional cycling. The Furion 3 features SLID™ innovative impact protection, SELFIT PRO™ auto-adjusting fit, and COOLPATH ventilation that actively pulls hot air through dedicated rear exhaust vents. Antibacterial IONIC+ pads and an included carry bag complete the professional package.',
    images: [],
    specifications: {
      'Impact System': 'SLID™',
      'Fit System': 'SELFIT PRO™',
      'Ventilation': 'COOLPATH (front intake + rear exhaust)',
      'Padding': 'IONIC+ antibacterial',
      'Weight': '245 g (±10 g)',
      'Includes': 'Spare pads + carry bag',
      'Key Features':
        'SLID™ impact protection system | SELFIT PRO™ auto-adjust fit | COOLPATH front-to-rear airflow | IONIC+ antibacterial padding | 245 g | Carry bag included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Matte Black',
    size: 'M (55–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Furion 3 Semi-Aero Helmet (Dark Grey)',
    brand: 'HJC',
    category: 'road-helmets',
    type: 'accessory',
    price: 14200,
    original_price: null,
    description:
      'The HJC Furion 3 in dark grey — same race-level performance as the black edition. SLID™ protection, SELFIT PRO™ auto-fit, COOLPATH ventilation, and IONIC+ antibacterial pads. Proven at professional peloton speeds in a sophisticated low-profile colourway.',
    images: [],
    specifications: {
      'Impact System': 'SLID™',
      'Fit System': 'SELFIT PRO™',
      'Ventilation': 'COOLPATH (front + rear)',
      'Padding': 'IONIC+ antibacterial',
      'Weight': '245 g',
      'Key Features':
        'SLID™ impact technology | SELFIT PRO™ fit | COOLPATH airflow | Dark grey professional colourway | Carry bag included',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Dark Grey',
    size: 'M (55–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Bellus Helmet (Red/Black)',
    brand: 'HJC',
    category: 'road-helmets',
    type: 'accessory',
    price: 11400,
    original_price: null,
    description:
      'The HJC Bellus is a versatile performance road helmet with HJC\'s trusted in-mold construction, optimised ventilation channels, and a comfortable rear retention system. An excellent choice for club riders and sportive cyclists seeking reliable protection without compromising on style.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Ventilation': 'Optimised front-to-rear channels',
      'Fit System': 'SELFIT rear retention',
      'Certification': 'CE EN1078',
      'Key Features':
        'HJC in-mold construction | Optimised vent channels | SELFIT retention | Red/Black race colourway | CE EN1078 certified',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Red / Black',
    size: 'M (55–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — POC
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Omne Air Spin Helmet (Blue)',
    brand: 'POC',
    category: 'road-helmets',
    type: 'accessory',
    price: 21900,
    original_price: null,
    description:
      'The POC Omne Air Spin is built around the SPIN (Shearing Pad INside) rotational impact management system — a silicone-filled pad that absorbs and redirects rotational forces during an angled impact. 18 large ventilation openings create exceptional airflow, while the adjustable fit system and lightweight shell make it one of the most comfortable all-day road helmets available.',
    images: [],
    specifications: {
      'Rotational Protection': 'SPIN (Shearing Pad INside)',
      'Vents': '18 large ventilation openings',
      'Shell': 'PC + EPS in-mold construction',
      'Fit System': 'Adjustable rear retention',
      'Certification': 'CE EN1078 / CPSC',
      'Key Features':
        'SPIN rotational impact system | 18 large ventilation openings | Lightweight in-mold shell | POC race-proven design | CE & CPSC dual certified | Medium fit (54–59 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Blue',
    size: 'Medium (54–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Ventral Air MIPS Helmet (Red)',
    brand: 'POC',
    category: 'road-helmets',
    type: 'accessory',
    price: 22900,
    original_price: null,
    description:
      'Aerodynamics and ventilation — usually a compromise. The POC Ventral Air MIPS resolves this tension with a helmet that is simultaneously one of the most aerodynamic and one of the most ventilated available. MIPS brain protection, an optimised vent layout, and POC\'s distinctive design language make it the choice of riders who want everything.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS',
      'Design': 'Aero-optimised + ventilation-optimised',
      'Shell': 'PC in-mold + EPS',
      'Fit System': 'Reconfigurable retention system',
      'Certification': 'CE EN1078',
      'Key Features':
        'MIPS brain protection | Aero-optimised profile | High-flow ventilation | POC distinctive design | Reconfigurable fit system | Small (50–56 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Red',
    size: 'S (50–56 cm)',
    tag: 'Aero Road Helmet',
    is_active: true,
  },
  {
    name: 'Octal MIPS Helmet (Fluorescent Orange)',
    brand: 'POC',
    category: 'road-helmets',
    type: 'accessory',
    price: 17900,
    original_price: null,
    description:
      'Be seen. Be protected. The POC Octal MIPS in Fluorescent Orange delivers outstanding visibility alongside MIPS rotational impact protection and an open, lightweight design with extensive ventilation. A versatile road helmet for riders who prioritise both safety and presence on the road.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS',
      'Design': 'Open lightweight structure',
      'Ventilation': 'Extensive vent openings',
      'Shell': 'PC in-mold + EPS',
      'Certification': 'CE EN1078 / CPSC',
      'Key Features':
        'MIPS rotational protection | Fluorescent Orange high-visibility | Extensive ventilation openings | Lightweight open structure | Small (50–56 cm) | CE & CPSC certified',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Fluorescent Orange',
    size: 'S (50–56 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — LAZER
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Sphere Helmet (Black)',
    brand: 'Lazer',
    category: 'road-helmets',
    type: 'accessory',
    price: 12100,
    original_price: null,
    description:
      'The Lazer Sphere is built around the Advanced Rollsys® system — a thumbwheel that adjusts the helmet\'s fit around the entire head circumference simultaneously, eliminating pressure points with no compromise on security. 14 ventilation channels provide steady airflow, while the polycarbonate roll-cage and optional Aeroshell accessory adapt it to any riding condition.',
    images: [],
    specifications: {
      'Fit System': 'Advanced Rollsys® (full circumference)',
      'Vents': '14 with internal air channelling',
      'Shell': 'In-mold + polycarbonate bottom shell',
      'Roll-Cage': 'Polycarbonate internal cage',
      'Aeroshell': 'Optional weather cover compatible',
      'Weight': '250 g (S, CE)',
      'Certification': 'CE EN1078',
      'Key Features':
        'Rollsys® full-head fit adjustment | 14-vent airflow system | Polycarbonate roll-cage | Aeroshell compatible | Eyewear docking | Ponytail friendly | 250 g',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Black',
    size: 'M (55–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — TREK / BONTRAGER
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Ballista MIPS Road Helmet (Red/Black)',
    brand: 'Trek',
    category: 'road-helmets',
    type: 'accessory',
    price: 19699,
    original_price: null,
    description:
      'The Trek Ballista MIPS is the aerodynamic choice of Trek-Segafredo\'s WorldTour team — designed in collaboration with professional cyclists who demanded the fastest, most ventilated aero helmet available. WaveCel replacement in key impact zones, MIPS protection, and a precision Boa® dial fit make this the complete race helmet for serious road cyclists.',
    images: [],
    specifications: {
      'MIPS': 'Integrated MIPS brain protection',
      'Aerodynamics': 'Wind-tunnel-developed aero shell',
      'Fit System': 'Boa® dial with precise adjustment',
      'Shell': 'In-mold polycarbonate + EPS',
      'Certification': 'CE EN1078 / CPSC / AS/NZS',
      'Key Features':
        'Trek WorldTour race heritage | MIPS brain protection | Wind-tunnel aero shell | Boa® dial precision fit | Exceptional ventilation-to-aero ratio | S fit (51–57 cm)',
    },
    stock_quantity: 5,
    stock_status: stockStatus(5),
    color: 'Red / Black',
    size: 'S (51–57 cm)',
    tag: 'Pro Road Helmet',
    is_active: true,
  },
  {
    name: 'Ballista MIPS Road Helmet (White)',
    brand: 'Trek',
    category: 'road-helmets',
    type: 'accessory',
    price: 21699,
    original_price: null,
    description:
      'Clean white performance — the Trek Ballista MIPS White Edition offers the same WorldTour aerodynamics, MIPS brain protection, and Boa® dial precision fit as the red-black version, in a striking all-white finish. The helmet trusted by Trek-Segafredo professionals on the world\'s biggest stages.',
    images: [],
    specifications: {
      'MIPS': 'Integrated MIPS brain protection',
      'Aerodynamics': 'Wind-tunnel aero shell',
      'Fit System': 'Boa® dial',
      'Shell': 'In-mold polycarbonate + EPS',
      'Certification': 'CE EN1078 / CPSC / AS/NZS',
      'Key Features':
        'White WorldTour edition | MIPS protection | Wind-tunnel aero shell | Boa® dial fit | S fit (51–58 cm) | Trek-Segafredo race proven',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'White',
    size: 'S (51–58 cm)',
    tag: 'Pro Road Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — GIRO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Isode II Helmet (Multi-colour)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 5999,
    original_price: null,
    description:
      'The Giro Isode II is a lightweight road cycling helmet designed for everyday riders. It combines efficient ventilation with user-friendly adjustability, featuring a streamlined profile with excellent airflow and a secure Roc Loc® Sport fit system for road cycling, fitness riding, and commuting. Includes a Quick Link removable visor.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS foam liner',
      'Fit System': 'Roc Loc® Sport (7 cm range)',
      'Vents': '16 with deep internal channelling',
      'Visor': 'Quick Link removable',
      'Certification': 'US CPSC Bicycle standard',
      'Key Features':
        'Roc Loc® Sport fit system | 16-vent deep channelling | Quick Link removable visor | Lightweight in-mold build | Universal fit (54–61 cm) | Available: Light Blue, Red, HV Yellow, Light Grey',
    },
    stock_quantity: 4,
    stock_status: stockStatus(4),
    color: 'Light Blue / Red / HV Yellow / Light Grey',
    size: 'Universal (54–61 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Isode II MIPS Helmet (Matte White)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 6999,
    original_price: null,
    description:
      'The Giro Isode II MIPS adds Evolve Core rotational impact management to the popular Isode II platform. 16 deep internal ventilation channels, Roc Loc® Sport fit, and a removable visor — now with MIPS protection for added confidence on every ride.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Rotational Protection': 'MIPS Evolve Core',
      'Fit System': 'Roc Loc® Sport (7 cm)',
      'Vents': 'Large vents with deep internal channelling',
      'Visor': 'Quick Link removable',
      'Certification': 'US CPSC',
      'Key Features':
        'MIPS Evolve Core protection | Roc Loc® Sport 7 cm fit | Large deep-channel vents | Removable visor | Ponytail compatible | Universal fit',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Matte White',
    size: 'Universal (54–61 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Cielo MIPS Helmet (White)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 17999,
    original_price: null,
    description:
      'Designed for enthusiast road and gravel riders, the Giro Cielo MIPS combines a compact shape, MIPS Evolve Core rotational energy management, and 22 Wind Tunnel vents for optimal performance. The Roll Cage thermoformed EPS web structure reinforces the shell, and Ionic+® silver-infused padding provides permanent odour protection across every long ride.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS Evolve Core',
      'Vents': '22 Wind Tunnel with deep channelling',
      'Fit System': 'Roc Loc® 5 Air',
      'Reinforcement': 'Roll Cage thermoformed EPS web',
      'Padding': 'Ionic+® silver-infused (permanent odour protection)',
      'Weight': '300 g (CPSC) / 290 g (CE)',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'MIPS Evolve Core protection | 22-vent Wind Tunnel system | Roll Cage reinforcement | Ionic+® odour-proof padding | Roc Loc® 5 Air fit | 290–300 g',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'White',
    size: 'M (55–60 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Cielo MIPS Helmet (Black)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 17999,
    original_price: null,
    description:
      'The Giro Cielo MIPS in black — 22 Wind Tunnel vents, MIPS Evolve Core, Roll Cage EPS reinforcement, and Ionic+® antimicrobial padding in a sleek large fit. Engineered for riders who demand premium protection and ventilation performance across long training rides and sportives.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS Evolve Core',
      'Vents': '22 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5 Air',
      'Reinforcement': 'Roll Cage EPS web',
      'Padding': 'Ionic+®',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'MIPS Evolve Core | 22 Wind Tunnel vents | Roll Cage EPS structure | Ionic+® padding | Roc Loc® 5 Air | L fit (59–63 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Black',
    size: 'L (59–63 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Cielo MIPS Helmet (Matte White)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 19999,
    original_price: null,
    description:
      'Clean matte white finish on the Giro Cielo MIPS — the same 22-vent Wind Tunnel performance, MIPS Evolve Core protection, and Roll Cage reinforced shell. A timeless colourway for the rider who values both safety and understated style.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS Evolve Core',
      'Vents': '22 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5 Air',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'Matte White | MIPS Evolve Core | 22 Wind Tunnel vents | Roll Cage EPS | Roc Loc® 5 Air | S fit (51–55 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Matte White',
    size: 'S (51–55 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Cielo MIPS Helmet (Red/White)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 19999,
    original_price: null,
    description:
      'Red and white — the Giro Cielo MIPS in a bold colourway for riders who want to be noticed. 22 Wind Tunnel vents, MIPS Evolve Core protection, and Roll Cage reinforcement deliver a premium riding experience from your very first pedal stroke.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS Evolve Core',
      'Vents': '22 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5 Air',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'Red/White bold colourway | MIPS Evolve Core | 22 Wind Tunnel vents | Roll Cage EPS | S fit (51–55 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Red / White',
    size: 'S (51–55 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Aries Spherical MIPS Helmet (Red/Black)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 31999,
    original_price: null,
    description:
      'Giro\'s Spherical technology — two layers of EPS foam that work together like a ball-and-socket joint — represents the most advanced rotational impact management in helmet technology. The Aries Spherical MIPS is built around this system with 14 Wind Tunnel vents, Full Lower Hardbody™ coverage, and the precision Roc Loc® 5 Air fit. Designed for road cyclists who refuse to compromise on safety or performance.',
    images: [],
    specifications: {
      'Technology': 'Spherical Technology powered by MIPS (dual EPS ball-and-socket)',
      'Vents': '14 Wind Tunnel with deep channelling',
      'Fit System': 'Roc Loc® 5 Air',
      'Coverage': 'Full Lower Hardbody™',
      'Padding': 'Ionic+™ antimicrobial',
      'Weight': '~280 g',
      'Certification': 'US CPSC',
      'Key Features':
        'Spherical Technology MIPS | Dual-layer EPS ball-socket design | 14 Wind Tunnel vents | Full Lower Hardbody™ | Roc Loc® 5 Air fit | Ionic+™ padding',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Red / Black',
    size: 'M (55–59 cm)',
    tag: 'Premium',
    is_active: true,
  },
  {
    name: 'Aries Spherical MIPS Helmet (Matte White)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 31999,
    original_price: null,
    description:
      'The Giro Aries Spherical MIPS in matte white — Spherical Technology\'s dual-EPS ball-and-socket system, 14 Wind Tunnel vents, Full Lower Hardbody™ coverage, and Roc Loc® 5 Air fit in a clean, understated finish.',
    images: [],
    specifications: {
      'Technology': 'Spherical Technology powered by MIPS',
      'Vents': '14 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5 Air',
      'Coverage': 'Full Lower Hardbody™',
      'Certification': 'US CPSC',
      'Key Features':
        'Spherical Technology MIPS | Dual EPS layers | 14 Wind Tunnel vents | Full Hardbody™ coverage | Matte White finish | S fit (51–55 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Matte White',
    size: 'S (51–55 cm)',
    tag: 'Premium',
    is_active: true,
  },
  {
    name: 'Aether Spherical MIPS Helmet (Grey)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 27999,
    original_price: null,
    description:
      'The Giro Aether Spherical MIPS redefines what a road helmet can be — offering the protection of Spherical Technology alongside best-in-class ventilation. A refined grey colourway and the Roc Loc® 5 Air fit make it as comfortable as it is capable. For riders who understand that protection and performance are not mutually exclusive.',
    images: [],
    specifications: {
      'Technology': 'Spherical Technology powered by MIPS',
      'Vents': 'Wind Tunnel vents with deep channelling',
      'Fit System': 'Roc Loc® 5 Air',
      'Shell': 'Progressive Layering dual EPS',
      'Certification': 'US CPSC',
      'Key Features':
        'Spherical Technology MIPS | Progressive Layering dual EPS | Wind Tunnel ventilation | Roc Loc® 5 Air fit | Sophisticated Grey | M fit (55–59 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Grey',
    size: 'M (55–59 cm)',
    tag: 'Premium',
    is_active: true,
  },
  {
    name: 'Agilis Helmet (White)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 8999,
    original_price: null,
    description:
      'The Giro Agilis offers road-racing aesthetics and ventilation performance for everyday cyclists. 32 Wind Tunnel vents, full-wrap in-mold polycarbonate shell, and the Roc Loc® 5 fit system deliver a lightweight, comfortable experience from commute to club ride.',
    images: [],
    specifications: {
      'Construction': 'Full-wrap in-mold polycarbonate + EPS',
      'Vents': '32 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5',
      'Padding': 'CoolFit antimicrobial',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        '32 Wind Tunnel vents | Full-wrap in-mold shell | Roc Loc® 5 fit | CoolFit antimicrobial pads | Lightweight design | M fit (55–59 cm)',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'White',
    size: 'M (55–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Agilis MIPS Helmet (Grey/Pink)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 9999,
    original_price: null,
    description:
      'The Giro Agilis MIPS upgrades the popular Agilis with MIPS rotational impact protection. 32 Wind Tunnel vents, Roc Loc® 5 MIPS fit, full-wrap in-mold shell, and CoolFit antimicrobial padding — all the ventilation and comfort you need, with added confidence.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS',
      'Construction': 'Full-wrap in-mold polycarbonate + EPS',
      'Vents': '32 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5 MIPS',
      'Padding': 'CoolFit antimicrobial',
      'Weight': '300 g (CPSC) / 280 g (CE)',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'MIPS brain protection | 32 Wind Tunnel vents | Roc Loc® 5 MIPS fit | Full-wrap in-mold shell | Grey/Pink colourway | CoolFit pads',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Grey / Pink',
    size: 'M (55–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Agilis MIPS Helmet (Black/Red)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 9999,
    original_price: null,
    description:
      'Black and red race colourway on the Giro Agilis MIPS. 32 Wind Tunnel vents, Roc Loc® 5 MIPS, MIPS brain protection, and CoolFit padding — a well-rounded road helmet for club cycling, training, and daily riding.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS',
      'Vents': '32 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5 MIPS',
      'Padding': 'CoolFit antimicrobial',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'MIPS protection | 32 vents | Roc Loc® 5 MIPS | Full-wrap in-mold | Black/Red colourway | L fit (59–63 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Black / Red',
    size: 'L (59–63 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Agilis MIPS Helmet (Matte White)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 11999,
    original_price: null,
    description:
      'The Giro Agilis MIPS in matte white — a clean, versatile colourway on one of Giro\'s most popular road helmets. Extended coverage, 32 Wind Tunnel vents, Roc Loc® 5 MIPS fit, and MIPS protection make it the ideal daily driver for road and mixed-surface cycling.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS',
      'Vents': '32 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5 MIPS',
      'Padding': 'CoolFit antimicrobial',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'MIPS protection | 32 Wind Tunnel vents | Extended coverage | Roc Loc® 5 MIPS | Matte White | S fit (51–55 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Matte White',
    size: 'S (51–55 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Agilis Women\'s Helmet (White)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 6699,
    original_price: null,
    description:
      'The Giro Agilis Women is specifically designed for female riders — a ponytail-friendly retention system, women\'s-specific padding, and a lightweight road profile. 32 Wind Tunnel vents keep you cool and the Roc Loc® 5 fit ensures a secure, comfortable ride every time.',
    images: [],
    specifications: {
      'Design': 'Women\'s specific',
      'Construction': 'In-mold polycarbonate + EPS',
      'Vents': '32 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5 (ponytail compatible)',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'Women\'s-specific design | Ponytail-compatible retention | 32 Wind Tunnel vents | Lightweight road profile | White | Available M & S',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'White',
    size: 'S (51–55 cm) / M (55–59 cm)',
    tag: 'Women\'s Road Helmet',
    is_active: true,
  },
  {
    name: 'Eclipse Spherical MIPS Helmet (Black/Red)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 29999,
    original_price: null,
    description:
      'The Giro Eclipse Spherical MIPS is "the fastest road helmet" Giro has ever made — tested to beat every competing aero helmet by significant margins. Spherical Technology powered by MIPS, 14 Wind Tunnel vents with deep internal channelling, Full Lower Hardbody™ coverage, and Nanobead™ EPS foam construction set a new benchmark for aero-road helmet performance.',
    images: [],
    specifications: {
      'Technology': 'Spherical Technology powered by MIPS',
      'Aerodynamics': 'Tested fastest road helmet by Giro',
      'Vents': '14 Wind Tunnel with deep channelling',
      'Shell': 'In-mold + Full Lower Hardbody™ + Nanobead™ EPS',
      'Fit System': 'Roc Loc® 5 Air with vertical tuning',
      'Weight': '270 g',
      'Certification': 'US CPSC',
      'Key Features':
        'Spherical Technology MIPS | World\'s fastest Giro road helmet | 14 Wind Tunnel vents | Nanobead™ EPS | Full Lower Hardbody™ | Roc Loc® 5 Air | 270 g',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Black / Red',
    size: 'M (55–59 cm) / L (59–63 cm)',
    tag: 'Premium Aero',
    is_active: true,
  },
  {
    name: 'Eclipse Spherical MIPS Helmet (Plastic Black)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 29999,
    original_price: null,
    description:
      'Stealth all-black — the Giro Eclipse Spherical MIPS in Plastic Black. The same record-breaking aerodynamics, Spherical Technology MIPS, 14 Wind Tunnel vents, and Full Lower Hardbody™ construction. The helmet for riders who want to be fastest without standing out.',
    images: [],
    specifications: {
      'Technology': 'Spherical Technology MIPS',
      'Vents': '14 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5 Air',
      'Shell': 'Full Lower Hardbody™ + Nanobead™ EPS',
      'Weight': '270 g',
      'Key Features':
        'Stealth Plastic Black finish | Spherical MIPS | Fastest Giro road helmet | 14 Wind Tunnel vents | Full Hardbody™ | M fit (55–59 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Plastic Black',
    size: 'M (55–59 cm)',
    tag: 'Premium Aero',
    is_active: true,
  },
  {
    name: 'Syntax MIPS Helmet (Black/Pink)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 11999,
    original_price: null,
    description:
      'The Giro Syntax MIPS merges European design with extended coverage for road, endurance, and gravel riding. Integrated MIPS® technology, 25 Wind Tunnel™ vents, Roc Loc® 5 Air MIPS fit, and CoolFit™ antimicrobial padding deliver a comfortable, safe, well-ventilated helmet for every ride.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS®',
      'Construction': 'In-mold + four-piece polycarbonate Hardbody™',
      'Vents': '25 Wind Tunnel™ vents',
      'Fit System': 'Roc Loc® 5 Air MIPS®',
      'Padding': 'CoolFit™ antimicrobial',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'MIPS® protection | 25 Wind Tunnel™ vents | Roc Loc® 5 Air MIPS | CoolFit™ pads | Four-piece Hardbody | Black/Pink | M fit',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Black / Pink',
    size: 'M (55–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Syntax MIPS Helmet (Silver)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 10999,
    original_price: null,
    description:
      'The Giro Syntax MIPS in silver — 25 Wind Tunnel™ vents, MIPS® rotational protection, Roc Loc® 5 Air MIPS fit, and CoolFit™ antimicrobial padding. The versatile, multi-surface road helmet in a timeless metallic finish.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS®',
      'Vents': '25 Wind Tunnel™ vents',
      'Fit System': 'Roc Loc® 5 Air MIPS',
      'Padding': 'CoolFit™ antimicrobial',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'MIPS® protection | 25 Wind Tunnel™ vents | Silver metallic finish | Roc Loc® 5 Air | CoolFit™ pads | L fit (59–63 cm)',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'Silver',
    size: 'L (59–63 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Syntax MIPS Helmet (Black/Red)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 10999,
    original_price: null,
    description:
      'Classic black and red on the Giro Syntax MIPS — extended coverage, 25 Wind Tunnel™ vents, MIPS® protection, and Roc Loc® 5 Air MIPS fit for road cyclists who want trusted, versatile performance on any surface.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS®',
      'Vents': '25 Wind Tunnel™ vents',
      'Fit System': 'Roc Loc® 5 Air MIPS',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'MIPS® protection | 25 Wind Tunnel™ vents | Black/Red colourway | Roc Loc® 5 Air | Extended coverage | L fit (59–63 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Black / Red',
    size: 'L (59–63 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Syntax MIPS Helmet (Matte Cream)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 14999,
    original_price: null,
    description:
      'The premium Giro Syntax MIPS in matte cream — HardShell In-Mold Hardbody™ lower wrap construction, integrated MIPS® protection, Roc Loc® 5 Air MIPS fit, and Wind Tunnel™ ventilation. For riders who demand both safety and understated elegance.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS®',
      'Construction': 'HardShell + In-Mold Hardbody™ lower wrap',
      'Fit System': 'Roc Loc® 5 Air MIPS',
      'Ventilation': 'Wind Tunnel™ system',
      'Padding': 'IONIC+® antimicrobial',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'HardShell Hardbody™ construction | MIPS® protection | Roc Loc® 5 Air MIPS | Wind Tunnel™ ventilation | IONIC+® pads | Matte Cream | S fit',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Matte Cream',
    size: 'S (51–55 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Cinder MIPS Helmet (Green)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 14999,
    original_price: null,
    tag: 'Open Box',
    description:
      'Open-box Giro Cinder MIPS in green — inspected and in excellent condition. The Cinder MIPS features MIPS® brain protection, Wind Tunnel™ ventilation, Roc Loc® 5 fit, and CoolFit™ pads. A proven road helmet at a reduced open-box price.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS®',
      'Vents': 'Wind Tunnel™',
      'Fit System': 'Roc Loc® 5',
      'Padding': 'CoolFit™ antimicrobial',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'Open-box value | MIPS® protection | Wind Tunnel™ vents | Roc Loc® 5 fit | Green colourway | L fit',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Green',
    size: 'L',
    is_active: true,
  },
  {
    name: 'Aeon Helmet (Green)',
    brand: 'Giro',
    category: 'road-helmets',
    type: 'accessory',
    price: 17999,
    original_price: null,
    tag: 'Open Box',
    description:
      'Open-box Giro Aeon in green — the Aeon is Giro\'s benchmark ventilated road helmet, featuring 26 Wind Tunnel vents, Roc Loc® 5 fit, and a lightweight in-mold construction. Inspected and confirmed in excellent condition.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Vents': '26 Wind Tunnel vents',
      'Fit System': 'Roc Loc® 5',
      'Certification': 'CE EN1078 / CPSC',
      'Key Features':
        'Open-box value | 26 Wind Tunnel vents | Roc Loc® 5 | Lightweight in-mold | Green | M fit (55–59 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Green',
    size: 'M (55–59 cm)',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — GIST SONAR (open box)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Sonar Helmet (Red)',
    brand: 'Gist',
    category: 'road-helmets',
    type: 'accessory',
    price: 6999,
    original_price: null,
    tag: 'Open Box',
    description:
      'Open-box Gist Sonar in red — Italian design, 25 Wind Tunnel vents, Quick Lock fit system, in-mold construction, and integrated anti-insect net. Inspected and in excellent condition.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Vents': '25 Wind Tunnel vents',
      'Fit System': 'Quick Lock',
      'Net': 'Integrated anti-insect net',
      'Weight': '245 g',
      'Key Features':
        'Open-box value | 25 Wind Tunnel vents | Quick Lock fit | Anti-insect net | Glossy Red | S/M fit (54–59 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Glossy Red',
    size: 'S/M (55–59 cm)',
    is_active: true,
  },
  {
    name: 'Sonar Helmet (Green)',
    brand: 'Gist',
    category: 'road-helmets',
    type: 'accessory',
    price: 6999,
    original_price: null,
    tag: 'Open Box',
    description:
      'Open-box Gist Sonar in green — same Italian quality with 25 Wind Tunnel vents, Quick Lock retention, and anti-insect net. Inspected and in excellent condition. L/XL fit.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Vents': '25 Wind Tunnel vents',
      'Fit System': 'Quick Lock',
      'Net': 'Integrated anti-insect net',
      'Key Features':
        'Open-box value | 25 Wind Tunnel vents | Quick Lock fit | Anti-insect net | Green | L/XL (58–63 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Green',
    size: 'L/XL (58–63 cm)',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROAD HELMETS — BELL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Draft Helmet (Yellow)',
    brand: 'Bell',
    category: 'road-helmets',
    type: 'accessory',
    price: 3299,
    original_price: null,
    description:
      'The Bell Draft is the ideal entry point into helmet performance cycling. Hi-viz yellow finish, in-mold polycarbonate construction, Flow Fusion ventilation system, and a tool-free fit adjustment make it a no-nonsense choice for commuters and weekend riders who prioritise value without sacrificing safety.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Ventilation': 'Flow Fusion™',
      'Fit System': 'Float Fit™ dial',
      'Certification': 'CE EN1078 / CPSC',
      'Key Features':
        'Hi-viz Yellow finish | Flow Fusion™ ventilation | Float Fit™ dial | In-mold construction | CE & CPSC certified | ML fit (54–64 cm) | 5 units in stock',
    },
    stock_quantity: 5,
    stock_status: stockStatus(5),
    color: 'Hi-Viz Yellow',
    size: 'ML (54–64 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'XR Spherical MIPS Helmet (Green)',
    brand: 'Bell',
    category: 'road-helmets',
    type: 'accessory',
    price: 18999,
    original_price: null,
    description:
      'The Bell XR Spherical MIPS is engineered for road cyclists who want the most advanced protection available at this price point. Spherical technology powered by MIPS delivers a ball-and-socket rotational protection system, combined with a fully vented aero shell and Float Fit™ dial for a precision road-race fit.',
    images: [],
    specifications: {
      'Technology': 'Spherical Technology powered by MIPS',
      'Aerodynamics': 'Fully vented aero shell',
      'Fit System': 'Float Fit™ dial',
      'Shell': 'In-mold polycarbonate + dual EPS',
      'Certification': 'CE EN1078 / CPSC',
      'Key Features':
        'Spherical MIPS dual-layer EPS | Fully vented aero shell | Float Fit™ dial | Green colourway | M fit (55–59 cm) | CE & CPSC certified',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Green',
    size: 'M (55–59 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'XR Spherical MIPS Helmet (Green Camo)',
    brand: 'Bell',
    category: 'road-helmets',
    type: 'accessory',
    price: 18999,
    original_price: null,
    description:
      'Green Camo limited edition — the Bell XR Spherical MIPS with Spherical Technology powered by MIPS, a fully vented aero shell, and Float Fit™ dial. Make a statement on the road while benefitting from the most advanced rotational protection Bell offers.',
    images: [],
    specifications: {
      'Technology': 'Spherical Technology powered by MIPS',
      'Fit System': 'Float Fit™ dial',
      'Shell': 'In-mold + dual EPS',
      'Certification': 'CE EN1078 / CPSC',
      'Key Features':
        'Spherical MIPS | Green Camo limited edition | Vented aero shell | Float Fit™ | L fit (58–62 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Green Camo',
    size: 'L (58–62 cm)',
    tag: 'Road Helmet',
    is_active: true,
  },
  {
    name: 'Crest Road Helmet (Neon Green)',
    brand: 'Bell',
    category: 'road-helmets',
    type: 'accessory',
    price: 3799,
    original_price: null,
    description:
      'The Bell Crest is a versatile half-shell helmet equally at home on road or MTB trails. Fusion In-Mold Micro Shell construction, wide ventilation openings, cam-lock strap levers, and a one-handed Ergo-Dial fit system — everything you need for safe, comfortable riding at great value.',
    images: [],
    specifications: {
      'Construction': 'Fusion In-Mold Micro Shell + EPS',
      'Ventilation': 'Wide ventilation openings',
      'Fit System': 'Ergo-Dial (one-handed)',
      'Strap System': 'Cam-lock levers',
      'Weight': '273 g',
      'Certification': 'CE EN1078 / CPSC',
      'Key Features':
        'Fusion In-Mold Micro Shell | Wide ventilation | One-hand Ergo-Dial fit | Cam-lock strap levers | 273 g | ML fit (54–61 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Neon Green',
    size: 'ML (54–61 cm)',
    tag: 'Road/MTB Helmet',
    is_active: true,
  },
  {
    name: 'Crest Road Helmet (White)',
    brand: 'Bell',
    category: 'road-helmets',
    type: 'accessory',
    price: 3799,
    original_price: null,
    description:
      'Clean white Bell Crest — Fusion In-Mold Micro Shell, wide ventilation openings, Ergo-Dial one-handed fit, and cam-lock strap levers. A versatile road and MTB helmet at excellent value.',
    images: [],
    specifications: {
      'Construction': 'Fusion In-Mold Micro Shell + EPS',
      'Ventilation': 'Wide ventilation openings',
      'Fit System': 'Ergo-Dial (one-handed)',
      'Weight': '273 g',
      'Certification': 'CE EN1078 / CPSC',
      'Key Features':
        'Fusion In-Mold Micro Shell | Wide ventilation | Ergo-Dial fit | White colourway | 273 g | ML fit (54–63 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'White',
    size: 'ML (54–63 cm)',
    tag: 'Road/MTB Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AERO HELMETS — GIRO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Aerohead MIPS Helmet (White/Silver)',
    brand: 'Giro',
    category: 'aero-helmets',
    type: 'accessory',
    price: 29999,
    original_price: null,
    description:
      'The Giro Aerohead MIPS is built to break time. Its smooth, extended teardrop shape is optimised for maximum aerodynamic advantage across a wide range of head angles, while integrated MIPS® protection ensures your brain stays safe at race speed. The Roc Loc® Air fit system, 9 elongated vents, and Thermoform Shield deliver the complete race-day package for triathlon and time-trial specialists.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS®',
      'Aerodynamics': 'Teardrop aero shell (optimised across head angles)',
      'Vents': '9 elongated vents + rear air channel',
      'Fit System': 'Roc Loc® Air TT',
      'Shield': 'Magnetic Thermoform visor',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'Teardrop aero race shell | MIPS® protection | 9 elongated vents | Roc Loc® Air TT fit | Magnetic Thermoform visor | Triathlon & TT optimised | White/Silver',
    },
    stock_quantity: 2,
    stock_status: stockStatus(2),
    color: 'White / Silver',
    size: 'M',
    tag: 'TT / Triathlon',
    is_active: true,
  },
  {
    name: 'Aerohead MIPS Helmet (Black)',
    brand: 'Giro',
    category: 'aero-helmets',
    type: 'accessory',
    price: 29999,
    original_price: null,
    description:
      'Stealth black Giro Aerohead MIPS — teardrop aero shell, MIPS® protection, magnetic Thermoform visor, 9 elongated vents, and Roc Loc® Air TT fit. The complete package for time-triallists and triathletes who demand the fastest legal helmet available.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS®',
      'Aerodynamics': 'Teardrop aero shell',
      'Vents': '9 elongated vents',
      'Fit System': 'Roc Loc® Air TT',
      'Shield': 'Magnetic Thermoform visor',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'Stealth Black | Teardrop aero shell | MIPS® | 9 elongated vents | Roc Loc® Air TT | Magnetic Thermoform visor',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Black',
    size: 'M',
    tag: 'TT / Triathlon',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MTB HELMETS — MET
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Roam MIPS Helmet (Black/Red)',
    brand: 'MET',
    category: 'mtb-helmets',
    type: 'accessory',
    price: 10999,
    original_price: null,
    description:
      'The MET Roam MIPS is designed for trail and cross-country riders who need extended rear-head coverage, MIPS-C2® rotational protection, and excellent ventilation across all riding conditions. Its clean, modern aesthetic works equally well on singletrack and road commutes.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS-C2®',
      'Coverage': 'Extended rear (trail-specific)',
      'Fit System': 'Safe-T Orbital',
      'Shell': 'In-mold polycarbonate + EPS',
      'Certification': 'CE EN1078',
      'Key Features':
        'MIPS-C2® protection | Extended rear trail coverage | Safe-T Orbital fit | Multi-vent airflow | Black/Red | L fit (58–62 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Black / Red',
    size: 'L (58–62 cm)',
    tag: 'MTB Helmet',
    is_active: true,
  },
  {
    name: 'Roam Helmet (Grey)',
    brand: 'MET',
    category: 'mtb-helmets',
    type: 'accessory',
    price: 7299,
    original_price: null,
    description:
      'The MET Roam in grey — a capable trail helmet with extended rear coverage, Safe-T Orbital fit, and efficient ventilation for cross-country and trail riding. No-frills, dependable protection for every ride.',
    images: [],
    specifications: {
      'Coverage': 'Extended rear trail-specific',
      'Fit System': 'Safe-T Orbital',
      'Shell': 'In-mold polycarbonate + EPS',
      'Certification': 'CE EN1078',
      'Key Features':
        'Extended rear coverage | Safe-T Orbital fit | Efficient trail ventilation | Grey | S-M fit (52–56 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Grey',
    size: 'S-M (52–56 cm)',
    tag: 'MTB Helmet',
    is_active: true,
  },
  {
    name: 'Terranova MIPS Helmet (Neon Yellow)',
    brand: 'MET',
    category: 'mtb-helmets',
    type: 'accessory',
    price: 7799,
    original_price: null,
    description:
      'Neon yellow visibility and MIPS-C2® protection — the MET Terranova MIPS is built for riders who hit trails and need extended coverage, enhanced ventilation, and rotational impact management. The Safe-T Orbital fit wraps around the back of your head for a secure, pressure-free hold.',
    images: [],
    specifications: {
      'Rotational Protection': 'MIPS-C2®',
      'Coverage': 'Extended rear and sides',
      'Fit System': 'Safe-T Orbital',
      'Shell': 'In-mold polycarbonate + EPS',
      'Certification': 'CE EN1078',
      'Key Features':
        'MIPS-C2® protection | Extended trail coverage | Safe-T Orbital fit | Neon Yellow visibility | S-M fit (52–56 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Neon Yellow',
    size: 'S-M (52–56 cm)',
    tag: 'MTB Helmet',
    is_active: true,
  },
  {
    name: 'Terranova Helmet (Blue)',
    brand: 'MET',
    category: 'mtb-helmets',
    type: 'accessory',
    price: 5799,
    original_price: null,
    description:
      'An accessible trail helmet from MET — the Terranova combines extended rear coverage, in-mold polycarbonate construction, and the Safe-T Orbital fit system in a clean blue finish. A dependable, lightweight choice for entry-level trail and MTB riders.',
    images: [],
    specifications: {
      'Coverage': 'Extended rear and sides',
      'Construction': 'In-mold polycarbonate + EPS',
      'Fit System': 'Safe-T Orbital',
      'Certification': 'CE EN1078',
      'Key Features':
        'Extended trail coverage | Safe-T Orbital fit | Lightweight in-mold construction | Blue | L fit (58–62 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Blue',
    size: 'L (58–62 cm)',
    tag: 'MTB Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MTB HELMETS — SCOTT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Supra Road Helmet (Black/Green)',
    brand: 'Scott',
    category: 'mtb-helmets',
    type: 'accessory',
    price: 3990,
    original_price: null,
    description:
      'The Scott Supra Road is a lightweight in-mold entry-level helmet with the fully customisable MRAS SOLO Fit system, integrated bug net, reflective safety decal, and polycarbonate Micro Shell. Versatile coverage for road, MTB, and all-round cycling use.',
    images: [],
    specifications: {
      'Construction': 'Polycarbonate Micro Shell + In-Mold',
      'Fit System': 'MRAS SOLO (360° + rear height adj.)',
      'Features': 'Bug Net + Reflective Safety Decal',
      'Weight': '~260 g',
      'Certification': 'CE EN1078',
      'Key Features':
        'MRAS SOLO 360° fit | Polycarbonate Micro Shell | Bug Net | Reflective decal | Universal fit | Black/Green',
    },
    stock_quantity: 5,
    stock_status: stockStatus(5),
    color: 'Black / Green',
    size: 'Universal Adult',
    tag: 'MTB Helmet',
    is_active: true,
  },
  {
    name: 'Supra Road Helmet (Silver)',
    brand: 'Scott',
    category: 'mtb-helmets',
    type: 'accessory',
    price: 3990,
    original_price: null,
    description:
      'Silver Scott Supra — lightweight in-mold construction, MRAS SOLO 360° fit, bug net, and reflective safety decal. An all-round helmet for road and MTB riders at exceptional value.',
    images: [],
    specifications: {
      'Construction': 'Polycarbonate Micro Shell + In-Mold',
      'Fit System': 'MRAS SOLO (360°)',
      'Features': 'Bug Net + Reflective Decal',
      'Certification': 'CE EN1078',
      'Key Features':
        'Silver | MRAS SOLO 360° fit | Bug Net | Reflective decal | In-mold construction | Universal',
    },
    stock_quantity: 5,
    stock_status: stockStatus(5),
    color: 'Silver',
    size: 'Universal Adult',
    tag: 'MTB Helmet',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KIDS & YOUTH HELMETS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Scamp II Helmet (Rainbow)',
    brand: 'Giro',
    category: 'kids-helmets',
    type: 'accessory',
    price: 4499,
    original_price: null,
    description:
      'The Giro Scamp II makes young riders excited to put a helmet on. Bright rainbow graphics, a lightweight design, and the Super Fit™ system that adapts to fit a range of head sizes — the Scamp II is one of the most popular youth cycling helmets for a reason.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Fit System': 'Super Fit™ (adjustable)',
      'Ventilation': 'Multiple vents with channelling',
      'Age Group': 'Youth',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'Rainbow youth design | Super Fit™ system | Lightweight in-mold | Multiple ventilation vents | CPSC + CE certified | S fit (49–53 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Rainbow',
    size: 'S (49–53 cm)',
    tag: 'Kids Helmet',
    is_active: true,
  },
  {
    name: 'Register II Helmet (Green RSH)',
    brand: 'Giro',
    category: 'kids-helmets',
    type: 'accessory',
    price: 5499,
    original_price: null,
    description:
      'The Giro Register II is designed to get kids and teens on their bike confidently. Durable in-mold construction, Roc Loc® Youth fit with 5 cm adjustment, 25 vents, and removable visor make it the go-to youth helmet for parents who don\'t compromise on safety.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Fit System': 'Roc Loc® Youth (5 cm adjustment)',
      'Vents': '25 vents with internal channelling',
      'Visor': 'Removable',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'Youth-specific Roc Loc® fit | 25 ventilation vents | Removable visor | In-mold lightweight construction | Green RSH | UY fit (52–57 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Green RSH',
    size: 'UY (52–57 cm)',
    tag: 'Youth Helmet',
    is_active: true,
  },
  {
    name: 'Register II Helmet (Orange)',
    brand: 'Giro',
    category: 'kids-helmets',
    type: 'accessory',
    price: 5499,
    original_price: null,
    description:
      'Bright orange Giro Register II — the same trusted youth helmet with Roc Loc® Youth fit, 25 vents, removable visor, and in-mold construction. Excellent visibility and dependable protection for young riders.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Fit System': 'Roc Loc® Youth',
      'Vents': '25 vents',
      'Visor': 'Removable',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'Orange high-visibility | Youth Roc Loc® | 25 vents | Removable visor | UY fit (52–57 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Orange',
    size: 'UY (52–57 cm)',
    tag: 'Youth Helmet',
    is_active: true,
  },
  {
    name: 'Register II Helmet (Purple Blue)',
    brand: 'Giro',
    category: 'kids-helmets',
    type: 'accessory',
    price: 5499,
    original_price: null,
    description:
      'Purple and blue Giro Register II — youth-specific Roc Loc® fit, 25 vents, removable visor, and lightweight in-mold construction. The helmet that grows with young riders and keeps them safe on every adventure.',
    images: [],
    specifications: {
      'Construction': 'In-mold polycarbonate + EPS',
      'Fit System': 'Roc Loc® Youth',
      'Vents': '25 vents',
      'Visor': 'Removable',
      'Certification': 'US CPSC + CE EN1078',
      'Key Features':
        'Purple Blue | Youth Roc Loc® | 25 vents | Removable visor | Lightweight in-mold | UY fit (52–57 cm)',
    },
    stock_quantity: 1,
    stock_status: stockStatus(1),
    color: 'Purple Blue',
    size: 'UY (52–57 cm)',
    tag: 'Youth Helmet',
    is_active: true,
  },
  {
    name: 'Compact AF CE Helmet (Blue)',
    brand: 'Lazer',
    category: 'kids-helmets',
    type: 'accessory',
    price: 3100,
    original_price: null,
    description:
      'The Lazer Compact AF CE is a well-priced, versatile helmet designed for urban riding, cycling school, and family adventures. Its rear retention system, CE-certified polycarbonate shell, and multiple ventilation openings provide reliable protection for all ages in a compact, easy-to-wear design.',
    images: [],
    specifications: {
      'Construction': 'Polycarbonate shell + EPS liner',
      'Fit System': 'Rear retention dial',
      'Ventilation': 'Multiple ventilation openings',
      'Certification': 'CE EN1078',
      'Key Features':
        'CE EN1078 certified | Rear retention dial | Multi-vent design | Compact easy-wear fit | Blue | Universal Adult/Youth',
    },
    stock_quantity: 4,
    stock_status: stockStatus(4),
    color: 'Blue',
    size: 'Universal',
    tag: 'Commuter / Kids Helmet',
    is_active: true,
  },
];

// ---------------------------------------------------------------------------
// INSERT INTO SUPABASE
// ---------------------------------------------------------------------------

async function seed() {
  console.log(`\n🪖  Pro Riders Hub — Helmet Seed Script`);
  console.log(`📦  Preparing ${products.length} helmet products for upload...\n`);

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
      `\n  → Browse at /accessories (filter by "road-helmets", "mtb-helmets", etc.)`,
      `\n  → Add product images via /admin/dashboard → Products tab.\n`,
    );
  }
}

seed().catch(console.error);
