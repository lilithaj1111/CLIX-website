"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { industries } from "@/lib/industries";
import { LightGridBackdrop } from "@/components/home/LightGridBackdrop";

export function SolutionsTabs() {
  const [active, setActive] = useState(0);
  const ind = industries[active];
  // The keynote video + "schedule a meeting" treatment is only for the
  // Education & training tab; every other industry keeps its image + outcome.
  const isEdu = ind.slug === "education";

  return (
    <section className="relative overflow-hidden border-t border-line bg-background py-20 md:py-28">
      <LightGridBackdrop />
      <div className="relative z-[1] mx-auto max-w-[1280px] px-6 lg:px-10">
        {/* Centered heading */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
              פתרונות לפי תעשייה
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-ink">
              פתרונות בעלי השפעה, מבוססי AI.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.7] text-foreground/70 md:text-base">
              מערכת אחת לכל תעשייה — מחוברת מהפנייה הראשונה ועד התוצאה העסקית.
            </p>
          </div>
        </Reveal>

        {/* Vertical tabs + colored panel */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Tabs — right column in RTL */}
          <div className="lg:col-span-3">
            <ul className="space-y-1">
              {industries.map((item, i) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    className={`group flex w-full items-center justify-between gap-3 rounded-none px-4 py-3 text-right text-[15px] font-semibold transition-colors ${
                      i === active
                        ? "bg-accent-soft text-ink"
                        : "text-foreground/60 hover:bg-bg-warm hover:text-ink"
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronLeft
                      className={`h-4 w-4 shrink-0 transition-opacity ${
                        i === active
                          ? "text-accent opacity-100"
                          : "opacity-0 group-hover:opacity-50"
                      }`}
                      strokeWidth={2.2}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <Link
              href="/industries"
              className="mt-4 inline-flex items-center gap-1.5 px-4 text-[13px] font-semibold text-accent transition-colors hover:text-ink"
            >
              כל התעשיות
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
            </Link>
          </div>

          {/* Colored content panel */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={ind.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-none p-7 md:p-10"
                style={{
                  background:
                    "linear-gradient(135deg, #845EF7 0%, #3A46F0 100%)",
                }}
              >
                <div className="grid gap-8 lg:grid-cols-5 lg:items-center">
                  {/* Text */}
                  <div className="lg:col-span-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
                      {ind.name}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold leading-tight tracking-[-0.01em] text-white md:text-[28px]">
                      {ind.systemLead}
                    </h3>
                    <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/75">
                      {ind.pain}
                    </p>
                    <Link
                      href={"/industries/" + ind.slug}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-all hover:gap-3"
                    >
                      <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                      פתרונות ל{ind.name}
                    </Link>
                  </div>

                  {/* Dark media + CTA card — video only on Education & training */}
                  <Link
                    href={isEdu ? "/contact" : "/industries/" + ind.slug}
                    className="group block lg:col-span-2"
                  >
                    <div className="overflow-hidden rounded-none border border-white/10 bg-ink">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {isEdu ? (
                          // eslint-disable-next-line jsx-a11y/media-has-caption
                          <video
                            src="/lectures/lecture-preview.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="none"
                            aria-label="קטע וידאו מהרצאה"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                          />
                        ) : (
                          <Image
                            src={ind.image}
                            alt={ind.name}
                            fill
                            sizes="(max-width:1024px) 100vw, 30vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                          />
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-3 p-4">
                        <span
                          className={
                            isEdu
                              ? "text-[13px] font-medium text-on-dark"
                              : "line-clamp-2 text-[12.5px] leading-snug text-on-dark/80"
                          }
                        >
                          {isEdu ? "קבעו מפגש" : ind.outcome}
                        </span>
                        {isEdu && (
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-[#845EF7] text-white transition-all group-hover:-translate-x-0.5 group-hover:bg-[#9A7BF8]">
                            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
