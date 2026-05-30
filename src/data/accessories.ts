import { brandsBySubcategory } from "./brands";

export interface AccessorySubcategory {
  name: string;
  items?: string[];
  href: string;
}

export interface AccessoryCategory {
  name: string;
  href: string;
  subcategories?: AccessorySubcategory[];
}

export const accessoryCategories: AccessoryCategory[] = [
  {
    name: "Helmets",
    href: "/shop?category=helmets",
    subcategories: [
      { name: "Aero", href: "/shop?category=helmets&type=aero" },
      { name: "Road", href: "/shop?category=helmets&type=road" },
      { name: "MTB", href: "/shop?category=helmets&type=mtb" },
      { name: "Commute", href: "/shop?category=helmets&type=commute" },
      { name: "Kids", href: "/shop?category=helmets&type=kids" },
    ],
  },
  {
    name: "Lights",
    href: "/shop?category=lights",
    subcategories: [
      { name: "Front", href: "/shop?category=lights&type=front" },
      { name: "Rear", href: "/shop?category=lights&type=rear" },
      { name: "Combo", href: "/shop?category=lights&type=combo" },
      { name: "Mounts", href: "/shop?category=lights&type=mounts" },
    ],
  },
  {
    name: "Bags",
    href: "/shop?category=bags",
  },
  {
    name: "Hydration",
    href: "/shop?category=hydration",
    subcategories: [
      { name: "Bottles", href: "/shop?category=hydration&type=bottles" },
      { name: "Bottle Cage", href: "/shop?category=hydration&type=cage" },
    ],
  },
  {
    name: "Car Racks",
    href: "/shop?category=car-racks",
  },
  {
    name: "Record Your Training",
    href: "/shop?category=training-tech",
    subcategories: [
      { name: "Computers", href: "/shop?category=training-tech&type=computers" },
      { name: "Sensors", href: "/shop?category=training-tech&type=sensors" },
      { name: "Computer Mounts", href: "/shop?category=training-tech&type=mounts" },
      { name: "Heart Rate Monitors", href: "/shop?category=training-tech&type=hrm" },
      { name: "Power Meters", href: "/shop?category=training-tech&type=power" },
      { name: "Smartwatches", href: "/shop?category=training-tech&type=smartwatch" },
      { name: "Earphones", href: "/shop?category=training-tech&type=earphones" },
    ],
  },
  {
    name: "Indoor Training",
    href: "/shop?category=indoor-training",
    subcategories: [
      { name: "Trainers & Rollers", href: "/shop?category=indoor-training&type=trainers" },
      { name: "Floor Mats", href: "/shop?category=indoor-training&type=mats" },
      { name: "Trainer Accessories", href: "/shop?category=indoor-training&type=accessories" },
    ],
  },
];

export const apparelCategories = [
  { name: "Cycling Jerseys", href: "/shop?category=jerseys" },
  { name: "Cycling Shorts", href: "/shop?category=shorts" },
  { name: "Cycling Bib Shorts", href: "/shop?category=bib-shorts" },
  { name: "Gloves", href: "/shop?category=gloves" },
  { name: "Arm Covers", href: "/shop?category=arm-covers" },
  { name: "Leg Covers", href: "/shop?category=leg-covers" },
  { name: "Cycling Shoes", href: "/shop?category=shoes" },
  { name: "Cycling Shoe Covers", href: "/shop?category=shoe-covers" },
];

export const accessoryBrands = {
  Helmets: brandsBySubcategory.helmets,
  Lights: brandsBySubcategory.lights,
  "Bottle Cage": brandsBySubcategory.bottleCage,
  Hydration: brandsBySubcategory.bottleCage,
  Bags: ["Trek", "Bontrager", "Topeak", "Ortlieb"],
  "Car Racks": ["Thule", "Saris", "Yakima"],
  "Record Your Training": ["Garmin", "Wahoo", "Bryton", "Magene"],
  "Indoor Training": ["Wahoo", "Tacx", "Elite", "Minoura", "Magene"],
};

export const apparelBrands = {
  "Cycling Jerseys": brandsBySubcategory.jerseys,
  "Cycling Shorts": ["Castelli", "Shimano", "Apace", "Scott"],
  "Cycling Bib Shorts": brandsBySubcategory.bibShorts,
  Gloves: brandsBySubcategory.gloves,
  "Arm Covers": ["Castelli", "Apace", "Prong Horn"],
  "Leg Covers": ["Castelli", "Apace", "Prong Horn"],
  "Cycling Shoes": ["Shimano", "Sidi", "Giro", "Specialized", "Scott"],
  "Cycling Shoe Covers": ["Castelli", "Shimano", "Giro"],
};
