import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase, Sale } from "@/lib/supabase";

const FALLBACK_TEXT =
  "🔥 SUMMER SALE IS LIVE — UP TO 40% OFF | FREE SHIPPING ON ORDERS ABOVE ₹1,999 | EMI AVAILABLE | CHENNAI'S #1 CYCLING STORE SINCE 1975 🚴";

const buildSaleText = (sales: Sale[]): string => {
  if (sales.length === 0) return FALLBACK_TEXT;
  const parts = sales.map((s) => {
    const pct = s.discount_percentage ? ` — ${s.discount_percentage}% OFF` : "";
    const desc = s.description ? ` | ${s.description}` : "";
    return `🔥 ${s.title.toUpperCase()}${pct}${desc}`;
  });
  return parts.join(" | FREE SHIPPING ON ORDERS ABOVE ₹1,999 | EMI AVAILABLE | ");
};

const AnnouncementBar = () => {
  const [text, setText] = useState(FALLBACK_TEXT);

  useEffect(() => {
    const fetchSales = async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("sales")
        .select("*")
        .eq("is_active", true)
        .or(`valid_until.is.null,valid_until.gte.${now}`)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setText(buildSaleText(data));
      }
    };
    fetchSales();
  }, []);

  const repeated = [text, text, text];

  return (
    <div className="bg-primary overflow-hidden border-b border-white/10 flex items-center h-[var(--announcement-height)]">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
        className="whitespace-nowrap flex gap-10 items-center"
      >
        {repeated.map((t, i) => (
          <span key={i} className="text-white text-[11px] font-heading font-bold uppercase tracking-[0.15em]">
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default AnnouncementBar;
