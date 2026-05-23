import { BikeCard } from "@/components/BikeCard";
import { useCart } from "@/contexts/CartContext";
import { bikes } from "@/data/bikes";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const NewArrivalsGrid = () => {
  const { addItem } = useCart();
  
  // Pick newest products (assuming higher IDs are newer or tagged as New Arrival)
  const newArrivals = bikes
    .filter(b => b.tag === "New Arrival" || b.id > 10)
    .slice(0, 4);

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-black text-[#111111] uppercase tracking-tight mb-3">
            New Arrivals
          </h2>
          <Link to="/shop" className="group flex items-center gap-2 text-primary font-heading font-bold text-sm uppercase tracking-wider">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((bike, index) => (
            <BikeCard 
              key={bike.id} 
              bike={bike} 
              index={index} 
              onAddItem={addItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsGrid;
