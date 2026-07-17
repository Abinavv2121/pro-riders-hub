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

// No auto-generated products anymore. DB data is used.
