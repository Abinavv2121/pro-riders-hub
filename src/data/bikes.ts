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
] as const;

export type BikeCategory = (typeof bikeCategories)[number]["key"];

// Filter options
export const bikeTypes = ["Race Road", "Endurance Road", "Gravel", "MTB", "City & Fitness"];
export const bikeSizes = ["XS", "S", "M", "L", "XL", "M / L", "S / M", "M / L / XL"];
export const bikeGears = ["8 Speed", "9 Speed", "10 Speed", "11 Speed", "12 Speed", "18 Speed", "20 Speed", "24 Speed", "27 Speed"];
export const frameMaterials = ["Carbon", "Aluminum", "Steel", "Titanium", "Carbon Fiber"];
export const groupsets = ["Shimano 105", "Shimano Ultegra", "Shimano Dura-Ace", "Shimano Deore", "Shimano XT", "Shimano XTR", "SRAM Rival", "SRAM Force", "SRAM Red", "Campagnolo Chorus", "Campagnolo Record"];
export const brakeTypes = ["Rim Brakes", "Disc Brakes (Mechanical)", "Disc Brakes (Hydraulic)", "Hydraulic Disc"];
export const wheelSizes = ["26\"", "27.5\"", "29\"", "700c", "650b"];
export const priceRanges = [
    { label: "Under ₹50,000", min: 0, max: 50000 },
    { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
    { label: "₹1,00,000 - ₹1,50,000", min: 100000, max: 150000 },
    { label: "₹1,50,000 - ₹2,00,000", min: 150000, max: 200000 },
    { label: "Above ₹2,00,000", min: 200000, max: Infinity },
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
    bikeType: string;
    gears: string;
    frameMaterial: string;
    groupset: string;
    brakeType: string;
    wheelSize: string;
}

export const bikes: Bike[] = [
    // Race Road
    { id: 1, name: "Argon 18 Nitrogen", brand: "Argon 18", category: "race-road", image: argon18, images: [argon18, argon18, argon18], color: "Silver Blue", size: "L", tag: "New Arrival", price: 190000, bikeType: "Race Road", gears: "22 Speed", frameMaterial: "Carbon", groupset: "Shimano Ultegra", brakeType: "Disc Brakes (Mechanical)", wheelSize: "700c" },
    { id: 2, name: "Lapierre Aircode DRS 5.0", brand: "Lapierre", category: "race-road", image: lapierre, images: [lapierre, lapierre], color: "Gold / Black", size: "M / L", tag: "Disc", price: 215000, bikeType: "Race Road", gears: "22 Speed", frameMaterial: "Carbon", groupset: "Shimano 105", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c" },
    { id: 3, name: "Scott Plasma 10", brand: "Scott", category: "race-road", image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Yellow / Black", size: "M", tag: "Triathlon", price: 220000, bikeType: "Race Road", gears: "24 Speed", frameMaterial: "Carbon", groupset: "Shimano Ultegra", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c" },
    { id: 7, name: "Scott Addict RC", brand: "Scott", category: "race-road", image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Black / Red", size: "M / L", tag: "Pro", price: 245000, bikeType: "Race Road", gears: "24 Speed", frameMaterial: "Carbon", groupset: "Shimano Dura-Ace", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c" },

    // Endurance Road
    { id: 8, name: "Trek Domane AL 5", brand: "Trek", category: "endurance-road", image: marlin5, images: [marlin5, marlin5], color: "Crimson Red", size: "M / L", tag: "Endurance", price: 135000, bikeType: "Endurance Road", gears: "16 Speed", frameMaterial: "Aluminum", groupset: "Shimano 105", brakeType: "Disc Brakes (Mechanical)", wheelSize: "700c" },
    { id: 9, name: "Lapierre Xelius SL 5.0", brand: "Lapierre", category: "endurance-road", image: lapierre, images: [lapierre, lapierre], color: "Blue / White", size: "M / L", tag: null, price: 195000, bikeType: "Endurance Road", gears: "22 Speed", frameMaterial: "Carbon", groupset: "Shimano Ultegra", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c" },
    { id: 10, name: "Argon 18 Gallium Pro", brand: "Argon 18", category: "endurance-road", image: argon18, images: [argon18, argon18], color: "Matte Black", size: "M / L", tag: "Premium", price: 210000, bikeType: "Endurance Road", gears: "22 Speed", frameMaterial: "Carbon", groupset: "Shimano Dura-Ace", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c" },

    // Gravel & Adventure
    { id: 11, name: "Scott Speedster CX 20 Disc", brand: "Scott", category: "gravel", image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Dark Grey", size: "M / L", tag: "Adventure", price: 165000, bikeType: "Gravel", gears: "20 Speed", frameMaterial: "Carbon", groupset: "Shimano 105", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c" },
    { id: 12, name: "Marin Nicasio 2", brand: "Marin", category: "gravel", image: marlin5, images: [marlin5, marlin5], color: "Satin Black", size: "M / L", tag: "Gravel", price: 95000, bikeType: "Gravel", gears: "18 Speed", frameMaterial: "Steel", groupset: "Shimano Deore", brakeType: "Disc Brakes (Mechanical)", wheelSize: "700c" },

    // MTB (XC & Trail)
    { id: 6, name: "Trek Marlin 5 Gen 3", brand: "Trek", category: "mtb", image: marlin5, images: [marlin5, marlin5], color: "Matte Dark", size: "M / L / XL", tag: "Popular", price: 75000, bikeType: "MTB", gears: "18 Speed", frameMaterial: "Aluminum", groupset: "Shimano Deore", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "29\"" },
    { id: 13, name: "Scott Spark 960", brand: "Scott", category: "mtb", image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Stellar Blue", size: "M / L", tag: "Trail", price: 185000, bikeType: "MTB", gears: "24 Speed", frameMaterial: "Carbon", groupset: "Shimano XT", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "29\"" },
    { id: 14, name: "Scott Scale 970", brand: "Scott", category: "mtb", image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Prism Green", size: "M / L", tag: "XC", price: 155000, bikeType: "MTB", gears: "24 Speed", frameMaterial: "Carbon", groupset: "Shimano XT", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "29\"" },
    { id: 15, name: "Marin Rift Zone 29", brand: "Marin", category: "mtb", image: marlin5, images: [marlin5, marlin5], color: "Gloss Black", size: "M / L", tag: "Trail", price: 175000, bikeType: "MTB", gears: "27 Speed", frameMaterial: "Aluminum", groupset: "Shimano XT", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "29\"" },

    // City & Fitness
    { id: 4, name: "Avanti Giro F1W", brand: "Avanti", category: "city-fitness", image: avantiF1W, images: [avantiF1W, avantiF1W], color: "Metallic Blue", size: "M", tag: null, price: 42000, bikeType: "City & Fitness", gears: "24 Speed", frameMaterial: "Aluminum", groupset: "Shimano Deore", brakeType: "Rim Brakes", wheelSize: "700c" },
    { id: 5, name: "Avanti Giro FM 1W", brand: "Avanti", category: "city-fitness", image: avantiFM1W, images: [avantiFM1W, avantiFM1W], color: "White", size: "M", tag: null, price: 39000, bikeType: "City & Fitness", gears: "21 Speed", frameMaterial: "Aluminum", groupset: "Shimano 105", brakeType: "Rim Brakes", wheelSize: "700c" },
    { id: 16, name: "Trek FX 3 Disc", brand: "Trek", category: "city-fitness", image: marlin5, images: [marlin5, marlin5], color: "Lithium Grey", size: "M / L", tag: "Fitness", price: 68000, bikeType: "City & Fitness", gears: "18 Speed", frameMaterial: "Aluminum", groupset: "Shimano Deore", brakeType: "Disc Brakes (Hydraulic)", wheelSize: "700c" },
];

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

