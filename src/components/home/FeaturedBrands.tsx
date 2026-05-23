import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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

type Bucket = "A" | "B" | "C";

const bucketStyles: Record<Bucket, string> = {
  A: "max-h-[47%] max-w-[85%]",
  B: "max-h-[55%] max-w-[76%]",
  C: "max-h-[63%] max-w-[73%]",
};

const brands: { name: string; slug: string; logo: string; bucket: Bucket }[] = [
  { name: "Lapierre", slug: "lapierre", logo: lapierreLogo, bucket: "A" },
  { name: "Giant", slug: "giant", logo: giantLogo, bucket: "B" },
  { name: "Trek", slug: "trek", logo: trekLogo, bucket: "A" },
  { name: "Argon 18", slug: "argon-18", logo: argon18Logo, bucket: "A" },
  { name: "Avanti", slug: "avanti", logo: avantiLogo, bucket: "B" },
  { name: "Specialized", slug: "specialized", logo: specializedLogo, bucket: "A" },
  { name: "Cannondale", slug: "cannondale", logo: cannondaleLogo, bucket: "A" },
  { name: "Scott", slug: "scott", logo: scottLogo, bucket: "B" },
  { name: "Bianchi", slug: "bianchi", logo: bianchiLogo, bucket: "C" },
  { name: "BMC", slug: "bmc", logo: bmcLogo, bucket: "A" },
];

const FeaturedBrands = () => {
  return (
    <section className="bg-white py-20 border-y border-[#CCE0F5]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-black text-[#111111] uppercase tracking-tight mb-12 text-center">
          Top Brands We Carry
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex items-center justify-center aspect-[4/3] group"
            >
              <Link to={`/brand/${brand.slug}`} className="absolute inset-0">
                <div className="flex items-center justify-center w-full h-full p-5">
                  <div className="flex items-center justify-center w-full h-full">
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
                <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-heading font-semibold
                  md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300 md:ease-out">
                  {brand.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/brands" className="group inline-flex items-center gap-2 text-primary font-heading font-bold text-sm uppercase tracking-wider">
            View All 50+ Brands <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
