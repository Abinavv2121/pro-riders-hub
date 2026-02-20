import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds */
  delay?: number;
  /** Enable word-by-word stagger (pass string children) */
  stagger?: boolean;
  /** Override the drift distance in px */
  drift?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    letterSpacing: "0.06em",
  },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.02em",
    transition: {
      duration: 0.45,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const blockVariants = (drift: number, delay: number): Variants => ({
  hidden: {
    opacity: 0,
    y: drift,
    letterSpacing: "0.06em",
  },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.02em",
    transition: {
      duration: 0.5,
      delay,
      ease: [0.4, 0, 0.2, 1],
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
}: ScrollRevealProps) => {
  const Tag = MotionTag[as];

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
            style={{ willChange: "opacity, transform" }}
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
