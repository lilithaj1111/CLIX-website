"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { industries } from "@/lib/industries";

export function SolutionsTabs() {
  const [active, setActive] = useState(0);
  const ind = industries[active];

  return (
    <section className="relative border-t border-line bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
            פתרונות לפי תעשייה
          </p>
          <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-ink">
            פתרונות בעלי השפעה, מבוססי AI.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-foreground/70 md:text-base">
            מערכת אחת לכל תעשייה — מחוברת מהפנייה הראשונה ועד התוצאה העסקית.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-10 flex flex-wrap gap-2">
            {industries.map((item, i) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={
                  i === active
                    ? "rounded-full bg-accent-deep px-4 py-2 text-sm font-semibold text-on-dark transition-colors"
                    : "rounded-full border border-line px-4 py-2 text-sm text-foreground transition-colors hover:bg-bg-warm"
                }
              >
                {item.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={ind.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-10 lg:grid-cols-2"
            >
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
                  {ind.verb}
                </p>
                <p className="mt-4 text-2xl font-bold leading-tight tracking-[-0.02em] text-ink md:text-3xl">
                  {ind.systemLead}
                </p>

                <ul className="mt-7 space-y-3">
                  {ind.solutions.slice(0, 3).map((sol) => (
                    <li key={sol.title} className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-deep text-on-dark">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="text-[15px] font-semibold text-ink">
                        {sol.title}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={"/industries/" + ind.slug}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-deep px-6 py-3 text-sm font-semibold text-on-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink"
                >
                  גלו עוד
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
                </Link>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                <Image
                  src={ind.image}
                  alt={ind.name}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
