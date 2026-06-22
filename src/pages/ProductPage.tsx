import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { bikes, bikeCategories } from "@/data/bikes";
import { BikeCard } from "@/components/BikeCard";
import {
  ShoppingBag,
  ArrowRight,
  ChevronRight,
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

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, updateQuantity } = useCart();

  const bike = bikes.find((b) => b.id === parseInt(id || "0"));
  const images: string[] = bike?.images?.length ? bike.images : bike ? [bike.image] : [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Set default size and scroll to top once bike is loaded
  useEffect(() => {
    if (bike) {
      const sizes = bike.size.split(" / ");
      setSelectedSize(sizes[0]);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [bike, id]);

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
    if (!bike) return;
    addItem({
      id: bike.id,
      name: bike.name,
      brand: bike.brand,
      image: bike.image,
      color: bike.color,
      size: selectedSize || bike.size.split(" / ")[0],
    });
    
    // Update quantity in the cart if more than 1 is selected
    if (quantity > 1) {
      setTimeout(() => {
        updateQuantity(bike.id, quantity);
      }, 50);
    }
  };

  const similarBikes = useMemo(() => {
    if (!bike) return [];
    return bikes
      .filter((b) => b.category === bike.category && b.id !== bike.id)
      .slice(0, 4);
  }, [bike]);

  const features = useMemo(() => {
    if (!bike) return [];
    if (bike.features && bike.features.length > 0) {
      return bike.features;
    }
    return [
      `Built with a lightweight and durable ${bike.frameMaterial} frame.`,
      `Smooth shifting powered by a ${bike.groupset} (${bike.gears}) groupset.`,
      `Highly reliable ${bike.brakeType} for absolute stopping control.`,
      `Fast-rolling ${bike.wheelSize} wheels optimized for traction and speed.`,
      `Professional high-standard assembly and fine-tuning completed by Pro-Bikers Chennai experts.`
    ];
  }, [bike]);

  const specifications = useMemo(() => {
    if (!bike) return [];
    const list: { label: string; value: string }[] = [];
    const addIfExist = (label: string, val: string | undefined) => {
      if (val) list.push({ label, value: val });
    };

    if (bike.specifications) {
      Object.entries(bike.specifications).forEach(([k, v]) => {
        addIfExist(k, v);
      });
    } else {
      addIfExist("Intended Use", bike.bikeType);
      addIfExist("Wheel Size", bike.wheelSize);
      addIfExist("Braking System", bike.brakeType);
      addIfExist("Frame Material", bike.frameMaterial);
      addIfExist("Groupset", bike.groupset);
      addIfExist("Gears", bike.gears);
      addIfExist("Color", bike.color);
      addIfExist("Warranty", "Lifetime warranty on frame");
    }
    return list;
  }, [bike]);

  const components = useMemo(() => {
    if (!bike) return [];
    const list: { label: string; value: string }[] = [];
    const addIfExist = (label: string, val: string | undefined) => {
      if (val) list.push({ label, value: val });
    };

    if (bike.components) {
      Object.entries(bike.components).forEach(([k, v]) => {
        addIfExist(k, v);
      });
    } else {
      addIfExist("Frame", `${bike.brand} custom ${bike.frameMaterial.toLowerCase()} frame`);
      addIfExist("Drivetrain", `${bike.groupset} components`);
      addIfExist("Shifters", `${bike.gears} integrated gearing`);
      addIfExist("Brakes", bike.brakeType);
      addIfExist("Wheels", `${bike.wheelSize} double-wall alloy rims`);
    }
    return list;
  }, [bike]);

  if (!bike) return <Navigate to="/shop" />;

  const categoryLabel = bikeCategories.find((c) => c.key === bike.category)?.label || bike.bikeType;

  const stockStatus = bike.stockStatus || "In Stock";
  const discount = bike.originalPrice
    ? Math.round(((bike.originalPrice - bike.price) / bike.originalPrice) * 100)
    : 0;

  return (
    <PageShell>
      <div className="product-detail-page">
        <div className="product-detail-container">

          {/* ── Main Two-Column Layout ── */}
          <div className="product-layout">
            
            {/* LEFT: Media Stage */}
            <div className="product-media">
              {/* Thumbnails */}
              <div className="product-thumbnails">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`product-thumbnail ${idx === currentIndex ? "active" : ""}`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} />
                  </div>
                ))}
              </div>

              {/* Main Image Stage */}
              <div className="product-image-stage relative overflow-hidden">
                {bike.tag && (
                  <span className="absolute top-5 left-5 z-10 bg-[#111111] text-white text-[10px] font-heading font-black uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full">
                    {bike.tag}
                  </span>
                )}
                {discount > 0 && (
                  <span className="absolute top-5 right-5 z-10 bg-red-500 text-white text-[11px] font-heading font-black px-3 py-1 rounded-md">
                    -{discount}%
                  </span>
                )}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={images[currentIndex]}
                    alt={bike.name}
                    className="product-main-image"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: Product Info & Buy Box */}
            <div className="product-info">
              {/* 1. Brand / category badge */}
              <div className="product-brand-row">
                <span className="product-brand-badge">{bike.brand}</span>
                <span className="product-category">{categoryLabel}</span>
              </div>

              {/* 2. Product title */}
              <h1 className="product-title uppercase">{bike.name}</h1>
              
              {/* 3. Price + stock badge */}
              <div className="product-price-row">
                <span className="product-price">₹{bike.price.toLocaleString("en-IN")}</span>
                {bike.originalPrice && (
                  <span className="text-xl text-[#999] line-through font-medium">
                    ₹{bike.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="stock-badge">
                  {stockStatus}
                </span>
              </div>

              {/* 4. Short description */}
              <p className="product-description">
                The {bike.name} is engineered to deliver peak performance. Combining a robust {bike.frameMaterial.toLowerCase()} frame with a premium {bike.groupset} drivetrain, it provides an exceptionally responsive and comfortable ride on every journey.
              </p>

              {/* PURCHASE PANEL */}
              <div className="purchase-panel">
                <div className="emi-options-block">
                  <div className="emi-options-title">EMI Options Available</div>
                  <div className="emi-options-text">
                    Final payment options shown at checkout.
                  </div>
                </div>

                <div className="product-options">
                  <div className="option-group">
                    <span className="option-label block">Select Size</span>
                    <div className="size-selector">
                      {bike.size.split(" / ").map((s) => (
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
                    { icon: <CreditCard className="w-4 h-4 text-primary" />, text: "Easy EMI Options" },
                    { icon: <Truck className="w-4 h-4 text-primary" />, text: "Free Chennai Delivery" },
                    { icon: <ShieldCheck className="w-4 h-4 text-primary" />, text: "Genuine Warranty" },
                    { icon: <CheckCircle2 className="w-4 h-4 text-primary" />, text: "Expert Assembly" },
                  ].map((item, i) => (
                    <div key={i} className="product-trust-item">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. FEATURES */}
              <div className="product-section features-section">
                <h3 className="product-section-title">Features</h3>
                <ul className="product-bullet-list">
                  {features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>

              {/* 6. SPECIFICATIONS */}
              <div className="product-section">
                <h3 className="product-section-title">Specifications</h3>
                <div className="product-spec-list">
                  {specifications.map((spec, i) => (
                    <div className="product-spec-row" key={i}>
                      <span className="product-spec-label">{spec.label}</span>
                      <span className="product-spec-value">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. COMPONENTS */}
              {components.length > 0 && (
                <div className="product-section">
                  <h3 className="product-section-title">Components</h3>
                  <div className="product-spec-list">
                    {components.map((comp, i) => (
                      <div className="product-spec-row" key={i}>
                        <span className="product-spec-label">{comp.label}</span>
                        <span className="product-spec-value">{comp.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>

      {/* ── Rider Fit Section ── */}
      <section className="bg-[#111111] py-16 md:py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 blur-[100px] -z-0" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-tight mb-8">
                Is this bike right <br /> <span className="text-primary">for you?</span>
              </h2>
              <div className="space-y-5">
                {[
                  { label: "Best For", val: `Performance ${bike.bikeType.toLowerCase()} riding, fitness, and daily exploration.` },
                  { label: "Rider Type", val: "Enthusiasts seeking a balanced blend of speed, comfort, and reliability." },
                  { label: "Terrain", val: "Optimized for road, tarmac, and light gravel paths depending on tire choice." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1 h-auto bg-primary rounded-full flex-shrink-0" />
                    <div>
                      <span className="block text-[11px] font-heading font-black text-primary uppercase tracking-widest mb-1">
                        {item.label}
                      </span>
                      <p className="text-[15px] text-white/75 leading-relaxed">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Button className="bg-primary text-white hover:bg-primary/90 h-12 rounded-xl font-heading font-black uppercase text-xs tracking-wider px-7">
                  Talk to a sizing pro
                </Button>
                <Button
                  className="view-fit-guide-button h-12 rounded-xl font-heading font-black uppercase text-xs tracking-wider px-7 transition-colors"
                >
                  View Fit Guide
                </Button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl">
              <h3 className="text-base font-heading font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-3">
                Quick Size Guide
              </h3>
              <div className="space-y-5">
                {[
                  { size: "M", range: "168 – 178 cm" },
                  { size: "L", range: "178 – 188 cm" },
                  { size: "XL", range: "188 – 198 cm" },
                ].map((row) => (
                  <div key={row.size} className="flex justify-between items-center">
                    <span className="text-xl font-black text-primary">{row.size}</span>
                    <span className="text-white/50 text-sm">Height: {row.range}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[11px] text-white/35 italic leading-relaxed">
                    *Recommendations vary based on inseam and reach. Contact Pro-Bikers for biometric fitment.
                  </p>
                </div>
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
              Rider Feedback
            </h2>
            <p className="text-[14px] text-[#666666] mb-6 leading-relaxed font-body">
              Be the first to share your experience with the{" "}
              <span className="text-[#111111] font-semibold">{bike.name}</span>.
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
      {similarBikes.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-14 md:py-20">
          <div className="flex items-center justify-center mb-10 relative">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#111111] uppercase tracking-tight text-center">
              Similar Bikes You'll Love
            </h2>
            <Link
              to="/shop"
              className="absolute right-0 text-[12px] font-heading font-black text-primary uppercase tracking-widest flex items-center gap-1.5 hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarBikes.map((sb, i) => (
              <BikeCard key={sb.id} bike={sb} index={i} layout="left" onAddItem={addItem} />
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
              <img src={bike.image} alt={bike.name} />
              <div>
                <span className="sticky-product-name block">{bike.name}</span>
                <span className="sticky-product-brand block">{bike.brand}</span>
              </div>
            </div>

            <div className="sticky-actions">
              {/* Size Selector in Sticky Bar */}
              <div className="flex items-center gap-2 mr-2 sticky-size">
                <span className="text-[11px] font-semibold uppercase text-[#666] tracking-wider hidden md:inline">Size:</span>
                <span className="bg-[#f0f4f8] text-[#0b0f14] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#e5eaf0]">
                  {selectedSize || bike.size.split(" / ")[0]}
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
                <span className="w-8 text-center font-semibold text-xs text-[#0b0f14]">
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
                <span className="text-sm font-semibold text-[#0b0f14] mr-1 sticky-price">
                  ₹{bike.price.toLocaleString("en-IN")}
                </span>
                <Button
                  onClick={handleAddToCart}
                  className="sticky-add-to-cart bg-[#0b0f14] text-white hover:bg-primary h-11 text-xs tracking-wider px-6 shadow-md"
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

export default ProductPage;