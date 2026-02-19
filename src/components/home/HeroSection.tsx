import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Shield } from "lucide-react";
import heroImage from "@/assets/hero-road.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium road cycling"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-lg-space items-center min-h-screen py-32">
          {/* Left — Content Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-primary font-heading font-semibold tracking-[0.3em] uppercase text-small mb-6">
              Est. 1975 — Chennai, India
            </p>

            <h1 className="font-heading font-black text-foreground text-hero-sm md:text-hero-md lg:text-hero leading-[1.05] mb-6">
              PRECISION
              <br />
              <span className="text-gradient-primary">ENGINEERING</span>
              <br />
              MEETS EXPERTISE
            </h1>

            <p className="text-muted-foreground text-body max-w-lg mb-8 font-body">
              Your friendly neighbourhood bike shop — delivering premium global cycling experience for over 50 years.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <div className="flex items-center gap-2 text-small text-muted-foreground font-micro">
                <Shield className="w-4 h-4 text-primary" />
                Trusted by 50,000+ Riders
              </div>
              <span className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5 text-small text-muted-foreground font-micro">
                <Star className="w-4 h-4 fill-primary text-primary" />
                4.9 Google Rating
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button size="lg">Shop Bikes</Button>
              </Link>
              <Link to="/services">
                <Button variant="secondary" size="lg">
                  Our Services
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right — intentionally empty for hero visual (background image) */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-[1px] h-10 bg-gradient-to-b from-foreground/0 via-foreground/30 to-foreground/0" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
