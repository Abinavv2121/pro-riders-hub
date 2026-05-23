const WhyChoose = () => {
  const reasons = [
    {
      icon: "🏆",
      title: "50 Years Strong",
      desc: "Chennai's most trusted cycling store since 1975"
    },
    {
      icon: "🛠️",
      title: "Expert Fitting",
      desc: "Professional bike fitting by certified technicians"
    },
    {
      icon: "🚚",
      title: "Free Shipping",
      desc: "Free delivery on all orders above ₹1,999"
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      desc: "30-day hassle-free returns. No questions asked."
    }
  ];

  return (
    <section className="bg-[#EBF4FF] py-20">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-black text-[#111111] uppercase tracking-tight mb-16">
          Why Choose Pro-Bikers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-[#CCE0F5] flex flex-col items-center group hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-[#F0F6FF] rounded-full flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {reason.icon}
              </div>
              <h3 className="text-lg font-heading font-bold text-[#111111] mb-3">
                {reason.title}
              </h3>
              <p className="text-sm text-[#555555] font-body leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
