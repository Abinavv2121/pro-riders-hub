import { useRef, useState, useEffect, useCallback } from "react";

/**
 * Scroll-triggered count-up hook.
 * Counts from 0 to `end` with ease-out over `duration` ms.
 * Respects prefers-reduced-motion.
 */
export function useCountUp(end: number, duration = 1200) {
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) {
      setValue(end);
      setStarted(true);
    }
    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) { setValue(end); setStarted(true); }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [end]);

  useEffect(() => {
    if (started || reducedMotion || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, reducedMotion]);

  useEffect(() => {
    if (!started || reducedMotion) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reducedMotion, end, duration]);

  return { ref, value };
}
