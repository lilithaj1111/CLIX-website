"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";

/* ────────────────────────────────────────────────────────────────────────────
 * AuroraHero — the home hero.
 *
 * A volumetric "aurora liquid light" backdrop built from two layered WebGL
 * mesh-gradients (deep blue → cornflower → lime, drifting over warm cream),
 * finished with a faint film grain, a central legibility scrim, an edge
 * vignette, and a bottom fade that melts the section into the page below.
 *
 * The marketing payload sits on top: a differentiator badge, a headline whose
 * second line rotates through outcome promises, a sharp subhead, the two CTAs,
 * and a social-proof strip. RTL/Hebrew. Cursor-independent (the aurora reads as
 * calm, premium ambient light — motion, not a toy).
 *
 * Performance: the shaders are paused (speed 0) whenever the hero scrolls out
 * of view or the user prefers reduced motion, so they cost nothing off-screen.
 * ──────────────────────────────────────────────────────────────────────── */

/* The marketing payoff line. Each phrase is the full second line of the
   headline and is grammatically self-contained — every one agrees with the
   feminine-plural subject "מערכות" (…עונות / מוכרות / חוסכות), so the swap
   never breaks. Short enough to stay one line on desktop → no layout jump. */
const HERO_PHRASES = [
  "שעונות 24/7.",
  "שמוכרות לבד.",
  "שחוסכות שעות.",
  "שלא נחות לרגע.",
  "שפשוט עובדות.",
];

/** Cycles the headline payoff line with a soft slide-up + blur swap. Honors
 *  reduced-motion by rendering a single stable phrase. */
function RotatingPayoff() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setI((n) => (n + 1) % HERO_PHRASES.length),
      2600
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  if (reduce) {
    return <span className="block text-accent">{HERO_PHRASES[0]}</span>;
  }

  // Phrases are absolutely positioned and crossfade (mode "sync"), so the
  // entering line overlaps the exiting one — no blank beat between swaps — and
  // the reserved min-height keeps everything below from shifting.
  return (
    <span className="relative block min-h-[2.4em] sm:min-h-[1.18em]">
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "0.14em", filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.14em", filter: "blur(7px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-0 block text-accent"
        >
          {HERO_PHRASES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function AuroraHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // Keep a generous margin so the shader is already running before it scrolls
  // into view (no pop-in) but is parked once well past it.
  const inView = useInView(sectionRef, { margin: "0px 0px -10% 0px" });
  const live = inView && !reduce;

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative flex h-[100svh] min-h-[640px] max-h-[940px] flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* ── Aurora: two layered WebGL mesh-gradients ─────────────────────────
          Layer 1 carries the vivid blue→lime bands; layer 2 is slower and more
          distorted for depth, blended on top. Paused (speed 0) off-screen. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <MeshGradient
          className="absolute inset-0 h-full w-full"
          colors={["#E7EAEE", "#A9BDD0", "#8CA0B3", "#A9BDD0", "#8CA0B3"]}
          speed={live ? 0.28 : 0}
          distortion={0.95}
          swirl={0.7}
        />
        <MeshGradient
          className="absolute inset-0 h-full w-full opacity-60 mix-blend-screen"
          colors={["#F4F5F7", "#E1E6EB", "#A9BDD0", "#8CA0B3", "#A9BDD0"]}
          speed={live ? 0.17 : 0}
          distortion={1.05}
          swirl={0.4}
        />
      </div>

      {/* Edge vignette — subtle ink darkening in the corners frames the light
          and adds depth without muddying the centre. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, transparent 55%, color-mix(in srgb, var(--ink) 14%, transparent) 100%)",
        }}
      />

      {/* Film grain — faint print-like texture over the aurora. Multiply blend
          so it sits in the colour, not on top. Disabled on mobile (expensive
          blend op on a full-viewport layer). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] hidden opacity-[0.06] mix-blend-multiply md:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Legibility scrim — a soft cream bloom behind the text so the dark
          headline keeps strong contrast over the moving colour. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "radial-gradient(62% 54% at 50% 45%, color-mix(in srgb, var(--bg) 90%, transparent) 0%, color-mix(in srgb, var(--bg) 52%, transparent) 42%, transparent 72%)",
        }}
      />

      {/* Bottom fade — melts the hero into the section below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-40"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--bg) 92%)",
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Differentiator badge — the single sharpest thing we can say in one
            line, with a live pulse dot for an "always-on" feel. */}
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center rounded-full border border-accent/25 bg-paper/65 px-4 py-1.5 text-[13px] font-medium text-foreground/80 shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset] backdrop-blur-md"
        >
          סוכנות AI שבונה — לא רק מייעצת
        </motion.span>

        {/* Headline. Line 1 is fixed positioning ("AI systems"); line 2 is the
            rotating outcome promise. aria-label gives assistive tech one clean,
            stable sentence instead of the flicker. */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.6rem,6.4vw,5.4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-ink"
          aria-label="מערכות AI שעובדות בשביל העסק שלכם"
        >
          <span aria-hidden className="block">
            מערכות AI
          </span>
          <span aria-hidden>
            <RotatingPayoff />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-base leading-[1.7] text-foreground/75 md:text-lg"
        >
          מתכננים, בונים ומתחזקים את כל מערך ה-AI של העסק — מהאסטרטגיה ועד
          השורה האחרונה בקוד. אתם מתפנים לגדול, המערכת דואגת לשאר.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
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
            className="inline-flex w-full items-center justify-center rounded-full border border-foreground/25 bg-paper/70 px-7 py-3 text-sm font-medium backdrop-blur-md transition-colors hover:border-accent hover:text-accent sm:w-auto"
          >
            נסו את הפלייגראונד
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue — a thin track with a drifting dot, bottom-centre. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
      >
        <span className="relative flex h-9 w-[2px] overflow-hidden rounded-full bg-foreground/15">
          <motion.span
            className="absolute left-0 top-0 h-3 w-full rounded-full bg-accent"
            animate={reduce ? {} : { y: [-12, 36] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

export default AuroraHero;
