import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
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
    <section className="space-section">
      <div className="container mx-auto px-5 md:px-8">
        <div className="text-center mb-16">
          <ScrollReveal as="h2" drift={12} className="font-heading text-section-sm md:text-section text-foreground mb-4">
            Find Your Ride
          </ScrollReveal>
          <ScrollReveal as="p" delay={0.1} drift={10} className="text-muted-foreground font-body text-body max-w-xl mx-auto">
            From road racing to trail blazing — discover the perfect bike for every terrain.
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                to={cat.href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-lg"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-primary text-xs uppercase tracking-widest font-heading font-semibold mb-1">
                    {cat.subtitle}
                  </p>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-foreground text-xl lg:text-2xl">
                      {cat.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
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
