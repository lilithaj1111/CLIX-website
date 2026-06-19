"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function FinalCTABand() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink-warm py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent-2) 16%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#8CA0B3]">
              מוכנים להתחיל?
            </p>

            <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-on-dark">
              זה הסוף של העמוד — וההתחלה של המערכת הבאה שלכם.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.7] text-on-dark/65 md:text-base">
              נדבר 30 דקות, נמפה איפה AI באמת יזיז את המחט, ונצא עם תוכנית.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-on-dark px-6 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                קבעו שיחה
                <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
              </Link>

              <Link
                href="mailto:info@clixsolution.com"
                className="inline-flex items-center gap-2 rounded-full bg-[#54728A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#62809a]"
              >
                או שלחו אימייל
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
