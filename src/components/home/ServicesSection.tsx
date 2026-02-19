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
    <section className="space-section">
      <div className="container mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-lg-space items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Expert Services</p>
            <h2 className="font-heading text-section-sm md:text-section text-foreground mb-6 leading-tight">
              More Than a Store.
              <br />
              <span className="text-muted-foreground">A Workshop.</span>
            </h2>
            <p className="text-muted-foreground font-body text-body mb-8 max-w-lg">
              Our team of certified mechanics brings decades of expertise to every bike that enters our workshop.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-heading font-semibold text-small uppercase tracking-wider hover:gap-3 transition-all duration-200"
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
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="p-6 border border-border rounded-lg hover:border-primary/30 transition-all duration-200 group"
              >
                <service.icon className="w-7 h-7 text-primary mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="font-heading font-bold text-foreground text-base mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-small font-body leading-relaxed">
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
