import { BikeCard } from "@/components/BikeCard";
import PageShell from "@/components/PageShell";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { bikes } from "@/data/bikes";

import { Navigate } from "react-router-dom";

const categories = [
  { key: "all", label: "All Bikes" },
  { key: "race-road", label: "Race Road" },
  { key: "endurance-road", label: "Endurance Road" },
  { key: "gravel", label: "Gravel & Adventure" },
  { key: "mtb", label: "MTB (XC & Trail)" },
  { key: "city-fitness", label: "City & Fitness" },
];

const Shop = () => {
  const { category: routeCategory } = useParams();
  const [activeCategory, setActiveCategory] = useState(routeCategory || "all");
  const { addItem } = useCart();

  const filtered = activeCategory === "all" ? bikes : bikes.filter((b) => b.category === activeCategory);

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
                  : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
              >
                {cat.label}
              </button>
            ))}
            <div className="ml-auto pb-3">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-small font-body transition-colors duration-200">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Product grid */}
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
        </div>
      </section>
    </PageShell>
  );
};

export default Shop;
