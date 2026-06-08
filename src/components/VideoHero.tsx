"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * VideoHero — full-bleed background video with a pinned content card, inspired
 * by aircompany.ai but adapted to the Clix brand (navy ink + blue accent,
 * Hebrew/RTL). The card sits on the start side (right in RTL), echoing the
 * reference's solid panel as a refined translucent dark sheet.
 *
 * Fallback (per request): plain BLACK background — no poster image yet. Before
 * the clip paints, on reduced-motion, and if the source is missing, the section
 * simply stays black. Swap the clip by editing HERO_VIDEO below.
 * ──────────────────────────────────────────────────────────────────────── */

// The montage — every clip cross-cuts in order, one per second (like the
// reference hero). Reorder or trim freely; lighter clips first keeps the
// initial load quicker.
const HERO_VIDEOS = [
  "/video/hero-1.mp4",
  "/video/hero-2.mp4",
  "/video/hero-3.mp4",
  "/video/hero-4.mp4",
  "/video/hero-5.mp4",
  "/video/hero-6.mp4",
];
// How long each clip stays on screen before cutting to the next.
const SWITCH_MS = 2000;
// Crossfade length between clips. Set to 0 for instant hard cuts.
const FADE_MS = 280;

export function VideoHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Advance the montage on a fixed interval (opacity toggle — no reload).
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % HERO_VIDEOS.length),
      SWITCH_MS
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  // Play ONLY the active clip; pause the rest. Six videos autoplaying at once
  // blow past the browser's simultaneous-decode limit, so most freeze on a
  // single frame. Driving playback by hand keeps exactly one decoder live —
  // the visible one — so it always animates (and it's far lighter).
  useEffect(() => {
    if (reduce) return;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        void v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [active, reduce]);

  return (
    <section
      dir="rtl"
      className="relative flex h-[100svh] min-h-[640px] max-h-[960px] items-center overflow-hidden bg-black"
    >
      {/* Background video — full-bleed. muted + playsInline let it autoplay on
          mobile; preload="metadata" keeps the initial payload light. No poster,
          so the black section shows through until the first frame paints. On
          reduced-motion we don't mount the video at all → the hero stays black. */}
      {!reduce && (
        <div aria-hidden className="absolute inset-0 z-0">
          {HERO_VIDEOS.map((src, i) => (
            <video
              key={src}
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: i === active ? 1 : 0,
                transition: `opacity ${FADE_MS}ms linear`,
              }}
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={src} type="video/mp4" />
            </video>
          ))}
        </div>
      )}

      {/* Legibility scrim — darkest on the content (start) side, fading toward
          the far edge so the footage still breathes. Navy-tinted (#070C1A) to
          sit on-brand rather than flat black. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(270deg, rgba(7,12,26,0.10) 0%, rgba(7,12,26,0.30) 42%, rgba(7,12,26,0.74) 72%, rgba(7,12,26,0.92) 100%)",
        }}
      />
      {/* Soft top + bottom vertical vignette for depth. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,12,26,0.45) 0%, transparent 22%, transparent 72%, rgba(7,12,26,0.55) 100%)",
        }}
      />
      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-2xl rounded-3xl border border-white/10 bg-[#070C1A]/55 p-7 backdrop-blur-md sm:p-10 md:p-12">
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-on-dark/70"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            בינה מהונדסת לעסק
          </motion.span>

          {/* Headline — each line reveals on its own delay so the phrase builds
              up rhythmically rather than appearing as one block. */}
          <h1 className="mt-5 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.0] tracking-[-0.035em] text-on-dark">
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              מערכות AI מהונדסות
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="block text-accent"
            >
              לעסק שלכם.
            </motion.span>
          </h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-[15px] leading-[1.7] text-on-dark/75 md:text-base"
          >
            מתכננים, בונים ומתחזקים את כל מערך ה-AI של העסק — מהאסטרטגיה ועד
            השורה האחרונה בקוד. אתם מתפנים לגדול, המערכת דואגת לשאר.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/contact"
              className="btn-shine btn-violet inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 pe-2 ps-7 text-sm font-medium text-on-dark sm:w-auto"
            >
              בואו נתחיל
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/40 text-paper backdrop-blur-sm">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <Link
              href="/playground"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-3 text-sm font-medium text-on-dark backdrop-blur-sm transition-colors hover:border-accent hover:bg-white/15 sm:w-auto"
            >
              נסו את הפלייגראונד
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default VideoHero;
