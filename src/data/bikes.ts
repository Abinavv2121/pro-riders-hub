import argon18 from "@/assets/bikes/argon18-nitrogen.png";
import avantiF1W from "@/assets/bikes/avanti-giro-f1w.png";
import avantiFM1W from "@/assets/bikes/avanti-giro-fm1w.png";
import lapierre from "@/assets/bikes/lapierre-aircode-drs.png";
import scottPlasma from "@/assets/bikes/scott-plasma-10.png";
import marlin5 from "@/assets/bikes/trek-marlin5.png";

export const bikeCategories = [
    { key: "all", label: "All Bikes" },
    { key: "race-road", label: "Race Road" },
    { key: "endurance-road", label: "Endurance Road" },
    { key: "gravel", label: "Gravel & Adventure" },
    { key: "mtb", label: "MTB (XC & Trail)" },
    { key: "city-fitness", label: "City & Fitness" },
    { key: "hybrid", label: "Hybrid" },
    { key: "kids", label: "Kids Bikes" },
    { key: "pre-owned", label: "Pre-Owned Bikes" },
    { key: "restoration", label: "Restoration Bikes" },
] as const;

export type BikeCategory = (typeof bikeCategories)[number]["key"];

// Filter options
export const bikeTypes = ["Race Road", "Endurance Road", "Gravel", "MTB", "City & Fitness", "Hybrid"];
export const bikeSizes = ["XXS", "XXXS", "XS", "S", "M", "L", "XL", "XXL", "48", "50", "51", "52", "54", "M / L", "S / M", "M / L / XL", "20", "24"];
export const bikeGears = ["8 Speed", "9 Speed", "10 Speed", "11 Speed", "12 Speed", "16 Speed", "18 Speed", "20 Speed", "21 Speed", "22 Speed", "24 Speed", "27 Speed"];
export const frameMaterials = ["Carbon", "Aluminum", "Steel", "Titanium", "Carbon Fiber"];
export const groupsets = [
    "Shimano Claris", "Shimano Sora", "Shimano Tiagra",
    "Shimano 105", "Shimano 105 Di2", "Shimano 105 (11-speed)",
    "Shimano Ultegra", "Shimano Ultegra Di2",
    "Shimano Dura-Ace",
    "Shimano Deore", "Shimano XT", "Shimano XTR",
    "Shimano Tourney", "Shimano Altus", "Shimano Cues", "Shimano Essa",
    "Shimano GRX",
    "SRAM Rival", "SRAM Force", "SRAM Red", "SRAM Eagle NX",
    "Campagnolo", "Campagnolo Chorus", "Campagnolo Record"
];
export const brakeTypes = ["Rim Brakes", "Disc Brakes (Mechanical)", "Disc Brakes (Hydraulic)", "Hydraulic Disc"];
export const wheelSizes = ["20\"", "24\"", "26\"", "27.5\"", "29\"", "700c", "650b"];
export const priceRanges = [
    { label: "Under ₹50,000", min: 0, max: 50000 },
    { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
    { label: "₹1,00,000 - ₹1,50,000", min: 100000, max: 150000 },
    { label: "₹1,50,000 - ₹2,00,000", min: 150000, max: 200000 },
    { label: "₹2,00,000 - ₹3,00,000", min: 200000, max: 300000 },
    { label: "Above ₹3,00,000", min: 300000, max: Infinity },
];

export interface Bike {
    id: number;
    name: string;
    brand: string;
    category: BikeCategory;
    image: string;
    images: string[];
    color: string;
    size: string;
    tag: string | null;
    price: number;
    originalPrice?: number;
    bikeType: string;
    gears: string;
    frameMaterial: string;
    groupset: string;
    brakeType: string;
    wheelSize: string;
    rating?: number;
    reviews?: number;
    stockStatus?: "In Stock" | "Limited Stock" | "Out of Stock" | "Preorder";
    features?: string[];
    specifications?: Record<string, string>;
    components?: Record<string, string>;
    condition?: "new" | "used" | "restored";
    year?: number;
}

// ─────────────────────────────────────────────────────
// Helper: pick a placeholder image based on brand
// ─────────────────────────────────────────────────────
function brandImage(brand: string): string {
    const map: Record<string, string> = {
        "Argon 18": argon18,
        "Lapierre": lapierre,
        "Avanti": avantiF1W,
        "Scott": scottPlasma,
        "Trek": marlin5,
    };
    return map[brand] || marlin5;
}

// ─────────────────────────────────────────────────────
// Helper: infer frame material from groupset / brand / category
// ─────────────────────────────────────────────────────
function inferFrameMaterial(brand: string, groupset: string, product: string): string {
    const carbonBrands = ["Colnago", "Cipollini", "Pinarello"];
    const carbonGroupsets = ["Shimano Ultegra", "Shimano Ultegra Di2", "Shimano Dura-Ace", "SRAM Force", "SRAM Red"];
    const carbonProducts = ["SuperSix", "Synapse Carbon", "Synapse Hi-Mod", "Madone", "Emonda SL", "Tarmac", "Addict", "Foil", "Reacto", "Scultura", "Xelius", "Aircode", "V4RS", "Eureka", "Bond"];

    if (carbonBrands.includes(brand)) return "Carbon";
    if (carbonGroupsets.some(g => groupset.includes(g))) return "Carbon";
    if (carbonProducts.some(p => product.includes(p))) return "Carbon";
    if (product.includes("AL") || product.includes("Optimo") || product.includes("Stratos") || product.includes("FX") || product.includes("Dual Sport") || product.includes("Marlin") || product.includes("Aspect") || product.includes("Cascade") || product.includes("Sub Cross")) return "Aluminum";
    if (product.includes("Grandurance")) return "Aluminum";

    return "Carbon";
}

// ─────────────────────────────────────────────────────
// Helper: infer brake type from groupset / product tier
// ─────────────────────────────────────────────────────
function inferBrakeType(product: string, groupset: string): string {
    if (product.toLowerCase().includes("rim")) return "Rim Brakes";
    const hydraulicGroupsets = ["Shimano 105", "Shimano 105 Di2", "Shimano Ultegra", "Shimano Ultegra Di2", "Shimano Dura-Ace", "Shimano GRX", "Shimano Deore", "SRAM"];
    if (hydraulicGroupsets.some(g => groupset.includes(g))) return "Disc Brakes (Hydraulic)";
    if (groupset.includes("Claris") || groupset.includes("Sora") || groupset.includes("Tourney") || groupset.includes("Altus")) return "Disc Brakes (Mechanical)";
    return "Disc Brakes (Hydraulic)";
}

// ─────────────────────────────────────────────────────
// Helper: infer number of gears from groupset
// ─────────────────────────────────────────────────────
function inferGears(groupset: string): string {
    if (groupset.includes("Di2") && groupset.includes("Ultegra")) return "24 Speed";
    if (groupset.includes("Di2") && groupset.includes("105")) return "24 Speed";
    if (groupset.includes("Dura-Ace")) return "24 Speed";
    if (groupset.includes("Ultegra")) return "22 Speed";
    if (groupset.includes("105") && groupset.includes("11-speed")) return "22 Speed";
    if (groupset.includes("105")) return "22 Speed";
    if (groupset.includes("GRX")) return "22 Speed";
    if (groupset.includes("Tiagra")) return "20 Speed";
    if (groupset.includes("Sora")) return "18 Speed";
    if (groupset.includes("Claris")) return "16 Speed";
    if (groupset.includes("Deore")) return "20 Speed";
    if (groupset.includes("Tourney")) return "21 Speed";
    if (groupset.includes("Altus")) return "18 Speed";
    if (groupset.includes("Cues")) return "20 Speed";
    if (groupset.includes("Essa")) return "18 Speed";
    if (groupset.includes("Eagle")) return "12 Speed";
    if (groupset.includes("XT")) return "24 Speed";
    if (groupset.includes("Campagnolo")) return "22 Speed";
    return "22 Speed";
}

// ─────────────────────────────────────────────────────
// Helper: infer wheel size from category
// ─────────────────────────────────────────────────────
function inferWheelSize(category: string): string {
    if (category === "mtb") return "29\"";
    return "700c";
}

// ─────────────────────────────────────────────────────
// Helper: infer price based on groupset tier and frame
// ─────────────────────────────────────────────────────
function inferPrice(groupset: string, frameMaterial: string, category: string): number {
    const isCarbon = frameMaterial === "Carbon";

    if (groupset.includes("Dura-Ace")) return isCarbon ? 350000 : 280000;
    if (groupset.includes("Ultegra Di2")) return isCarbon ? 300000 : 240000;
    if (groupset.includes("Ultegra")) return isCarbon ? 250000 : 200000;
    if (groupset.includes("105 Di2")) return isCarbon ? 220000 : 180000;
    if (groupset.includes("105") && groupset.includes("11-speed")) return isCarbon ? 160000 : 125000;
    if (groupset.includes("105")) return isCarbon ? 185000 : 145000;
    if (groupset.includes("GRX")) return isCarbon ? 180000 : 140000;
    if (groupset.includes("Tiagra")) return isCarbon ? 130000 : 95000;
    if (groupset.includes("Sora")) return isCarbon ? 100000 : 75000;
    if (groupset.includes("Claris")) return isCarbon ? 85000 : 60000;
    if (groupset.includes("Eagle")) return isCarbon ? 185000 : 140000;
    if (groupset.includes("XT")) return isCarbon ? 190000 : 150000;
    if (groupset.includes("Deore")) return isCarbon ? 120000 : 70000;
    if (groupset.includes("Tourney")) return 45000;
    if (groupset.includes("Altus")) return 55000;
    if (groupset.includes("Cues")) return 60000;
    if (groupset.includes("Essa")) return 48000;
    if (groupset.includes("Campagnolo")) return isCarbon ? 180000 : 140000;
    if (category === "mtb") return 65000;
    if (category === "hybrid") return 55000;
    return 120000;
}

// ─────────────────────────────────────────────────────
// Helper: determine road sub-category
// ─────────────────────────────────────────────────────
function inferRoadCategory(product: string, brand: string): BikeCategory {
    // Gravel bikes
    const gravelKeywords = ["Gravel", "Grandurance", "Speedster Gravel", "Granger", "Nicasio"];
    if (gravelKeywords.some(k => product.includes(k))) return "gravel";

    // Aero / Race Road
    const raceKeywords = ["Madone", "SuperSix", "Reacto", "Addict", "Foil", "Speed Concept", "Tarmac", "V4RS", "Bond", "Plasma", "Aircode"];
    if (raceKeywords.some(k => product.includes(k))) return "race-road";

    // Endurance Road
    const enduranceKeywords = ["Domane", "Synapse", "Scultura Endurance", "Emonda", "Xelius", "Eureka", "GTR", "Gallium"];
    if (enduranceKeywords.some(k => product.includes(k))) return "endurance-road";

    // Lightweight / climbing → race-road
    const climbKeywords = ["Scultura", "Emonda SL"];
    if (climbKeywords.some(k => product.includes(k))) return "race-road";

    // Entry-level road → endurance-road
    const entryKeywords = ["Speedster", "Optimo", "Stratos", "Duello", "Fuoco"];
    if (entryKeywords.some(k => product.includes(k))) return "endurance-road";

    return "race-road";
}

// ═════════════════════════════════════════════════════
// EXISTING BIKES (preserved exactly as before)
// ═════════════════════════════════════════════════════
const existingBikes: Bike[] = [
    // Race Road
    {
        id: 1, name: "Argon 18 Nitrogen", brand: "Argon 18", category: "race-road", image: argon18, images: [argon18, argon18, argon18], color: "Silver Blue", size: "L", tag: "New Arrival", price: 190000, bikeType: "Race Road", gears: "22 Speed", frameMaterial: "Carbon", groupset: "Shimano Ultegra", brakeType: "Disc Brakes (Mechanical)", wheelSize: "700c", rating: 5, reviews: 12, stockStatus: "In Stock",
        features: [
            "Full carbon monocoque frame with Argon 18 3D Head Tube system for precise handling",
            "Shimano Ultegra R8000 22-speed drivetrain for smooth and reliable shifting",
            "Mechanical disc brakes for dependable stopping power in all conditions",
            "700c wheels optimized for aerodynamic road performance",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "Race Road",
            "Wheel Size": "700c",
            "Braking System": "Disc Brakes (Mechanical)",
            "Frame Material": "Carbon",
            "Groupset": "Shimano Ultegra",
            "Gears": "22 Speed",
            "Color": "Silver Blue",
            "Warranty": "Lifetime warranty on frame"
        },
        components: {
            "Frame": "Argon 18 Nitrogen carbon monocoque with 3D Head Tube",
            "Drivetrain": "Shimano Ultegra R8000 components",
            "Shifters": "Shimano Ultegra 22-speed integrated",
            "Brakes": "Disc Brakes (Mechanical)",
            "Wheels": "700c double-wall alloy rims"
        }
    },
    {
        id: 2, name: "Lapierre Aircode DRS 5.0", brand: "Lapierre", category: "race-road", image: lapierre, images: [lapierre, lapierre], color: "Gold / Black", size: "M / L", tag: "Disc", price: 215000, originalPrice: 245000, bikeType: "Race Road", gears: "22 Speed", frameMaterial: "Carbon", groupset: "Shimano 105", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c", rating: 4, reviews: 8, stockStatus: "Limited Stock",
        features: [
            "Lapierre Supreme Carbon frame with aerodynamic tube shaping",
            "Shimano 105 R7000 22-speed drivetrain for precise gear changes",
            "Hydraulic disc brakes for superior modulation and stopping power",
            "Internal cable routing for clean aesthetics and reduced drag",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "Race Road",
            "Wheel Size": "700c",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Carbon",
            "Groupset": "Shimano 105",
            "Gears": "22 Speed",
            "Color": "Gold / Black",
            "Warranty": "Lifetime warranty on frame"
        }
    },
    {
        id: 3, name: "Scott Plasma 10", brand: "Scott", category: "race-road", image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Yellow / Black", size: "M", tag: "Triathlon", price: 220000, bikeType: "Race Road", gears: "24 Speed", frameMaterial: "Carbon", groupset: "Shimano Ultegra", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c", rating: 5, reviews: 15, stockStatus: "In Stock",
        features: [
            "Scott HMF carbon frame designed for triathlon and time-trial performance",
            "Shimano Ultegra 24-speed drivetrain with aero-optimized shifting",
            "Hydraulic disc brakes for consistent stopping at high speed",
            "Integrated aero cockpit for maximum wind-cheating efficiency",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "Race Road / Triathlon",
            "Wheel Size": "700c",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Carbon",
            "Groupset": "Shimano Ultegra",
            "Gears": "24 Speed",
            "Color": "Yellow / Black",
            "Warranty": "Lifetime warranty on frame"
        }
    },
    {
        id: 7, name: "Scott Addict RC", brand: "Scott", category: "race-road", image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Black / Red", size: "M / L", tag: "Pro", price: 245000, originalPrice: 285000, bikeType: "Race Road", gears: "24 Speed", frameMaterial: "Carbon", groupset: "Shimano Dura-Ace", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c", rating: 5, reviews: 20, stockStatus: "Preorder",
        features: [
            "Scott HMX carbon frame – one of the lightest in its class",
            "Shimano Dura-Ace R9100 24-speed for top-tier shifting performance",
            "Hydraulic disc brakes for race-ready stopping confidence",
            "Syncros integrated cockpit for clean aerodynamic lines",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "Race Road",
            "Wheel Size": "700c",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Carbon",
            "Groupset": "Shimano Dura-Ace",
            "Gears": "24 Speed",
            "Color": "Black / Red",
            "Warranty": "Lifetime warranty on frame"
        }
    },

    // Endurance Road
    {
        id: 8, name: "Trek Domane AL 5", brand: "Trek", category: "endurance-road", image: marlin5, images: [marlin5, marlin5], color: "Crimson Red", size: "M / L", tag: "Sale", price: 115000, originalPrice: 135000, bikeType: "Endurance Road", gears: "16 Speed", frameMaterial: "Aluminum", groupset: "Shimano 105", brakeType: "Disc Brakes (Mechanical)", wheelSize: "700c", rating: 5, reviews: 24, stockStatus: "In Stock",
        features: [
            "Trek 100 Series Alpha Aluminum frame with IsoSpeed decoupler for comfort",
            "Shimano 105 16-speed drivetrain for reliable endurance shifting",
            "Mechanical disc brakes for dependable all-weather stopping",
            "Internal cable routing for a clean, modern look",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "Endurance Road",
            "Wheel Size": "700c",
            "Braking System": "Disc Brakes (Mechanical)",
            "Frame Material": "Aluminum",
            "Groupset": "Shimano 105",
            "Gears": "16 Speed",
            "Color": "Crimson Red",
            "Warranty": "Lifetime warranty on frame"
        }
    },
    {
        id: 9, name: "Lapierre Xelius SL 5.0", brand: "Lapierre", category: "endurance-road", image: lapierre, images: [lapierre, lapierre], color: "Blue / White", size: "M / L", tag: null, price: 195000, bikeType: "Endurance Road", gears: "22 Speed", frameMaterial: "Carbon", groupset: "Shimano Ultegra", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c", rating: 4, reviews: 6, stockStatus: "In Stock",
        features: [
            "Lapierre SL carbon frame balancing lightweight performance with endurance comfort",
            "Shimano Ultegra 22-speed drivetrain for smooth long-distance shifting",
            "Hydraulic disc brakes for confident descending and all-weather control",
            "Vibration-damping carbon layup for reduced rider fatigue",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "Endurance Road",
            "Wheel Size": "700c",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Carbon",
            "Groupset": "Shimano Ultegra",
            "Gears": "22 Speed",
            "Color": "Blue / White",
            "Warranty": "Lifetime warranty on frame"
        }
    },
    {
        id: 10, name: "Argon 18 Gallium Pro", brand: "Argon 18", category: "endurance-road", image: argon18, images: [argon18, argon18], color: "Matte Black", size: "M / L", tag: "Premium", price: 210000, bikeType: "Endurance Road", gears: "22 Speed", frameMaterial: "Carbon", groupset: "Shimano Dura-Ace", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c", rating: 5, reviews: 18, stockStatus: "Limited Stock",
        features: [
            "Argon 18 Gallium Pro carbon frame with 3D Head Tube for endurance geometry",
            "Shimano Dura-Ace 22-speed for the highest level of shifting precision",
            "Hydraulic disc brakes for responsive stopping on long descents",
            "Optimized compliance zones in the frame for all-day riding comfort",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "Endurance Road",
            "Wheel Size": "700c",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Carbon",
            "Groupset": "Shimano Dura-Ace",
            "Gears": "22 Speed",
            "Color": "Matte Black",
            "Warranty": "Lifetime warranty on frame"
        }
    },

    // Gravel & Adventure
    {
        id: 11, name: "Scott Speedster CX 20 Disc", brand: "Scott", category: "gravel", image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Dark Grey", size: "M / L", tag: "Adventure", price: 165000, bikeType: "Gravel", gears: "20 Speed", frameMaterial: "Carbon", groupset: "Shimano 105", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c", rating: 4, reviews: 9, stockStatus: "In Stock",
        features: [
            "Scott carbon frame with gravel-specific geometry and tire clearance",
            "Shimano 105 20-speed drivetrain tuned for mixed-terrain versatility",
            "Hydraulic disc brakes for reliable stopping on loose and wet surfaces",
            "Rack and fender mounts for adventure and bikepacking setups",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "Gravel / CX",
            "Wheel Size": "700c",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Carbon",
            "Groupset": "Shimano 105",
            "Gears": "20 Speed",
            "Color": "Dark Grey",
            "Warranty": "Lifetime warranty on frame"
        }
    },
    {
        id: 12, name: "Marin Nicasio 2", brand: "Marin", category: "gravel", image: marlin5, images: [marlin5, marlin5], color: "Satin Black", size: "M / L", tag: "Gravel", price: 85000, originalPrice: 95000, bikeType: "Gravel", gears: "18 Speed", frameMaterial: "Steel", groupset: "Shimano Deore", brakeType: "Disc Brakes (Mechanical)", wheelSize: "700c", rating: 5, reviews: 14, stockStatus: "In Stock",
        features: [
            "Marin CrMo steel frame for a smooth, compliant ride on rough roads",
            "Shimano Deore 18-speed drivetrain for dependable off-road shifting",
            "Mechanical disc brakes for straightforward maintenance and stopping",
            "Wide tire clearance for gravel, adventure, and light touring",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "Gravel / Adventure",
            "Wheel Size": "700c",
            "Braking System": "Disc Brakes (Mechanical)",
            "Frame Material": "Steel",
            "Groupset": "Shimano Deore",
            "Gears": "18 Speed",
            "Color": "Satin Black",
            "Warranty": "Lifetime warranty on frame"
        }
    },

    // MTB (XC & Trail)
    {
        id: 6, name: "Trek Marlin 5 Gen 3", brand: "Trek", category: "mtb", image: marlin5, images: [marlin5, marlin5], color: "Matte Dark", size: "M / L / XL", tag: "Popular", price: 65000, originalPrice: 75000, bikeType: "MTB", gears: "18 Speed", frameMaterial: "Aluminum", groupset: "Shimano Deore", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "29\"", rating: 5, reviews: 42, stockStatus: "In Stock",
        features: [
            "Alpha Silver Aluminum frame with internal routing for derailleur & dropper post",
            "Shimano Deore 18-speed drivetrain with wide-range cassette",
            "Hydraulic disc brakes for powerful and consistent stopping",
            "29\" wheels for superior rollover and trail confidence",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "Cross Country / Trail",
            "Wheel Size": "29\"",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Aluminum",
            "Groupset": "Shimano Deore",
            "Gears": "18 Speed",
            "Color": "Matte Dark",
            "Warranty": "Lifetime warranty on frame"
        },
        components: {
            "Frame": "Trek Alpha Silver Aluminum, internal routing",
            "Fork": "SR Suntour XCE, coil spring, 100mm travel",
            "Drivetrain": "Shimano Deore components",
            "Brakes": "Hydraulic disc, 160mm rotors",
            "Wheels": "29\" Bontrager Connection double-wall"
        }
    },
    {
        id: 13, name: "Scott Spark 960", brand: "Scott", category: "mtb", image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Stellar Blue", size: "M / L", tag: "Trail", price: 185000, bikeType: "MTB", gears: "24 Speed", frameMaterial: "Carbon", groupset: "Shimano XT", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "29\"", rating: 4, reviews: 11, stockStatus: "In Stock",
        features: [
            "Scott carbon frame with TwinLoc full-suspension platform",
            "Shimano XT 24-speed drivetrain for aggressive trail riding",
            "Hydraulic disc brakes for maximum control on technical descents",
            "29\" wheels with trail-optimized geometry",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "MTB / Trail",
            "Wheel Size": "29\"",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Carbon",
            "Groupset": "Shimano XT",
            "Gears": "24 Speed",
            "Color": "Stellar Blue",
            "Warranty": "Lifetime warranty on frame"
        }
    },
    {
        id: 14, name: "Scott Scale 970", brand: "Scott", category: "mtb", image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Prism Green", size: "M / L", tag: "XC", price: 155000, bikeType: "MTB", gears: "24 Speed", frameMaterial: "Carbon", groupset: "Shimano XT", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "29\"", rating: 5, reviews: 7, stockStatus: "Limited Stock",
        features: [
            "Scott Scale carbon hardtail frame optimized for XC racing",
            "Shimano XT 24-speed drivetrain for fast, reliable shifting under load",
            "Hydraulic disc brakes for lightweight, powerful stopping",
            "29\" wheels for fast rollover on cross-country courses",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "MTB / XC",
            "Wheel Size": "29\"",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Carbon",
            "Groupset": "Shimano XT",
            "Gears": "24 Speed",
            "Color": "Prism Green",
            "Warranty": "Lifetime warranty on frame"
        }
    },
    {
        id: 15, name: "Marin Rift Zone 29", brand: "Marin", category: "mtb", image: marlin5, images: [marlin5, marlin5], color: "Gloss Black", size: "M / L", tag: "Trail", price: 175000, bikeType: "MTB", gears: "27 Speed", frameMaterial: "Aluminum", groupset: "Shimano XT", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "29\"", rating: 4, reviews: 16, stockStatus: "In Stock",
        features: [
            "Marin Series 3 aluminum full-suspension frame with MultiTrac geometry",
            "Shimano XT 27-speed drivetrain for wide-range trail gearing",
            "Hydraulic disc brakes for aggressive trail riding confidence",
            "29\" wheels with progressive suspension kinematics",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "MTB / Trail",
            "Wheel Size": "29\"",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Aluminum",
            "Groupset": "Shimano XT",
            "Gears": "27 Speed",
            "Color": "Gloss Black",
            "Warranty": "Lifetime warranty on frame"
        }
    },

    // City & Fitness
    {
        id: 4, name: "Avanti Giro F1W", brand: "Avanti", category: "city-fitness", image: avantiF1W, images: [avantiF1W, avantiF1W], color: "Metallic Blue", size: "M", tag: "Sale", price: 36000, originalPrice: 42000, bikeType: "City & Fitness", gears: "24 Speed", frameMaterial: "Aluminum", groupset: "Shimano Deore", brakeType: "Rim Brakes", wheelSize: "700c", rating: 4, reviews: 5, stockStatus: "In Stock",
        features: [
            "Avanti lightweight aluminum frame designed for city commuting",
            "Shimano Deore 24-speed drivetrain for versatile urban shifting",
            "Rim brakes for lightweight simplicity and easy maintenance",
            "700c wheels for efficient road rolling and fitness riding",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "City & Fitness",
            "Wheel Size": "700c",
            "Braking System": "Rim Brakes",
            "Frame Material": "Aluminum",
            "Groupset": "Shimano Deore",
            "Gears": "24 Speed",
            "Color": "Metallic Blue",
            "Warranty": "Lifetime warranty on frame"
        }
    },
    {
        id: 5, name: "Avanti Giro FM 1W", brand: "Avanti", category: "city-fitness", image: avantiFM1W, images: [avantiFM1W, avantiFM1W], color: "White", size: "M", tag: null, price: 39000, bikeType: "City & Fitness", gears: "21 Speed", frameMaterial: "Aluminum", groupset: "Shimano 105", brakeType: "Rim Brakes", wheelSize: "700c", rating: 4, reviews: 3, stockStatus: "In Stock",
        features: [
            "Avanti aluminum step-through frame for easy mounting and comfort",
            "Shimano 105 21-speed drivetrain for smooth city riding",
            "Rim brakes for lightweight, low-maintenance stopping",
            "700c wheels with puncture-resistant tires for daily commuting",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "City & Fitness",
            "Wheel Size": "700c",
            "Braking System": "Rim Brakes",
            "Frame Material": "Aluminum",
            "Groupset": "Shimano 105",
            "Gears": "21 Speed",
            "Color": "White",
            "Warranty": "Lifetime warranty on frame"
        }
    },
    {
        id: 16, name: "Trek FX 3 Disc", brand: "Trek", category: "city-fitness", image: marlin5, images: [marlin5, marlin5], color: "Lithium Grey", size: "M / L", tag: "Fitness", price: 68000, bikeType: "City & Fitness", gears: "18 Speed", frameMaterial: "Aluminum", groupset: "Shimano Deore", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c", rating: 5, reviews: 19, stockStatus: "In Stock",
        features: [
            "Trek Alpha Gold Aluminum frame with carbon fork for vibration damping",
            "Shimano Deore 18-speed drivetrain for fitness and commuter versatility",
            "Hydraulic disc brakes for confident stopping in all weather",
            "700c wheels with lightweight alloy rims for fast rolling",
            "Professional assembly and fine-tuning by Pro-Bikers Chennai experts"
        ],
        specifications: {
            "Intended Use": "City & Fitness",
            "Wheel Size": "700c",
            "Braking System": "Disc Brakes (Hydraulic)",
            "Frame Material": "Aluminum",
            "Groupset": "Shimano Deore",
            "Gears": "18 Speed",
            "Color": "Lithium Grey",
            "Warranty": "Lifetime warranty on frame"
        }
    },
];

// ═════════════════════════════════════════════════════
// NEW STOCK from bikes.json – road, hybrid, mtb
// (only bikes NOT already present as existing entries)
// ═════════════════════════════════════════════════════

const nextId = 100;

interface JsonVariant {
    size: string;
    color: string;
    groupset: string | null;
    condition?: string;
    year?: number;
}

interface JsonBike {
    brand: string;
    category: string;
    product: string;
    variants: JsonVariant[];
}

const jsonStock: JsonBike[] = [
    // ── TREK ROAD ──
    { brand: "Trek", category: "road", product: "Speed Concept", variants: [{ size: "M", color: "Black", groupset: "Shimano Ultegra Di2", condition: "new" }] },
    { brand: "Trek", category: "road", product: "Madone SL6 Gen8", variants: [{ size: "M/L", color: "Crimson", groupset: "Shimano 105 Di2", condition: "new" }] },
    { brand: "Trek", category: "road", product: "Madone SL7 Gen8", variants: [{ size: "M/L", color: "Purple", groupset: "Shimano Ultegra Di2", condition: "new" }] },
    { brand: "Trek", category: "road", product: "Madone SL5 Gen8", variants: [{ size: "L", color: "Black", groupset: "Shimano 105", condition: "new" }] },
    { brand: "Trek", category: "road", product: "Emonda ALR 5", variants: [{ size: "L", color: "Red", groupset: "Shimano 105", condition: "new" }, { size: "S", color: "Black/Grey", groupset: "Shimano 105", condition: "new" }] },
    { brand: "Trek", category: "road", product: "Domane AL5 Gen4", variants: [{ size: "L", color: "Black", groupset: "Shimano 105", condition: "new" }, { size: "XXXS", color: "Black", groupset: "Shimano 105", condition: "new" }] },
    { brand: "Trek", category: "road", product: "Emonda SL5", variants: [{ size: "XS", color: "White", groupset: "Shimano 105 (11-speed)", condition: "new" }] },
    { brand: "Trek", category: "road", product: "Domane AL4 Gen4", variants: [{ size: "M", color: "Blue", groupset: "Shimano Tiagra", condition: "new" }] },
    // ── SCOTT ROAD ──
    { brand: "Scott", category: "road", product: "Addict 20", variants: [{ size: "L", color: "Green", groupset: "Shimano 105", year: 2023 }, { size: "S", color: "Green", groupset: "Shimano 105", year: 2023 }] },
    { brand: "Scott", category: "road", product: "Addict 50", variants: [{ size: "M", color: "Grey", groupset: "Shimano 105", year: 2025 }] },
    { brand: "Scott", category: "road", product: "Speedster Gravel 50", variants: [{ size: "S", color: "Olive Green", groupset: "Shimano Claris" }] },
    { brand: "Scott", category: "road", product: "Speedster 40 Rim", variants: [{ size: "L", color: "Black/Green", groupset: "Shimano Sora" }] },
    { brand: "Scott", category: "road", product: "Speedster 10", variants: [{ size: "XXS", color: "Black", groupset: "Shimano 105" }, { size: "S", color: "Green", groupset: "Shimano 105" }] },
    { brand: "Scott", category: "road", product: "Foil RC 20", variants: [{ size: "M", color: "Light Blue/Black", groupset: "Shimano Ultegra Di2" }] },
    // ── PINARELLO ──
    { brand: "Pinarello", category: "road", product: "Granger Gravel", variants: [{ size: "S", color: "Olive Green", groupset: "Shimano GRX", condition: "used" }] },
    // ── CANNONDALE ──
    { brand: "Cannondale", category: "road", product: "SuperSix Evo", variants: [{ size: "48", color: "Black", groupset: "Shimano 105" }, { size: "54", color: "Black", groupset: "Shimano 105" }, { size: "51", color: "Black", groupset: "Shimano 105" }] },
    { brand: "Cannondale", category: "road", product: "Synapse Carbon", variants: [{ size: "51", color: "Red", groupset: "Shimano 105 Di2" }] },
    { brand: "Cannondale", category: "road", product: "Synapse Hi-Mod", variants: [{ size: "54", color: "Black", groupset: "Shimano Ultegra (11-speed)" }] },
    { brand: "Cannondale", category: "road", product: "Synapse AL", variants: [{ size: "54", color: "Yellow", groupset: "Shimano Claris" }, { size: "54", color: "Grey", groupset: "Shimano Sora" }, { size: "51", color: "Black", groupset: "Shimano 105" }, { size: "51", color: "White", groupset: "Shimano 105" }] },
    { brand: "Cannondale", category: "road", product: "Optimo", variants: [{ size: "51", color: "Blue", groupset: "Shimano Claris" }, { size: "54", color: "Blue", groupset: "Shimano Claris" }] },
    // ── MERIDA ──
    { brand: "Merida", category: "road", product: "Reacto 4000", variants: [{ size: "XS", color: "Dark Blue", groupset: "Shimano 105" }, { size: "XXS", color: "Dark Blue", groupset: "Shimano 105" }, { size: "S", color: "Dark Blue", groupset: "Shimano 105" }] },
    { brand: "Merida", category: "road", product: "Scultura Endurance 4000", variants: [{ size: "XS", color: "Grey", groupset: "Shimano 105" }] },
    { brand: "Merida", category: "road", product: "Scultura 4000", variants: [{ size: "S", color: "Silver", groupset: "Shimano 105" }] },
    // ── COLNAGO ──
    { brand: "Colnago", category: "road", product: "V4RS", variants: [{ size: "M", color: "Black", groupset: "Shimano Ultegra Di2" }] },
    // ── GUERCIOTTI ──
    { brand: "Guerciotti", category: "road", product: "Eureka Air", variants: [{ size: "L", color: "Black", groupset: "Shimano 105 (11-speed)" }] },
    // ── WILIER ──
    { brand: "Wilier", category: "road", product: "GTR Rim", variants: [{ size: "M", color: "Red", groupset: "Shimano 105 (11-speed)" }] },
    // ── LAPIERRE ──
    { brand: "Lapierre", category: "road", product: "Xelius SL7", variants: [{ size: "L", color: "Blue", groupset: "Shimano Ultegra Di2" }] },
    { brand: "Lapierre", category: "road", product: "Aircode DRS", variants: [{ size: "XL", color: "Gold", groupset: "Shimano 105 (11-speed)" }, { size: "M", color: "Blue", groupset: "Shimano 105 (11-speed)", condition: "used" }] },
    // ── ARGON 18 ──
    { brand: "Argon 18", category: "road", product: "Nitrogen", variants: [{ size: "L", color: "Blue/Grey", groupset: "Shimano 105" }] },
    // ── BERGAMONT ──
    { brand: "Bergamont", category: "road", product: "Grandurance Elite", variants: [{ size: "L", color: "Black", groupset: "Shimano 105" }] },
    { brand: "Bergamont", category: "road", product: "Grandurance RB3", variants: [{ size: "L", color: "Silver", groupset: "Shimano Claris" }] },
    // ── CIPOLLINI ──
    { brand: "Cipollini", category: "road", product: "Bond", variants: [{ size: "XS", color: "Blue", groupset: "Shimano 105" }] },
    // ── POLYGON ──
    { brand: "Polygon", category: "road", product: "Stratos S5D", variants: [{ size: "M", color: "White", groupset: "Shimano 105" }] },
    { brand: "Polygon", category: "road", product: "Stratos S2", variants: [{ size: "S", color: "Light Blue", groupset: "Shimano Claris" }, { size: "M", color: "Light Blue", groupset: "Shimano Claris" }, { size: "L", color: "Light Blue", groupset: "Shimano Claris" }] },
    { brand: "Polygon", category: "road", product: "Stratos 3", variants: [{ size: "S", color: "Dark Brown", groupset: "Shimano Sora" }] },
    { brand: "Polygon", category: "road", product: "Stratos 4", variants: [{ size: "M", color: "Orangish Brown", groupset: null }] },
    // ── BOTTACHIA ──
    { brand: "Bottachia", category: "road", product: "Duello", variants: [{ size: "L", color: "Red", groupset: "Campagnolo" }] },

    // ── TREK HYBRID ──
    { brand: "Trek", category: "hybrid", product: "FX3", variants: [{ size: "S", color: "Grey", groupset: "Shimano Deore" }, { size: "M", color: "Red", groupset: "Shimano Deore" }, { size: "L", color: "Maroon", groupset: "Shimano Deore" }, { size: "XL", color: "Grey", groupset: "Shimano Deore" }] },
    { brand: "Trek", category: "hybrid", product: "FX2", variants: [{ size: "L", color: "Blue", groupset: "Shimano Altus" }] },
    { brand: "Trek", category: "hybrid", product: "Dual Sport", variants: [{ size: "M", color: "Black", groupset: "Shimano Altus" }] },
    { brand: "Scott", category: "hybrid", product: "Sub Cross 50", variants: [{ size: "M", color: "Olive Green", groupset: "Shimano Tourney" }] },

    // ── TREK MTB ──
    { brand: "Trek", category: "mtb", product: "Marlin 5", variants: [{ size: "M", color: "Blue", groupset: "Shimano Cues" }] },
    { brand: "Trek", category: "mtb", product: "Marlin 4", variants: [{ size: "M", color: "Purple", groupset: "Shimano Essa" }, { size: "L", color: "Black", groupset: "Shimano Essa" }] },
    { brand: "Scott", category: "mtb", product: "Aspect 960", variants: [{ size: "L", color: "Orange", groupset: "Shimano Tourney" }] },
    { brand: "Polygon", category: "mtb", product: "Cascade 2", variants: [{ size: "M", color: "Blue", groupset: "Shimano Tourney" }] },

    // ── USED STOCK ──
    { brand: "Java", category: "road", product: "Fuoco Disc", variants: [{ size: "S", color: "Ash", groupset: "Shimano 105 (11-speed)", condition: "used" }] },
    { brand: "Trek", category: "road", product: "Domane AL5 Gen4 (Used)", variants: [{ size: "S", color: "Green", groupset: "Shimano 105 (11-speed)", condition: "used" }] },
];

// ═════════════════════════════════════════════════════
// PRE-OWNED BIKES from Excel (Status = Available)
// ═════════════════════════════════════════════════════
const excelPreOwned: JsonBike[] = [
    // HYBRID
    { brand: "Bergamont", category: "hybrid", product: "Helix 1.5i", variants: [{ size: "M", color: "Blue", groupset: "Shimano Tourney", condition: "used" }] },
    { brand: "Firefox", category: "hybrid", product: "Meteor", variants: [{ size: "M", color: "Blue", groupset: "Shimano Tourney", condition: "used" }] },
    { brand: "Giant", category: "hybrid", product: "Escape", variants: [{ size: "XL", color: "Blue", groupset: "Shimano Altus", condition: "used" }] },
    { brand: "Veloce", category: "hybrid", product: "Junior", variants: [{ size: "24", color: "Red", groupset: "Shimano Tourney", condition: "used" }] },
    { brand: "Shnell", category: "hybrid", product: "1000", variants: [{ size: "L", color: "Grey", groupset: "Shimano Tourney", condition: "used" }] },
    { brand: "Fantom", category: "hybrid", product: "SS", variants: [{ size: "M", color: "Red / Black", groupset: "Shimano Tourney", condition: "used" }] },
    { brand: "Keysto", category: "hybrid", product: "Hybrid", variants: [{ size: "M", color: "Black", groupset: "Shimano Tourney", condition: "used" }] },
    { brand: "Polygon", category: "hybrid", product: "Kids 20", variants: [{ size: "20", color: "Black / Blue", groupset: "Shimano Tourney", condition: "used" }] },
    { brand: "Schwinn", category: "hybrid", product: "Hybrid", variants: [{ size: "M", color: "Blue", groupset: "Shimano Tourney", condition: "used" }] },
    // ROAD
    { brand: "Marin", category: "road", product: "Nicasio", variants: [{ size: "S", color: "Black", groupset: "Shimano Claris", condition: "used" }] },
    { brand: "Urban", category: "road", product: "Track", variants: [{ size: "M", color: "White", groupset: "Shimano Tourney", condition: "used" }] },
    { brand: "Trek", category: "road", product: "Domane AL5 Claris", variants: [{ size: "XXS", color: "Black", groupset: "Shimano Claris", condition: "used" }] },
    { brand: "Trek", category: "road", product: "Domane AL5", variants: [{ size: "XL", color: "Green", groupset: "Shimano 105", condition: "used" }] },
    { brand: "Titanium", category: "road", product: "Road Bike", variants: [{ size: "M", color: "Silver", groupset: "Shimano 105", condition: "used" }] },
    { brand: "Lapierre", category: "road", product: "Road", variants: [{ size: "M", color: "Black", groupset: "Shimano 105", condition: "used" }] },
    // MTB
    { brand: "Marin", category: "mtb", product: "MTB", variants: [{ size: "M", color: "Blue", groupset: "Shimano Deore", condition: "used" }] },
    { brand: "GT", category: "mtb", product: "Avalanche Sport", variants: [{ size: "M", color: "Black", groupset: "Shimano Deore", condition: "used" }] },
    { brand: "Scott", category: "mtb", product: "Scale 940", variants: [{ size: "S", color: "Red", groupset: "SRAM Eagle NX", condition: "used" }] },
    { brand: "Surly", category: "mtb", product: "Moonlander Fat Bike", variants: [{ size: "L", color: "Light Brown", groupset: "Shimano XT", condition: "used" }] },
];

// ═════════════════════════════════════════════════════
// Convert JSON entries into Bike objects
// ═════════════════════════════════════════════════════
// FINAL COMBINED EXPORT
// ═════════════════════════════════════════════════════
// Hardcoded bikes removed. We only use db_products now.
export const bikes: Bike[] = [];

// Derive unique brands and their categories from the data
export const bikeBrands = (() => {
    const brandMap = new Map<string, Set<string>>();
    bikes.forEach((bike) => {
        if (!brandMap.has(bike.brand)) brandMap.set(bike.brand, new Set());
        brandMap.get(bike.brand)!.add(bike.category);
    });
    return Array.from(brandMap.entries()).map(([name, cats]) => ({
        name,
        categories: Array.from(cats),
    }));
})();
