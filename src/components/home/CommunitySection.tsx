import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import communityImage from "@/assets/community-ride.jpg";

const CommunitySection = () => {
  return (
    <section className="relative space-section overflow-hidden">
      <div className="absolute inset-0">
        <img src={communityImage} alt="Community ride" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="relative z-10 container mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">
            Join the Community
          </p>
          <h2 className="font-heading text-section-sm md:text-section text-foreground mb-6">
            Ride Together. Grow Together.
          </h2>
          <p className="text-muted-foreground font-body text-body mb-10 max-w-xl mx-auto">
            Join the Tamil Nadu Cycling Club and connect with thousands of passionate riders. Weekly group rides, events, and a community that pushes your limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/community">
              <Button size="lg">Join a Ride</Button>
            </Link>
            <Link to="/community">
              <Button variant="secondary" size="lg">View Events</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
