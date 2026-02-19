import { motion } from "framer-motion";
import { Award } from "lucide-react";

const GCNSection = () => {
  return (
    <section className="section-dark py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-primary text-xs uppercase tracking-widest font-heading font-bold">
              Global Recognition
            </span>
          </div>
          <h2 className="font-heading font-bold text-hero-foreground text-3xl sm:text-4xl md:text-5xl mb-4">
            Global Recognition for Excellence!
          </h2>
          <p className="text-hero-foreground/50 font-body text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Pro-Bikers proudly holds the title of{" "}
            <span className="text-primary font-semibold">
              The Best Bike Shop in the World
            </span>
            , awarded by GCN! 🌍🚴‍♀️
          </p>
          <p className="text-hero-foreground/40 font-body text-sm sm:text-base max-w-xl mx-auto mt-3">
            Experience world-class service, premium bikes, and a passion for cycling that sets us apart.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative w-full rounded-sm overflow-hidden border border-hero-foreground/10 aspect-video">
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
