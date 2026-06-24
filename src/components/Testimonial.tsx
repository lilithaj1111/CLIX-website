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
  posterSrc?: string;
  quote?: string;
};

// NOTE: the `quote` lines are placeholders — replace each with the customer's real words.
const TESTIMONIALS: Testimonial[] = [
  { slug: "asaf-peretz", name: "אסף פרץ", role: "מייסד · SalesIQ", videoSrc: "/testimonials/asaf-peretz.mp4", posterSrc: "/testimonials/asaf-peretz.jpg", quote: "Clix שינתה לנו את כל תהליך המכירה — מה שלקח שעות קורה עכשיו תוך דקות." },
  { slug: "adir-peretz", name: "אדיר פרץ", role: "בעלים · סטודיו וידאו וצילום", videoSrc: "/testimonials/adir-peretz.mp4", posterSrc: "/testimonials/adir-peretz.jpg", quote: "המערכת שבנו לנו פשוט עובדת — פחות עבודה ידנית, יותר זמן ללקוחות." },
  { slug: "nevo-yahaloman", name: "נבו יהלומן", role: "מייסד", videoSrc: "/testimonials/nevo-yahaloman.mp4", posterSrc: "/testimonials/nevo-yahaloman.jpg", quote: "סוף סוף כל פנייה מטופלת אוטומטית, בלי שאני צריך לרדוף אחרי כלום." },
  { slug: "noam-tovi", name: "נועם תובי", role: "בעלים · השקעות", videoSrc: "/testimonials/noam-tovi.mp4", posterSrc: "/testimonials/noam-tovi.jpg", quote: "הליווי היה צמוד והמערכת מדויקת — בדיוק מה שחיפשנו." },
  { slug: "elishiv", name: "אלישיב", role: "בעלים · חברת בנייה והנדסה", videoSrc: "/testimonials/elishiv.mp4", quote: "הכול מרוכז במקום אחד ואנחנו חוזרים ללקוחות הרבה יותר מהר." },
];

/** Thumbnail: a still poster when we have one, otherwise the clip's own frame. */
function Poster({
  poster,
  video,
  alt,
  sizes,
}: {
  poster?: string;
  video: string;
  alt: string;
  sizes: string;
}) {
  if (poster) {
    return (
      <Image
        src={poster}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover object-[center_30%]"
      />
    );
  }
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      src={`${video}#t=1.5`}
      muted
      playsInline
      preload="metadata"
      aria-label={alt}
      className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
    />
  );
}

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
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* TEXT — first child → RIGHT in RTL */}
          <div className="lg:col-span-5">
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
                {t.quote && (
                  <p className="mt-7 max-w-md text-[15px] leading-relaxed text-on-dark/75 md:text-[17px]">
                    {t.quote}
                  </p>
                )}
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
            <div className="flex flex-row-reverse items-center gap-5 sm:gap-6">
              {/* Active — large */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.slug}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[9/16] w-[315px] max-w-full shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-ink"
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
                      <Poster
                        poster={t.posterSrc}
                        video={t.videoSrc}
                        alt={t.name}
                        sizes="(max-width:1024px) 100vw, 40vw"
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
                className="relative hidden aspect-[9/16] w-[205px] shrink-0 overflow-hidden rounded-3xl border border-white/10 opacity-55 transition-all duration-300 hover:opacity-90 sm:block"
              >
                <Poster
                  poster={nextT.posterSrc}
                  video={nextT.videoSrc}
                  alt={nextT.name}
                  sizes="180px"
                />
              </button>
            </div>

          </div>
        </div>

        {/* Carousel controls — full-width bar (image-1 style) */}
        <div className="mt-12 flex items-center gap-5 md:mt-16">
          <div className="flex flex-row-reverse items-center gap-2.5">
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="הבא"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#845EF7] text-white shadow-[0_16px_34px_-12px_rgba(132,94,247,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9A7BF8]"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="הקודם"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-on-dark/80 transition-colors hover:bg-white/10 hover:text-on-dark"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
          <div className="flex flex-1 items-center gap-4 font-mono text-lg tabular-nums">
            <span className="text-on-dark">{String(active + 1).padStart(2, "0")}</span>
            <span className="relative h-px flex-1 overflow-hidden bg-white/20">
              <span
                className="absolute inset-y-0 right-0 bg-[#845EF7] transition-all duration-500"
                style={{ width: `${((active + 1) / total) * 100}%` }}
              />
            </span>
            <span className="text-on-dark/40">{String(total).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
