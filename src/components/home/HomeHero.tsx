import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import summerSaleImg from "@/assets/bikes/summer sale.png";
import heroVideo from "@/assets/hero img pedeling.mp4";

const slides = [
  {
    id: 1,
    type: 'video',
    background: heroVideo,
    title: (
      <>
        PRECISION <br />
        ENGINEERING <br />
        <span className="text-primary">MEETS EXPERTISE</span>
      </>
    ),
    description: "Chennai's #1 cycling destination since 1975. High-performance bikes, expert engineering, and premium components for the ultimate riding experience.",
    ctaPrimary: { text: "Shop Collection", link: "/shop" },
    ctaSecondary: { text: "Explore All Bikes", link: "/shop" },
    stats: [
      { label: "50+ Years", icon: "🏆" },
      { label: "200+ Bikes", icon: "🚲" },
      { label: "Up to 40% Off", icon: "🔥" }
    ]
  },
  {
    id: 2,
    type: 'image',
    background: summerSaleImg,
    badge: "SUMMER SALE IS LIVE",
    title: (
      <>
        SUMMER SALE <br />
        <span className="text-primary">UP TO 40% OFF</span>
      </>
    ),
    description: "Ride premium bikes, gear, and components at unbeatable summer prices. Free shipping on orders above ₹1,999. EMI available.",
    ctaPrimary: { text: "SHOP THE SALE", link: "/shop" },
    ctaSecondary: { text: "EXPLORE DEALS", link: "/shop" },
    stats: [
      { label: "Free Shipping", icon: "🚚" },
      { label: "EMI Available", icon: "💳" },
      { label: "Since 1975", icon: "✨" },
      { label: "40% Off", icon: "🔥" }
    ]
  }
];

const HomeHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000); // 3 seconds
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-[var(--header-total-height)] lg:pt-[var(--header-total-height-lg)] bg-black">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          {slides[currentSlide].type === 'video' ? (
            <video
              src={slides[currentSlide].background}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={slides[currentSlide].background}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          )}
          {/* Dark Overlay with custom gradient for slide 2 */}
          <div className={`absolute inset-0 ${currentSlide === 1 ? 'bg-gradient-to-r from-black/80 via-black/40 to-transparent' : 'bg-black/45'}`} />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col justify-center min-h-[calc(100vh-var(--header-total-height-lg))] py-12 lg:py-24">
        <div className="max-w-[620px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-start text-left"
            >
              {slides[currentSlide].badge && (
                <div className="bg-primary text-white text-[11px] font-heading font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
                  {slides[currentSlide].badge}
                </div>
              )}

              <h1 className="text-4xl md:text-6xl lg:text-[76px] font-heading font-bold text-white leading-[1.05] mb-8 tracking-tight uppercase">
                {slides[currentSlide].title}
              </h1>

              <p className="text-lg md:text-xl text-white/90 font-body max-w-xl mb-10 leading-relaxed">
                {slides[currentSlide].description}
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Button asChild className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-full font-heading font-bold text-sm uppercase tracking-wider group transition-all shadow-lg shadow-primary/25">
                  <Link to={slides[currentSlide].ctaPrimary.link}>
                    {slides[currentSlide].ctaPrimary.text} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-14 px-8 bg-transparent border-white/30 text-white hover:bg-white hover:text-primary hover:border-white rounded-full font-heading font-bold text-sm uppercase tracking-wider transition-all backdrop-blur-sm">
                  <Link to={slides[currentSlide].ctaSecondary.link}>
                    {slides[currentSlide].ctaSecondary.text}
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-6">
                {slides[currentSlide].stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-sm">
                    <span className="text-sm">{stat.icon}</span>
                    <span className="text-[12px] font-heading font-bold text-white uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`w-12 h-1 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-primary w-16" : "bg-white/30 hover:bg-white/50"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeHero;
