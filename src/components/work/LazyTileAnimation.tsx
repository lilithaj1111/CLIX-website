"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectTileAnimation } from "./ProjectTileAnimation";

type Props = {
  slug: string;
  accent: string;
  className?: string;
};

/**
 * Viewport-gated wrapper around `ProjectTileAnimation`. Mounts the
 * animation only when the tile is in (or near) the viewport, then
 * unmounts when it scrolls away — keeps off-screen tiles from running
 * phase cycles, framer-motion repeats, and three.js canvases.
 * Shows animations on all screen sizes including mobile.
 */
export function LazyTileAnimation({ slug, accent, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setActive(e.isIntersecting);
        }
      },
      { rootMargin: "300px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {active && (
        <ProjectTileAnimation
          slug={slug}
          accent={accent}
          className={className}
        />
      )}
    </div>
  );
}
