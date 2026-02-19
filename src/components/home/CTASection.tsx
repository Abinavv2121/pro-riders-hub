import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-red">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-heading font-bold text-primary-foreground text-3xl md:text-5xl mb-6">
            Ready to Ride?
          </h2>
          <p className="text-primary-foreground/80 font-body text-lg mb-10">
            Visit our store in Chennai or connect with us on WhatsApp for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <Button variant="hero-outline" size="lg" className="px-10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
            </a>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
              <Button variant="hero-outline" size="lg" className="px-10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <MapPin className="w-4 h-4 mr-2" />
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
