import Link from "next/link";
import { notFound } from "next/navigation";
import { insights, getInsight } from "@/lib/insights";
import { InsightCover } from "@/components/insights/InsightCard";
import { Scene } from "@/components/three/Scene";
import { RevealScene } from "@/components/RevealScene";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return insights.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getInsight(slug);
  if (!a) return { title: "תובנות — Clix" };
  return { title: `${a.title} — Clix`, description: a.excerpt };
}

export default async function InsightArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();

  return (
    <article className="relative">
      {/* ── Header hero — animated mesh-ribbon scene behind the title, matching
          the /insights listing hero (image 1). ─────────────────────────────── */}
      <div className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16">
        <div aria-hidden className="absolute inset-0 z-0 aurora-bg" />
        {/* soft slate radiant */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: [
              "radial-gradient(50% 60% at 10% -4%, color-mix(in srgb, #845EF7 20%, transparent), transparent 68%)",
              "radial-gradient(48% 56% at 94% 4%, color-mix(in srgb, #845EF7 22%, transparent), transparent 68%)",
              "radial-gradient(70% 52% at 50% -10%, color-mix(in srgb, #A99BF5 12%, transparent), transparent 70%)",
            ].join(", "),
          }}
        />
        {/* mesh ribbon */}
        <RevealScene opacity={0.9} className="absolute inset-0 z-0 pointer-events-none">
          <Scene
            kind="flow"
            density={1}
            scale={1.15}
            accentMix={0.55}
            position={[1.4, 0.2, 0]}
            className="absolute inset-0"
          />
        </RevealScene>
        {/* readability veil */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1] pointer-events-none bg-background/55 lg:bg-background/25"
        />

        <div className="relative z-[2] mx-auto max-w-[760px] px-6 lg:px-8">
          {/* back */}
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 font-mono text-[12.5px] uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:text-accent"
          >
            <ArrowRight className="h-4 w-4" />
            כל התובנות
          </Link>

          {/* header */}
          <div className="mt-6 flex items-center gap-3 font-mono text-[12.5px] text-foreground/55">
            <span className="rounded-full bg-accent-soft px-3 py-1 font-medium text-accent-deep">
              {article.category}
            </span>
            <span>{article.date}</span>
            <span aria-hidden>·</span>
            <span>{article.readingMinutes} דק׳ קריאה</span>
          </div>

          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
            {article.title}
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed text-foreground/70">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* cover */}
      <div className="mx-auto mt-10 max-w-[1100px] px-6 lg:px-8">
        <InsightCover
          cover={article.cover}
          tint={article.tint}
          className="h-[240px] rounded-2xl md:h-[380px]"
          sizes="(max-width: 1100px) 100vw, 1100px"
          priority
        />
      </div>

      {/* body */}
      <div className="mx-auto mt-12 max-w-[720px] px-6 lg:px-8">
        {article.body.map((section, si) => (
          <section key={si}>
            {section.heading && (
              <h2 className="mb-4 mt-12 text-[clamp(1.4rem,2.4vw,1.9rem)] font-medium tracking-[-0.02em] text-ink first:mt-0">
                {section.heading}
              </h2>
            )}
            {section.paragraphs.map((p, pi) => (
              <p
                key={pi}
                className="mb-5 text-[17px] leading-[1.85] text-foreground/80"
              >
                {p}
              </p>
            ))}

            {/* pull quote after the opening section */}
            {si === 0 && article.pullQuote && (
              <blockquote className="my-10 border-r-[3px] border-accent pr-5 text-[clamp(1.3rem,2.4vw,1.7rem)] font-medium leading-[1.4] tracking-[-0.01em] text-ink">
                {article.pullQuote}
              </blockquote>
            )}
          </section>
        ))}

        {/* stat callout */}
        {article.stat && (
          <div className="mt-12 rounded-2xl border border-accent/20 bg-accent-soft/50 p-7 text-center">
            <div
              dir="ltr"
              className="text-[clamp(2.4rem,6vw,3.6rem)] font-bold leading-none tracking-[-0.03em] text-accent-deep"
            >
              {article.stat.value}
            </div>
            <div className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-foreground/70">
              {article.stat.label}
            </div>
          </div>
        )}
      </div>

      {/* lead-gen CTA Matrix-style "רוצים לשמוע עוד?" */}
      <div className="mx-auto mt-16 max-w-[760px] px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-paper p-8 text-center md:p-10 shadow-[0_30px_60px_-30px_rgba(11,19,38,0.18)]">
          <h3 className="text-[clamp(1.5rem,3vw,2.1rem)] font-medium tracking-[-0.02em]">
            רוצים לדבר על זה לגבי{" "}
            <span className="serif-italic text-accent">העסק שלכם?</span>
          </h3>
          <p className="max-w-md text-[15px] leading-relaxed text-foreground/65">
            נשמח לבחון יחד איפה AI ואוטומציה באמת יזיזו את המחט בשיחה
            קצרה וכנה, בלי התחייבות.
          </p>
          <Link
            href="/contact"
            className="btn-shine btn-violet inline-flex items-center justify-center gap-2 rounded-full py-2.5 pe-2 ps-7 text-sm font-medium text-on-dark"
          >
            בואו נדבר
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/40 text-paper backdrop-blur-sm">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>

      <div className="h-20 md:h-28" />
    </article>
  );
}
