import { useEffect, useState, useCallback, useRef } from "react";
import { bikes } from "@/data/bikes";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";

const saleItems = bikes.filter(
  (b) =>
    b.tag === "Sale" ||
    b.tag === "Stock Clearance/Sale" ||
    (b.originalPrice && b.originalPrice > b.price)
);

const SummerSaleBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const endDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const timer = setInterval(() => {
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) { clearInterval(timer); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || saleItems.length <= 1) return;
    autoplayRef.current = setInterval(() => emblaApi.scrollNext(), 3500);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [emblaApi]);

  return (
    <section id="summer-sale" className="bg-white py-16 md:py-24 overflow-hidden border-b border-[#CCE0F5]">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <span className="text-primary text-[13px] font-heading font-bold uppercase tracking-[0.2em] block mb-4">
          ⚡ Limited Time Offer
        </span>

        <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-primary mb-6 leading-none tracking-tight">
          SUMMER SALE
        </h2>

        <p className="text-[#555555] font-body text-base md:text-lg max-w-2xl mx-auto mb-12">
          Massive discounts on bikes, components &amp; apparel. Grab yours before stock runs out.
        </p>

        {/* Countdown Timer */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Mins", value: timeLeft.mins },
            { label: "Secs", value: timeLeft.secs },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center min-w-[90px]">
              <div className="w-full bg-primary rounded-xl p-4 shadow-lg mb-2">
                <span className="text-3xl md:text-4xl font-heading font-black text-white tabular-nums">
                  {item.value.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-[#888888]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Sale Items Carousel */}
        {saleItems.length > 0 ? (
          <div className="relative">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4">
                {saleItems.map((bike) => {
                  const discount = bike.originalPrice
                    ? Math.round(((bike.originalPrice - bike.price) / bike.originalPrice) * 100)
                    : 0;
                  return (
                    <div
                      key={bike.id}
                      className="shrink-0 basis-[260px] sm:basis-[280px] md:basis-[300px]"
                    >
                      <Link
                        to={`/product/${bike.id}`}
                        className="block bg-[#F8FBFF] border border-[#CCE0F5] rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                      >
                        {/* Image */}
                        <div className="relative h-44 bg-white flex items-center justify-center p-4">
                          <img
                            src={bike.image}
                            alt={bike.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          {discount > 0 && (
                            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-heading font-black uppercase px-2 py-1 rounded-full">
                              {discount}% OFF
                            </span>
                          )}
                          {bike.tag && (
                            <span className="absolute top-3 right-3 bg-primary/10 text-primary text-[9px] font-heading font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" />{bike.tag}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-4 text-left">
                          <p className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-primary mb-1">
                            {bike.brand}
                          </p>
                          <h3 className="font-heading font-bold text-[#111111] text-sm leading-tight mb-2 line-clamp-2">
                            {bike.name}
                          </h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-heading font-black text-[#111111]">
                              ₹{bike.price.toLocaleString("en-IN")}
                            </span>
                            {bike.originalPrice && (
                              <span className="text-xs font-body text-[#888888] line-through">
                                ₹{bike.originalPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground font-body mt-1">{bike.stockStatus}</p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <button
              onClick={scrollPrev}
              aria-label="Previous"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white border border-[#CCE0F5] hover:border-primary shadow-md rounded-full p-2.5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#111111]" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white border border-[#CCE0F5] hover:border-primary shadow-md rounded-full p-2.5 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#111111]" />
            </button>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-6">
              {saleItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === selectedIndex ? "bg-primary w-5" : "bg-primary/20 w-1.5"
                  }`}
                />
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/sales"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-heading font-bold uppercase tracking-[0.1em] text-sm px-8 py-3 rounded-lg transition-colors"
              >
                View All Sale Items
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground font-body text-sm">No sale items available right now.</p>
        )}
      </div>
    </section>
  );
};

export default SummerSaleBanner;
