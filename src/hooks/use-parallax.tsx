import { useRef, useState, useEffect, useCallback } from "react";

/**
 * Subtle parallax hook: background moves at `speed` (0–1) relative to scroll.
 * Returns a ref to attach and a translateY value for the background.
 * Respects prefers-reduced-motion automatically.
 */
export function useParallax(speed = 0.85) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const onScroll = useCallback(() => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    // Only calculate when in viewport
    if (rect.bottom < 0 || rect.top > windowH) return;
    const center = rect.top + rect.height / 2;
    const delta = (center - windowH / 2) * (1 - speed);
    setOffset(delta);
  }, [reducedMotion, speed]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return { ref, offset: reducedMotion ? 0 : offset };
}
