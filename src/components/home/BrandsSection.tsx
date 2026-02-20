import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const brands = [
  "Lapierre", "Giant", "Trek", "Argon 18", "Avanti",
  "Specialized", "Cannondale", "Scott", "Bianchi", "BMC",
];

const BrandTile = ({ brand, i }: { brand: string; i: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex items-center justify-center py-8 px-4 rounded-lg group overflow-hidden
        glass-card hover:border-primary/20 transition-colors duration-200"
    >
      {/* Top highlight */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />
      {/* Hover radial glow */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[240ms] pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 50%, hsl(193 100% 42% / 0.08) 0%, transparent 70%)" }}
      />
      {/* Cyan edge accent on hover */}
      <span className="absolute inset-x-0 bottom-0 h-px bg-primary/0 group-hover:bg-primary/40 transition-colors duration-[240ms] pointer-events-none" />
      <span className="relative font-heading font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-[240ms] text-lg tracking-wide uppercase">
        {brand}
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
            <BrandTile key={brand} brand={brand} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
