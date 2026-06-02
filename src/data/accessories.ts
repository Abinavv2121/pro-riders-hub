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
    href: "/accessories?category=helmets",
    subcategories: [
      { name: "Aero", href: "/accessories?category=helmets&type=aero" },
      { name: "Road", href: "/accessories?category=helmets&type=road" },
      { name: "MTB", href: "/accessories?category=helmets&type=mtb" },
      { name: "Commute", href: "/accessories?category=helmets&type=commute" },
      { name: "Kids", href: "/accessories?category=helmets&type=kids" },
    ],
  },
  {
    name: "Lights",
    href: "/accessories?category=lights",
    subcategories: [
      { name: "Front", href: "/accessories?category=lights&type=front" },
      { name: "Rear", href: "/accessories?category=lights&type=rear" },
      { name: "Combo", href: "/accessories?category=lights&type=combo" },
      { name: "Mounts", href: "/accessories?category=lights&type=mounts" },
    ],
  },
  {
    name: "Bags",
    href: "/accessories?category=bags",
  },
  {
    name: "Hydration",
    href: "/accessories?category=hydration",
    subcategories: [
      { name: "Bottles", href: "/accessories?category=hydration&type=bottles" },
      { name: "Bottle Cage", href: "/accessories?category=hydration&type=cage" },
    ],
  },
  {
    name: "Car Racks",
    href: "/accessories?category=car-racks",
  },
  {
    name: "Record Your Training",
    href: "/accessories?category=training-tech",
    subcategories: [
      { name: "Computers", href: "/accessories?category=training-tech&type=computers" },
      { name: "Sensors", href: "/accessories?category=training-tech&type=sensors" },
      { name: "Computer Mounts", href: "/accessories?category=training-tech&type=mounts" },
      { name: "Heart Rate Monitors", href: "/accessories?category=training-tech&type=hrm" },
      { name: "Power Meters", href: "/accessories?category=training-tech&type=power" },
      { name: "Smartwatches", href: "/accessories?category=training-tech&type=smartwatch" },
      { name: "Earphones", href: "/accessories?category=training-tech&type=earphones" },
    ],
  },
  {
    name: "Indoor Training",
    href: "/accessories?category=indoor-training",
    subcategories: [
      { name: "Trainers & Rollers", href: "/accessories?category=indoor-training&type=trainers" },
      { name: "Floor Mats", href: "/accessories?category=indoor-training&type=mats" },
      { name: "Trainer Accessories", href: "/accessories?category=indoor-training&type=accessories" },
    ],
  },
];

export const apparelCategories = [
  { name: "Cycling Jerseys", href: "/apparels?category=jerseys" },
  { name: "Cycling Shorts", href: "/apparels?category=shorts" },
  { name: "Cycling Bib Shorts", href: "/apparels?category=bib-shorts" },
  { name: "Gloves", href: "/apparels?category=gloves" },
  { name: "Arm Covers", href: "/apparels?category=arm-covers" },
  { name: "Leg Covers", href: "/apparels?category=leg-covers" },
  { name: "Cycling Shoes", href: "/apparels?category=shoes" },
  { name: "Cycling Shoe Covers", href: "/apparels?category=shoe-covers" },
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
