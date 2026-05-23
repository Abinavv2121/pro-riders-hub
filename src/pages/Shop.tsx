import { BikeCard } from "@/components/BikeCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  bikeBrands, 
  bikeCategories, 
  bikes, 
  priceRanges 
} from "@/data/bikes";
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
import { Link } from "react-router-dom";

const Shop = () => {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for skeletons
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredBikes = useMemo(() => {
    let result = bikes.filter((bike) => {
      const matchesSearch = 
        bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || bike.category === selectedCategory;
      
      const matchesBrand = selectedBrand.length === 0 || selectedBrand.includes(bike.brand);
      
      const matchesPrice = selectedPriceRange === null || (() => {
        const range = priceRanges[selectedPriceRange];
        return bike.price >= range.min && bike.price <= range.max;
      })();

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Sorting
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "best-selling": result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)); break;
      case "newest": result.sort((a, b) => b.id - a.id); break;
      default: break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedBrand, selectedPriceRange, sortBy]);

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
      
      {/* 1. Product Page Intro (Compact Hero) */}
      <section className="pt-32 pb-12 bg-white border-b border-[#CCE0F5]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="h-px w-8 bg-primary" />
              <span className="text-[11px] font-heading font-black text-primary uppercase tracking-[0.2em]">The Product Hub</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-heading font-black text-[#111111] uppercase tracking-tight mb-6"
            >
              Find Your Perfect Ride & <br/> <span className="text-primary">Cycling Essentials</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#555555] font-body max-w-2xl mb-8 leading-relaxed"
            >
              Explore premium bikes, components, accessories, and service-ready gear curated by Chennai's leading cycling experts.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button onClick={() => setSelectedCategory("race-road")} className="bg-primary hover:bg-primary/90 text-white rounded-full font-heading font-bold uppercase tracking-wider text-[12px] h-12 px-8">
                Shop Bikes
              </Button>
              <Button variant="outline" className="border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white rounded-full font-heading font-bold uppercase tracking-wider text-[12px] h-12 px-8 transition-colors">
                Browse Components
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Trust Strip */}
      <section className="bg-primary py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-between items-center gap-6">
            {[
              { icon: <CreditCard className="w-4 h-4" />, text: "EMI Available" },
              { icon: <Truck className="w-4 h-4" />, text: "Free Shipping Above ₹1,999" },
              { icon: <Clock className="w-4 h-4" />, text: "Easy Returns" },
              { icon: <ShieldCheck className="w-4 h-4" />, text: "Expert Support" },
              { icon: <Check className="w-4 h-4" />, text: "Since 1975" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/90">
                {item.icon}
                <span className="text-[10px] md:text-[11px] font-heading font-bold uppercase tracking-wider">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Category Quick Links */}
      <div className="bg-white border-b border-[#CCE0F5] sticky top-[var(--header-total-height-lg)] z-30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 overflow-x-auto py-4 no-scrollbar">
            {bikeCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-heading font-bold text-[11px] uppercase tracking-widest transition-all duration-300 border ${
                  selectedCategory === cat.key
                    ? "bg-primary border-primary text-white shadow-lg"
                    : "bg-white border-[#CCE0F5] text-[#111111] hover:border-primary hover:text-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-40 space-y-8">
              <div>
                <h3 className="font-heading font-black text-[#111111] text-[14px] uppercase tracking-[0.15em] mb-6 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" /> Filter Options
                </h3>
                
                {/* Brand Filter */}
                <div className="mb-8">
                  <h4 className="font-heading font-bold text-[#111111] text-[12px] uppercase tracking-widest mb-4">Brands</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {bikeBrands.map((brand) => (
                      <label key={brand.name} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="peer appearance-none w-5 h-5 border border-[#CCE0F5] rounded bg-white checked:bg-primary checked:border-primary transition-all"
                            checked={selectedBrand.includes(brand.name)}
                            onChange={() => toggleBrand(brand.name)}
                          />
                          <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[13px] text-[#555555] group-hover:text-primary transition-colors">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-8">
                  <h4 className="font-heading font-bold text-[#111111] text-[12px] uppercase tracking-widest mb-4">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="price-range"
                          className="w-4 h-4 accent-primary"
                          checked={selectedPriceRange === i}
                          onChange={() => setSelectedPriceRange(i)}
                        />
                        <span className="text-[13px] text-[#555555] group-hover:text-primary transition-colors">{range.label}</span>
                      </label>
                    ))}
                    {selectedPriceRange !== null && (
                      <button 
                        onClick={() => setSelectedPriceRange(null)}
                        className="text-[11px] text-primary font-bold uppercase tracking-wider mt-2 hover:underline"
                      >
                        Reset Price
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <HelpCircle className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-heading font-bold text-[#111111] text-[13px] mb-2">Need advice?</h4>
                  <p className="text-[12px] text-[#666666] leading-relaxed mb-4">
                    Our experts can help you choose the right bike for your riding style.
                  </p>
                  <Button variant="link" className="p-0 text-primary font-bold uppercase tracking-widest text-[11px] h-auto">
                    Contact Us <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Product Hub */}
          <main className="flex-1">
            {/* Search & Sort Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-white p-4 rounded-2xl border border-[#CCE0F5] shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <Input 
                  placeholder="Search by name or brand..." 
                  className="pl-11 h-12 bg-[#F9FBFF] border-[#CCE0F5] rounded-xl focus:ring-primary/20 text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[#888888] text-[12px] font-bold uppercase tracking-widest">
                  Sort By:
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[#111111] outline-none cursor-pointer hover:text-primary transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="best-selling">Best Selling</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                </div>
                
                <div className="h-6 w-px bg-[#CCE0F5] mx-2" />
                
                <button 
                  className="lg:hidden p-2.5 bg-primary text-white rounded-xl shadow-lg"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-[13px] text-[#666666]">
                Showing <span className="font-bold text-[#111111]">{filteredBikes.length}</span> bikes 
                {selectedCategory !== 'all' && <span> in <span className="text-primary font-bold uppercase tracking-wider">{selectedCategory}</span></span>}
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
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#CCE0F5] p-5 h-[450px] flex flex-col">
                      <div className="flex-1 bg-[#F9FBFF] rounded-xl animate-pulse mb-4" />
                      <div className="h-4 w-1/4 bg-[#F9FBFF] animate-pulse mb-3" />
                      <div className="h-6 w-3/4 bg-[#F9FBFF] animate-pulse mb-6" />
                      <div className="h-10 w-full bg-[#F9FBFF] animate-pulse rounded-xl" />
                    </div>
                  ))}
                </motion.div>
              ) : filteredBikes.length > 0 ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filteredBikes.map((bike, index) => (
                    <BikeCard key={bike.id} bike={bike} index={index} onAddItem={addItem} />
                  ))}
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
                    We couldn't find any bikes matching your current filters. Try adjusting your search or resetting all filters.
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

      {/* 9. Expert Help CTA Section */}
      <section className="py-24 bg-white border-y border-[#CCE0F5]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-[#111111] rounded-[3rem] overflow-hidden relative p-12 md:p-20 text-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00BDEB 1px, transparent 0)', backgroundSize: '32px 32px' }} 
            />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tight mb-6">
                Not sure what fits <span className="text-primary">your ride?</span>
              </h2>
              <p className="text-lg text-white/70 mb-10 leading-relaxed font-body">
                Our expert mechanics and pro-cyclists are ready to help. From frame sizing to groupset compatibility, get professional advice before you buy.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full font-heading font-bold uppercase tracking-widest h-14 px-10 shadow-xl">
                  Talk to an Expert
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-[#111111] rounded-full font-heading font-bold uppercase tracking-widest h-14 px-10">
                  Book a Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                    {bikeBrands.map((brand) => (
                      <label key={brand.name} className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-primary border-[#CCE0F5] rounded"
                          checked={selectedBrand.includes(brand.name)}
                          onChange={() => toggleBrand(brand.name)}
                        />
                        <span className="text-[14px] text-[#555555]">{brand.name}</span>
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
              </div>
              <div className="p-6 border-t border-[#CCE0F5] bg-[#F9FBFF]">
                <Button onClick={() => setShowFilters(false)} className="w-full bg-[#111111] hover:bg-primary text-white rounded-xl h-14 font-heading font-bold uppercase tracking-widest shadow-xl">
                  Show {filteredBikes.length} Results
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
