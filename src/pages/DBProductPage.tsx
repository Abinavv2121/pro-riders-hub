import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { supabase, DbProduct } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import ReviewSection from "@/components/ReviewSection";
import { DbProductCard } from "@/components/DbProductCard";
import TrimmedProductImage from "@/components/TrimmedProductImage";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag, ArrowLeft, Loader2, CreditCard, MessageCircle,
  ShieldCheck, Truck, CheckCircle2, Users, Plus, Minus, ArrowRight,
  Check, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const hashId = (id: string) =>
  Math.abs(id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 900000 + 100000;

const DBProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, updateQuantity } = useCart();
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const openLightbox = () => {
    setLightboxIndex(currentImg);
    setIsLightboxOpen(true);
  };

  const handleWriteReviewClick = () => {
    setShowReviewForm(true);
    const reviewElement = document.getElementById("reviews-section");
    if (reviewElement) {
      reviewElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  const [similarProducts, setSimilarProducts] = useState<DbProduct[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("db_products")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();
      if (error || !data) {
        toast.error("Product not found");
        navigate("/shop");
      } else {
        setProduct(data);
        if (data.size) setSelectedSize(data.size.split(" / ")[0]);
        // fetch similar
        const { data: sim } = await supabase
          .from("db_products")
          .select("*")
          .eq("is_active", true)
          .eq("type", data.type)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(4);
        setSimilarProducts(sim || []);
      }
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    const numId = hashId(product.id!);
    const images = product.images.length > 0 ? product.images : [];
    addItem({
      id: numId,
      name: product.name,
      brand: product.brand,
      image: images[0] || "",
      color: product.color || "Default",
      size: selectedSize || product.size || "One Size",
      price: product.price,
      dbProductId: product.id!,
    });
    if (quantity > 1) {
      setTimeout(() => updateQuantity(numId, quantity), 50);
    }
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mr-3" /> Loading product...
        </div>
      </PageShell>
    );
  }

  if (!product) return null;

  const images = product.images.length > 0 ? product.images : [];
  const sizes = product.size ? product.size.split(" / ") : [];
  const allSpecs = Object.entries(product.specifications || {});
  const keyFeaturesEntry = allSpecs.find(([k]) => k === "Key Features");
  const keyFeatures = keyFeaturesEntry
    ? keyFeaturesEntry[1].split("|").map((f) => f.trim()).filter(Boolean)
    : [];
  const specs = allSpecs.filter(([k]) => k !== "Key Features");
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.price) * 100)
    : null;
  const categoryLabel = (product.category || "").replace(/-/g, " ");
  const typeLabel = product.type === "bike" ? "Bikes" : product.type === "apparel" ? "Apparels" : "Accessories";
  const viewAllLink = product.type === "bike" ? "/shop" : product.type === "apparel" ? "/apparels" : "/accessories";


  return (
    <PageShell>
      {/* Back nav */}
      <div className="container mx-auto px-4 md:px-6 pt-5">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-layout">

            {/* LEFT: Image gallery */}
            <div className={`product-media ${images.length <= 1 ? "no-thumbnails" : ""}`}>
              {images.length > 1 && (
                <div className="product-thumbnails">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentImg(idx)}
                      className={`product-thumbnail ${idx === currentImg ? "active" : ""}`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              <div 
                onClick={openLightbox}
                className="product-image-stage relative overflow-hidden bg-[#fafafa] cursor-pointer"
              >
                {product.tag && (
                  <span className="absolute top-5 left-5 z-10 bg-[#111111] text-white text-[10px] font-heading font-black uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full">
                    {product.tag}
                  </span>
                )}
                {discount && (
                  <span className="absolute top-5 right-5 z-10 bg-red-500 text-white text-[11px] font-heading font-black px-3 py-1 rounded-md">
                    -{discount}%
                  </span>
                )}
                {images.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImg}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <TrimmedProductImage
                        src={images[currentImg]}
                        alt={product.name}
                        className="product-main-image"
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="w-full h-[500px] flex flex-col items-center justify-center text-[#ccc]">
                    <span className="text-[14px] font-heading font-black uppercase tracking-widest text-[#999] opacity-50">
                      No Image Available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Product info */}
            <div className="product-info">
              <div className="product-brand-row">
                <span className="product-brand-badge">{product.brand}</span>
                <span className="product-category capitalize">{categoryLabel}</span>
              </div>

              <h1 className="product-title uppercase">{product.name}</h1>

              <div className="product-price-row">
                <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-[#999] line-through font-medium">
                    ₹{product.original_price.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="stock-badge">{product.stock_status}</span>
              </div>

              {product.description && (
                <p className="product-description">{product.description}</p>
              )}

              {/* Purchase panel */}
              <div className="purchase-panel">
                {product.type === "bike" && (
                  <div className="emi-options-block">
                    <div className="emi-options-title">EMI Options Available</div>
                    <div className="emi-options-text">Final payment options shown at checkout.</div>
                  </div>
                )}

                <div className="product-options">
                  {sizes.length > 0 && (
                    <div className="option-group">
                      <span className="option-label block tracking-[0.25em]">S I Z E</span>
                      <div className="size-selector">
                        {sizes.map((s) => (
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
                  )}

                  {product.color && (
                    <div className="option-group">
                      <span className="option-label block">Color</span>
                      <p className="text-[15px] font-medium text-[#0b0f14] mt-1">{product.color}</p>
                    </div>
                  )}

                  <div className="option-group">
                    <span className="option-label block">Quantity</span>
                    <div className="quantity-selector">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="text-[#666] hover:bg-slate-50 transition-colors"
                      >
                        <Minus className="w-4 h-4 mx-auto" />
                      </button>
                      <span className="text-[#0b0f14] flex items-center justify-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="text-[#666] hover:bg-slate-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="add-to-cart-button transition-all cursor-pointer flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddToCart}
                      disabled={product.stock_status === "Out of Stock"}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {product.stock_status === "Out of Stock" ? "Out of Stock" : "Add to Cart"}
                    </button>
                    <button
                      className="buy-now-button transition-all cursor-pointer flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddToCart}
                      disabled={product.stock_status === "Out of Stock"}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy Now
                    </button>
                  </div>
                  <button
                    className="enquire-now-button transition-all cursor-pointer flex items-center justify-center hover:bg-[#0b0f14] hover:text-white"
                    onClick={() => window.open("https://wa.me/919876543210", "_blank")}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enquire Now
                  </button>
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

              {/* Key Features (Trek/Cannondale style) */}
              {keyFeatures.length > 0 && (
                <div className="product-section features-section">
                  <h3 className="product-section-title">Key Features</h3>
                  <ul className="product-bullet-list" style={{ listStyle: "none", paddingLeft: 0 }}>
                    {keyFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 mb-2.5">
                        <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </span>
                        <span className="text-[14px] text-[#374151] leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {specs.length > 0 && (
                <div className="product-section">
                  <h3 className="product-section-title">Specifications</h3>
                  <div className="product-spec-list">
                    {specs.map(([key, val]) => (
                      <div className="product-spec-row" key={key}>
                        <span className="product-spec-label">{key}</span>
                        <span className="product-spec-value">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dark promo section */}
      <section className="bg-[#111111] py-16 md:py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 blur-[100px] -z-0" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-tight mb-6">
              Designed For <span className="text-primary">Performance</span>
            </h2>
            <p className="text-[15px] text-white/75 leading-relaxed mb-10">
              Every detail of the {product.name} is crafted to enhance your riding experience. With a perfect blend
              of high-quality materials and innovative engineering, this product meets the demands of modern cyclists.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { icon: <ShieldCheck className="w-8 h-8 text-primary mb-4" />, title: "Durability", desc: "Built to withstand the toughest conditions and ensure long-lasting reliability." },
                { icon: <CheckCircle2 className="w-8 h-8 text-primary mb-4" />, title: "Comfort", desc: "Ergonomically designed to provide maximum comfort during extensive rides." },
                { icon: <Users className="w-8 h-8 text-primary mb-4" />, title: "Tested", desc: "Rigorously tested by cycling professionals to guarantee top-tier performance." },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10">
                  {item.icon}
                  <h3 className="font-heading font-bold text-lg uppercase tracking-wider mb-2">{item.title}</h3>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Feedback */}
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
              onClick={handleWriteReviewClick}
              variant="outline"
              className="border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white rounded-xl font-heading font-black uppercase text-xs tracking-wider px-7 h-11"
            >
              Write a Review
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews-section" className="container mx-auto px-4 md:px-6 py-12">
        <ReviewSection 
          productId={product.id!} 
          productName={product.name} 
          showForm={showReviewForm}
          onShowFormChange={setShowReviewForm}
        />
      </section>


      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-14 md:py-20">
          <div className="flex items-center justify-center mb-10 relative">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#111111] uppercase tracking-tight text-center">
              Similar {typeLabel} You'll Love
            </h2>
            <Link
              to={viewAllLink}
              className="absolute right-0 text-[12px] font-heading font-black text-primary uppercase tracking-widest flex items-center gap-1.5 hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p, i) => (
              <DbProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-4 md:p-8"
          >
            {/* Main Stage */}
            <div className="relative w-full max-w-6xl h-[65vh] flex items-center justify-center">
              <TrimmedProductImage
                src={images[lightboxIndex]}
                alt={product.name}
                className="max-h-full max-w-full w-auto h-auto object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const newIdx = (lightboxIndex - 1 + images.length) % images.length;
                  setLightboxIndex(newIdx);
                  setCurrentImg(newIdx);
                }}
                className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(false);
                }}
                className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const newIdx = (lightboxIndex + 1) % images.length;
                  setLightboxIndex(newIdx);
                  setCurrentImg(newIdx);
                }}
                className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
};

export default DBProductPage;
