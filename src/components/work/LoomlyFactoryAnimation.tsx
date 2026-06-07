"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Cog,
  FileSpreadsheet,
  HardHat,
  Layers,
  Mail,
  Notebook,
  Radio,
  Wrench,
  Zap,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * Loomly Manufacturing — three real scenes, same tangible-device + cream
 * paper language as Northwind and Aurelia.
 *
 *   1) tools     "Before" — six legacy tools scattered as messy cards on a
 *                workbench: paper logbook, spreadsheet, email, work-order
 *                pad, radio dispatch, gauge panel. A red "Tool 6 / 6 ·
 *                incompatible" counter sits at the top.
 *   2) portal    "After" — the ops portal on an industrial tablet bolted
 *                to the line: telemetry for Lines 01-03 (RPM, output,
 *                defects) with sparklines + shift handover.
 *   3) alert     A downtime alert fires on Line 03; the portal pages a
 *                technician via WhatsApp; the line restarts in 4 minutes. */

const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "tools" | "portal" | "alert";
const PHASES: Phase[] = ["tools", "portal", "alert"];
const DUR: Record<Phase, number> = {
  tools: 4800,
  portal: 5400,
  alert: 5000,
};

const ACCENT = "#34B5BB";
const ACCENT_DEEP = "#0E7B82";
const STEEL = "#475569";
const INK = "#1F2937";
const INK_SOFT = "rgba(31,41,55,0.55)";
const PAPER = "#FAF6EC";
const PAPER_WARM = "#F1ECDF";
const LINE = "rgba(31,41,55,0.10)";

const CAPTIONS: Record<Phase, string> = {
  tools: "01 · Six legacy tools, none of them talk",
  portal: "02 · One portal · live line telemetry",
  alert: "03 · Downtime on Line 03 · tech paged",
};

export function LoomlyFactoryAnimation({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("tools");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase("portal");
      return;
    }
    const id = window.setTimeout(() => {
      setPhase((p) => {
        const next = PHASES[(PHASES.indexOf(p) + 1) % PHASES.length];
        if (next === "tools") setCycle((c) => c + 1);
        return next;
      });
    }, DUR[phase]);
    return () => window.clearTimeout(id);
  }, [phase, reduced]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
      style={{
        background: `
          radial-gradient(60% 70% at 25% 25%, ${PAPER} 0%, transparent 65%),
          radial-gradient(70% 70% at 80% 80%, ${PAPER_WARM} 0%, transparent 65%),
          ${PAPER}
        `,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(31,41,55,0.45) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-[8%] bottom-[18%] h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${LINE}, transparent)` }}
      />

      <div className="absolute top-5 left-5 sm:top-7 sm:left-8 z-20 hidden md:flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: ACCENT_DEEP, boxShadow: `0 0 10px ${ACCENT_DEEP}aa` }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: INK_SOFT }}
        >
          Factory ops · custom portal
        </span>
      </div>
      <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20 hidden md:block">
        <div
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full font-mono text-[9.5px] uppercase tracking-[0.2em]"
          style={{
            background: "rgba(255,255,255,0.7)",
            color: INK_SOFT,
            border: `1px solid ${LINE}`,
            backdropFilter: "blur(6px)",
          }}
        >
          <span className="relative inline-flex">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#16A34A" }} />
            {!reduced && (
              <span
                className="absolute inset-0 w-1.5 h-1.5 rounded-full animate-ping"
                style={{ background: "#16A34A" }}
              />
            )}
          </span>
          live
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          {phase === "tools" && <ToolsScene key={`t-${cycle}`} reduced={!!reduced} />}
          {phase === "portal" && <PortalScene key={`p-${cycle}`} reduced={!!reduced} />}
          {phase === "alert" && <AlertScene key={`a-${cycle}`} reduced={!!reduced} />}
        </AnimatePresence>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 sm:bottom-12 z-20 hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: INK_SOFT }}
          >
            {CAPTIONS[phase]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Scene 1 — TOOLS (6 legacy tools, one shared question, six answers) ──
 * Editorial 3×2 grid (no rotation, no jitter, no bouncing cursor). Every
 * card has the same shape: tone header + big metric value. Four cards
 * answer the same question (yesterday's Line 02 output) — each with a
 * different number, all marked red. The header chip names the question
 * out loud; the bottom caption seals it. Clean instead of chaotic. */

type Tool = {
  key: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  sub: string;
  tone: string;
  metric: string;
  value: string;
  conflict: boolean;
};

const TOOLS: Tool[] = [
  {
    key: "logbook",
    Icon: Notebook,
    label: "Paper logbook",
    sub: "Shift A · Tue",
    tone: "#DC2626",
    metric: "L02 OUTPUT",
    value: "~2,380",
    conflict: true,
  },
  {
    key: "excel",
    Icon: FileSpreadsheet,
    label: "Excel · v17.xlsx",
    sub: "Last save 3h ago",
    tone: "#16A34A",
    metric: "L02 OUTPUT",
    value: "2,412",
    conflict: true,
  },
  {
    key: "outlook",
    Icon: Mail,
    label: "Outlook · 412",
    sub: "Reply from shift lead",
    tone: "#3B82F6",
    metric: "L02 OUTPUT",
    value: "2,400",
    conflict: true,
  },
  {
    key: "radio",
    Icon: Radio,
    label: "Floor radio · ch4",
    sub: "Audio only",
    tone: "#F97316",
    metric: "LAST CALL",
    value: "“low…”",
    conflict: false,
  },
  {
    key: "workorder",
    Icon: Wrench,
    label: "Work-order pad",
    sub: "Carbon copy",
    tone: "#A855F7",
    metric: "WO-1432",
    value: "—",
    conflict: false,
  },
  {
    key: "gauge",
    Icon: Cog,
    label: "Gauge panel",
    sub: "Last cal 11d ago",
    tone: "#0E7B82",
    metric: "L02 OUTPUT",
    value: "2,395",
    conflict: true,
  },
];

function ToolsScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative w-[86%] h-[78%] max-w-[520px]"
    >
      {/* Surface — warm paper card, single border, single inset shadow */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: PAPER,
          border: `1px solid ${LINE}`,
          boxShadow: "0 8px 24px -10px rgba(31,41,55,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      />

      {/* Question banner — single piece of chrome at the top, names what
          all four conflicting tools are trying to answer. */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-1.5">
          <span
            className="px-1.5 py-0.5 rounded font-mono text-[7.5px] uppercase tracking-[0.16em] inline-flex items-center gap-1.5"
            style={{
              background: "white",
              color: INK_SOFT,
              border: `1px solid ${LINE}`,
            }}
          >
            <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2.5} style={{ color: "#B91C1C" }} />
            6 tools · 0 agree
          </span>
        </div>
        <span
          className="font-mono text-[7.5px] uppercase tracking-[0.18em]"
          style={{ color: INK_SOFT }}
        >
          “What did Line 02 do yesterday?”
        </span>
      </div>

      {/* 3×2 grid of tool cards — flush, deliberate, no rotation */}
      <div className="absolute inset-x-4 top-10 bottom-9 grid grid-cols-3 grid-rows-2 gap-2 z-20">
        {TOOLS.map((t, i) => (
          <motion.div
            key={t.key}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.07, duration: 0.45, ease: EASE }}
          >
            <ToolCard tool={t} />
          </motion.div>
        ))}
      </div>

      {/* Bottom caption */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.45 }}
        className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded font-mono text-[7.5px] uppercase tracking-[0.14em] z-30"
        style={{
          background: "white",
          color: INK_SOFT,
          border: `1px solid ${LINE}`,
          boxShadow: "0 4px 10px -3px rgba(31,41,55,0.18)",
        }}
      >
        “nobody knows which one is the truth.”
      </motion.div>
    </motion.div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const valueColor = tool.conflict ? "#B91C1C" : INK;
  const valueBg = tool.conflict ? "rgba(220,38,38,0.06)" : "transparent";
  return (
    <div
      className="relative h-full rounded-md overflow-hidden flex flex-col"
      style={{
        background: "white",
        border: `1px solid ${tool.conflict ? "rgba(220,38,38,0.25)" : LINE}`,
        boxShadow: "0 4px 10px -4px rgba(31,41,55,0.18)",
      }}
    >
      {/* Header — solid brand stripe with icon + name */}
      <div
        className="flex items-center gap-1 px-1.5 py-1 shrink-0"
        style={{ background: tool.tone }}
      >
        <tool.Icon className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
        <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-white truncate leading-none">
          {tool.label}
        </span>
      </div>
      {/* Sub-meta */}
      <div
        className="px-1.5 py-0.5 text-[6.5px] font-mono uppercase tracking-[0.1em] leading-none border-b shrink-0"
        style={{ color: INK_SOFT, borderColor: LINE, background: "rgba(31,41,55,0.02)" }}
      >
        {tool.sub}
      </div>
      {/* Big metric block — fills remaining card height */}
      <div
        className="flex-1 flex flex-col justify-center px-2 py-1.5"
        style={{ background: valueBg }}
      >
        <span
          className="text-[6.5px] font-mono uppercase tracking-[0.12em] leading-none"
          style={{ color: INK_SOFT }}
        >
          {tool.metric}
        </span>
        <span
          className="mt-1 text-[14px] font-bold tabular-nums leading-none truncate"
          style={{ color: valueColor }}
        >
          {tool.value}
        </span>
      </div>
    </div>
  );
}

/* ─── Scene 2 — PORTAL (industrial tablet, live line telemetry) ───────── */

const LINES = [
  { id: "L-01", rpm: 1450, out: "1,184/h", defects: 3,  status: "ok" as const },
  { id: "L-02", rpm: 1380, out: "1,096/h", defects: 5,  status: "ok" as const },
  { id: "L-03", rpm: 1240, out: "912/h",   defects: 11, status: "warn" as const },
];

function PortalScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative w-[68%] max-w-[400px]"
      style={{ transform: "rotateX(2deg) rotateY(-2deg)" }}
    >
      <div
        className="relative rounded-[18px] p-1.5 shadow-[0_24px_44px_-18px_rgba(31,41,55,0.45)]"
        style={{ background: `linear-gradient(180deg, ${STEEL}, #1F2937)` }}
      >
        <span
          className="absolute top-2 left-3 w-1 h-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.5)" }}
        />
        <span
          className="absolute top-2 right-3 w-1 h-1 rounded-full"
          style={{ background: "#16A34A", boxShadow: "0 0 4px #16A34Aaa" }}
        />
        <div
          className="relative rounded-md overflow-hidden"
          style={{ background: PAPER, aspectRatio: "16 / 10" }}
        >
          <div
            className="flex items-center gap-1.5 px-2 py-1.5 border-b"
            style={{ borderColor: LINE, background: "white" }}
          >
            <span
              className="w-4 h-4 rounded grid place-items-center text-white"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})` }}
            >
              <Layers className="w-2.5 h-2.5" strokeWidth={2.5} />
            </span>
            <div className="leading-tight">
              <div className="text-[8px] font-bold" style={{ color: INK }}>Ops portal</div>
              <div className="text-[6px] font-mono uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
                Real-time telemetry · 18 machines
              </div>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 text-[6.5px] font-mono" style={{ color: INK_SOFT }}>
              Shift B · 14:32
            </span>
          </div>

          <div className="p-1.5 grid gap-1.5">
            {LINES.map((l, i) => {
              const warn = l.status === "warn";
              return (
                <motion.div
                  key={l.id}
                  initial={reduced ? false : { opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                  className="rounded-md px-2 py-1.5 flex items-center gap-2"
                  style={{
                    background: warn ? "rgba(245,158,11,0.08)" : "white",
                    border: `1px solid ${warn ? "rgba(245,158,11,0.35)" : LINE}`,
                  }}
                >
                  <span
                    className="w-5 h-5 rounded grid place-items-center text-white text-[7px] font-bold tabular-nums shrink-0"
                    style={{
                      background: warn
                        ? "linear-gradient(135deg, #F59E0B, #D97706)"
                        : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})`,
                    }}
                  >
                    {l.id.replace("L-", "")}
                  </span>
                  <div className="flex-1 grid grid-cols-3 gap-1.5">
                    <Telemetry label="rpm" value={l.rpm.toLocaleString()} accent={!warn} />
                    <Telemetry label="output" value={l.out} accent={!warn} />
                    <Telemetry label="defects" value={`${l.defects}`} accent={!warn} danger={warn} />
                  </div>
                  <svg width="40" height="14" viewBox="0 0 40 14" className="shrink-0">
                    <motion.path
                      initial={reduced ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.9, ease: "easeOut" }}
                      d={warn
                        ? "M 0,5 L 6,7 L 12,4 L 18,9 L 24,11 L 30,13 L 40,12"
                        : "M 0,8 L 6,6 L 12,9 L 18,4 L 24,6 L 30,3 L 40,2"}
                      fill="none"
                      stroke={warn ? "#F59E0B" : ACCENT_DEEP}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              );
            })}
          </div>

          <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between text-[6.5px] font-mono uppercase tracking-[0.12em]" style={{ color: INK_SOFT }}>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" strokeWidth={2.2} />
              Mtbf 38h
            </span>
            <span>Shift handover · 16:00</span>
            <span className="inline-flex items-center gap-1">
              <Check className="w-2.5 h-2.5" style={{ color: "#16A34A" }} strokeWidth={2.5} />
              6 → 1 consolidated
            </span>
          </div>
        </div>
        <div
          className="mx-auto h-2 rounded-b-md mt-px"
          style={{
            width: "20%",
            background: "linear-gradient(180deg, #475569, #1F2937)",
          }}
        />
      </div>
    </motion.div>
  );
}

function Telemetry({
  label,
  value,
  accent = true,
  danger = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className="rounded px-1.5 py-1 leading-none"
      style={{ background: PAPER_WARM, border: `1px solid ${LINE}` }}
    >
      <div className="text-[5.5px] font-mono uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
        {label}
      </div>
      <div
        className="text-[9px] font-bold tabular-nums mt-0.5"
        style={{ color: danger ? "#D97706" : accent ? ACCENT_DEEP : INK }}
      >
        {value}
      </div>
    </div>
  );
}

/* ─── Scene 3 — ALERT (downtime + WhatsApp page-out + restart) ─────────── */

function AlertScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative w-[78%] max-w-[440px]"
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-[0_24px_50px_-22px_rgba(31,41,55,0.4)]"
        style={{ background: "white", border: `1px solid ${LINE}` }}
      >
        <motion.div
          animate={reduced ? undefined : { background: ["#DC2626", "#EF4444", "#DC2626"] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="px-3 py-2 flex items-center gap-2 text-white"
          style={{ background: "#DC2626" }}
        >
          <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.5} />
          <div className="leading-tight flex-1">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.14em]">Line 03 · downtime</div>
            <div className="text-[7.5px] opacity-90">Bearing temp 92°C — auto-stop triggered</div>
          </div>
          <span className="font-mono text-[8px] tabular-nums px-1 py-0.5 rounded bg-white/20">
            14:36
          </span>
        </motion.div>

        <div className="grid grid-cols-5 gap-2 p-2">
          <div className="col-span-3 space-y-1.5">
            <StatusRow label="Detection"   value="11s"                    delay={0.2} accent="#16A34A"     reduced={reduced} />
            <StatusRow label="Tech paged"  value="Diego R. · 4 min ETA"   delay={0.5} accent={ACCENT_DEEP} icon={HardHat} reduced={reduced} />
            <StatusRow label="Work order"  value="WO-2841 · drafted"      delay={0.8} accent={INK_SOFT}   icon={Wrench}  reduced={reduced} />
            <StatusRow label="Loss avoided" value="$1,820"                delay={1.1} accent={ACCENT_DEEP} bold           reduced={reduced} />
            <motion.div
              initial={reduced ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              className="mt-1.5 rounded-md px-2.5 py-1.5 flex items-center gap-2"
              style={{
                background: "#16A34A",
                color: "white",
                boxShadow: "0 8px 18px -6px rgba(22,163,74,0.45)",
              }}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 grid place-items-center">
                <Check className="w-3 h-3" strokeWidth={3} />
              </span>
              <div className="leading-tight flex-1">
                <div className="text-[7px] font-mono uppercase tracking-[0.16em] opacity-85">
                  Line 03 · restarted
                </div>
                <div className="text-[9px] font-bold">4 min · 14:40</div>
              </div>
              <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
            </motion.div>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
            className="col-span-2 rounded-lg overflow-hidden"
            style={{ background: "#0E8E70", border: `1px solid ${LINE}` }}
          >
            <div className="px-1.5 py-1 flex items-center gap-1 text-white">
              <span className="w-3 h-3 rounded-full grid place-items-center bg-white/20 text-white">
                <HardHat className="w-2 h-2" strokeWidth={2.5} />
              </span>
              <span className="text-[7px] font-bold leading-none">Tech · Diego R.</span>
            </div>
            <div className="bg-[#ECE5DD] p-1.5 space-y-1">
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.35 }}
                className="rounded px-1.5 py-1 ml-auto max-w-[88%]"
                style={{ background: "#DCF8C6" }}
              >
                <div className="text-[6.5px] leading-tight" style={{ color: INK }}>
                  L-03 bearing 92°C — head over?
                </div>
              </motion.div>
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.35 }}
                className="rounded px-1.5 py-1 mr-auto max-w-[88%]"
                style={{ background: "white" }}
              >
                <div className="text-[6.5px] leading-tight" style={{ color: INK }}>
                  On it 🛠️ ETA 4
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusRow({
  label,
  value,
  delay,
  accent,
  icon: Icon,
  bold = false,
  reduced,
}: {
  label: string;
  value: string;
  delay: number;
  accent: string;
  icon?: typeof Wrench;
  bold?: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md"
      style={{ background: PAPER_WARM, border: `1px solid ${LINE}` }}
    >
      {Icon ? (
        <Icon className="w-3 h-3 shrink-0" style={{ color: accent }} strokeWidth={2.2} />
      ) : (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: accent }}
        />
      )}
      <span className="font-mono text-[7.5px] uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
        {label}
      </span>
      <span
        className="ml-auto tabular-nums"
        style={{
          color: bold ? accent : INK,
          fontSize: bold ? 11 : 9,
          fontWeight: bold ? 700 : 600,
        }}
      >
        {value}
      </span>
    </motion.div>
  );
}
