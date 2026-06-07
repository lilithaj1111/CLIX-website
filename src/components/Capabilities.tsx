"use client";

import { services } from "@/lib/services";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { useInViewAttr } from "@/lib/useInViewAttr";

export function Capabilities() {
  const sectionRef = useInViewAttr<HTMLElement>();
  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="divider-draw border-t border-transparent py-20 md:py-28 relative overflow-hidden"
    >
      <div aria-hidden className="absolute inset-0 z-0 aurora-bg-tr opacity-60 pointer-events-none" />

      {/* Lime/mint radiant — same atmosphere as the AI Agents card on
          /services so the home flow has a consistent green undertone. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(40% 50% at 25% 30%, color-mix(in srgb, #A3E635 28%, transparent), transparent 70%)",
            "radial-gradient(38% 48% at 75% 60%, color-mix(in srgb, #5EEAD4 24%, transparent), transparent 70%)",
            "radial-gradient(32% 42% at 50% 85%, color-mix(in srgb, #FDE68A 20%, transparent), transparent 70%)",
          ].join(", "),
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 relative z-[1]">
        <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
          <div className="md:col-span-4">
            <Reveal direction="left">
              <div className="eyebrow">יכולות</div>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="text-[clamp(1.7rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.03em]">
                שמונה תחומים, <span className="serif-italic text-accent">חברה אחת.</span>
                <br />
                מחוברים מראש כדי שלכם לא תהיה עבודה כפולה.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="border-t border-line">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04}>
              <Link
                href={`/services#${s.slug}`}
                className="group relative block border-b border-line overflow-hidden"
              >
                {/* Sliding paper background — sweeps from the row's start side */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-paper origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                {/* Accent indicator on the start edge (right in RTL, left in LTR) */}
                <span
                  aria-hidden
                  className="absolute start-0 top-0 bottom-0 w-[3px] bg-accent origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"
                />

                <div className="relative grid md:grid-cols-12 gap-6 items-baseline py-7 md:py-9 px-1 md:group-hover:ps-4 transition-[padding] duration-500">
                  <div className="md:col-span-1 font-mono text-xs text-foreground/60">
                    {s.num}
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="text-2xl md:text-3xl tracking-tight transition-colors group-hover:text-foreground">
                      {s.title}
                    </h3>
                  </div>
                  <div className="md:col-span-5 text-foreground/75 text-[15px] leading-relaxed">
                    {s.tagline}
                  </div>
                  <div className="md:col-span-2 md:text-end">
                    <span className="inline-flex items-center gap-2 text-sm text-foreground/70 group-hover:text-accent transition-colors">
                      קראו עוד
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 10 10"
                        fill="none"
                        className="transition-transform duration-500 rtl:-scale-x-100 group-hover:-translate-x-1 group-hover:-translate-y-1 rtl:group-hover:translate-x-1"
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
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
