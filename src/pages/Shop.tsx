import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, ShoppingBag } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

import { bikes } from "@/data/bikes";

const categories = [
  { key: "all", label: "All Bikes" },
  { key: "road", label: "Road" },
  { key: "hybrid", label: "Hybrid" },
  { key: "mtb", label: "Mountain" },
];

const Shop = () => {
  const { category: routeCategory } = useParams();
  const [activeCategory, setActiveCategory] = useState(routeCategory || "all");
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

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
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
                className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/20 transition-all duration-200"
              >
                {bike.tag && (
                  <span className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                    {bike.tag}
                  </span>
                )}

                <div className="relative aspect-[4/3] flex items-center justify-center p-8 bg-muted/30">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                <div className="p-5">
                  <p className="text-muted-foreground text-xs uppercase tracking-widest font-heading mb-1">
                    {bike.brand}
                  </p>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors duration-200">
                    {bike.name}
                  </h3>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs font-micro mb-4">
                    <span>{bike.color}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>Size: {bike.size}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => addItem({ id: bike.id, name: bike.name, brand: bike.brand, image: bike.image, color: bike.color, size: bike.size })}
                    >
                      Enquire Now
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => addItem({ id: bike.id, name: bike.name, brand: bike.brand, image: bike.image, color: bike.color, size: bike.size })}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Shop;
