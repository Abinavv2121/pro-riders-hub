import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { bikes } from "@/data/bikes";
import { ShoppingBag, ArrowLeft, Tag, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const specRows = [
    { label: "Category",       key: "bikeType" },
    { label: "Frame Material", key: "frameMaterial" },
    { label: "Groupset",       key: "groupset" },
    { label: "Gears",          key: "gears" },
    { label: "Brakes",         key: "brakeType" },
    { label: "Wheel Size",     key: "wheelSize" },
] as const;

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const bike = bikes.find(b => b.id === parseInt(id || "0"));
    const images: string[] = bike?.images?.length ? bike.images : bike ? [bike.image] : [];
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!bike) return <Navigate to="/shop" />;

    const handleEnquire = () => {
        addItem({
            id: bike.id,
            name: bike.name,
            brand: bike.brand,
            image: bike.image,
            color: bike.color,
            size: bike.size,
        });
    };

    return (
        <PageShell>
            {/* ── Breadcrumb ── */}
            <div className="container mx-auto px-5 md:px-8 pt-6 pb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-body group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Shop
                </button>
            </div>

            {/* ── Main product section ── */}
            <section className="container mx-auto px-5 md:px-8 py-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

                    {/* ── LEFT: Image column ── */}
                    <div className="flex flex-col gap-4">
                        {/* Main image */}
                        <div className="relative bg-[#F7F7F7] rounded-xl overflow-hidden flex items-center justify-center aspect-[4/3] border border-gray-100">
                            {bike.tag && (
                                <span className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-md flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    {bike.tag}
                                </span>
                            )}
                            <img
                                src={images[currentIndex]}
                                alt={bike.name}
                                className="w-full h-full object-contain p-8 transition-opacity duration-300"
                            />
                        </div>

                        {/* Thumbnail strip — only render if there's more than one unique image */}
                        {images.length > 1 && (
                            <div className="flex gap-3 justify-center flex-wrap">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all duration-200 ${
                                            idx === currentIndex
                                                ? "border-primary shadow-md shadow-primary/20"
                                                : "border-gray-200 hover:border-primary/50"
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`View ${idx + 1}`}
                                            className="w-full h-full object-contain p-1 bg-gray-50"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Details column ── */}
                    <div className="flex flex-col">
                        {/* Brand */}
                        <p className="text-xs uppercase tracking-widest font-heading text-muted-foreground mb-2">
                            {bike.brand}
                        </p>

                        {/* Name */}
                        <h1 className="font-heading font-bold text-foreground text-2xl md:text-3xl xl:text-4xl leading-tight mb-4">
                            {bike.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-2xl md:text-3xl font-heading font-bold text-primary">
                                ₹{bike.price.toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-muted-foreground font-body">(Incl. taxes)</span>
                        </div>

                        <div className="h-px bg-border mb-6" />

                        {/* Color & Size chips */}
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-heading font-semibold text-foreground w-14">Color</span>
                                <span className="inline-flex items-center gap-2 bg-gray-100 text-foreground text-sm font-body px-3 py-1.5 rounded-full">
                                    <span
                                        className="w-3 h-3 rounded-full border border-gray-300 inline-block flex-shrink-0"
                                        style={{ background: bike.color.toLowerCase().includes("black") ? "#222" : bike.color.toLowerCase().includes("white") ? "#f5f5f5" : bike.color.toLowerCase().includes("blue") ? "#3b82f6" : bike.color.toLowerCase().includes("red") ? "#ef4444" : bike.color.toLowerCase().includes("gold") ? "#d97706" : bike.color.toLowerCase().includes("grey") || bike.color.toLowerCase().includes("gray") ? "#6b7280" : bike.color.toLowerCase().includes("silver") ? "#94a3b8" : bike.color.toLowerCase().includes("green") ? "#22c55e" : bike.color.toLowerCase().includes("yellow") ? "#eab308" : "#00bad6" }}
                                    />
                                    {bike.color}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-heading font-semibold text-foreground w-14">Size</span>
                                <div className="flex flex-wrap gap-2">
                                    {bike.size.split(" / ").map(s => (
                                        <span key={s} className="text-sm font-body px-3 py-1 rounded-md border-2 border-primary text-primary font-semibold bg-primary/5">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-border mb-6" />

                        {/* Short description */}
                        <p className="text-sm font-body text-muted-foreground leading-relaxed mb-6">
                            Experience the perfect fusion of engineering precision and riding performance with the <strong className="text-foreground">{bike.name}</strong>. 
                            Crafted for <strong className="text-foreground">{bike.bikeType}</strong> riding, this{" "}
                            <strong className="text-foreground">{bike.frameMaterial.toLowerCase()}</strong>-framed bike 
                            delivers unmatched agility and comfort. Equipped with a <strong className="text-foreground">{bike.groupset}</strong> groupset 
                            and <strong className="text-foreground">{bike.gears}</strong>, it is built to handle every road with confidence.
                        </p>

                        {/* CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <Button
                                size="lg"
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/85 font-heading font-semibold tracking-wide"
                                onClick={handleEnquire}
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Enquire Now
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading font-semibold tracking-wide transition-all duration-200"
                                onClick={handleEnquire}
                            >
                                Add to Cart
                            </Button>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-body mb-8">
                            {["Expert-curated selection", "Genuine manufacturer warranty", "Free expert consultation"].map(badge => (
                                <span key={badge} className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                    {badge}
                                </span>
                            ))}
                        </div>

                        {/* Specs table */}
                        <div className="rounded-xl border border-border overflow-hidden">
                            <div className="bg-secondary/30 px-4 py-3 border-b border-border">
                                <h2 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground">
                                    Specifications
                                </h2>
                            </div>
                            <div className="divide-y divide-border">
                                {specRows.map(({ label, key }) => (
                                    <div key={key} className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-150">
                                        <span className="w-36 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground flex-shrink-0">
                                            {label}
                                        </span>
                                        <span className="text-sm font-body text-foreground">{bike[key]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageShell>
    );
};

export default ProductPage;