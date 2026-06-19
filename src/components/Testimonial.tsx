"use client";

import Image from "next/image";
import { useState } from "react";
import { Play, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { useInViewAttr } from "@/lib/useInViewAttr";
import { CinematicHeading } from "./CinematicHeading";

type Testimonial = {
  slug: string;
  name: string;
  role: string;
  videoSrc: string;
  posterSrc: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    slug: "asaf-peretz",
    name: "אסף פרץ",
    role: "מייסד · SalesIQ",
    videoSrc: "/testimonials/asaf-peretz.mp4",
    posterSrc: "/testimonials/asaf-peretz.jpg",
  },
  {
    slug: "adir-peretz",
    name: "אדיר פרץ",
    role: "בעלים · סטודיו וידאו וצילום",
    videoSrc: "/testimonials/adir-peretz.mp4",
    posterSrc: "/testimonials/adir-peretz.jpg",
  },
  {
    slug: "nevo-yahaloman",
    name: "נבו יהלומן",
    role: "מייסד",
    videoSrc: "/testimonials/nevo-yahaloman.mp4",
    posterSrc: "/testimonials/nevo-yahaloman.jpg",
  },
  {
    slug: "noam-tovi",
    name: "נועם תובי",
    role: "בעלים · השקעות",
    videoSrc: "/testimonials/noam-tovi.mp4",
    posterSrc: "/testimonials/noam-tovi.jpg",
  },
];

export function Testimonial() {
  const sectionRef = useInViewAttr<HTMLElement>();
  // Single active inline video at a time — clicking another card swaps it, so
  // the others are never blocked (no full-screen modal).
  const [playingSlug, setPlayingSlug] = useState<string | null>(null);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-line bg-background py-24 md:py-32"
    >
      <div className="relative z-[1] mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-12 grid items-end gap-8 md:mb-16 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reveal>
              <div className="eyebrow">בקולם של הלקוחות שלנו</div>
            </Reveal>
            <CinematicHeading
              as="h2"
              className="mt-5 text-[clamp(2rem,5.2vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.035em] text-ink"
            >
              <>
                שמעו את זה{" "}
                <span className="font-semibold text-accent">ישירות</span> מהאנשים
                שהעבודה שלהם השתנתה.
              </>
            </CinematicHeading>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard
              key={t.slug}
              t={t}
              index={i}
              playing={playingSlug === t.slug}
              onPlay={() => setPlayingSlug(t.slug)}
              onStop={() => setPlayingSlug(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Card — portrait video on top, solid name panel below ──────────────── */

function TestimonialCard({
  t,
  index,
  playing,
  onPlay,
  onStop,
}: {
  t: Testimonial;
  index: number;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  return (
    <Reveal delay={index * 0.08}>
      <div
        className={`group relative flex h-full w-full flex-col overflow-hidden rounded-xl text-right transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-2 hover:scale-[1.02] ${
          playing
            ? "border border-transparent bg-transparent shadow-none"
            : "border border-white/10 bg-[#222C36] shadow-[0_18px_44px_-26px_rgba(20,26,32,0.55)] hover:border-white/25 hover:shadow-[0_34px_70px_-24px_rgba(20,26,32,0.6)] focus-within:border-white/25"
        }`}
      >
        {/* Media — portrait video; the face shows fully (no veil). */}
        <div className="relative aspect-[4/5] overflow-hidden bg-ink">
          {playing ? (
            <>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src={t.videoSrc}
                poster={t.posterSrc}
                autoPlay
                controls
                playsInline
                preload="metadata"
                onEnded={onStop}
                className="absolute inset-0 h-full w-full bg-ink object-cover"
              />
              {/* Dismiss — returns this card to its poster */}
              <button
                type="button"
                onClick={onStop}
                aria-label="עצירת הסרטון"
                className="absolute left-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onPlay}
              aria-label={`הפעלת עדות של ${t.name}`}
              className="absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8CA0B3]"
            >
              <Image
                src={t.posterSrc}
                alt={t.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Play badge — small, top corner, never covers the face */}
              <span className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Play className="ms-0.5 h-4 w-4" fill="currentColor" strokeWidth={0} />
              </span>
            </button>
          )}
        </div>

        {/* Solid name panel — sits entirely below the video. mt-auto drops the
            row low; the name/role and arrow share one row (text right, arrow
            left, vertically aligned). */}
        <div className="flex flex-1 flex-col px-5 pt-3.75 pb-2 md:px-6">
          {!playing && (
            <div className="mt-auto">
              <h3 className="text-[14px] font-bold leading-snug tracking-[-0.01em] text-on-dark md:text-[15px]">
                {t.name}
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-on-dark/55">
                {t.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}
