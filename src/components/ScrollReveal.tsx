import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
  drift?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  /** Scanline reveal style for labels */
  scanline?: boolean;
  /** Kinetic mask reveal for hero headlines */
  mask?: boolean;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const blockVariants = (drift: number, delay: number): Variants => ({
  hidden: {
    opacity: 0,
    y: drift,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay,
      ease: [0.4, 0, 0.2, 1],
    },
  },
});

const maskVariants = (delay: number): Variants => ({
  hidden: {
    opacity: 0,
    y: 24,
    letterSpacing: "0.08em",
    clipPath: "inset(100% 0 0 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.02em",
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1],
      clipPath: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
      letterSpacing: { duration: 0.8, delay: delay + 0.2, ease: [0.4, 0, 0.2, 1] },
    },
  },
});

const scanlineVariants = (delay: number): Variants => ({
  hidden: {
    opacity: 0,
    scaleX: 0,
  },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      opacity: { duration: 0.3, delay, ease: [0.4, 0, 0.2, 1] },
      scaleX: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
    },
  },
});

const MotionTag = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
  span: motion.span,
};

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  stagger = false,
  drift = 12,
  as = "div",
  scanline = false,
  mask = false,
}: ScrollRevealProps) => {
  const Tag = MotionTag[as];

  // Scanline reveal for labels
  if (scanline) {
    return (
      <Tag
        className={`${className} origin-left`}
        variants={scanlineVariants(delay)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </Tag>
    );
  }

  // Kinetic mask reveal for hero headlines
  if (mask) {
    return (
      <Tag
        className={className}
        variants={maskVariants(delay)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        style={{ willChange: "opacity, transform, clip-path" }}
      >
        {children}
      </Tag>
    );
  }

  // Word stagger mode
  if (stagger && typeof children === "string") {
    const words = children.split(" ");
    return (
      <Tag
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            className="inline-block mr-[0.3em]"
            style={{ willChange: "opacity, transform, filter" }}
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    );
  }

  // Block reveal mode
  return (
    <Tag
      className={className}
      variants={blockVariants(drift, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
