"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowDown, TrendingUp, Zap } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * HeroServiceCards — 3-card fanned stack on a subtle grid backdrop.
 *
 * Each card communicates one concrete BENEFIT of running AI inside your
 * business. All cards are white with blue + lime accents; the active
 * card stands out via size, shadow, and a brighter blue→lime top stripe.
 *
 *   01 · Instant replies          (before/after bar comparison)
 *   02 · Always on                 (animated heartbeat pulse)         ← default centre
 *   03 · Scale without hiring     (volume up vs team flat sparklines)
 */

const BLUE = "#8CA0B3";
const BLUE_DEEP = "#3D4A59";
const LIME = "#8CA0B3";
const LIME_BRIGHT = "#A9BDD0";
const LIME_DEEP = "#3D4A59";
const INK = "#222A33";
const INK_SOFT = "rgba(15,23,42,0.55)";
const INK_MUTED = "rgba(15,23,42,0.38)";
const PAPER = "#FFFFFF";
const PAPER_WARM = "#F8FAFC";
const LINE_FAINT = "rgba(15,23,42,0.08)";

type CardId = "speed" | "uptime" | "scale";
const INITIAL_ORDER: CardId[] = ["speed", "uptime", "scale"];

type CardConfig = {
  number: string;
  tag: string;
  label: string;
  sub: string;
  // Bottom-corner stat — the headline number for the benefit.
  statIcon: typeof Activity;
  statIconBg: string;
  statIconBorder: string;
  statIconColor: string;
  statNumber: string;
  statSuffix?: string;
  statArrow?: boolean;
};

const CARDS: Record<CardId, CardConfig> = {
  speed: {
    number: "01",
    tag: "Response time",
    label: "Instant replies",
    sub: "Customer messages answered in seconds, not hours.",
    statIcon: Zap,
    statIconBg: `${BLUE}14`,
    statIconBorder: `${BLUE}26`,
    statIconColor: BLUE,
    statNumber: "93%",
    statArrow: true,
  },
  uptime: {
    number: "02",
    tag: "Availability",
    label: "Always on",
    sub: "Operates 24/7 — every hour, every day.",
    statIcon: Activity,
    statIconBg: `${LIME_BRIGHT}40`,
    statIconBorder: `${LIME}40`,
    statIconColor: LIME_DEEP,
    statNumber: "24/7",
    statSuffix: "uptime",
  },
  scale: {
    number: "03",
    tag: "Operational scale",
    label: "Scale without hiring",
    sub: "Same team handles 10× the operational volume.",
    statIcon: TrendingUp,
    statIconBg: `${BLUE}14`,
    statIconBorder: `${BLUE}26`,
    statIconColor: BLUE,
    statNumber: "10×",
    statSuffix: "output",
  },
};

export function HeroServiceCards({ className = "" }: { className?: string }) {
  const [order, setOrder] = useState<CardId[]>(INITIAL_ORDER);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleClick = (id: CardId) => {
    setOrder((cur) => {
      if (cur[1] === id) return cur;
      const next = [...cur];
      const idx = cur.indexOf(id);
      [next[1], next[idx]] = [next[idx], next[1]];
      return next;
    });
  };

  const cardW = isMobile ? 220 : 322;
  const cardH = isMobile ? 312 : 452;
  const spread = isMobile ? 72 : 122;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Subtle grid backdrop — fades at the edges */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, ${BLUE}1a 1px, transparent 1px), linear-gradient(to bottom, ${BLUE}1a 1px, transparent 1px)`,
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(ellipse 75% 78% at 50% 50%, #000 28%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 78% at 50% 50%, #000 28%, transparent 92%)",
        }}
      />
      {/* Soft blue + lime wash behind the centre card */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(40% 45% at 50% 45%, ${BLUE}22 0%, transparent 70%), radial-gradient(28% 32% at 50% 65%, ${LIME_BRIGHT}33 0%, transparent 75%)`,
          filter: "blur(28px)",
        }}
      />

      {/* Card stack */}
      <div
        className="relative w-full grid place-items-center"
        style={{
          minHeight: cardH + (isMobile ? 70 : 110),
          perspective: "1400px",
        }}
      >
        <div className="relative w-full" style={{ height: cardH + 48 }}>
          {order.map((id, idx) => {
            const offset = idx - 1; // -1, 0, +1
            const isCenter = offset === 0;
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => handleClick(id)}
                aria-label={`Select ${CARDS[id].label}`}
                aria-pressed={isCenter}
                className="absolute top-1/2 left-1/2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8CA0B3]/60 rounded-[26px]"
                animate={{
                  x: offset * spread,
                  y: isCenter ? -12 : 22,
                  scale: isCenter ? 1 : 0.84,
                  rotate: offset * 12,
                  zIndex: isCenter ? 30 : 10,
                  opacity: isCenter ? 1 : 0.96,
                }}
                transition={{ type: "spring", stiffness: 240, damping: 28 }}
                style={{
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                  width: cardW,
                  height: cardH,
                }}
              >
                <Card
                  id={id}
                  config={CARDS[id]}
                  isActive={isCenter}
                  width={cardW}
                  height={cardH}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Card({
  id,
  config,
  isActive,
  width,
  height,
}: {
  id: CardId;
  config: CardConfig;
  isActive: boolean;
  width: number;
  height: number;
}) {
  return (
    <div
      className="relative rounded-[26px] overflow-hidden flex flex-col text-left"
      style={{
        width,
        height,
        background: PAPER,
        border: `1px solid ${isActive ? "rgba(140,160,179,0.20)" : LINE_FAINT}`,
        boxShadow: isActive
          ? `0 36px 70px -20px rgba(140,160,179,0.30), 0 14px 28px -10px rgba(15,23,42,0.18)`
          : `0 18px 36px -16px rgba(15,23,42,0.18), 0 6px 14px -6px rgba(15,23,42,0.10)`,
      }}
    >
      {/* Top accent stripe — blue → lime gradient. Thicker + brighter
          on the active card so it pops without recoloring the whole
          card. Inactive cards keep a thin muted stripe. */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0"
        style={{
          height: isActive ? 4 : 2,
          background: isActive
            ? `linear-gradient(90deg, ${BLUE} 0%, ${LIME} 100%)`
            : `linear-gradient(90deg, ${BLUE}33 0%, ${LIME}33 100%)`,
        }}
      />

      {/* Top meta row — number + tag */}
      <div className="flex items-center justify-between px-6 pt-6">
        <span
          className="text-[11.5px] font-mono uppercase tracking-[0.18em] leading-none"
          style={{ color: INK_SOFT }}
        >
          {config.number} · Benefit
        </span>
        <span
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.12em] leading-none"
          style={{
            background: `${BLUE}10`,
            color: BLUE_DEEP,
            border: `1px solid ${BLUE}26`,
          }}
        >
          {config.tag}
        </span>
      </div>

      {/* Graph — the visual centre of the card. Fills the freed-up
          vertical space between the meta row and the bottom stat block.
          Keyed by `isActive` so the whole graph remounts on click,
          re-firing every entrance animation (bars grow, sparklines
          draw, heartbeat redraws) — mirrors the lectures-card pattern. */}
      <div className="flex-1 px-6 py-4 flex flex-col justify-center">
        {id === "speed" && (
          <SpeedGraph key={`speed-${isActive ? "on" : "off"}`} />
        )}
        {id === "uptime" && (
          <UptimeGraph key={`uptime-${isActive ? "on" : "off"}`} />
        )}
        {id === "scale" && (
          <ScaleGraph key={`scale-${isActive ? "on" : "off"}`} />
        )}
      </div>

      {/* Bottom — big stat, then label, then short sub-line */}
      <div className="px-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <span
            className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] shrink-0 transition-all duration-300 hover:scale-110"
            style={{
              background: config.statIconBg,
              border: `1.5px solid ${config.statIconBorder}`,
              boxShadow: `0 8px 24px -8px ${config.statIconColor}40, inset 0 0 0 1px ${config.statIconColor}20`,
            }}
          >
            <config.statIcon
              className="w-6 h-6"
              strokeWidth={2.2}
              style={{ color: config.statIconColor }}
            />
          </span>
          <div className="leading-none flex items-baseline gap-1">
            {config.statArrow && (
              <ArrowDown
                className="w-6 h-6 -mb-1"
                strokeWidth={2.6}
                style={{ color: LIME_DEEP }}
              />
            )}
            <span
              className="text-[40px] font-bold tabular-nums leading-none"
              style={{ color: INK, letterSpacing: "-0.03em" }}
            >
              {config.statNumber}
            </span>
            {config.statSuffix && (
              <span
                className="ml-1 text-[11px] font-mono uppercase tracking-[0.12em] leading-none"
                style={{ color: INK_SOFT }}
              >
                {config.statSuffix}
              </span>
            )}
          </div>
        </div>
        <div
          className="text-[18px] font-semibold leading-tight"
          style={{ color: INK, letterSpacing: "-0.01em" }}
        >
          {config.label}
        </div>
        <div
          className="mt-1 text-[11px] leading-snug"
          style={{ color: INK_SOFT }}
        >
          {config.sub}
        </div>
      </div>
    </div>
  );
}

/* ─── Card visuals ───────────────────────────────────────────────────────── */

/* SPEED graph — Before/After bars, centred in the card's middle slot */
function SpeedGraph() {
  return (
    <div className="space-y-6">
      <BarRow
        label="Before"
        valueLabel="4.2 hrs"
        widthPct={92}
        color="rgba(15,23,42,0.22)"
        textTint={INK_MUTED}
      />
      <BarRow
        label="Now"
        valueLabel="8 sec"
        widthPct={8}
        color={`linear-gradient(90deg, ${LIME_BRIGHT}, ${LIME_DEEP})`}
        textTint={INK}
        highlight
      />
    </div>
  );
}

function BarRow({
  label,
  valueLabel,
  widthPct,
  color,
  textTint,
  highlight = false,
}: {
  label: string;
  valueLabel: string;
  widthPct: number;
  color: string;
  textTint: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div
        className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.1em] leading-none mb-2"
        style={{ color: textTint }}
      >
        <span>{label}</span>
        <span
          className="tabular-nums"
          style={{
            color: highlight ? LIME_DEEP : textTint,
            fontWeight: highlight ? 700 : 500,
          }}
        >
          {valueLabel}
        </span>
      </div>
      <div
        className="relative h-3.5 rounded-full overflow-hidden"
        style={{ background: "rgba(15,23,42,0.05)" }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${widthPct}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* UPTIME graph — heartbeat pulse + week-day dot row, centred */
function UptimeGraph() {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div
          className="absolute inset-x-0 top-1/2 h-px"
          style={{ background: LINE_FAINT }}
        />
        <svg
          viewBox="0 0 200 50"
          preserveAspectRatio="none"
          className="block w-full h-20 relative"
          aria-hidden
        >
          <defs>
            <linearGradient id="pulse-fill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={BLUE} stopOpacity="0.20" />
              <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 25 L 30 25 L 38 12 L 46 38 L 54 6 L 62 44 L 70 25 L 100 25 L 108 16 L 116 34 L 124 25 L 200 25 L 200 50 L 0 50 Z"
            fill="url(#pulse-fill)"
          />
          <motion.path
            d="M 0 25 L 30 25 L 38 12 L 46 38 L 54 6 L 62 44 L 70 25 L 100 25 L 108 16 L 116 34 L 124 25 L 200 25"
            fill="none"
            stroke={BLUE}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <motion.span
          className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2.5 h-2.5 rounded-full"
          style={{ background: LIME }}
          animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      {/* Days-of-week dot row */}
      <div className="flex items-center justify-between">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: i === 6 ? LIME : LIME_BRIGHT }}
            />
            <span
              className="text-[8.5px] font-mono uppercase tracking-[0.1em] leading-none"
              style={{ color: INK_MUTED }}
            >
              {d}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* SCALE graph — two tall sparklines, centred */
function ScaleGraph() {
  return (
    <div className="space-y-5">
      <SparkRow
        label="Volume"
        value="+820%"
        valueColor={LIME_DEEP}
        path="M 0 40 L 20 36 L 40 32 L 60 26 L 80 20 L 100 14 L 120 9 L 140 5 L 160 3 L 180 2 L 200 1"
        stroke={LIME}
        fillId="vol-fill"
        fillStops={[LIME_BRIGHT, LIME]}
      />
      <SparkRow
        label="Team"
        value="0 hires"
        valueColor={INK_SOFT}
        path="M 0 24 L 24 23 L 48 25 L 72 24 L 96 25 L 120 23 L 144 24 L 168 24 L 200 23"
        stroke={BLUE}
        fillId="team-fill"
        fillStops={[BLUE, BLUE]}
        flat
      />
    </div>
  );
}

function SparkRow({
  label,
  value,
  valueColor,
  path,
  stroke,
  fillId,
  fillStops,
  flat = false,
}: {
  label: string;
  value: string;
  valueColor: string;
  path: string;
  stroke: string;
  fillId: string;
  fillStops: [string, string];
  flat?: boolean;
}) {
  return (
    <div>
      <div
        className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.1em] leading-none mb-2"
        style={{ color: INK_MUTED }}
      >
        <span>{label}</span>
        <span
          className="tabular-nums"
          style={{ color: valueColor, fontWeight: 600 }}
        >
          {value}
        </span>
      </div>
      <svg
        viewBox="0 0 200 45"
        preserveAspectRatio="none"
        className="block w-full h-14"
        aria-hidden
      >
        <defs>
          <linearGradient id={fillId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fillStops[0]} stopOpacity={flat ? 0 : 0.32} />
            <stop offset="100%" stopColor={fillStops[1]} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${path} L 200 45 L 0 45 Z`}
          fill={`url(#${fillId})`}
        />
        <motion.path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
        {/* End-cap dot */}
        <circle
          cx="200"
          cy={flat ? 23 : 1}
          r="2.2"
          fill={stroke}
          stroke="#FFFFFF"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}
