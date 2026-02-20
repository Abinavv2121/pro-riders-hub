import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Wrench, Ruler, Settings, Bike, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

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
          <div>
            <ScrollReveal as="p" scanline drift={8} className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Expert Services</ScrollReveal>
            <ScrollReveal as="h2" delay={0.08} drift={14} className="font-heading text-section-sm md:text-section text-foreground mb-6 leading-tight">
              More Than a Store.
              <br />
              <span className="text-muted-foreground">A Workshop.</span>
            </ScrollReveal>
            <ScrollReveal as="p" delay={0.16} drift={10} className="text-muted-foreground font-body text-body mb-8 max-w-lg">
              Our team of certified mechanics brings decades of expertise to every bike that enters our workshop.
            </ScrollReveal>
            <ScrollReveal delay={0.24} drift={10}>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-primary font-heading font-semibold text-small uppercase tracking-wider group"
              >
                <span className="relative">
                  View All Services
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-primary w-0 group-hover:w-full transition-all duration-200" />
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="glass-card p-6 rounded-lg hover:border-primary/20 transition-colors duration-200 group relative overflow-hidden"
              >
                {/* Radial glow on hover */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[240ms] pointer-events-none"
                  style={{ background: "radial-gradient(circle at 30% 20%, hsl(193 100% 42% / 0.06) 0%, transparent 60%)" }}
                />
                <service.icon className="relative w-7 h-7 text-primary mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="relative font-heading font-bold text-foreground text-base mb-2">
                  {service.title}
                </h3>
                <p className="relative text-muted-foreground text-small font-body leading-relaxed">
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
