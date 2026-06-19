"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────────────────────
 * LecturesSection — speaking + training offering.
 *
 *   Left column   :  editorial header + CTA.
 *   Right column  :  looping highlight video from /public/lectures.
 * ──────────────────────────────────────────────────────────────────────── */

const COLUMN_STAGGER: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

const CASCADE_ITEM: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function LecturesSection() {
  const reduced = useReducedMotion();
  const cascadeItem: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
    : CASCADE_ITEM;

  return (
    <section className="relative border-t border-line bg-background py-20 md:py-28 overflow-hidden">
      <div className="relative z-[1] mx-auto max-w-[1240px] px-6 lg:px-10">
        {/* ── Top band — editorial header left, video right ──────────── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={COLUMN_STAGGER}
            className="lg:col-span-5"
          >
            <motion.div
              variants={cascadeItem}
              className="inline-flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.2em] text-foreground/55"
            >
              <span>הרצאות והדרכות</span>
            </motion.div>

            <motion.h2
              variants={cascadeItem}
              className="mt-5 text-[clamp(2.1rem,3.8vw,3.4rem)] leading-[1.05] tracking-[-0.035em] font-semibold text-balance"
            >
              מביאים את צוות המומחים{" "}
              <span className="serif-italic text-accent">אל החדר שלכם.</span>
            </motion.h2>

            <motion.p
              variants={cascadeItem}
              className="mt-5 text-foreground/70 leading-[1.6] text-[15px]"
            >
              הרצאות, הדרכות וייעוץ לארגונים שרוצים לפעול עם AI
              ולא רק לדבר עליו.
            </motion.p>

            <motion.div
              variants={cascadeItem}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              <Link
                href="/contact"
                className="btn-shine btn-violet inline-flex items-center gap-2 text-sm ps-6 pe-2 py-2.5 rounded-full font-medium"
              >
                קבעו מפגש
                <span className="inline-flex w-7 h-7 rounded-full bg-ink/40 text-paper items-center justify-center backdrop-blur-sm">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.96 }}
            whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.12 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-2xl overflow-hidden border border-line shadow-[0_50px_90px_-30px_rgba(11,19,38,0.22),0_18px_44px_-16px_rgba(11,19,38,0.14)] bg-ink-warm">
              <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-paper/85 backdrop-blur-sm text-[10.5px] font-mono uppercase tracking-[0.16em] text-foreground/70">
                <span className="relative inline-flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                </span>
                On stage
              </div>

              <video
                src="/lectures/lecture-preview.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-label="קטעים נבחרים מהרצאת Clix האחרונה"
                className="block w-full aspect-video object-cover"
              />

              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-16 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(11,19,38,0.35), transparent)",
                }}
              />
            </div>

            <div className="mt-4 text-[11px] font-mono uppercase tracking-[0.18em] text-foreground/55">
              <span>Recent · Q3 keynote</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
