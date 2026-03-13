import coolBicycleOutdoors from "@/assets/cool-bicycle-outdoors.jpg.jpeg";
import PageShell from "@/components/PageShell";
import { motion } from "framer-motion";
import { Award, Clock, Shield, Users } from "lucide-react";

const stats = [
  { icon: Clock, value: "50+", label: "Years of Excellence" },
  { icon: Users, value: "50,000+", label: "Happy Customers" },
  { icon: Shield, value: "100%", label: "Authorized Dealer" },
  { icon: Award, value: "GCN", label: "Recognized" },
];

const About = () => (
  <PageShell>
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 -m-8 md:-m-16">
        <img src={coolBicycleOutdoors} alt="Bicycle outdoors" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(216,16%,7%)]/80" />
      </div>
      <div className="relative z-10 container mx-auto px-5 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Our Story</p>
          <h1 className="font-heading text-hero-sm md:text-section text-foreground mb-8">About Pro-Bikers</h1>
          <div className="space-y-6 text-muted-foreground font-body text-body leading-relaxed">
            <p>Founded in 1975 as Balaji Cycles, Pro-Bikers has evolved from a humble neighbourhood bike shop into India's premier cycling destination. For over five decades, we've been at the heart of Chennai's cycling community.</p>
            <p>Our journey has been one of continuous evolution — from servicing everyday commuter bikes to becoming authorized dealers for the world's most prestigious cycling brands. Today, we bring together precision engineering, expert service, and genuine passion for cycling.</p>
            <p>Recognized by the Global Cycling Network and trusted by over 50,000 riders, Pro-Bikers stands as a testament to what happens when expertise meets dedication. Every bike that leaves our workshop carries our promise of excellence.</p>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="container mx-auto px-5 md:px-8 space-section">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="p-8 border border-border rounded-lg text-center"
          >
            <stat.icon className="w-7 h-7 text-primary mx-auto mb-3" />
            <p className="font-heading font-black text-foreground text-3xl mb-1">{stat.value}</p>
            <p className="text-muted-foreground text-xs uppercase tracking-wider font-heading">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  </PageShell>
);

export default About;
