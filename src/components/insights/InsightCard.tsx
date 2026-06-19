import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Insight } from "@/lib/insights";

/* Editorial cover — an abstract, on-brand image from /public, object-cover, with
 * a tint gradient behind it as a fallback and the category chip in the (RTL)
 * top-right corner. Optimized + responsive via next/image. */
export function InsightCover({
  cover,
  tint,
  category,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority,
}: {
  cover: string;
  tint: [string, string, string];
  category?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [a] = tint;
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${a} 22%, white), white)`,
      }}
    >
      <Image
        src={cover}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {category && (
        <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-paper/90 px-3 py-1 text-[12px] font-medium text-ink shadow-sm ring-1 ring-line backdrop-blur-sm">
          {category}
        </span>
      )}
    </div>
  );
}

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link
      href={`/insights/${insight.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-colors duration-500 hover:border-accent/60 shadow-[0_24px_50px_-30px_rgba(11,19,38,0.18)]"
    >
      <InsightCover
        cover={insight.cover}
        tint={insight.tint}
        category={insight.category}
        className="aspect-[16/9]"
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[18px] font-medium leading-snug tracking-[-0.01em] transition-colors group-hover:text-accent">
          {insight.title}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-foreground/65">
          {insight.excerpt}
        </p>
        <div className="mt-auto pt-5">
          <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent">
            קראו את המאמר
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* InsightRow — a UiPath "session"-style row container: a circular lightbulb
 * glyph (insights, not a bookmark star), a mono metadata line, a bold title,
 * a short excerpt and a "read more" link. Used as the /insights listing. */
export function InsightRow({ insight }: { insight: Insight }) {
  return (
    <Link
      href={`/insights/${insight.slug}`}
      className="group flex gap-5 rounded-xl border border-line bg-paper p-6 transition-colors duration-300 hover:border-accent/45 hover:bg-bg-warm/40 md:p-7"
    >
      {/* Glyph — replaces UiPath's bookmark star with a lightbulb (= insight). */}
      <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-colors group-hover:border-accent/50 group-hover:bg-accent-soft">
        <Lightbulb className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>

      <div className="min-w-0 flex-1">
        {/* Metadata line */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[12px] uppercase tracking-[0.14em]">
          <span className="font-semibold text-accent-deep">{insight.category}</span>
          <span aria-hidden className="text-foreground/35">·</span>
          <span className="text-foreground/55">{insight.date}</span>
          <span aria-hidden className="text-foreground/35">·</span>
          <span className="text-foreground/55">{insight.readingMinutes} דק׳ קריאה</span>
        </div>

        <h3 className="mt-2.5 text-[clamp(1.2rem,2vw,1.6rem)] font-bold leading-snug tracking-[-0.015em] text-ink transition-colors group-hover:text-accent">
          {insight.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-foreground/65">
          {insight.excerpt}
        </p>

        <span className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent">
          קראו עוד
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
