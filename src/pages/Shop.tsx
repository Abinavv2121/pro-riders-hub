import { BikeCard } from "@/components/BikeCard";
import { ProductCard } from "@/components/ProductCard";
import { DbProductCard } from "@/components/DbProductCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  bikeCategories,
  bikes,
  Bike
} from "@/data/bikes";
import { products, Product } from "@/data/products";
import { supabase, DbProduct } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  Search, 
  ArrowRight, 
  Check, 
  HelpCircle,
  X,
  ChevronDown,
  LayoutGrid,
  List,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import sidebarBikerBanner from "@/assets/sidebar_biker_banner.png";

const sidebarCategories = [
  { label: "Electric Bikes", key: "electric" },
  { label: "Road Bikes", key: "road" },
  { label: "Hybrid Bikes", key: "hybrid" },
  { label: "Mountain Bikes", key: "mtb" },
  { label: "Folding Bikes", key: "folding" },
  { label: "BMX Bikes", key: "bmx" },
  { label: "Single Speed Bikes", key: "single-speed" },
  { label: "Road & Time Trial Bikes", key: "road-tt" },
  { label: "Kids Bikes", key: "kids" },
  { label: "Junior Bikes", key: "junior" },
  { label: "Womens Bikes", key: "womens" }
];

const topCategories = [
  { key: "all", label: "All Bikes" },
  { key: "race-road", label: "Race Road" },
  { key: "endurance-road", label: "Endurance Road" },
  { key: "gravel", label: "Gravel & Adventure" },
  { key: "mtb", label: "MTB (XC & Trail)" },
  { key: "city-fitness", label: "City & Fitness" },
  { key: "hybrid", label: "Hybrid" },
  { key: "kids", label: "Kids Bikes" },
  { key: "pre-owned", label: "Pre-Owned Bikes" },
];

const Shop = () => {
  const { addItem } = useCart();
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const isSale = searchParams.get("sale") === "true";
  const brandParam = searchParams.get("brand");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [selectedWheelSizes, setSelectedWheelSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 450000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFrameMaterials, setSelectedFrameMaterials] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    brand: false,
    wheelSize: true,
    price: true,
    color: true,
    frameMaterial: false,
  });

  useEffect(() => {
    supabase
      .from("db_products")
      .select("*")
      .eq("is_active", true)
      .eq("type", "bike")
      .order("created_at", { ascending: false })
      .then(({ data }) => setDbProducts(data || []));
  }, []);

  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    bikes.forEach(b => brands.add(b.brand));
    products.forEach(p => brands.add(p.brand));
    dbProducts.forEach(p => brands.add(p.brand));
    return Array.from(brands).sort();
  }, [dbProducts]);

  // Sync parameters from URL
  useEffect(() => {
    const catParam = searchParams.get("category");
    const isMainHeaderClick = !category && !catParam && !brandParam && !isSale;

    if (isMainHeaderClick) {
      setSearchQuery("");
      setPriceRange([0, 450000]);
      setSortBy("featured");
    }

    if (category) {
      setSelectedCategory(category);
    } else {
      if (catParam) {
        setSelectedCategory(catParam);
      } else {
        setSelectedCategory("all");
      }
    }

    if (brandParam) {
      setSelectedBrand([brandParam]);
    } else {
      setSelectedBrand([]);
    }
    setCurrentPage(1);
  }, [category, searchParams, brandParam, isSale]);

  useEffect(() => {
    // Simulate loading for skeletons
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const matchesSidebarCategory = (item: any) => {
    if (selectedCategory === "all") return true;

    if (selectedCategory === "electric") {
      const name = item.name.toLowerCase();
      const desc = (item.description || "").toLowerCase();
      return name.includes("electric") || name.includes("e-bike") || desc.includes("electric") || desc.includes("e-bike");
    }
    if (selectedCategory === "folding") {
      const name = item.name.toLowerCase();
      return name.includes("folding") || name.includes("fold");
    }
    if (selectedCategory === "bmx") {
      return item.name.toLowerCase().includes("bmx");
    }
    if (selectedCategory === "single-speed") {
      const name = item.name.toLowerCase();
      const gears = (item.gears || "").toLowerCase();
      return gears.includes("1 speed") || gears.includes("single speed") || name.includes("single speed") || name.includes("fixed gear");
    }
    if (selectedCategory === "road-tt") {
      const name = item.name.toLowerCase();
      const isRoad = item.category === "race-road" || item.category === "endurance-road" || (item.category && item.category.toLowerCase().includes("road"));
      return isRoad && (name.includes("time trial") || name.includes("tt") || name.includes("aero"));
    }
    if (selectedCategory === "junior") {
      const name = item.name.toLowerCase();
      return item.category === "kids" || item.size === "24" || name.includes("junior");
    }
    if (selectedCategory === "womens") {
      const name = item.name.toLowerCase();
      return name.includes("women") || name.includes("womens") || name.includes("liv") || name.includes("female");
    }
    
    const pCat = item.category ? item.category.toLowerCase() : "";
    return pCat === selectedCategory ||
      (selectedCategory === "city-fitness" && (pCat === "hybrid" || pCat === "city & fitness" || pCat === "city fitness" || pCat === "city-fitness")) ||
      (selectedCategory === "hybrid" && (pCat === "hybrid" || pCat === "city-fitness")) ||
      (selectedCategory === "race-road" && (pCat === "road" || pCat === "race-road" || pCat === "race road")) ||
      (selectedCategory === "endurance-road" && (pCat === "road" || pCat === "endurance-road" || pCat === "endurance road")) ||
      (selectedCategory === "gravel" && (pCat === "gravel" || pCat === "road")) ||
      (selectedCategory === "mtb" && (pCat === "mtb" || pCat === "mountain")) ||
      (selectedCategory === "kids" && (item.size === "20" || item.size === "24" || item.name.toLowerCase().includes("kids") || item.name.toLowerCase().includes("junior") || pCat === "kids")) ||
      (selectedCategory === "pre-owned" && (item.tag === "Pre-Owned" || item.name.toLowerCase().includes("used") || item.name.toLowerCase().includes("pre-owned") || (item.description && item.description.toLowerCase().includes("used")) || pCat === "pre-owned")) ||
      (selectedCategory === "restoration" && (item.tag === "Restoration" || pCat === "restoration"));
  };

  const combinedItems = useMemo(() => {
    const filterItem = (item: any) => {
      // 1. Search Query
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Category
      const matchesCategory = matchesSidebarCategory(item);

      // 3. Brand
      const matchesBrand = selectedBrand.length === 0 || selectedBrand.includes(item.brand);

      // 4. Price Slider
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

      // 5. Wheel Size
      const matchesWheelSize = selectedWheelSizes.length === 0 || (() => {
        const cleanSize = (s: string) => s.replace(/"/g, "").trim();
        const cleanedItemSize = cleanSize(item.wheelSize || "");
        return selectedWheelSizes.some(selected => cleanSize(selected) === cleanedItemSize);
      })();

      // 6. Color
      const matchesColor = selectedColors.length === 0 || (() => {
        const itemColor = (item.color || "").toLowerCase();
        const itemName = (item.name || "").toLowerCase();
        return selectedColors.some(color => {
          const c = color.toLowerCase();
          if (c === "grey" || c === "gray") {
            return itemColor.includes("grey") || itemColor.includes("gray") || itemName.includes("grey") || itemName.includes("gray");
          }
          return itemColor.includes(c) || itemName.includes(c);
        });
      })();

      // 7. Frame Material
      const matchesFrameMaterial = selectedFrameMaterials.length === 0 || (() => {
        const itemMat = (item.frameMaterial || "").toLowerCase();
        return selectedFrameMaterials.some(mat => itemMat.includes(mat.toLowerCase()));
      })();

      // 8. Sale tag
      const isOnSale = item.originalPrice && item.originalPrice > item.price;
      const isDbOnSale = item.original_price && item.original_price > item.price;
      const matchesSale = !isSale || item.tag === "Sale" || item.tag === "Stock Clearance/Sale" || isOnSale || isDbOnSale;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesWheelSize && matchesColor && matchesFrameMaterial && matchesSale;
    };

    const filteredDb = dbProducts.filter(filterItem);
    const filteredBikes = bikes.filter(filterItem);
    const filteredProducts = products.filter(filterItem);

    const result = [...filteredBikes, ...filteredProducts, ...filteredDb];

    // Sorting
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "best-selling": result.sort((a, b) => (('reviews' in b ? b.reviews : 0) || 0) - (('reviews' in a ? a.reviews : 0) || 0)); break;
      case "newest": result.sort((a, b) => (typeof b.id === 'number' ? b.id : 0) - (typeof a.id === 'number' ? a.id : 0)); break;
      default: break;
    }

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    priceRange,
    selectedWheelSizes,
    selectedColors,
    selectedFrameMaterials,
    sortBy,
    isSale,
    dbProducts
  ]);

  const toggleBrand = (brand: string) => {
    setSelectedBrand(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleWheelSize = (size: string) => {
    setSelectedWheelSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  const toggleFrameMaterial = (mat: string) => {
    setSelectedFrameMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
    setCurrentPage(1);
  };

  const isSidebarCategoryActive = (key: string) => {
    if (key === "electric") return selectedCategory === "electric";
    if (key === "road") return selectedCategory === "race-road" || selectedCategory === "endurance-road";
    if (key === "hybrid") return selectedCategory === "hybrid" || selectedCategory === "city-fitness";
    if (key === "mtb") return selectedCategory === "mtb";
    if (key === "folding") return selectedCategory === "folding";
    if (key === "bmx") return selectedCategory === "bmx";
    if (key === "single-speed") return selectedCategory === "single-speed";
    if (key === "road-tt") return selectedCategory === "road-tt";
    if (key === "kids") return selectedCategory === "kids";
    if (key === "junior") return selectedCategory === "junior";
    if (key === "womens") return selectedCategory === "womens";
    return false;
  };

  const handleSidebarCategoryClick = (key: string) => {
    if (isSidebarCategoryActive(key)) {
      setSelectedCategory("all");
    } else {
      if (key === "road") setSelectedCategory("race-road");
      else if (key === "hybrid") setSelectedCategory("hybrid");
      else setSelectedCategory(key);
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand([]);
    setSelectedWheelSizes([]);
    setPriceRange([0, 450000]);
    setSelectedColors([]);
    setSelectedFrameMaterials([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getCategoryLabel = (key: string) => {
    const found = bikeCategories.find(c => c.key === key);
    if (found) return found.label;
    const sidebarFound = sidebarCategories.find(c => c.key === key);
    if (sidebarFound) return sidebarFound.label;
    return key;
  };

  // Pagination calculations
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(combinedItems.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [combinedItems.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = combinedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const renderSidebarFilters = () => {
    return (
      <div className="space-y-6">
        {/* Category */}
        <div className="border-b border-gray-100 pb-5">
          <button 
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full text-left font-heading font-black text-xs uppercase tracking-widest text-[#111111]"
          >
            <span>Category</span>
            <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-colors hover:border-gray-400">
              {expandedSections.category ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </div>
          </button>
          {expandedSections.category && (
            <div className="mt-4 space-y-2.5">
              {sidebarCategories.map((cat) => {
                const active = isSidebarCategoryActive(cat.key);
                return (
                  <div 
                    key={cat.key} 
                    onClick={() => handleSidebarCategoryClick(cat.key)}
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      active 
                        ? "bg-[#111111] border-[#111111] text-white" 
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}>
                      {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className={`text-[13px] transition-colors ${
                      active ? "text-[#111111] font-bold" : "text-[#555555] group-hover:text-[#111111]"
                    }`}>
                      {cat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Brand */}
        <div className="border-b border-gray-100 pb-5">
          <button 
            onClick={() => toggleSection("brand")}
            className="flex items-center justify-between w-full text-left font-heading font-black text-xs uppercase tracking-widest text-[#111111]"
          >
            <span>Brand</span>
            <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-colors hover:border-gray-400">
              {expandedSections.brand ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </div>
          </button>
          {expandedSections.brand && (
            <div className="mt-4 space-y-2.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {allBrands.map((brand) => {
                const checked = selectedBrand.includes(brand);
                return (
                  <div 
                    key={brand} 
                    onClick={() => toggleBrand(brand)}
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      checked 
                        ? "bg-[#111111] border-[#111111] text-white" 
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}>
                      {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className={`text-[13px] transition-colors ${
                      checked ? "text-[#111111] font-bold" : "text-[#555555] group-hover:text-[#111111]"
                    }`}>
                      {brand}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Wheel Size */}
        <div className="border-b border-gray-100 pb-5">
          <button 
            onClick={() => toggleSection("wheelSize")}
            className="flex items-center justify-between w-full text-left font-heading font-black text-xs uppercase tracking-widest text-[#111111]"
          >
            <span>Wheel Size</span>
            <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-colors hover:border-gray-400">
              {expandedSections.wheelSize ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </div>
          </button>
          {expandedSections.wheelSize && (
            <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-4">
              {["24\"", "26\"", "26.5\"", "27\"", "27.5\"", "29\""].map((size) => {
                const checked = selectedWheelSizes.includes(size);
                return (
                  <div 
                    key={size} 
                    onClick={() => toggleWheelSize(size)}
                    className="flex items-center gap-2.5 cursor-pointer group py-0.5"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      checked 
                        ? "bg-[#111111] border-[#111111] text-white" 
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}>
                      {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className={`text-[13px] transition-colors ${
                      checked ? "text-[#111111] font-bold" : "text-[#555555] group-hover:text-[#111111]"
                    }`}>
                      {size}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="border-b border-gray-100 pb-5">
          <button 
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full text-left font-heading font-black text-xs uppercase tracking-widest text-[#111111]"
          >
            <span>Price</span>
            <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-colors hover:border-gray-400">
              {expandedSections.price ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </div>
          </button>
          {expandedSections.price && (
            <div className="mt-4 px-1">
              <Slider 
                min={0}
                max={450000}
                step={5000}
                value={priceRange}
                onValueChange={(val) => { setPriceRange(val as [number, number]); setCurrentPage(1); }}
                className="my-5"
              />
              <div className="flex items-center justify-between text-[11px] text-[#555] font-semibold mt-2">
                <span>Rs. {new Intl.NumberFormat('en-IN').format(priceRange[0])}</span>
                <span>Rs. {new Intl.NumberFormat('en-IN').format(priceRange[1])}</span>
              </div>
            </div>
          )}
        </div>

        {/* Color */}
        <div className="border-b border-gray-100 pb-5">
          <button 
            onClick={() => toggleSection("color")}
            className="flex items-center justify-between w-full text-left font-heading font-black text-xs uppercase tracking-widest text-[#111111]"
          >
            <span>Color</span>
            <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-colors hover:border-gray-400">
              {expandedSections.color ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </div>
          </button>
          {expandedSections.color && (
            <div className="mt-4 space-y-3">
              {[
                { label: "Blue", value: "Blue", colorClass: "bg-blue-600" },
                { label: "Red", value: "Red", colorClass: "bg-red-500" },
                { label: "Orange", value: "Orange", colorClass: "bg-orange-500" },
                { label: "Dark Blue", value: "Dark Blue", colorClass: "bg-blue-900" },
                { label: "Green", value: "Green", colorClass: "bg-green-500" },
                { label: "Grey", value: "Grey", colorClass: "bg-gray-400" },
              ].map((col) => {
                const active = selectedColors.includes(col.value);
                return (
                  <div 
                    key={col.value} 
                    onClick={() => toggleColor(col.value)}
                    className="flex items-center gap-3 cursor-pointer group py-0.5"
                  >
                    <div className={`w-4 h-4 rounded-full ${col.colorClass} flex items-center justify-center shadow-inner relative`}>
                      {active && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className={`text-[13px] transition-colors ${
                      active ? "text-[#111111] font-bold" : "text-[#555555] group-hover:text-[#111111]"
                    }`}>
                      {col.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Frame Material */}
        <div className="border-b border-gray-100 pb-5">
          <button 
            onClick={() => toggleSection("frameMaterial")}
            className="flex items-center justify-between w-full text-left font-heading font-black text-xs uppercase tracking-widest text-[#111111]"
          >
            <span>Frame Material</span>
            <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-colors hover:border-gray-400">
              {expandedSections.frameMaterial ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </div>
          </button>
          {expandedSections.frameMaterial && (
            <div className="mt-4 space-y-2.5">
              {["Carbon", "Aluminum", "Steel", "Titanium", "Carbon Fiber"].map((mat) => {
                const checked = selectedFrameMaterials.includes(mat);
                return (
                  <div 
                    key={mat} 
                    onClick={() => toggleFrameMaterial(mat)}
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      checked 
                        ? "bg-[#111111] border-[#111111] text-white" 
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}>
                      {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className={`text-[13px] transition-colors ${
                      checked ? "text-[#111111] font-bold" : "text-[#555555] group-hover:text-[#111111]"
                    }`}>
                      {mat}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FBFDFF]">
      <Header />
      
      {/* 2. Category Quick Links */}
      <div className="bg-white pt-28 pb-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-3">
              {topCategories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setCurrentPage(1);
                    }}
                    className={`flex-shrink-0 px-6 py-2.5 rounded-full font-heading font-extrabold text-[12px] uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? "bg-[#00A8DC] border border-[#00A8DC] text-white shadow-[0_4px_12px_rgba(0,168,220,0.25)]"
                        : "bg-white border border-[#b9dbea] text-[#0b0f14] hover:border-[#00A8DC] hover:text-[#00A8DC]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
            {/* Thick gray bar under pills */}
            <div className="w-full h-[6px] bg-[#EAECEF] mt-2 rounded-full" />
          </div>
        </div>
      </div>

      <div id="shop-listings" className="container mx-auto px-4 md:px-6 pt-6 pb-16">
        {/* Breadcrumbs & Sorting Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-gray-100 pb-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#888888] font-heading font-black uppercase tracking-wider">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-60 text-[9px]">&gt;</span>
            <Link to="/shop" className="hover:text-primary transition-colors">Bikes</Link>
            {selectedCategory !== "all" && (
              <>
                <span className="opacity-60 text-[9px]">&gt;</span>
                <span className="text-[#111111] font-black">
                  {getCategoryLabel(selectedCategory)}
                </span>
              </>
            )}
          </div>

          {/* Sorting and Layout Toggles */}
          <div className="flex items-center justify-between sm:justify-end gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#888888] font-heading font-black uppercase tracking-wider">Sort By:</span>
              <select 
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="text-[11px] font-heading font-black uppercase tracking-wider text-[#111111] bg-transparent border-none cursor-pointer focus:outline-none"
              >
                <option value="featured">We Recommend</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="best-selling">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded transition-colors ${viewMode === "grid" ? "text-[#111111]" : "text-gray-300 hover:text-gray-500"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1 rounded transition-colors ${viewMode === "list" ? "text-[#111111]" : "text-gray-300 hover:text-gray-500"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="bg-white border border-[#EAECEF] rounded-2xl p-6 shadow-sm sticky top-28">
              {renderSidebarFilters()}
              
              {/* Sidebar Mountain Biker Banner */}
              <div className="mt-8 rounded-xl overflow-hidden shadow-sm relative group aspect-[3/4]">
                <img 
                  src={sidebarBikerBanner} 
                  alt="Mountain Biking" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </aside>

          {/* Main Product Area */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <p className="text-[13px] text-[#666666]">
                Showing <span className="font-bold text-[#111111]">{combinedItems.length}</span> items
              </p>
              <button 
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#00A8DC] text-[#00A8DC] hover:bg-[#00A8DC] hover:text-white font-heading font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm"
              >
                <Filter className="w-3.5 h-3.5" />
                Filter Options
              </button>
            </div>

            {/* Product Cards Grid/List */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" 
                    : "flex flex-col gap-6"
                  }
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white p-4 h-auto flex flex-col items-center select-none py-2 border border-gray-100 rounded-xl animate-pulse">
                      <div className="w-full aspect-square bg-[#f5f5f5] rounded-xl mb-4" />
                      <div className="h-5 w-3/4 bg-[#f5f5f5] rounded mb-2.5" />
                      <div className="h-4 w-1/2 bg-[#f5f5f5] rounded mb-3" />
                      <div className="h-4 w-1/3 bg-[#f5f5f5] rounded mb-2.5" />
                      <div className="h-3.5 w-1/2 bg-[#f5f5f5] rounded" />
                    </div>
                  ))}
                </motion.div>
              ) : paginatedItems.length > 0 ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" 
                    : "flex flex-col gap-6"
                  }
                >
                  {paginatedItems.map((item, index) => {
                    if ('gears' in item) {
                      return <BikeCard key={`bike-${item.id}`} bike={item as Bike} index={index} layout="left" onAddItem={addItem} />;
                    }
                    if ('stock_status' in item) {
                      return <DbProductCard key={`db-${(item as DbProduct).id}`} product={item as DbProduct} index={index} layout="left" />;
                    }
                    return <ProductCard key={`prod-${item.id}`} product={item as Product} index={index} layout="left" onAddItem={addItem} />;
                  })}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-20 h-20 bg-[#F0F6FF] rounded-full flex items-center justify-center mb-6">
                    <Search className="w-8 h-8 text-[#00A8DC]" />
                  </div>
                  <h3 className="text-xl font-heading font-black text-[#111111] uppercase tracking-tight mb-2">No Matches Found</h3>
                  <p className="text-[#666666] mb-8 max-w-sm text-sm">
                    We couldn't find any items matching your current filters. Try adjusting your search or resetting all filters.
                  </p>
                  <Button onClick={clearFilters} className="bg-[#00A8DC] hover:bg-[#00A8DC]/90 text-white rounded-full font-heading font-bold uppercase tracking-wider px-8">
                    Reset All Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-12 pb-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 flex items-center justify-center text-xs font-bold font-heading rounded transition-colors ${
                        isActive
                          ? "bg-[#111111] text-white border border-[#111111]"
                          : "border border-gray-200 text-[#555] hover:bg-gray-50 hover:text-[#111]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[#CCE0F5] flex items-center justify-between">
                <h3 className="font-heading font-black text-[#111111] text-[16px] uppercase tracking-widest">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6 text-[#111111]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
                {renderSidebarFilters()}

                {/* Need Advice section */}
                <div className="p-6 bg-[#00A8DC]/5 rounded-2xl border border-[#00A8DC]/10">
                  <HelpCircle className="w-8 h-8 text-[#00A8DC] mb-3" />
                  <h4 className="font-heading font-bold text-[#111111] text-[13px] mb-2">Need advice?</h4>
                  <p className="text-[12px] text-[#666666] leading-relaxed mb-4">
                    Our experts can help you choose the right bike for your riding style.
                  </p>
                  <a href="/contact" className="text-[#00A8DC] font-bold uppercase tracking-widest text-[11px] flex items-center gap-1 hover:underline">
                    Contact Us <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              <div className="p-6 border-t border-[#CCE0F5] bg-[#F9FBFF]">
                <Button onClick={() => setShowFilters(false)} className="w-full bg-[#111111] hover:bg-[#00A8DC] text-white rounded-xl h-14 font-heading font-bold uppercase tracking-widest shadow-xl">
                  Show {combinedItems.length} Results
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Shop;
