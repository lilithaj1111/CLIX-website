"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

import { CinematicHeading } from "./CinematicHeading";
import { LogoMark } from "./LogoMark";
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";
import { TOOLS, type Tool } from "@/lib/tool-icons";

/**
 * Integrations section — a scattered "polaroid" collage of every tool we
 * orchestrate, anchored by a centered focal block (Clix mark + headline +
 * CTAs). Each card floats on its own gentle loop with a different phase and
 * tilt, mounts in from an offscreen position when it scrolls into view, and
 * straightens + lifts under the cursor.
 */
export function IntegrationsSection() {
  return (
    <section className="relative border-t border-line py-16 md:py-32 overflow-hidden divider-draw">
      <div aria-hidden className="absolute inset-0 z-0 aurora-bg-tr opacity-55" />

      {/* Lime/mint radiant — distributed across BOTH sides so the green
          undertone reads on the right tool cards as well as the left. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(40% 50% at 20% 30%, color-mix(in srgb, #A3E635 30%, transparent), transparent 70%)",
            "radial-gradient(40% 50% at 80% 30%, color-mix(in srgb, #A3E635 28%, transparent), transparent 70%)",
            "radial-gradient(38% 48% at 50% 65%, color-mix(in srgb, #5EEAD4 26%, transparent), transparent 70%)",
            "radial-gradient(34% 44% at 88% 75%, color-mix(in srgb, #5EEAD4 26%, transparent), transparent 70%)",
            "radial-gradient(32% 42% at 30% 88%, color-mix(in srgb, #FDE68A 22%, transparent), transparent 70%)",
          ].join(", "),
        }}
      />

      {/* Soft warm-purple wash directly behind the focal block. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(40% 55% at 50% 50%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1320px] px-6 lg:px-10">
        <CollageStage />
      </div>
    </section>
  );
}

/* ─── Layout ──────────────────────────────────────────────────────────── */

type Slot = {
  /** Card position as a percentage of the stage. (0-100) */
  x: number;
  y: number;
  /** Idle rotation in degrees. */
  rot: number;
  /** Card size multiplier; some cards read closer/farther. */
  scale: number;
  /** Float-cycle duration (s). */
  dur: number;
  /** Float-cycle phase offset (s). */
  delay: number;
  /** Float-cycle vertical amplitude (px). */
  amp: number;
  /** Z-layer so we can stack cards intentionally. */
  z: number;
};

/**
 * Hand-placed positions for 12 cards: six on the left, six on the right,
 * none crossing the centered text column. The percentages are stage-relative
 * (the stage is the wrapper that surrounds the entire collage), so the
 * composition scales gracefully with viewport width. A handful of cards sit
 * close to the edges with a slight outward tilt so they read as "clipped
 * out of frame" like in the reference.
 */
const SLOTS: Slot[] = [
  // ── Left column ──
  { x: 4,  y: 12, rot: -6, scale: 0.92, dur: 9.5,  delay: 0,    amp: 8,  z: 2 }, // top-left
  { x: 16, y: 26, rot: 3,  scale: 1,    dur: 11,   delay: 1.2,  amp: 10, z: 3 }, // upper-mid
  { x: 3,  y: 44, rot: -3, scale: 0.96, dur: 10,   delay: 2.4,  amp: 9,  z: 2 }, // middle, edge-clipped
  { x: 18, y: 60, rot: -5, scale: 1.04, dur: 12,   delay: 0.6,  amp: 11, z: 4 }, // middle
  { x: 6,  y: 76, rot: 4,  scale: 0.94, dur: 9,    delay: 3,    amp: 8,  z: 2 }, // lower-mid
  { x: 18, y: 88, rot: -4, scale: 0.98, dur: 10.5, delay: 1.8,  amp: 9,  z: 3 }, // bottom
  // ── Right column ──
  { x: 78, y: 12, rot: 4,  scale: 0.97, dur: 10,   delay: 0.4,  amp: 9,  z: 2 }, // top-right
  { x: 90, y: 26, rot: -3, scale: 0.93, dur: 9,    delay: 2.8,  amp: 8,  z: 2 }, // upper-right, edge-clipped
  { x: 78, y: 44, rot: 6,  scale: 1.05, dur: 12.5, delay: 1.4,  amp: 11, z: 4 }, // middle
  { x: 90, y: 60, rot: -5, scale: 0.96, dur: 10,   delay: 3.2,  amp: 9,  z: 2 }, // middle-lower
  { x: 76, y: 78, rot: 3,  scale: 1.02, dur: 11,   delay: 0.9,  amp: 10, z: 3 }, // lower-mid
  { x: 86, y: 90, rot: -4, scale: 0.94, dur: 9.5,  delay: 2.1,  amp: 8,  z: 2 }, // bottom-right
];

function CollageStage() {
  // Stable mapping of tool index → slot. We re-use the SLOTS in declaration
  // order so the layout stays predictable across renders.
  const placedTools = useMemo(
    () => TOOLS.map((tool, i) => ({ tool, slot: SLOTS[i % SLOTS.length] })),
    [],
  );

  return (
    <div className="relative w-full md:min-h-[760px] lg:min-h-[820px]">
      {/* Scattered tool cards — absolute-positioned in stage coordinates so
          they layer behind the central focal block. Hidden on the smallest
          viewports where they'd crash into the text. */}
      <div aria-hidden className="hidden md:block absolute inset-0">
        {placedTools.map(({ tool, slot }, i) => (
          <ToolCard key={tool.id} tool={tool} slot={slot} delay={0.05 + i * 0.04} />
        ))}
      </div>

      {/* Focal block — centered text + CTAs, with the Clix mark icon-tile
          floating just above the headline. */}
      <FocalBlock />

      {/* Mobile-only horizontal carousel — the scattered layout doesn't fit
          under 768px, so we offer a tidy scrollable strip instead. */}
      <MobileToolStrip />
    </div>
  );
}

/* ─── Focal block ─────────────────────────────────────────────────────── */

function FocalBlock() {
  return (
    <div className="relative z-[5] mx-auto max-w-xl text-center px-6 py-10 md:py-24">
      <Reveal>
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-paper text-ink shadow-[0_18px_40px_-14px_color-mix(in_srgb,var(--accent)_55%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_18%,transparent)]"
        >
          {/* Soft accent halo behind the icon tile. */}
          <span
            aria-hidden
            className="absolute inset-[-30%] rounded-full blur-2xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent) 0%, transparent 65%)",
            }}
          />
          <LogoMark size={36} className="md:!w-[44px] md:!h-[44px]" />
        </motion.div>
      </Reveal>

      <Reveal delay={0.05} className="mt-4">
        <div className="eyebrow justify-center">
          <span>02 · הסטאק</span>
        </div>
      </Reveal>

      <CinematicHeading
        as="h2"
        className="mt-5 text-[clamp(2.4rem,5.2vw,4.4rem)] leading-[1.02] tracking-[-0.03em] font-medium"
      >
        <>
          כל הכלים שאתם משתמשים בהם{" "}
          <span className="serif-italic text-accent">
            מזינים מוח אחד.
          </span>
        </>
      </CinematicHeading>

      <Reveal delay={0.25} className="mt-8">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 max-w-[260px] sm:max-w-none mx-auto">
          <MagneticButton
            href="/contact"
            wrapperClassName="w-full sm:w-auto"
            className="btn-shine btn-violet inline-flex items-center justify-center gap-2 text-sm ps-5 pe-1.5 py-1.5 rounded-full font-medium w-full sm:w-auto"
          >
            בואו נתחיל
            <span className="inline-flex w-6 h-6 rounded-full bg-ink/40 text-paper items-center justify-center backdrop-blur-sm">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 9L9 1M9 1H3M9 1V7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </MagneticButton>
          <Link
            href="/services"
            className="inline-flex items-center justify-center text-sm px-5 py-2 rounded-full border border-foreground/25 hover:border-accent hover:text-accent transition-colors w-full sm:w-auto"
          >
            לכל היכולות שלנו ←
          </Link>
        </div>
      </Reveal>

    </div>
  );
}

/* ─── Single tool card ────────────────────────────────────────────────── */

type ToolCardProps = {
  tool: Tool;
  slot: Slot;
  /** Entrance delay (applied to the scroll-in motion). */
  delay: number;
};

function ToolCard({ tool, slot, delay }: ToolCardProps) {
  const reduced = useReducedMotion();
  const { brand, name } = tool;

  // Cards on the left fly in from the left, right from the right — feels
  // like they're being placed by hand into frame.
  const fromLeft = slot.x < 50;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        zIndex: slot.z,
        transform: "translate(-50%, -50%)",
      }}
      initial={{
        opacity: 0,
        x: fromLeft ? -60 : 60,
        y: 20,
        rotate: slot.rot - (fromLeft ? 6 : -6),
        scale: slot.scale * 0.82,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        rotate: slot.rot,
        scale: slot.scale,
      }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {/* Idle float wrapper — gentle Y oscillation + tiny tilt sway. Each
          card has its own duration/phase so the collage breathes organically
          rather than marching in unison. */}
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                y: [0, -slot.amp, 0, slot.amp * 0.6, 0],
                rotate: [slot.rot, slot.rot + 1.2, slot.rot, slot.rot - 1.2, slot.rot],
              }
        }
        transition={{
          duration: slot.dur,
          delay: slot.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          y: -16,
          rotate: 0,
          scale: 1.12,
          transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        }}
        className="group relative"
      >
        <PolaroidCard tool={tool} />

        {/* Enhanced brand-tint halo on hover — stronger and more prominent */}
        <span
          aria-hidden
          className="absolute -inset-4 rounded-[24px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
          style={{
            background: `radial-gradient(circle, ${brand}50 0%, ${brand}28 35%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />
      </motion.div>

      <span className="sr-only">{name}</span>
    </motion.div>
  );
}

/* ─── Polaroid presentation ───────────────────────────────────────────── */

function PolaroidCard({ tool }: { tool: Tool }) {
  const { Icon, brand, name } = tool;
  return (
    <div
      className="relative w-[120px] md:w-[140px] lg:w-[156px] rounded-[20px] overflow-hidden"
      style={{
        background: "var(--paper)",
        boxShadow:
          "0 24px 48px -20px color-mix(in srgb, var(--ink) 32%, transparent), " +
          "0 8px 24px -10px color-mix(in srgb, var(--accent) 28%, transparent), " +
          "inset 0 0 0 1px color-mix(in srgb, var(--line-strong) 45%, transparent)",
      }}
    >
      {/* Faux "photo" frame — a brand-tinted gradient that fills most of
          the card, with the brand icon centered on it. Reads as the
          subject of the polaroid. */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: "1 / 1",
          background: `linear-gradient(155deg, ${brand}28 0%, color-mix(in srgb, ${brand} 16%, var(--paper)) 60%, var(--paper) 100%)`,
        }}
      >
        {/* Grid noise behind the icon — adds the "tech texture" feel that
            differentiates this from the reference's people-photo cards. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(124,58,168,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,168,0.09) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            maskImage:
              "radial-gradient(circle at 50% 50%, black 35%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, black 35%, transparent 75%)",
          }}
        />
        {/* Brand icon — sits inside an inner ghost tile with improved styling */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-[60%] aspect-square rounded-[14px] flex items-center justify-center transition-all duration-300"
            style={{
              background: "color-mix(in srgb, var(--paper) 94%, transparent)",
              boxShadow:
                "inset 0 0 0 1.5px color-mix(in srgb, var(--line-strong) 42%, transparent), " +
                "0 6px 16px -8px rgba(0,0,0,0.22), " +
                `0 0 20px -10px ${brand}40`,
              color: brand,
            }}
          >
            {/* Enhanced brand halo behind icon */}
            <span
              aria-hidden
              className="absolute inset-[-28%] rounded-full blur-lg pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${brand}60 0%, transparent 65%)`,
                opacity: 0.75,
              }}
            />
            <div className="relative w-[58%] h-[58%]">
              <Icon />
            </div>
          </div>
        </div>
      </div>

      {/* Polaroid name strip — improved typography and spacing */}
      <div className="px-3.5 py-3 flex flex-col items-start gap-1">
        <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
          Tool · 01
        </div>
        <div className="text-[13px] md:text-[14px] font-medium tracking-tight text-foreground truncate w-full leading-snug">
          {name}
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile fallback — horizontal scroll strip ───────────────────────── */

function MobileToolStrip() {
  return (
    <div className="md:hidden mt-6 relative">
      {/* Eyebrow label so the strip reads as intentional rather than overflow. */}
      <div className="px-6 mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
          The stack · {TOOLS.length} tools
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
          swipe →
        </span>
      </div>

      {/* Edge fades — gradient masks indicate the strip continues
          beyond the visible viewport. */}
      <div
        aria-hidden
        className="absolute left-0 top-8 bottom-0 w-8 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, var(--bg) 0%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute right-0 top-8 bottom-0 w-8 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(270deg, var(--bg) 0%, transparent 100%)",
        }}
      />

      <div className="-mx-6">
        <div
          className="flex gap-3 overflow-x-auto px-6 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="snap-start shrink-0"
            >
              <PolaroidCard tool={tool} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
