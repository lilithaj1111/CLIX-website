"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <section
      ref={sectionRef}
      className="divider-draw border-t border-transparent relative overflow-hidden py-24 md:py-32"
    >
      {/* Lime/mint radiant — same atmosphere as the AI Agents service
          card so the home flow has a consistent green undertone. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: [
            "radial-gradient(40% 50% at 25% 30%, color-mix(in srgb, #A3E635 28%, transparent), transparent 70%)",
            "radial-gradient(38% 48% at 75% 60%, color-mix(in srgb, #5EEAD4 24%, transparent), transparent 70%)",
            "radial-gradient(32% 42% at 50% 85%, color-mix(in srgb, #FDE68A 20%, transparent), transparent 70%)",
          ].join(", "),
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 relative z-[1]">
        <div className="grid md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <Reveal>
              <div className="eyebrow">בקולם של הלקוחות שלנו</div>
            </Reveal>
            <CinematicHeading
              as="h2"
              className="mt-5 text-[clamp(2rem,5.2vw,4.6rem)] leading-[0.96] tracking-[-0.03em] font-medium"
            >
              <>
                שמעו את זה{" "}
                <span className="serif-italic text-accent">ישירות</span> מהאנשים
                שהעבודה שלהם השתנתה.
              </>
            </CinematicHeading>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard
              key={t.slug}
              t={t}
              index={i}
              onOpen={() => setOpenIndex(i)}
            />
          ))}
        </div>
      </div>

      <TestimonialLightbox
        testimonial={openIndex !== null ? TESTIMONIALS[openIndex] : null}
        onClose={close}
      />
    </section>
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────── */

function TestimonialCard({
  t,
  index,
  onOpen,
}: {
  t: Testimonial;
  index: number;
  onOpen: () => void;
}) {
  return (
    <Reveal delay={index * 0.08}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`הפעלת עדות של ${t.name}`}
        className="group relative w-full aspect-[9/16] rounded-2xl overflow-hidden grad-border glow-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Image
          src={t.posterSrc}
          alt={t.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        {/* Bottom ink gradient so name is legible regardless of frame */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent"
          style={{
            background:
              "linear-gradient(180deg, transparent 30%, rgba(5,3,9,0.4) 60%, rgba(5,3,9,0.92) 100%)",
          }}
        />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0.85, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full glass grad-border grid place-items-center text-foreground transition-transform duration-300 group-hover:scale-110"
            style={{
              boxShadow:
                "0 12px 32px -10px color-mix(in srgb, var(--accent) 60%, transparent)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-0.5 md:w-6 md:h-6"
              aria-hidden
            >
              <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11.6-6.86a1 1 0 0 0 0-1.74L9.5 4.27A1 1 0 0 0 8 5.14z" />
            </svg>
          </motion.div>
        </div>

        {/* Name + role overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-left">
          <div className="text-white font-medium text-[15px] md:text-base leading-tight tracking-tight">
            {t.name}
          </div>
          <div className="text-white/70 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.18em] mt-1">
            {t.role}
          </div>
        </div>

        {/* Hover accent ring */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow:
              "inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent)",
          }}
        />
      </button>
    </Reveal>
  );
}

/* ─── Lightbox ──────────────────────────────────────────────────────────── */

function TestimonialLightbox({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const isOpen = testimonial !== null;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on ESC + lock page scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {testimonial && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Testimonial · ${testimonial.name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-ink/85 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
        >
          {/* Aurora wash behind */}
          <div
            aria-hidden
            className="absolute inset-0 aurora-bg opacity-40 pointer-events-none"
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="סגירת העדות"
            className="absolute top-5 right-5 md:top-7 md:right-7 z-[2] w-10 h-10 md:w-12 md:h-12 rounded-full glass grad-border grid place-items-center text-foreground hover:bg-accent/20 transition"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>

          {/* Video container — stop click bubbling so the backdrop only closes outside */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full"
            style={{ aspectRatio: "9 / 16", height: "min(85vh, calc(100vw * 16 / 9))" }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden grad-border shadow-2xl">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                key={testimonial.slug}
                src={testimonial.videoSrc}
                poster={testimonial.posterSrc}
                autoPlay
                controls
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full bg-ink object-cover"
              />
            </div>
            <div className="absolute inset-x-0 -bottom-12 md:-bottom-14 text-center">
              <div className="text-white font-medium text-base">{testimonial.name}</div>
              <div className="text-white/70 text-[11px] font-mono uppercase tracking-[0.18em] mt-1">
                {testimonial.role}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
