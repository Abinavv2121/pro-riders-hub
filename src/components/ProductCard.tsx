import { Product } from "@/data/products";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
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

export const ProductCard = ({ product, index }: ProductCardProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return "Rs. " + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isOnSale = product.originalPrice && product.originalPrice > product.price;

  const getStockBadgeClass = (status?: string) => {
    switch (status) {
      case "In Stock": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "Limited Stock": return "text-amber-600 bg-amber-50 border-amber-100";
      case "Out of Stock": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-emerald-600 bg-emerald-50 border-emerald-100";
    }
  };

  const routePrefix = product.type === "apparel" ? "apparel" : "accessory";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => navigate(`/product/${routePrefix}/${product.id}`)}
      className="group relative bg-white transition-all duration-300 cursor-pointer flex flex-col items-center select-none"
    >

      {/* Stock Status Badge */}
      <div className="absolute top-2 right-2 z-20 pointer-events-none">
        <span className={`text-[8px] font-sans font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${getStockBadgeClass(product.stockStatus)}`}>
          {product.stockStatus || "In Stock"}
        </span>
      </div>

      {/* Image Container (Empty placeholder as requested) */}
      <div className="relative w-full aspect-square flex items-center justify-center p-1 overflow-hidden bg-[#fafafa]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain relative z-10"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#ccc]">
            <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#999] opacity-50">Image</span>
            <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#999] opacity-50">Not Available</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="w-full text-center" style={{ padding: '22px 18px 34px' }}>

        {/* Product Name */}
        <h3
          className="font-tenor text-[#0b0f14] uppercase"
          style={{
            fontSize: '16px',
            lineHeight: 1.45,
            fontWeight: 700,
            letterSpacing: '0.15em',
            margin: '0 0 6px',
          }}
        >
          {product.name}
        </h3>

        {/* Brand / Category */}
        <p
          className="font-tenor text-[#0b0f14] uppercase"
          style={{
            fontSize: '12px',
            lineHeight: 1.4,
            fontWeight: 600,
            letterSpacing: '0.16em',
            marginBottom: '10px',
            color: '#666',
          }}
        >
          {product.brand} • {product.category.replace(/-/g, ' ')}
        </p>

        {/* Price Row */}
        <div
          className="font-outfit flex items-center justify-center gap-2 flex-wrap"
          style={{ marginBottom: '12px' }}
        >
          {isOnSale ? (
            <>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#9ca3af',
                  textDecoration: 'line-through',
                  letterSpacing: '0.04em',
                }}
              >
                {formatPrice(product.originalPrice!)}
              </span>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0b0f14',
                  letterSpacing: '0.04em',
                }}
              >
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#0b0f14',
                letterSpacing: '0.04em',
              }}
            >
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Star Rating & Review Count */}
        <div
          className="flex items-center justify-center"
          style={{ gap: '6px', marginTop: '8px' }}
        >
          <span
            style={{
              color: '#f5b400',
              fontSize: '15px',
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}
          >
            {"★".repeat(Math.round(product.rating || 5))}
            <span style={{ color: '#d4d4d4' }}>
              {"☆".repeat(5 - Math.round(product.rating || 5))}
            </span>
          </span>
          <span
            className="font-outfit"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#0b0f14',
              lineHeight: 1,
            }}
          >
            {product.reviews || 2} reviews
          </span>
        </div>

      </div>
    </motion.div>
  );
};
