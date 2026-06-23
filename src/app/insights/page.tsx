import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { insights } from "@/lib/insights";
import { InsightCard, InsightCover } from "@/components/insights/InsightCard";
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
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          {/* Featured article — large cover + copy (image right, text left in RTL) */}
          <Reveal>
            <Link
              href={`/insights/${featured.slug}`}
              className="group grid overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_24px_50px_-30px_rgba(11,19,38,0.18)] transition-colors duration-500 hover:border-accent/60 md:grid-cols-2"
            >
              <InsightCover
                cover={featured.cover}
                tint={featured.tint}
                category={featured.category}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="min-h-[240px] md:min-h-[440px]"
              />
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-accent-deep">
                  מאמר נבחר
                </span>
                <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.3rem)] font-bold leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-accent">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground/65">
                  {featured.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  קראו את המאמר
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* The rest — uniform card grid with cover images */}
          <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 0.07}>
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
