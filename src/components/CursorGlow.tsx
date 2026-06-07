"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * A soft, spring-followed accent halo that trails the cursor. Site-wide except
 * on `/playground` (drag UX) and on touch / coarse-pointer devices. Grows when
 * the cursor is over an interactive element via `data-cursor="hover"` or any
 * native clickable.
 */
export function CursorGlow() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const haloX = useSpring(x, { stiffness: 110, damping: 18, mass: 0.6 });
  const haloY = useSpring(y, { stiffness: 110, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const interactiveSelector =
      "a, button, input, textarea, select, [role='button'], [data-cursor='hover']";
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest(interactiveSelector));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled, x, y]);

  // Hide on the playground (drag UX) and pre-mount
  if (!enabled) return null;
  if (pathname?.startsWith("/playground")) return null;

  return (
    <>
      {/* Soft trailing halo */}
      <motion.div
        aria-hidden
        style={{ x: haloX, y: haloY }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <motion.div
          animate={{
            width: hovering ? 90 : 36,
            height: hovering ? 90 : 36,
            opacity: hovering ? 0.55 : 0.32,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, var(--accent), transparent 72%)",
            filter: "blur(2px)",
          }}
        />
      </motion.div>

      {/* Crisp inner dot — exact cursor position */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[101] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <motion.div
          animate={{
            opacity: hovering ? 0 : 0.7,
            scale: hovering ? 0.4 : 1,
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="w-1.5 h-1.5 rounded-full bg-foreground"
        />
      </motion.div>
    </>
  );
}
