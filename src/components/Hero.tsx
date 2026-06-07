"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

/* ────────────────────────────────────────────────────────────────────────────
 * Hero — enterprise-grade two-column composition.
 *
 *   Left column   :  value proposition (badge → headline → subhead → CTA combo)
 *   Right column  :  technical system matrix (three layered "live" cards)
 *
 * Aesthetic target: Linear / Vercel / Stripe — confident, sparse, clearly
 * technical. The right column reads as a glimpse into a real AI control
 * plane so the reader understands the brand builds heavy-duty systems.
 * ──────────────────────────────────────────────────────────────────────── */

export function Hero() {
  return (
    <section
      className="relative min-h-[100svh] [@media(min-width:1800px)]:min-h-0 flex items-center overflow-hidden pt-[max(96px,12vh)] pb-16 md:pb-24 [@media(min-width:1800px)]:pt-32 [@media(min-width:1800px)]:pb-32 bg-paper"
    >
      {/* Hero illustration — mobile. The whole image is shown via
          `contain` and centred at full opacity. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none md:hidden"
        style={{
          backgroundImage: "url('/myhero.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Hero illustration — desktop. Fills the section height and
          aligns to the content container's left edge via the calc so
          it doesn't slide all the way to the viewport edge at zoom-out. */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/myhero.png')",
          backgroundSize: "auto 100%",
          backgroundPosition: "max(0px, calc((100vw - 1400px) / 2 - 120px)) center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Soft lime radiant on the left + blue radiant on the right —
          the lime anchors the illustration, the blue pulls the eye to
          the headline + CTAs and ties the hero to the brand accent. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none mix-blend-multiply"
        style={{
          background: [
            "radial-gradient(55% 70% at 12% 50%, color-mix(in srgb, #A3E635 18%, transparent), transparent 75%)",
            "radial-gradient(40% 55% at 28% 70%, color-mix(in srgb, #BEF264 14%, transparent), transparent 75%)",
            "radial-gradient(50% 65% at 82% 40%, color-mix(in srgb, #60A5FA 22%, transparent), transparent 75%)",
            "radial-gradient(35% 50% at 92% 75%, color-mix(in srgb, #3B82F6 16%, transparent), transparent 75%)",
            "radial-gradient(30% 45% at 70% 18%, color-mix(in srgb, #93C5FD 14%, transparent), transparent 75%)",
          ].join(", "),
        }}
      />


      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 xl:gap-8 items-center">
          {/* ── Right column (RTL: first child) — value proposition ───── */}
          <div className="lg:col-span-6 xl:col-span-7 relative z-10">
            {/* Headline — each line reveals on its own delay so the
                phrase builds up rhythmically rather than appearing as one
                block. Tightly-coupled stagger (0.11s) reads as natural
                phrase emphasis, not a slow drum-roll. */}
            <h1 className="text-[clamp(2.6rem,5.6vw,5.5rem)] leading-[0.96] tracking-[-0.038em] font-medium">
              <motion.span
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="block text-foreground"
              >
                מערכות AI,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.21, ease: [0.22, 1, 0.36, 1] }}
                className="block serif-italic"
              >
                מהונדסות
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="block text-foreground"
              >
                לעסק שלכם.
              </motion.span>
            </h1>

            {/* Subhead — descriptive paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-[520px]"
            >
              <p className="text-[15px] md:text-[15.5px] text-foreground/70 leading-[1.65] tracking-[-0.005em]">
                סוכני AI מותאמים אישית, אוטומציות ותוכנה ייעודית שהופכים
                את התפעול היומיומי למערכת שצוברת תאוצה לאורך זמן.
              </p>
            </motion.div>

            {/* CTAs — Try the Playground (secondary) + Start a project
                (primary). On mobile both stretch to the same width; at sm+
                they sit side-by-side at their natural width. */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center"
            >
              <Link
                href="/playground"
                className="hidden lg:inline-flex items-center justify-center text-sm px-6 py-2.5 rounded-full border border-foreground/25 hover:border-accent hover:text-accent transition-colors bg-paper/85 backdrop-blur-sm font-medium w-full sm:w-auto"
              >
                נסו את הפלייגראונד
              </Link>
              <MagneticButton
                href="/contact"
                wrapperClassName="w-full sm:w-auto"
                className="btn-shine btn-violet inline-flex items-center justify-center gap-2 text-sm ps-6 pe-2 py-2.5 rounded-full font-medium w-full sm:w-auto"
              >
                בואו נתחיל
                <span className="inline-flex w-7 h-7 rounded-full bg-ink/40 text-paper items-center justify-center backdrop-blur-sm">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </MagneticButton>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Frame brackets ────────────────────────────────────────────────────── */

function FrameBrackets() {
  const cls =
    "absolute w-5 h-5 md:w-8 md:h-8 border-foreground/20 pointer-events-none z-[1]";
  return (
    <>
      <span
        aria-hidden
        className={`${cls} top-5 left-5 md:top-8 md:left-10 border-t border-l`}
      />
      <span
        aria-hidden
        className={`${cls} top-5 right-5 md:top-8 md:right-10 border-t border-r`}
      />
      <span
        aria-hidden
        className={`${cls} bottom-5 left-5 md:bottom-8 md:left-10 border-b border-l`}
      />
      <span
        aria-hidden
        className={`${cls} bottom-5 right-5 md:bottom-8 md:right-10 border-b border-r`}
      />
    </>
  );
}

