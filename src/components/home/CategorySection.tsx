import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import categoryRoad from "@/assets/category-road.jpg";
import categoryMtb from "@/assets/category-mtb.jpg";
import categoryHybrid from "@/assets/category-hybrid.jpg";
import categoryPreowned from "@/assets/category-preowned.jpg";

const categories = [
  { title: "Road", subtitle: "Speed & Performance", image: categoryRoad, href: "/shop/road" },
  { title: "Mountain", subtitle: "Trail & Adventure", image: categoryMtb, href: "/shop/mtb" },
  { title: "Hybrid", subtitle: "City & Comfort", image: categoryHybrid, href: "/shop/hybrid" },
  { title: "Pre-Owned", subtitle: "Certified & Verified", image: categoryPreowned, href: "/pre-owned" },
];

const CategorySection = () => {
  return (
    <section className="section-dark py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-hero-foreground text-3xl md:text-5xl mb-4">
            Find Your Ride
          </h2>
          <p className="text-hero-foreground/50 font-body text-lg max-w-xl mx-auto">
            From road racing to trail blazing — discover the perfect bike for every terrain.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={cat.href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-sm"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hero-bg/90 via-hero-bg/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-primary text-xs uppercase tracking-widest font-heading font-semibold mb-1">
                    {cat.subtitle}
                  </p>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-hero-foreground text-2xl">
                      {cat.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-hero-foreground/60 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
