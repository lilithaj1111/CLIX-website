"use client";

import { motion, type MotionStyle } from "framer-motion";

type Props = {
  size?: number;
  animated?: boolean;
  className?: string;
  /** When true, render the full Clix lockup (mark + wordmark). */
  lockup?: boolean;
  /** Optional motion style override (used by Hero/Footer parallax). */
  style?: MotionStyle;
};

const FULL_W = 624;
const FULL_H = 185;
const RATIO = FULL_W / FULL_H;

/**
 * Renders the Clix logo from /public/clix-logo.png (transparent silhouette).
 * The PNG is used as a CSS mask and painted via `currentColor`, so the same
 * asset can flow with any text color (white on dark, accent on light, etc).
 *
 * `lockup` = full mark + wordmark. Default = the mark only.
 */
export function LogoMark({
  size = 22,
  animated = false,
  className = "",
  lockup = false,
  style,
}: Props) {
  const width = lockup ? size * RATIO : size;
  const height = size;
  // Use percentage-based mask sizing so the mask tracks the element's actual
  // rendered size, even when a parent forces a different width/height via
  // className (e.g. `md:!w-[140px]`). For mark-only mode the source PNG is
  // 3.37× wider than tall — `auto 100%` keeps that aspect and the leftmost
  // square slice (the mark) fills the element exactly.
  const maskSize = lockup ? "100% 100%" : "auto 100%";

  const baseStyle: MotionStyle = {
    width,
    height,
    WebkitMaskSize: maskSize,
    maskSize: maskSize,
    ...style,
  };

  const cls = `logo-mask shrink-0 ${className}`;

  if (animated) {
    return (
      <motion.div
        aria-label="Clix"
        role="img"
        className={cls}
        style={baseStyle}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  return (
    <div
      aria-label="Clix"
      role="img"
      className={cls}
      style={baseStyle as React.CSSProperties}
    />
  );
}
