import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

import lapierreLogo from "@/assets/brands/lapierre.jpeg";
import giantLogo from "@/assets/brands/giant.jpeg";
import trekLogo from "@/assets/brands/trek.jpeg";
import argon18Logo from "@/assets/brands/argon18.jpeg";
import avantiLogo from "@/assets/brands/avanti.jpeg";
import specializedLogo from "@/assets/brands/specialized.jpeg";
import cannondaleLogo from "@/assets/brands/cannondale.jpeg";
import scottLogo from "@/assets/brands/scott.jpeg";
import bianchiLogo from "@/assets/brands/bianchi.jpeg";
import bmcLogo from "@/assets/brands/bmc.jpeg";

const brands = [
  { name: "Lapierre", logo: lapierreLogo },
  { name: "Giant", logo: giantLogo },
  { name: "Trek", logo: trekLogo },
  { name: "Argon 18", logo: argon18Logo },
  { name: "Avanti", logo: avantiLogo },
  { name: "Specialized", logo: specializedLogo },
  { name: "Cannondale", logo: cannondaleLogo },
  { name: "Scott", logo: scottLogo },
  { name: "Bianchi", logo: bianchiLogo },
  { name: "BMC", logo: bmcLogo },
];

const BrandTile = ({ brand, i }: { brand: typeof brands[number]; i: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex items-center justify-center aspect-[4/3] rounded-lg overflow-hidden
        glass-card hover:border-primary/20 transition-colors duration-200 group"
    >
      {/* Logo */}
      <img
        src={brand.logo}
        alt={brand.name}
        className="w-[75%] h-[55%] object-contain transition-[filter,opacity] duration-[240ms] ease-out
          group-hover:blur-[3px] group-hover:opacity-50
          group-focus-visible:blur-[3px] group-focus-visible:opacity-50"
        draggable={false}
      />

      {/* Hover overlay with brand name */}
      <div
        className="absolute inset-0 flex items-center justify-center
          opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
          transition-opacity duration-[240ms] ease-out pointer-events-none"
      >
        <span className="font-heading font-bold text-foreground text-base md:text-lg tracking-wide uppercase">
          {brand.name}
        </span>
      </div>

      {/* Mobile: small label below logo (always visible) */}
      <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-heading font-semibold md:hidden">
        {brand.name}
      </span>
    </motion.div>
  );
};

const BrandsSection = () => {
  return (
    <section className="section-card space-section">
      <div className="container mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <ScrollReveal as="p" scanline drift={8} className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Authorized Dealer</ScrollReveal>
          <ScrollReveal as="h2" delay={0.08} drift={12} className="font-heading text-section-sm md:text-section text-foreground">
            World-Class Brands
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {brands.map((brand, i) => (
            <BrandTile key={brand.name} brand={brand} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
