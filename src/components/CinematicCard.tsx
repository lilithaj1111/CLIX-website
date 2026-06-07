"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Disable the one-shot glow accent. */
  glow?: boolean;
  className?: string;
};

/**
 * Cinematic entrance for a card. Fade + slide + slight scale on viewport
 * enter, with an optional one-shot accent glow that pulses once and fades.
 * Matches the camera easing in the persistent cinematic background so the
 * page feels like a single coordinated film, not "background + content."
 *
 * Use to wrap card-shaped content (Process steps, Numbers stats, Featured
 * Work tiles, Team members). Reveal stays in use for inline text / list
 * items where a softer entrance is right.
 */
export function CinematicCard({
  children,
  delay = 0,
  glow = true,
  className = "",
}: Props) {
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 30, scale: 0.97 }}
      whileInView={
        reduced ? undefined : { opacity: 1, y: 0, scale: 1 }
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      onViewportEnter={() => setEntered(true)}
      data-in-view={entered ? "true" : "false"}
      className={`${glow ? "cinema-glow" : ""} ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}
