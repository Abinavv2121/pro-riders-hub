import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { supabase, DbProduct } from "@/lib/supabase";
import { DbProductCard } from "@/components/DbProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SalesPage = () => {
  const [saleProducts, setSaleProducts] = useState<DbProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      const { data } = await supabase
        .from("db_products")
        .select("*")
        .eq("on_sale", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (data) {
        setSaleProducts(data);
      }
      setIsLoading(false);
    };

    fetchSaleProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFDFF]">
      <Header />

      <div className="container mx-auto px-4 md:px-6 pt-32 pb-16">
        <main className="w-full">
          {/* ── Page Header ── */}
          <div className="mb-10 border-b border-[#CCE0F5] pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Tag className="w-5 h-5 text-red-600" />
              </div>
              <h1 className="text-3xl font-heading font-black text-[#111111] uppercase tracking-wider">
                Sale
              </h1>
              {saleProducts.length > 0 && !isLoading && (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {saleProducts.length} items
                </span>
              )}
            </div>
            <p className="text-[#666666] mt-1 ml-[52px]">
              Exclusive discounts on premium bikes and gear — limited time offers.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              /* ── Skeleton ── */
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-100 animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                      <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : saleProducts.length > 0 ? (
              /* ── Product Grid ── */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                {saleProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <DbProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* ── Empty State ── */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-dashed border-[#CCE0F5]"
              >
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-9 h-9 text-red-300" />
                </div>
                <h3 className="text-2xl font-heading font-black text-[#111111] uppercase tracking-tight mb-2">
                  No Sale Items Right Now
                </h3>
                <p className="text-[#666666] mb-8 max-w-md">
                  There are no products on sale at the moment. Check back soon for exciting offers!
                </p>
                <Button
                  onClick={() => (window.location.href = "/shop")}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full font-heading font-bold uppercase tracking-wider px-8"
                >
                  Explore All Products
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default SalesPage;
