"use client";

import { useEffect, useState } from "react";

/** Returns true when the viewport is narrower than Tailwind's md breakpoint
 *  (768px). SSR-safe: returns false on the first render to avoid hydration
 *  mismatches, then updates on mount. */
export function useIsMobile(query = "(max-width: 767px)") {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return isMobile;
}
