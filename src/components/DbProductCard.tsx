import { DbProduct } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface DbProductCardProps {
  product: DbProduct;
  index: number;
  layout?: "center" | "left";
}

const formatPrice = (price: number) =>
  "Rs. " + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);

const getStockBadgeClass = (status?: string) => {
  switch (status) {
    case "In Stock":      return "text-emerald-600 bg-emerald-50 border-emerald-100";
    case "Limited Stock": return "text-amber-600 bg-amber-50 border-amber-100";
    case "Out of Stock":  return "text-red-600 bg-red-50 border-red-100";
    default:              return "text-emerald-600 bg-emerald-50 border-emerald-100";
  }
};

const readableCategory = (cat: string) =>
  cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const DbProductCard = ({ product, index, layout = "center" }: DbProductCardProps) => {
  const navigate = useNavigate();
  const image = product.images?.[0];
  const isBike = product.type === "bike";
  const isOnSale = product.original_price && product.original_price > product.price;
  const emiAmount = isBike ? Math.round(product.price / 8.496) : 0;

  const cardClass = isBike ? "bike-product-card" : "product-card";
  const infoClass = isBike ? "bike-card-info" : "product-card-info";
  const titleClass = isBike ? "bike-card-title" : "product-card-title";
  const titleRowClass = isBike ? "bike-card-title-row" : "product-card-title-row";
  const variantClass = isBike ? "bike-card-variant" : "product-card-variant";
  const priceClass = isBike ? "bike-card-price" : "product-card-price";
  const emiClass = isBike ? "bike-card-emi" : "product-card-emi";

  // Pick up to 2 key specs to show as pills (bikes only)
  const specPills = isBike
    ? Object.entries(product.specifications || {}).slice(0, 2)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => navigate(`/db-product/${product.id}`)}
      className={`${cardClass} group relative bg-white transition-all duration-300 cursor-pointer flex flex-col items-center select-none ${layout === "left" ? "layout-left" : ""}`}
    >
      {/* Stock Badge */}
      <div className={`absolute top-2 ${layout === "left" ? "left-2" : "right-2"} z-20 pointer-events-none`}>
        <span className={`text-[8px] font-sans font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${getStockBadgeClass(product.stock_status)}`}>
          {product.stock_status || "In Stock"}
        </span>
      </div>

      {/* Tag badge */}
      {product.tag && (
        <div className="absolute top-2 left-2 z-20 pointer-events-none">
          <span className="text-[8px] font-sans font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/20">
            {product.tag}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative w-full aspect-square flex items-center justify-center p-1 overflow-hidden">
        {image ? (
          <img
            src={image}
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

      {/* Info */}
      <div className={infoClass}>
        {layout === "left" ? (
          <div className={titleRowClass}>
            <h3 className={titleClass}>{product.name}</h3>
          </div>
        ) : (
          <h3 className={titleClass}>{product.name}</h3>
        )}

        <p className={variantClass}>
          {product.brand} · {readableCategory(product.category)}
        </p>

        {/* Spec pills for bikes */}
        {specPills.length > 0 && (
          <div className="flex flex-wrap gap-1 my-1">
            {specPills.map(([k, v]) => (
              <span key={k} className="text-[9px] font-sans font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {v}
              </span>
            ))}
          </div>
        )}

        <div className={priceClass}>
          {isOnSale ? (
            <>
              <span className="original-price">{formatPrice(product.original_price!)}</span>
              <span className="current-price">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="current-price">{formatPrice(product.price)}</span>
          )}
        </div>

        {isBike && emiAmount > 0 && (
          <div className={emiClass}>
            <strong>EMI</strong>
            <span>from Rs. {new Intl.NumberFormat("en-IN").format(emiAmount)}/mo</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
