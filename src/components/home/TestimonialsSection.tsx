import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
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
    featured: false,
  },
  {
    name: "Arjun Mehta",
    role: "Triathlete",
    avatar: null,
    text: "The custom build service is world-class. They understood my racing needs perfectly and built a bike that shaved minutes off my time. Highly recommend.",
    rating: 5,
    featured: false,
  },
];

const TestimonialsSection = () => {
  const featured = testimonials[0];
  const others = testimonials.slice(1);

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">
            Testimonials
          </p>
          <h2 className="font-heading font-bold text-foreground text-3xl sm:text-4xl">
            What Our Customers Say...
          </h2>
        </motion.div>

        {/* Featured review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-10 p-6 sm:p-10 border border-border rounded-sm hover:shadow-xl transition-shadow duration-300"
        >
          <Quote className="w-8 h-8 text-primary/30 mb-4" />
          <div className="flex gap-1 mb-5">
            {Array.from({ length: featured.rating }).map((_, j) => (
              <Star key={j} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-muted-foreground font-body leading-relaxed text-sm sm:text-base mb-8">
            "{featured.text}"
          </p>
          <div className="flex items-center gap-4">
            {featured.avatar && (
              <img
                src={featured.avatar}
                alt={featured.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
              />
            )}
            <div>
              <p className="font-heading font-bold text-foreground text-sm sm:text-base">
                {featured.name}
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm font-body">
                {featured.role}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Other reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {others.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 sm:p-8 border border-border rounded-sm hover:shadow-xl transition-shadow duration-300"
            >
              <Quote className="w-6 h-6 text-primary/30 mb-3" />
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground font-body leading-relaxed text-sm mb-5">
                "{t.text}"
              </p>
              <div>
                <p className="font-heading font-bold text-foreground text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs font-body">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
