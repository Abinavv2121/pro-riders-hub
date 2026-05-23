import { Star } from "lucide-react";

const CustomerTestimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      initials: "RK",
      city: "Chennai",
      type: "Road Cyclist",
      quote: "Got my Trek Domane here during the summer sale — saved ₹20,000! The team helped me with sizing and fitting. Highly recommend."
    },
    {
      name: "Ananya Priya",
      initials: "AP",
      city: "Chennai",
      type: "Triathlete",
      quote: "Best cycling store in Tamil Nadu. My Shimano groupset arrived in 2 days, perfectly packed. Will always shop here."
    },
    {
      name: "Suresh Menon",
      initials: "SM",
      city: "Chennai",
      type: "MTB Enthusiast",
      quote: "Been a Pro-Bikers customer for 15 years. Online store is now fantastic — great prices, great service, great deals."
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-black text-[#111111] uppercase tracking-tight mb-16">
          What Chennai Riders Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-[#CCE0F5] rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                ))}
              </div>
              <p className="text-[#555555] font-body italic mb-8 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-heading font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#111111]">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-[#888888] font-body">
                    {t.city} · {t.type}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
