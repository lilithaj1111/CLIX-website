import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
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
