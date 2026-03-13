import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { bikes } from "@/data/bikes";

// Maps URL slug → exact brand name in bikes data
const slugToBrand: Record<string, string> = {
  lapierre: "Lapierre",
  giant: "Giant",
  trek: "Trek",
  "argon-18": "Argon 18",
  avanti: "Avanti",
  specialized: "Specialized",
  cannondale: "Cannondale",
  scott: "Scott",
  bianchi: "Bianchi",
  bmc: "BMC",
};

const BrandGallery = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const brandName = slugToBrand[brandSlug ?? ""] ?? brandSlug ?? "Brand";
  const brandBikes = bikes.filter((b) => b.brand === brandName);

  return (
    <PageShell>
      <section className="container mx-auto px-5 md:px-8 space-section">
        {/* Back button */}
        <Link
          to="/brands"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-body mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Brands
        </Link>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="font-heading text-hero-sm md:text-section text-foreground mb-2"
        >
          {brandName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="text-muted-foreground font-body text-body mb-10"
        >
          {brandBikes.length > 0
            ? `${brandBikes.length} bike${brandBikes.length > 1 ? "s" : ""} available`
            : "Explore our curated selection"}
        </motion.p>

        {/* Gallery grid */}
        {brandBikes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {brandBikes.map((bike, i) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <Link
                  to={`/product/${bike.id}`}
                  className="group relative rounded-lg overflow-hidden bg-white border border-gray-200 transition-all duration-300 block cursor-pointer"
                >
                  {/* Tag */}
                  {bike.tag && (
                    <span className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                      {bike.tag}
                    </span>
                  )}

                  {/* Image */}
                  <div className="relative aspect-[4/3] flex items-center justify-center p-8 bg-gray-50">
                    <img
                      src={bike.image}
                      alt={bike.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-muted-foreground text-xs uppercase tracking-widest font-heading mb-1">
                      {bike.brand}
                    </p>
                    <h3 className="font-heading font-bold text-primary text-lg mb-2 transition-colors duration-200">
                      {bike.name}
                    </h3>
                    <div className="flex items-center gap-3 text-muted-foreground text-xs font-micro mb-2">
                      <span>{bike.color}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>Size: {bike.size}</span>
                    </div>
                    <p className="text-primary font-body text-sm font-medium">
                      ₹{bike.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state for brands with no bikes in data yet */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="text-6xl mb-6">🚲</div>
            <h2 className="font-heading font-bold text-foreground text-xl mb-2">
              Coming Soon
            </h2>
            <p className="text-muted-foreground font-body text-sm max-w-sm">
              We're working on adding {brandName} bikes to our collection. Visit the shop or contact us for availability.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                to="/shop"
                className="text-sm font-body text-primary hover:underline transition-colors"
              >
                Browse All Bikes →
              </Link>
              <Link
                to="/contact"
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </PageShell>
  );
};

export default BrandGallery;
