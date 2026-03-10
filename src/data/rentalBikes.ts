import argon18 from "@/assets/bikes/argon18-nitrogen.png";
import avantiF1W from "@/assets/bikes/avanti-giro-f1w.png";
import avantiFM1W from "@/assets/bikes/avanti-giro-fm1w.png";
import lapierre from "@/assets/bikes/lapierre-aircode-drs.png";
import scottPlasma from "@/assets/bikes/scott-plasma-10.png";
import marlin5 from "@/assets/bikes/trek-marlin5.png";

export type RentalCategory = "road" | "hybrid" | "mtb";

export interface RentalBike {
  id: number;
  name: string;
  brand: string;
  category: RentalCategory;
  image: string;
  description: string;
  pricePerDay: number;
  available: number;
  features: string[];
}

export const rentalCategories: { key: RentalCategory; label: string; description: string }[] = [
  { key: "road", label: "Road Bikes", description: "Performance bikes for speed on paved roads" },
  { key: "hybrid", label: "Hybrid Bikes", description: "Versatile bikes for city and light trails" },
  { key: "mtb", label: "MTB", description: "Mountain bikes for rugged trails and off-road" },
];

export const rentalBikes: RentalBike[] = [
  // Road Bikes
  {
    id: 101,
    name: "Argon 18 Nitrogen",
    brand: "Argon 18",
    category: "road",
    image: argon18,
    description: "High-performance carbon road bike for speed enthusiasts",
    pricePerDay: 2500,
    available: 5,
    features: ["Carbon Frame", "Shimano Ultegra", "Disc Brakes", "700c Wheels"],
  },
  {
    id: 102,
    name: "Scott Plasma 10",
    brand: "Scott",
    category: "road",
    image: scottPlasma,
    description: "Triathlon and time trial bike for competitive riders",
    pricePerDay: 3000,
    available: 3,
    features: ["Carbon Frame", "Shimano Ultegra", "Aerodynamic", "700c Wheels"],
  },
  {
    id: 103,
    name: "Lapierre Aircode DRS",
    brand: "Lapierre",
    category: "road",
    image: lapierre,
    description: "Lightweight aero road bike for racing",
    pricePerDay: 2800,
    available: 4,
    features: ["Carbon Frame", "Shimano 105", "Disc Brakes", "700c Wheels"],
  },
  // Hybrid Bikes
  {
    id: 201,
    name: "Avanti Giro F1W",
    brand: "Avanti",
    category: "hybrid",
    image: avantiF1W,
    description: "Comfortable hybrid bike for city commuting and leisure rides",
    pricePerDay: 800,
    available: 8,
    features: ["Aluminum Frame", "24 Speed", "Rim Brakes", "700c Wheels"],
  },
  {
    id: 202,
    name: "Avanti Giro FM 1W",
    brand: "Avanti",
    category: "hybrid",
    image: avantiFM1W,
    description: "Stylish hybrid bike for everyday urban riding",
    pricePerDay: 700,
    available: 6,
    features: ["Aluminum Frame", "21 Speed", "Rim Brakes", "700c Wheels"],
  },
  {
    id: 203,
    name: "Trek FX 3 Disc",
    brand: "Trek",
    category: "hybrid",
    image: marlin5,
    description: "Fitness hybrid with disc brakes for all-weather riding",
    pricePerDay: 900,
    available: 5,
    features: ["Aluminum Frame", "18 Speed", "Hydraulic Disc", "700c Wheels"],
  },
  // MTB
  {
    id: 301,
    name: "Trek Marlin 5 Gen 3",
    brand: "Trek",
    category: "mtb",
    image: marlin5,
    description: "Popular entry-level mountain bike for trails",
    pricePerDay: 1200,
    available: 10,
    features: ["Aluminum Frame", "18 Speed", "Hydraulic Disc", "29\" Wheels"],
  },
  {
    id: 302,
    name: "Scott Spark 960",
    brand: "Scott",
    category: "mtb",
    image: scottPlasma,
    description: "Full suspension trail bike for aggressive riding",
    pricePerDay: 2000,
    available: 4,
    features: ["Carbon Frame", "24 Speed", "Full Suspension", "29\" Wheels"],
  },
  {
    id: 303,
    name: "Scott Scale 970",
    brand: "Scott",
    category: "mtb",
    image: scottPlasma,
    description: "Cross-country race bike for competitive MTB",
    pricePerDay: 1800,
    available: 3,
    features: ["Carbon Frame", "24 Speed", "Hardtail", "29\" Wheels"],
  },
];

export const getBikesByCategory = (category: RentalCategory): RentalBike[] => {
  return rentalBikes.filter((bike) => bike.category === category);
};

