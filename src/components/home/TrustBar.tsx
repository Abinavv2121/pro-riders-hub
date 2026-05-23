const TrustBar = () => {
  const items = [
    { label: "Free Shipping over ₹1,999", icon: "🚚" },
    { label: "30-Day Easy Returns", icon: "↩️" },
    { label: "2-Year Warranty", icon: "🛡️" },
    { label: "No-Cost EMI Available", icon: "💳" }
  ];

  return (
    <div className="bg-[#EBF4FF] border-b border-[#CCE0F5]">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-3 py-2 border-r last:border-r-0 border-[#CCE0F5] group">
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-[11px] md:text-xs font-heading font-bold text-[#111111] uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
