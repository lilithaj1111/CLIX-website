"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { CO_FOUNDER, FOUNDER, TEAM, type TeamMember } from "@/lib/team";
import { LogoMark } from "../LogoMark";

/**
 * About-page team section. Cinematic backdrop (multi-blob radial wash
 * + blueprint grid + slow-floating accent orbs + scattered particle
 * sparks) sits behind a featured founder card, a 2×2 stat grid, and a
 * staggered 3-column team strip. Each team card has a springy entrance,
 * continuous idle float (per-card phase), and a 3D mouse-tilt on hover
 * that snaps back when the cursor leaves.
 */
export function TeamSection() {
  return (
    <section className="relative border-t border-line py-24 md:py-36 bg-bg-warm overflow-hidden">
      <div className="relative z-[1] mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* ── Section header ─────────────────────────────── */}
        <div className="grid md:grid-cols-12 gap-10 mb-14 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7"
          >
            <div className="eyebrow">הצוות שלנו</div>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.03em]">
              האנשים ש{" "}
              <span className="serif-italic text-accent">בנו את זה.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="md:col-span-4 md:col-start-9 md:pt-6"
          >
            <p className="text-[15px] leading-relaxed text-foreground/75">
              צוות מקצועי של מומחי אוטומציה ופיתוח בוגרי יחידה 8200
              והטכניון שבונים מערכות ייעודיות לארגונים שלוקחים את
              הטכנולוגיה שלהם ברצינות.
            </p>
          </motion.div>
        </div>

        {/* ── Founder + Co-founder cards ────────────────────────────── */}
        <div className="mb-16 md:mb-24 grid md:grid-cols-2 gap-6 md:gap-8">
          <FounderCard founder={FOUNDER} />
          <FounderCard founder={CO_FOUNDER} />
        </div>

        {/* ── Team grid — 5 members + a "more team" card (6 total). Fills a
            clean 2×3 on mobile (no orphan cell) and a 3+3 on lg. ──────── */}
        <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {TEAM.map((m, i) => (
            <div
              key={m.slug}
              // Per-card vertical offset on md+ for the "floating" arrangement.
              style={
                {
                  ["--off" as string]: `${OFFSETS[i] ?? 0}px`,
                } as React.CSSProperties
              }
              className={`md:mt-[var(--off)] ${LG_SPAN[i] ?? ""}`}
            >
              <FloatingWrapper index={i}>
                <TiltCard>
                  <TeamCard member={m} />
                </TiltCard>
              </FloatingWrapper>
            </div>
          ))}

          {/* "+ more talented team" card — closes the grid and signals the
              team is bigger than the faces shown. Carries the Clix mark. */}
          <div
            style={
              {
                ["--off" as string]: `${OFFSETS[TEAM.length] ?? 0}px`,
              } as React.CSSProperties
            }
            className={`md:mt-[var(--off)] ${LG_SPAN[TEAM.length] ?? ""}`}
          >
            <FloatingWrapper index={TEAM.length}>
              <TiltCard>
                <MoreTeamCard />
              </TiltCard>
            </FloatingWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Per-card vertical offset on md+ — more dramatic than a basic stagger.
 *  Six entries: five members + the "more team" card. */
const OFFSETS = [0, -34, 20, 28, -12, 12];

/** Lg-grid column spans for the 6-card "3 + 3" arrangement on a 6-col grid:
 *  both rows use cols 1–2, 3–4, 5–6. */
const LG_SPAN = [
  "lg:col-span-2 lg:col-start-1",
  "lg:col-span-2 lg:col-start-3",
  "lg:col-span-2 lg:col-start-5",
  "lg:col-span-2 lg:col-start-1",
  "lg:col-span-2 lg:col-start-3",
  "lg:col-span-2 lg:col-start-5",
];

/* ─── Cinematic backdrop ─────────────────────────────────────────────── */

function CinematicBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {/* Multi-blob radial gradient base — denser and more pronounced
          so the tech atmosphere actually reads against bg-bg-warm. */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(900px 600px at 5% 20%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 60%),
            radial-gradient(700px 500px at 95% 75%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 65%),
            radial-gradient(600px 450px at 50% 100%, color-mix(in srgb, var(--accent-deep) 18%, transparent), transparent 65%),
            radial-gradient(500px 400px at 50% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%)
          `,
        }}
      />

      {/* Blueprint grid — visible accent purple lines on the warm
          surface, with a softer mask so the grid extends across the
          whole section. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(140,160,179,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(140,160,179,0.16) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 90% 85% at 50% 50%, black 50%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 85% at 50% 50%, black 50%, transparent 95%)",
        }}
      />

      {/* Fine secondary dot pattern overlaid on the grid for tech
          density — gives the section the "blueprint over engineering
          paper" texture rather than a single thin grid. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 26%, transparent) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 85% 80% at 50% 50%, black 40%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 80% at 50% 50%, black 40%, transparent 95%)",
        }}
      />

      {/* Slow-floating accent orbs — heavy blur, more opacity so they
          read as soft purple "weather" against the warm cream. */}
      <FloatingOrb
        size={460}
        left="2%"
        top="8%"
        color="var(--accent)"
        alpha={0.3}
        delta={[40, -30]}
        duration={22}
      />
      <FloatingOrb
        size={400}
        left="84%"
        top="55%"
        color="var(--accent)"
        alpha={0.26}
        delta={[-50, 30]}
        duration={26}
        delay={3}
      />
      <FloatingOrb
        size={300}
        left="56%"
        top="6%"
        color="var(--accent-deep)"
        alpha={0.22}
        delta={[30, 40]}
        duration={20}
        delay={6}
      />

      {/* Scattered accent particles — fine dots at fixed positions. */}
      <Particles />

      {/* PCB-style circuit traces along the top and bottom edges, with
          traveling data pulses. Adds tech architecture without crashing
          into the team cards in the middle. */}
      <CircuitTraces />

      {/* Vertical scan beam — a horizontal gradient line sweeps slowly
          down the section, like a scanner reading rows. */}
      <ScanBeam />

      {/* HUD corner brackets at each corner of the section. */}
      <HUDCorner pos="tl" />
      <HUDCorner pos="tr" />
      <HUDCorner pos="bl" />
      <HUDCorner pos="br" />

      {/* HUD status pip in a corner. */}
      <StatusPip />
    </div>
  );
}

function HUDCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map: Record<typeof pos, string> = {
    tl: "top-5 left-5 md:top-7 md:left-7 border-t border-l",
    tr: "top-5 right-5 md:top-7 md:right-7 border-t border-r",
    bl: "bottom-5 left-5 md:bottom-7 md:left-7 border-b border-l",
    br: "bottom-5 right-5 md:bottom-7 md:right-7 border-b border-r",
  };
  return (
    <span
      aria-hidden
      className={`absolute w-4 h-4 md:w-5 md:h-5 ${map[pos]} pointer-events-none`}
      style={{
        borderColor: "color-mix(in srgb, var(--accent) 55%, transparent)",
      }}
    />
  );
}

/* ─── Circuit traces ──────────────────────────────────────────────────── */

function CircuitTraces() {
  // Four traces — two on top edge, two on bottom. Each is a right-angle
  // path with a traveling pulse. Routed along the section edges so they
  // never overlap the team cards.
  const traces = [
    { d: "M 5 6 H 28 V 14 H 48", id: "t-top-1", delay: 0 },
    { d: "M 95 6 H 72 V 14 H 52", id: "t-top-2", delay: 1.2 },
    { d: "M 5 94 H 28 V 86 H 48", id: "t-bot-1", delay: 0.6 },
    { d: "M 95 94 H 72 V 86 H 52", id: "t-bot-2", delay: 1.8 },
  ];

  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {traces.map((t) => (
        <g key={t.id}>
          <path
            id={t.id}
            d={t.d}
            fill="none"
            stroke="color-mix(in srgb, var(--accent) 55%, transparent)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Junction dot at the bend */}
          <circle
            cx={t.d.match(/V \d+ H (\d+)/)?.[1] ?? 0}
            cy={t.d.startsWith("M 5") ? (t.d.includes("V 14") ? 14 : 86) : 14}
            r={0.7}
            fill="var(--accent)"
          />
          {/* Traveling pulse */}
          <circle r={0.9} fill="var(--accent)">
            <animateMotion
              dur="3.5s"
              repeatCount="indefinite"
              begin={`${t.delay}s`}
            >
              <mpath href={`#${t.id}`} />
            </animateMotion>
          </circle>
        </g>
      ))}
    </svg>
  );
}

/* ─── Scan beam ───────────────────────────────────────────────────────── */

function ScanBeam() {
  return (
    <motion.div
      aria-hidden
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        height: "2px",
        background:
          "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent) 75%, transparent) 50%, transparent 100%)",
        boxShadow:
          "0 0 24px color-mix(in srgb, var(--accent) 50%, transparent), 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent)",
      }}
      initial={{ top: "-2%", opacity: 0 }}
      animate={{
        top: ["-2%", "100%"],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 6,
        times: [0, 0.08, 0.92, 1],
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 2,
      }}
    />
  );
}

/* ─── HUD status pip ──────────────────────────────────────────────────── */

function StatusPip() {
  return (
    <div className="absolute top-6 right-6 hidden md:flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/55">
      <span className="relative inline-flex">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
      </span>
      <span>פעילים · 06 צמתים</span>
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
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left,
        top,
        background: `radial-gradient(circle, color-mix(in srgb, ${color} ${alpha * 100}%, transparent), transparent 70%)`,
        filter: "blur(36px)",
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

const PARTICLE_POSITIONS: Array<{ x: number; y: number; size: number; delay: number }> = [
  { x: 12, y: 22, size: 2, delay: 0 },
  { x: 28, y: 70, size: 3, delay: 0.6 },
  { x: 45, y: 18, size: 2, delay: 1.2 },
  { x: 62, y: 86, size: 2, delay: 1.8 },
  { x: 78, y: 30, size: 3, delay: 0.3 },
  { x: 92, y: 62, size: 2, delay: 0.9 },
  { x: 22, y: 50, size: 2, delay: 1.5 },
  { x: 70, y: 50, size: 3, delay: 2.1 },
  { x: 38, y: 90, size: 2, delay: 2.7 },
  { x: 58, y: 12, size: 2, delay: 0.4 },
];

function Particles() {
  return (
    <div className="absolute inset-0">
      {PARTICLE_POSITIONS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "var(--accent)",
            boxShadow: `0 0 8px color-mix(in srgb, var(--accent) 70%, transparent)`,
          }}
          animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -8, 0] }}
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

/* ─── FloatingWrapper: entrance + continuous idle bob ────────────────── */

function FloatingWrapper({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 18,
        delay: 0.1 + index * 0.09,
      }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4 + (index % 3) * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.4,
        }}
        style={{ willChange: "transform" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─── TiltCard: 3D mouse-tracking tilt on hover ──────────────────────── */

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const config = { stiffness: 200, damping: 24 };
  const rotateX = useSpring(useTransform(y, [-50, 50], [9, -9]), config);
  const rotateY = useSpring(useTransform(x, [-50, 50], [-9, 9]), config);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    x.set(px / 3);
    y.set(py / 3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1200px" }}
      className="group"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Founder card ──────────────────────────────────────────────────── */

function FounderCard({ founder }: { founder: TeamMember }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl border border-line bg-paper p-7 md:p-9 overflow-hidden group"
    >
      {/* Static accent wash — anchored at the left edge so the photo side
          of the card carries the brand colour. No animation. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 90% at 0% 50%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />
      {/* Accent edge highlight that brightens on hover. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow:
            "inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent), 0 24px 60px -20px color-mix(in srgb, var(--accent) 30%, transparent)",
        }}
      />

      <div className="relative flex flex-col sm:flex-row gap-6 sm:gap-9 items-start sm:items-center">
        <div className="shrink-0">
          <Avatar member={founder} size={184} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-3xl md:text-4xl tracking-tight font-medium text-foreground">
            {founder.role}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Team card ─────────────────────────────────────────────────────── */

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="relative h-full">
      <div className="relative rounded-2xl border border-line/80 bg-paper px-6 py-9 flex flex-col items-center text-center transition-all duration-500 group-hover:border-accent/60 group-hover:shadow-[0_36px_70px_-22px_rgba(61,74,89,0.4)] h-full overflow-hidden">
        {/* Soft permanent wash — accent glow at the top of every card so
            the row feels intentional, not just hover-driven. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 80% at 50% -10%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%)",
          }}
        />
        {/* Hover lift — extra wash that brightens on interaction. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 100% at 50% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%)",
          }}
        />

        <CornerPip pos="tl" />
        <CornerPip pos="tr" />
        <CornerPip pos="bl" />
        <CornerPip pos="br" />

        <Avatar member={member} size={128} ring alwaysRing />
        <div className="mt-6 font-medium text-foreground text-lg tracking-tight relative">
          {member.role}
        </div>
      </div>
    </div>
  );
}

/* ─── "More team" card — Clix mark + a line that the team runs deeper ── */

function MoreTeamCard() {
  return (
    <div className="relative h-full">
      <div className="relative rounded-2xl border border-line/80 bg-paper px-6 py-9 flex flex-col items-center text-center transition-all duration-500 group-hover:border-accent/60 group-hover:shadow-[0_36px_70px_-22px_rgba(61,74,89,0.4)] h-full overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 80% at 50% -10%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 100% at 50% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%)",
          }}
        />

        <CornerPip pos="tl" />
        <CornerPip pos="tr" />
        <CornerPip pos="bl" />
        <CornerPip pos="br" />

        {/* Clix mark in the avatar slot */}
        <div className="relative grid place-items-center" style={{ width: 128, height: 128 }}>
          {/* conic glow ring */}
          <div
            aria-hidden
            className="absolute -inset-1.5 rounded-full opacity-55 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "conic-gradient(from 0deg, var(--accent), color-mix(in srgb, var(--accent) 25%, transparent), var(--accent))",
              filter: "blur(11px)",
            }}
          />
          {/* slow rotating dashed orbit ring */}
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              border: "1.5px dashed color-mix(in srgb, var(--accent) 35%, transparent)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          />
          <div
            className="relative grid h-full w-full place-items-center rounded-full overflow-hidden border-2 border-line transition-transform duration-500 group-hover:scale-105"
            style={{
              background:
                "radial-gradient(circle at 50% 32%, var(--paper) 0%, var(--bg-warm) 78%)",
            }}
          >
            {/* soft accent glow behind the mark */}
            <span
              aria-hidden
              className="absolute h-20 w-20 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
                filter: "blur(8px)",
              }}
            />
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <LogoMark size={54} className="text-ink" />
            </motion.div>
          </div>
        </div>

        <div className="relative mt-6 text-lg font-medium tracking-tight text-ink">
          ועוד צוות שלם
        </div>
        <div className="relative mt-1.5 max-w-[200px] text-[13px] leading-snug text-foreground/60">
          מפתחים, מהנדסים ואנשי מקצוע מוכשרים שמאחורי כל מערכת.
        </div>
      </div>
    </div>
  );
}

function CornerPip({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map: Record<typeof pos, string> = {
    tl: "top-3 left-3",
    tr: "top-3 right-3",
    bl: "bottom-3 left-3",
    br: "bottom-3 right-3",
  };
  return (
    <span
      aria-hidden
      className={`absolute ${map[pos]} w-1 h-1 rounded-full bg-accent opacity-40 group-hover:opacity-100 transition-opacity duration-300`}
    />
  );
}

/* ─── Avatar with photo fallback ────────────────────────────────────── */

function Avatar({
  member,
  size,
  ring,
  alwaysRing,
}: {
  member: TeamMember;
  size: number;
  ring?: boolean;
  alwaysRing?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const initials = member.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  // `photo` takes precedence over the legacy slug-based path. Either one
  // counts as "has photo" until the image fails to load, at which point we
  // fall back to the gradient-initials avatar.
  const photoSrc = member.photo ?? (member.hasPhoto ? `/team/${member.slug}.jpg` : null);
  const showPhoto = !!photoSrc && !errored;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {ring && (
        <div
          aria-hidden
          className={`absolute -inset-1.5 rounded-full transition-opacity duration-500 pointer-events-none ${alwaysRing ? "opacity-70 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          style={{
            background:
              "conic-gradient(from 0deg, var(--accent), color-mix(in srgb, var(--accent) 30%, transparent), var(--accent))",
            filter: "blur(10px)",
            animation: "spin 6s linear infinite",
          }}
        />
      )}
      <div
        className="relative w-full h-full rounded-full overflow-hidden border-2 border-line bg-bg-warm transition-transform duration-500 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoSrc!}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ objectPosition: member.focal ?? "50% 30%" }}
            onError={() => setErrored(true)}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center font-medium transition-transform duration-700 group-hover:scale-110"
            style={{
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)",
              color: "var(--paper)",
              fontSize: size * 0.34,
              letterSpacing: "-0.02em",
            }}
          >
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}

