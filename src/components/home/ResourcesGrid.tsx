"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { insights } from "@/lib/insights";

export function ResourcesGrid() {
  const items = insights.slice(0, 4);

  return (
    <section className="relative border-t border-line bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
            תובנות וכלים
          </p>
          <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-ink">
            ידע שאפשר לפעול לפיו.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-foreground/70 md:text-base">
            מאמרים פרקטיים, אנטי-הייפ, מהשטח.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((ins, i) => (
            <Reveal key={ins.slug} delay={i * 0.06}>
              <Link
                href={"/insights/" + ins.slug}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-paper transition-colors duration-300 hover:border-line-strong"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-bg-warm">
                  <Image
                    src={ins.cover}
                    alt={ins.title}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent">
                    {ins.category}
                  </span>
                  <h3 className="mt-3 text-lg font-bold leading-snug tracking-[-0.01em] text-ink md:text-xl">
                    {ins.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-foreground/65">
                    {ins.excerpt}
                  </p>
                  <p className="mt-6 text-[11px] text-foreground/45">
                    {ins.date + " · " + ins.readingMinutes + " דק׳ קריאה"}
                  </p>
                  <span className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-all duration-300 group-hover:-translate-x-1 group-hover:bg-bg-warm">
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
