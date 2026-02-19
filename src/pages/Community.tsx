import PageShell from "@/components/PageShell";
import { motion } from "framer-motion";
import communityImage from "@/assets/community-ride.jpg";

const Community = () => (
  <PageShell>
    <section className="relative h-[50vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={communityImage} alt="Community ride" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-hero-bg/70" />
      </div>
      <div className="relative z-10 container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Tamil Nadu Cycling Club</p>
          <h1 className="font-heading font-bold text-hero-foreground text-4xl md:text-6xl mb-4">Community</h1>
          <p className="text-hero-foreground/60 font-body text-lg max-w-xl">Group rides, events, and a community that pushes your limits.</p>
        </motion.div>
      </div>
    </section>
  </PageShell>
);

export default Community;
