import argon18 from "@/assets/bikes/argon18-nitrogen.png";
import lapierre from "@/assets/bikes/lapierre-aircode-drs.png";
import scottPlasma from "@/assets/bikes/scott-plasma-10.png";
import avantiF1W from "@/assets/bikes/avanti-giro-f1w.png";
import avantiFM1W from "@/assets/bikes/avanti-giro-fm1w.png";
import marlin5 from "@/assets/bikes/trek-marlin5.png";

export const bikes = [
    { id: 1, name: "Argon 18 Nitrogen", brand: "Argon 18", category: "road", image: argon18, color: "Silver Blue", size: "L", tag: "New Arrival" },
    { id: 2, name: "Lapierre Aircode DRS 5.0", brand: "Lapierre", category: "road", image: lapierre, color: "Gold / Black", size: "M / L", tag: "Disc" },
    { id: 3, name: "Scott Plasma 10", brand: "Scott", category: "road", image: scottPlasma, color: "Yellow / Black", size: "M", tag: "Triathlon" },
    { id: 4, name: "Avanti Giro F1W", brand: "Avanti", category: "hybrid", image: avantiF1W, color: "Metallic Blue", size: "M", tag: null },
    { id: 5, name: "Avanti Giro FM 1W", brand: "Avanti", category: "hybrid", image: avantiFM1W, color: "White", size: "M", tag: null },
    { id: 6, name: "Trek Marlin 5 Gen 3", brand: "Trek", category: "mtb", image: marlin5, color: "Matte Dark", size: "M / L / XL", tag: "Popular" },
];
