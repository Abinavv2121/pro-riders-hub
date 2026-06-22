import { Bike } from "@/data/bikes";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface BikeCardProps {
  bike: Bike;
  index: number;
  layout?: "center" | "left";
  onAddItem?: (item: {
    id: number;
    name: string;
    brand: string;
    image: string;
    color: string;
    size: string;
  }) => void;
}

export const BikeCard = ({ bike, index, layout = "center" }: BikeCardProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return "Rs. " + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isOnSale = bike.originalPrice && bike.originalPrice > bike.price;
  const discountPercent = isOnSale 
    ? Math.round(((bike.originalPrice! - bike.price) / bike.originalPrice!) * 100)
    : 0;

  const emiAmount = Math.round(bike.price / 8.496);

  const getStockBadgeClass = (status?: string) => {
    switch (status) {
      case "In Stock": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "Limited Stock": return "text-amber-600 bg-amber-50 border-amber-100";
      case "Preorder": return "text-blue-600 bg-blue-50 border-blue-100";
      case "Out of Stock": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-emerald-600 bg-emerald-50 border-emerald-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => navigate(`/product/${bike.id}`)}
      className={`bike-product-card group relative bg-white transition-all duration-300 cursor-pointer flex flex-col items-center select-none ${layout === "left" ? "layout-left" : ""}`}
    >

      {/* Stock Status Badge */}
      <div className={`absolute top-2 ${layout === "left" ? "left-2" : "right-2"} z-20 pointer-events-none`}>
        <span className={`text-[8px] font-sans font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${getStockBadgeClass(bike.stockStatus)}`}>
          {bike.stockStatus || "In Stock"}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square flex items-center justify-center p-1 overflow-hidden">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-full object-contain relative z-10"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Product Details */}
      <div className="bike-card-info">

        {/* Product Name */}
        {layout === "left" ? (
          <div className="bike-card-title-row">
            <h3 className="bike-card-title">
              {bike.name.toLowerCase().startsWith(bike.brand.toLowerCase())
                ? bike.name
                : `${bike.brand} ${bike.name}`}
            </h3>
            <div className="bike-card-rating-inline">
              <span className="rating-star">★</span>
              <span>{Math.round(bike.rating || 5)}</span>
            </div>
          </div>
        ) : (
          <h3 className="bike-card-title">
            {bike.name.toLowerCase().startsWith(bike.brand.toLowerCase())
              ? bike.name
              : `${bike.brand} ${bike.name}`}
          </h3>
        )}

        {/* Color / Variant */}
        <p className="bike-card-variant">
          ({bike.color})
        </p>

        {/* Price Row */}
        <div className="bike-card-price">
          {isOnSale ? (
            <>
              <span className="original-price">
                {formatPrice(bike.originalPrice!)}
              </span>
              <span className="current-price">
                {formatPrice(bike.price)}
              </span>
            </>
          ) : (
            <span className="current-price">
              {formatPrice(bike.price)}
            </span>
          )}
        </div>

        {/* EMI Row */}
        <p className="bike-card-emi">
          or{' '}
          <strong>
            Rs.{emiAmount.toLocaleString('en-IN')}
          </strong>
          /Month{' '}
          <span className="hover:underline transition-colors cursor-pointer">
            Buy on EMI &gt;
          </span>
        </p>

        {/* Star Rating & Review Count */}
        {layout !== "left" && (
          <div className="bike-card-reviews">
            <span className="review-stars">
              {"★".repeat(Math.round(bike.rating || 5))}
              <span style={{ color: '#d4d4d4' }}>
                {"☆".repeat(5 - Math.round(bike.rating || 5))}
              </span>
            </span>
            <span className="review-count">
              {bike.reviews || 2} reviews
            </span>
          </div>
        )}

      </div>
    </motion.div>
  );
};
