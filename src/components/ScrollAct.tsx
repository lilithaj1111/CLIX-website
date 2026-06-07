"use client";

import { useScroll, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  /** How many viewport heights this act consumes. Each beat ≈ 1vh of scroll. */
  beats?: number;
  className?: string;
  children: (progress: MotionValue<number>) => ReactNode;
};

/**
 * A scroll-pinned cinematic act. The outer section is `beats * 100vh` tall;
 * the inner stage stays pinned via `sticky top-0` for that entire range so
 * children can map `scrollYProgress` to motion that plays out as the user
 * scrolls past.
 *
 * Children receive the section's `scrollYProgress` motion value so multiple
 * scenes can choreograph against the same timeline without re-measuring.
 */
export function ScrollAct({ beats = 4, className = "", children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      className={`relative ${className}`}
      style={{ height: `${beats * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {children(scrollYProgress)}
      </div>
    </section>
  );
}
