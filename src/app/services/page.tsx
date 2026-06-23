import { services } from "@/lib/services";
import { CTA } from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import { ServicesHero } from "@/components/ServicesHero";
import { Process } from "@/components/Process";
import {
  ServiceVisual,
  type ServiceVisualKind,
} from "@/components/services/ServiceVisual";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "שירותים — Clix",
  description:
    "סוכני AI, אוטומציות WhatsApp, מערכות CRM, אינטגרציות ותוכנה מותאמת אישית מהונדסים לתוצאות עסקיות.",
};

/* Per-service config — pairs a CSS-3D illustration kind with one of three
 * lime/mint blob palettes so the page reads as a single colour family. */
type ServiceConfig = {
  kind: ServiceVisualKind;
  tint: [string, string, string];
};

const SERVICE_CONFIGS: ServiceConfig[] = [
  { kind: "ai-agents",    tint: ["#845EF7", "#A99BF5", "#845EF7"] }, // 01
  { kind: "whatsapp",     tint: ["#845EF7", "#A99BF5", "#845EF7"] }, // 02
  { kind: "crm",          tint: ["#845EF7", "#A99BF5", "#845EF7"] }, // 03
  { kind: "integrations", tint: ["#845EF7", "#A99BF5", "#845EF7"] }, // 04
  { kind: "websites",     tint: ["#845EF7", "#A99BF5", "#845EF7"] }, // 05
  { kind: "mobile",       tint: ["#845EF7", "#A99BF5", "#845EF7"] }, // 06
  { kind: "software",     tint: ["#845EF7", "#A99BF5", "#845EF7"] }, // 07
  { kind: "strategy",     tint: ["#845EF7", "#A99BF5", "#845EF7"] }, // 08
];

function ServiceBlob({ tint }: { tint: [string, string, string] }) {
  const [a, b, c] = tint;
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
    >
      <div
        className="absolute inset-0"
        style={{ filter: "blur(60px)", opacity: 0.55 }}
      >
        <span
          className="absolute block rounded-full"
          style={{
            background: a,
            width: "65%",
            height: "65%",
            top: "5%",
            left: "12%",
          }}
        />
        <span
          className="absolute block rounded-full"
          style={{
            background: b,
            width: "55%",
            height: "55%",
            top: "30%",
            left: "45%",
          }}
        />
        <span
          className="absolute block rounded-full"
          style={{
            background: c,
            width: "45%",
            height: "45%",
            top: "50%",
            left: "20%",
          }}
        />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />

      <section className="border-t border-line">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          {services.map((s, i) => {
            const config = SERVICE_CONFIGS[i % SERVICE_CONFIGS.length];
            const reversed = i % 2 === 1;

            return (
              <article
                id={s.slug}
                key={s.slug}
                className="relative grid md:grid-cols-2 gap-8 md:gap-16 items-center py-12 sm:py-16 md:py-24 border-b border-line last:border-b-0"
              >
                {/* ── Content column ──────────────────────────────────── */}
                <Reveal
                  direction={reversed ? "right" : "left"}
                  className={reversed ? "md:order-2" : "md:order-1"}
                >
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/55">
                    {s.num} · {s.verb}
                  </div>

                  <h2 className="mt-4 text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.03em] font-medium">
                    {s.title}
                  </h2>
                  <p className="mt-3 serif-italic text-xl md:text-2xl text-accent leading-[1.15]">
                    {s.tagline}
                  </p>
                  <p className="mt-5 max-w-[520px] text-[15.5px] leading-relaxed text-foreground/75">
                    {s.description}
                  </p>
                  <ul className="mt-6 max-w-[520px] grid sm:grid-cols-2 gap-x-5 gap-y-2.5">
                    {s.capabilities.map((c) => (
                      <li
                        key={c}
                        className="flex gap-2.5 text-[13.5px] text-foreground/80 leading-snug"
                      >
                        <span className="mt-[7px] inline-block w-1 h-1 rounded-full bg-accent shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {/* ── 3D visual column. Same illustrations on all
                    viewports; on mobile the Stage scales them down so
                    they fit the smaller container without breaking the
                    interior layout. ───────────────────────────────── */}
                <Reveal
                  direction={reversed ? "left" : "right"}
                  delay={0.08}
                  className={reversed ? "md:order-1" : "md:order-2"}
                >
                  <div className="relative aspect-[5/4] rounded-2xl border border-line bg-paper/60 backdrop-blur-sm overflow-hidden shadow-[0_30px_60px_-25px_rgba(11,19,38,0.18)]">
                    <ServiceBlob tint={config.tint} />
                    <ServiceVisual kind={config.kind} />
                    {/* Service number watermark — corner */}
                    <span
                      aria-hidden
                      className="absolute top-4 right-5 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40 z-[2]"
                    >
                      {s.num}
                    </span>
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>

      <Process />

      <CTA />
    </>
  );
}
