"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";
import { Zap, CheckCheck } from "lucide-react";
import { Tilt } from "./Tilt";
import { useInViewAttr } from "@/lib/useInViewAttr";

export function CTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const sectionRef = useInViewAttr<HTMLElement>();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const sceneRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section
      ref={sectionRef}
      className="border-t border-line/10 py-20 md:py-28 relative overflow-hidden bg-ink-warm"
    >
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 520px at 82% 110%, color-mix(in srgb, var(--accent-2) 16%, transparent), transparent 62%)",
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7">
            <Reveal direction="left">
              <div className="eyebrow text-on-dark/55">בואו נבנה משהו</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 text-[clamp(2rem,4.8vw,4.2rem)] font-bold leading-[1] tracking-[-0.04em] text-on-dark">
                אתם מביאים את <span className="serif-italic text-[#A99BF5]">העסק.</span>
                <br />
                אנחנו מביאים את הבינה.
              </h2>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-7 flex flex-wrap gap-3 items-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 text-base ps-7 pe-2 py-2 rounded-full font-semibold bg-on-dark text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  בואו נתחיל
                  <span className="inline-flex w-9 h-9 rounded-full bg-ink text-paper items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M1 9L9 1M9 1H3M9 1V7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="mailto:info@clixsolution.com"
                  className="link-underline inline-flex items-center text-sm px-5 py-2 text-on-dark/70 hover:text-on-dark transition"
                >
                  או פשוט שלחו לנו אימייל
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal direction="right" delay={0.2} className="hidden md:block md:col-span-5">
            <Tilt max={7} scale={1.01}>
              <motion.div
                style={{ y: sceneY, rotateZ: sceneRotate }}
                className="relative overflow-hidden rounded-3xl bg-[#F4F2FB] p-5 shadow-[0_45px_90px_-40px_rgba(8,10,18,0.85)] ring-1 ring-black/5 md:p-6"
              >
                {/* Header — Clix identity + live status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A99BF5] to-[#845EF7] text-[15px] font-bold text-white shadow-sm">
                      C
                    </span>
                    <div className="leading-tight">
                      <div className="text-[15px] font-bold text-ink">Clix</div>
                      <div className="text-[11px] font-medium text-accent">זמן מענה ממוצע</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3A94C5]" />
                    בזמן אמת
                  </span>
                </div>

                {/* Inbound — customer message (right) */}
                <div className="mt-6 text-right">
                  <div className="inline-block max-w-[82%] rounded-2xl rounded-tr-md bg-white px-4 py-2.5 text-right text-[13.5px] font-medium text-ink shadow-sm">
                    שלחתי פנייה דרך האתר 👋
                  </div>
                  <div className="mt-1.5 px-1 text-[11px] text-foreground/40">09:14</div>
                </div>

                {/* Speed chip — the promise, literally */}
                <div className="my-4 flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-[12px] font-semibold text-[#5B47D6]">
                    זמן תגובה · פחות משעתיים
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F4A93C] text-white">
                      <Zap className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                    </span>
                  </span>
                </div>

                {/* Outbound — instant Clix reply (left) */}
                <div className="text-left">
                  <div className="inline-block max-w-[92%] rounded-2xl rounded-tl-md bg-gradient-to-br from-[#6C5CE7] to-[#845EF7] px-4 py-2.5 text-right text-[13.5px] font-medium leading-relaxed text-white shadow-md">
                    🚀 קיבלנו! חוזרים אליכם עם הצעה מותאמת תוך שעות
                  </div>
                  <div className="mt-1.5 px-1 text-[11px] text-foreground/40">
                    <span className="inline-flex items-center gap-1">
                      <CheckCheck className="h-3.5 w-3.5 text-[#3A94C5]" strokeWidth={2.2} />
                      נקרא · 11:01
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5 h-px bg-ink/10" />

                {/* Footer — the SLA stat */}
                <div className="flex items-end justify-between">
                  <div className="text-right">
                    <div className="text-[12.5px] text-foreground/55">אנחנו חוזרים אליכם</div>
                    <div className="mt-0.5 text-2xl font-bold tracking-tight text-accent md:text-[26px]">
                      תוך שעות.
                    </div>
                  </div>
                  <div className="font-mono text-[10px] uppercase leading-[1.5] tracking-[0.18em] text-foreground/45">
                    פחות מיום
                    <br />
                    עסקים אחד
                  </div>
                </div>
              </motion.div>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
