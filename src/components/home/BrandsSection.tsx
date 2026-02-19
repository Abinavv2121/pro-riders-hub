import { motion } from "framer-motion";

const brands = [
  "Lapierre", "Giant", "Trek", "Argon 18", "Avanti",
  "Specialized", "Cannondale", "Scott", "Bianchi", "BMC",
];

const BrandsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Authorized Dealer</p>
          <h2 className="font-heading font-bold text-foreground text-3xl md:text-4xl">
            World-Class Brands
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {brands.map((brand, i) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-center py-8 px-4 border border-border rounded-sm hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <span className="font-heading font-bold text-muted-foreground group-hover:text-foreground transition-colors text-lg tracking-wide uppercase">
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
