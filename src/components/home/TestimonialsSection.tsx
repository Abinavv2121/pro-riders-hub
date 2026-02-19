import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Road Cyclist",
    text: "ProBikers transformed my cycling experience. The professional fitting alone made a world of difference. Incredible expertise and genuine passion for the sport.",
  },
  {
    name: "Priya Venkatesh",
    role: "MTB Enthusiast",
    text: "From helping me choose my first mountain bike to maintaining it for 3 years, ProBikers has been outstanding. True cycling experts who care about their customers.",
  },
  {
    name: "Arjun Mehta",
    role: "Triathlete",
    text: "The custom build service is world-class. They understood my racing needs perfectly and built a bike that shaved minutes off my time. Highly recommend.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Testimonials</p>
          <h2 className="font-heading font-bold text-foreground text-3xl md:text-4xl">
            Trusted by 50,000+ Riders
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 border border-border rounded-sm hover:shadow-xl transition-shadow duration-300"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground font-body leading-relaxed mb-6 text-sm">
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
