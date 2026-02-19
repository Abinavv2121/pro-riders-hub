import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, ShoppingBag } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";

import argon18 from "@/assets/bikes/argon18-nitrogen.png";
import lapierre from "@/assets/bikes/lapierre-aircode-drs.png";
import scottPlasma from "@/assets/bikes/scott-plasma-10.png";
import avantiF1W from "@/assets/bikes/avanti-giro-f1w.png";
import avantiFM1W from "@/assets/bikes/avanti-giro-fm1w.png";
import marlin5 from "@/assets/bikes/trek-marlin5.png";

const bikes = [
  {
    id: 1,
    name: "Argon 18 Nitrogen",
    brand: "Argon 18",
    category: "road",
    image: argon18,
    color: "Silver Blue",
    size: "L",
    tag: "New Arrival",
  },
  {
    id: 2,
    name: "Lapierre Aircode DRS 5.0",
    brand: "Lapierre",
    category: "road",
    image: lapierre,
    color: "Gold / Black",
    size: "M / L",
    tag: "Disc",
  },
  {
    id: 3,
    name: "Scott Plasma 10",
    brand: "Scott",
    category: "road",
    image: scottPlasma,
    color: "Yellow / Black",
    size: "M",
    tag: "Triathlon",
  },
  {
    id: 4,
    name: "Avanti Giro F1W",
    brand: "Avanti",
    category: "hybrid",
    image: avantiF1W,
    color: "Metallic Blue",
    size: "M",
    tag: null,
  },
  {
    id: 5,
    name: "Avanti Giro FM 1W",
    brand: "Avanti",
    category: "hybrid",
    image: avantiFM1W,
    color: "White",
    size: "M",
    tag: null,
  },
  {
    id: 6,
    name: "Trek Marlin 5 Gen 3",
    brand: "Trek",
    category: "mtb",
    image: marlin5,
    color: "Matte Dark",
    size: "M / L / XL",
    tag: "Popular",
  },
];

const categories = [
  { key: "all", label: "All Bikes" },
  { key: "road", label: "Road" },
  { key: "hybrid", label: "Hybrid" },
  { key: "mtb", label: "Mountain" },
];

const Shop = () => {
  const { category: routeCategory } = useParams();
  const [activeCategory, setActiveCategory] = useState(routeCategory || "all");

  const filtered =
    activeCategory === "all"
      ? bikes
      : bikes.filter((b) => b.category === activeCategory);

  return (
    <PageShell>
      {/* Hero banner */}
      <section className="section-dark pt-32 pb-12">
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading font-bold text-hero-foreground text-4xl md:text-6xl mb-3"
          >
            Shop
          </motion.h1>
          <p className="text-hero-foreground/50 font-body text-lg max-w-xl">
            Browse our curated collection of premium bicycles from the world's finest brands.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="section-dark pb-24">
        <div className="container mx-auto px-6">
          {/* Category tabs */}
          <div className="flex items-center gap-6 border-b border-hero-foreground/10 mb-10 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`pb-3 text-sm font-heading font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                  activeCategory === cat.key
                    ? "text-primary border-primary"
                    : "text-hero-foreground/40 border-transparent hover:text-hero-foreground/70"
                }`}
              >
                {cat.label}
              </button>
            ))}
            <div className="ml-auto pb-3">
              <button className="flex items-center gap-2 text-hero-foreground/40 hover:text-hero-foreground/70 text-sm font-body transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((bike, i) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative bg-surface-dark rounded-sm overflow-hidden border border-hero-foreground/5 hover:border-hero-foreground/15 transition-colors"
              >
                {/* Tag */}
                {bike.tag && (
                  <span className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                    {bike.tag}
                  </span>
                )}

                {/* Image */}
                <div className="relative aspect-[4/3] flex items-center justify-center p-8 bg-hero-foreground/[0.03]">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-hero-foreground/40 text-xs uppercase tracking-widest font-heading mb-1">
                    {bike.brand}
                  </p>
                  <h3 className="font-heading font-bold text-hero-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                    {bike.name}
                  </h3>
                  <div className="flex items-center gap-3 text-hero-foreground/30 text-xs font-body mb-4">
                    <span>{bike.color}</span>
                    <span className="w-1 h-1 rounded-full bg-hero-foreground/20" />
                    <span>Size: {bike.size}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="hero" size="sm" className="flex-1 text-xs">
                      Enquire Now
                    </Button>
                    <Button
                      variant="hero-outline"
                      size="icon"
                      className="h-9 w-9 border border-hero-foreground/20 text-hero-foreground/40 hover:text-primary hover:border-primary"
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
