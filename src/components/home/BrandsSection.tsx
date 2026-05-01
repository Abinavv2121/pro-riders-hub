import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

import argon18Logo from "@/assets/brands/logo images/argon-logo.jpg";
import avantiLogo from "@/assets/brands/logo images/download.png";
import bianchiLogo from "@/assets/brands/logo images/Bianchi_logo.svg.png";
import bmcLogo from "@/assets/brands/logo images/BMC_Switzerland_logo.svg.png";
import cannondaleLogo from "@/assets/brands/logo images/Cannondale_logo.svg.png";
import giantLogo from "@/assets/brands/logo images/Giant_bycicles_logo.svg.png";
import lapierreLogo from "@/assets/brands/logo images/Lapierre_logo.svg.png";
import scottLogo from "@/assets/brands/logo images/Scott_Sports_logo.svg.png";
import specializedLogo from "@/assets/brands/logo images/specialized-logoquake_54a369.png";
import trekLogo from "@/assets/brands/logo images/Trek_Bicycle_Corporation_logo.svg.png";
import { Link } from "react-router-dom";

// Bucket A: Wide wordmarks — max-h 47%, max-w 85%
// Bucket B: Medium/balanced — max-h 55%, max-w 76%
// Bucket C: Compact/mark-heavy — max-h 63%, max-w 73%
type Bucket = "A" | "B" | "C";

const brands: { name: string; slug: string; logo: string; bucket: Bucket; plate: boolean }[] = [
  { name: "Lapierre", slug: "lapierre", logo: lapierreLogo, bucket: "A", plate: false },
  { name: "Giant", slug: "giant", logo: giantLogo, bucket: "B", plate: false },
  { name: "Trek", slug: "trek", logo: trekLogo, bucket: "A", plate: false },
  { name: "Argon 18", slug: "argon-18", logo: argon18Logo, bucket: "A", plate: false },
  { name: "Avanti", slug: "avanti", logo: avantiLogo, bucket: "B", plate: false },
  { name: "Specialized", slug: "specialized", logo: specializedLogo, bucket: "A", plate: false },
  { name: "Cannondale", slug: "cannondale", logo: cannondaleLogo, bucket: "A", plate: false },
  { name: "Scott", slug: "scott", logo: scottLogo, bucket: "B", plate: false },
  { name: "Bianchi", slug: "bianchi", logo: bianchiLogo, bucket: "C", plate: false },
  { name: "BMC", slug: "bmc", logo: bmcLogo, bucket: "A", plate: false },
];

const bucketStyles: Record<Bucket, string> = {
  A: "max-h-[47%] max-w-[85%]",
  B: "max-h-[55%] max-w-[76%]",
  C: "max-h-[63%] max-w-[73%]",
};

const BrandTile = ({ brand, i }: { brand: typeof brands[number]; i: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex items-center justify-center aspect-[4/3] group"
    >
      {/* Logo wrap – consistent padding & centering */}
    <Link to={`/brand/${brand.slug}`} className="absolute inset-0">
      <div className="flex items-center justify-center w-full h-full p-5">
        <div
          className={`flex items-center justify-center w-full h-full ${
            brand.plate
              ? "bg-[#f3f4f6]/[0.92] rounded-md shadow-[0_1px_4px_rgba(0,0,0,0.08)] p-2"
              : ""
          }`}
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className={`object-contain transition-transform duration-300 ease-out
              group-hover:scale-105
              ${bucketStyles[brand.bucket]} w-full h-full`}
            draggable={false}
          />
        </div>
      </div>

      {/* Brand name label – always visible on mobile, shown on hover for desktop */}
      <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-heading font-semibold
        md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300 md:ease-out">
        {brand.name}
      </span>
    </Link>
    </motion.div>
  );
};

const BrandsSection = () => {
  return (
    <section className="section-card space-section" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <ScrollReveal as="div" scanline drift={8} className="text-primary font-heading text-xl md:text-3xl font-bold mb-6">Authorized Dealer</ScrollReveal>
          <ScrollReveal as="h2" delay={0.08} drift={12} className="font-heading text-section-sm md:text-section text-black">
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
