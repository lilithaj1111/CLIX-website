"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import Link from "next/link";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Applied to the outer translating span (e.g. width control). */
  wrapperClassName?: string;
  /** Strength of pull, 0–1. Default 0.35. */
  strength?: number;
  /** Pixel radius within which the button magnetizes. Default 120. */
  radius?: number;
};

/**
 * A button (or link) that translates toward the cursor when nearby. Subtle —
 * the goal is "tactile pull" not "wobbly toy". Disabled on reduced-motion.
 */
export function MagneticButton({
  href,
  children,
  className = "",
  wrapperClassName = "",
  strength = 0.35,
  radius = 120,
}: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - dist / radius);
    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      style={{ x: sx, y: sy }}
      className={`inline-block ${wrapperClassName}`.trim()}
    >
      <Link
        ref={ref}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={className}
      >
        {children}
      </Link>
    </motion.span>
  );
}
