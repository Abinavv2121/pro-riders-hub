import { Button } from "@/components/ui/button";
import { Bike } from "@/data/bikes";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Eye } from "lucide-react";
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
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddItem({
      id: bike.id,
      name: bike.name,
      brand: bike.brand,
      image: bike.image,
      color: bike.color,
      size: bike.size,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isOnSale = bike.originalPrice && bike.originalPrice > bike.price;
  const savings = isOnSale ? bike.originalPrice! - bike.price : 0;

  const getStockColor = (status?: string) => {
    switch (status) {
      case "In Stock": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "Limited Stock": return "text-amber-600 bg-amber-50 border-amber-100";
      case "Preorder": return "text-blue-600 bg-blue-50 border-blue-100";
      case "Out of Stock": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${bike.id}`)}
      className="group relative rounded-2xl overflow-hidden bg-white border border-[#CCE0F5] transition-all duration-500 cursor-pointer hover:shadow-[0_20px_40px_rgba(0,80,180,0.12)]"
    >
      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isOnSale && (
          <div className="bg-primary text-white text-[10px] font-heading font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
            SALE
          </div>
        )}
        {bike.tag && bike.tag !== "Sale" && (
          <div className="bg-[#111111] text-white text-[10px] font-heading font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            {bike.tag.toUpperCase()}
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="absolute top-4 right-4 z-20">
        <span className={`text-[9px] font-heading font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${getStockColor(bike.stockStatus)}`}>
          {bike.stockStatus || "In Stock"}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[1.1/1] flex items-center justify-center p-8 bg-white overflow-hidden">
        <motion.img
          src={bike.image}
          alt={bike.name}
          className="max-h-full max-w-full object-contain relative z-10"
          animate={{ 
            scale: isHovered ? 1.08 : 1,
            rotate: isHovered ? -2 : 0
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy"
        />
        
        {/* Subtle background glow on hover */}
        <div className={`absolute inset-0 bg-primary/5 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Save Badge */}
        {isOnSale && (
          <div className="absolute bottom-4 left-4 bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-lg border border-primary/20 backdrop-blur-sm z-20">
            Save {formatPrice(savings)}
          </div>
        )}

        {/* View Details Quick Action */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 z-20 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white/90 backdrop-blur-md text-[#111111] px-5 py-2.5 rounded-full shadow-xl font-heading font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 border border-white">
            <Eye className="w-3.5 h-3.5" /> View Details
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-0">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[#888888] text-[10px] uppercase tracking-[0.15em] font-heading font-black">
            {bike.brand}
          </p>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-[#F5A623] text-[#F5A623]" />
            <span className="text-[10px] font-bold text-[#111111]">{bike.rating || 5.0}</span>
          </div>
        </div>
        
        <h3 className="font-heading font-black text-[#111111] text-[17px] mb-3 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {bike.name}
        </h3>
        
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col">
            {isOnSale && (
              <span className="text-[12px] text-[#888888] line-through font-medium leading-none mb-1">
                {formatPrice(bike.originalPrice!)}
              </span>
            )}
            <span className="text-[22px] font-black text-[#111111] leading-none">
              {formatPrice(bike.price)}
            </span>
          </div>

          <Button
            className={`h-11 px-4 rounded-xl font-heading font-bold uppercase tracking-wider text-[11px] transition-all duration-500 shadow-lg ${
              isAdded 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white w-full" 
                : "bg-[#111111] hover:bg-primary text-white aspect-square md:aspect-auto md:px-6"
            }`}
            onClick={handleAddToCart}
          >
            {isAdded ? (
              <span className="flex items-center gap-2">✓ Added</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Buy</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
