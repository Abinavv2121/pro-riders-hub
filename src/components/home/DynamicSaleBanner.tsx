import { useEffect, useState, useCallback, useRef } from "react";
import { supabase, Sale } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, Tag, ShoppingBag } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";

const DynamicSaleBanner = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchActiveSales = async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("sales")
        .select("*")
        .eq("is_active", true)
        .or(`valid_until.is.null,valid_until.gte.${now}`)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setSales(data);
    };
    fetchActiveSales();
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

  // Auto-play every 5 seconds
  useEffect(() => {
    if (!emblaApi || sales.length <= 1) return;
    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [emblaApi, sales.length]);

  if (sales.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {sales.map((sale) => (
            <div key={sale.id} className="relative min-w-0 shrink-0 grow-0 basis-full">
              {sale.banner_image ? (
                <div className="relative h-[400px] md:h-[500px] w-full">
                  <img
                    src={sale.banner_image}
                    alt={sale.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 text-white">
                    {sale.discount_percentage && (
                      <span className="inline-block bg-primary text-white text-xs font-heading font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-3">
                        {sale.discount_percentage}% OFF
                      </span>
                    )}
                    <h2 className="text-3xl md:text-5xl font-heading font-black uppercase tracking-wide leading-tight mb-2">
                      {sale.title}
                    </h2>
                    {sale.description && (
                      <p className="text-white/80 text-sm md:text-base mb-5 max-w-xl">{sale.description}</p>
                    )}
                    <Link
                      to="/sales"
                      className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 rounded-full font-heading font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 group/btn"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Shop the Sale
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="h-[280px] md:h-[340px] bg-gradient-to-br from-primary to-[#0093b8] flex items-center justify-center px-8">
                  <div className="text-center text-white max-w-2xl">
                    <Tag className="w-10 h-10 mx-auto mb-4 opacity-80" />
                    {sale.discount_percentage && (
                      <span className="inline-block bg-white/20 text-white text-sm font-heading font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-3">
                        {sale.discount_percentage}% OFF
                      </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-wide leading-tight mb-2">
                      {sale.title}
                    </h2>
                    {sale.description && (
                      <p className="text-white/80 text-sm md:text-base mb-5">{sale.description}</p>
                    )}
                    <Link
                      to="/sales"
                      className="inline-flex items-center gap-2 bg-white text-primary font-heading font-bold uppercase tracking-[0.1em] text-sm px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Shop the Sale
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows — only when more than one slide */}
      {sales.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Previous sale"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/65 text-white rounded-full p-2.5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next sale"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/65 text-white rounded-full p-2.5 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {sales.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? "bg-white w-6" : "bg-white/50 w-2"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicSaleBanner;
