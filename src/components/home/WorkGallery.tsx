"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { PlatformWaves } from "@/components/home/PlatformWaves";
import { projects } from "@/lib/work";

export function WorkGallery() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black pt-20 md:pt-28">
      {/* Heading — kept on the plain dark background (no video behind it) */}
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#A99BF5]">
              תוצאות בשטח
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-on-dark">
              מערכות שבנינו. תוצאות שהן הביאו.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.7] text-on-dark/65 md:text-base">
              הצצה למערכות שמסרנו ללקוחותינו — והמספרים שהן הזיזו.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Animated backdrop zone — runs from the cards to the end of the section */}
      <div className="relative mt-12 pb-20 md:pb-28">
        {/* Brand-palette "platform" animation (canvas) — replaces the previous
            UiPath-branded background video. */}
        <PlatformWaves className="pointer-events-none absolute inset-0 h-full w-full" />
        <div aria-hidden className="absolute inset-0 bg-black/40" />
        {/* Top fade — blends the video up into the black heading area */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black to-transparent"
        />
        {/* Bottom fade — eases the video back out to black at the section end */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black to-transparent"
        />

        <div className="relative z-[1] mx-auto max-w-[1280px] px-6 lg:px-10">
          {/* Flat cards */}
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project, i) => {
              const [featured] = project.metrics;
              return (
                <Reveal key={project.slug} delay={i * 0.08}>
                  <Link
                    href="/work"
                    className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#24272B]/80 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-white/25"
                  >
                    {/* Front — dark metric card */}
                    <div className="flex h-full flex-col transition-opacity duration-300 group-hover:opacity-0">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#A99BF5]">
                        {project.category} · {project.year}
                      </span>
                      <p className="mt-4 text-[clamp(2.2rem,4.5vw,3.2rem)] font-bold leading-none tracking-[-0.02em] text-on-dark">
                        {featured.value}
                      </p>
                      <p className="mt-1.5 text-xs uppercase tracking-wide text-on-dark/55">
                        {featured.label}
                      </p>
                      <h3 className="mt-5 text-lg font-bold leading-snug text-on-dark">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-on-dark/60">
                        {project.summary}
                      </p>
                      <span className="mt-auto inline-flex pt-6 text-[#A99BF5]">
                        <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                      </span>
                    </div>

                    {/* Hover — white card with the headline centered */}
                    <div className="absolute inset-0 flex items-center justify-center bg-paper p-8 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="text-[clamp(1.2rem,2vw,1.55rem)] font-bold leading-snug tracking-[-0.01em] text-ink">
                        {project.title}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-center gap-5 text-center">
              <p className="text-[15px] text-on-dark/70">רוצים לראות עוד מהעבודות שלנו?</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 rounded-full bg-[#845EF7] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9A7BF8]"
                >
                  לכל העבודות
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-on-dark transition-colors hover:bg-white/10"
                >
                  בואו נתחיל
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
