"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  CheckCircle2,
  Cpu,
  MessageCircle,
  Sparkles,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * AutomationStack — isometric 3D arrangement of three real UI panels
 * (chat conversation, workflow pipeline, model metrics) drawn in CSS 3D.
 *
 * CSS 3D was chosen over Three.js: panels need crisp, readable UI text
 * (chat bubbles, status rows, sparklines), which would require expensive
 * texture-baking in WebGL. Native CSS transforms with `transform-style:
 * preserve-3d` give the same isometric effect with sharp typography and
 * zero shader cost.
 *
 * The parent group rotates as one rigid body; each panel sits at its own
 * `translateZ` for a layered depth illusion. Pointer events off so the
 * hero text + CTAs stay clickable underneath.
 * ──────────────────────────────────────────────────────────────────────── */

interface AutomationStackProps {
  reduced?: boolean;
}

export function AutomationStack({ reduced = false }: AutomationStackProps) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ perspective: "2400px" }}
    >
      <motion.div
        className="absolute left-1/2 top-[88%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "1040px",
          height: "520px",
          transformStyle: "preserve-3d",
        }}
        initial={
          reduced
            ? { rotateX: 56, rotateZ: -28, opacity: 1 }
            : { rotateX: 64, rotateZ: -22, opacity: 0 }
        }
        animate={{ rotateX: 56, rotateZ: -28, opacity: 1 }}
        transition={{
          duration: 1.6,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2,
        }}
      >
        <PanelMetrics reduced={reduced} />
        <PanelChat reduced={reduced} />
        <PanelWorkflow reduced={reduced} />
      </motion.div>
    </div>
  );
}

/* ─── Panel 1: Chat conversation (mid-depth, most prominent) ─────────────── */

function PanelChat({ reduced }: { reduced: boolean }) {
  return (
    <FloatPanel reduced={reduced} delay={0} amplitude={6}>
      <div
        className="absolute rounded-2xl bg-paper border border-line overflow-hidden"
        style={{
          width: "460px",
          left: "300px",
          top: "60px",
          transform: "translateZ(80px)",
          backfaceVisibility: "hidden",
          boxShadow:
            "0 60px 120px -30px rgba(31,42,36,0.28), 0 24px 60px -18px rgba(31,42,36,0.18)",
        }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line bg-bg-warm">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-paper">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-foreground">
              WhatsApp Agent
            </div>
            <div className="inline-flex items-center gap-1 text-[9.5px] font-mono uppercase tracking-[0.12em] text-foreground/55">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Live · 247 msg/hr
            </div>
          </div>
          <div className="text-[9.5px] font-mono uppercase tracking-[0.12em] text-foreground/45">
            14:38
          </div>
        </div>

        <div className="p-4 space-y-2.5 bg-paper">
          <ChatBubble side="customer">
            Hey, when can I come pick up my order?
          </ChatBubble>
          <ChatBubble side="agent">
            Your order is ready ✓ Open today 14:00–19:00.
          </ChatBubble>
          <ChatBubble side="customer">
            Can you ship it instead?
          </ChatBubble>
          <ChatBubble side="agent" thinking>
            Booking courier…
          </ChatBubble>
          <ChatBubble side="agent">
            ✓ Pickup tomorrow at 09:00. Tracking sent.
          </ChatBubble>
        </div>
      </div>
    </FloatPanel>
  );
}

function ChatBubble({
  side,
  thinking,
  children,
}: {
  side: "agent" | "customer";
  thinking?: boolean;
  children: React.ReactNode;
}) {
  if (side === "agent") {
    return (
      <div className="flex justify-start">
        <div
          className="max-w-[78%] px-3 py-1.5 rounded-2xl rounded-bl-md text-[11.5px] leading-snug shadow-sm"
          style={{
            background: thinking
              ? "color-mix(in srgb, var(--accent) 18%, var(--paper))"
              : "var(--accent)",
            color: thinking ? "var(--foreground)" : "var(--paper)",
          }}
        >
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] px-3 py-1.5 rounded-2xl rounded-br-md bg-bg-warm border border-line text-foreground text-[11.5px] leading-snug">
        {children}
      </div>
    </div>
  );
}

/* ─── Panel 2: Workflow pipeline (background, larger Z offset) ───────────── */

function PanelWorkflow({ reduced }: { reduced: boolean }) {
  return (
    <FloatPanel reduced={reduced} delay={0.6} amplitude={8}>
      <div
        className="absolute rounded-2xl bg-paper border border-line overflow-hidden"
        style={{
          width: "310px",
          left: "720px",
          top: "200px",
          transform: "translateZ(180px)",
          backfaceVisibility: "hidden",
          boxShadow:
            "0 50px 100px -28px rgba(31,42,36,0.26), 0 18px 48px -16px rgba(31,42,36,0.16)",
        }}
      >
        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-line bg-bg-warm">
          <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-foreground">
              Inbox Triage
            </div>
            <div className="text-[9.5px] font-mono uppercase tracking-[0.12em] text-foreground/55">
              v2.1 · Active
            </div>
          </div>
        </div>
        <div className="p-3.5 space-y-2 font-mono text-[10.5px]">
          <Step status="done" label="Receive message" />
          <Step status="done" label="Parse intent" detail="sonnet-4" />
          <Step status="done" label="Lookup CRM" />
          <Step status="active" label="Draft response" />
          <Step status="pending" label="Send + update CRM" />
        </div>
        <div className="px-3.5 py-2.5 border-t border-line bg-bg-warm flex items-center gap-1.5 text-[9.5px] font-mono uppercase tracking-[0.12em] text-foreground/55">
          <Sparkles className="w-2.5 h-2.5 text-accent" />
          1,284 resolved today
        </div>
      </div>
    </FloatPanel>
  );
}

function Step({
  status,
  label,
  detail,
}: {
  status: "done" | "active" | "pending";
  label: string;
  detail?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex w-3.5 h-3.5 items-center justify-center shrink-0">
        {status === "done" && (
          <CheckCircle2 className="w-3 h-3 text-accent" />
        )}
        {status === "active" && (
          <span className="relative inline-flex w-2 h-2 rounded-full bg-accent">
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
          </span>
        )}
        {status === "pending" && (
          <span className="w-2 h-2 rounded-full border border-foreground/30" />
        )}
      </span>
      <span
        className={
          status === "pending" ? "text-foreground/40" : "text-foreground/80"
        }
      >
        {label}
      </span>
      {detail && (
        <span className="ml-auto text-[9.5px] text-foreground/45 serif-italic">
          {detail}
        </span>
      )}
    </div>
  );
}

/* ─── Panel 3: Model metrics (foreground, smallest) ─────────────────────── */

function PanelMetrics({ reduced }: { reduced: boolean }) {
  return (
    <FloatPanel reduced={reduced} delay={1.1} amplitude={5}>
      <div
        className="absolute rounded-2xl bg-paper border border-line overflow-hidden"
        style={{
          width: "280px",
          left: "80px",
          top: "320px",
          transform: "translateZ(280px)",
          backfaceVisibility: "hidden",
          boxShadow:
            "0 40px 80px -24px rgba(31,42,36,0.26), 0 14px 38px -14px rgba(31,42,36,0.18)",
        }}
      >
        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-line bg-bg-warm">
          <div className="w-7 h-7 rounded-lg bg-accent-deep flex items-center justify-center text-paper">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-foreground">
              <span className="serif-italic text-accent">claude-sonnet-4</span>
            </div>
            <div className="text-[9.5px] font-mono uppercase tracking-[0.12em] text-foreground/55">
              Production · us-east
            </div>
          </div>
        </div>
        <div className="px-3.5 py-3 grid grid-cols-3 gap-1.5">
          <Metric label="p50" value="842" unit="ms" />
          <Metric label="p99" value="2.4" unit="s" />
          <Metric label="tok/s" value="1.2" unit="k" />
        </div>
        <div className="px-3.5 pb-3">
          <MiniSparkline />
        </div>
        <div className="px-3.5 py-2.5 border-t border-line bg-bg-warm flex items-center gap-1.5 text-[9.5px] font-mono uppercase tracking-[0.12em] text-foreground/55">
          <Bot className="w-2.5 h-2.5 text-accent" />
          24 agents online
        </div>
      </div>
    </FloatPanel>
  );
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[8.5px] font-mono uppercase tracking-[0.12em] text-foreground/45">
        {label}
      </span>
      <span className="text-[14px] font-medium text-foreground tracking-tight tabular-nums leading-tight">
        {value}
        <span className="text-foreground/45 text-[10px] font-normal ml-0.5">
          {unit}
        </span>
      </span>
    </div>
  );
}

function MiniSparkline() {
  return (
    <svg
      width="100%"
      height="28"
      viewBox="0 0 240 28"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,22 L20,18 L40,20 L60,15 L80,17 L100,11 L120,14 L140,9 L160,12 L180,6 L200,9 L220,4 L240,7"
        stroke="var(--accent)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0,22 L20,18 L40,20 L60,15 L80,17 L100,11 L120,14 L140,9 L160,12 L180,6 L200,9 L220,4 L240,7 L240,28 L0,28 Z"
        fill="color-mix(in srgb, var(--accent) 14%, transparent)"
      />
    </svg>
  );
}

/* ─── FloatPanel: gentle vertical drift on each panel ───────────────────── */

function FloatPanel({
  reduced,
  delay,
  amplitude,
  children,
}: {
  reduced: boolean;
  delay: number;
  amplitude: number;
  children: React.ReactNode;
}) {
  if (reduced) return <>{children}</>;
  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0] }}
      transition={{
        duration: 6 + amplitude * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
