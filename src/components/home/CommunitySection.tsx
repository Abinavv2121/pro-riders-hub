import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import communityImage from "@/assets/community-ride.jpg";

const CommunitySection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={communityImage} alt="Community ride" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-hero-bg/80" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">
            Join the Community
          </p>
          <h2 className="font-heading font-bold text-hero-foreground text-3xl md:text-5xl mb-6">
            Ride Together. Grow Together.
          </h2>
          <p className="text-hero-foreground/60 font-body text-lg mb-10 max-w-2xl mx-auto">
            Join the Tamil Nadu Cycling Club and connect with thousands of passionate riders. Weekly group rides, events, and a community that pushes your limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/community">
              <Button variant="hero" size="lg" className="px-10">
                Join a Ride
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="hero-outline" size="lg" className="px-10">
                View Events
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
