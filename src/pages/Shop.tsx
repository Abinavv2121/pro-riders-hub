import { BikeCard } from "@/components/BikeCard";
import { ProductCard } from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  bikeBrands, 
  bikeCategories, 
  bikes, 
  priceRanges,
  Bike
} from "@/data/bikes";
import { products, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  Search, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Clock, 
  HelpCircle,
  X,
  ChevronDown,
  LayoutGrid,
  List
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import onRoadImg from "@/assets/categories/on-road.png";
import xRoadImg from "@/assets/categories/x-road.png";
import offRoadImg from "@/assets/categories/off-road.png";
import livImg from "@/assets/categories/liv.png";

const Shop = () => {
  const { addItem } = useCart();
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const isSale = searchParams.get("sale") === "true";
  const brandParam = searchParams.get("brand");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    bikes.forEach(b => brands.add(b.brand));
    products.forEach(p => brands.add(p.brand));
    return Array.from(brands).sort();
  }, []);

  // Sync parameters from URL
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    } else {
      const catParam = searchParams.get("category");
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
  }, [category, searchParams, brandParam]);

  useEffect(() => {
    // Simulate loading for skeletons
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubcategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    const element = document.getElementById("shop-listings");
    if (element) {
      const offset = 140; // offset for sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const combinedItems = useMemo(() => {
    const filteredBikes = bikes.filter((bike) => {
      const matchesSearch = 
        bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
        (selectedCategory === "kids" && (bike.size === "20" || bike.size === "24" || bike.name.toLowerCase().includes("kids") || bike.name.toLowerCase().includes("junior"))) ||
        (selectedCategory === "pre-owned" && (bike.condition === "used" || bike.tag === "Pre-Owned")) ||
        (selectedCategory === "restoration" && (bike.tag === "Restoration" || bike.condition === "restored")) ||
        bike.category === selectedCategory;
      
      const matchesBrand = selectedBrand.length === 0 || selectedBrand.includes(bike.brand);
      
      const matchesPrice = selectedPriceRange === null || (() => {
        const range = priceRanges[selectedPriceRange];
        return bike.price >= range.min && bike.price <= range.max;
      })();

      const matchesSale = !isSale || bike.tag === "Sale" || bike.tag === "Stock Clearance/Sale" || (bike.originalPrice !== undefined && bike.originalPrice > bike.price);

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesSale;
    });

    const filteredProducts = products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      
      const matchesBrand = selectedBrand.length === 0 || selectedBrand.includes(product.brand);
      
      const matchesPrice = selectedPriceRange === null || (() => {
        const range = priceRanges[selectedPriceRange];
        return product.price >= range.min && product.price <= range.max;
      })();

      const matchesSale = !isSale || product.tag === "Sale" || (product.originalPrice !== undefined && product.originalPrice > product.price);

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesSale;
    });

    const result = [...filteredBikes, ...filteredProducts];

    // Sorting
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "best-selling": result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)); break;
      case "newest": result.sort((a, b) => b.id - a.id); break;
      default: break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedBrand, selectedPriceRange, sortBy, isSale]);

  const toggleBrand = (brand: string) => {
    setSelectedBrand(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand([]);
    setSelectedPriceRange(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#FBFDFF]">
      <Header />
      
      {/* 1. Category & Specification Showcase */}
      <section className="pt-28 pb-10 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Column 1: ON ROAD */}
            <div className="group">
              <div className="overflow-hidden rounded-xl aspect-[16/10] bg-[#F9FBFF] border border-[#CCE0F5] shadow-sm">
                <img 
                  src={onRoadImg} 
                  alt="On Road Category" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-heading font-black text-[#111111] text-[14px] uppercase tracking-wider mt-4 mb-3 border-b border-[#CCE0F5] pb-2">
                On Road
              </h3>
              <ul className="space-y-1.5">
                {[
                  { name: "Aero Race", cat: "race-road" },
                  { name: "Race", cat: "race-road" },
                  { name: "All Rounder", cat: "race-road" },
                  { name: "Fitness", cat: "city-fitness" },
                  { name: "City", cat: "city-fitness" },
                  { name: "Endurance", cat: "endurance-road" }
                ].map((sub, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => handleSubcategoryClick(sub.cat)}
                      className="text-[13px] text-[#111111] hover:text-primary transition-colors font-body font-medium block w-full text-left"
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: X ROAD */}
            <div className="group">
              <div className="overflow-hidden rounded-xl aspect-[16/10] bg-[#F9FBFF] border border-[#CCE0F5] shadow-sm">
                <img 
                  src={xRoadImg} 
                  alt="X Road Category" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-heading font-black text-[#111111] text-[14px] uppercase tracking-wider mt-4 mb-3 border-b border-[#CCE0F5] pb-2">
                X Road
              </h3>
              <ul className="space-y-1.5">
                {[
                  { name: "Gravel", cat: "gravel" },
                  { name: "Sport", cat: "gravel" }
                ].map((sub, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => handleSubcategoryClick(sub.cat)}
                      className="text-[13px] text-[#111111] hover:text-primary transition-colors font-body font-medium block w-full text-left"
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: OFF ROAD */}
            <div className="group">
              <div className="overflow-hidden rounded-xl aspect-[16/10] bg-[#F9FBFF] border border-[#CCE0F5] shadow-sm">
                <img 
                  src={offRoadImg} 
                  alt="Off Road Category" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-heading font-black text-[#111111] text-[14px] uppercase tracking-wider mt-4 mb-3 border-b border-[#CCE0F5] pb-2">
                Off Road
              </h3>
              <ul className="space-y-1.5">
                {[
                  { name: "XC", cat: "mtb" },
                  { name: "Trail", cat: "mtb" },
                  { name: "Recreation", cat: "mtb" },
                  { name: "Sport", cat: "mtb" }
                ].map((sub, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => handleSubcategoryClick(sub.cat)}
                      className="text-[13px] text-[#111111] hover:text-primary transition-colors font-body font-medium block w-full text-left"
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: LIV */}
            <div className="group">
              <div className="overflow-hidden rounded-xl aspect-[16/10] bg-[#F9FBFF] border border-[#CCE0F5] shadow-sm">
                <img 
                  src={livImg} 
                  alt="Liv Category" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-heading font-black text-[#111111] text-[14px] uppercase tracking-wider mt-4 mb-3 border-b border-[#CCE0F5] pb-2">
                Liv
              </h3>
              <ul className="space-y-1.5">
                {[
                  { name: "Liv On Road", cat: "city-fitness" }
                ].map((sub, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => handleSubcategoryClick(sub.cat)}
                      className="text-[13px] text-[#111111] hover:text-primary transition-colors font-body font-medium block w-full text-left"
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </motion.div>
        </div>
      </section>

      {/* 3. Category Quick Links */}
      <div className="bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 py-4 overflow-x-auto no-scrollbar">
            
            {/* Filter Toggle Button on the Left */}
            <button 
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white font-heading font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm flex-shrink-0"
            >
              <Filter className="w-3.5 h-3.5" />
              Filter Options
            </button>

            <div className="h-6 w-px bg-[#CCE0F5] flex-shrink-0" />

            {/* The 6 Buttons */}
            <div className="flex items-center justify-start gap-4 overflow-x-auto no-scrollbar flex-1">
              {bikeCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`bike-category-button flex-shrink-0 transition-all duration-300 ${
                    selectedCategory === cat.key ? "active" : ""
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div id="shop-listings" className="container mx-auto px-4 md:px-6 pt-8 pb-16">
        <div className="w-full">
          
          {/* Main Product Hub */}
          <main className="w-full">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-[13px] text-[#666666]">
                Showing <span className="font-bold text-[#111111]">{combinedItems.length}</span> items 
                {selectedCategory !== 'all' && <span> in <span className="text-primary font-bold uppercase tracking-wider">{selectedCategory.replace(/-/g, ' ')}</span></span>}
              </p>
              
              {(selectedCategory !== "all" || selectedBrand.length > 0 || selectedPriceRange !== null || searchQuery !== "") && (
                <button 
                  onClick={clearFilters}
                  className="text-[11px] font-heading font-black text-[#111111] uppercase tracking-[0.15em] flex items-center gap-1 hover:text-primary transition-colors"
                >
                  Clear All <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white p-4 h-auto flex flex-col items-center select-none py-2">
                      <div className="w-full aspect-square bg-[#f5f5f5] rounded-xl animate-pulse mb-4" />
                      <div className="h-5 w-3/4 bg-[#F9FBFF] rounded animate-pulse mb-2.5" />
                      <div className="h-4 w-1/2 bg-[#F9FBFF] rounded animate-pulse mb-3" />
                      <div className="h-4 w-1/3 bg-[#F9FBFF] rounded animate-pulse mb-2.5" />
                      <div className="h-3.5 w-1/2 bg-[#F9FBFF] rounded animate-pulse" />
                    </div>
                  ))}
                </motion.div>
              ) : combinedItems.length > 0 ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {combinedItems.map((item, index) => {
                    if ('gears' in item) {
                      return <BikeCard key={`bike-${item.id}`} bike={item as Bike} index={index} layout="left" onAddItem={addItem} />;
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
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-heading font-black text-[#111111] uppercase tracking-tight mb-2">No Matches Found</h3>
                  <p className="text-[#666666] mb-8 max-w-sm">
                    We couldn't find any items matching your current filters. Try adjusting your search or resetting all filters.
                  </p>
                  <Button onClick={clearFilters} className="bg-primary hover:bg-primary/90 text-white rounded-full font-heading font-bold uppercase tracking-wider px-8">
                    Reset All Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
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
                {/* Mobile Filters Content (Clone of desktop) */}
                <div>
                  <h4 className="font-heading font-bold text-[#111111] text-[12px] uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">Brands</h4>
                  <div className="space-y-4">
                    {allBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-primary border-[#CCE0F5] rounded"
                          checked={selectedBrand.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                        />
                        <span className="text-[14px] text-[#555555]">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-[#111111] text-[12px] uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">Price Range</h4>
                  <div className="space-y-4">
                    {priceRanges.map((range, i) => (
                      <label key={i} className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="price-range-mobile"
                          className="w-5 h-5 accent-primary"
                          checked={selectedPriceRange === i}
                          onChange={() => setSelectedPriceRange(i)}
                        />
                        <span className="text-[14px] text-[#555555]">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Need Advice section */}
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <HelpCircle className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-heading font-bold text-[#111111] text-[13px] mb-2">Need advice?</h4>
                  <p className="text-[12px] text-[#666666] leading-relaxed mb-4">
                    Our experts can help you choose the right bike for your riding style.
                  </p>
                  <a href="/contact" className="text-primary font-bold uppercase tracking-widest text-[11px] flex items-center gap-1 hover:underline">
                    Contact Us <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              <div className="p-6 border-t border-[#CCE0F5] bg-[#F9FBFF]">
                <Button onClick={() => setShowFilters(false)} className="w-full bg-[#111111] hover:bg-primary text-white rounded-xl h-14 font-heading font-bold uppercase tracking-widest shadow-xl">
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
