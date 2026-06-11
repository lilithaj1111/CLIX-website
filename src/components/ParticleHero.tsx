"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * ParticleHero — the home hero. A 3D particle field forms the Clix mark on a
 * black stage. The section is STICKY (pinned) so the page content below slides
 * up and over it as you scroll; the mark builds from scattered particles and is
 * dead-centre, front-facing and still by the time the content covers ~40%.
 *
 * The hero copy sits at the bottom and fades out as you scroll into the build.
 * ──────────────────────────────────────────────────────────────────────── */

const ParticleLogo = dynamic(
  () => import("./three/ParticleLogo").then((m) => m.ParticleLogo),
  { ssr: false, loading: () => null },
);

export function ParticleHero() {
  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 320], [1, 0]);

  return (
    <section
      dir="rtl"
      className="sticky top-0 z-0 flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-black"
    >
      {/* Particle stage — fills the section, paints once mounted (ssr:false). */}
      <ParticleLogo className="absolute inset-0 h-full w-full" />

      {/* Bottom scrim so the copy stays legible over the lower particles. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/2"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent)" }}
      />

      {/* Hero copy — fades as the build begins. */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-[12vh] lg:px-10"
      >
        <span className="inline-flex items-center gap-2.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-on-dark/70">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          בינה מהונדסת לעסק
        </span>

        <h1 className="mt-4 max-w-2xl text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-on-dark">
          מערכות AI מהונדסות <span className="text-accent">לעסק שלכם.</span>
        </h1>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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
        </div>
      </motion.div>
    </section>
  );
}

export default ParticleHero;
