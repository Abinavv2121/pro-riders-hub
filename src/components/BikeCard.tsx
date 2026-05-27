import { Bike } from "@/data/bikes";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface BikeCardProps {
  bike: Bike;
  index: number;
  onAddItem?: (item: {
    id: number;
    name: string;
    brand: string;
    image: string;
    color: string;
    size: string;
  }) => void;
}

export const BikeCard = ({ bike, index }: BikeCardProps) => {
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
      className="group relative bg-white transition-all duration-300 cursor-pointer flex flex-col items-center select-none"
    >

      {/* Stock Status Badge */}
      <div className="absolute top-2 right-2 z-20 pointer-events-none">
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
      <div className="w-full text-center" style={{ padding: '22px 18px 34px' }}>

        {/* Product Name */}
        <h3
          className="font-tenor text-[#0b0f14] uppercase"
          style={{
            fontSize: '18px',
            lineHeight: 1.45,
            fontWeight: 700,
            letterSpacing: '0.18em',
            margin: '0 0 6px',
          }}
        >
          {bike.name.toLowerCase().startsWith(bike.brand.toLowerCase())
            ? bike.name
            : `${bike.brand} ${bike.name}`}
        </h3>

        {/* Color / Variant */}
        <p
          className="font-tenor text-[#0b0f14] uppercase"
          style={{
            fontSize: '14px',
            lineHeight: 1.4,
            fontWeight: 600,
            letterSpacing: '0.16em',
            marginBottom: '10px',
          }}
        >
          ({bike.color})
        </p>

        {/* Price Row */}
        <div
          className="font-outfit flex items-center justify-center gap-2 flex-wrap"
          style={{ marginBottom: '6px' }}
        >
          {isOnSale ? (
            <>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#9ca3af',
                  textDecoration: 'line-through',
                  letterSpacing: '0.04em',
                }}
              >
                {formatPrice(bike.originalPrice!)}
              </span>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#0b0f14',
                  letterSpacing: '0.04em',
                }}
              >
                {formatPrice(bike.price)}
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#0b0f14',
                letterSpacing: '0.04em',
              }}
            >
              {formatPrice(bike.price)}
            </span>
          )}
        </div>

        {/* EMI Row */}
        <p
          className="font-outfit"
          style={{
            fontSize: '14px',
            lineHeight: 1.45,
            fontWeight: 600,
            color: '#0b0f14',
            marginBottom: '10px',
          }}
        >
          or{' '}
          <span style={{ fontWeight: 800, color: '#0b0f14', fontSize: '14px' }}>
            Rs.{emiAmount.toLocaleString('en-IN')}
          </span>
          /Month{' '}
          <span
            className="hover:underline transition-colors cursor-pointer"
            style={{ fontWeight: 700, color: '#4338ca', fontSize: '14px' }}
          >
            Buy on EMI &gt;
          </span>
        </p>

        {/* Star Rating & Review Count */}
        <div
          className="flex items-center justify-center"
          style={{ gap: '6px', marginTop: '8px' }}
        >
          <span
            style={{
              color: '#f5b400',
              fontSize: '17px',
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}
          >
            {"★".repeat(Math.round(bike.rating || 5))}
            <span style={{ color: '#d4d4d4' }}>
              {"☆".repeat(5 - Math.round(bike.rating || 5))}
            </span>
          </span>
          <span
            className="font-outfit"
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#0b0f14',
              lineHeight: 1,
            }}
          >
            {bike.reviews || 2} reviews
          </span>
        </div>

      </div>
    </motion.div>
  );
};
