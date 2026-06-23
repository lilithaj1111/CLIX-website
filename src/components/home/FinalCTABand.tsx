"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function FinalCTABand() {
  return (
    <section className="relative flex min-h-[72vh] items-center overflow-hidden border-t border-white/10 bg-[#16181B] py-28 md:py-32">
      {/* Static "platform" background image (public/cta-platform-bg.jpg). Replace
          that file to swap the picture; bump the ?v= to bust the browser cache. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/cta-platform-bg.jpg?v=4')" }}
      />
      {/* Light legibility veil so the centred copy stays readable while the
          vivid image still shows through */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/30" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(780px 520px at 50% 46%, rgba(0,0,0,0.45) 0%, transparent 72%)",
        }}
      />

      <div className="relative z-[1] mx-auto w-full max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#A99BF5]">
              מוכנים להתחיל?
            </p>

            <h2 className="mt-4 text-[clamp(1.85rem,4vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.035em] text-on-dark">
              זה הסוף של העמוד — וההתחלה של המערכת הבאה שלכם.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.7] text-on-dark/70 md:text-base">
              נדבר 30 דקות, נמפה איפה AI באמת יזיז את המחט, ונצא עם תוכנית.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#845EF7] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9A7BF8]"
              >
                קבעו שיחה
                <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
              </Link>

              <Link
                href="mailto:info@clixsolution.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-on-dark transition-colors hover:bg-white/10"
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
