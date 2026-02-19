import { motion } from "framer-motion";
import { Shield, Award, Users, Clock } from "lucide-react";

const stats = [
  { icon: Clock, value: "50+", label: "Years of Excellence" },
  { icon: Users, value: "50,000+", label: "Happy Customers" },
  { icon: Shield, value: "100%", label: "Authorized Dealer" },
  { icon: Award, value: "GCN", label: "Recognized" },
];

const LegacySection = () => {
  return (
    <section className="section-dark py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Our Legacy</p>
            <h2 className="font-heading font-bold text-hero-foreground text-3xl md:text-5xl mb-6 leading-tight">
              Since 1975.
              <br />
              <span className="text-hero-foreground/50">A Legacy of Cycling.</span>
            </h2>
            <p className="text-hero-foreground/60 font-body text-lg mb-4 leading-relaxed">
              From our humble beginnings as Balaji Cycles, ProBikers has evolved into India's premier cycling destination. Five decades of passion, precision, and an unwavering commitment to the cycling community.
            </p>
            <p className="text-hero-foreground/60 font-body text-lg leading-relaxed">
              Recognized by the Global Cycling Network and trusted by over 50,000 riders, we continue to bring the world's finest bicycles and expert service to every cyclist who walks through our doors.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 border border-hero-foreground/10 rounded-sm text-center hover:border-primary/30 transition-colors"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-heading font-black text-hero-foreground text-3xl mb-1">{stat.value}</p>
                <p className="text-hero-foreground/50 text-xs uppercase tracking-wider font-heading">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
