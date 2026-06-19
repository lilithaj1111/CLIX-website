import { insights } from "@/lib/insights";
import { InsightRow } from "@/components/insights/InsightCard";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CTA } from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תובנות — Clix",
  description:
    "תובנות פרקטיות על AI, אוטומציה ו-WhatsApp לעסקים בלי באזז, רק מה שבאמת עובד בשטח.",
};

export default function InsightsPage() {
  const featured = insights.find((a) => a.featured) ?? insights[0];
  // Featured first, then the rest — all rendered as uniform row containers.
  const ordered = [featured, ...insights.filter((a) => a.slug !== featured.slug)];

  return (
    <>
      <PageHero
        eyebrow={<span>תובנות · משטח העבודה</span>}
        title={
          <>
            מה שלמדנו{" "}
            <span className="serif-italic text-accent">משטח העבודה.</span>
          </>
        }
        scene="flow"
        sceneSide="right"
        sceneProps={{ accentMix: 0.6 }}
        radiant
      />

      <section className="border-t border-line py-16 md:py-24">
        <div className="mx-auto max-w-[920px] px-6 lg:px-10">
          <div className="flex flex-col gap-4 md:gap-5">
            {ordered.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 4) * 0.05}>
                <InsightRow insight={a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
