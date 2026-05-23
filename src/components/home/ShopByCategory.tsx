import { bikes } from "@/data/bikes";
import { Link } from "react-router-dom";
import { Bike, Mountain, Navigation, Route, ShieldCheck, Shirt, Settings, Wrench } from "lucide-react";

const ShopByCategory = () => {
  const categories = [
    { name: "Road Bikes", icon: Bike, path: "/shop/race-road", count: 0 },
    { name: "Mountain Bikes", icon: Mountain, path: "/shop/mtb", count: 0 },
    { name: "Hybrid / City", icon: Navigation, path: "/shop/city-fitness", count: 0 },
    { name: "Gravel Bikes", icon: Route, path: "/shop/gravel", count: 0 },
    { name: "Helmets", icon: ShieldCheck, path: "/shop", count: 12 },
    { name: "Apparel", icon: Shirt, path: "/shop", count: 24 },
    { name: "Components", icon: Settings, path: "/shop", count: 156 },
    { name: "Accessories", icon: Wrench, path: "/shop", count: 85 }
  ];

  // Update counts for bikes from data
  categories[0].count = bikes.filter(b => b.category === "race-road" || b.category === "endurance-road").length;
  categories[1].count = bikes.filter(b => b.category === "mtb").length;
  categories[2].count = bikes.filter(b => b.category === "city-fitness").length;
  categories[3].count = bikes.filter(b => b.category === "gravel").length;

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-black text-[#111111] uppercase tracking-tight mb-12 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={cat.path}
              className="group bg-white border border-[#CCE0F5] rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,80,180,0.08)]"
            >
              <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                <cat.icon size={48} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="text-[16px] font-heading font-bold text-[#111111] uppercase tracking-wider mb-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-[#888888] font-body uppercase tracking-widest font-semibold">
                {cat.count} Products
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
