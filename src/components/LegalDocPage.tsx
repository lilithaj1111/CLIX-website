import { PageHero } from "./PageHero";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";
import type { LegalDoc } from "@/lib/legal";

/**
 * Shared render for /privacy and /terms. Renders the section list from a
 * LegalDoc — single-column, max-w-[800px], borders between sections so the
 * page reads like a clean document, not a marketing page.
 */
export function LegalDocPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero
        eyebrow={<span>{doc.eyebrow}</span>}
        title={<>{doc.title}</>}
        scene="ribbon"
        sceneSide="full"
        sceneProps={{ accentMix: 0.6, scale: 1.05, density: 1.2 }}
      />

      <section className="border-t border-line py-16 md:py-24">
        <div className="mx-auto max-w-[820px] px-6 lg:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/60 mb-10">
            עדכון אחרון · {doc.updated}
          </div>

          <div className="border-y border-line">
            {doc.sections.map((s, i) => (
              <Reveal
                key={s.title}
                delay={Math.min(i, 6) * 0.04}
                className="border-b border-line last:border-b-0 py-7 md:py-9 grid md:grid-cols-12 gap-4 md:gap-8 items-start"
              >
                <div className="md:col-span-4 md:sticky md:top-24">
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/50">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h2 className="mt-2 text-xl md:text-2xl tracking-tight">
                    {s.title}
                  </h2>
                </div>
                <div className="md:col-span-8 space-y-3 text-[15.5px] leading-relaxed text-foreground/80">
                  {s.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-10 text-sm text-foreground/65">
            יש שאלות? כתבו לנו אל
            <a
              href="mailto:info@clixsolution.com"
              className="text-foreground link-underline"
            >
              info@clixsolution.com
            </a>
            .
          </p>
        </div>
      </section>

      <CTA />
    </>
  );
}
