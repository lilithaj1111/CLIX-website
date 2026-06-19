"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function HeroUiPath() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden border-t border-white/10 bg-ink-warm pb-24 pt-32 md:pt-40">
      {/* Decorative depth: radial glow + faint dot-grid (no images) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(900px 600px at 82% 22%, color-mix(in srgb, var(--accent-2) 14%, transparent) 0%, transparent 62%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--accent-2) 14%, transparent) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage:
            "radial-gradient(700px 500px at 78% 30%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(700px 500px at 78% 30%, black 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-6 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          {/* TEXT column — first in DOM = right side in RTL */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#8CA0B3]">
                פלטפורמת ה-AI לעסק שלכם
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-4 max-w-3xl text-[clamp(2.6rem,5.5vw,4.6rem)] font-bold leading-[1.05] tracking-[-0.035em] text-on-dark">
                בינה מהונדסת.{" "}
                <span className="text-[#A9BDD0]">תוצאות אמיתיות.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-[15px] leading-[1.7] text-on-dark/70 md:text-base">
                אנחנו בונים סוכני AI, אוטומציות ומערכות מותאמות אישית שמעבירים את
                העסק שלכם מניסוי ל-ROI אמיתי.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-on-dark px-6 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  בואו נתחיל <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 rounded-full bg-[#54728A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#62809a]"
                >
                  צפו בעבודות שלנו
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-on-dark/45">
                מעל 25 עסקים · 6 שווקים · 50+ אוטומציות
              </p>
            </Reveal>
          </div>

          {/* VISUAL column — floating status cards */}
          <div className="hidden lg:col-span-5 lg:block">
            <Reveal delay={0.2} direction="left">
              <div className="relative mx-auto h-[420px] w-full max-w-[420px]">
                {/* Card 1 — active AI agent */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-0 top-2 w-[260px] -rotate-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8CA0B3] opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#8CA0B3]" />
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#A9BDD0]">
                      סוכן AI · פעיל
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-bold tracking-[-0.01em] text-on-dark">
                    11 שנ׳ זמן מענה
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-on-dark/55">
                    מענה אוטומטי מסביב לשעון, ללא תורים.
                  </p>
                </motion.div>

                {/* Card 2 — metric */}
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                  className="absolute left-0 top-[170px] w-[230px] rotate-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#8CA0B3]">
                    לידים
                  </span>
                  <p className="mt-2 text-3xl font-bold tracking-[-0.02em] text-on-dark">
                    +312%
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-on-dark/55">
                    לידים איכותיים תוך רבעון אחד.
                  </p>
                </motion.div>

                {/* Card 3 — WhatsApp */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.1,
                  }}
                  className="absolute bottom-0 right-6 w-[240px] -rotate-1 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#A9BDD0]">
                      WhatsApp · 24/7
                    </span>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#8CA0B3]/20 text-[#A9BDD0]">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-on-dark/65">
                    שיחות, תיאומים והזמנות — אוטומטית.
                  </p>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
