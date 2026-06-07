"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Max rotation in degrees. Default 8. */
  max?: number;
  /** How much to scale on hover. Default 1.015. */
  scale?: number;
  className?: string;
};

/**
 * Wrap a card / image to add a 3D tilt that follows the cursor and springs
 * back on leave. No-op on reduced motion. Use sparingly — the effect is most
 * powerful on hero / featured cards, not on every grid tile.
 */
export function Tilt({
  children,
  max = 8,
  scale = 1.015,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0); // -0.5..0.5 (normalized)
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 140, damping: 18, mass: 0.4 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotX = useTransform(sy, [-0.5, 0.5], [max, -max]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: reduced ? 0 : rotX,
        rotateY: reduced ? 0 : rotY,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
      }}
      whileHover={reduced ? undefined : { scale }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
