import { motion } from "framer-motion";

const AnnouncementBar = () => {
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
        <span className="text-white text-[11px] font-heading font-bold uppercase tracking-[0.15em]">
          🔥 SUMMER SALE IS LIVE — UP TO 40% OFF | FREE SHIPPING ON ORDERS ABOVE ₹1,999 | EMI AVAILABLE | CHENNAI'S #1 CYCLING STORE SINCE 1975 🚴
        </span>
        <span className="text-white text-[11px] font-heading font-bold uppercase tracking-[0.15em]">
          🔥 SUMMER SALE IS LIVE — UP TO 40% OFF | FREE SHIPPING ON ORDERS ABOVE ₹1,999 | EMI AVAILABLE | CHENNAI'S #1 CYCLING STORE SINCE 1975 🚴
        </span>
        <span className="text-white text-[11px] font-heading font-bold uppercase tracking-[0.15em]">
          🔥 SUMMER SALE IS LIVE — UP TO 40% OFF | FREE SHIPPING ON ORDERS ABOVE ₹1,999 | EMI AVAILABLE | CHENNAI'S #1 CYCLING STORE SINCE 1975 🚴
        </span>
      </motion.div>
    </div>
  );
};

export default AnnouncementBar;
