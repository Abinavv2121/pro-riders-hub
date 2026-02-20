import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import probikersIcon from "@/assets/probikers-icon.png";

const WhatsAppButton = () => {
  const [hovered, setHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<"left" | "top">("left");
  const btnRef = useRef<HTMLAnchorElement>(null);

  // Check if tooltip fits to the left, else use top
  useEffect(() => {
    const check = () => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      setTooltipPos(rect.left < 140 ? "top" : "left");
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 sm:bottom-6 sm:right-6">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && tooltipPos === "left" && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="px-3 py-1.5 rounded-md bg-card text-foreground text-small font-micro whitespace-nowrap shadow-lg border border-border/60 select-none pointer-events-none"
          >
            Shop Bikes
          </motion.span>
        )}
      </AnimatePresence>

      {/* Top tooltip for tight spaces */}
      <AnimatePresence>
        {hovered && tooltipPos === "top" && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="absolute -top-10 right-0 px-3 py-1.5 rounded-md bg-card text-foreground text-small font-micro whitespace-nowrap shadow-lg border border-border/60 select-none pointer-events-none max-w-[160px] text-center"
          >
            Shop Bikes
          </motion.span>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        ref={btnRef}
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "tween", duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden
          bg-black/90 backdrop-blur-sm
          border border-border/40
          shadow-[0_0_12px_2px_hsl(193_100%_42%/0.12),0_4px_16px_-4px_rgba(0,0,0,0.5)]
          hover:shadow-[0_0_18px_4px_hsl(193_100%_42%/0.2),0_6px_20px_-4px_rgba(0,0,0,0.6)]
          hover:border-primary/30
          active:shadow-[0_0_8px_1px_hsl(193_100%_42%/0.15)]
          transition-[box-shadow,border-color] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          motion-reduce:transition-none motion-reduce:hover:transform-none"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {/* Glassy highlight */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
        <img
          src={probikersIcon}
          alt="Pro-Bikers"
          className="relative w-10 h-10 invert object-contain"
        />
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
