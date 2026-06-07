"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Delay the entrance (seconds). Use to sequence after a heading reveal. */
  delay?: number;
  /** Final opacity at rest. Defaults to 1; lower for "ambient" backdrops. */
  opacity?: number;
};

/**
 * Wraps a 3D canvas (or any decorative layer) and reveals it cinematically
 * when it enters the viewport — fade in from 0 + slight scale-down from 1.04
 * to 1. Pairs with `CinematicCard` / `CinematicHeading` to keep section
 * content and 3D entering on the same beat.
 *
 * The motion is intentionally slow (1.4s) and uses the same easing as the
 * card entrance so everything feels like one camera move.
 */
export function RevealScene({
  children,
  className = "",
  delay = 0,
  opacity = 1,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity } : { opacity: 0, scale: 1.04 }}
      whileInView={{ opacity, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 1.4,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
