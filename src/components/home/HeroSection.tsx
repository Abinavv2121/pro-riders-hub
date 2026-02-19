import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-road.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium road cycling"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-primary font-heading font-semibold tracking-[0.3em] uppercase text-sm mb-6">
            Est. 1975 — Chennai, India
          </p>
          <h1 className="font-heading font-black text-hero-foreground text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6">
            PRECISION
            <br />
            <span className="text-gradient-red">ENGINEERING</span>
            <br />
            MEETS EXPERTISE
          </h1>
          <p className="text-hero-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body font-light">
            Your friendly neighbourhood bike shop — delivering premium global cycling experience for over 50 years.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button variant="hero" size="lg" className="px-10 py-6 text-base">
                Shop Bikes
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="hero-outline" size="lg" className="px-10 py-6 text-base">
                Our Services
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-hero-foreground/0 via-hero-foreground/40 to-hero-foreground/0" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
