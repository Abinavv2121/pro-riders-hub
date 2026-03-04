import argon18 from "@/assets/bikes/argon18-nitrogen.png";
import avantiF1W from "@/assets/bikes/avanti-giro-f1w.png";
import avantiFM1W from "@/assets/bikes/avanti-giro-fm1w.png";
import lapierre from "@/assets/bikes/lapierre-aircode-drs.png";
import scottPlasma from "@/assets/bikes/scott-plasma-10.png";
import marlin5 from "@/assets/bikes/trek-marlin5.png";

export const bikeCategories = [
    { key: "race-road", label: "Race Road" },
    { key: "endurance-road", label: "Endurance Road" },
    { key: "gravel", label: "Gravel & Adventure" },
    { key: "mtb", label: "MTB (XC & Trail)" },
    { key: "city-fitness", label: "City & Fitness" },
] as const;

export type BikeCategory = (typeof bikeCategories)[number]["key"];

export const bikes = [
    // Race Road
    { id: 1, name: "Argon 18 Nitrogen", brand: "Argon 18", category: "race-road" as BikeCategory, image: argon18, images: [argon18, argon18, argon18], color: "Silver Blue", size: "L", tag: "New Arrival", price: 190000 },
    { id: 2, name: "Lapierre Aircode DRS 5.0", brand: "Lapierre", category: "race-road" as BikeCategory, image: lapierre, images: [lapierre, lapierre], color: "Gold / Black", size: "M / L", tag: "Disc", price: 215000 },
    { id: 3, name: "Scott Plasma 10", brand: "Scott", category: "race-road" as BikeCategory, image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Yellow / Black", size: "M", tag: "Triathlon", price: 220000 },
    { id: 7, name: "Scott Addict RC", brand: "Scott", category: "race-road" as BikeCategory, image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Black / Red", size: "M / L", tag: "Pro", price: 245000 },

    // Endurance Road
    { id: 8, name: "Trek Domane AL 5", brand: "Trek", category: "endurance-road" as BikeCategory, image: marlin5, images: [marlin5, marlin5], color: "Crimson Red", size: "M / L", tag: "Endurance", price: 135000 },
    { id: 9, name: "Lapierre Xelius SL 5.0", brand: "Lapierre", category: "endurance-road" as BikeCategory, image: lapierre, images: [lapierre, lapierre], color: "Blue / White", size: "M / L", tag: null, price: 195000 },
    { id: 10, name: "Argon 18 Gallium Pro", brand: "Argon 18", category: "endurance-road" as BikeCategory, image: argon18, images: [argon18, argon18], color: "Matte Black", size: "M / L", tag: "Premium", price: 210000 },

    // Gravel & Adventure
    { id: 11, name: "Scott Speedster CX 20 Disc", brand: "Scott", category: "gravel" as BikeCategory, image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Dark Grey", size: "M / L", tag: "Adventure", price: 165000 },
    { id: 12, name: "Marin Nicasio 2", brand: "Marin", category: "gravel" as BikeCategory, image: marlin5, images: [marlin5, marlin5], color: "Satin Black", size: "M / L", tag: "Gravel", price: 95000 },

    // MTB (XC & Trail)
    { id: 6, name: "Trek Marlin 5 Gen 3", brand: "Trek", category: "mtb" as BikeCategory, image: marlin5, images: [marlin5, marlin5], color: "Matte Dark", size: "M / L / XL", tag: "Popular", price: 75000 },
    { id: 13, name: "Scott Spark 960", brand: "Scott", category: "mtb" as BikeCategory, image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Stellar Blue", size: "M / L", tag: "Trail", price: 185000 },
    { id: 14, name: "Scott Scale 970", brand: "Scott", category: "mtb" as BikeCategory, image: scottPlasma, images: [scottPlasma, scottPlasma], color: "Prism Green", size: "M / L", tag: "XC", price: 155000 },
    { id: 15, name: "Marin Rift Zone 29", brand: "Marin", category: "mtb" as BikeCategory, image: marlin5, images: [marlin5, marlin5], color: "Gloss Black", size: "M / L", tag: "Trail", price: 175000 },

    // City & Fitness
    { id: 4, name: "Avanti Giro F1W", brand: "Avanti", category: "city-fitness" as BikeCategory, image: avantiF1W, images: [avantiF1W, avantiF1W], color: "Metallic Blue", size: "M", tag: null, price: 42000 },
    { id: 5, name: "Avanti Giro FM 1W", brand: "Avanti", category: "city-fitness" as BikeCategory, image: avantiFM1W, images: [avantiFM1W, avantiFM1W], color: "White", size: "M", tag: null, price: 39000 },
    { id: 16, name: "Trek FX 3 Disc", brand: "Trek", category: "city-fitness" as BikeCategory, image: marlin5, images: [marlin5, marlin5], color: "Lithium Grey", size: "M / L", tag: "Fitness", price: 68000 },
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
