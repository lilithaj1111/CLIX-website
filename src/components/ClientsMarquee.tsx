"use client";

import Image from "next/image";
import { InfiniteSlider } from "./ui/infinite-slider";
import { ProgressiveBlur } from "./ui/progressive-blur";

/* ────────────────────────────────────────────────────────────────────────────
 * ClientsMarquee — compact "trusted by" strip placed right after the hero.
 *
 *   Left   : a short call-out line ("Operators shipping with Clix") with
 *            a divider rule on `lg+` viewports.
 *   Right  : `InfiniteSlider` of client logos (real assets from
 *            /public/clients), edge-faded with `ProgressiveBlur` so the
 *            scroll dissolves into the page background — no hard horizon.
 *
 * Logos are rendered in a desaturated, low-opacity grayscale by default
 * so they read as a unified strip in the sage/teal palette; on hover the
 * full client logo opacity returns.
 * ──────────────────────────────────────────────────────────────────────── */

const CLIENTS = [
  { src: "/clients/client-18x.png", alt: "18X", h: 24 },
  { src: "/clients/client-admaker.png", alt: "adMaker", h: 20 },
  { src: "/clients/client-coral.png", alt: "Coral", h: 24 },
  { src: "/clients/client-dagi.png", alt: "Dagi", h: 24 },
  { src: "/clients/client-diamond.png", alt: "Diamond", h: 24 },
  { src: "/clients/client-mafteach.png", alt: "Mafteach", h: 22 },
  { src: "/clients/client-mylo.png", alt: "Mylo", h: 22 },
  { src: "/clients/client-puzzle.png", alt: "Puzzle", h: 24 },
  { src: "/clients/client-theranote.png", alt: "Theranote", h: 22 },
  { src: "/clients/client-tzmicha.png", alt: "Tzmicha", h: 24 },
  { src: "/clients/client-video.png", alt: "Video", h: 24 },
];

export function ClientsMarquee() {
  return (
    <section className="relative border-t border-line bg-bg-warm/40 py-12 md:py-16 overflow-hidden">
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="group flex flex-col gap-6 md:flex-row md:items-center">
          {/* Left — call-out */}
          <div className="md:max-w-[200px] md:shrink-0 md:border-r md:border-line md:pr-8">
            <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-foreground/55 md:text-end">
              Operators shipping with Clix
            </p>
          </div>

          {/* Right — infinite logo strip */}
          <div className="relative flex-1 min-w-0">
            <InfiniteSlider speed={42} speedOnHover={22} gap={88}>
              {CLIENTS.map((c) => (
                <div
                  key={c.src}
                  className="flex items-center justify-center opacity-65 hover:opacity-100 transition-opacity duration-300"
                  style={{ height: c.h, filter: "grayscale(1) contrast(1.05)" }}
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    width={140}
                    height={c.h}
                    className="h-full w-auto object-contain"
                  />
                </div>
              ))}
            </InfiniteSlider>

            {/* Hard edge fades from page bg — sit under the progressive blur
                so the marquee dissolves into the surface even on browsers
                without backdrop-filter support. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-24"
              style={{
                background:
                  "linear-gradient(90deg, var(--bg-warm) 0%, color-mix(in srgb, var(--bg-warm) 60%, transparent) 60%, transparent 100%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-24"
              style={{
                background:
                  "linear-gradient(-90deg, var(--bg-warm) 0%, color-mix(in srgb, var(--bg-warm) 60%, transparent) 60%, transparent 100%)",
              }}
            />

            {/* Progressive blur overlays for premium polish */}
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-24"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-24"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
