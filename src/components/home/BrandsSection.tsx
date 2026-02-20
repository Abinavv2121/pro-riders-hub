import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const brands = [
  "Lapierre", "Giant", "Trek", "Argon 18", "Avanti",
  "Specialized", "Cannondale", "Scott", "Bianchi", "BMC",
];

const BrandsSection = () => {
  return (
    <section className="section-card space-section">
      <div className="container mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <ScrollReveal as="p" drift={8} className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Authorized Dealer</ScrollReveal>
          <ScrollReveal as="h2" delay={0.08} drift={12} className="font-heading text-section-sm md:text-section text-foreground">
            World-Class Brands
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="flex items-center justify-center py-8 px-4 border border-border rounded-lg hover:border-primary/30 transition-all duration-200 cursor-pointer group"
            >
              <span className="font-heading font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-200 text-lg tracking-wide uppercase">
                {brand}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
