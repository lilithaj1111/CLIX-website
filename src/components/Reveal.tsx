"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "section" | "article" | "li" | "h2" | "p" | "span";
};

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: -32, y: 0 },
  right: { x: 32, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  duration = 0.85,
  direction = "up",
  distance,
  className = "",
  once = true,
  as = "div",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Margin pulled up by 15% — reveals start firing just before the element
  // is fully in view, so the section feels alive rather than chasing the
  // scroll cursor.
  const inView = useInView(ref, { once, amount: 0.18, margin: "0px 0px -15% 0px" });

  const off = offsets[direction];
  const x = distance != null ? (off.x !== 0 ? Math.sign(off.x) * distance : 0) : off.x;
  const y = distance != null ? (off.y !== 0 ? Math.sign(off.y) * distance : 0) : off.y;

  // Slight scale-in (0.985 → 1) gives entries a hint of depth without the
  // "popping" feel of a heavy scale animation.
  const variants: Variants = {
    hidden: { opacity: 0, x, y, scale: 0.985 },
    show: { opacity: 1, x: 0, y: 0, scale: 1 },
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/** Word-by-word reveal — pass a string, get a staggered headline. */
export function RevealWords({
  text,
  className = "",
  delay = 0,
  step = 0.06,
  serifWords = [],
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  serifWords?: string[];
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => {
        const isSerif = serifWords.includes(w);
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
            <motion.span
              initial={{ y: "110%" }}
              animate={inView ? { y: 0 } : { y: "110%" }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + i * step,
              }}
              className={`inline-block ${isSerif ? "serif-italic text-accent" : ""}`}
            >
              {w}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
