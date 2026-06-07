"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useInViewAttr } from "@/lib/useInViewAttr";
import { allClients, type Client } from "@/lib/clients";
import { Reveal } from "./Reveal";
import { CinematicHeading } from "./CinematicHeading";

/** Continuous-advance speed in "cards per second". 0.6 ≈ one card
 *  centered every 1.65s, but the arc never stops — phase is a float
 *  driven by requestAnimationFrame and slot positions interpolate
 *  smoothly between integer offsets. */
const PHASE_SPEED = 0.6;

/**
 * Client showcase — a centered fanned arc of brand cards that auto-cycles
 * every few seconds. The center card is the "featured" brand; its name,
 * since, industry and blurb cross-fade in beneath the arc as the arc
 * advances. ±1 and ±2 slots are fanned outward at increasing tilt and
 * reduced scale, like a hand of cards held just below the eyeline. Click
 * any card to jump to it; otherwise the arc cycles continuously.
 */
export function ClientShowcase() {
  const sectionRef = useInViewAttr<HTMLElement>();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  // Continuous phase advance via rAF — the arc never settles between
  // cards; positions interpolate every frame. Doesn't pause on hover
  // so cursor / touch never freezes the motion.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPhase((p) => (p + dt * PHASE_SPEED) % allClients.length);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const activeIdx =
    ((Math.round(phase) % allClients.length) + allClients.length) %
    allClients.length;
  const active = allClients[activeIdx];

  const jumpTo = useCallback((i: number) => {
    setPhase(i);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-line py-20 md:py-28 overflow-hidden divider-draw"
    >
      <div
        aria-hidden
        className="absolute inset-0 z-0 aurora-bg-bc opacity-55 pointer-events-none"
      />

      {/* Atmospheric backdrop — dots + orbs + particles span the entire
          section (headline + arc + featured detail), not just the arc. */}
      <AtmosphericBackdrop />

      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 relative z-[1]">
        {/* Heading */}
        <div className="grid md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <Reveal>
              <div className="eyebrow">
                <span>03 · Trusted partnerships</span>
              </div>
            </Reveal>
            <CinematicHeading
              as="h2"
              className="mt-5 text-[clamp(2rem,5.4vw,4.8rem)] leading-[0.96] tracking-[-0.03em] font-medium"
            >
              <>
                Operators who trust us to ship —{" "}
                <span className="serif-italic text-accent">and stay.</span>
              </>
            </CinematicHeading>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={0.15}>
              <p className="text-[15px] md:text-base text-foreground/75 leading-relaxed">
                We earn it by shipping fast. We keep it by staying close.{" "}
                {allClients.length} partnerships across real estate, finance,
                healthcare and ecommerce — most past their second year, because
                the systems we build evolve with the businesses that run them.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Stable live region for screen readers — announces the active client
            as the auto-cycle advances. Visually hidden. */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Now featuring {active.name}, {activeIdx + 1} of {allClients.length}
        </div>

        {/* Fanned arc + featured detail. The arc cycles continuously
            and never pauses — cursor/touch interactions don't stop it. */}
        <div>
          <FannedArc
            clients={allClients}
            phase={phase}
            onJump={jumpTo}
          />

          <FeaturedDetail
            active={active}
            activeIdx={activeIdx}
            total={allClients.length}
            reduced={!!reduced}
          />
        </div>

      </div>
    </section>
  );
}

/* ─── Fanned arc ──────────────────────────────────────────────────────── */

type Slot = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

// Cards within ±2 of the active index are visible in the arc; ±3 is the
// transition buffer (entering/leaving). Anything beyond is hidden far
// off-stage so Framer can animate it in/out smoothly. Spacing is wide
// enough that ±1 cards don't crowd the highlighted center.
const SLOTS: Record<number, Slot> = {
  [-3]: { x: -520, y: 0, rotate: 0, scale: 0.6,  opacity: 0,    zIndex: 0 },
  [-2]: { x: -340, y: 0, rotate: 0, scale: 0.78, opacity: 0.5,  zIndex: 1 },
  [-1]: { x: -175, y: 0, rotate: 0, scale: 0.92, opacity: 0.85, zIndex: 2 },
  [0]:  { x: 0,    y: 0, rotate: 0, scale: 1.08, opacity: 1,    zIndex: 5 },
  [1]:  { x: 175,  y: 0, rotate: 0, scale: 0.92, opacity: 0.85, zIndex: 2 },
  [2]:  { x: 340,  y: 0, rotate: 0, scale: 0.78, opacity: 0.5,  zIndex: 1 },
  [3]:  { x: 520,  y: 0, rotate: 0, scale: 0.6,  opacity: 0,    zIndex: 0 },
};

function offsetOf(i: number, phase: number, n: number): number {
  let off = i - phase;
  // Snap to nearest cyclic distance so cards take the shorter path around
  // the ring when the phase wraps.
  while (off > n / 2) off -= n;
  while (off < -n / 2) off += n;
  return off;
}

/** Slot for a continuous (float) offset. Linearly interpolates between
 *  the discrete SLOTS entries so the arc moves smoothly through every
 *  intermediate position. Beyond ±3 we extend along the same direction. */
function slotForOffset(offset: number): Slot {
  if (offset <= -3) {
    return { ...SLOTS[-3], x: -520 - (Math.abs(offset) - 3) * 60 };
  }
  if (offset >= 3) {
    return { ...SLOTS[3], x: 520 + (offset - 3) * 60 };
  }
  const lower = Math.floor(offset);
  const upper = Math.ceil(offset);
  if (lower === upper) return SLOTS[lower];
  const t = offset - lower;
  const a = SLOTS[lower];
  const b = SLOTS[upper];
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    rotate: a.rotate + (b.rotate - a.rotate) * t,
    scale: a.scale + (b.scale - a.scale) * t,
    opacity: a.opacity + (b.opacity - a.opacity) * t,
    zIndex: Math.round(a.zIndex + (b.zIndex - a.zIndex) * t),
  };
}

function FannedArc({
  clients,
  phase,
  onJump,
}: {
  clients: Client[];
  phase: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="relative w-full">
      {/* Circuit traces fanning out from the arc's focal point — kept
          local to the arc since their geometry is anchored to the
          center card. The dot pattern + orbs + particles live at the
          section level so they cover the whole section. */}
      <CircuitTraces />

      {/* Soft accent glow behind the center card — breathes scale +
          opacity continuously so the focal area is never still. */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[300px] pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 32%, transparent) 0%, transparent 65%)",
          filter: "blur(32px)",
        }}
        animate={{
          scale: [1, 1.08, 0.96, 1.04, 1],
          opacity: [0.7, 1, 0.75, 0.95, 0.7],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Slow drift on the entire arc — barely perceptible per frame,
          but the arc is never visually static between auto-advances. */}
      <motion.div
        className="relative z-[2] mx-auto h-[280px] sm:h-[320px] md:h-[360px] flex items-center justify-center origin-center scale-[0.55] sm:scale-[0.72] md:scale-100"
        animate={{
          x: [0, 8, -6, 4, 0],
          y: [0, -4, 3, -2, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {clients.map((client, i) => {
          const offset = offsetOf(i, phase, clients.length);
          const slot = slotForOffset(offset);
          // Card within ±0.5 of phase is the "current" focal card.
          const isCenter = Math.abs(offset) < 0.5;
          // Per-card idle float — phase varies by index so neighbors
          // never bob in sync.
          const floatPhase = i * 0.4;
          const floatAmp = isCenter ? 7 : 5;
          const tiltAmp = isCenter ? 0.6 : 0.4;
          const floatDur = 3.6 + (i % 4) * 0.5;
          return (
            <button
              key={client.slug}
              type="button"
              onClick={() => onJump(i)}
              aria-label={`Show ${client.name}`}
              aria-pressed={isCenter}
              className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
              style={{
                // Drive position/scale/opacity directly from the
                // interpolated slot every frame — no framer transition
                // smoothing, so the motion is truly continuous (the rAF
                // phase update is the only timing source).
                transform: `translate3d(${slot.x}px, ${slot.y}px, 0) rotate(${slot.rotate}deg) scale(${slot.scale})`,
                opacity: slot.opacity,
                zIndex: slot.zIndex,
                willChange: "transform, opacity",
                pointerEvents: Math.abs(offset) > 2 ? "none" : "auto",
              }}
            >
              {/* Inner wrapper carries the per-card continuous idle
                  float so it doesn't conflict with the outer slot
                  transition. Different phase per card, slightly
                  stronger amplitude on the center card. */}
              <motion.div
                animate={{
                  y: [0, -floatAmp, 0, floatAmp * 0.6, 0],
                  rotate: [-tiltAmp, tiltAmp * 0.6, -tiltAmp * 0.3, tiltAmp, -tiltAmp],
                }}
                transition={{
                  duration: floatDur,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: floatPhase,
                }}
                style={{ willChange: "transform" }}
              >
                <BrandCard client={client} highlighted={isCenter} />
              </motion.div>
            </button>
          );
        })}
      </motion.div>

      {/* Faint ground-line under the arc — base for the cards to rest on. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[78%] -translate-x-1/2 w-[80%] max-w-[640px] h-px pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent) 35%, transparent) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ─── Atmospheric backdrop ────────────────────────────────────────────── */

/**
 * Cinematic ambient layer behind the fanned arc. Drops the rigid HUD
 * vocabulary (blueprint grid, corner brackets, crosshair) in favor of
 * a soft dot pattern + slowly-drifting accent orbs + floating particle
 * sparks. Circuit traces are kept — their traveling pulses are the
 * good kind of tech detail.
 */
function AtmosphericBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Soft accent dot pattern — replaces the harder blueprint grid. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 24%, transparent) 1px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 75% 80% at 50% 50%, black 25%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 80% at 50% 50%, black 25%, transparent 90%)",
        }}
      />

      {/* Slow-floating accent orbs — soft purple "weather" behind the arc. */}
      <FloatingOrb
        size={440}
        left="3%"
        top="18%"
        color="var(--accent)"
        alpha={0.2}
        delta={[40, -30]}
        duration={22}
      />
      <FloatingOrb
        size={380}
        left="84%"
        top="55%"
        color="var(--accent)"
        alpha={0.16}
        delta={[-45, 30]}
        duration={26}
        delay={3}
      />
      <FloatingOrb
        size={300}
        left="56%"
        top="8%"
        color="var(--accent-deep)"
        alpha={0.14}
        delta={[25, 35]}
        duration={20}
        delay={6}
      />
      <FloatingOrb
        size={360}
        left="14%"
        top="78%"
        color="var(--accent)"
        alpha={0.15}
        delta={[35, -28]}
        duration={24}
        delay={4}
      />

      {/* Scattered floating particle sparks for atmospheric depth. */}
      <AmbientParticles />
    </div>
  );
}

function FloatingOrb({
  size,
  left,
  top,
  color,
  alpha,
  delta,
  duration,
  delay = 0,
}: {
  size: number;
  left: string;
  top: string;
  color: string;
  alpha: number;
  delta: [number, number];
  duration: number;
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left,
        top,
        background: `radial-gradient(circle, color-mix(in srgb, ${color} ${alpha * 100}%, transparent), transparent 70%)`,
        filter: "blur(40px)",
      }}
      animate={{
        x: [0, delta[0], -delta[0] * 0.6, 0],
        y: [0, delta[1], -delta[1] * 0.4, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

const AMBIENT_PARTICLES = [
  { x: 8, y: 22, size: 2, delay: 0 },
  { x: 24, y: 68, size: 3, delay: 0.6 },
  { x: 41, y: 14, size: 2, delay: 1.2 },
  { x: 60, y: 84, size: 2, delay: 1.8 },
  { x: 76, y: 28, size: 3, delay: 0.3 },
  { x: 89, y: 60, size: 2, delay: 0.9 },
  { x: 20, y: 46, size: 2, delay: 1.5 },
  { x: 70, y: 44, size: 3, delay: 2.1 },
  { x: 36, y: 88, size: 2, delay: 2.7 },
  { x: 54, y: 10, size: 2, delay: 0.4 },
  { x: 83, y: 16, size: 2, delay: 1.0 },
  { x: 10, y: 54, size: 3, delay: 1.6 },
];

function AmbientParticles() {
  return (
    <div className="absolute inset-0">
      {AMBIENT_PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "var(--accent)",
            boxShadow: `0 0 10px color-mix(in srgb, var(--accent) 70%, transparent)`,
          }}
          animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -12, 0] }}
          transition={{
            duration: 5 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Circuit traces ──────────────────────────────────────────────────── */

// PCB-style right-angle paths fanning out from the arc focus point (600, 180)
// in a 1200×360 viewBox. Each trace routes above or below the card row so
// it reads as a signal leaving the highlighted brand, not crossing through
// the other cards. `end` and `bend` mark where to place the endpoint node
// and the outer solder pad respectively.
const TRACES: { d: string; end: [number, number]; bend: [number, number] }[] = [
  // Upper traces
  { d: "M600 180 L420 180 L420 90 L240 90",   end: [240, 90],  bend: [420, 90]  },
  { d: "M600 180 L540 180 L540 40 L380 40",   end: [380, 40],  bend: [540, 40]  },
  { d: "M600 180 L660 180 L660 40 L820 40",   end: [820, 40],  bend: [660, 40]  },
  { d: "M600 180 L780 180 L780 90 L960 90",   end: [960, 90],  bend: [780, 90]  },
  // Lower traces
  { d: "M600 180 L420 180 L420 270 L240 270", end: [240, 270], bend: [420, 270] },
  { d: "M600 180 L540 180 L540 320 L380 320", end: [380, 320], bend: [540, 320] },
  { d: "M600 180 L660 180 L660 320 L820 320", end: [820, 320], bend: [660, 320] },
  { d: "M600 180 L780 180 L780 270 L960 270", end: [960, 270], bend: [780, 270] },
];

const PULSE_DURATION = 3.6;
const PULSE_STAGGER = 0.42;

function CircuitTraces() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 360"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      {/* Static trace lines — always-visible PCB routing. */}
      {TRACES.map((t, i) => (
        <path
          key={`s-${i}`}
          d={t.d}
          stroke="color-mix(in srgb, var(--accent) 22%, transparent)"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* Animated pulse segments — a short bright dash travels each path
          from center to endpoint on a loop, staggered per trace. */}
      {TRACES.map((t, i) => (
        <motion.path
          key={`p-${i}`}
          d={t.d}
          stroke="color-mix(in srgb, var(--accent) 75%, transparent)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray="9 91"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: PULSE_DURATION,
            ease: "linear",
            repeat: Infinity,
            delay: i * PULSE_STAGGER,
          }}
          style={{
            filter:
              "drop-shadow(0 0 4px color-mix(in srgb, var(--accent) 60%, transparent))",
          }}
        />
      ))}

      {/* Outer bend solder pads — small open rings at each elbow. */}
      {TRACES.map((t, i) => (
        <circle
          key={`b-${i}`}
          cx={t.bend[0]}
          cy={t.bend[1]}
          r={2.4}
          stroke="color-mix(in srgb, var(--accent) 32%, transparent)"
          strokeWidth={1}
        />
      ))}

      {/* Endpoint nodes — pulse to full brightness as each packet arrives. */}
      {TRACES.map((t, i) => (
        <motion.circle
          key={`e-${i}`}
          cx={t.end[0]}
          cy={t.end[1]}
          r={2.8}
          fill="var(--accent)"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: PULSE_DURATION,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * PULSE_STAGGER + PULSE_DURATION * 0.45,
          }}
          style={{
            filter:
              "drop-shadow(0 0 5px color-mix(in srgb, var(--accent) 80%, transparent))",
          }}
        />
      ))}
    </svg>
  );
}

/* ─── Brand card (single tile in the arc) ─────────────────────────────── */

function BrandCard({
  client,
  highlighted,
}: {
  client: Client;
  highlighted: boolean;
}) {
  return (
    <div
      className="relative w-[140px] md:w-[156px] aspect-square rounded-full overflow-hidden"
      style={{
        background: "var(--paper)",
        boxShadow: highlighted
          ? "0 24px 48px -16px color-mix(in srgb, var(--accent) 65%, transparent), " +
            "0 6px 18px -6px color-mix(in srgb, var(--accent) 35%, transparent), " +
            "inset 0 0 0 1.5px color-mix(in srgb, var(--accent) 55%, transparent)"
          : "0 18px 38px -18px color-mix(in srgb, var(--ink) 30%, transparent), " +
            "inset 0 0 0 1px color-mix(in srgb, var(--line-strong) 32%, transparent)",
        transition:
          "box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Scan beam — diagonal accent stripe that sweeps across the
          highlighted card every cycle. Pure CSS, only animated when
          highlighted to avoid wasted paint on dim cards. */}
      {highlighted && (
        <motion.span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, color-mix(in srgb, var(--accent) 28%, transparent) 50%, transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Brand logo — `object-cover` fills the circle edge-to-edge so the
          tile is pure logo, no surrounding padding. Source images that
          aren't square will be cropped on their longer axis. */}
      <Image
        src={client.src}
        alt={client.name}
        fill
        sizes="(max-width: 768px) 120px, 156px"
        className="relative object-cover"
      />
    </div>
  );
}

/* ─── Featured detail (below the arc) ─────────────────────────────────── */

function FeaturedDetail({
  active,
  activeIdx,
  total,
  reduced,
}: {
  active: Client;
  activeIdx: number;
  total: number;
  reduced: boolean;
}) {
  return (
    <div className="mt-8 md:mt-10 text-center min-h-[180px] md:min-h-[200px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.slug}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 flex items-center justify-center gap-2">
            <span className="relative inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            </span>
            Featured ·{" "}
            <span className="tabular-nums text-foreground/80">
              {String(activeIdx + 1).padStart(2, "0")}
            </span>{" "}
            /{" "}
            <span className="tabular-nums">
              {String(total).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-4 text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.05] tracking-[-0.025em] serif-italic text-foreground">
            {active.name}
          </h3>

          {(active.since || active.industry) && (
            <div className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground/65 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              {active.since && <span>Since {active.since}</span>}
              {active.since && active.industry && (
                <span aria-hidden className="text-foreground/30">·</span>
              )}
              {active.industry && <span>{active.industry}</span>}
            </div>
          )}

          {active.blurb && (
            <p className="mt-3 text-[14px] md:text-[15px] text-foreground/75 leading-relaxed max-w-md mx-auto">
              {active.blurb}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

