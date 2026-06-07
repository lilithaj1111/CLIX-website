"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

type Props = {
  /** Heading content. Pass plain text or JSX with serif-italic spans. */
  children: ReactNode;
  /** Tag name. Defaults to "h2". */
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Start delay (seconds). */
  delay?: number;
};

/**
 * Cinematic heading entrance — every word slides up from below an invisible
 * clip line and fades in with subtle scale. Matches the camera easing in the
 * cinematic system so the heading "lands" with the camera move.
 *
 * Preserves inline JSX like `<span className="serif-italic">word</span>` — if
 * you pass JSX children they're rendered as a single block (no per-word
 * split). Use plain strings to get the per-word reveal.
 */
export function CinematicHeading({
  children,
  as = "h2",
  className = "",
  delay = 0,
}: Props) {
  const reduced = useReducedMotion();
  const Tag = as as "h1" | "h2" | "h3";

  // If children is a plain string, split into words for per-word reveal.
  // Otherwise (JSX), do a single-block reveal to preserve markup.
  const hasOnlyText =
    typeof children === "string" ||
    (Array.isArray(children) && children.every((c) => typeof c === "string"));

  if (hasOnlyText) {
    const text = Array.isArray(children) ? children.join(" ") : (children as string);
    const words = text.split(/\s+/);
    return (
      <Tag className={className}>
        {words.map((w, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom mr-[0.22em]"
          >
            <motion.span
              initial={reduced ? false : { y: "110%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + i * 0.05,
              }}
              className="inline-block"
            >
              {w}
            </motion.span>
          </span>
        ))}
      </Tag>
    );
  }

  // JSX children — single block reveal with scale.
  return (
    <Tag className={className}>
      <motion.span
        initial={reduced ? false : { y: 30, opacity: 0, scale: 0.98 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </Tag>
  );
}
