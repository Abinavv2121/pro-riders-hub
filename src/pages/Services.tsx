import PageShell from "@/components/PageShell";
import { Wrench, Ruler, Settings, Bike, Truck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import serviceFitting from "@/assets/service-fitting.jpg";

const services = [
  { icon: Wrench, title: "Bike Servicing", description: "Complete maintenance packages from basic tune-ups to full overhauls. Our certified mechanics handle every brand with precision.", price: "From ₹999" },
  { icon: Ruler, title: "Professional Bike Fitting", description: "Advanced bike fitting using precision tools and biomechanical analysis. Maximize comfort and performance.", price: "From ₹2,499" },
  { icon: Settings, title: "Suspension Tuning", description: "Expert suspension setup and tuning for mountain bikes. Get the most out of your fork and shock.", price: "From ₹1,499" },
  { icon: Bike, title: "Custom Builds", description: "Dream bike, built to your exact specifications. Choose every component for the perfect machine.", price: "Contact Us" },
  { icon: Truck, title: "Pickup & Delivery", description: "We'll pick up your bike, service it, and deliver it back. Hassle-free cycling maintenance.", price: "From ₹299" },
];

const Services = () => (
  <PageShell>
    <section className="relative h-[50vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={serviceFitting} alt="Bike servicing" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
      </div>
      <div className="relative z-10 container mx-auto px-5 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Expert Services</p>
          <h1 className="font-heading text-hero-sm md:text-section text-foreground mb-4">Workshop & Services</h1>
          <p className="text-muted-foreground font-body text-body max-w-xl">Precision engineering meets decades of expertise. Every bike deserves expert care.</p>
        </motion.div>
      </div>
    </section>

    <section className="container mx-auto px-5 md:px-8 space-section">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="p-8 border border-border rounded-lg hover:border-primary/20 transition-all duration-200 group"
          >
            <s.icon className="w-8 h-8 text-primary mb-5 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-heading font-bold text-foreground text-h3 mb-3">{s.title}</h3>
            <p className="text-muted-foreground font-body text-small leading-relaxed mb-4">{s.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-primary text-sm">{s.price}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-16">
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
          <Button size="lg">Book an Appointment</Button>
        </a>
      </div>
    </section>
  </PageShell>
);

export default Services;
