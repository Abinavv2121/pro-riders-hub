import { BikeCard } from "@/components/BikeCard";
import { useCart } from "@/contexts/CartContext";
import { bikes } from "@/data/bikes";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HotDealsGrid = () => {
  const { addItem } = useCart();
  
  // Pick products on sale or with high reviews
  const hotDeals = bikes
    .filter(b => b.originalPrice || (b.rating && b.rating >= 5))
    .slice(0, 8);

  return (
    <section className="bg-[#F0F6FF] py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-[#111111] uppercase tracking-tight">
              Hot Deals
            </h2>
          </div>
          <Link to="/shop" className="group flex items-center gap-2 text-primary font-heading font-bold text-sm uppercase tracking-wider">
            View All Sale <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotDeals.map((bike, index) => (
            <BikeCard 
              key={bike.id} 
              bike={bike} 
              index={index} 
              layout="left"
              onAddItem={addItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotDealsGrid;
