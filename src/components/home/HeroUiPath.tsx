"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function HeroUiPath() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden bg-[#0A0912] pb-20 pt-28 md:pb-[calc(135px_+_18dvh)] md:pt-[190px]">
      {/* Neon brand background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/cta-neon-bg.jpg')" }}
      />
      {/* Legibility veil — a touch darker on the left where the body copy sits */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(10,9,18,0.8), rgba(10,9,18,0.5) 50%, rgba(10,9,18,0.42))",
        }}
      />
      {/* Mask the Gemini watermark in the bottom-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-52 w-52"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, #0A0912 0%, #0A0912 45%, transparent 78%)",
        }}
      />

      <div className="relative z-[1] mx-auto w-full max-w-[1280px] px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT in RTL (second child) — text + CTAs */}
          <div className="order-2 text-left lg:order-2">
            <Reveal>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#A99BF5]">
                פלטפורמת ה-AI לעסק שלכם
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 text-[clamp(2rem,4.2vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.03em] text-on-dark">
                מעבירים אתכם מניסוי ל-ROI אמיתי.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 mr-auto max-w-md text-[16px] leading-[1.7] text-on-dark/75 md:text-[18px]">
                סוכני AI, אוטומציות, מערכות CRM ותוכנה מותאמת אישית — מתוכננים
                סביב התוצאה העסקית שלכם, בלי באזז.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#845EF7] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9A7BF8]"
                >
                  בואו נתחיל <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-on-dark transition-colors hover:bg-white/10"
                >
                  צפו בעבודות שלנו <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* RIGHT in RTL (first child) — big brand statement */}
          <div className="order-1 text-right lg:order-1">
            <Reveal>
              <h1 className="text-[clamp(2rem,7vw,5.6rem)] font-bold leading-[1.05] tracking-[-0.04em] text-on-dark md:leading-[1.02]">
                בינה&nbsp;מהונדסת.
                <br />
                <span className="text-gradient-flow">תוצאות&nbsp;אמיתיות.</span>
              </h1>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
