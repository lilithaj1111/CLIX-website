"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/**
 * Site-wide smooth scrolling (Lenis) — animation only.
 *
 * Wraps the app at the root so window scrolling eases. This makes the
 * scroll-driven particle hero (and any scroll animation) glide. Respects
 * `prefers-reduced-motion`: reduced users get native scroll, no smoothing.
 *
 * The reduced check runs after mount (server + first client render both use
 * the smooth path) to avoid a hydration mismatch.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
