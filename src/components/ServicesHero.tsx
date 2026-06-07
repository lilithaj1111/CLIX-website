"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

type Segment = {
  text: string;
  accent?: boolean;
};

const SEGMENTS: Segment[] = [
  { text: "אנחנו בונים את" },
  { text: "המנגנונים השקטים", accent: true },
  { text: "שמניעים עסקים מודרניים." },
];

const FlowMesh = dynamic(
  () => import("./three/FlowMesh").then((m) => m.FlowMesh),
  { ssr: false, loading: () => null },
);

/**
 * Services hero — full-bleed layout. Text sits on the left over the
 * cream surface; flowing purple 3D ribbon curves bleed off the right
 * edge with a soft accent radial glow behind them. All curves are
 * forced to the accent palette (`accentMix: 1`) so the whole bundle
 * reads purple against the cream surface.
 */
export function ServicesHero() {
  const words: { text: string; accent: boolean }[] = [];
  SEGMENTS.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (!w) return;
      words.push({ text: w, accent: !!seg.accent });
    });
  });

  return (
    <section className="relative pt-24 md:pt-32 pb-24 md:pb-36 overflow-hidden">
      {/* Page-warm aurora wash */}
      <div aria-hidden className="absolute inset-0 z-0 aurora-bg opacity-50" />

      {/* Soft purple radial glow centered on the shader area — the only
          accent atmosphere that bleeds onto the section. */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-[80%] z-[1] pointer-events-none hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 80% 50%, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Animated purple ribbons — extending the container leftward
          lets the ribbons physically cross behind the headline
          (matching the home-hero sphere) without tinting the section.
          A gentle left fade keeps the type readable on the cross-over
          band. */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 -left-[10%] -right-[8%] z-[1] pointer-events-none hidden md:block overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 22%, black 50%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 22%, black 50%, black 100%)",
        }}
      >
        <FlowMesh
          accentMix={0.6}
          density={1}
          scale={1.2}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Mobile fallback — full-width shader behind the hero, masked
          softly so the text remains readable. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none md:hidden opacity-70 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 35%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 35%, black 100%)",
        }}
      >
        <FlowMesh
          accentMix={0.6}
          density={1}
          scale={1.2}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Headline on cols 1-6, intro on cols 8-10. Col 7 is left
            empty as the "small space at center" between the big text
            and the small text. `items-end` drops the intro to the
            baseline of the headline column. On mobile the grid
            collapses to a single column so they stack naturally. */}
        <div className="grid md:grid-cols-12 gap-8 md:items-end">
          <div className="md:col-span-6 flex flex-col gap-7">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow"
            >
              <span>שירותים</span>
            </motion.div>

            <h1 className="text-[clamp(2rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em] font-medium">
              {words.map((w, i) => (
                <motion.span
                  key={`w-${i}`}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.15 + i * 0.06,
                    type: "spring",
                    stiffness: 140,
                    damping: 22,
                  }}
                  className={`inline-block ${
                    w.accent ? "serif-italic text-accent" : ""
                  } ${i === words.length - 1 ? "" : "mr-[0.28em]"}`}
                >
                  {w.text}
                </motion.span>
              ))}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
