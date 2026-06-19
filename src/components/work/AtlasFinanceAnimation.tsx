"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ClipboardCopy,
  Database,
  FileSpreadsheet,
  Mail,
  Receipt,
  Workflow,
  Zap,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * Atlas Finance Group — three real scenes, same tangible-device + cream
 * paper language as Northwind, Aurelia, Loomly and Kindred.
 *
 *   1) manual   "Before" — Excel reconciliation chaos: 3 spreadsheets
 *               half-cropped, copy-paste indicator bouncing between them,
 *               a mismatch flagged in red, a stressed close-cycle counter.
 *   2) fabric   "After" — n8n-style flow editor. HubSpot, Stripe, Quick-
 *               Books, accounting docs feed into a central Atlas Hub node;
 *               data packets animate along the wires.
 *   3) close    Close cycle compressed 11d → 3d on a calendar grid, with
 *               a "210 workflows live" tally and "-96% manual entries"
 *               KPIs lifting in. */

const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "manual" | "fabric" | "close";
const PHASES: Phase[] = ["manual", "fabric", "close"];
const DUR: Record<Phase, number> = {
  manual: 4800,
  fabric: 5400,
  close: 4800,
};

const ACCENT = "#547A95";
const ACCENT_DEEP = "#2C3947";
const INK = "#1F2937";
const INK_SOFT = "rgba(31,41,55,0.55)";
const PAPER = "#FAF6EC";
const PAPER_WARM = "#F1ECDF";
const LINE = "rgba(31,41,55,0.10)";

const CAPTIONS: Record<Phase, string> = {
  manual: "01 · Manual recon · 3 tools, 11 day close",
  fabric: "02 · n8n fabric · 210 workflows live",
  close: "03 · Close cycle 11d → 3d",
};

export function AtlasFinanceAnimation({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("manual");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase("close");
      return;
    }
    const id = window.setTimeout(() => {
      setPhase((p) => {
        const next = PHASES[(PHASES.indexOf(p) + 1) % PHASES.length];
        if (next === "manual") setCycle((c) => c + 1);
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
          Finance ops · integrations
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
          {phase === "manual" && <ManualScene key={`m-${cycle}`} reduced={!!reduced} />}
          {phase === "fabric" && <FabricScene key={`f-${cycle}`} reduced={!!reduced} />}
          {phase === "close" && <CloseScene key={`c-${cycle}`} reduced={!!reduced} />}
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

/* ─── Scene 1 — MANUAL (3 spreadsheets, copy-paste indicator, mismatch) ── */

const SPREADSHEETS = [
  {
    name: "HubSpot · revenue.csv",
    color: "#F97316",
    pos: { left: "2%", top: "8%" },
    rotate: -4,
    rows: [
      { a: "ACME-001", b: "$12,400", flag: false },
      { a: "INV-2849",  b: "$8,720",  flag: false },
      { a: "ORB-118",   b: "$1,840",  flag: true  },
      { a: "VEX-220",   b: "$3,250",  flag: false },
    ],
  },
  {
    name: "Stripe · payouts.csv",
    color: "#635BFF",
    pos: { left: "32%", top: "20%" },
    rotate: 3,
    rows: [
      { a: "po_1QmA…", b: "$12,400", flag: false },
      { a: "po_1QmB…", b: "$8,710",  flag: true  },
      { a: "po_1QmC…", b: "$1,820",  flag: false },
      { a: "po_1QmD…", b: "$3,250",  flag: false },
    ],
  },
  {
    name: "QuickBooks · journal.csv",
    color: "#2CA01C",
    pos: { right: "2%", top: "10%" },
    rotate: 5,
    rows: [
      { a: "JE-4001", b: "$12,400", flag: false },
      { a: "JE-4002", b: "$8,720",  flag: false },
      { a: "JE-4003", b: "—",       flag: true  },
      { a: "JE-4004", b: "$3,250",  flag: false },
    ],
  },
];

function ManualScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative w-[82%] h-[70%] max-w-[480px]"
    >
      {/* Stressed counter at the top */}
      <div
        className="absolute -top-1 left-2 px-1.5 py-0.5 rounded font-mono text-[7.5px] uppercase tracking-[0.16em] flex items-center gap-1.5 z-30"
        style={{ background: "#FEE2E2", color: "#B91C1C", border: "1px solid #FCA5A5" }}
      >
        <ClipboardCopy className="w-2.5 h-2.5" strokeWidth={2.5} />
        Manual entries · day 9 / 11
      </div>

      {/* Three spreadsheet cards, slightly overlapping */}
      {SPREADSHEETS.map((s, i) => (
        <motion.div
          key={s.name}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.1, duration: 0.45 }}
          className="absolute w-[42%] max-w-[180px] rounded-md overflow-hidden shadow-[0_8px_18px_-4px_rgba(31,41,55,0.3)]"
          style={{
            ...s.pos,
            transform: `rotate(${s.rotate}deg)`,
            background: "white",
            border: `1px solid ${LINE}`,
          }}
        >
          {/* Spreadsheet header */}
          <div
            className="px-1.5 py-1 flex items-center gap-1 text-white"
            style={{ background: s.color }}
          >
            <FileSpreadsheet className="w-2.5 h-2.5" strokeWidth={2.5} />
            <span className="text-[6.5px] font-bold uppercase tracking-[0.12em] truncate">
              {s.name}
            </span>
          </div>
          {/* Rows */}
          <table className="w-full text-[6.5px]" style={{ color: INK }}>
            <tbody>
              {s.rows.map((r, ri) => (
                <tr
                  key={ri}
                  className="border-t"
                  style={{
                    borderColor: LINE,
                    background: r.flag ? "rgba(220,38,38,0.08)" : "transparent",
                  }}
                >
                  <td className="px-1.5 py-0.5 font-mono tabular-nums">
                    {r.a}
                  </td>
                  <td className="px-1.5 py-0.5 text-right font-mono tabular-nums">
                    {r.b}
                  </td>
                  <td className="pr-1.5 py-0.5 text-right">
                    {r.flag ? (
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ background: "#DC2626" }}
                      />
                    ) : (
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ background: "#16A34A" }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ))}

      {/* Animated copy-paste indicator bouncing between cards */}
      {!reduced && (
        <motion.div
          className="absolute z-20"
          initial={{ left: "16%", top: "44%", opacity: 0 }}
          animate={{
            left: ["16%", "44%", "72%", "44%", "16%"],
            top:  ["44%", "52%", "44%", "30%", "44%"],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{ duration: 4.4, ease: "easeInOut", repeat: 0 }}
        >
          <div
            className="px-1.5 py-1 rounded-md flex items-center gap-1 shadow-[0_6px_14px_-4px_rgba(31,41,55,0.35)]"
            style={{
              background: "white",
              border: `1px solid ${ACCENT}55`,
              color: INK,
            }}
          >
            <ClipboardCopy className="w-2.5 h-2.5" style={{ color: ACCENT_DEEP }} strokeWidth={2.5} />
            <span className="text-[6.5px] font-mono">Ctrl + V</span>
          </div>
        </motion.div>
      )}

      {/* Mismatch note bottom */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.45 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded font-mono text-[7.5px] uppercase tracking-[0.14em]"
        style={{
          background: "white",
          color: "#B91C1C",
          border: `1px solid #FCA5A5`,
          boxShadow: "0 4px 10px -3px rgba(31,41,55,0.2)",
        }}
      >
        3 mismatches · close blocked
      </motion.div>
    </motion.div>
  );
}

/* ─── Scene 2 — FABRIC (n8n flow editor, nodes wired to Atlas Hub) ────── */

type Node = {
  key: string;
  label: string;
  sub: string;
  Icon: typeof Mail;
  color: string;
  pos: { x: number; y: number };
};

const NODES: Node[] = [
  { key: "hub",     label: "HubSpot",    sub: "עסקאות",     Icon: Database,        color: "#F97316", pos: { x: 12, y: 24 } },
  { key: "stripe",  label: "Stripe",     sub: "תשלומים",    Icon: Receipt,         color: "#635BFF", pos: { x: 14, y: 70 } },
  { key: "qb",      label: "QuickBooks", sub: "יומן רישום", Icon: FileSpreadsheet, color: "#2CA01C", pos: { x: 86, y: 24 } },
  { key: "mail",    label: "אימייל",      sub: "חשבוניות",   Icon: Mail,            color: "#8CA0B3", pos: { x: 86, y: 70 } },
];

const ATLAS_HUB = { x: 50, y: 48 };

function FabricScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative w-[82%] max-w-[480px]"
      style={{ transform: "rotateX(2deg) rotateY(-1deg)" }}
    >
      <div
        className="relative rounded-xl overflow-hidden shadow-[0_24px_50px_-22px_rgba(31,41,55,0.35)]"
        style={{
          background: PAPER,
          border: `1px solid ${LINE}`,
          aspectRatio: "16 / 10",
        }}
      >
        {/* App chrome */}
        <div
          className="flex items-center gap-1.5 px-2 py-1.5 border-b"
          style={{ borderColor: LINE, background: "white" }}
        >
          <Workflow className="w-3 h-3" style={{ color: ACCENT_DEEP }} strokeWidth={2.4} />
          <span className="text-[7.5px] font-semibold tracking-[0.16em] uppercase" style={{ color: INK }}>
            n8n · reconciliation
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-[6.5px] font-mono uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
            <span className="w-1 h-1 rounded-full" style={{ background: "#16A34A" }} />
            210 workflows · live
          </span>
        </div>

        {/* Canvas with subtle dot grid */}
        <div
          className="relative w-full"
          style={{
            height: "calc(100% - 22px)",
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(31,41,55,0.18) 1px, transparent 0)",
            backgroundSize: "12px 12px",
          }}
        >
          {/* SVG wires */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {NODES.map((n, i) => {
              const path = `M ${n.pos.x} ${n.pos.y} Q ${(n.pos.x + ATLAS_HUB.x) / 2} ${
                (n.pos.y + ATLAS_HUB.y) / 2 + (i % 2 === 0 ? -10 : 10)
              } ${ATLAS_HUB.x} ${ATLAS_HUB.y}`;
              return (
                <g key={n.key}>
                  <path
                    d={path}
                    fill="none"
                    stroke={`${ACCENT}55`}
                    strokeWidth="0.4"
                    strokeDasharray="1.4 1.2"
                  />
                  {!reduced && (
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={n.color}
                      strokeWidth="0.55"
                      strokeLinecap="round"
                      strokeDasharray="0.6 10"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -10.6 * 6 }}
                      transition={{ duration: 2 + i * 0.25, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Source nodes */}
          {NODES.map((n, i) => (
            <motion.div
              key={n.key}
              initial={reduced ? false : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${n.pos.x}%`, top: `${n.pos.y}%` }}
            >
              <div
                className="rounded-md px-2 py-1 flex items-center gap-1.5 shadow-[0_6px_14px_-4px_rgba(31,41,55,0.3)]"
                style={{
                  background: "white",
                  border: `1px solid ${n.color}55`,
                  minWidth: 64,
                }}
              >
                <span
                  className="w-4 h-4 rounded grid place-items-center text-white shrink-0"
                  style={{ background: n.color }}
                >
                  <n.Icon className="w-2.5 h-2.5" strokeWidth={2.4} />
                </span>
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="text-[7px] font-bold truncate" style={{ color: INK }}>
                    {n.label}
                  </div>
                  <div className="text-[5.5px] font-mono uppercase tracking-[0.1em] truncate" style={{ color: INK_SOFT }}>
                    {n.sub}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Central Atlas Hub */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: `${ATLAS_HUB.x}%`, top: `${ATLAS_HUB.y}%` }}
          >
            <div className="relative">
              {/* halo */}
              {!reduced && (
                <motion.span
                  className="absolute -inset-2 rounded-full"
                  animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: `radial-gradient(circle, ${ACCENT}55, transparent 70%)`,
                  }}
                />
              )}
              <div
                className="relative rounded-full px-2.5 py-1.5 flex items-center gap-1 text-white shadow-[0_10px_20px_-4px_rgba(44,57,71,0.55)]"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})`,
                  border: `2px solid white`,
                }}
              >
                <Zap className="w-2.5 h-2.5" strokeWidth={2.5} />
                <span className="text-[7.5px] font-bold uppercase tracking-[0.18em]">מרכז נתונים</span>
              </div>
            </div>
          </motion.div>

          {/* Bottom n8n status bar */}
          <div className="absolute bottom-1 inset-x-1.5 flex items-center justify-between text-[6.5px] font-mono uppercase tracking-[0.12em]" style={{ color: INK_SOFT }}>
            <span>node 4 · syncing</span>
            <span className="inline-flex items-center gap-1">
              <Check className="w-2.5 h-2.5" style={{ color: "#16A34A" }} strokeWidth={2.5} />
              0 mismatches
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Scene 3 — CLOSE (calendar showing 11d → 3d compression + KPIs) ──── */

const CLOSE_DAYS = Array.from({ length: 11 }, (_, i) => i + 1);

function CloseScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative w-[82%] max-w-[460px]"
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-[0_24px_50px_-22px_rgba(31,41,55,0.35)]"
        style={{ background: "white", border: `1px solid ${LINE}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})`,
            color: "white",
          }}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span className="text-[10px] font-bold tracking-[0.16em]">סגירה חודשית</span>
          </div>
          <span className="text-[8px] font-mono uppercase tracking-[0.18em] opacity-85">
            Before / after
          </span>
        </div>

        {/* Body */}
        <div className="px-3 py-3 space-y-2.5">
          {/* Before row: 11 days */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[7px] font-mono uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
              <span>Before · manual</span>
              <span>11 days</span>
            </div>
            <div className="flex gap-[2px]">
              {CLOSE_DAYS.map((d, i) => (
                <motion.span
                  key={`b-${d}`}
                  initial={reduced ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.15 + i * 0.03, duration: 0.3 }}
                  className="flex-1 h-3 rounded-sm origin-bottom"
                  style={{ background: "#DC2626", opacity: 0.85 }}
                />
              ))}
            </div>
            <div className="flex gap-[2px] text-[5.5px] font-mono tabular-nums" style={{ color: INK_SOFT }}>
              {CLOSE_DAYS.map((d) => (
                <span key={`bl-${d}`} className="flex-1 text-center">d{d}</span>
              ))}
            </div>
          </div>

          {/* After row: 3 days highlighted */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[7px] font-mono uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
              <span>After · automated</span>
              <span style={{ color: "#16A34A", fontWeight: 700 }}>3 days · −73%</span>
            </div>
            <div className="flex gap-[2px]">
              {CLOSE_DAYS.map((d, i) => (
                <motion.span
                  key={`a-${d}`}
                  initial={reduced ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.6 + i * 0.03, duration: 0.3 }}
                  className="flex-1 h-3 rounded-sm origin-bottom"
                  style={{
                    background: i < 3 ? "#16A34A" : "rgba(31,41,55,0.08)",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-[2px] text-[5.5px] font-mono tabular-nums" style={{ color: INK_SOFT }}>
              {CLOSE_DAYS.map((d) => (
                <span key={`al-${d}`} className="flex-1 text-center">d{d}</span>
              ))}
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <KpiTile label="תהליכים פעילים"     from="0"       to="210"     delay={1.2} color={ACCENT_DEEP} reduced={reduced} />
            <KpiTile label="רישומים ידניים בחודש" from="100"     to="−96%"   delay={1.4} color="#16A34A"     reduced={reduced} />
            <KpiTile label="מחזור סגירה"        from="11 ימים"  to="3 ימים"  delay={1.6} color={ACCENT}      reduced={reduced} />
          </div>
        </div>

        {/* Footer confirmation */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.45 }}
          className="px-3 py-2 flex items-center gap-2"
          style={{ background: PAPER_WARM, borderTop: `1px solid ${LINE}` }}
        >
          <span className="w-5 h-5 rounded-full grid place-items-center text-white"
            style={{ background: "#16A34A" }}
          >
            <Check className="w-3 h-3" strokeWidth={3} />
          </span>
          <span className="text-[8px] font-mono uppercase tracking-[0.14em]" style={{ color: INK }}>
            Q3 close · day 3 · sign-off ready
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function KpiTile({
  label,
  from,
  to,
  delay,
  color,
  reduced,
}: {
  label: string;
  from: string;
  to: string;
  delay: number;
  color: string;
  reduced: boolean;
}) {
  const [value, setValue] = useState(reduced ? to : from);
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setValue(to), delay * 1000 + 300);
    return () => window.clearTimeout(id);
  }, [reduced, delay, to]);
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
      className="rounded-md px-2 py-1.5"
      style={{ background: PAPER_WARM, border: `1px solid ${LINE}` }}
    >
      <div className="text-[6.5px] font-mono uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
        {label}
      </div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <motion.span
          key={value}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[12px] font-bold tabular-nums"
          style={{ color }}
        >
          {value}
        </motion.span>
        {value !== from && (
          <ArrowRight className="w-2.5 h-2.5 opacity-30" strokeWidth={2.5} />
        )}
      </div>
    </motion.div>
  );
}
