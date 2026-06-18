"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * ParticleHero — the home hero (promoted from the /lab experiment). Hosts the
 * shape-morphing particle mark (expand-in intro → logo → circle → square →
 * triangle → …). Sticky-pinned so the page content slides up and over it.
 *
 * Gemini-style layout: the headline sits DEAD CENTRE inside the particle field
 * (the hollow shapes leave the middle open), with one centred CTA below it.
 * The headline reveals WORD BY WORD on load (zoom-in), then the CTA.
 */
const ParticleLogo = dynamic(
  () => import("./three/ParticleLogo").then((m) => m.ParticleLogo),
  { ssr: false, loading: () => null },
);

// Headline split into words (logical order = reading order, right→left in RTL).
const WORDS: { text: string; accent?: boolean }[] = [
  { text: "מערכות" },
  { text: "AI" },
  { text: "מהונדסות" },
  { text: "לעסק", accent: true },
  { text: "שלכם.", accent: true },
];

const STAGGER = 0.26;
const lineV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER, delayChildren: 0.25 } },
};
const wordV: Variants = {
  hidden: { opacity: 0, scale: 0.78 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ParticleHero() {
  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 320], [1, 0]);

  // CTA appears just after the last word lands.
  const ctaDelay = 0.3 + WORDS.length * STAGGER + 0.5;

  return (
    <section
      dir="rtl"
      className="sticky top-0 z-0 flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden bg-black"
    >
      {/* Particle stage — fills the section, paints once mounted (ssr:false). */}
      <ParticleLogo className="absolute inset-0 h-full w-full" />

      {/* Hero copy — centred, fades as the build begins. pointer-events stay off
          the text so the particle field underneath is still draggable. */}
      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none relative z-10 mx-auto w-full max-w-3xl translate-y-0 px-6 text-center md:translate-y-[7vh]"
      >
        <motion.h1
          variants={lineV}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1 text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.05] tracking-[-0.035em] text-on-dark"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.65), 0 10px 38px rgba(0,0,0,0.5)" }}
        >
          {WORDS.map((w, i) => (
            <motion.span
              key={i}
              variants={wordV}
              className={`inline-block ${w.accent ? "text-accent" : ""}`}
            >
              {w.text}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: ctaDelay }}
          className="mt-9 flex justify-center"
        >
          <Link
            href="/contact"
            className="btn-shine btn-violet pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full py-3 pe-3 ps-8 text-sm font-medium text-on-dark"
          >
            בואו נתחיל
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/40 text-paper backdrop-blur-sm">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default ParticleHero;
