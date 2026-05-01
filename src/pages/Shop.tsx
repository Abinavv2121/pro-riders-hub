import { BikeCard } from "@/components/BikeCard";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { bikes, bikeBrands, bikeTypes, bikeSizes, bikeGears, frameMaterials, groupsets, brakeTypes, wheelSizes, priceRanges, Bike } from "@/data/bikes";

import { Navigate } from "react-router-dom";

const categories = [
  { key: "all", label: "All Bikes" },
  { key: "race-road", label: "Race Road" },
  { key: "endurance-road", label: "Endurance Road" },
  { key: "gravel", label: "Gravel & Adventure" },
  { key: "mtb", label: "MTB (XC & Trail)" },
  { key: "city-fitness", label: "City & Fitness" },
];

interface Filters {
  bikeTypes: string[];
  sizes: string[];
  brands: string[];
  gears: string[];
  frameMaterials: string[];
  groupsets: string[];
  brakeTypes: string[];
  wheelSizes: string[];
  priceRange: { min: number; max: number } | null;
}

const initialFilters: Filters = {
  bikeTypes: [],
  sizes: [],
  brands: [],
  gears: [],
  frameMaterials: [],
  groupsets: [],
  brakeTypes: [],
  wheelSizes: [],
  priceRange: null,
};

const Shop = () => {
  const { category: routeCategory } = useParams();
  const [activeCategory, setActiveCategory] = useState(routeCategory || "all");
  const { addItem } = useCart();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique values for filters from bikes data
  const uniqueBrands = useMemo(() => Array.from(new Set(bikes.map(b => b.brand))), []);

  const handleFilterChange = (filterKey: keyof Filters, value: string) => {
    setFilters(prev => {
      const current = prev[filterKey] as string[];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [filterKey]: updated };
    });
  };

  const handlePriceRangeChange = (range: { min: number; max: number } | null) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  // Filter bikes based on category and filters
  const filtered = useMemo(() => {
    let result = activeCategory === "all" ? bikes : bikes.filter((b) => b.category === activeCategory);

    // Apply additional filters
    if (filters.bikeTypes.length > 0) {
      result = result.filter(b => filters.bikeTypes.includes(b.bikeType));
    }
    if (filters.sizes.length > 0) {
      result = result.filter(b => filters.sizes.some(s => b.size.includes(s)));
    }
    if (filters.brands.length > 0) {
      result = result.filter(b => filters.brands.includes(b.brand));
    }
    if (filters.gears.length > 0) {
      result = result.filter(b => filters.gears.includes(b.gears));
    }
    if (filters.frameMaterials.length > 0) {
      result = result.filter(b => filters.frameMaterials.includes(b.frameMaterial));
    }
    if (filters.groupsets.length > 0) {
      result = result.filter(b => filters.groupsets.includes(b.groupset));
    }
    if (filters.brakeTypes.length > 0) {
      result = result.filter(b => filters.brakeTypes.includes(b.brakeType));
    }
    if (filters.wheelSizes.length > 0) {
      result = result.filter(b => filters.wheelSizes.includes(b.wheelSize));
    }
    if (filters.priceRange) {
      result = result.filter(b => b.price >= filters.priceRange!.min && b.price <= filters.priceRange!.max);
    }

    return result;
  }, [activeCategory, filters]);

  const activeFilterCount = 
    filters.bikeTypes.length +
    filters.sizes.length +
    filters.brands.length +
    filters.gears.length +
    filters.frameMaterials.length +
    filters.groupsets.length +
    filters.brakeTypes.length +
    filters.wheelSizes.length +
    (filters.priceRange ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Bike Type */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Bike Type</h4>
        <div className="space-y-2">
          {bikeTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.bikeTypes.includes(type)}
                onCheckedChange={() => handleFilterChange('bikeTypes', type)}
              />
              <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">{type}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Size</h4>
        <div className="space-y-2">
          {bikeSizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={filters.sizes.includes(size)}
                onCheckedChange={() => handleFilterChange('sizes', size)}
              />
              <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">{size}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Brand</h4>
        <div className="space-y-2">
          {uniqueBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => handleFilterChange('brands', brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">{brand}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${idx}`}
                checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                onCheckedChange={() => {
                  if (filters.priceRange?.min === range.min && filters.priceRange?.max === range.max) {
                    handlePriceRangeChange(null);
                  } else {
                    handlePriceRangeChange({ min: range.min, max: range.max });
                  }
                }}
              />
              <Label htmlFor={`price-${idx}`} className="text-sm cursor-pointer">{range.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Gears */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Gears</h4>
        <div className="space-y-2">
          {bikeGears.map((gear) => (
            <div key={gear} className="flex items-center space-x-2">
              <Checkbox
                id={`gear-${gear}`}
                checked={filters.gears.includes(gear)}
                onCheckedChange={() => handleFilterChange('gears', gear)}
              />
              <Label htmlFor={`gear-${gear}`} className="text-sm cursor-pointer">{gear}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Frame Material */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Frame Material</h4>
        <div className="space-y-2">
          {frameMaterials.map((material) => (
            <div key={material} className="flex items-center space-x-2">
              <Checkbox
                id={`frame-${material}`}
                checked={filters.frameMaterials.includes(material)}
                onCheckedChange={() => handleFilterChange('frameMaterials', material)}
              />
              <Label htmlFor={`frame-${material}`} className="text-sm cursor-pointer">{material}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Groupset */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Groupset</h4>
        <div className="space-y-2">
          {groupsets.map((groupset) => (
            <div key={groupset} className="flex items-center space-x-2">
              <Checkbox
                id={`groupset-${groupset}`}
                checked={filters.groupsets.includes(groupset)}
                onCheckedChange={() => handleFilterChange('groupsets', groupset)}
              />
              <Label htmlFor={`groupset-${groupset}`} className="text-sm cursor-pointer">{groupset}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brake Type */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Brake Type</h4>
        <div className="space-y-2">
          {brakeTypes.map((brake) => (
            <div key={brake} className="flex items-center space-x-2">
              <Checkbox
                id={`brake-${brake}`}
                checked={filters.brakeTypes.includes(brake)}
                onCheckedChange={() => handleFilterChange('brakeTypes', brake)}
              />
              <Label htmlFor={`brake-${brake}`} className="text-sm cursor-pointer">{brake}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Wheel Size */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Wheel Size</h4>
        <div className="space-y-2">
          {wheelSizes.map((wheel) => (
            <div key={wheel} className="flex items-center space-x-2">
              <Checkbox
                id={`wheel-${wheel}`}
                checked={filters.wheelSizes.includes(wheel)}
                onCheckedChange={() => handleFilterChange('wheelSizes', wheel)}
              />
              <Label htmlFor={`wheel-${wheel}`} className="text-sm cursor-pointer">{wheel}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PageShell>
      <section className="py-8">
        <div className="container mx-auto px-5 md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-hero-sm md:text-section text-foreground mb-3"
          >
            Shop
          </motion.h1>
          <p className="text-muted-foreground font-body text-body max-w-xl">
            Browse our curated collection of premium bicycles from the world's finest brands.
          </p>
          <p className="mt-4 text-[#111111] text-left leading-relaxed font-body w-full max-w-none">
            Browse a wide range of high-performance bicycles designed for every type of rider, from beginners to professionals. Explore road bikes built for speed, mountain bikes made for adventure, and city bikes perfect for everyday commuting. Each bike is carefully selected from trusted global brands to ensure quality, durability, and top performance. Use our category filters to quickly find the perfect bike based on your riding style and needs. Whether you ride for fitness, competition, or leisure, we have options tailored for every journey. Start your cycling experience today with bikes that combine innovation, comfort, and reliability.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-5 md:px-8">
          {/* Category tabs */}
          <div className="flex items-center gap-6 border-b border-border mb-10 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`pb-3 text-small font-heading font-semibold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 border-b-2 ${activeCategory === cat.key
                  ? "text-primary border-primary"
                  : "text-black border-transparent hover:text-primary"
                  }`}
              >
                {cat.label}
              </button>
            ))}
            <div className="ml-auto pb-3">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <button className={`flex items-center gap-2 text-small font-body transition-colors duration-200 ${activeFilterCount > 0 ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-xl font-bold">Filters</h2>
                    {activeFilterCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                    <FilterPanel />
                  </ScrollArea>
                  <div className="mt-6 pt-4 border-t">
                    <Button onClick={applyFilters} className="w-full">
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Product grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((bike, i) => (
                <BikeCard
                  key={bike.id}
                  bike={bike}
                  index={i}
                  onAddItem={addItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No bikes match your filters</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default Shop;

