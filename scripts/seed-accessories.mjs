/**
 * Seed script: uploads all accessory inventory to Supabase db_products.
 * Data source: inventory spreadsheet (lights, pumps, bells, tools, mounts, etc.)
 *
 * Usage:  node scripts/seed-accessories.mjs
 *
 * NOTE: If inserts fail with 401/403, the db_products RLS policy requires
 * authentication. Either disable RLS temporarily in Supabase SQL Editor
 * (ALTER TABLE db_products DISABLE ROW LEVEL SECURITY;), then re-enable after,
 * or replace SUPABASE_ANON_KEY below with your service_role key.
 */

const SUPABASE_URL = 'https://yeejxvxyabrmnpdnziek.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZWp4dnh5YWJybW5wZG56aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDcwNjcsImV4cCI6MjA5Nzc4MzA2N30.3GdoadfMVfDVpa3YQkYRd6zAxbdBoY1BnEk-ejFQOeM';

/** Derive stock_status from quantity */
function stockStatus(qty) {
  if (!qty || qty === 0) return 'Out of Stock';
  if (qty <= 3) return 'Limited Stock';
  return 'In Stock';
}

// ---------------------------------------------------------------------------
// PRODUCT DATA  (sourced from inventory spreadsheet, descriptions & specs
// written in the style of Trek / Cannondale product pages)
// ---------------------------------------------------------------------------

const products = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FRONT LIGHTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Dayblazer 400 Front Light',
    brand: 'Blackburn',
    category: 'lights',
    type: 'accessory',
    price: 2999,
    original_price: null,
    description:
      'The Blackburn Dayblazer 400 delivers 400 lumens of powerful illumination for road and trail riding. Its patented DayLightning flash pattern ensures stand-out visibility in daylight, while the steady mode provides a focused beam after dark. Micro-USB rechargeable and splash-proof, it mounts tool-free to handlebars in seconds.',
    images: [],
    specifications: {
      Lumens: '400',
      Modes: 'Steady / Flash / DayLightning',
      'Run Time': '1.5 hrs (high) / 20 hrs (flash)',
      Battery: 'Micro-USB rechargeable',
      'Water Resistance': 'IPX4 (splash-proof)',
      Mount: 'Tool-free handlebar mount (22–35 mm)',
      'Key Features':
        'DayLightning flash pattern for daytime visibility | 400 lm max output | Micro-USB rechargeable | IPX4 splash-proof | Tool-free handlebar mount',
    },
    stock_quantity: 11,
    stock_status: 'In Stock',
    color: 'Black',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'Dayblazer 800 Front Light',
    brand: 'Blackburn',
    category: 'lights',
    type: 'accessory',
    price: 4999,
    original_price: null,
    description:
      "Step up your visibility with 800 lumens of raw, concentrated output. The Dayblazer 800 adds Blackburn's DayLightning mode for stand-out daytime presence alongside extended burn times to get you home safely after the longest evening rides. A side-visibility window keeps peripheral hazards in check.",
    images: [],
    specifications: {
      Lumens: '800',
      Modes: 'Steady / Flash / DayLightning',
      'Run Time': '1 hr (high) / 15 hrs (flash)',
      Battery: 'Micro-USB rechargeable',
      'Water Resistance': 'IPX4 (splash-proof)',
      Mount: 'Tool-free handlebar mount (22–35 mm)',
      'Key Features':
        '800 lm max output | DayLightning daytime flash mode | Side-visibility windows | Micro-USB rechargeable | Tool-free mount',
    },
    stock_quantity: 9,
    stock_status: 'In Stock',
    color: 'Black',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'Dayblazer 1100 Front Light',
    brand: 'Blackburn',
    category: 'lights',
    type: 'accessory',
    price: 7199,
    original_price: null,
    description:
      'When the trail goes dark, the Dayblazer 1100 lights the way with 1,100 lumens of powerful, precisely focused output. Multiple brightness levels and a high-efficiency LED sustain consistent illumination across extended rides, while the compact body adds virtually no weight penalty to your build.',
    images: [],
    specifications: {
      Lumens: '1100',
      Modes: 'High / Medium / Low / Flash / DayLightning',
      'Run Time': '1 hr (high) / 12 hrs (flash)',
      Battery: 'Micro-USB rechargeable',
      'Water Resistance': 'IPX4 (splash-proof)',
      Mount: 'Tool-free handlebar mount (22–35 mm)',
      'Key Features':
        '1100 lm peak output | 5 output modes | DayLightning daytime mode | Compact, lightweight body | Micro-USB rechargeable',
    },
    stock_quantity: 4,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'K450 Front Light',
    brand: 'Ravemen',
    category: 'lights',
    type: 'accessory',
    price: 3190,
    original_price: null,
    description:
      "Ravemen's K450 pairs a clean, anti-glare beam pattern with 450 lumens of smart output. Precision optics eliminate blinding hot-spots for oncoming traffic, while the die-cast aluminium body dissipates heat to maintain consistent brightness throughout your ride. IPX6 waterproofing handles downpours without hesitation.",
    images: [],
    specifications: {
      Lumens: '450',
      Modes: 'High / Medium / Low / Flash',
      'Water Resistance': 'IPX6 (heavy rain)',
      Battery: 'USB-C rechargeable',
      Housing: 'Die-cast aluminium',
      Mount: 'Handlebar clip mount',
      'Key Features':
        'Anti-glare optics | 450 lm output | IPX6 waterproof | Die-cast aluminium body for heat management | USB-C charging',
    },
    stock_quantity: 6,
    stock_status: 'In Stock',
    color: 'Black',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'K1000 Front Light',
    brand: 'Ravemen',
    category: 'lights',
    type: 'accessory',
    price: 4990,
    original_price: null,
    description:
      'A thousand lumens in a sleek, aerodynamic housing. The Ravemen K1000 uses high-efficiency LED technology and precision optics to throw a wide, flat anti-glare beam pattern ideal for both urban roads and open trails. Intelligent low-battery indication keeps you aware before you are left in the dark.',
    images: [],
    specifications: {
      Lumens: '1000',
      Modes: 'High / Medium / Low / Flash',
      'Water Resistance': 'IPX6',
      Battery: 'USB-C rechargeable',
      Housing: 'Die-cast aluminium',
      Mount: 'Handlebar clip mount',
      'Key Features':
        '1000 lm peak output | Anti-glare flat beam pattern | IPX6 waterproofing | Low-battery warning | Die-cast aluminium housing',
    },
    stock_quantity: 3,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'Eye-catching Light with Radar',
    brand: 'Ravemen',
    category: 'lights',
    type: 'accessory',
    price: 9990,
    original_price: null,
    description:
      "The Ravemen Radar Light is a revolution in cycling safety. It pairs an attention-grabbing front flash with ANT+ radar connectivity, alerting you to approaching vehicles from behind via compatible cycling computers. See and be seen — technology working together to keep you safer on every ride.",
    images: [],
    specifications: {
      Lumens: '80 (front flash)',
      Connectivity: 'ANT+ / Bluetooth',
      Function: 'Radar + front visibility light',
      'Battery Life': 'Up to 10 hrs',
      Compatibility: 'Garmin Edge, Wahoo ELEMNT',
      Mount: 'Handlebar / helmet',
      'Key Features':
        'Integrated ANT+ radar system | Compatible with Garmin & Wahoo head units | High-visibility LED flash | Wireless connectivity | Dual mount options',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: null,
    size: null,
    tag: 'Smart Light',
    is_active: true,
  },
  {
    name: 'K1800 Front Light',
    brand: 'Ravemen',
    category: 'lights',
    type: 'accessory',
    price: 7990,
    original_price: null,
    description:
      'When maximum lumens are non-negotiable, the K1800 delivers 1,800 lumens with precision optical engineering that cuts through the darkest trails. Multiple output levels balance brightness against battery life for any mission. The die-cast aluminium body manages heat efficiently for consistent, sustained performance.',
    images: [],
    specifications: {
      Lumens: '1800',
      Modes: 'High / Medium / Low / Flash',
      'Water Resistance': 'IPX6',
      Battery: 'USB-C rechargeable',
      Housing: 'Die-cast aluminium',
      Mount: 'Handlebar mount',
      'Key Features':
        '1800 lm peak output | Anti-glare optics | IPX6 waterproof | Die-cast aluminium thermal management | Multiple brightness modes',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'CR800 Bicycle Light',
    brand: 'Ravemen',
    category: 'lights',
    type: 'accessory',
    price: 5990,
    original_price: null,
    description:
      'The Ravemen CR800 blends 800 lumens of output with intelligent low-battery detection, keeping you informed before you are left in the dark. Its horizontal-flood beam pattern is perfectly tuned for road cycling, spreading light across the road surface rather than into oncoming eyes.',
    images: [],
    specifications: {
      Lumens: '800',
      Modes: 'High / Medium / Low / Flash',
      'Beam Pattern': 'Horizontal flood (road-optimised)',
      Battery: 'USB-C rechargeable',
      'Water Resistance': 'IPX6',
      'Key Features':
        '800 lm road-optimised beam | Anti-glare horizontal flood | Low-battery indicator | IPX6 waterproofing | USB-C charging',
    },
    stock_quantity: 2,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'Mako 150 Headlight',
    brand: 'NiteRider',
    category: 'lights',
    type: 'accessory',
    price: 1899,
    original_price: null,
    description:
      'Compact and lightweight, the NiteRider Mako 150 punches above its weight class with 150 lumens of steady beam and a flash mode designed to get you noticed in traffic. Ideal as a secondary light or a practical everyday commuter solution that clips on in seconds.',
    images: [],
    specifications: {
      Lumens: '150',
      Modes: 'Steady / Flash',
      Battery: 'Micro-USB rechargeable',
      'Water Resistance': 'Weather resistant',
      Mount: 'Quick-release handlebar clip',
      'Key Features':
        '150 lm output | Quick-release clip mount | Micro-USB rechargeable | Lightweight & compact | Great as secondary or commuter light',
    },
    stock_quantity: 6,
    stock_status: 'In Stock',
    color: 'Black',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'Mako 250 Headlight',
    brand: 'NiteRider',
    category: 'lights',
    type: 'accessory',
    price: 2299,
    original_price: null,
    description:
      '250 lumens of NiteRider dependability in an ultra-compact format. The Mako 250 clips on in seconds and stays secure through the roughest rides, while the micro-USB charge port means you are never far from a top-up. A solid upgrade from a basic flasher for urban commuters.',
    images: [],
    specifications: {
      Lumens: '250',
      Modes: 'Steady / Flash / DayFlash',
      Battery: 'Micro-USB rechargeable',
      'Run Time': 'Up to 3 hrs (steady) / 16 hrs (flash)',
      Mount: 'Quick-release handlebar clip',
      'Key Features':
        '250 lm output | DayFlash daytime mode | Quick-release mount | Micro-USB rechargeable | Compact & lightweight',
    },
    stock_quantity: 9,
    stock_status: 'In Stock',
    color: 'Black',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'Swift 700 Front Bike Light',
    brand: 'NiteRider',
    category: 'lights',
    type: 'accessory',
    price: 2699,
    original_price: null,
    description:
      "The NiteRider Swift 700 delivers serious 700-lumen output with run times tuned for long evening rides. NiteRider's focused beam with natural peripheral spill keeps the road ahead lit and roadside hazards visible — performance lighting at an accessible price point.",
    images: [],
    specifications: {
      Lumens: '700',
      Modes: 'High / Medium / Low / Flash / DayFlash',
      Battery: 'USB rechargeable',
      'Run Time': 'Up to 2 hrs (high) / 40 hrs (low flash)',
      'Water Resistance': 'IPX4',
      Mount: 'Quick-release handlebar mount',
      'Key Features':
        '700 lm max output | 5 versatile modes | IPX4 water resistance | USB rechargeable | Quick-release handlebar mount',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'Allty 2000 Front Light',
    brand: 'Allty',
    category: 'lights',
    type: 'accessory',
    price: 11500,
    original_price: null,
    description:
      'Engineered for endurance riders and adventurers who demand the best, the Allty 2000 outputs an astonishing 2,000 lumens. Its advanced thermal management system prevents overheating and sustains peak output on even the longest night rides. When darkness is not an option, the Allty 2000 is the answer.',
    images: [],
    specifications: {
      Lumens: '2000',
      Modes: 'Turbo / High / Medium / Low / Flash',
      Battery: 'USB-C rechargeable (high-capacity)',
      'Thermal Management': 'Active heat dissipation',
      'Water Resistance': 'IPX6',
      Mount: 'Handlebar & GoPro-compatible mount',
      'Key Features':
        '2000 lm peak output | Active thermal management | USB-C fast charging | IPX6 waterproofing | GoPro-compatible mount',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: null,
    tag: 'Premium',
    is_active: true,
  },
  {
    name: 'Cateye Head Lamp 200',
    brand: 'Cateye',
    category: 'lights',
    type: 'accessory',
    price: 2190,
    original_price: null,
    description:
      "CatEye quality in a compact, lightweight package. The 200-lumen output covers urban streets and cycle paths with ease, while CatEye's OptiCube lens ensures even light distribution for comfortable, fatigue-free riding. Reliable, simple, and trusted by commuters worldwide.",
    images: [],
    specifications: {
      Lumens: '200',
      Modes: 'High / Low / Flash',
      Battery: 'USB rechargeable',
      Lens: 'OptiCube (even distribution)',
      Mount: 'FlexTight bracket',
      'Key Features':
        '200 lm with OptiCube lens | Even light distribution | FlexTight bracket for secure mounting | USB rechargeable | Trusted CatEye quality',
    },
    stock_quantity: 2,
    stock_status: 'Limited Stock',
    color: null,
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'Bicycle Front Light',
    brand: 'Decathlon',
    category: 'lights',
    type: 'accessory',
    price: 2199,
    original_price: null,
    description:
      'A reliable, budget-friendly front light solution from Decathlon. Bright LED output, simple clip-on mounting, and weather resistance make it a practical choice for daily urban commuters who need dependable visibility without complexity.',
    images: [],
    specifications: {
      Output: 'LED',
      Modes: 'Steady / Flash',
      Battery: 'USB rechargeable',
      Mount: 'Clip-on handlebar',
      'Water Resistance': 'Weather resistant',
      'Key Features':
        'Bright LED output | Easy clip-on mount | USB rechargeable | Weather resistant | Excellent value',
    },
    stock_quantity: 2,
    stock_status: 'Limited Stock',
    color: 'Red',
    size: null,
    tag: 'Front Light',
    is_active: true,
  },
  {
    name: 'Bicycle Light 100 RR',
    brand: 'Decathlon',
    category: 'lights',
    type: 'accessory',
    price: 1199,
    original_price: null,
    description:
      '100 lumens of dependable rear visibility from Decathlon. USB rechargeable with multiple flash modes to adapt to any urban cycling scenario. A smart, affordable solution for riders who need to be seen without spending a fortune.',
    images: [],
    specifications: {
      Lumens: '100',
      Modes: 'Steady / Flash / Pulse',
      Battery: 'USB rechargeable',
      Mount: 'Seatpost / seatstay clip',
      'Water Resistance': 'IPX4',
      'Key Features':
        '100 lm rear visibility | Multiple flash modes | USB rechargeable | IPX4 water resistance | Lightweight & affordable',
    },
    stock_quantity: 2,
    stock_status: 'Limited Stock',
    color: 'Red',
    size: null,
    tag: 'Rear Light',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REAR LIGHTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'SYN Tailight STL-02',
    brand: 'Syncros',
    category: 'lights',
    type: 'accessory',
    price: 2400,
    original_price: null,
    description:
      'The Syncros STL-02 tail light keeps you visible from behind with a clean, single-LED design. Minimalist in form but serious in function — it integrates seamlessly into your seatpost setup without adding unnecessary weight. Reliable and weather-proof for daily commuting and training rides.',
    images: [],
    specifications: {
      LEDs: '1 high-power LED',
      Modes: 'Steady / Flash',
      Battery: 'USB rechargeable',
      Mount: 'Seatpost clip',
      'Water Resistance': 'IPX4',
      'Key Features':
        'Minimalist 1-LED design | USB rechargeable | IPX4 water resistance | Lightweight seatpost clip mount | Syncros quality build',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: 'Red',
    size: null,
    tag: 'Rear Light',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PUMPS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Micro Floor Pump',
    brand: 'Syncros',
    category: 'pumps',
    type: 'accessory',
    price: 3760,
    original_price: null,
    description:
      'The Syncros Micro Floor Pump delivers accurate, high-pressure inflation with the convenience of a compact design. Its dual-valve head accommodates both Presta and Schrader valves, and the integrated pressure gauge ensures pinpoint accuracy. A smart workshop tool for the home mechanic who demands quality without bulk.',
    images: [],
    specifications: {
      Type: 'Mini floor pump',
      'Valve Compatibility': 'Presta & Schrader',
      'Max Pressure': '160 psi / 11 bar',
      Gauge: 'Integrated dial gauge',
      Material: 'Aluminium barrel',
      'Key Features':
        'Dual Presta & Schrader valve head | Integrated pressure gauge | Aluminium barrel | 160 psi max pressure | Compact & portable',
    },
    stock_quantity: 6,
    stock_status: 'In Stock',
    color: 'Satin Nickel Grey',
    size: 'One Size',
    tag: 'Pump',
    is_active: true,
  },
  {
    name: 'A351 VeloClub High Pressure Pump',
    brand: 'IceToolz',
    category: 'pumps',
    type: 'accessory',
    price: 2750,
    original_price: null,
    description:
      "Designed for the serious cyclist, the IceToolz A351 VeloClub high-pressure pump reaches the pressures road tyres demand. The ergonomic T-handle and stable wide base make pumping effortless, session after session. A dependable, go-to tool that earns its place in every serious cyclist's home.",
    images: [],
    specifications: {
      Type: 'Floor pump (track pump)',
      'Valve Compatibility': 'Presta & Schrader',
      'Max Pressure': '160 psi / 11 bar',
      Handle: 'Ergonomic T-handle',
      Base: 'Wide, stable non-slip base',
      Gauge: 'Integrated gauge',
      'Key Features':
        'High-pressure 160 psi capacity | T-handle for easy pumping | Dual-valve head | Wide stable base | Integrated gauge',
    },
    stock_quantity: 6,
    stock_status: 'In Stock',
    color: null,
    size: null,
    tag: 'Pump',
    is_active: true,
  },
  {
    name: 'GM-71 Floor Pump',
    brand: 'Giyo',
    category: 'pumps',
    type: 'accessory',
    price: 1799,
    original_price: null,
    description:
      'The Giyo GM-71 is a dependable all-purpose floor pump built for daily use. Durable aluminium barrel construction, a clear pressure gauge, and a dual-valve head make it a reliable workshop staple for any bike type — road, MTB, or hybrid.',
    images: [],
    specifications: {
      Type: 'Floor pump',
      'Valve Compatibility': 'Presta & Schrader',
      'Max Pressure': '160 psi',
      Barrel: 'Aluminium',
      Gauge: 'Integrated analogue gauge',
      'Key Features':
        'Alloy barrel construction | Dual-valve Presta & Schrader head | 160 psi max pressure | Integrated gauge | Stable wide base',
    },
    stock_quantity: 7,
    stock_status: 'In Stock',
    color: 'Grey / Black',
    size: null,
    tag: 'Pump',
    is_active: true,
  },
  {
    name: 'GMC-49 LL Floor Pump',
    brand: 'Giyo',
    category: 'pumps',
    type: 'accessory',
    price: 1999,
    original_price: null,
    description:
      'Compact but capable, the Giyo GMC-49 LL delivers high pressure in a lightweight, portable format. Its long hose allows easy valve access regardless of wheel orientation, making inflation quick and effortless whether you are in the workshop or at the trailhead.',
    images: [],
    specifications: {
      Type: 'Compact floor pump',
      'Valve Compatibility': 'Presta & Schrader',
      'Max Pressure': '160 psi',
      Hose: 'Long flexible hose',
      'Key Features':
        'Long flexible hose for easy access | Dual-valve head | Compact lightweight design | 160 psi capacity | Ideal for home & travel',
    },
    stock_quantity: 3,
    stock_status: 'Limited Stock',
    color: null,
    size: null,
    tag: 'Pump',
    is_active: true,
  },
  {
    name: 'TB2 Pro Track Pump',
    brand: 'TOPUMP',
    category: 'pumps',
    type: 'accessory',
    price: 5299,
    original_price: null,
    description:
      'The TOPUMP TB2 Pro is a professional-grade track pump with a high-capacity steel barrel for fast, efficient inflation. Its precision large-dial gauge delivers repeatable, accurate pressure readings every session. Built for workshops and demanding riders who settle for nothing less than pro-level tooling.',
    images: [],
    specifications: {
      Type: 'Track pump (floor pump)',
      'Valve Compatibility': 'Presta & Schrader',
      'Max Pressure': '200 psi / 14 bar',
      Barrel: 'Steel high-capacity',
      Gauge: 'Large-dial precision gauge',
      Handle: 'Ergonomic dual-grip T-handle',
      'Key Features':
        '200 psi professional capacity | Large-dial precision gauge | High-capacity steel barrel | Dual-grip T-handle | Stable wide base',
    },
    stock_quantity: 3,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: null,
    tag: 'Pro Pump',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BELLS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Rocket Bicycle Bell',
    brand: 'Crane',
    category: 'bells',
    type: 'accessory',
    price: 1950,
    original_price: null,
    description:
      "Clean, crisp, and unmistakably premium — the Crane Rocket is a minimalist bicycle bell precision-crafted for cyclists who care about every detail. Its stealth black finish complements any build, and the powerful, clear ring cuts through city noise to alert pedestrians before the situation becomes close.",
    images: [],
    specifications: {
      Material: 'Machined aluminium',
      Finish: 'Stealth Black anodised',
      'Mount Diameter': '22.2 mm handlebar',
      Mount: 'Clamp-on',
      Sound: 'Clear, crisp ring',
      'Key Features':
        'Precision-machined aluminium body | Stealth Black anodised finish | Clear, loud ring | Easy clamp-on installation | Minimalist design for any build',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: 'Stealth Black',
    size: null,
    tag: 'Bell',
    is_active: true,
  },
  {
    name: 'Oi Luxe Bicycle Bell',
    brand: 'KNOG',
    category: 'bells',
    type: 'accessory',
    price: 2618,
    original_price: null,
    description:
      "The KNOG Oi Luxe is the bell you didn't know you needed. Designed to wrap elegantly around your handlebar, it is virtually invisible when not in use yet delivers a satisfyingly loud, clear ring. A beautifully engineered piece that proves safety accessories do not have to compromise aesthetics.",
    images: [],
    specifications: {
      Material: 'Machined aluminium',
      Design: 'Handlebar-hugging, low-profile',
      'Mount Diameter': '22.2 / 23.8 mm',
      Sound: 'Loud, clear single-ring',
      Weight: '~22 g',
      'Key Features':
        'Handlebar-hugging invisible profile | Loud, clear ring | Precision-machined aluminium | Premium Luxe finish | Available for most handlebar diameters',
    },
    stock_quantity: 6,
    stock_status: 'In Stock',
    color: null,
    size: null,
    tag: 'Bell',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MOUNTS & PHONE HOLDERS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'VersaMount Set',
    brand: 'Topeak',
    category: 'mounts',
    type: 'accessory',
    price: 750,
    original_price: null,
    description:
      'The Topeak VersaMount Set is a universal mounting solution for lights, computers, and accessories. Its tool-free installation and compatibility with standard Topeak interfaces make it an essential cockpit organiser for any rider who values a clean, clutter-free setup.',
    images: [],
    specifications: {
      Compatibility: 'Topeak accessory ecosystem',
      Installation: 'Tool-free',
      Mount: 'Handlebar / stem',
      Material: 'Glass-reinforced nylon',
      'Key Features':
        'Universal Topeak accessory compatibility | Tool-free installation | Lightweight GR-nylon construction | Fits most handlebars & stems | Keeps cockpit organised',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: null,
    tag: 'Mount',
    is_active: true,
  },
  {
    name: 'Clug Hybrid Bike Mount (M)',
    brand: 'Hornit',
    category: 'mounts',
    type: 'accessory',
    price: 1799,
    original_price: null,
    description:
      "The Hornit Clug is the world's smallest bicycle wall mount. The HYBRID version supports both road and mountain bike tyre widths, making neat wall storage simple and space-efficient wherever you park your bike. Installs in minutes with the included hardware.",
    images: [],
    specifications: {
      Type: 'Wall-mounted bike storage',
      'Tyre Compatibility': '33–43 mm (M)',
      Material: 'High-impact polymer',
      Installation: 'Wall-mounted (hardware included)',
      Weight: '<100 g',
      'Key Features':
        "World's smallest bike wall mount | Supports road & MTB tyres (33–43 mm) | Hardware included | Space-saving vertical storage | Easy DIY installation",
    },
    stock_quantity: 2,
    stock_status: 'Limited Stock',
    color: 'Green / Orange',
    size: 'M (33–43 mm)',
    tag: 'Storage',
    is_active: true,
  },
  {
    name: 'Clug Hybrid Bike Mount (L)',
    brand: 'Hornit',
    category: 'mounts',
    type: 'accessory',
    price: 1799,
    original_price: null,
    description:
      "Designed for wider tyres, the Hornit Clug HYBRID L is the world's smallest wall mount for bikes with tyres from 44mm to 57mm. Minimalist, discreet, and incredibly strong — the smartest way to store your bike vertically and reclaim floor space.",
    images: [],
    specifications: {
      Type: 'Wall-mounted bike storage',
      'Tyre Compatibility': '44–57 mm (L)',
      Material: 'High-impact polymer',
      Installation: 'Wall-mounted (hardware included)',
      Weight: '<100 g',
      'Key Features':
        "World's smallest bike wall mount | Supports wider tyres (44–57 mm) | Hardware included | Space-saving vertical storage | Easy DIY installation",
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: null,
    size: 'L (44–57 mm)',
    tag: 'Storage',
    is_active: true,
  },
  {
    name: 'TT Bar Riser Kit',
    brand: 'ZIPP',
    category: 'mounts',
    type: 'accessory',
    price: 2290,
    original_price: null,
    description:
      'The ZIPP TT Bar Riser Kit raises your aerobars by 25 mm to find the ideal position for maximum time-trial or triathlon performance. CNC-machined from premium alloy for low weight and exceptional stiffness — get the fit dialled in without compromising the aero gains your position delivers.',
    images: [],
    specifications: {
      Rise: '25 mm',
      Material: 'CNC-machined alloy',
      Compatibility: 'Standard 22.2 mm aerobar stems',
      Finish: 'Black matte',
      'Key Features':
        '25 mm rise for position optimisation | CNC-machined alloy | Compatible with standard aerobars | Lightweight construction | Improves TT & triathlon fit',
    },
    stock_quantity: 2,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: '25 mm',
    tag: 'Aerobar',
    is_active: true,
  },
  {
    name: 'Cockpit Plus Handlebar Cockpit',
    brand: 'M-Wave',
    category: 'mounts',
    type: 'accessory',
    price: 999,
    original_price: null,
    description:
      'The M-Wave Cockpit Plus is a compact integrated handlebar extension system that expands your cockpit real estate. At 90 mm width, it provides additional mounting points for lights, computers, and accessories — ideal for riders who want more control over cockpit organisation.',
    images: [],
    specifications: {
      Width: '90 mm',
      Material: 'Alloy',
      'Clamp Diameter': '22.2 mm',
      Mounts: 'Multiple accessory attachment points',
      'Key Features':
        '90 mm cockpit extension | Multiple accessory mounts | Alloy construction | Declutters your handlebar setup | Easy installation',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: null,
    size: '90 mm',
    tag: 'Cockpit',
    is_active: true,
  },
  {
    name: 'Everyday Fabric Case',
    brand: 'Peak Design',
    category: 'mounts',
    type: 'accessory',
    price: 3999,
    original_price: null,
    description:
      "Peak Design's Everyday Fabric Case keeps your smartphone or small devices protected while riding. Its slim, lightweight profile and universal Peak Design mount interface mean your phone or GPS is always accessible — exactly where you need it, exactly when you need it.",
    images: [],
    specifications: {
      Material: 'Weatherproof ripstop fabric',
      Compatibility: 'Peak Design mounting ecosystem',
      Access: 'Top-loading with one-handed release',
      Weight: 'Ultra-light',
      'Key Features':
        'Weatherproof ripstop fabric | Peak Design universal mount interface | One-handed access | Slim & lightweight | Integrates into broader Peak Design ecosystem',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: null,
    size: null,
    tag: 'Phone Mount',
    is_active: true,
  },
  {
    name: 'Universal Adapter',
    brand: 'Peak Design',
    category: 'mounts',
    type: 'accessory',
    price: 2499,
    original_price: null,
    description:
      'The Peak Design Universal Adapter bridges the Peak Design mounting ecosystem with standard mounting points from other brands. Essential for riders who want to share mounts between devices or add Peak Design functionality to non-Peak Design products.',
    images: [],
    specifications: {
      Compatibility: 'Peak Design ecosystem + universal mount points',
      Material: 'CNC-machined aluminium',
      Interface: 'Standard 1/4-20 thread & proprietary Peak Design locking',
      'Key Features':
        'Bridges Peak Design with universal mounts | CNC-machined aluminium | Versatile compatibility | Expand your accessory setup | Lightweight & compact',
    },
    stock_quantity: 2,
    stock_status: 'Limited Stock',
    color: null,
    size: null,
    tag: 'Phone Mount',
    is_active: true,
  },
  {
    name: 'SP Connect Mobile Holder Case II',
    brand: 'SP Connect',
    category: 'mounts',
    type: 'accessory',
    price: 4590,
    original_price: null,
    description:
      "SP Connect's smartphone case integrates your phone into your cockpit without clutter or vibration. The secure twist-lock system delivers a rock-solid, wireless-charging-compatible connection that stays in place on even the roughest roads or trails. Navigation should be clear and accessible — not a distraction.",
    images: [],
    specifications: {
      Compatibility: 'SP Connect mounting ecosystem',
      'Charging Compatibility': 'Wireless charging through case',
      'Lock System': 'Twist-lock (tool-free)',
      'Water Resistance': 'Splash resistant',
      'Key Features':
        'Twist-lock vibration-free connection | Wireless charging compatible | Splash resistant | Tool-free mounting | Integrates with SP Connect ecosystem',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: 'Midnight Black',
    size: 'M',
    tag: 'Phone Mount',
    is_active: true,
  },
  {
    name: 'Universal Phone Holder Bike Kit',
    brand: 'Zefal',
    category: 'mounts',
    type: 'accessory',
    price: 2990,
    original_price: null,
    description:
      "Zéfal's Universal Phone Holder Bike Kit secures any smartphone to your handlebars with 360° rotational adjustment and anti-vibration padding. It accommodates handlebars up to 32 mm and phones in portrait or landscape orientation — the definitive go-anywhere navigation mount.",
    images: [],
    specifications: {
      Compatibility: 'Universal (all smartphones)',
      'Handlebar Diameter': 'Up to 32 mm',
      Rotation: '360° adjustable',
      Vibration: 'Anti-vibration padding',
      Orientation: 'Portrait & landscape',
      'Key Features':
        'Fits any smartphone | 360° rotation | Anti-vibration padding | Up to 32 mm handlebar | Portrait & landscape orientations',
    },
    stock_quantity: 3,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: '32 mm',
    tag: 'Phone Mount',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LOCKS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Digit Combination Lock',
    brand: 'Krutials',
    category: 'locks',
    type: 'accessory',
    price: 699,
    original_price: null,
    description:
      'The Krutials Digit Lock is a lightweight combination security solution for securing your bike at short stops. A resettable 3-digit combination means no keys to carry on your ride, while the durable steel shackle provides reliable deterrence for everyday use.',
    images: [],
    specifications: {
      Type: 'Combination (no key)',
      Code: '3-digit resettable',
      Shackle: 'Hardened steel',
      Weight: 'Lightweight',
      'Key Features':
        '3-digit resettable combination | No keys required | Hardened steel shackle | Lightweight for carry on rides | Good for café & short stops',
    },
    stock_quantity: 3,
    stock_status: 'Limited Stock',
    color: 'Black',
    size: null,
    tag: 'Security',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CLAMPS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'EJK1613 Super Lite Seat Clamp',
    brand: 'Token',
    category: 'clamps',
    type: 'accessory',
    price: 1000,
    original_price: null,
    description:
      'Machined from aircraft-grade alloy, the Token EJK1613 Super Lite Clamp provides a secure, low-profile seatpost clamp at 31.8 mm for modern carbon and aluminium frames. Lightweight precision engineering meets practical reliability — no compromises for the weight-conscious rider.',
    images: [],
    specifications: {
      Diameter: '31.8 mm',
      Material: 'Aircraft-grade alloy (CNC-machined)',
      Bolt: 'Allen-key bolt',
      Profile: 'Low-profile Super Lite design',
      'Key Features':
        '31.8 mm diameter | CNC-machined aircraft alloy | Low-profile design | Lightweight without compromising clamping force | For carbon & aluminium frames',
    },
    stock_quantity: 4,
    stock_status: 'Limited Stock',
    color: null,
    size: '31.8 mm',
    tag: 'Clamp',
    is_active: true,
  },
  {
    name: 'Shark Tail Seat Clamp',
    brand: 'Token',
    category: 'clamps',
    type: 'accessory',
    price: 1990,
    original_price: null,
    description:
      'The Token Shark Tail seat clamp combines aerodynamic styling with reliable seatpost security. Its sleek, tapered profile reduces drag while providing consistent, even clamping pressure to maintain your saddle position mile after mile — precision form following function.',
    images: [],
    specifications: {
      Diameter: '34.9 mm',
      Material: 'CNC-machined alloy',
      Profile: 'Aero Shark Tail design',
      Bolt: 'Allen-key bolt',
      'Key Features':
        '34.9 mm diameter | Aerodynamic Shark Tail profile | CNC-machined alloy | Consistent clamping pressure | Drag-reducing tapered shape',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: null,
    size: '34.9 mm',
    tag: 'Clamp',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MIRRORS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Bike Mirror',
    brand: 'R2',
    category: 'mirrors',
    type: 'accessory',
    price: 799,
    original_price: null,
    description:
      'The R2 Bike Mirror gives you a clear, wide-angle rear view without turning your head. A 71 mm convex mirror surface provides excellent road coverage while the vibration-damping 45 mm handlebar mount keeps the reflection stable — even on rough surfaces.',
    images: [],
    specifications: {
      'Mirror Size': '71 mm',
      'Handle / Bar Clamp': '45 mm',
      'Mirror Type': 'Wide-angle convex',
      Material: 'Shatterproof mirror + polymer housing',
      Adjustability: 'Multi-angle adjustable arm',
      'Key Features':
        '71 mm wide-angle convex mirror | Fits 45 mm handlebars | Multi-angle adjustment | Shatterproof lens | Vibration-damping mount',
    },
    stock_quantity: 6,
    stock_status: 'In Stock',
    color: null,
    size: '71 mm mirror',
    tag: 'Mirror',
    is_active: true,
  },
  {
    name: 'Handlebar Bike Mirror',
    brand: 'R2',
    category: 'mirrors',
    type: 'accessory',
    price: 799,
    original_price: null,
    description:
      'Stay aware of traffic behind you without compromising your riding position. The R2 Handlebar Mirror features an adjustable convex lens and secure handlebar clamp for clear rear-view visibility on commutes, long-distance rides, and touring.',
    images: [],
    specifications: {
      'Mirror Type': 'Convex wide-angle',
      Material: 'Shatterproof lens + polymer arm',
      Compatibility: 'Standard handlebars',
      Adjustability: 'Multi-angle adjustable',
      'Key Features':
        'Wide-angle convex mirror | Clear rear visibility | Secure handlebar clamp | Multi-angle adjustable | Shatterproof mirror lens',
    },
    stock_quantity: 7,
    stock_status: 'In Stock',
    color: null,
    size: null,
    tag: 'Mirror',
    is_active: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOLS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Ocarina Torque Wrench Set',
    brand: 'IceToolz',
    category: 'tools',
    type: 'accessory',
    price: 2490,
    original_price: null,
    description:
      "The IceToolz Ocarina Torque Wrench Set covers the critical 3–10 Nm range used for most bicycle fasteners. A must-have for precise, damage-free assembly of carbon components, stems, seatpost clamps, and any torque-sensitive fastener on your bike. Protect your investment with the right tool.",
    images: [],
    specifications: {
      'Torque Range': '3–10 Nm',
      'Drive Size': '1/4 inch',
      Bits: 'Hex 2/2.5/3/4/5/6 mm + T10/T25 Torx',
      Accuracy: '±4%',
      Calibration: 'Pre-set click-type',
      'Key Features':
        '3–10 Nm torque range | Click-type mechanism | ±4% accuracy | Multiple hex & Torx bits included | Essential for carbon component installation',
    },
    stock_quantity: 2,
    stock_status: 'Limited Stock',
    color: null,
    size: '3–10 Nm',
    tag: 'Tool',
    is_active: true,
  },
  {
    name: 'Hex Key Wrench Set',
    brand: 'IceToolz',
    category: 'tools',
    type: 'accessory',
    price: 690,
    original_price: null,
    description:
      'A precision set of hex keys from IceToolz, ground from chrome-vanadium steel for strength and long-term accuracy. The complete range covers every allen bolt on modern road, MTB, and hybrid bicycles — a proper set that will serve you for years.',
    images: [],
    specifications: {
      Material: 'Chrome-vanadium steel (Cr-V)',
      Sizes: '2 / 2.5 / 3 / 4 / 5 / 6 / 8 mm',
      Finish: 'Black oxide',
      Type: 'L-shaped hex key set',
      'Key Features':
        'Chrome-vanadium steel | Complete 7-piece set | Covers all bike bolt sizes | Black oxide corrosion finish | Accurate ball-end for angled access',
    },
    stock_quantity: 2,
    stock_status: 'Limited Stock',
    color: null,
    size: null,
    tag: 'Tool',
    is_active: true,
  },
  {
    name: 'Tool Mini Multi-Tool',
    brand: 'Merida',
    category: 'tools',
    type: 'accessory',
    price: 1590,
    original_price: null,
    description:
      'The Merida Tool Mini is a compact multi-tool engineered for trail-side repairs and mid-ride adjustments. It packs the essential hex keys, Torx drivers, and a flat-head screwdriver into one slim, pocketable package without the bulk of a full-size multi-tool.',
    images: [],
    specifications: {
      Functions: 'Hex 2/3/4/5/6 mm, T25 Torx, flat-head',
      Material: 'Chrome-vanadium steel + polymer handle',
      Form: 'Folding pocket multi-tool',
      Weight: '~80 g',
      'Key Features':
        'Multi-function in one compact body | Hex 2–6 mm + T25 Torx | Polymer gripped handle | Folds pocket-slim | Merida quality build',
    },
    stock_quantity: 1,
    stock_status: 'Limited Stock',
    color: null,
    size: null,
    tag: 'Multi-Tool',
    is_active: true,
  },
];

// ---------------------------------------------------------------------------
// INSERT INTO SUPABASE
// ---------------------------------------------------------------------------

async function seed() {
  console.log(`\n🔧  Pro Riders Hub — Accessory Seed Script`);
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
          '\n    Options:',
          '\n    1. Run this in Supabase SQL Editor to temporarily allow seeding:',
          '\n       ALTER TABLE db_products DISABLE ROW LEVEL SECURITY;',
          '\n    2. Re-enable afterwards:',
          '\n       ALTER TABLE db_products ENABLE ROW LEVEL SECURITY;',
          '\n    3. Or replace SUPABASE_ANON_KEY with your service_role key.\n',
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

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅  Done! ${inserted} products inserted, ${failed} failed.`);
  if (inserted > 0) {
    console.log(
      `\n    → Visit /accessories in the site to see them.`,
      `\n    → Add product images via /admin/dashboard → Products tab.\n`,
    );
  }
}

seed().catch(console.error);
