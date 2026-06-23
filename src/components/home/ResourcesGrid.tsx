"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Lightbulb,
  Compass,
  LineChart,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { insights } from "@/lib/insights";

const ICONS: LucideIcon[] = [Lightbulb, Compass, LineChart, BookOpen];

export function ResourcesGrid() {
  const items = insights.slice(0, 4);

  return (
    <section className="bg-background relative overflow-hidden pt-16 pb-32 md:pt-24">
      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
              תובנות
            </p>
            <h2 className="mt-4 text-[clamp(1.7rem,3.6vw,2.8rem)] font-bold leading-[1.08] tracking-[-0.035em] text-ink">
              ידע שאפשר לפעול לפיו.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.7] text-foreground/70 md:text-base">
              מאמרים פרקטיים, אנטי-הייפ, מהשטח — בדיוק מה שצריך לדעת לפני הצעד הבא.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((ins, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={ins.slug} delay={i * 0.06}>
                <Link
                  href={`/insights/${ins.slug}`}
                  className="group block h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-paper hover:shadow-[0_28px_56px_-22px_rgba(20,26,32,0.28)]"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center text-ink">
                    <Icon className="h-8 w-8" strokeWidth={1.4} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                    {ins.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-foreground/65">
                    {ins.excerpt}
                  </p>
                  <span className="mt-5 inline-flex text-[#845EF7] transition-transform duration-300 group-hover:-translate-x-1">
                    <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
