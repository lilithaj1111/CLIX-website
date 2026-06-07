"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────────
 * Shared cinematic stage primitives for project tile animations.
 *
 * Each project's tile animation uses the same machinery:
 *   - usePhaseCycle: timed phase state machine that loops
 *   - Backdrop / FloatingDust / GroundGlow: ambient layers, tone-aware
 *   - TopChrome / StatusPill / PhaseCaption: corner chrome
 *
 * Animations drop these in, then render their own scenes via AnimatePresence.
 * Northwind was the prototype — see NorthwindAgentAnimation for the exemplar.
 * ──────────────────────────────────────────────────────────────────────── */

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Tone of a tile — drives all overlay/text colors so scenes work on dark,
 *  green, cream, rust backgrounds. Pass via `tone={...}` to all primitives. */
export type Tone = {
  /** Primary accent hex (e.g. "#b8552c"). */
  accent: string;
  /** Soft inkable text color hex (with leading #). */
  ink: string;
  /** Surface color for cards/panels (with leading #). */
  surface: string;
  /** "dark" = light text on dark bg. "light" = dark text on light bg. */
  mode: "dark" | "light";
};

export function inkAlpha(t: Tone, a: number) {
  return `${t.ink}${alphaHex(a)}`;
}
export function accentAlpha(t: Tone, a: number) {
  return `${t.accent}${alphaHex(a)}`;
}
function alphaHex(a: number) {
  const v = Math.max(0, Math.min(255, Math.round(a * 255)));
  return v.toString(16).padStart(2, "0");
}

/* ───────── Phase state machine ───────────────────────────────────────────── */

export function usePhaseCycle<P extends string>(
  phases: readonly P[],
  durations: Record<P, number>,
  restingPhase: P,
) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<P>(phases[0]);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase(restingPhase);
      return;
    }
    const id = window.setTimeout(() => {
      setPhase((p) => {
        const next = phases[(phases.indexOf(p) + 1) % phases.length];
        if (next === phases[0]) setCycle((c) => c + 1);
        return next;
      });
    }, durations[phase]);
    return () => window.clearTimeout(id);
  }, [phase, reduced, phases, durations, restingPhase]);

  return { phase, cycle, reduced: !!reduced };
}

/* ───────── Ambient layers ────────────────────────────────────────────────── */

export function Backdrop({ tone }: { tone: Tone }) {
  const a = (n: number) => accentAlpha(tone, n);
  const i = (n: number) => inkAlpha(tone, n);
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(60% 70% at 25% 30%, ${tone.surface}, transparent 70%),
            radial-gradient(60% 60% at 80% 80%, ${a(0.18)}, transparent 70%),
            radial-gradient(80% 70% at 50% 110%, ${i(0.25)}, transparent 75%)
          `,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.09]"
        style={{
          backgroundImage: `linear-gradient(${i(0.45)} 1px, transparent 1px), linear-gradient(90deg, ${i(0.45)} 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 55%, black 30%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 55%, black 30%, transparent 92%)",
        }}
      />
    </>
  );
}

export function GroundGlow({ tone }: { tone: Tone }) {
  return (
    <div
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[70%] h-[26%] pointer-events-none"
      style={{
        background: `radial-gradient(ellipse at 50% 100%, ${accentAlpha(tone, 0.25)}, transparent 70%)`,
      }}
    />
  );
}

export function FloatingDust({
  tone,
  reduced,
  count = 26,
}: {
  tone: Tone;
  reduced: boolean;
  count?: number;
}) {
  if (reduced) return null;
  const dots = Array.from({ length: count }, (_, i) => i);
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {dots.map((i) => {
        const left = (i * 37) % 100;
        const top = (i * 53 + 20) % 80;
        const delay = (i * 0.6) % 6;
        const dur = 5 + (i % 5);
        // Varied dot sizes + horizontal drift so the field feels alive.
        const sizeBucket = i % 3;
        const size = sizeBucket === 0 ? 4 : sizeBucket === 1 ? 6 : 9;
        const driftX = ((i * 13) % 18) - 9;
        const yLift = 18 + (i % 6) * 3;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: tone.accent,
              opacity: 0.16,
              boxShadow: `0 0 ${size}px ${accentAlpha(tone, 0.5)}`,
            }}
            animate={{
              x: [0, driftX, 0],
              y: [0, -yLift, 0],
              opacity: [0.1, 0.32, 0.1],
              scale: [0.9, 1.15, 0.9],
            }}
            transition={{
              duration: dur,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

/* ───────── Parallax sweep lines — slow horizontal flow across the stage ── */

export function ParallaxLines({
  tone,
  reduced,
  count = 4,
}: {
  tone: Tone;
  reduced: boolean;
  count?: number;
}) {
  if (reduced) return null;
  const lines = Array.from({ length: count }, (_, i) => i);
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {lines.map((i) => {
        const top = 12 + i * 18 + ((i * 7) % 6);
        const dur = 14 + (i % 4) * 3;
        const opacity = 0.05 + (i % 2) * 0.05;
        return (
          <motion.span
            key={i}
            className="absolute h-px"
            style={{
              left: 0,
              right: 0,
              top: `${top}%`,
              background: `linear-gradient(90deg, transparent, ${accentAlpha(tone, 0.4)}, transparent)`,
              opacity,
            }}
            animate={{ x: ["-30%", "30%", "-30%"] }}
            transition={{ duration: dur, delay: i * 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
    </div>
  );
}

/* ───────── SparkBurst — short-lived radial spark fan from a point ──── */

export function SparkBurst({
  tone,
  reduced,
  x = 50,
  y = 50,
  count = 8,
  trigger,
}: {
  tone: Tone;
  reduced: boolean;
  /** Position in % of the stage (0–100). */
  x?: number;
  y?: number;
  count?: number;
  /** Re-mount key — change this value to re-fire the burst. */
  trigger: string | number;
}) {
  if (reduced) return null;
  const sparks = Array.from({ length: count }, (_, i) => i);
  return (
    <div
      key={trigger}
      aria-hidden
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      {sparks.map((i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = 22 + (i % 3) * 6;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        return (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: 0,
              top: 0,
              background: tone.accent,
              boxShadow: `0 0 6px ${accentAlpha(tone, 0.7)}`,
            }}
            initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.9 + (i % 3) * 0.15, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

/* ───────── EnergyBeam — animated dashed line between two stage points ─── */

export function EnergyBeam({
  tone,
  reduced,
  from,
  to,
  /** Stroke width in viewBox units (0–100). */
  width = 0.6,
}: {
  tone: Tone;
  reduced: boolean;
  from: { x: number; y: number };
  to: { x: number; y: number };
  width?: number;
}) {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={accentAlpha(tone, 0.35)}
        strokeWidth={width}
        strokeDasharray="1.4 1.2"
      />
      {!reduced && (
        <motion.line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={tone.accent}
          strokeWidth={width + 0.2}
          strokeLinecap="round"
          strokeDasharray="0.8 12"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -16 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
      )}
    </svg>
  );
}

/* ───────── Chrome (eyebrow + status + caption) ───────────────────────────── */

export function TopChrome({
  eyebrow,
  statusLabel,
  tone,
  reduced,
}: {
  eyebrow: string;
  statusLabel: string;
  tone: Tone;
  reduced: boolean;
}) {
  return (
    <>
      <div className="absolute top-5 left-5 sm:top-7 sm:left-8 z-10 flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: tone.accent,
            boxShadow: `0 0 10px ${accentAlpha(tone, 0.7)}`,
          }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: inkAlpha(tone, 0.7) }}
        >
          {eyebrow}
        </span>
      </div>
      <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-10">
        <StatusPill label={statusLabel} tone={tone} reduced={reduced} />
      </div>
    </>
  );
}

export function StatusPill({
  label,
  tone,
  reduced,
}: {
  label: string;
  tone: Tone;
  reduced: boolean;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full font-mono text-[9.5px] uppercase tracking-[0.2em] whitespace-nowrap"
      style={{
        background: tone.mode === "dark" ? inkAlpha(tone, 0.15) : `${tone.surface}cc`,
        color: inkAlpha(tone, 0.8),
        border: `1px solid ${inkAlpha(tone, 0.18)}`,
        backdropFilter: "blur(6px)",
      }}
    >
      <span className="relative inline-flex">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: tone.accent }}
        />
        {!reduced && (
          <span
            className="absolute inset-0 w-1.5 h-1.5 rounded-full animate-ping"
            style={{ background: tone.accent }}
          />
        )}
      </span>
      {label}
    </div>
  );
}

export function PhaseCaption({
  caption,
  tone,
}: {
  caption: string;
  tone: Tone;
}) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-12 sm:bottom-14 z-10 w-[280px] sm:w-[460px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={caption}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-center whitespace-nowrap"
          style={{ color: inkAlpha(tone, 0.75) }}
        >
          {caption}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ───────── All-in-one wrapper ────────────────────────────────────────────── */

export function CinematicTile({
  tone,
  eyebrow,
  statusLabel,
  caption,
  reduced,
  children,
  className = "",
}: {
  tone: Tone;
  eyebrow: string;
  statusLabel: string;
  caption: string;
  reduced: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <Backdrop tone={tone} />
      <ParallaxLines tone={tone} reduced={reduced} />
      <FloatingDust tone={tone} reduced={reduced} />
      <GroundGlow tone={tone} />
      <TopChrome
        eyebrow={eyebrow}
        statusLabel={statusLabel}
        tone={tone}
        reduced={reduced}
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1400px" }}
      >
        <AnimatePresence>{children}</AnimatePresence>
      </div>
      <PhaseCaption caption={caption} tone={tone} />
    </div>
  );
}
