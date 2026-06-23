"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

type Testimonial = {
  slug: string;
  name: string;
  role: string;
  videoSrc: string;
  posterSrc: string;
};

const TESTIMONIALS: Testimonial[] = [
  { slug: "asaf-peretz", name: "אסף פרץ", role: "מייסד · SalesIQ", videoSrc: "/testimonials/asaf-peretz.mp4", posterSrc: "/testimonials/asaf-peretz.jpg" },
  { slug: "adir-peretz", name: "אדיר פרץ", role: "בעלים · סטודיו וידאו וצילום", videoSrc: "/testimonials/adir-peretz.mp4", posterSrc: "/testimonials/adir-peretz.jpg" },
  { slug: "nevo-yahaloman", name: "נבו יהלומן", role: "מייסד", videoSrc: "/testimonials/nevo-yahaloman.mp4", posterSrc: "/testimonials/nevo-yahaloman.jpg" },
  { slug: "noam-tovi", name: "נועם תובי", role: "בעלים · השקעות", videoSrc: "/testimonials/noam-tovi.mp4", posterSrc: "/testimonials/noam-tovi.jpg" },
];

export function Testimonial() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const total = TESTIMONIALS.length;
  const t = TESTIMONIALS[active];
  const nextT = TESTIMONIALS[(active + 1) % total];

  const go = (dir: number) => {
    setPlaying(false);
    setActive((a) => (a + dir + total) % total);
  };

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#26292E] py-24 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 520px at 20% 60%, color-mix(in srgb, var(--accent-2) 12%, transparent), transparent 66%)",
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* TEXT — first child → RIGHT in RTL */}
          <div className="lg:col-span-5 lg:mt-2.5">
            <p className="font-mono text-[13px] font-medium uppercase tracking-[0.2em] text-[#A99BF5]">
              בקולם של הלקוחות שלנו
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={t.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="mt-4 text-[clamp(2.25rem,6.5vw,5.2rem)] font-bold leading-[1] tracking-[-0.03em] text-on-dark">
                  {t.name}
                </h2>
                <p className="mt-5 text-[clamp(1.15rem,1.8vw,1.5rem)] leading-relaxed text-on-dark/60">
                  {t.role}
                </p>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-[#A99BF5] transition-colors hover:text-on-dark"
            >
              צפו בסרטון
              <Play className="h-5 w-5" fill="currentColor" strokeWidth={0} />
            </button>
          </div>

          {/* THUMBNAILS — second child → LEFT in RTL */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5 sm:gap-6">
              {/* Active — large */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.slug}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[4/5] w-full flex-1 overflow-hidden rounded-3xl border border-white/10 bg-ink"
                >
                  {playing ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      src={t.videoSrc}
                      poster={t.posterSrc}
                      autoPlay
                      controls
                      playsInline
                      preload="metadata"
                      onEnded={() => setPlaying(false)}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      aria-label={`הפעלת עדות של ${t.name}`}
                      className="group absolute inset-0"
                    >
                      <Image
                        src={t.posterSrc}
                        alt={t.name}
                        fill
                        sizes="(max-width:1024px) 100vw, 40vw"
                        className="object-cover object-[center_30%]"
                      />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                          <Play className="ms-1 h-6 w-6" fill="currentColor" strokeWidth={0} />
                        </span>
                      </span>
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 text-right">
                        <span className="block text-base font-bold text-white">{t.name}</span>
                        <span className="block text-[12.5px] text-white/70">{t.role}</span>
                      </span>
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Next-up — peeking */}
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={`הבא: ${nextT.name}`}
                className="relative hidden w-[180px] shrink-0 self-stretch overflow-hidden rounded-3xl border border-white/10 opacity-55 transition-opacity duration-300 hover:opacity-90 sm:block md:w-[230px] lg:w-[270px]"
              >
                <Image
                  src={nextT.posterSrc}
                  alt={nextT.name}
                  fill
                  sizes="180px"
                  className="object-cover object-[center_30%]"
                />
              </button>
            </div>

            {/* Carousel controls — below the thumbnails, larger */}
            <div className="mt-10 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="הקודם"
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/25 text-on-dark/80 transition-colors hover:bg-white/10 hover:text-on-dark"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="הבא"
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/25 text-on-dark/80 transition-colors hover:bg-white/10 hover:text-on-dark"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-1 items-center gap-4 font-mono text-lg tabular-nums">
                <span className="text-on-dark">{String(active + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-white/30" />
                <span className="text-on-dark/40">{String(total).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
