import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { bikes, bikeCategories } from "@/data/bikes";
import { BikeCard } from "@/components/BikeCard";
import {
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  Clock,
  MessageCircle,
  Info,
  Star,
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
  const { addItem, updateQuantity, items } = useCart();

  const bike = bikes.find((b) => b.id === parseInt(id || "0"));
  const images: string[] = bike?.images?.length ? bike.images : bike ? [bike.image] : [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Set default size once bike is loaded
  useEffect(() => {
    if (bike) {
      const sizes = bike.size.split(" / ");
      setSelectedSize(sizes[0]);
    }
  }, [bike]);

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

  if (!bike) return <Navigate to="/shop" />;

  const categoryLabel = bikeCategories.find((c) => c.key === bike.category)?.label || bike.bikeType;

  const stockColors: Record<string, { bg: string; text: string }> = {
    "In Stock": { bg: "bg-emerald-50 text-emerald-700 border border-emerald-200", text: "text-emerald-700" },
    "Limited Stock": { bg: "bg-amber-50 text-amber-700 border border-amber-200", text: "text-amber-700" },
    "Out of Stock": { bg: "bg-red-50 text-red-700 border border-red-200", text: "text-red-700" },
    "Preorder": { bg: "bg-blue-50 text-blue-700 border border-blue-200", text: "text-blue-700" },
  };
  const stockStatus = bike.stockStatus || "In Stock";
  const stockStyle = stockColors[stockStatus] || stockColors["In Stock"];

  const discount = bike.originalPrice
    ? Math.round(((bike.originalPrice - bike.price) / bike.originalPrice) * 100)
    : 0;

  const specRows = [
    { label: "Intended Use", value: bike.bikeType },
    { label: "Wheel Size", value: bike.wheelSize },
    { label: "Braking System", value: bike.brakeType },
    { label: "Frame Material", value: bike.frameMaterial },
    { label: "Groupset", value: bike.groupset },
    { label: "Gears", value: bike.gears },
    { label: "Color", value: bike.color },
    { label: "Warranty", value: "Lifetime warranty on frame" }
  ].filter(s => s.value);

  const componentRows = [
    { label: "Frame", value: `${bike.brand} custom ${bike.frameMaterial.toLowerCase()} frame` },
    { label: "Drivetrain", value: `${bike.groupset} components` },
    { label: "Shifters", value: `${bike.gears} integrated gearing` },
    { label: "Brakes", value: bike.brakeType },
    { label: "Wheels", value: `${bike.wheelSize} double-wall alloy rims` }
  ].filter(s => s.value);

  return (
    <PageShell>
      <div className="product-detail-page">
        <div className="product-detail-container">
          
          {/* ── Breadcrumb ── */}
          <div className="product-breadcrumb">
            <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#ccc]" />
            <Link to="/shop" className="hover:text-[#111111] transition-colors">Bikes</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#ccc]" />
            <Link to={`/shop/${bike.category}`} className="hover:text-[#111111] transition-colors">{categoryLabel}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#ccc]" />
            <span className="text-[#111111] font-semibold">{bike.name}</span>
          </div>

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
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain p-1" />
                  </div>
                ))}
              </div>

              {/* Main Image Stage */}
              <div className="product-image-stage relative border border-[#e5eaf0] rounded-2xl overflow-hidden">
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
                    className="product-main-image p-6"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: Product Info & Buy Box */}
            <div className="product-info">
              {/* Brand and Rating */}
              <div className="flex items-center gap-3 mb-2.5">
                <span className="text-[12px] font-heading font-black uppercase tracking-widest text-primary">
                  {bike.brand}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                  <span className="text-[13px] font-bold text-[#111111]">{bike.rating || 5.0}</span>
                  <span className="text-[12px] text-[#888888]">({bike.reviews || 0} Reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="product-title uppercase font-heading">{bike.name}</h1>
              
              {/* Price and Stock */}
              <div className="product-price-row">
                <span className="product-price text-[#111111]">₹{bike.price.toLocaleString("en-IN")}</span>
                {bike.originalPrice && (
                  <span className="text-xl text-[#999] line-through font-medium">
                    ₹{bike.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span className={`stock-badge ${stockStyle.bg}`}>
                  {stockStatus}
                </span>
              </div>

              {/* Short Description */}
              <p className="product-description font-body leading-relaxed text-[#4b5563]">
                The {bike.brand} {bike.name} is engineered to deliver peak performance. Combining a robust {bike.frameMaterial.toLowerCase()} frame with a premium {bike.groupset} drivetrain, it provides an exceptionally responsive and comfortable ride on every journey.
              </p>

              {/* Key Features */}
              <div className="product-section">
                <h3 className="product-section-title">K E Y   F E A T U R E S</h3>
                <ul className="product-bullet-list font-body text-[#475467]">
                  <li>Built with a lightweight and durable <strong>{bike.frameMaterial}</strong> frame.</li>
                  <li>Smooth shifting powered by a <strong>{bike.groupset}</strong> ({bike.gears}) groupset.</li>
                  <li>Highly reliable <strong>{bike.brakeType}</strong> for absolute stopping control.</li>
                  <li>Fast-rolling <strong>{bike.wheelSize}</strong> wheels optimized for traction and speed.</li>
                  <li>Professional high-standard assembly and fine-tuning completed by Pro-Bikers Chennai experts.</li>
                </ul>
              </div>

              {/* Specifications */}
              <div className="product-section">
                <h3 className="product-section-title">S P E C I F I C A T I O N S</h3>
                <ul className="product-spec-list font-body text-[#475467] space-y-2">
                  {specRows.map((spec, i) => (
                    <li key={i}>
                      <strong>{spec.label}:</strong> {spec.value}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Components */}
              {componentRows.length > 0 && (
                <div className="product-section">
                  <h3 className="product-section-title">C O M P O N E N T S</h3>
                  <ul className="product-spec-list font-body text-[#475467] space-y-2">
                    {componentRows.map((comp, i) => (
                      <li key={i}>
                        <strong>{comp.label}:</strong> {comp.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Options Selector */}
              <div className="product-options">
                <div className="mb-6">
                  <span className="option-label block mb-2">Select Color</span>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-primary p-0.5 cursor-pointer">
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          background: bike.color.toLowerCase().includes("blue")
                            ? "#00BDEB"
                            : bike.color.toLowerCase().includes("red")
                            ? "#C0392B"
                            : bike.color.toLowerCase().includes("white")
                            ? "#f5f5f5"
                            : bike.color.toLowerCase().includes("green")
                            ? "#27ae60"
                            : bike.color.toLowerCase().includes("gold")
                            ? "#d4a017"
                            : "#222222",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="option-label block mb-2">Select Size</span>
                  <div className="flex flex-wrap gap-2.5">
                    {bike.size.split(" / ").map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-5 py-2.5 rounded-xl border font-heading font-black text-xs uppercase transition-all ${
                          selectedSize === s
                            ? "bg-[#111111] border-[#111111] text-white"
                            : "border-[#e5eaf0] bg-white text-[#111111] hover:border-[#111111]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <span className="option-label block mb-2">Quantity</span>
                  <div className="inline-flex items-center border border-[#e5eaf0] rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-9 h-9 flex items-center justify-center text-[#666] hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center font-heading font-bold text-sm text-[#111111]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="w-9 h-9 flex items-center justify-center text-[#666] hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="product-actions">
                  <Button
                    size="lg"
                    className="bg-[#111111] text-white hover:bg-primary h-14 rounded-xl font-heading font-black uppercase tracking-[0.08em] text-[13px] transition-all shadow-md"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="w-4.5 h-4.5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white h-14 rounded-xl font-heading font-black uppercase tracking-[0.08em] text-[13px] transition-all"
                    onClick={() => window.open("https://wa.me/919876543210", "_blank")}
                  >
                    <MessageCircle className="w-4.5 h-4.5 mr-2" />
                    Enquire Now
                  </Button>
                </div>
              </div>

              {/* Delivery trust points */}
              <div className="grid grid-cols-2 gap-4 border-t border-[#e5eaf0] pt-6 mt-8">
                {[
                  { icon: <CreditCard className="w-4 h-4 text-primary" />, text: "Easy EMI Options" },
                  { icon: <Truck className="w-4 h-4 text-primary" />, text: "Free Chennai Delivery" },
                  { icon: <ShieldCheck className="w-4 h-4 text-primary" />, text: "Genuine Warranty" },
                  { icon: <CheckCircle2 className="w-4 h-4 text-primary" />, text: "Expert Assembly" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {item.icon}
                    <span className="text-[12px] font-heading font-bold text-[#333] uppercase tracking-wider">{item.text}</span>
                  </div>
                ))}
              </div>

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
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white hover:text-[#111111] h-12 rounded-xl font-heading font-black uppercase text-xs tracking-wider px-7"
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
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#111111] uppercase tracking-tight">
              Similar Bikes You'll Love
            </h2>
            <Link
              to="/shop"
              className="text-[12px] font-heading font-black text-primary uppercase tracking-widest flex items-center gap-1.5 hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarBikes.map((sb, i) => (
              <BikeCard key={sb.id} bike={sb} index={i} onAddItem={addItem} />
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
              <div className="hidden sm:block">
                <span className="sticky-product-name block text-[13px] uppercase font-heading">{bike.name}</span>
                <span className="text-xs text-[#888] font-bold uppercase tracking-widest">{bike.brand}</span>
              </div>
            </div>

            <div className="sticky-actions">
              <div className="flex items-center gap-2 mr-2">
                <span className="text-[11px] font-heading font-black uppercase text-[#666] tracking-widest hidden md:inline">Size:</span>
                <span className="bg-[#f0f4f8] text-[#111111] text-xs font-heading font-black px-3 py-1.5 rounded-lg border border-[#e5eaf0]">
                  {selectedSize || bike.size.split(" / ")[0]}
                </span>
              </div>

              <div className="hidden md:flex items-center border border-[#e5eaf0] rounded-xl bg-white p-0.5 mr-2">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-7 h-7 flex items-center justify-center text-[#666] hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Minus className="w-3" />
                </button>
                <span className="w-8 text-center font-heading font-bold text-xs text-[#111111]">
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
                <span className="text-sm font-heading font-black text-[#111111] mr-1 hidden lg:inline">
                  ₹{bike.price.toLocaleString("en-IN")}
                </span>
                <Button
                  onClick={handleAddToCart}
                  className="sticky-add-to-cart bg-[#111111] text-white hover:bg-primary h-11 text-xs tracking-wider font-heading font-black px-6 shadow-md"
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