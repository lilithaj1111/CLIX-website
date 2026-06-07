"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Check,
  CheckCheck,
  ChevronLeft,
  MapPin,
  MessageCircle,
  Truck,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * Northwind Logistics — three real scenes, light cream stage:
 *
 *   1) chat       Inbound WhatsApp message lands on the agent's queue.
 *   2) dispatch   Live ops cockpit: route from CHI → DAL renders on a
 *                 simplified US map, available trucks resolve, quote
 *                 calculates in real time.
 *   3) booked     Booking receipt card lifts in, stamped "BOOKED" with
 *                 trucker + ETA + load number filled.
 *
 * No abstract orbs / spark fans / dark backgrounds. Each phase is a real
 * product moment, and the transitions are story beats (message arrives →
 * agent processes → load confirmed) so the viewer reads the workflow
 * without a caption. */

const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "chat" | "dispatch" | "booked";

const PHASES: Phase[] = ["chat", "dispatch", "booked"];
const DUR: Record<Phase, number> = {
  chat: 5200,
  dispatch: 5800,
  booked: 4800,
};

// Light palette — cream paper surface, slate ink text, warm slate-blue accent.
const ACCENT = "#547A95";
const ACCENT_DEEP = "#2C3947";
const INK = "#1F2937";
const INK_SOFT = "rgba(31,41,55,0.55)";
const PAPER = "#FAF6EC";
const PAPER_WARM = "#F1ECDF";
const LINE = "rgba(31,41,55,0.10)";
const WHATSAPP = "#0E8E70";

const CAPTIONS: Record<Phase, string> = {
  chat: "01 · Inbound on WhatsApp",
  dispatch: "02 · Quoting CHI → DAL · live",
  booked: "03 · Load #BL-2841 booked",
};

export function NorthwindAgentAnimation({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("chat");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase("booked");
      return;
    }
    const id = window.setTimeout(() => {
      setPhase((p) => {
        const next = PHASES[(PHASES.indexOf(p) + 1) % PHASES.length];
        if (next === "chat") setCycle((c) => c + 1);
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
      {/* Subtle paper grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(31,41,55,0.45) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />
      {/* Faint horizon line */}
      <div
        aria-hidden
        className="absolute inset-x-[8%] bottom-[18%] h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${LINE}, transparent)` }}
      />

      {/* Top-left agent label */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-8 z-20 hidden md:flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: ACCENT, boxShadow: `0 0 10px ${ACCENT}aa` }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: INK_SOFT }}
        >
          Sales agent · WhatsApp
        </span>
      </div>

      {/* Top-right live status */}
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

      {/* Stage */}
      <div className="absolute inset-0 flex items-center justify-center pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          {phase === "chat" && <ChatScene key={`chat-${cycle}`} reduced={!!reduced} />}
          {phase === "dispatch" && <DispatchScene key={`dispatch-${cycle}`} reduced={!!reduced} />}
          {phase === "booked" && <BookedScene key={`booked-${cycle}`} reduced={!!reduced} />}
        </AnimatePresence>
      </div>

      {/* Bottom caption */}
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

/* ────────────────────────────────────────────────────────────────────────────
 * Scene 1 — CHAT
 * A clean iPhone-shaped chat sheet showing the inbound conversation. Messages
 * slide in from their respective sides on real timing; an AI-typing pill
 * appears between user turns; double-checkmark read-receipts tick blue. */

const CHAT_MESSAGES: Array<
  | { kind: "msg"; from: "client" | "agent"; text: string; at: number }
  | { kind: "typing"; at: number; out: number }
> = [
  { kind: "msg", from: "client", text: "Need a truck CHI → DAL Fri", at: 0.25 },
  { kind: "msg", from: "client", text: "26t, dry van, by 14:00", at: 1.05 },
  { kind: "typing", at: 1.8, out: 2.5 },
  { kind: "msg", from: "agent", text: "On it. Checking lanes now.", at: 2.5 },
  { kind: "msg", from: "agent", text: "Spot quote $1,840 — confirm?", at: 3.4 },
  { kind: "msg", from: "client", text: "Book it 👍", at: 4.2 },
];

function ChatScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative w-[240px] sm:w-[280px]"
      style={{ transform: "rotateX(2deg) rotateY(-2deg)" }}
    >
      {/* Phone shell */}
      <div
        className="relative rounded-[28px] p-1.5 shadow-[0_24px_44px_-18px_rgba(31,41,55,0.35)]"
        style={{
          background: `linear-gradient(180deg, ${PAPER}, #E7E0CE)`,
          border: `1px solid ${LINE}`,
        }}
      >
        {/* Notch */}
        <span
          className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full z-10"
          style={{ background: INK }}
        />
        {/* Screen */}
        <div
          className="relative rounded-[22px] overflow-hidden"
          style={{ background: "#ECE5DD", aspectRatio: "9 / 16" }}
        >
          {/* WhatsApp header */}
          <div
            className="flex items-center gap-2 px-3 pt-6 pb-2 text-paper"
            style={{ background: WHATSAPP }}
          >
            <ChevronLeft className="w-3 h-3" strokeWidth={2.5} />
            <span
              className="w-6 h-6 rounded-full grid place-items-center"
              style={{
                background:
                  `linear-gradient(135deg, #FCD34D, #F59E0B)`,
              }}
            >
              <span className="text-[8px] font-bold text-white">R</span>
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[9.5px] font-semibold leading-tight truncate">
                Robin · Logistics
              </div>
              <div className="text-[7px] opacity-80 leading-tight">online</div>
            </div>
          </div>

          {/* Conversation pane */}
          <div
            className="relative px-2 py-2 space-y-1.5 overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(14,142,112,0.05) 1px, transparent 2px), radial-gradient(circle at 60% 70%, rgba(14,142,112,0.04) 1px, transparent 2px), #ECE5DD",
              backgroundSize: "14px 14px",
              minHeight: "230px",
            }}
          >
            {CHAT_MESSAGES.map((item, i) => {
              if (item.kind === "msg") {
                const isClient = item.from === "client";
                return (
                  <motion.div
                    key={`m-${i}`}
                    initial={reduced ? false : { opacity: 0, y: 4, x: isClient ? -6 : 6 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{
                      delay: reduced ? 0 : item.at,
                      duration: 0.4,
                      ease: EASE,
                    }}
                    className={`max-w-[80%] ${isClient ? "mr-auto" : "ml-auto"}`}
                  >
                    <div
                      className={`relative px-2 py-1 text-[8.5px] leading-tight rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.08)]`}
                      style={{
                        background: isClient ? "#FFFFFF" : "#DCF8C6",
                        borderTopLeftRadius: isClient ? 2 : 6,
                        borderTopRightRadius: isClient ? 6 : 2,
                        color: INK,
                      }}
                    >
                      {item.text}
                      <div className="mt-0.5 flex items-center justify-end gap-0.5 text-[6.5px]" style={{ color: INK_SOFT }}>
                        <span>09:4{i}</span>
                        {!isClient && (
                          <CheckCheck className="w-2.5 h-2.5" strokeWidth={2.5} style={{ color: "#34B7F1" }} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              }
              // typing pill
              return (
                <motion.div
                  key={`t-${i}`}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    delay: reduced ? 0 : item.at,
                    duration: item.out - item.at,
                    times: [0, 0.1, 0.85, 1],
                  }}
                  className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                >
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="block w-1 h-1 rounded-full"
                      style={{ background: INK_SOFT }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, delay: d * 0.15, repeat: Infinity }}
                    />
                  ))}
                </motion.div>
              );
            })}
          </div>

          {/* Input bar */}
          <div className="absolute bottom-0 inset-x-0 flex items-center gap-1.5 px-2 py-1.5 bg-white">
            <span className="block flex-1 h-3.5 rounded-full" style={{ background: PAPER_WARM }} />
            <span className="w-4 h-4 rounded-full grid place-items-center" style={{ background: WHATSAPP }}>
              <MessageCircle className="w-2 h-2 text-white" strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Scene 2 — DISPATCH
 * Live ops cockpit. A simplified US map silhouette on the left with two
 * pulsing markers (CHI origin, DAL destination), a dashed great-circle
 * route that draws across, and a small truck icon travelling along the
 * route. On the right: three quote-calculation rows that resolve in
 * sequence (distance → trucks available → spot rate) with a final price
 * landing in a pill. */

function DispatchScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative w-[78%] max-w-[460px]"
    >
      <div
        className="relative rounded-2xl p-3 sm:p-4 shadow-[0_24px_50px_-22px_rgba(31,41,55,0.35)]"
        style={{
          background: `linear-gradient(180deg, ${PAPER} 0%, ${PAPER_WARM} 100%)`,
          border: `1px solid ${LINE}`,
        }}
      >
        {/* Card chrome */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#EF4444]" />
            <span className="w-1 h-1 rounded-full bg-[#F59E0B]" />
            <span className="w-1 h-1 rounded-full bg-[#22C55E]" />
            <span className="ml-2 font-mono text-[8px] uppercase tracking-[0.16em]" style={{ color: INK_SOFT }}>
              dispatch · live quote
            </span>
          </div>
          <span className="font-mono text-[8px] tabular-nums" style={{ color: INK_SOFT }}>
            FRI · 09:42
          </span>
        </div>

        {/* Body */}
        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          {/* Map (3/5) */}
          <div className="col-span-3 relative aspect-[5/3] rounded-lg overflow-hidden"
            style={{ background: "#F5EFE0", border: `1px solid ${LINE}` }}
          >
            {/* Map outline — a simplified blob approximating US contiguous */}
            <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <path
                d="M 4,18 C 8,10 16,6 28,8 L 60,4 C 78,4 90,12 92,22 L 96,40 C 92,48 80,54 64,52 L 30,54 C 16,52 6,46 4,36 Z"
                fill="rgba(31,41,55,0.06)"
                stroke="rgba(31,41,55,0.18)"
                strokeWidth="0.3"
              />
              {/* great-circle dashed route, drawn on view enter */}
              <motion.path
                d="M 30,22 Q 50,32 70,40"
                fill="none"
                stroke={ACCENT}
                strokeWidth="0.6"
                strokeDasharray="2 1.6"
                strokeLinecap="round"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            {/* Origin / destination markers (HTML so labels read crisply) */}
            <PinMarker x={30} y={36} label="CHI" pulse={!reduced} />
            <PinMarker x={70} y={66} label="DAL" pulse={!reduced} accent="#16A34A" />
            {/* Truck travelling along the route */}
            {!reduced && (
              <motion.div
                className="absolute"
                style={{ left: "30%", top: "36%", marginLeft: "-6px", marginTop: "-6px" }}
                animate={{ left: ["30%", "50%", "70%"], top: ["36%", "52%", "66%"] }}
                transition={{ duration: 3.6, delay: 0.6, ease: "easeInOut", repeat: 1 }}
              >
                <div
                  className="w-3 h-3 rounded-sm grid place-items-center shadow-[0_2px_4px_rgba(31,41,55,0.3)]"
                  style={{ background: ACCENT_DEEP }}
                >
                  <Truck className="w-2 h-2 text-white" strokeWidth={2.5} />
                </div>
              </motion.div>
            )}
            {/* Mileage callout */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.4 }}
              className="absolute left-1/2 top-[34%] -translate-x-1/2 px-1.5 py-0.5 rounded font-mono text-[7.5px] tabular-nums shadow-[0_2px_4px_rgba(31,41,55,0.18)]"
              style={{ background: "white", color: INK }}
            >
              925 mi · 14h
            </motion.div>
          </div>

          {/* Quote calculation panel (2/5) */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <QuoteRow delay={0.6} label="Lanes scanned" value="124" reduced={reduced} />
            <QuoteRow delay={1.1} label="Trucks available" value="04" reduced={reduced} accent />
            <QuoteRow delay={1.7} label="ETA" value="Fri 14:00" reduced={reduced} />
            <motion.div
              initial={reduced ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.3, duration: 0.45, ease: EASE }}
              className="mt-1 px-2 py-1.5 rounded-md flex items-center justify-between"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})`,
                color: "white",
                boxShadow: `0 8px 18px -6px ${ACCENT}aa`,
              }}
            >
              <span className="font-mono text-[7.5px] uppercase tracking-[0.16em] opacity-85">Quote</span>
              <span className="text-[12px] font-bold tabular-nums">$1,840</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PinMarker({
  x,
  y,
  label,
  pulse,
  accent = ACCENT,
}: {
  x: number;
  y: number;
  label: string;
  pulse: boolean;
  accent?: string;
}) {
  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -100%)" }}
    >
      <div className="relative flex flex-col items-center">
        <span
          className="w-3 h-3 rounded-full ring-2 ring-white grid place-items-center"
          style={{ background: accent, boxShadow: `0 0 0 3px ${accent}33` }}
        >
          <MapPin className="w-1.5 h-1.5 text-white" strokeWidth={2.5} />
        </span>
        {pulse && (
          <span
            className="absolute top-0 w-3 h-3 rounded-full"
            style={{ background: accent, animation: "pulse 1.6s ease-out infinite" }}
          />
        )}
        <span
          className="mt-0.5 px-1 rounded-sm font-mono text-[6.5px] font-semibold tracking-[0.16em]"
          style={{ background: "white", color: INK, boxShadow: `0 1px 2px rgba(0,0,0,0.15)` }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function QuoteRow({
  label,
  value,
  delay,
  accent = false,
  reduced,
}: {
  label: string;
  value: string;
  delay: number;
  accent?: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
      className="flex items-center justify-between px-2 py-1 rounded-md"
      style={{
        background: "white",
        border: `1px solid ${LINE}`,
      }}
    >
      <span className="font-mono text-[7.5px] uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
        {label}
      </span>
      <span
        className="text-[9px] font-semibold tabular-nums"
        style={{ color: accent ? ACCENT : INK }}
      >
        {value}
      </span>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Scene 3 — BOOKED
 * Receipt card lifts in. A green "BOOKED" stamp slams down with a small
 * rotation. Trucker assignment + ETA + load number fill in sequence. A
 * tiny "Robin" reply pops up confirming the booking. */

function BookedScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotate: -2, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.985 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative w-[260px] sm:w-[300px]"
      style={{ transform: "rotateX(2deg) rotateY(-1deg)" }}
    >
      {/* Receipt */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-[0_28px_50px_-22px_rgba(31,41,55,0.4)]"
        style={{
          background: "white",
          border: `1px solid ${LINE}`,
        }}
      >
        {/* Receipt header bar */}
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})`,
            color: "white",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-white/15 grid place-items-center">
              <Truck className="w-2.5 h-2.5" strokeWidth={2.5} />
            </span>
            <div className="leading-tight">
              <div className="text-[8px] font-mono uppercase tracking-[0.16em] opacity-80">Load</div>
              <div className="text-[10.5px] font-bold tabular-nums">BL-2841</div>
            </div>
          </div>
          <div className="text-right leading-tight">
            <div className="text-[8px] font-mono uppercase tracking-[0.16em] opacity-80">Status</div>
            <div className="text-[10px] font-bold">CONFIRMED</div>
          </div>
        </div>

        {/* Receipt body */}
        <div className="px-4 py-3 space-y-2">
          <ReceiptRow label="Route" value="CHI → DAL · 925 mi" delay={0.2} reduced={reduced} />
          <ReceiptRow label="Trucker" value="Avery · Reefer Logistics" delay={0.4} reduced={reduced} />
          <ReceiptRow label="ETA" value="Fri 14:00" delay={0.6} reduced={reduced} />
          <ReceiptRow label="Rate" value="$1,840" delay={0.8} reduced={reduced} bold />
        </div>

        {/* Tear-line */}
        <div className="relative h-2" style={{ background: PAPER_WARM }}>
          <span
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent 50%, ${LINE} 50%)`,
              backgroundSize: "6px 1px",
            }}
          />
        </div>

        {/* Footer with check */}
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: PAPER }}>
          <span className="font-mono text-[8px] uppercase tracking-[0.16em]" style={{ color: INK_SOFT }}>
            Booked by AI · agent
          </span>
          <motion.span
            initial={reduced ? false : { scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.0, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-5 h-5 rounded-full grid place-items-center"
            style={{ background: "#16A34A", boxShadow: "0 4px 10px -2px rgba(22,163,74,0.5)" }}
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.span>
        </div>

        {/* BOOKED stamp */}
        {!reduced && (
          <motion.div
            initial={{ scale: 1.8, opacity: 0, rotate: 18 }}
            animate={{ scale: 1, opacity: 1, rotate: -8 }}
            transition={{ delay: 1.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute right-4 top-[42%] px-2 py-1 rounded border-2 font-bold text-[14px] tracking-[0.14em] pointer-events-none"
            style={{
              color: "#16A34A",
              borderColor: "#16A34A",
              transform: "rotate(-8deg)",
              fontFamily: "monospace",
              opacity: 0.85,
            }}
          >
            BOOKED
          </motion.div>
        )}
      </div>

      {/* Robin's tiny confirm-thanks bubble floating in from the bottom-right */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.45, ease: EASE }}
        className="absolute -bottom-3 right-2 px-2 py-1 rounded-md text-[8px]"
        style={{
          background: "#DCF8C6",
          color: INK,
          boxShadow: "0 4px 10px -3px rgba(31,41,55,0.25)",
        }}
      >
        Robin · 👍 thanks
      </motion.div>
    </motion.div>
  );
}

function ReceiptRow({
  label,
  value,
  delay,
  bold = false,
  reduced,
}: {
  label: string;
  value: string;
  delay: number;
  bold?: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
      className="flex items-center justify-between"
    >
      <span className="font-mono text-[8.5px] uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
        {label}
      </span>
      <span
        className="tabular-nums"
        style={{
          color: INK,
          fontSize: bold ? 12 : 10,
          fontWeight: bold ? 700 : 500,
        }}
      >
        {value}
      </span>
    </motion.div>
  );
}
