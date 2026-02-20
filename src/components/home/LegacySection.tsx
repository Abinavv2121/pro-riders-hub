import { motion } from "framer-motion";
import { Shield, Award, Users, Clock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

const StatCard = ({ icon: Icon, value, suffix, label, delay }: {
  icon: typeof Clock;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) => {
  const { ref, value: count } = useCountUp(value, 1300);

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card p-6 sm:p-8 rounded-lg text-center hover:border-primary/30 transition-colors duration-[240ms] group relative overflow-hidden"
    >
      {/* Specular sweep on enter */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      <Icon className="relative w-6 h-6 sm:w-7 sm:h-7 text-primary mx-auto mb-3" />
      <p className="relative font-heading font-black text-foreground text-2xl sm:text-3xl mb-1">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="relative text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider font-heading">{label}</p>
    </motion.div>
  );
};

const stats = [
  { icon: Clock, value: 50, suffix: "+", label: "Years of Excellence" },
  { icon: Users, value: 50000, suffix: "+", label: "Happy Customers" },
  { icon: Shield, value: 100, suffix: "%", label: "Authorized Dealer" },
  { icon: Award, value: 0, suffix: "", label: "GCN Recognized" },
];

const LegacySection = () => {
  return (
    <section className="section-card space-section">
      <div className="container mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-lg-space items-center">
          <div>
            <ScrollReveal as="p" scanline drift={8} className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Our Legacy</ScrollReveal>
            <ScrollReveal as="h2" delay={0.08} drift={14} className="font-heading text-section-sm md:text-section text-foreground mb-6 leading-tight">
              Since 1975.
              <br />
              <span className="text-muted-foreground">A Legacy of Cycling.</span>
            </ScrollReveal>
            <ScrollReveal as="p" delay={0.16} drift={10} className="text-muted-foreground font-body text-body mb-4 leading-relaxed">
              From our humble beginnings as Balaji Cycles, ProBikers has evolved into India's premier cycling destination. Five decades of passion, precision, and an unwavering commitment to the cycling community.
            </ScrollReveal>
            <ScrollReveal as="p" delay={0.22} drift={10} className="text-muted-foreground font-body text-body leading-relaxed">
              Recognized by the Global Cycling Network and trusted by over 50,000 riders, we continue to bring the world's finest bicycles and expert service to every cyclist who walks through our doors.
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat, i) =>
              stat.value === 0 ? (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="glass-card p-6 sm:p-8 rounded-lg text-center hover:border-primary/30 transition-colors duration-[240ms]"
                >
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary mx-auto mb-3" />
                  <p className="font-heading font-black text-foreground text-2xl sm:text-3xl mb-1">GCN</p>
                  <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider font-heading">{stat.label}</p>
                </motion.div>
              ) : (
                <StatCard
                  key={stat.label}
                  icon={stat.icon}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  delay={i * 0.08}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
