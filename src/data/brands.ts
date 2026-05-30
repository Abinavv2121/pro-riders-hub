// Cycle Brands Currently Dealing
export const cycleBrandsDealing = [
  "Trek",
  "Scott",
  "Merida",
  "Lapierre"
] as const;

// Additional Cycle Brands
export const cycleBrandsAdditional = [
  "Colnago",
  "Cannondale",
  "BMC",
  "Cervelo",
  "Specialized",
  "Willier",
  "Wilier",
  "Polygon",
  "Surly",
  "Avanti",
  "Pinarello",
  "BH",
  "Argon 18",
  "Marin",
  "Look",
  "Guerciotti",
  "Cipollini",
  "Bergamont",
  "Bottachia",
  "Java",
  "Giant",
  "GT",
  "Firefox",
  "Veloce",
  "Shnell",
  "Fantom",
  "Keysto",
  "Schwinn",
  "Urban",
  "Titanium"
] as const;

export const cycleBrands = [...cycleBrandsDealing, ...cycleBrandsAdditional] as const;

// Accessory and Apparel Brands by Category/Type
export const brandsBySubcategory = {
  helmets: ["HJC", "GIRO", "Bell", "Trek", "Gist", "Kask", "Bontrager", "Lazer", "Met", "Scott", "Abus", "POC", "Raleigh", "Zakpro"],
  jerseys: ["Castelli", "Gambit", "Probikers-Prong Horn", "Polygon", "Probikers-Psychallov"],
  bibShorts: ["Castelli", "Gambit", "Shimano", "Sportful", "Scott", "Gist", "Assos", "Prong Horn", "2XU", "Apace", "Tenn", "RBX", "Bianchi"],
  gloves: ["Castelli", "Zakpro", "Prong Horn", "Giro"],
  lights: ["Cat-eye", "Blackburn", "Magicsign", "Ravemen", "NR", "Knog", "Syncross", "91"],
  barTape: ["Ciclovation", "Trek", "Prologo", "GoodHorse", "Shimano", "Quee", "3T"],
  bottleCage: ["Trek", "Zipp", "TopPeak", "Zefal", "Probike", "Krutials"]
} as const;
