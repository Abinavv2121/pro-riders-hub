import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import {
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle,
  Users,
  Plus,
  Minus,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ApparelAccessoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, updateQuantity } = useCart();

  const product = products.find((p) => p.id === parseInt(id || "0"));
  const images: string[] = product?.images?.length ? product.images : product?.image ? [product.image] : [""];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Set default size and scroll to top once product is loaded
  useEffect(() => {
    if (product) {
      const sizes = product.size.split(" / ");
      setSelectedSize(sizes[0]);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [product, id]);

  // Handle sticky purchase bar scroll trigger
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: product.image,
      color: product.color,
      size: selectedSize || product.size.split(" / ")[0],
    });
    
    // Update quantity in the cart if more than 1 is selected
    if (quantity > 1) {
      setTimeout(() => {
        updateQuantity(product.id, quantity);
      }, 50);
    }
  };

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const features = useMemo(() => {
    if (!product) return [];
    return product.features || [
      "Premium quality materials for enhanced durability.",
      "Optimized design for professional and amateur use.",
      "Tested under rigorous conditions for reliable performance.",
      "Backed by manufacturer warranty."
    ];
  }, [product]);

  const specifications = useMemo(() => {
    if (!product) return [];
    const list: { label: string; value: string }[] = [];
    if (product.specifications) {
      Object.entries(product.specifications).forEach(([k, v]) => {
        list.push({ label: k, value: v as string });
      });
    }
    return list;
  }, [product]);

  if (!product) return <Navigate to="/shop" />;

  const categoryLabel = product.category.replace(/-/g, ' ');
  const stockStatus = product.stockStatus || "In Stock";
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <PageShell>
      <div className="product-detail-page">
        <div className="product-detail-container">

          {/* ── Main Two-Column Layout ── */}
          <div className="product-layout">
            
            {/* LEFT: Media Stage */}
            <div className="product-media">
              {/* Main Image Stage */}
              <div className="product-image-stage relative overflow-hidden bg-[#fafafa]">
                {product.tag && (
                  <span className="absolute top-5 left-5 z-10 bg-[#111111] text-white text-[10px] font-heading font-black uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full">
                    {product.tag}
                  </span>
                )}
                {discount > 0 && (
                  <span className="absolute top-5 right-5 z-10 bg-red-500 text-white text-[11px] font-heading font-black px-3 py-1 rounded-md">
                    -{discount}%
                  </span>
                )}
                <AnimatePresence mode="wait">
                  {images[currentIndex] ? (
                    <motion.img
                      key={currentIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      src={images[currentIndex]}
                      alt={product.name}
                      className="product-main-image object-contain"
                    />
                  ) : (
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-[500px] flex flex-col items-center justify-center text-[#ccc]"
                    >
                      <span className="text-[14px] font-heading font-black uppercase tracking-widest text-[#999] opacity-50 mb-2">Product Image</span>
                      <span className="text-[14px] font-heading font-black uppercase tracking-widest text-[#999] opacity-50">Not Available</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: Product Info & Buy Box */}
            <div className="product-info">
              {/* 1. Brand / category badge */}
              <div className="product-brand-row">
                <span className="product-brand-badge">{product.brand}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{categoryLabel}</span>
              </div>

              {/* 2. Product title */}
              <h1 className="product-title uppercase font-heading">{product.name}</h1>
              
              {/* 3. Price + stock badge */}
              <div className="product-price-row">
                <span className="product-price text-[#0b0f14]">₹{product.price.toLocaleString("en-IN")}</span>
                {product.originalPrice && (
                  <span className="text-xl text-[#999] line-through font-medium">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="stock-badge">
                  {stockStatus}
                </span>
              </div>

              {/* 4. Short description */}
              <p className="product-description font-body leading-relaxed text-[#4b5563]">
                {product.description}
              </p>

              {/* PURCHASE PANEL */}
              <div className="purchase-panel">
                <div className="product-options">
                  <div className="option-group">
                    <span className="option-label block">Select Size</span>
                    <div className="size-selector">
                      {product.size.split(" / ").map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`size-button ${selectedSize === s ? "active" : ""}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <span className="option-label block">Quantity</span>
                    <div className="quantity-selector">
                      <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="text-[#666] hover:bg-slate-50 transition-colors"
                      >
                        <Minus className="w-4 h-4 mx-auto" />
                      </button>
                      <span className="text-[#0b0f14] flex items-center justify-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="text-[#666] hover:bg-slate-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="add-to-cart-button transition-all cursor-pointer flex items-center justify-center hover:opacity-90"
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag className="w-4.5 h-4.5 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      className="enquire-button transition-all cursor-pointer flex items-center justify-center hover:bg-[#0b0f14] hover:text-white"
                      onClick={() => window.open("https://wa.me/919876543210", "_blank")}
                    >
                      <MessageCircle className="w-4.5 h-4.5 mr-2" />
                      Enquire Now
                    </button>
                  </div>
                </div>

                <div className="product-trust-grid">
                  {[
                    { icon: <Truck className="w-4 h-4 text-primary" />, text: "Fast Delivery" },
                    { icon: <ShieldCheck className="w-4 h-4 text-primary" />, text: "Genuine Product" },
                    { icon: <CheckCircle2 className="w-4 h-4 text-primary" />, text: "Quality Checked" },
                  ].map((item, i) => (
                    <div key={i} className="product-trust-item">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. FEATURES */}
              {features.length > 0 && (
                <div className="product-section features-section">
                  <h3 className="product-section-title">F E A T U R E S</h3>
                  <ul className="product-bullet-list font-body text-[#344054]">
                    {features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 6. SPECIFICATIONS */}
              {specifications.length > 0 && (
                <div className="product-section">
                  <h3 className="product-section-title">S P E C I F I C A T I O N S</h3>
                  <div className="product-spec-list">
                    {specifications.map((spec, i) => (
                      <div className="product-spec-row" key={i}>
                        <span className="product-spec-label">{spec.label}</span>
                        <span className="product-spec-value">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Product Insights Section ── */}
      <section className="bg-[#111111] py-16 md:py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 blur-[100px] -z-0" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-tight mb-6">
              Designed For <span className="text-primary">Performance</span>
            </h2>
            <p className="text-[15px] text-white/75 leading-relaxed mb-10">
              Every detail of the {product.name} is crafted to enhance your riding experience. With a perfect blend of high-quality materials and innovative engineering, this product meets the demands of modern cyclists. 
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-heading font-bold text-lg uppercase tracking-wider mb-2">Durability</h3>
                <p className="text-sm text-white/60">Built to withstand the toughest conditions and ensure long-lasting reliability.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-heading font-bold text-lg uppercase tracking-wider mb-2">Comfort</h3>
                <p className="text-sm text-white/60">Ergonomically designed to provide maximum comfort during extensive rides.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-heading font-bold text-lg uppercase tracking-wider mb-2">Tested</h3>
                <p className="text-sm text-white/60">Rigorously tested by cycling professionals to guarantee top-tier performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rider Feedback ── */}
      <section className="bg-[#f9fafb] py-16 border-y border-[#edf0f3]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-xl mx-auto">
            <Users className="w-10 h-10 text-primary/30 mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-black text-[#111111] uppercase tracking-tight mb-3">
              Customer Feedback
            </h2>
            <p className="text-[14px] text-[#666666] mb-6 leading-relaxed font-body">
              Be the first to share your experience with the{" "}
              <span className="text-[#111111] font-semibold">{product.name}</span>.
            </p>
            <Button
              variant="outline"
              className="border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white rounded-xl font-heading font-black uppercase text-xs tracking-wider px-7 h-11"
            >
              Write a Review
            </Button>
          </div>
        </div>
      </section>

      {/* ── Similar Products ── */}
      {similarProducts.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-14 md:py-20">
          <div className="flex items-center justify-center mb-10 relative">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#111111] uppercase tracking-tight text-center">
              Similar {product.type === "apparel" ? "Apparel" : "Accessories"}
            </h2>
            <Link
              to={`/shop?category=${product.category}`}
              className="absolute right-0 text-[12px] font-heading font-black text-primary uppercase tracking-widest flex items-center gap-1.5 hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onAddItem={addItem} />
            ))}
          </div>
        </section>
      )}

      {/* ── Sticky Bottom Cart Bar ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="sticky-cart-bar"
          >
            <div className="sticky-product-info">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="w-[50px] h-[50px] bg-[#fafafa] flex items-center justify-center border border-[#eee] rounded-md mr-3">
                  <span className="text-[8px] text-[#ccc] font-bold uppercase">No Img</span>
                </div>
              )}
              <div>
                <span className="sticky-product-name block">{product.name}</span>
                <span className="sticky-product-brand block">{product.brand}</span>
              </div>
            </div>

            <div className="sticky-actions">
              {/* Size Selector in Sticky Bar */}
              <div className="flex items-center gap-2 mr-2 sticky-size">
                <span className="text-[11px] font-heading font-black uppercase text-[#666] tracking-widest hidden md:inline">Size:</span>
                <span className="bg-[#f0f4f8] text-[#0b0f14] text-xs font-heading font-black px-3 py-1.5 rounded-lg border border-[#e5eaf0]">
                  {selectedSize || product.size.split(" / ")[0]}
                </span>
              </div>

              {/* Quantity Selector in Sticky Bar */}
              <div className="hidden md:flex items-center border border-[#e5eaf0] rounded-xl bg-white p-0.5 mr-2 sticky-quantity">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-7 h-7 flex items-center justify-center text-[#666] hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Minus className="w-3" />
                </button>
                <span className="w-8 text-center font-heading font-bold text-xs text-[#0b0f14]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#666] hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Plus className="w-3" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-heading font-black text-[#0b0f14] mr-1 sticky-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <Button
                  onClick={handleAddToCart}
                  className="sticky-add-to-cart bg-[#0b0f14] text-white hover:bg-primary h-11 text-xs tracking-wider font-heading font-black px-6 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 mr-1.5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
};

export default ApparelAccessoryPage;
