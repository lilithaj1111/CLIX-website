"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronLeft,
  Heart,
  MessageCircle,
  Sparkles,
  User,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * Aurelia Aesthetic Clinics — three real scenes, light cream stage, same
 * tangible-device language as the Northwind animation.
 *
 *   1) alert     CRM dashboard on a laptop screen lights up with a
 *                no-show alert on a patient record.
 *   2) followup  Same WhatsApp-style phone as Northwind, but here the
 *                AI agent sends a warm rebook follow-up to the patient.
 *   3) rebooked  A weekly calendar grid with a new appointment slotting
 *                into Wednesday 11:00 + a green "recovered" confirmation. */

const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "alert" | "followup" | "rebooked";
const PHASES: Phase[] = ["alert", "followup", "rebooked"];
const DUR: Record<Phase, number> = {
  alert: 4800,
  followup: 5400,
  rebooked: 4800,
};

const ACCENT = "#845EF7";
const ACCENT_DEEP = "#3A46F0";
const ROSE = "#E4A0A8";
const ROSE_DEEP = "#B86A77";
const INK = "#1F2937";
const INK_SOFT = "rgba(31,41,55,0.55)";
const PAPER = "#FAF6EC";
const PAPER_WARM = "#F1ECDF";
const LINE = "rgba(31,41,55,0.10)";
const WHATSAPP = "#0E8E70";

const CAPTIONS: Record<Phase, string> = {
  alert: "01 · No-show flagged on the CRM",
  followup: "02 · AI agent · personalised rebook",
  rebooked: "03 · Slot recovered · Wed 11:00",
};

export function AureliaClinicAnimation({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("alert");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase("rebooked");
      return;
    }
    const id = window.setTimeout(() => {
      setPhase((p) => {
        const next = PHASES[(PHASES.indexOf(p) + 1) % PHASES.length];
        if (next === "alert") setCycle((c) => c + 1);
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
          style={{ background: ROSE_DEEP, boxShadow: `0 0 10px ${ROSE_DEEP}aa` }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: INK_SOFT }}
        >
          Clinic ops · CRM
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
          {phase === "alert" && <AlertScene key={`a-${cycle}`} reduced={!!reduced} />}
          {phase === "followup" && <FollowupScene key={`f-${cycle}`} reduced={!!reduced} />}
          {phase === "rebooked" && <RebookedScene key={`r-${cycle}`} reduced={!!reduced} />}
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

/* ─── Scene 1 — ALERT (laptop CRM with no-show) ────────────────────────── */

const PATIENTS = [
  { name: "Elena R.",  detail: "Botox · 09:00",   status: "done" as const },
  { name: "Tom W.",    detail: "Consult · 10:30", status: "done" as const },
  { name: "Maya Chen", detail: "Filler · 14:00",  status: "noshow" as const },
  { name: "Sara P.",   detail: "Laser · 15:30",   status: "upcoming" as const },
];

function AlertScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative w-[78%] max-w-[440px]"
      style={{ transform: "rotateX(2deg) rotateY(-3deg)" }}
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
            className="flex items-center gap-1 px-2 py-1.5 border-b"
            style={{ borderColor: LINE, background: "#F7F4ED" }}
          >
            <Sparkles className="w-2.5 h-2.5" style={{ color: ROSE_DEEP }} strokeWidth={2.5} />
            <span className="text-[7px] font-semibold tracking-[0.18em] uppercase" style={{ color: INK }}>
              CRM
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-[6.5px] font-mono" style={{ color: INK_SOFT }}>
              <span className="w-1 h-1 rounded-full" style={{ background: "#16A34A" }} />
              synced
            </span>
          </div>
          <div className="grid grid-cols-12 gap-1.5 p-1.5 h-[calc(100%-22px)]">
            <div className="col-span-2 flex flex-col gap-1">
              {[
                { Icon: User, active: true },
                { Icon: CalendarDays, active: false },
                { Icon: Heart, active: false },
                { Icon: MessageCircle, active: false },
              ].map((it, i) => (
                <span
                  key={i}
                  className="aspect-square rounded grid place-items-center"
                  style={{
                    background: it.active ? ROSE : PAPER_WARM,
                    color: it.active ? "white" : INK_SOFT,
                  }}
                >
                  <it.Icon className="w-2.5 h-2.5" strokeWidth={2.2} />
                </span>
              ))}
            </div>
            <div className="col-span-10 flex flex-col gap-1.5 min-w-0">
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { k: "Today", v: "12", c: ACCENT },
                  { k: "No-show", v: "1",  c: "#DC2626" },
                  { k: "Recovery", v: "41%", c: "#16A34A" },
                ].map((s, i) => (
                  <motion.div
                    key={s.k}
                    initial={reduced ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                    className="rounded px-1.5 py-1"
                    style={{ background: PAPER_WARM, border: `1px solid ${LINE}` }}
                  >
                    <div className="text-[6px] font-mono uppercase tracking-[0.14em] leading-none" style={{ color: INK_SOFT }}>
                      {s.k}
                    </div>
                    <div className="text-[10px] font-bold leading-none mt-0.5 tabular-nums" style={{ color: s.c }}>
                      {s.v}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex-1 rounded border overflow-hidden" style={{ borderColor: LINE, background: "#FFFFFF" }}>
                <div className="flex items-center justify-between px-1.5 py-1 border-b" style={{ borderColor: LINE, background: "#FCFAF4" }}>
                  <span className="text-[6px] font-mono uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
                    Today · 4 appointments
                  </span>
                  <span className="text-[6px] font-mono" style={{ color: INK_SOFT }}>15:08</span>
                </div>
                {PATIENTS.map((p, i) => {
                  const isAlert = p.status === "noshow";
                  return (
                    <motion.div
                      key={p.name}
                      initial={reduced ? false : { opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                      className="flex items-center gap-1.5 px-1.5 py-1 border-b last:border-b-0"
                      style={{
                        borderColor: LINE,
                        background: isAlert ? "rgba(220,38,38,0.06)" : "transparent",
                      }}
                    >
                      <span
                        className="w-3 h-3 rounded-full grid place-items-center text-[6px] font-bold text-white"
                        style={{ background: i % 2 === 0 ? ROSE : ACCENT }}
                      >
                        {p.name.charAt(0)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[7.5px] font-semibold leading-none truncate" style={{ color: INK }}>
                          {p.name}
                        </div>
                        <div className="text-[6.5px] leading-none mt-0.5 truncate" style={{ color: INK_SOFT }}>
                          {p.detail}
                        </div>
                      </div>
                      {isAlert ? (
                        <motion.span
                          animate={reduced ? undefined : { scale: [1, 1.08, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                          className="inline-flex items-center gap-0.5 px-1 py-px rounded-full"
                          style={{ background: "#DC2626", color: "white" }}
                        >
                          <AlertCircle className="w-2 h-2" strokeWidth={2.5} />
                          <span className="text-[5.5px] font-bold uppercase tracking-[0.12em]">No-show</span>
                        </motion.span>
                      ) : p.status === "done" ? (
                        <span
                          className="inline-flex items-center justify-center w-3 h-3 rounded-full"
                          style={{ background: "#16A34A" }}
                        >
                          <Check className="w-2 h-2 text-white" strokeWidth={3} />
                        </span>
                      ) : (
                        <span
                          className="text-[5.5px] font-mono uppercase tracking-[0.12em] px-1 py-px rounded-full"
                          style={{ background: PAPER_WARM, color: INK_SOFT }}
                        >
                          Upcoming
                        </span>
                      )}
                    </motion.div>
                  );
                })}
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

      {/* AI rebook toast slides in from the right */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: 16, y: -4 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5, ease: EASE }}
        className="absolute -top-2 right-2 sm:-top-3 sm:right-4 w-[58%] max-w-[220px] rounded-lg px-2 py-1.5 flex items-center gap-1.5 shadow-[0_10px_24px_-8px_rgba(31,41,55,0.35)]"
        style={{ background: "white", border: `1px solid ${LINE}` }}
      >
        <span
          className="w-5 h-5 rounded-full grid place-items-center text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${ROSE}, ${ROSE_DEEP})` }}
        >
          <Sparkles className="w-3 h-3" strokeWidth={2.5} />
        </span>
        <div className="flex-1 min-w-0 leading-tight">
          <div className="text-[7.5px] font-semibold" style={{ color: INK }}>
            AI · rebook Maya?
          </div>
          <div className="text-[6.5px]" style={{ color: INK_SOFT }}>
            offer Wed 11:00 slot
          </div>
        </div>
        <span
          className="text-[6.5px] font-bold px-1 py-0.5 rounded uppercase tracking-[0.12em]"
          style={{ background: ROSE_DEEP, color: "white" }}
        >
          Send
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Scene 2 — FOLLOWUP (WhatsApp phone, same shell as Northwind) ─────── */

const FOLLOWUP_MESSAGES: Array<
  | { kind: "msg"; from: "client" | "agent"; text: string; at: number }
  | { kind: "typing"; at: number; out: number }
> = [
  { kind: "msg", from: "agent",  text: "Hi Maya 💛 we missed you at 14:00", at: 0.2 },
  { kind: "msg", from: "agent",  text: "Want me to find another slot?",    at: 0.95 },
  { kind: "typing", at: 1.7,                                  out: 2.5 },
  { kind: "msg", from: "client", text: "Yes please — Wed mornings work",   at: 2.5 },
  { kind: "msg", from: "agent",  text: "Wed 11:00 with Dr. Nia ✨",        at: 3.4 },
  { kind: "msg", from: "client", text: "Perfect, see you then",            at: 4.2 },
];

function FollowupScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative w-[240px] sm:w-[280px]"
      style={{ transform: "rotateX(2deg) rotateY(-2deg)" }}
    >
      <div
        className="relative rounded-[28px] p-1.5 shadow-[0_24px_44px_-18px_rgba(31,41,55,0.35)]"
        style={{
          background: `linear-gradient(180deg, ${PAPER}, #E7E0CE)`,
          border: `1px solid ${LINE}`,
        }}
      >
        <span
          className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full z-10"
          style={{ background: INK }}
        />
        <div
          className="relative rounded-[22px] overflow-hidden"
          style={{ background: "#ECE5DD", aspectRatio: "9 / 16" }}
        >
          <div className="flex items-center gap-2 px-3 pt-6 pb-2 text-white" style={{ background: WHATSAPP }}>
            <ChevronLeft className="w-3 h-3" strokeWidth={2.5} />
            <span
              className="w-6 h-6 rounded-full grid place-items-center"
              style={{ background: `linear-gradient(135deg, ${ROSE}, ${ROSE_DEEP})` }}
            >
              <Sparkles className="w-3 h-3 text-white" strokeWidth={2.5} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[9.5px] font-semibold leading-tight truncate">
                AI agent
              </div>
              <div className="text-[7px] opacity-80 leading-tight">typing…</div>
            </div>
          </div>
          <div
            className="relative px-2 py-2 space-y-1.5 overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(228,160,168,0.07) 1px, transparent 2px), radial-gradient(circle at 60% 70%, rgba(228,160,168,0.05) 1px, transparent 2px), #ECE5DD",
              backgroundSize: "14px 14px",
              minHeight: "230px",
            }}
          >
            {FOLLOWUP_MESSAGES.map((item, i) => {
              if (item.kind === "msg") {
                const isClient = item.from === "client";
                return (
                  <motion.div
                    key={`m-${i}`}
                    initial={reduced ? false : { opacity: 0, y: 4, x: isClient ? -6 : 6 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: reduced ? 0 : item.at, duration: 0.4, ease: EASE }}
                    className={`max-w-[80%] ${isClient ? "mr-auto" : "ml-auto"}`}
                  >
                    <div
                      className="relative px-2 py-1 text-[8.5px] leading-tight rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
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
                          <CheckCheck className="w-2.5 h-2.5" strokeWidth={2.5} style={{ color: "#A99BF5" }} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              }
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
                  className="mr-auto inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
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

/* ─── Scene 3 — REBOOKED (weekly calendar with new slot landing) ──────── */

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = ["09", "10", "11", "12", "13"];

type Slot = { day: number; hour: number; label?: string; tint: "rose" | "slate" | "mint" };

const EXISTING_SLOTS: Slot[] = [
  { day: 0, hour: 0, tint: "slate" },
  { day: 1, hour: 2, tint: "mint" },
  { day: 3, hour: 1, tint: "rose" },
  { day: 4, hour: 3, tint: "slate" },
];

const NEW_SLOT: Slot = { day: 2, hour: 2, label: "Maya · Filler", tint: "rose" };

function RebookedScene({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative w-[78%] max-w-[440px]"
      style={{ transform: "rotateX(2deg) rotateY(-1deg)" }}
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-[0_24px_50px_-22px_rgba(31,41,55,0.35)]"
        style={{ background: "white", border: `1px solid ${LINE}` }}
      >
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ background: `linear-gradient(135deg, ${ROSE}, ${ROSE_DEEP})`, color: "white" }}
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span className="text-[10px] font-bold tracking-[0.16em]">Week of Aug 5</span>
          </div>
          <span className="text-[8px] font-mono uppercase tracking-[0.18em] opacity-85">
            Scheduler
          </span>
        </div>

        <div className="grid grid-cols-6 gap-px p-3" style={{ background: PAPER_WARM }}>
          <div className="bg-white p-1 text-[7px] font-mono uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
            time
          </div>
          {WEEK_DAYS.map((d) => (
            <div
              key={d}
              className="bg-white p-1 text-center text-[8px] font-bold uppercase tracking-[0.12em]"
              style={{ color: d === "Wed" ? ROSE_DEEP : INK }}
            >
              {d}
            </div>
          ))}
          {HOURS.map((h, hi) => (
            <Fragment key={`row-${h}`}>
              <div
                className="bg-white p-1 text-[7.5px] font-mono tabular-nums"
                style={{ color: INK_SOFT }}
              >
                {h}:00
              </div>
              {WEEK_DAYS.map((_, di) => {
                const existing = EXISTING_SLOTS.find((s) => s.day === di && s.hour === hi);
                const isNew = NEW_SLOT.day === di && NEW_SLOT.hour === hi;
                return (
                  <div
                    key={`c-${di}-${hi}`}
                    className="relative bg-white p-0.5"
                    style={{ minHeight: 14 }}
                  >
                    {existing && (
                      <span
                        className="block w-full h-full rounded-sm"
                        style={{
                          background:
                            existing.tint === "rose"
                              ? `${ROSE}55`
                              : existing.tint === "mint"
                              ? "#8CA0B355"
                              : `${ACCENT}33`,
                        }}
                      />
                    )}
                    {isNew && (
                      <motion.span
                        initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                        className="absolute inset-0.5 rounded grid place-items-center text-[6px] font-bold text-white px-0.5 leading-none"
                        style={{
                          background: `linear-gradient(135deg, ${ROSE_DEEP}, ${ROSE})`,
                          boxShadow: `0 4px 10px -2px ${ROSE_DEEP}88`,
                        }}
                      >
                        {NEW_SLOT.label}
                      </motion.span>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-1.5 px-3 pb-3">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.45, ease: EASE }}
            className="col-span-3 rounded-md px-2.5 py-2 flex items-center gap-2"
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
              <div className="text-[7px] font-mono uppercase tracking-[0.16em] opacity-85">Recovered</div>
              <div className="text-[10px] font-bold">Maya Chen · Wed 11:00</div>
            </div>
          </motion.div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.45, ease: EASE }}
            className="col-span-2 rounded-md px-2 py-1.5"
            style={{ background: PAPER_WARM, border: `1px solid ${LINE}` }}
          >
            <div className="text-[7px] font-mono uppercase tracking-[0.14em]" style={{ color: INK_SOFT }}>
              No-show recovery
            </div>
            <div className="flex items-baseline gap-1">
              <RecoveryCounter from={38} to={41} reduced={reduced} />
              <span className="text-[8px] font-mono" style={{ color: INK_SOFT }}>%</span>
              <span
                className="ml-auto text-[7px] font-bold tabular-nums"
                style={{ color: "#16A34A" }}
              >
                +3
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function RecoveryCounter({ from, to, reduced }: { from: number; to: number; reduced: boolean }) {
  const [value, setValue] = useState(reduced ? to : from);
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setValue(to), 1400);
    return () => window.clearTimeout(id);
  }, [reduced, to]);
  return (
    <motion.span
      key={value}
      initial={reduced ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-[13px] font-bold tabular-nums"
      style={{ color: INK }}
    >
      {value}
    </motion.span>
  );
}
