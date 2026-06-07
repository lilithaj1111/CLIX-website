import { projects } from "@/lib/work";
import { CTA } from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { LazyTileAnimation } from "@/components/work/LazyTileAnimation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "עבודות — Clix",
  description:
    "מבחר ממערכות ה-AI, האוטומציה וה-CRM שמסרנו לאחרונה ללקוחותינו.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow={<span>עבודות נבחרות · דוגמאות</span>}
        title={
          <>
            מה שאנחנו בונים,{" "}
            <span className="serif-italic text-accent">בשטח.</span>
          </>
        }
        scene="flow"
        sceneSide="right"
        sceneProps={{ accentMix: 0.6 }}
      />

      <section className="border-t border-line">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          {projects.map((p, i) => (
            <Reveal
              key={p.slug}
              as="article"
              delay={(i % 3) * 0.04}
              className="grid md:grid-cols-12 gap-8 md:gap-12 py-16 md:py-24 border-b border-line items-start"
            >
              <span id={p.slug} className="absolute -mt-24" />
              <div className="md:col-span-1 font-mono text-xs text-foreground/60 md:pt-2">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="md:col-span-11">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/60">
                  {p.category} · {p.year}
                </div>
                <h2 className="mt-4 text-[clamp(1.8rem,3.8vw,3.2rem)] leading-[1.02] tracking-[-0.03em]">
                  {p.title}
                </h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.12em] rounded-full border border-line bg-paper text-foreground/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className={`col-span-6 sm:col-span-12 mt-2 rounded-2xl border border-line relative overflow-hidden group glow-hover ${
                  p.slug === "northwind-sales-agent"
                    ? "h-[280px] md:h-[500px]"
                    : "h-[260px] md:h-[460px]"
                }`}
                style={
                  p.slug === "northwind-sales-agent"
                    ? {
                        background:
                          "linear-gradient(140deg, var(--paper) 0%, var(--bg) 55%, color-mix(in srgb, var(--accent) 10%, var(--bg)) 100%)",
                      }
                    : { background: `linear-gradient(135deg, ${p.accent}, ${p.accent}cc)` }
                }
              >
                <div className="absolute inset-0 mix-blend-overlay opacity-50"
                  style={{
                    backgroundImage:
                      "radial-gradient(800px 200px at 20% 80%, rgba(255,255,255,0.35), transparent), radial-gradient(600px 200px at 90% 20%, rgba(0,0,0,0.25), transparent)",
                  }}
                />
                <LazyTileAnimation
                  slug={p.slug}
                  accent={p.accent}
                  className="opacity-95 transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* Caption — desktop only; on mobile it would overlap the
                    animation, so we hide the text (the animation stays). */}
                <div
                  className={`hidden md:block absolute bottom-5 left-6 font-mono text-xs uppercase tracking-[0.18em] ${
                    p.slug === "northwind-sales-agent"
                      ? "text-foreground/70"
                      : "text-white/90"
                  }`}
                >
                  {p.category} · {p.year}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
