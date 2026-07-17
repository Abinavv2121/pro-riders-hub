import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { supabase, Sale } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("sales")
        .select("*")
        .eq("is_active", true)
        .or(`valid_until.is.null,valid_until.gte.${now}`)
        .order("created_at", { ascending: false });
      
      if (data) {
        setSales(data);
      }
      setIsLoading(false);
    };

    fetchSales();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFDFF]">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-16">
        <main className="w-full">
          <div className="mb-8 border-b border-[#CCE0F5] pb-4">
            <h1 className="text-3xl font-heading font-black text-[#111111] uppercase tracking-wider flex items-center gap-3">
              <Tag className="w-8 h-8 text-red-500" />
              Live Sales
            </h1>
            <p className="text-[#666666] mt-2">Discover our active promotions and discounts.</p>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-4 h-auto flex flex-col items-center select-none py-2 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-full aspect-[2/1] bg-[#f5f5f5] rounded-lg animate-pulse mb-4" />
                    <div className="h-5 w-3/4 bg-[#F9FBFF] rounded animate-pulse mb-2.5" />
                    <div className="h-4 w-1/2 bg-[#F9FBFF] rounded animate-pulse mb-3" />
                    <div className="h-4 w-1/3 bg-[#F9FBFF] rounded animate-pulse mb-2.5" />
                  </div>
                ))}
              </motion.div>
            ) : sales.length > 0 ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {sales.map((sale, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={sale.id}
                    className="bg-white rounded-xl border border-[#CCE0F5] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
                  >
                    <div className="relative aspect-[2/1] overflow-hidden bg-gray-50 flex-shrink-0">
                      {sale.banner_image ? (
                        <img 
                          src={sale.banner_image} 
                          alt={sale.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
                          <Tag className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      {sale.discount_percentage && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white font-heading font-black px-3 py-1.5 rounded-full text-sm shadow-md">
                          {sale.discount_percentage}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-heading font-black text-[#111111] text-xl uppercase tracking-wider mb-2 line-clamp-2">
                        {sale.title}
                      </h3>
                      {sale.description && (
                        <p className="text-[#666666] text-sm mb-4 line-clamp-3 flex-1">
                          {sale.description}
                        </p>
                      )}
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-heading font-bold text-[#888888] uppercase tracking-widest">
                          {sale.valid_until ? `Valid until ${new Date(sale.valid_until).toLocaleDateString()}` : "Ongoing Sale"}
                        </span>
                        <Button 
                          onClick={() => window.location.href = "/shop"}
                          className="bg-primary hover:bg-primary/90 text-white rounded-full font-heading font-bold uppercase tracking-wider text-xs px-5 h-9"
                        >
                          Shop Now
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-dashed border-[#CCE0F5]"
              >
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <Tag className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-heading font-black text-[#111111] uppercase tracking-tight mb-2">
                  Currently sales are unavailable
                </h3>
                <p className="text-[#666666] mb-8 max-w-md">
                  There are no live sales at the moment. Please check back later for exciting offers and promotions!
                </p>
                <Button 
                  onClick={() => window.location.href = "/shop"}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full font-heading font-bold uppercase tracking-wider px-8"
                >
                  Explore Bikes
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
