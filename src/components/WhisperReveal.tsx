"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * WhisperReveal — the soft white edge that dissolves the black hero into the
 * page background as the content scrolls up over the sticky hero.
 *
 * At rest the hero stays PURE BLACK: the band's opacity is 0 at scrollY 0. It
 * blooms in within the first sliver of scroll and rides up with the content,
 * sweeping the black into solid white (Gemini-style reveal). The solid --bg
 * foot overlaps the first section by 2px so its hard top border never shows.
 */
export function WhisperReveal() {
  const { scrollY } = useScroll();
  // pure black at the top → fade the whisper in over the first bit of scroll.
  const opacity = useTransform(scrollY, [0, 60], [0, 1]);

  return (
    <motion.div
      aria-hidden
      style={{
        opacity,
        // ease-IN ramp: a long, barely-perceptible toe that accelerates into
        // solid --bg so the black "melts" to white (a whisper, not a hard line).
        background:
          "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--bg) 4%, transparent) 30%, color-mix(in srgb, var(--bg) 12%, transparent) 48%, color-mix(in srgb, var(--bg) 28%, transparent) 62%, color-mix(in srgb, var(--bg) 55%, transparent) 76%, color-mix(in srgb, var(--bg) 85%, transparent) 90%, var(--bg) 100%)",
      }}
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[18svh] -translate-y-[calc(100%-2px)] md:h-[24svh]"
    />
  );
}

export default WhisperReveal;
