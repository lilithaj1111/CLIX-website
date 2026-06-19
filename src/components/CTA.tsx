"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";
import { Scene } from "./three/Scene";
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
                אתם מביאים את <span className="serif-italic text-[#A9BDD0]">העסק.</span>
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
            <Tilt max={10} scale={1.01}>
              <motion.div
                style={{ y: sceneY, rotateZ: sceneRotate }}
                className="grad-border glass relative rounded-2xl h-[280px] md:h-[340px] overflow-hidden"
              >
                <Scene
                  kind="orb"
                  density={1.1}
                  scale={1.15}
                  accentMix={0.7}
                  position={[0, 0, 0]}
                  className="absolute inset-0 pointer-events-none"
                />
                <div className="absolute inset-0 flex flex-col justify-between p-7 pointer-events-none">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
                    <span>זמן מענה ממוצע</span>
                    <span>· בזמן אמת</span>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
                      פחות מיום עסקים אחד
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl tracking-tight">
                      אנחנו חוזרים אליכם
                      <br />
                      <span className="serif-italic text-accent">
                        תוך שעות.
                      </span>
                    </div>
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
