import { accessoryBrands, apparelBrands, accessoryCategories } from "./accessories";

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  type: "apparel" | "accessory";
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  tag?: string;
  size: string;
  color: string;
  rating?: number;
  reviews?: number;
  stockStatus?: string;
  features?: string[];
  specifications?: Record<string, string>;
  description?: string;
}

export const products: Product[] = [];

let currentId = 2000;

const getRandomPrice = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const apparelCategoryKeys: Record<string, string> = {
  "Cycling Jerseys": "jerseys",
  "Cycling Shorts": "shorts",
  "Cycling Bib Shorts": "bib-shorts",
  "Gloves": "gloves",
  "Arm Covers": "arm-covers",
  "Leg Covers": "leg-covers",
  "Cycling Shoes": "shoes",
  "Cycling Shoe Covers": "shoe-covers",
};

const apparelPriceRanges: Record<string, [number, number]> = {
  "jerseys": [1500, 5000],
  "shorts": [2000, 6000],
  "bib-shorts": [3000, 8000],
  "gloves": [800, 2500],
  "arm-covers": [500, 1500],
  "leg-covers": [800, 2000],
  "shoes": [5000, 25000],
  "shoe-covers": [1000, 3000],
};

const accessoryCategoryKeys: Record<string, string> = {
  "Helmets": "helmets",
  "Lights": "lights",
  "Bags": "bags",
  "Hydration": "hydration",
  "Car Racks": "car-racks",
  "Record Your Training": "training-tech",
  "Indoor Training": "indoor-training",
};

const accessoryPriceRanges: Record<string, [number, number]> = {
  "helmets": [2000, 15000],
  "lights": [1000, 5000],
  "bags": [1500, 8000],
  "hydration": [500, 2000],
  "car-racks": [5000, 20000],
  "training-tech": [10000, 50000],
  "indoor-training": [15000, 80000],
};

// Generate Apparels (2000-2999)
Object.entries(apparelBrands).forEach(([categoryName, brands]) => {
  const categoryKey = apparelCategoryKeys[categoryName];
  const [minPrice, maxPrice] = apparelPriceRanges[categoryKey] || [1000, 5000];

  brands.forEach((brand) => {
    // Generate 2-3 products per brand per category
    const numProducts = Math.floor(Math.random() * 2) + 2; 

    for (let i = 1; i <= numProducts; i++) {
      const price = getRandomPrice(minPrice, maxPrice);
      const isSale = Math.random() > 0.7;
      
      products.push({
        id: currentId++,
        name: `${brand} Pro ${categoryName} V${i}`,
        brand,
        category: categoryKey,
        type: "apparel",
        image: "",
        images: [],
        price: isSale ? Math.floor(price * 0.8) : price,
        originalPrice: isSale ? price : undefined,
        tag: isSale ? "Sale" : undefined,
        size: "S / M / L / XL",
        color: ["Black", "Red", "Blue", "White"][Math.floor(Math.random() * 4)],
        rating: 4 + Math.random(),
        reviews: Math.floor(Math.random() * 50) + 1,
        stockStatus: Math.random() > 0.9 ? "Limited Stock" : "In Stock",
        features: [
          "Premium breathable fabric for maximum comfort",
          "Ergonomic fit designed for cycling",
          "Moisture-wicking technology",
          "Durable construction for long-lasting use"
        ],
        specifications: {
          "Material": "Polyester blend",
          "Fit": "Race / Aerodynamic",
          "Care": "Machine wash cold",
        },
        description: `Experience unparalleled comfort and performance with the ${brand} Pro ${categoryName}. Designed specifically for dedicated cyclists, this apparel ensures you stay cool and comfortable on your longest rides.`
      });
    }
  });
});

// Generate Accessories (3000-3999)
Object.entries(accessoryBrands).forEach(([categoryName, brands]) => {
  const categoryKey = accessoryCategoryKeys[categoryName] || categoryName.toLowerCase().replace(/ /g, '-');
  const [minPrice, maxPrice] = accessoryPriceRanges[categoryKey] || [1000, 5000];

  // Find subcategories for this category
  const categoryConfig = accessoryCategories.find(c => c.name === categoryName);
  const subcategories = categoryConfig?.subcategories || [];

  brands.forEach((brand) => {
    // Generate 2-3 products per brand per category
    const numProducts = Math.floor(Math.random() * 2) + 2;

    for (let i = 1; i <= numProducts; i++) {
      const price = getRandomPrice(minPrice, maxPrice);
      const isSale = Math.random() > 0.7;
      const subcategory = subcategories.length > 0 
        ? subcategories[Math.floor(Math.random() * subcategories.length)].href.split('type=')[1]
        : undefined;

      const subcatName = subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : "";
      
      products.push({
        id: currentId++,
        name: `${brand} Elite ${subcatName} ${categoryName.split(' ')[0]} ${i}`,
        brand,
        category: categoryKey,
        subcategory,
        type: "accessory",
        image: "",
        images: [],
        price: isSale ? Math.floor(price * 0.8) : price,
        originalPrice: isSale ? price : undefined,
        tag: isSale ? "Sale" : undefined,
        size: "One Size",
        color: ["Black", "Silver", "Neon", "Matte"][Math.floor(Math.random() * 4)],
        rating: 4 + Math.random(),
        reviews: Math.floor(Math.random() * 50) + 1,
        stockStatus: Math.random() > 0.9 ? "Limited Stock" : "In Stock",
        features: [
          "Lightweight and highly durable design",
          "Engineered for maximum performance and safety",
          "Easy installation and secure fit",
          "Tested in extreme conditions"
        ],
        specifications: {
          "Material": "Advanced Composite / Alloy",
          "Weight": "Ultra-light",
          "Compatibility": "Universal fit for most bikes",
        },
        description: `Enhance your cycling experience with the ${brand} Elite ${categoryName}. Built with cutting-edge technology to provide superior reliability and performance on every ride.`
      });
    }
  });
});
