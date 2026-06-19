"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { ParticleWaveBackground } from "@/components/ui/particle-wave-bg";

/* ────────────────────────────────────────────────────────────────────────────
 * RippleSphereHero — "flowing wave" hero (HomeFlow-style composition) in the
 * Clix palette: a soft BABY-BLUE surface with a canvas particle-wave (accent
 * blue + soft lime) whose small particles float continuously, a soft-lime/blue
 * crest glow, centred headline + subhead, a ghost + accent CTA, and a "trusted
 * by" strip. Hebrew / RTL. Height is capped so it never balloons on zoom-out.
 * ──────────────────────────────────────────────────────────────────────── */

export function RippleSphereHero() {
  return (
    <section
      dir="rtl"
      className="relative flex h-[100svh] min-h-[640px] max-h-[920px] flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        background: [
          // lime wash, upper-left → fading out
          "radial-gradient(78% 98% at 4% 26%, color-mix(in srgb, #8CA0B3 32%, transparent), transparent 58%)",
          "radial-gradient(46% 60% at 22% 70%, color-mix(in srgb, #A9BDD0 18%, transparent), transparent 64%)",
          // lime wash, right side
          "radial-gradient(60% 82% at 98% 34%, color-mix(in srgb, #8CA0B3 28%, transparent), transparent 60%)",
          "radial-gradient(44% 58% at 86% 80%, color-mix(in srgb, #A9BDD0 16%, transparent), transparent 64%)",
          // soft cool tint, bottom-centre
          "radial-gradient(60% 70% at 50% 96%, color-mix(in srgb, #D7DBE0 60%, transparent), transparent 64%)",
          // baby-blue base
          "linear-gradient(180deg, #F4F5F7 0%, #E7EAEE 52%, #D7DBE0 100%)",
        ].join(", "),
      }}
    >
      {/* ── Soft-lime/blue crest glow along the base (behind the particles) ── */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-[2%] z-0 h-[48%]"
        style={{
          background: [
            "radial-gradient(54% 100% at 50% 100%, color-mix(in srgb, #A9BDD0 40%, transparent), transparent 72%)",
            "radial-gradient(40% 90% at 30% 100%, color-mix(in srgb, #8CA0B3 26%, transparent), transparent 74%)",
            "radial-gradient(34% 80% at 72% 100%, color-mix(in srgb, #A9BDD0 20%, transparent), transparent 74%)",
          ].join(", "),
          filter: "blur(22px)",
        }}
      />

      {/* ── Flowing particle wave — small dots float continuously (canvas) ── */}
      <ParticleWaveBackground className="absolute inset-0 z-[1]" />

      {/* ── Soft top wash — keeps the headline area clean over the glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 22%, color-mix(in srgb, #F4F5F7 70%, transparent), transparent 58%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em] text-ink"
        >
          מערכות AI,
          <br />
          <span className="text-accent">מהונדסות</span>
          <br />
          לעסק שלכם.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-base leading-[1.7] text-foreground/65 md:text-lg"
        >
          סוכני AI מותאמים אישית, אוטומציות ותוכנה ייעודית — שהופכים את
          התפעול היומיומי למערכת שצוברת תאוצה לאורך זמן.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/playground"
            className="inline-flex w-full items-center justify-center rounded-full border border-foreground/25 bg-paper/70 px-8 py-3.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:w-auto"
          >
            נסו את הפלייגראונד
          </Link>
          <Link
            href="/contact"
            className="btn-shine btn-violet inline-flex w-full items-center justify-center gap-2 rounded-full py-2 pe-2 ps-7 text-sm font-semibold text-on-dark sm:w-auto"
          >
            בואו נתחיל
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/35 text-on-dark backdrop-blur-sm">
              <ChevronLeft className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      </div>

    </section>
  );
}

export default RippleSphereHero;
