import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="space-section bg-gradient-primary">
      <div className="container mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-heading text-section-sm md:text-section text-primary-foreground mb-6">
            Ready to Ride?
          </h2>
          <p className="text-primary-foreground/80 font-body text-body mb-10">
            Visit our store in Chennai or connect with us on WhatsApp for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Phone className="w-4 h-4" />
                WhatsApp Us
              </Button>
            </a>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <MapPin className="w-4 h-4" />
                Visit Store
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
