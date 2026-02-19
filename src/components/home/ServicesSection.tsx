import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Wrench, Ruler, Settings, Bike, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Bike Servicing",
    description: "Complete maintenance from basic tune-ups to full overhauls by certified mechanics.",
  },
  {
    icon: Ruler,
    title: "Professional Fitting",
    description: "Precision bike fitting using advanced tools for maximum comfort and performance.",
  },
  {
    icon: Settings,
    title: "Suspension Tuning",
    description: "Expert suspension setup and tuning for MTB riders seeking optimal trail performance.",
  },
  {
    icon: Bike,
    title: "Custom Builds",
    description: "Dream bike, built to spec. Choose every component for your perfect ride.",
  },
];

const ServicesSection = () => {
  return (
    <section className="section-dark py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Expert Services</p>
            <h2 className="font-heading font-bold text-hero-foreground text-3xl md:text-5xl mb-6 leading-tight">
              More Than a Store.
              <br />
              <span className="text-hero-foreground/50">A Workshop.</span>
            </h2>
            <p className="text-hero-foreground/60 font-body text-lg mb-8 max-w-lg">
              Our team of certified mechanics brings decades of expertise to every bike that enters our workshop.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-heading font-semibold text-sm uppercase tracking-wider hover:gap-3 transition-all"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 border border-hero-foreground/10 rounded-sm hover:border-primary/30 transition-colors group"
              >
                <service.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading font-bold text-hero-foreground text-base mb-2">
                  {service.title}
                </h3>
                <p className="text-hero-foreground/50 text-sm font-body leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
