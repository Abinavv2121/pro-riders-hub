import { useEffect, useState } from "react";

const SummerSaleBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [activeFilter, setActiveFilter] = useState("All Deals");

  const filters = ["All Deals", "Road Bikes", "MTB", "Helmets", "Apparel", "Accessories"];

  useEffect(() => {
    const endDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    
    const timer = setInterval(() => {
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          Massive discounts on bikes, components & apparel. Grab yours before stock runs out.
        </p>

        {/* Countdown Timer */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Mins", value: timeLeft.mins },
            { label: "Secs", value: timeLeft.secs }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center min-w-[90px]">
              <div className="w-full bg-primary rounded-xl p-4 shadow-lg mb-2">
                <span className="text-3xl md:text-4xl font-heading font-black text-white tabular-nums">
                  {item.value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-[#888888]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-[12px] font-heading font-bold uppercase tracking-wider transition-all duration-300 border ${
                activeFilter === filter
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "bg-white border-[#CCE0F5] text-primary hover:bg-[#F0F6FF]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SummerSaleBanner;
