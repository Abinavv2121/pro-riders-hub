import { Button } from "@/components/ui/button";
import { Bike } from "@/data/bikes";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface BikeCardProps {
  bike: Bike;
  index: number;
  onAddItem: (item: {
    id: number;
    name: string;
    brand: string;
    image: string;
    color: string;
    size: string;
  }) => void;
}

export const BikeCard = ({ bike, index, onAddItem }: BikeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate=useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${bike.id}`)}
      className="group relative rounded-lg overflow-hidden bg-white border border-gray-200 transition-all duration-300 cursor-pointer"
    >
      {/* Electric shimmer effect */}
      {false && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)',
          }}
        />
      )}

      
      {bike.tag && (
        <span className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-md">
          {bike.tag}
        </span>
      )}

      <div className="relative aspect-[4/3] flex items-center justify-center p-8 bg-gray-50">
        <img
          src={bike.image}
          alt={bike.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <p className="text-muted-foreground text-xs uppercase tracking-widest font-heading mb-1">
          {bike.brand}
        </p>
        <h3 className="font-heading font-bold text-primary text-lg mb-2 transition-colors duration-200">
          {bike.name}
        </h3>
        <div className="flex items-center gap-3 text-muted-foreground text-xs font-micro mb-4">
          <span>{bike.color}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Size: {bike.size}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="flex-1 text-xs bg-primary text-primary-foreground hover:bg-primary/70 hover:outline hover:outline-2 hover:outline-primary/40 transition-all duration-200"
            onClick={() =>
              onAddItem({
                id: bike.id,
                name: bike.name,
                brand: bike.brand,
                image: bike.image,
                color: bike.color,
                size: bike.size,
              })
            }
          >
            Enquire Now
          </Button>
          <Button
            /* use primary/default style so the icon button has a blue background */
            size="icon"
            className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/70 hover:outline hover:outline-2 hover:outline-primary/40 transition-all duration-200"
            onClick={() =>
              onAddItem({
                id: bike.id,
                name: bike.name,
                brand: bike.brand,
                image: bike.image,
                color: bike.color,
                size: bike.size,
              })
            }
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
