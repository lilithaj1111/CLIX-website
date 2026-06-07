"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a ref that, when observed, automatically sets
 * `data-in-view="true"` on the attached element the first time it enters the
 * viewport. Pair with the `.divider-draw` CSS utility.
 */
export function useInViewAttr<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.setAttribute("data-in-view", "true");
            obs.unobserve(el);
          }
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}
