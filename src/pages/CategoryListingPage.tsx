import { ProductCard } from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { products, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Search,
  ArrowRight,
  X,
  HelpCircle,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface CategoryListingPageProps {
  type: "apparel" | "accessory";
  title: string;
  description: string;
}

const CategoryListingPage = ({ type, title, description }: CategoryListingPageProps) => {
  const { addItem } = useCart();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get all products of this type
  const typeProducts = useMemo(
    () => products.filter((p) => p.type === type),
    [type]
  );

  // Derive available categories from products
  const availableCategories = useMemo(() => {
    const catSet = new Set<string>();
    typeProducts.forEach((p) => catSet.add(p.category));
    return Array.from(catSet).sort();
  }, [typeProducts]);

  // Derive available brands from products
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    typeProducts.forEach((p) => brandSet.add(p.brand));
    return Array.from(brandSet).sort();
  }, [typeProducts]);

  // Sync from URL search params
  useEffect(() => {
    const catParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");

    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory("all");
    }

    if (brandParam) {
      setSelectedBrand([brandParam]);
    } else {
      setSelectedBrand([]);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [type]);

  const filteredItems = useMemo(() => {
    let result = typeProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesBrand =
        selectedBrand.length === 0 || selectedBrand.includes(product.brand);

      return matchesSearch && matchesCategory && matchesBrand;
    });

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "best-selling":
        result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [typeProducts, searchQuery, selectedCategory, selectedBrand, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrand((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand([]);
    setSearchQuery("");
  };

  const handleSubcategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    const element = document.getElementById("shop-listings");
    if (element) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFDFF]">
      <Header />

      {/* Hero Section */}
      <section className="pt-28 pb-10 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-black text-[#111111] uppercase tracking-tight mb-3">
              {title}
            </h1>
            <p className="text-[14px] text-[#666666] font-body leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Quick Links */}
      <div className="bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 py-4 overflow-x-auto no-scrollbar">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white font-heading font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm flex-shrink-0"
            >
              <Filter className="w-3.5 h-3.5" />
              Filter Options
            </button>

            <div className="h-6 w-px bg-[#CCE0F5] flex-shrink-0" />

            {/* Category Buttons */}
            <div className="flex items-center justify-start md:justify-center gap-4 flex-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`whitespace-nowrap flex-shrink-0 px-6 py-2.5 rounded-full font-heading font-bold text-[11px] uppercase tracking-widest transition-all duration-300 border ${
                  selectedCategory === "all"
                    ? "bg-primary border-primary text-white shadow-lg"
                    : "bg-white border-[#CCE0F5] text-[#111111] hover:border-primary hover:text-primary"
                }`}
              >
                All {title}
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleSubcategoryClick(cat)}
                  className={`whitespace-nowrap flex-shrink-0 px-6 py-2.5 rounded-full font-heading font-bold text-[11px] uppercase tracking-widest transition-all duration-300 border ${
                    selectedCategory === cat
                      ? "bg-primary border-primary text-white shadow-lg"
                      : "bg-white border-[#CCE0F5] text-[#111111] hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div id="shop-listings" className="container mx-auto px-4 md:px-6 pt-8 pb-16">
        <div className="w-full">
          <main className="w-full">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-[13px] text-[#666666]">
                Showing{" "}
                <span className="font-bold text-[#111111]">
                  {filteredItems.length}
                </span>{" "}
                items
                {selectedCategory !== "all" && (
                  <span>
                    {" "}
                    in{" "}
                    <span className="text-primary font-bold uppercase tracking-wider">
                      {selectedCategory.replace(/-/g, " ")}
                    </span>
                  </span>
                )}
              </p>

              {(selectedCategory !== "all" ||
                selectedBrand.length > 0 ||
                searchQuery !== "") && (
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
                    <div
                      key={i}
                      className="bg-white p-4 h-auto flex flex-col items-center select-none py-2"
                    >
                      <div className="w-full aspect-square bg-[#f5f5f5] rounded-xl animate-pulse mb-4" />
                      <div className="h-5 w-3/4 bg-[#F9FBFF] rounded animate-pulse mb-2.5" />
                      <div className="h-4 w-1/2 bg-[#F9FBFF] rounded animate-pulse mb-3" />
                      <div className="h-4 w-1/3 bg-[#F9FBFF] rounded animate-pulse mb-2.5" />
                      <div className="h-3.5 w-1/2 bg-[#F9FBFF] rounded animate-pulse" />
                    </div>
                  ))}
                </motion.div>
              ) : filteredItems.length > 0 ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                   {filteredItems.map((item, index) => (
                    <ProductCard
                      key={`prod-${item.id}`}
                      product={item as Product}
                      index={index}
                      layout="left"
                      onAddItem={addItem}
                    />
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
                  <h3 className="text-2xl font-heading font-black text-[#111111] uppercase tracking-tight mb-2">
                    No Products Found
                  </h3>
                  <p className="text-[#666666] mb-8 max-w-sm">
                    No products found in this category. Try adjusting your
                    filters or browse all {title.toLowerCase()}.
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-primary hover:bg-primary/90 text-white rounded-full font-heading font-bold uppercase tracking-wider px-8"
                  >
                    Reset All Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Filter Drawer */}
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
                <h3 className="font-heading font-black text-[#111111] text-[16px] uppercase tracking-widest">
                  Filters
                </h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6 text-[#111111]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
                {/* Categories */}
                <div>
                  <h4 className="font-heading font-bold text-[#111111] text-[12px] uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">
                    Categories
                  </h4>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="category-filter"
                        className="w-5 h-5 accent-primary"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                      />
                      <span className="text-[14px] text-[#555555]">
                        All {title}
                      </span>
                    </label>
                    {availableCategories.map((cat) => (
                      <label key={cat} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="category-filter"
                          className="w-5 h-5 accent-primary"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                        />
                        <span className="text-[14px] text-[#555555] capitalize">
                          {cat.replace(/-/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="font-heading font-bold text-[#111111] text-[12px] uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">
                    Brands
                  </h4>
                  <div className="space-y-4">
                    {availableBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-primary border-[#CCE0F5] rounded"
                          checked={selectedBrand.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                        />
                        <span className="text-[14px] text-[#555555]">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Need Advice */}
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <HelpCircle className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-heading font-bold text-[#111111] text-[13px] mb-2">
                    Need advice?
                  </h4>
                  <p className="text-[12px] text-[#666666] leading-relaxed mb-4">
                    Our experts can help you choose the right{" "}
                    {type === "apparel" ? "apparel" : "accessories"} for your
                    riding style.
                  </p>
                  <a
                    href="/contact"
                    className="text-primary font-bold uppercase tracking-widest text-[11px] flex items-center gap-1 hover:underline"
                  >
                    Contact Us <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              <div className="p-6 border-t border-[#CCE0F5] bg-[#F9FBFF]">
                <Button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-[#111111] hover:bg-primary text-white rounded-xl h-14 font-heading font-bold uppercase tracking-widest shadow-xl"
                >
                  Show {filteredItems.length} Results
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

export default CategoryListingPage;
