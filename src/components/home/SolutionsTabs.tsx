"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
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
          </div>
        </Reveal>

        {/* Vertical tabs + colored panel */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Tabs — right column in RTL */}
          <div className="lg:col-span-3">
            <ul className="space-y-3">
              {industries.map((item, i) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    className={`group flex w-full items-center justify-between gap-3 rounded-2xl px-6 py-5 text-right text-[19px] font-semibold transition-colors ${
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
              className="mt-5 inline-flex items-center gap-1.5 px-5 text-[14px] font-semibold text-accent transition-colors hover:text-ink"
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
                className="mx-auto max-w-[820px] overflow-hidden rounded-3xl border border-line bg-paper p-4 shadow-[0_30px_60px_-35px_rgba(20,26,32,0.3)] md:p-5"
              >
                {/* Industry image (keynote video for Education) on top */}
                <Link
                  href={isEdu ? "/contact" : "/industries/" + ind.slug}
                  className="group block"
                >
                  <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-ink">
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
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <Image
                        src={ind.image}
                        alt={ind.name}
                        fill
                        sizes="(max-width:1024px) 100vw, 60vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                    {/* Industry label — badge in the image's top-right corner */}
                    <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-gradient-to-br from-[#A99BF5] to-[#845EF7] px-5 py-2 text-[15px] font-semibold text-white shadow-md">
                      {ind.name}
                    </span>
                  </div>
                </Link>

                {/* Copy — centred under the image */}
                <div className="mt-6 px-2 text-right md:mt-7">
                  <h3 className="text-2xl font-bold leading-tight tracking-[-0.01em] text-ink md:text-[28px]">
                    {ind.systemLead}
                  </h3>
                  <p className="mt-3 max-w-md text-[14px] leading-relaxed text-foreground/65">
                    {ind.pain}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href={"/industries/" + ind.slug}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9A7BF8]"
                    >
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                      פתרונות ל{ind.name}
                    </Link>
                    {isEdu && (
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-bg-warm"
                      >
                        <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                        קבעו מפגש
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
