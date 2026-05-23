import { motion } from "framer-motion";

const StickyCTA = () => {
  const scrollToSale = () => {
    const section = document.getElementById("summer-sale");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={scrollToSale}
      className="fixed bottom-6 right-6 z-50 bg-primary text-white px-6 py-3 rounded-full font-heading font-bold text-sm uppercase tracking-widest shadow-2xl flex items-center gap-2 border-2 border-white/20 hover:bg-[#009bc4] transition-all"
    >
      🔥 Shop Summer Sale
    </motion.button>
  );
};

export default StickyCTA;
