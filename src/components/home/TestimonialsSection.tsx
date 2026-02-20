import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import reviewerRamesh from "@/assets/reviewer-ramesh.png";

const testimonials = [
  {
    name: "R Ramesh Prasad",
    role: "Loyal Customer — 16 Years",
    avatar: reviewerRamesh,
    text: "I have bought 7 bicycles in the last 16 years. What more should I say. The very idea of cycling landscape what we see in Chennai and beyond all started from here. And the credit goes to none other than the man Suresh and his team. Someone who hails from selling a traditional brand of cycling to now selling world-class bicycles — Suresh is highly passionate about cycles and the cycling world. He has travelled the world to gain knowledge visiting popular brands of cycling companies. Go to him for professional bikes. Go Pro-Bike. Highly recommended.",
    rating: 5,
    featured: true,
  },
  {
    name: "Priya Venkatesh",
    role: "MTB Enthusiast",
    avatar: null,
    text: "From helping me choose my first mountain bike to maintaining it for 3 years, ProBikers has been outstanding. True cycling experts who care about their customers.",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Triathlete",
    avatar: null,
    text: "The custom build service is world-class. They understood my racing needs perfectly and built a bike that shaved minutes off my time. Highly recommend.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const featured = testimonials[0];
  const others = testimonials.slice(1);

  return (
    <section className="space-section">
      <div className="container mx-auto px-5 md:px-8">
        <div className="text-center mb-16">
          <ScrollReveal as="p" drift={8} className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">
            Testimonials
          </ScrollReveal>
          <ScrollReveal as="h2" delay={0.08} drift={12} className="font-heading text-section-sm md:text-section text-foreground">
            What Our Customers Say...
          </ScrollReveal>
        </div>

        {/* Featured review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card max-w-3xl mx-auto mb-8 p-8 md:p-10 rounded-lg"
        >
          <Quote className="w-8 h-8 text-primary/20 mb-4" />
          <div className="flex gap-1 mb-5">
            {Array.from({ length: featured.rating }).map((_, j) => (
              <Star key={j} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-muted-foreground font-body text-body leading-relaxed mb-8">
            "{featured.text}"
          </p>
          <div className="flex items-center gap-4">
            {featured.avatar && (
              <img
                src={featured.avatar}
                alt={featured.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                loading="lazy"
              />
            )}
            <div>
              <p className="font-heading font-bold text-foreground text-sm">{featured.name}</p>
              <p className="text-muted-foreground text-small font-micro">{featured.role}</p>
            </div>
          </div>
        </motion.div>

        {/* Other reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {others.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass-card p-6 md:p-8 rounded-lg"
            >
              <Quote className="w-6 h-6 text-primary/20 mb-3" />
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground font-body text-small leading-relaxed mb-5">
                "{t.text}"
              </p>
              <div>
                <p className="font-heading font-bold text-foreground text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs font-micro">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
