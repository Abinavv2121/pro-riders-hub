import { motion } from "framer-motion";
import { Award } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const GCNSection = () => {
  return (
    <section className="section-card space-section">
      <div className="container mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <ScrollReveal delay={0} drift={8}>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs uppercase tracking-widest font-heading font-bold">
                Global Recognition
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal as="h2" delay={0.08} drift={12} className="font-heading text-section-sm md:text-section text-foreground mb-4">
            Global Recognition for Excellence!
          </ScrollReveal>
          <ScrollReveal as="p" delay={0.16} drift={10} className="text-muted-foreground font-body text-body max-w-2xl mx-auto">
            Pro-Bikers proudly holds the title of{" "}
            <span className="text-primary font-semibold">
              The Best Bike Shop in the World
            </span>
            , awarded by GCN! 🌍🚴‍♀️
          </ScrollReveal>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative w-full rounded-lg overflow-hidden border border-border aspect-video">
            <iframe
              src="https://www.youtube.com/embed/-0OYuIfIm28?rel=0"
              title="Pro-Bikers — Best Bike Shop in the World by GCN"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GCNSection;
