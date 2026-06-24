"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import { useInViewAttr } from "@/lib/useInViewAttr";

export function CTA() {
  const sectionRef = useInViewAttr<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/10 py-24 md:py-32"
    >
      {/* Neon brand background */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/cta-neon-bg.jpg')" }}
      />
      {/* Dark veil so the text stays legible over the neon */}
      <div aria-hidden className="absolute inset-0 z-0 bg-[#0B0A14]/70" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 text-center">
        <Reveal>
          <div className="eyebrow justify-center text-on-dark/60">בואו נבנה משהו</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 text-[clamp(2rem,4.8vw,4.2rem)] font-bold leading-[1] tracking-[-0.04em] text-on-dark">
            אתם מביאים את <span className="serif-italic text-[#A99BF5]">העסק.</span>
            <br />
            אנחנו מביאים את הבינה.
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 text-base ps-7 pe-2 py-2 rounded-full font-semibold bg-on-dark text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              בואו נתחיל
              <span className="inline-flex w-9 h-9 rounded-full bg-ink text-paper items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 10 10" fill="none">
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
    </section>
  );
}
