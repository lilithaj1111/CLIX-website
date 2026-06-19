"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  FileText,
  Inbox,
  Search,
  Send,
  Sparkles,
  User,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * Kindred Care — three real scenes for an AI support copilot trained on
 * five years of tickets + internal docs + clinical guidelines.
 *
 *   1) ticket    A new ticket lands in the support inbox queue. Patient
 *                question about a medication interaction; agent sees the
 *                priority + sentiment + arrival time.
 *   2) draft     The agent's copilot workspace opens the ticket. A draft
 *                reply types out in the right pane, with three cited
 *                sources highlighted from the knowledge base (precedent
 *                ticket, internal SOP, clinical guideline).
 *   3) sent      Reply sent; ticket closed. KPIs along the bottom tick up
 *                (capacity 2.1×, first-reply quality +39%, knowledge
 *                coverage 94%). */

const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "ticket" | "draft" | "sent";
const PHASES: Phase[] = ["ticket", "draft", "sent"];
const DUR: Record<Phase, number> = {
  ticket: 4600,
  draft: 5800,
  sent: 4600,
};

const ACCENT = "#8CA0B3";
const ACCENT_DEEP = "#3D4A59";
const INK = "#222A33";
const INK_SOFT = "rgba(31,41,55,0.55)";
const PAPER = "#FAF6EC";
const PAPER_WARM = "#F1ECDF";
const LINE = "rgba(31,41,55,0.10)";

const CAPTIONS: Record<Phase, string> = {
  ticket: "01 · New ticket · patient · priority high",
  draft: "02 · AI drafts a reply · 3 sources cited",
  sent: "03 · Sent in 38s · KB coverage 94%",
};

export function KindredSupportAnimation({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("ticket");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase("sent");
      return;
    }
    const id = window.setTimeout(() => {
      setPhase((p) => {
        const next = PHASES[(PHASES.indexOf(p) + 1) % PHASES.length];
        if (next === "ticket") setCycle((c) => c + 1);
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
          style={{ background: ACCENT, boxShadow: `0 0 10px ${ACCENT}aa` }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: INK_SOFT }}
        >
          Support copilot · clinical KB
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
          {phase === "ticket" && <TicketScene key={`t-${cycle}`} reduced={!!reduced} />}
          {phase === "draft" && <DraftScene key={`d-${cycle}`} reduced={!!reduced} />}
          {phase === "sent" && <SentScene key={`s-${cycle}`} reduced={!!reduced} />}
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

/* ─── Scene 1 — TICKET (support inbox queue, new ticket arrives) ───────── */

const QUEUE: Array<{
  name: string;
  subject: string;
  age: string;
  priority: "low" | "med" | "high";
  unread?: boolean;
  isNew?: boolean;
}> = [
  { name: "Jamie L.",  subject: "Refill schedule question",         age: "12m", priority: "low" },
  { name: "Priya S.",  subject: "Insurance pre-auth doc",           age: "8m",  priority: "med" },
  { name: "Casey M.",  subject: "Drug interaction · sertraline",    age: "now", priority: "high", unread: true, isNew: true },
  { name: "Wren K.",   subject: "Appt reschedule (urgent care)",    age: "4m",  priority: "med" },
];

function TicketScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative w-[78%] max-w-[440px]"
      style={{ transform: "rotateX(2deg) rotateY(-2deg)" }}
    >
      <div
        className="relative rounded-[10px] p-1 shadow-[0_24px_50px_-22px_rgba(31,41,55,0.4)]"
        style={{
          background: `linear-gradient(180deg, #E2DBC7, #C8C0AA)`,
          border: `1px solid ${LINE}`,
        }}
      >
        <span
          className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ background: INK }}
        />
        <div
          className="relative rounded-md overflow-hidden"
          style={{ background: "white", aspectRatio: "16 / 10" }}
        >
          <div
            className="flex items-center gap-1.5 px-2 py-1.5 border-b"
            style={{ borderColor: LINE, background: "#F7F4ED" }}
          >
            <Inbox className="w-3 h-3" style={{ color: ACCENT_DEEP }} strokeWidth={2.4} />
            <span className="text-[7.5px] font-semibold tracking-[0.18em] uppercase" style={{ color: INK }}>
              Support inbox
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-[6.5px] font-mono" style={{ color: INK_SOFT }}>
              <span className="w-1 h-1 rounded-full" style={{ background: "#16A34A" }} />
              4 open
            </span>
          </div>

          {/* Inbox list */}
          <div className="divide-y" style={{ borderColor: LINE }}>
            {QUEUE.map((q, i) => (
              <motion.div
                key={q.name}
                initial={reduced ? false : q.isNew ? { opacity: 0, y: -8 } : { opacity: 0, x: 4 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{
                  delay: q.isNew ? 1.2 : 0.15 + i * 0.08,
                  duration: q.isNew ? 0.55 : 0.4,
                  ease: q.isNew ? [0.34, 1.56, 0.64, 1] : EASE,
                }}
                className="flex items-center gap-1.5 px-2 py-1.5"
                style={{
                  background: q.isNew ? "rgba(140,160,179,0.06)" : "white",
                  borderColor: LINE,
                }}
              >
                {q.unread ? (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}aa` }}
                  />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: LINE }} />
                )}
                <span
                  className="w-4 h-4 rounded-full grid place-items-center text-white text-[6.5px] font-bold shrink-0"
                  style={{
                    background:
                      i % 3 === 0 ? "#F59E0B" : i % 3 === 1 ? "#A855F7" : ACCENT,
                  }}
                >
                  {q.name.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[7.5px] font-semibold leading-none truncate"
                      style={{ color: INK }}
                    >
                      {q.name}
                    </span>
                    <span
                      className="text-[5.5px] font-mono uppercase tracking-[0.12em] px-1 py-px rounded-full"
                      style={{
                        background:
                          q.priority === "high"
                            ? "#FECACA"
                            : q.priority === "med"
                            ? "#FED7AA"
                            : PAPER_WARM,
                        color:
                          q.priority === "high"
                            ? "#B91C1C"
                            : q.priority === "med"
                            ? "#9A3412"
                            : INK_SOFT,
                      }}
                    >
                      {q.priority}
                    </span>
                  </div>
                  <div className="text-[7px] leading-none mt-1 truncate" style={{ color: INK_SOFT }}>
                    {q.subject}
                  </div>
                </div>
                <span className="text-[6px] font-mono tabular-nums shrink-0" style={{ color: INK_SOFT }}>
                  {q.age}
                </span>
              </motion.div>
            ))}
          </div>

          {/* footer */}
          <div className="absolute bottom-1 inset-x-2 flex items-center justify-between text-[6.5px] font-mono uppercase tracking-[0.12em]" style={{ color: INK_SOFT }}>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" strokeWidth={2.2} />
              avg first reply · 38s
            </span>
            <span>Showing 4 of 12</span>
          </div>
        </div>
        <div
          className="relative mt-1 mx-auto h-1.5 rounded-b-lg"
          style={{
            width: "118%",
            marginLeft: "-9%",
            background: "linear-gradient(180deg, #B4AB94 0%, #8C8470 100%)",
          }}
        />
      </div>

      {/* Toast — "AI copilot is preparing a draft" */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 0.5, ease: EASE }}
        className="absolute -bottom-2 right-2 sm:-bottom-3 sm:right-4 w-[58%] max-w-[220px] rounded-lg px-2 py-1.5 flex items-center gap-1.5 shadow-[0_10px_24px_-8px_rgba(31,41,55,0.35)]"
        style={{ background: "white", border: `1px solid ${LINE}` }}
      >
        <span
          className="w-5 h-5 rounded-full grid place-items-center text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})` }}
        >
          <Sparkles className="w-3 h-3" strokeWidth={2.5} />
        </span>
        <div className="flex-1 min-w-0 leading-tight">
          <div className="text-[7.5px] font-semibold" style={{ color: INK }}>
            Copilot · drafting reply
          </div>
          <div className="text-[6.5px]" style={{ color: INK_SOFT }}>
            scanning 5y of tickets…
          </div>
        </div>
        <span
          className="text-[6.5px] font-bold px-1 py-0.5 rounded uppercase tracking-[0.12em]"
          style={{ background: ACCENT_DEEP, color: "white" }}
        >
          Open
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Scene 2 — DRAFT (agent's copilot workspace, AI types reply + cites) */

const DRAFT_TYPING = "Hi Casey — sertraline + ibuprofen has a moderate interaction. Take ≥2h apart, and let us know if you notice any unusual bruising. — the care team";

const SOURCES = [
  { Icon: FileText, label: "Ticket #4128 · 2024",      kind: "Precedent" },
  { Icon: BookOpen, label: "SOP-08 · SSRI / NSAID",    kind: "Internal SOP" },
  { Icon: BookOpen, label: "AAFP · 2023 guideline",    kind: "Clinical" },
];

function DraftScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative w-[82%] max-w-[460px]"
      style={{ transform: "rotateX(2deg) rotateY(-2deg)" }}
    >
      <div
        className="relative rounded-[10px] p-1 shadow-[0_24px_50px_-22px_rgba(31,41,55,0.4)]"
        style={{
          background: `linear-gradient(180deg, #E2DBC7, #C8C0AA)`,
          border: `1px solid ${LINE}`,
        }}
      >
        <span
          className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ background: INK }}
        />
        <div
          className="relative rounded-md overflow-hidden"
          style={{ background: "white", aspectRatio: "16 / 10" }}
        >
          {/* App chrome */}
          <div
            className="flex items-center gap-1.5 px-2 py-1.5 border-b"
            style={{ borderColor: LINE, background: "#F7F4ED" }}
          >
            <span
              className="inline-flex items-center gap-1 text-[6.5px] font-mono uppercase tracking-[0.14em]"
              style={{ color: INK_SOFT }}
            >
              <ChevronRight className="w-2 h-2" strokeWidth={2.5} style={{ color: INK_SOFT }} />
              Inbox · Casey M. · Drug interaction
            </span>
            <span
              className="ml-auto inline-flex items-center gap-1 text-[6.5px] font-mono uppercase tracking-[0.14em]"
              style={{ color: ACCENT_DEEP }}
            >
              <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
              copilot active
            </span>
          </div>

          {/* Body — split */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 h-[calc(100%-22px)]">
            {/* Left — original customer message */}
            <div className="rounded-md p-1.5 flex flex-col gap-1" style={{ background: PAPER_WARM, border: `1px solid ${LINE}` }}>
              <div className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-full grid place-items-center text-[6px] font-bold text-white"
                  style={{ background: "#F59E0B" }}
                >
                  C
                </span>
                <span className="text-[7px] font-semibold" style={{ color: INK }}>
                  Casey M.
                </span>
                <span className="ml-auto text-[6px] font-mono" style={{ color: INK_SOFT }}>09:42</span>
              </div>
              <div
                className="text-[7px] leading-relaxed rounded p-1.5"
                style={{ background: "white", color: INK, border: `1px solid ${LINE}` }}
              >
                Hi — I just started sertraline and I have ibuprofen for headaches. Is it safe to take both?
              </div>
              {/* sentiment + intent chips */}
              <div className="flex items-center gap-1 mt-auto">
                <span className="px-1 py-px rounded-full text-[5.5px] font-mono uppercase tracking-[0.12em]" style={{ background: "#FECACA", color: "#B91C1C" }}>
                  high priority
                </span>
                <span className="px-1 py-px rounded-full text-[5.5px] font-mono uppercase tracking-[0.12em]" style={{ background: "white", color: INK_SOFT, border: `1px solid ${LINE}` }}>
                  clinical
                </span>
              </div>
            </div>

            {/* Right — copilot pane */}
            <div className="rounded-md p-1.5 flex flex-col gap-1" style={{ background: "white", border: `1px solid ${ACCENT}55` }}>
              <div className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-full grid place-items-center text-white"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})` }}
                >
                  <Sparkles className="w-1.5 h-1.5" strokeWidth={2.5} />
                </span>
                <span className="text-[7px] font-semibold" style={{ color: INK }}>
                  Copilot · draft
                </span>
                <span className="ml-auto text-[6px] font-mono inline-flex items-center gap-0.5" style={{ color: ACCENT_DEEP }}>
                  <Search className="w-2 h-2" strokeWidth={2.5} />
                  scanning
                </span>
              </div>
              {/* Typing draft */}
              <div
                className="text-[7px] leading-relaxed rounded p-1.5 flex-1 relative overflow-hidden"
                style={{ background: PAPER_WARM, color: INK, border: `1px solid ${LINE}` }}
              >
                <TypingText text={DRAFT_TYPING} reduced={reduced} />
              </div>
              {/* Cited sources */}
              <div className="space-y-0.5">
                {SOURCES.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={reduced ? false : { opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + i * 0.25, duration: 0.4 }}
                    className="flex items-center gap-1 rounded px-1.5 py-1"
                    style={{ background: "white", border: `1px solid ${LINE}` }}
                  >
                    <s.Icon className="w-2.5 h-2.5 shrink-0" style={{ color: ACCENT_DEEP }} strokeWidth={2.2} />
                    <div className="flex-1 min-w-0 leading-tight">
                      <div className="text-[6px] font-mono uppercase tracking-[0.12em] truncate" style={{ color: INK_SOFT }}>
                        {s.kind}
                      </div>
                      <div className="text-[7px] font-semibold truncate" style={{ color: INK }}>
                        {s.label}
                      </div>
                    </div>
                    <Check className="w-2.5 h-2.5" style={{ color: "#16A34A" }} strokeWidth={2.5} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative mt-1 mx-auto h-1.5 rounded-b-lg"
          style={{
            width: "118%",
            marginLeft: "-9%",
            background: "linear-gradient(180deg, #B4AB94 0%, #8C8470 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}

function TypingText({ text, reduced }: { text: string; reduced: boolean }) {
  const [n, setN] = useState(reduced ? text.length : 0);
  useEffect(() => {
    if (reduced) {
      setN(text.length);
      return;
    }
    setN(0);
    const start = Date.now();
    const totalMs = 2400;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const ratio = Math.min(1, elapsed / totalMs);
      const next = Math.floor(ratio * text.length);
      setN(next);
      if (ratio >= 1) window.clearInterval(id);
    }, 35);
    return () => window.clearInterval(id);
  }, [reduced, text.length]);
  return (
    <>
      {text.slice(0, n)}
      {!reduced && n < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-[1px] h-[8px] align-text-bottom ml-px"
          style={{ background: INK }}
        />
      )}
    </>
  );
}

/* ─── Scene 3 — SENT (reply sent, KPIs lift) ────────────────────────── */

function SentScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative w-[78%] max-w-[440px]"
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-[0_24px_50px_-22px_rgba(31,41,55,0.35)]"
        style={{ background: "white", border: `1px solid ${LINE}` }}
      >
        {/* Header — sent */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})`, color: "white" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-white/15 grid place-items-center">
              <Send className="w-2.5 h-2.5" strokeWidth={2.5} />
            </span>
            <div className="leading-tight">
              <div className="text-[8px] font-mono uppercase tracking-[0.16em] opacity-85">Reply sent</div>
              <div className="text-[10.5px] font-bold">Casey M. · #4892</div>
            </div>
          </div>
          <span className="font-mono text-[8px] tabular-nums px-1 py-0.5 rounded bg-white/20">
            38s · first reply
          </span>
        </div>

        {/* Body — outgoing message preview */}
        <div className="p-3 space-y-2">
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="ml-auto max-w-[88%] rounded-md px-2.5 py-1.5"
            style={{ background: "#DCF8C6", color: INK }}
          >
            <div className="text-[8.5px] leading-relaxed">
              Hi Casey — sertraline + ibuprofen has a moderate interaction. Take ≥2h apart, and let us know if you notice any unusual bruising. — the care team
            </div>
            <div className="mt-1 flex items-center justify-end gap-0.5 text-[6.5px]" style={{ color: INK_SOFT }}>
              <span>09:43</span>
              <Check className="w-2.5 h-2.5" strokeWidth={3} style={{ color: "#34B7F1" }} />
              <Check className="w-2.5 h-2.5 -ml-1.5" strokeWidth={3} style={{ color: "#34B7F1" }} />
            </div>
          </motion.div>

          {/* Escalation flag — gentle reminder */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="rounded-md px-2 py-1 flex items-center gap-1.5"
            style={{ background: "#FEF3C7", border: `1px solid #FDE68A` }}
          >
            <AlertCircle className="w-3 h-3" style={{ color: "#9A3412" }} strokeWidth={2.5} />
            <span className="text-[7.5px] leading-none" style={{ color: "#9A3412" }}>
              Flagged for nurse review · clinical follow-up scheduled
            </span>
          </motion.div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-1.5 px-3 pb-3">
          <KpiTile
            label="Capacity"
            from="1.0×"
            to="2.1×"
            delay={1.0}
            color={ACCENT_DEEP}
            reduced={reduced}
          />
          <KpiTile
            label="1st-reply quality"
            from="0%"
            to="+39%"
            delay={1.2}
            color="#16A34A"
            reduced={reduced}
          />
          <KpiTile
            label="KB coverage"
            from="62%"
            to="94%"
            delay={1.4}
            color={ACCENT}
            reduced={reduced}
            bar
          />
        </div>
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
  bar = false,
}: {
  label: string;
  from: string;
  to: string;
  delay: number;
  color: string;
  reduced: boolean;
  bar?: boolean;
}) {
  const [value, setValue] = useState(reduced ? to : from);
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setValue(to), delay * 1000 + 300);
    return () => window.clearTimeout(id);
  }, [reduced, delay, to]);
  // For bar tile, parse a numeric portion if present.
  const pct = bar ? parseInt(value.replace(/[^\d]/g, ""), 10) || 0 : 0;
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
      className="rounded-md px-2 py-1.5 flex flex-col gap-1"
      style={{ background: PAPER_WARM, border: `1px solid ${LINE}` }}
    >
      <div className="text-[6.5px] font-mono uppercase tracking-[0.14em] leading-none" style={{ color: INK_SOFT }}>
        {label}
      </div>
      <div className="flex items-baseline gap-1 leading-none">
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
      {bar && (
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(31,41,55,0.08)" }}>
          <motion.span
            initial={reduced ? false : { width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: delay + 0.3, duration: 0.9, ease: "easeOut" }}
            className="block h-full rounded-full"
            style={{ background: color }}
          />
        </div>
      )}
    </motion.div>
  );
}

const _UNUSED_KEEP = { User };
void _UNUSED_KEEP;
