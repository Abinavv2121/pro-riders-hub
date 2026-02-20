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
  { name: "Lapierre", logo: lapierreLogo, scale: 1.0, plate: false },
  { name: "Giant", logo: giantLogo, scale: 0.94, plate: true },
  { name: "Trek", logo: trekLogo, scale: 0.96, plate: true },
  { name: "Argon 18", logo: argon18Logo, scale: 1.08, plate: false },
  { name: "Avanti", logo: avantiLogo, scale: 1.0, plate: false },
  { name: "Specialized", logo: specializedLogo, scale: 0.93, plate: true },
  { name: "Cannondale", logo: cannondaleLogo, scale: 0.95, plate: true },
  { name: "Scott", logo: scottLogo, scale: 1.0, plate: false },
  { name: "Bianchi", logo: bianchiLogo, scale: 1.05, plate: true },
  { name: "BMC", logo: bmcLogo, scale: 0.94, plate: true },
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
      {/* Logo wrap – consistent padding & centering */}
      <div className="flex items-center justify-center w-full h-full p-5">
        <div
          className={`flex items-center justify-center w-[78%] h-[56%] ${
            brand.plate
              ? "bg-[#f3f4f6]/[0.92] rounded-md shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
              : ""
          }`}
          style={{ padding: brand.plate ? "8px" : undefined }}
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-full h-full object-contain transition-[filter,opacity] duration-[240ms] ease-out
              group-hover:blur-[2px] group-hover:opacity-[0.8]
              group-focus-visible:blur-[2px] group-focus-visible:opacity-[0.8]"
            style={{ transform: `scale(${brand.scale})` }}
            draggable={false}
          />
        </div>
      </div>

      {/* Hover overlay with brand name */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-background/[0.3]
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
