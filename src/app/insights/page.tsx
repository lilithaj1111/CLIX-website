import Link from "next/link";
import { insights } from "@/lib/insights";
import { InsightCard, InsightCover } from "@/components/insights/InsightCard";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CTA } from "@/components/CTA";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תובנות — Clix",
  description:
    "תובנות פרקטיות על AI, אוטומציה ו-WhatsApp לעסקים בלי באזז, רק מה שבאמת עובד בשטח.",
};

export default function InsightsPage() {
  const featured = insights.find((a) => a.featured) ?? insights[0];
  const rest = insights.filter((a) => a.slug !== featured.slug);

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
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          {/* Featured article */}
          <Reveal>
            <Link
              href={`/insights/${featured.slug}`}
              className="group grid overflow-hidden rounded-2xl border border-line bg-paper transition-colors duration-500 hover:border-accent/60 shadow-[0_30px_60px_-30px_rgba(11,19,38,0.2)] md:grid-cols-2"
            >
              <InsightCover
                cover={featured.cover}
                tint={featured.tint}
                category={featured.category}
                className="min-h-[220px] md:min-h-[360px]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="flex flex-col justify-center p-8 md:p-10">
                <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-foreground/50">
                  מאמר נבחר
                </div>
                <h2 className="mt-4 text-[clamp(1.6rem,2.6vw,2.3rem)] font-medium leading-[1.12] tracking-[-0.02em] transition-colors group-hover:text-accent">
                  {featured.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-foreground/70">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
                  קראו את המאמר
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
              </div>
            </Link>
          </Reveal>

          {/* The rest */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 0.06}>
                <InsightCard insight={a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
