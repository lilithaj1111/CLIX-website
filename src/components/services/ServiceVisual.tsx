"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/LogoMark";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Bookmark,
  Bot,
  Camera,
  CheckCircle2,
  ChevronLeft,
  Cloud,
  Code2,
  Coins,
  Compass,
  Cpu,
  Database,
  DollarSign,
  FileBarChart,
  GitBranch,
  Globe,
  Headphones,
  Heart,
  Home,
  Layers,
  Lightbulb,
  LifeBuoy,
  LineChart,
  List,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Music,
  Network,
  Package,
  Phone,
  Play,
  Plus,
  Puzzle,
  Search,
  Send,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Terminal,
  TrendingUp,
  User,
  Users,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * ServiceVisual — premium CSS-3D illustrations per service. Each one is built
 * with perspective + rotate transforms, layered shadows for depth, refined
 * typography and subtle motion so the panel reads as a polished product
 * illustration, not a generic mockup.
 *
 *   ai-agents     → Central glowing AI core + orbiting capability chips
 *   whatsapp      → Tilted phone with realistic WhatsApp chat thread
 *   crm           → Stacked contact records with live activity sparklines
 *   integrations  → Hub with 4 connected source modules + data flow lines
 *   websites      → Browser mockup with hero content + speed badge
 *   mobile        → Tilted phone with 3×3 app icon grid
 *   software      → Code editor with sidebar, tabs and syntax-highlighted code
 *   strategy      → Layered roadmap with milestone markers and trajectory
 *
 * Every illustration uses the lime/mint accent family from the page palette
 * plus the cornflower brand `--accent` so it ties together visually. */

export type ServiceVisualKind =
  | "ai-agents"
  | "whatsapp"
  | "crm"
  | "integrations"
  | "websites"
  | "mobile"
  | "software"
  | "strategy";

export function ServiceVisual({ kind }: { kind: ServiceVisualKind }) {
  switch (kind) {
    case "ai-agents":
      return <AIAgentsVisual />;
    case "whatsapp":
      return <WhatsAppVisual />;
    case "crm":
      return <CRMVisual />;
    case "integrations":
      return <IntegrationsVisual />;
    case "websites":
      return <WebsitesVisual />;
    case "mobile":
      return <MobileVisual />;
    case "software":
      return <SoftwareVisual />;
    case "strategy":
      return <StrategyVisual />;
  }
}

/* ─── Shared scaffolding ─────────────────────────────────────────────────── */

function Stage({ children }: { children: React.ReactNode }) {
  // The illustrations have pixel-tuned interior layouts (laptop screens,
  // dashboard rows, KPI cards). At mobile size the bezel shrinks but the
  // interior content doesn't, so it overflows. We compensate by scaling
  // the entire stage down proportionally on smaller viewports — visual
  // shrinks as one unit and the interior stays aligned.
  return (
    <div
      className="absolute inset-0 grid place-items-center px-2 py-2 md:px-6 md:py-6"
      style={{ perspective: "1600px" }}
    >
      <div className="relative w-full h-full origin-center grid place-items-center scale-[0.78] min-[480px]:scale-[0.88] sm:scale-[0.95] md:scale-100">
        {children}
      </div>
    </div>
  );
}

const FLOAT_TRANSITION = {
  duration: 6.5,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

/* ─── 01 · AI Agents ─────────────────────────────────────────────────────── */
/* "Agent OS" running on a tilted 3D laptop. Dark bezel + silver base with
 * a paper-themed dashboard inside: traffic lights, brand badge, live pulse,
 * three clickable tabs (Live / Roster / Tools) and a content panel that
 * swaps per tab. Floating side-cards keep the "+1 hire" and "2.1× capacity"
 * cues from the original org-chart illustration. */

function AIAgentsVisual() {
  const [active, setActive] = useState(0);

  const tabs = [
    { key: "live", label: "Live", count: "8 active" },
    { key: "roster", label: "Roster", count: "4 hired" },
    { key: "tools", label: "Tools", count: "12 wired" },
  ];

  return (
    <Stage>
      <div className="relative w-full h-full grid place-items-center">
        {/* Background halo — lime/mint glow */}
        <span
          aria-hidden
          className="absolute z-0 rounded-full"
          style={{
            left: "10%",
            top: "8%",
            width: "80%",
            aspectRatio: "1.4",
            background:
              "radial-gradient(circle, rgba(190,242,100,0.32), rgba(94,234,212,0.16) 50%, transparent 76%)",
            filter: "blur(28px)",
          }}
        />

        {/* 3D laptop */}
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          animate={{ y: [0, -3, 0] }}
          className="relative z-10 w-[92%] max-w-[480px]"
          style={{
            transform: "rotateX(8deg) rotateY(-12deg) rotateZ(-1deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Screen bezel */}
          <div
            className="relative w-full aspect-[16/10] rounded-t-xl p-[3px] shadow-[0_44px_72px_-22px_rgba(11,19,38,0.55),0_18px_36px_-12px_rgba(11,19,38,0.32)]"
            style={{
              background: "linear-gradient(180deg, #1A1C23 0%, #262830 100%)",
            }}
          >
            {/* Camera dot on the bezel */}
            <span className="absolute top-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ink/85 z-10" />

            {/* Screen interior */}
            <div className="relative w-full h-full rounded-[6px] overflow-hidden bg-paper flex flex-col">
              {/* Window title bar (traffic lights + brand) */}
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-foreground/8 bg-gradient-to-b from-paper to-bg-warm/70">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28C840]" />
                  <span
                    className="ml-2 inline-grid place-items-center w-4 h-4 rounded text-paper shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #BEF264, #65A30D)",
                      boxShadow: "0 2px 4px -1px rgba(101,163,13,0.4)",
                    }}
                  >
                    <Bot className="w-2.5 h-2.5" strokeWidth={2.4} />
                  </span>
                  <span className="text-[8px] font-semibold text-foreground/85 leading-none">
                    Agent OS
                  </span>
                  <span className="text-[6.5px] font-mono uppercase tracking-[0.14em] text-foreground/45 leading-none">
                    · AI workforce
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[6.5px] font-mono uppercase tracking-[0.14em] text-foreground/55 shrink-0">
                  <span className="relative inline-flex">
                    <span className="w-1 h-1 rounded-full bg-[#65A30D]" />
                    <motion.span
                      className="absolute inset-0 w-1 h-1 rounded-full bg-[#65A30D]"
                      animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  </span>
                  live
                </span>
              </div>

              {/* Clickable tab bar */}
              <div
                role="tablist"
                className="flex items-center gap-0.5 px-2 pt-1 border-b border-foreground/8 bg-bg-warm/40"
              >
                {tabs.map((t, i) => {
                  const isActive = active === i;
                  return (
                    <button
                      key={t.key}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(i)}
                      className="relative flex items-center gap-1 px-1.5 py-1 text-[8px] font-medium transition-colors cursor-pointer focus:outline-none"
                      style={{
                        color: isActive ? "#15803D" : "rgba(31,41,55,0.55)",
                      }}
                    >
                      <span>{t.label}</span>
                      <span
                        className="rounded-full px-1 py-px text-[5.5px] font-mono uppercase tracking-[0.1em]"
                        style={{
                          background: isActive
                            ? "rgba(190,242,100,0.55)"
                            : "rgba(31,41,55,0.06)",
                          color: isActive
                            ? "#15803D"
                            : "rgba(31,41,55,0.5)",
                        }}
                      >
                        {t.count}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="agent-tab-underline"
                          className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#65A30D] rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab content panel */}
              <div className="relative flex-1 p-2.5 overflow-hidden">
                {active === 0 && <AgentLiveTab />}
                {active === 1 && <AgentRosterTab />}
                {active === 2 && <AgentToolsTab />}
              </div>
            </div>
          </div>

          {/* Laptop base / keyboard */}
          <div className="relative -mt-px">
            <div
              className="mx-auto rounded-b-xl"
              style={{
                width: "114%",
                marginLeft: "-7%",
                height: "10px",
                background: "linear-gradient(180deg, #E2E8F0 0%, #94A3B8 100%)",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.7), 0 8px 14px -5px rgba(11,19,38,0.35)",
              }}
            />
            <div
              className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[22%] h-[2px] rounded-b-full"
              style={{
                background:
                  "linear-gradient(180deg, #94A3B8 0%, #64748B 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* Floating "+1 hire" badge — top-right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.5 }}
          animate={{ y: [0, -4, 0] }}
          className="absolute top-[4%] right-[2%] z-20 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl shadow-[0_12px_24px_-8px_rgba(101,163,13,0.45)]"
          style={{
            background: "linear-gradient(135deg, #BEF264, #65A30D)",
            border: "1.5px solid var(--paper)",
          }}
        >
          <Sparkles className="w-3 h-3 text-ink" fill="currentColor" />
          <div className="leading-none">
            <div className="text-[9.5px] font-bold text-ink tabular-nums">+1</div>
            <div className="mt-0.5 text-[6.5px] font-mono uppercase tracking-[0.14em] text-ink/70">
              hire today
            </div>
          </div>
        </motion.div>

        {/* Floating "2.1× capacity" badge — bottom-left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          animate={{ y: [0, -3, 0] }}
          className="absolute bottom-[4%] left-[1%] z-20 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-paper border border-line shadow-[0_12px_24px_-8px_rgba(11,19,38,0.28)]"
        >
          <TrendingUp className="w-3 h-3 text-[#0F766E]" strokeWidth={2.5} />
          <div className="leading-none">
            <div className="text-[9.5px] font-bold text-foreground/85 tabular-nums">
              2.1×
            </div>
            <div className="mt-0.5 text-[6.5px] font-mono uppercase tracking-[0.14em] text-foreground/50">
              capacity
            </div>
          </div>
        </motion.div>
      </div>
    </Stage>
  );
}

const AGENT_ROSTER = [
  {
    key: "sales",
    name: "Sales SDR",
    role: "Inbound qualify · book",
    Icon: TrendingUp,
    tint: "#15803D",
    bg: "rgba(190,242,100,0.55)",
    today: "28",
    status: "online" as const,
  },
  {
    key: "support",
    name: "Support Triage",
    role: "Tickets · routing",
    Icon: LifeBuoy,
    tint: "#0F766E",
    bg: "rgba(94,234,212,0.45)",
    today: "94",
    status: "online" as const,
  },
  {
    key: "research",
    name: "Research Analyst",
    role: "RAG · web · summarise",
    Icon: Search,
    tint: "#B45309",
    bg: "rgba(254,243,199,0.95)",
    today: "16",
    status: "thinking" as const,
  },
  {
    key: "voice",
    name: "Voice Receptionist",
    role: "Inbound calls · book",
    Icon: Headphones,
    tint: "#7C2D12",
    bg: "rgba(254,215,170,0.7)",
    today: "12",
    status: "online" as const,
  },
];

function AgentLiveTab() {
  const activity = [
    {
      agent: AGENT_ROSTER[0],
      action: "Drafting reply · Priya Sharma · pricing",
      time: "1.2s",
      verb: "writing",
    },
    {
      agent: AGENT_ROSTER[2],
      action: "Searching docs · refund SLA terms",
      time: "0.8s",
      verb: "thinking",
    },
    {
      agent: AGENT_ROSTER[1],
      action: "Triaged ticket #4821 → Billing queue",
      time: "0.3s",
      verb: "routed",
    },
    {
      agent: AGENT_ROSTER[3],
      action: "Booked demo · Anika P. · Thu 4 PM",
      time: "2.1s",
      verb: "booked",
    },
  ];

  return (
    <motion.div
      key="live"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-1.5"
    >
      {activity.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-bg-warm/50 border border-foreground/5"
        >
          <span
            className="w-6 h-6 shrink-0 rounded-full grid place-items-center"
            style={{ background: a.agent.bg, color: a.agent.tint }}
          >
            <a.agent.Icon className="w-3 h-3" strokeWidth={2.4} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9.5px] font-semibold text-foreground/85 truncate leading-none">
                {a.agent.name}
              </span>
              <span className="text-[6.5px] font-mono text-foreground/40 tabular-nums shrink-0">
                {a.time}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-1.5">
              <span className="text-[8px] text-foreground/55 truncate leading-snug">
                {a.action}
              </span>
              <span
                className="text-[6px] font-mono font-bold uppercase tracking-[0.14em] px-1.5 py-px rounded-full shrink-0 inline-flex items-center gap-1"
                style={{ background: a.agent.bg, color: a.agent.tint }}
              >
                <motion.span
                  className="inline-block w-1 h-1 rounded-full"
                  style={{ background: a.agent.tint }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.18,
                  }}
                />
                {a.verb}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function AgentRosterTab() {
  return (
    <motion.div
      key="roster"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-2 gap-1.5"
    >
      {AGENT_ROSTER.map((a, i) => (
        <motion.div
          key={a.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          className="rounded-lg bg-paper border border-foreground/8 px-2 py-2 shadow-[0_4px_10px_-4px_rgba(11,19,38,0.14)]"
        >
          <div className="flex items-center justify-between">
            <span
              className="inline-grid place-items-center w-6 h-6 rounded-full"
              style={{ background: a.bg, color: a.tint }}
            >
              <a.Icon className="w-3 h-3" strokeWidth={2.4} />
            </span>
            <span className="inline-flex items-center gap-1 text-[6px] font-mono uppercase tracking-[0.14em] text-foreground/55">
              <span className="relative inline-flex">
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: a.status === "online" ? "#65A30D" : "#B45309" }}
                />
                <motion.span
                  className="absolute inset-0 w-1 h-1 rounded-full"
                  style={{ background: a.status === "online" ? "#65A30D" : "#B45309" }}
                  animate={{ scale: [1, 2.6, 1], opacity: [0.65, 0, 0.65] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </span>
              {a.status}
            </span>
          </div>
          <div className="mt-1.5 text-[9px] font-semibold text-foreground/85 leading-tight">
            {a.name}
          </div>
          <div className="mt-0.5 text-[6.5px] font-mono uppercase tracking-[0.12em] text-foreground/45 leading-tight">
            {a.role}
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className="text-[11px] font-bold tabular-nums leading-none"
              style={{ color: a.tint }}
            >
              {a.today}
            </span>
            <span className="text-[6px] font-mono uppercase tracking-[0.14em] text-foreground/50">
              today
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function AgentToolsTab() {
  const tools = [
    {
      name: "HubSpot CRM",
      kind: "contacts · deals",
      Icon: Users,
      tint: "#15803D",
      bg: "rgba(190,242,100,0.55)",
      calls: "134",
      rate: "98%",
    },
    {
      name: "Gmail",
      kind: "send · draft · reply",
      Icon: Mail,
      tint: "#0F766E",
      bg: "rgba(94,234,212,0.45)",
      calls: "89",
      rate: "96%",
    },
    {
      name: "Notion KB",
      kind: "RAG · summarise",
      Icon: BookOpen,
      tint: "#B45309",
      bg: "rgba(254,243,199,0.95)",
      calls: "230",
      rate: "92%",
    },
    {
      name: "Web search",
      kind: "live lookup",
      Icon: Search,
      tint: "#7C2D12",
      bg: "rgba(254,215,170,0.7)",
      calls: "62",
      rate: "100%",
    },
  ];

  return (
    <motion.div
      key="tools"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-1.5"
    >
      {tools.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-bg-warm/50 border border-foreground/5"
        >
          <span
            className="w-6 h-6 shrink-0 rounded-lg grid place-items-center"
            style={{ background: t.bg, color: t.tint }}
          >
            <t.Icon className="w-3 h-3" strokeWidth={2.4} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[9.5px] font-semibold text-foreground/85 leading-none">
              {t.name}
            </div>
            <div className="mt-1 text-[6.5px] font-mono uppercase tracking-[0.12em] text-foreground/45">
              {t.kind}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div
              className="text-[10px] font-bold tabular-nums leading-none"
              style={{ color: t.tint }}
            >
              {t.calls}
            </div>
            <div className="mt-0.5 text-[6px] font-mono uppercase tracking-[0.14em] text-foreground/50">
              {t.rate} ok
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── 02 · WhatsApp Automations ──────────────────────────────────────────── */
/* Commerce-style composition: a phone running WhatsApp Business with a
 * floating intro chat bubble (Track Shipment CTA) on one side and a
 * floating product-catalog card on the other. Reads as "WhatsApp doing
 * real commerce", not a generic chat screenshot. */

function WhatsAppVisual() {
  const products = [
    { name: "Footwear", price: "Rs.1200", color: "#8B4513", icon: "👞" },
    { name: "Groceries", price: "Rs.150", color: "#65A30D", icon: "🥬" },
    { name: "Phone Covers", price: "Rs.350", color: "#1F2937", icon: "📱" },
    { name: "Beauty", price: "Rs.1800", color: "#F9A8D4", icon: "💄" },
  ];

  return (
    <Stage>
      <div className="relative w-full h-full grid place-items-center">
        {/* ── Phone (center, slightly receded) ─────────────────────── */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={FLOAT_TRANSITION}
          className="relative"
          style={{
            transform: "rotateX(4deg) rotateY(-4deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative w-[140px] md:w-[170px] aspect-[10/19] rounded-[28px] p-1 bg-gradient-to-br from-ink-warm via-ink to-ink-warm shadow-[0_40px_70px_-28px_rgba(11,19,38,0.5)]">
            {/* Side buttons */}
            <span className="absolute top-[20%] -left-[2px] w-[3px] h-7 rounded-l bg-ink/90" />
            <span className="absolute top-[18%] -right-[2px] w-[3px] h-10 rounded-r bg-ink/90" />

            <div className="relative w-full h-full rounded-[23px] overflow-hidden bg-[#ECE5DD]">
              {/* Notch */}
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2.5 rounded-full bg-ink-warm z-10" />

              {/* Status bar */}
              <div className="absolute top-1 inset-x-0 px-3 flex items-center justify-between text-[6px] font-mono text-foreground/70 z-20">
                <span>1:33</span>
                <span>●●●●●</span>
              </div>

              {/* WhatsApp top bar */}
              <div className="pt-5 px-2 pb-1.5 bg-[#075E54] flex items-center gap-1.5">
                <ChevronLeft className="w-2.5 h-2.5 text-paper" strokeWidth={2.5} />
                <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] grid place-items-center">
                  <Bot className="w-2 h-2 text-paper" strokeWidth={2.5} />
                </span>
                <span className="text-[7.5px] font-semibold text-paper">
                  +91 70090 75316
                </span>
              </div>

              {/* WhatsApp wallpaper pattern + chat bubbles */}
              <div
                className="absolute inset-x-0 top-[36px] bottom-[18px] overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 20% 30%, color-mix(in srgb, #075E54 8%, transparent) 1px, transparent 2px), radial-gradient(circle at 60% 70%, color-mix(in srgb, #075E54 6%, transparent) 1px, transparent 2px), #ECE5DD",
                  backgroundSize: "16px 16px",
                }}
              >
                <div className="px-1.5 pt-2 space-y-1">
                  {/* Incoming bot message — order shipped */}
                  <div className="max-w-[80%] bg-paper rounded-md rounded-tl-none px-1.5 py-1 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
                    <p className="text-[5.5px] leading-[1.35] text-foreground/85">
                      Dear Robin,
                      <br />
                      Your Order (P0123) for
                      <br />2 kurtas has shipped!
                    </p>
                    <div className="flex items-center justify-end gap-0.5 mt-0.5 text-[4.5px] text-foreground/45">
                      <span>1:32</span>
                    </div>
                  </div>
                  {/* Outgoing user reply */}
                  <div className="flex justify-end">
                    <div className="max-w-[60%] bg-[#DCF8C6] rounded-md rounded-tr-none px-1.5 py-1 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
                      <p className="text-[5.5px] leading-[1.35] text-foreground/85">
                        Thanks! Where&apos;s
                        <br />my delivery?
                      </p>
                      <div className="flex items-center justify-end gap-0.5 mt-0.5 text-[4.5px] text-[#34B7F1]">
                        <span className="text-foreground/45">1:32</span>
                        <span>✓✓</span>
                      </div>
                    </div>
                  </div>
                  {/* Bot reply with menu link */}
                  <div className="max-w-[78%] bg-paper rounded-md rounded-tl-none px-1.5 py-1 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
                    <p className="text-[5.5px] leading-[1.35] text-foreground/85">
                      Track it from the menu
                      <br />below 👇
                    </p>
                    <div className="flex items-center justify-end gap-0.5 mt-0.5 text-[4.5px] text-foreground/45">
                      <span>1:33</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-paper flex items-center gap-1">
                <Plus className="w-2.5 h-2.5 text-foreground/40" strokeWidth={2.5} />
                <span className="block flex-1 h-2.5 rounded-full bg-bg-warm" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Floating chat bubble (LEFT, overlapping phone) ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          animate={{ y: [0, -3, 0] }}
          style={{ animationDelay: "0.6s" }}
          className="absolute left-[2%] top-[18%] w-[44%] bg-paper rounded-xl px-3 py-2.5 shadow-[0_18px_36px_-12px_rgba(11,19,38,0.28)] z-10"
        >
          <p className="text-[8.5px] leading-snug text-foreground/85 mb-2">
            Hey there, check out our product collections
          </p>
          <div className="pt-1.5 border-t border-foreground/8 flex items-center gap-1.5">
            <List className="w-2.5 h-2.5 text-[#34B7F1]" strokeWidth={2.5} />
            <span className="text-[8.5px] font-semibold text-[#34B7F1]">
              Track Shipment
            </span>
          </div>
          {/* Tail */}
          <span
            className="absolute -bottom-1 left-4 w-2 h-2 bg-paper"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
        </motion.div>

        {/* ── Floating product menu card (RIGHT, overlapping phone) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          animate={{ y: [0, -4, 0] }}
          style={{ animationDelay: "1.2s" }}
          className="absolute right-[2%] bottom-[10%] w-[52%] bg-paper rounded-xl overflow-hidden shadow-[0_22px_44px_-14px_rgba(11,19,38,0.32)] z-20"
        >
          {/* Menu header */}
          <div className="px-2.5 py-1.5 bg-[#075E54] flex items-center gap-1.5">
            <ChevronLeft className="w-2.5 h-2.5 text-paper" strokeWidth={2.5} />
            <span className="text-[8.5px] font-semibold text-paper">Menu</span>
          </div>
          {/* Product rows */}
          <div className="divide-y divide-foreground/8">
            {products.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                className="flex items-center gap-1.5 px-2 py-1.5"
              >
                <span
                  className="w-7 h-6 rounded-md grid place-items-center text-[10px] shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}, color-mix(in srgb, ${p.color} 65%, white))`,
                  }}
                >
                  {p.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[8.5px] font-semibold text-foreground/90 leading-tight truncate">
                    {p.name}
                  </div>
                  <div className="text-[7px] text-foreground/50">{p.price}</div>
                </div>
                <ArrowRight className="w-2.5 h-2.5 text-foreground/35" strokeWidth={2} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Stage>
  );
}

/* ─── 03 · CRM Implementation ────────────────────────────────────────────── */
/* Flat-illustration composition: a central silver laptop showing 3 colourful
 * gears, with 6 connected icon clusters orbiting it — chat / chart / docs /
 * team / money / mail — tied together by thin connector lines and a scatter
 * of low-opacity gears and dollar signs. Fitted to the card's 5:4 frame. */

function CRMVisual() {
  type Cluster = {
    key: string;
    pos: { left?: string; right?: string; top: string };
    anchor: { x: number; y: number };
    src: { x: number; y: number };
    render: () => React.ReactNode;
  };

  const clusters: Cluster[] = [
    /* TOP-LEFT — stacked chat bubbles */
    {
      key: "chat",
      pos: { left: "1%", top: "6%" },
      anchor: { x: 14, y: 16 },
      src: { x: 36, y: 38 },
      render: () => (
        <div className="relative w-12 h-12">
          <span
            className="absolute top-0 left-1 w-7 h-6 rounded-xl rounded-bl-sm grid place-items-center text-paper shadow-[0_6px_14px_-4px_rgba(11,19,38,0.3)]"
            style={{ background: "linear-gradient(135deg, #7DD3FC, #38BDF8)" }}
          >
            <span className="flex gap-[2px]">
              <span className="w-[3px] h-[3px] rounded-full bg-paper/85" />
              <span className="w-[3px] h-[3px] rounded-full bg-paper/85" />
              <span className="w-[3px] h-[3px] rounded-full bg-paper/85" />
            </span>
          </span>
          <span
            className="absolute bottom-0 right-0 w-8 h-7 rounded-xl rounded-br-sm grid place-items-center text-paper shadow-[0_6px_14px_-4px_rgba(11,19,38,0.3)]"
            style={{ background: "linear-gradient(135deg, #BAE6FD, #7DD3FC)" }}
          >
            <span className="flex gap-[2px]">
              <span className="w-[3px] h-[3px] rounded-full bg-paper/90" />
              <span className="w-[3px] h-[3px] rounded-full bg-paper/90" />
              <span className="w-[3px] h-[3px] rounded-full bg-paper/90" />
            </span>
          </span>
        </div>
      ),
    },

    /* MIDDLE-LEFT — growth chart + coin stack */
    {
      key: "chart",
      pos: { left: "0%", top: "42%" },
      anchor: { x: 13, y: 50 },
      src: { x: 36, y: 50 },
      render: () => (
        <div className="relative w-14 h-12 flex items-end gap-1">
          <div
            className="relative w-10 h-10 rounded-lg grid place-items-center text-[#16A34A] shadow-[0_6px_14px_-4px_rgba(11,19,38,0.3)] border border-[#16A34A]/15"
            style={{ background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)" }}
          >
            <LineChart className="w-5 h-5" strokeWidth={2.3} />
            <TrendingUp
              className="absolute -top-1 -right-1 w-3 h-3 text-paper bg-[#16A34A] rounded p-0.5"
              strokeWidth={3}
            />
          </div>
          <div className="flex flex-col items-center -ml-1 mb-0.5">
            <Coins className="w-3 h-3 text-[#CA8A04]" strokeWidth={2.5} fill="#FDE68A" />
            <Coins className="w-3.5 h-3.5 -mt-1 text-[#CA8A04]" strokeWidth={2.5} fill="#FDE68A" />
          </div>
        </div>
      ),
    },

    /* BOTTOM-LEFT — document with pie / bar chart */
    {
      key: "doc",
      pos: { left: "2%", top: "76%" },
      anchor: { x: 14, y: 84 },
      src: { x: 38, y: 62 },
      render: () => (
        <div
          className="relative w-10 h-12 rounded-md shadow-[0_6px_14px_-4px_rgba(11,19,38,0.3)] border border-foreground/8 overflow-hidden"
          style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)" }}
        >
          <span
            aria-hidden
            className="absolute top-0 right-0 w-3 h-3"
            style={{
              background: "linear-gradient(225deg, #CBD5E1 49%, transparent 51%)",
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
            }}
          />
          <div
            className="absolute top-2 left-1.5 w-3 h-3 rounded-full"
            style={{
              background:
                "conic-gradient(#22C55E 0% 35%, #3B82F6 35% 60%, #F59E0B 60% 100%)",
            }}
          />
          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-end gap-[2px] h-4">
            {[40, 70, 55, 90, 60].map((h, i) => (
              <span
                key={i}
                className="block flex-1 rounded-[1px]"
                style={{ background: i === 3 ? "#22C55E" : "#94A3B8", height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      ),
    },

    /* TOP-RIGHT — team of 3 people */
    {
      key: "team",
      pos: { right: "1%", top: "6%" },
      anchor: { x: 86, y: 16 },
      src: { x: 64, y: 38 },
      render: () => (
        <div className="relative w-12 h-12">
          <span
            className="absolute top-1 left-0 w-5 h-5 rounded-full grid place-items-center text-paper shadow-[0_4px_10px_-3px_rgba(11,19,38,0.3)]"
            style={{ background: "linear-gradient(135deg, #FCA5A5, #EF4444)" }}
          >
            <User className="w-3 h-3" strokeWidth={2.5} />
          </span>
          <span
            className="absolute top-1 right-0 w-5 h-5 rounded-full grid place-items-center text-paper shadow-[0_4px_10px_-3px_rgba(11,19,38,0.3)]"
            style={{ background: "linear-gradient(135deg, #FCA5A5, #EF4444)" }}
          >
            <User className="w-3 h-3" strokeWidth={2.5} />
          </span>
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full grid place-items-center text-paper shadow-[0_4px_10px_-3px_rgba(11,19,38,0.35)]"
            style={{ background: "linear-gradient(135deg, #5EEAD4, #0F766E)" }}
          >
            <User className="w-3.5 h-3.5" strokeWidth={2.5} />
          </span>
        </div>
      ),
    },

    /* MIDDLE-RIGHT — money bag with coins */
    {
      key: "money",
      pos: { right: "0%", top: "42%" },
      anchor: { x: 87, y: 50 },
      src: { x: 64, y: 50 },
      render: () => (
        <div className="relative w-14 h-12 flex items-end gap-1">
          <div className="flex flex-col items-center mb-0.5">
            <DollarSign className="w-3 h-3 text-[#CA8A04]" strokeWidth={3} />
            <Coins className="w-3.5 h-3.5 -mt-0.5 text-[#CA8A04]" strokeWidth={2.5} fill="#FDE68A" />
          </div>
          <div
            className="relative w-10 h-10 rounded-xl grid place-items-center text-[#854D0E] shadow-[0_6px_14px_-4px_rgba(11,19,38,0.3)] border border-[#CA8A04]/25"
            style={{ background: "linear-gradient(135deg, #FEF3C7, #FCD34D)" }}
          >
            <Wallet className="w-5 h-5" strokeWidth={2.3} />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[6px] font-bold text-paper bg-[#CA8A04]">
              $
            </span>
          </div>
        </div>
      ),
    },

    /* BOTTOM-RIGHT — envelope with red notification badge + bell */
    {
      key: "mail",
      pos: { right: "2%", top: "76%" },
      anchor: { x: 86, y: 84 },
      src: { x: 62, y: 62 },
      render: () => (
        <div className="relative w-10 h-10">
          <div
            className="w-full h-full rounded-xl grid place-items-center text-paper shadow-[0_6px_14px_-4px_rgba(11,19,38,0.3)]"
            style={{ background: "linear-gradient(135deg, #FDE68A, #CA8A04)" }}
          >
            <Mail className="w-5 h-5" strokeWidth={2.3} />
          </div>
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#EF4444] text-paper text-[8px] font-bold shadow-[0_2px_4px_rgba(239,68,68,0.5)] border border-paper">
            1
          </span>
          <Bell
            className="absolute -top-2 -left-1 w-3 h-3 text-[#0F766E]"
            strokeWidth={2.5}
            fill="#5EEAD4"
          />
        </div>
      ),
    },
  ];

  const decorations = [
    { Icon: Settings,   pos: { left: "32%", top: "10%" }, size: 10, opacity: 0.35, rotate: true,  reverse: false },
    { Icon: Settings,   pos: { right: "26%", top: "14%" }, size: 8,  opacity: 0.3,  rotate: true,  reverse: true  },
    { Icon: Settings,   pos: { left: "24%", top: "78%" }, size: 9,  opacity: 0.3,  rotate: true,  reverse: true  },
    { Icon: Settings,   pos: { right: "30%", top: "82%" }, size: 8,  opacity: 0.32, rotate: true,  reverse: false },
    { Icon: DollarSign, pos: { left: "28%", top: "44%" }, size: 9,  opacity: 0.4,  rotate: false, reverse: false },
    { Icon: DollarSign, pos: { right: "28%", top: "30%" }, size: 8,  opacity: 0.35, rotate: false, reverse: false },
    { Icon: DollarSign, pos: { right: "32%", top: "68%" }, size: 9,  opacity: 0.4,  rotate: false, reverse: false },
  ];

  return (
    <Stage>
      <div className="relative w-full h-full">
        {/* ── Connector lines from laptop edges to each cluster ────── */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {clusters.map((c) => (
            <line
              key={c.key}
              x1={c.src.x}
              y1={c.src.y}
              x2={c.anchor.x}
              y2={c.anchor.y}
              stroke="color-mix(in srgb, var(--accent) 30%, transparent)"
              strokeWidth={0.32}
              strokeDasharray="1.4 1.2"
            />
          ))}
        </svg>

        {/* ── Scattered decorations (gears + $) ────────────────────── */}
        {decorations.map((d, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute z-[2]"
            style={{ ...d.pos, opacity: d.opacity }}
          >
            {d.rotate ? (
              <motion.span
                animate={{ rotate: d.reverse ? [360, 0] : [0, 360] }}
                transition={{
                  duration: 14 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="block text-foreground/65"
                style={{ width: d.size, height: d.size }}
              >
                <d.Icon className="w-full h-full" strokeWidth={1.6} />
              </motion.span>
            ) : (
              <d.Icon
                className="text-[#16A34A]"
                style={{ width: d.size, height: d.size }}
                strokeWidth={2.5}
              />
            )}
          </span>
        ))}

        {/* ── Central laptop ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          animate={{ y: [0, -3, 0] }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] z-20"
        >
          <div className="relative">
            {/* Screen bezel */}
            <div
              className="relative w-full aspect-[16/10] rounded-t-lg p-1 shadow-[0_30px_50px_-20px_rgba(11,19,38,0.45)]"
              style={{ background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)" }}
            >
              <span className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ink/80" />
              <div className="relative w-full h-full rounded-md overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, #F0FDF4 0%, #ECFDF5 60%, #D1FAE5 100%)",
                  }}
                />
                {/* Light reflection diagonal */}
                <span
                  aria-hidden
                  className="absolute inset-0 z-[3] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.35) 48%, transparent 60%)",
                  }}
                />

                {/* ── Dashboard content ──────────────────────────── */}
                <div className="absolute inset-0 flex flex-col px-1.5 pt-1 pb-1 z-[2]">
                  {/* Header row */}
                  <div className="flex items-center gap-1 mb-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-sm bg-[#22C55E]" />
                    <span className="text-[4.5px] font-bold uppercase tracking-[0.14em] text-ink/85 leading-none">
                      CRM · Q3
                    </span>
                    <span className="ml-auto inline-flex items-center gap-0.5 text-[3.5px] font-mono uppercase tracking-[0.12em] text-ink/55 leading-none">
                      <span className="w-0.5 h-0.5 rounded-full bg-[#22C55E]" />
                      live
                    </span>
                  </div>

                  {/* Sparkline chart panel */}
                  <div
                    className="relative flex-1 rounded-[2px] border border-[#22C55E]/15 overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)",
                    }}
                  >
                    {/* horizontal grid lines */}
                    <span className="absolute top-[25%] inset-x-0 h-px bg-ink/8" />
                    <span className="absolute top-[50%] inset-x-0 h-px bg-ink/8" />
                    <span className="absolute top-[75%] inset-x-0 h-px bg-ink/8" />
                    {/* sparkline */}
                    <svg
                      viewBox="0 0 100 40"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full"
                    >
                      <defs>
                        <linearGradient id="crm-screen-area" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,28 L 12,22 L 24,25 L 36,16 L 48,18 L 60,10 L 72,12 L 84,6 L 100,4 L 100,40 L 0,40 Z"
                        fill="url(#crm-screen-area)"
                      />
                      <motion.path
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                        d="M 0,28 L 12,22 L 24,25 L 36,16 L 48,18 L 60,10 L 72,12 L 84,6 L 100,4"
                        fill="none"
                        stroke="#16A34A"
                        strokeWidth={1.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* end-of-line marker */}
                      <circle cx="100" cy="4" r="1.3" fill="#16A34A" />
                    </svg>
                    {/* tiny "+38%" pill */}
                    <span className="absolute top-0.5 right-0.5 inline-flex items-center px-[2px] py-px rounded-[1px] bg-[#16A34A] text-paper text-[3.5px] font-bold leading-none">
                      +38%
                    </span>
                  </div>

                  {/* KPI tiles row */}
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    {[
                      { label: "Deals",   value: "63",   color: "#3B82F6" },
                      { label: "Pipeline", value: "$1.2m", color: "#F97316" },
                      { label: "Won",     value: "$480k", color: "#22C55E" },
                    ].map((k) => (
                      <div
                        key={k.label}
                        className="rounded-[1.5px] px-1 py-0.5 border border-ink/8"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)",
                        }}
                      >
                        <div className="text-[3px] font-mono uppercase tracking-[0.12em] text-ink/55 leading-none">
                          {k.label}
                        </div>
                        <div
                          className="text-[5.5px] font-bold tabular-nums leading-none mt-0.5"
                          style={{ color: k.color }}
                        >
                          {k.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gears tucked in upper-right corner (system indicator) */}
                <div className="absolute top-[6%] right-[5%] w-[26%] h-[40%] z-[4] pointer-events-none">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] left-[10%] w-[55%] h-[55%] text-[#F97316]"
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(11,19,38,0.25))",
                      opacity: 0.85,
                    }}
                  >
                    <Settings className="w-full h-full" strokeWidth={1.8} fill="currentColor" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: [360, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 w-[42%] h-[42%] text-[#22C55E]"
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(11,19,38,0.25))",
                      opacity: 0.9,
                    }}
                  >
                    <Settings className="w-full h-full" strokeWidth={1.8} fill="currentColor" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 right-[6%] w-[34%] h-[34%] text-[#EF4444]"
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(11,19,38,0.25))",
                      opacity: 0.85,
                    }}
                  >
                    <Settings className="w-full h-full" strokeWidth={1.8} fill="currentColor" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Keyboard / base */}
            <div className="relative -mt-px">
              <div
                className="mx-auto rounded-b-xl"
                style={{
                  width: "118%",
                  marginLeft: "-9%",
                  height: "10px",
                  background: "linear-gradient(180deg, #E2E8F0 0%, #94A3B8 100%)",
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.7), 0 6px 10px -4px rgba(11,19,38,0.3)",
                }}
              />
              <div
                className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[24%] h-[2px] rounded-b-full"
                style={{ background: "linear-gradient(180deg, #94A3B8 0%, #64748B 100%)" }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── 6 floating icon clusters ─────────────────────────────── */}
        {clusters.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.25 + i * 0.08,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute z-30"
            style={c.pos}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{
                ...FLOAT_TRANSITION,
                duration: 4 + (i % 3),
                delay: i * 0.25,
              }}
            >
              {c.render()}
            </motion.div>
          </motion.div>
        ))}

        {/* Hidden imports retained for shared visual library */}
        <Cloud className="absolute opacity-0 pointer-events-none" />
        <Lightbulb className="absolute opacity-0 pointer-events-none" />
        <BarChart3 className="absolute opacity-0 pointer-events-none" />
        <Puzzle className="absolute opacity-0 pointer-events-none" />
        <FileBarChart className="absolute opacity-0 pointer-events-none" />
        <Activity className="absolute opacity-0 pointer-events-none" />
        <MessageCircle className="absolute opacity-0 pointer-events-none" />
        <Sparkles className="absolute opacity-0 pointer-events-none" />
        <Users className="absolute opacity-0 pointer-events-none" />
      </div>
    </Stage>
  );
}

/* ─── 04 · Integrations & Automations ────────────────────────────────────── */
/* Workflow canvas — a polished n8n-style editor: a framed card with a slim
 * toolbar at the top, a subtle dot grid inside, and 5 nodes (Trigger → AI →
 * 3 Actions) wired with clean bezier connectors. Each node carries a type
 * chip (TRIGGER / AI / ACTION) above the icon and connection-handle pips
 * at the edges so it reads as a real editor surface, not a sketch. */

type FlowNodeKind = "trigger" | "ai" | "action";

const FLOW_NODES: Array<{
  key: string;
  name: string;
  sub: string;
  kind: FlowNodeKind;
  Icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
    style?: React.CSSProperties;
  }>;
  tint: string;
  bg: string;
  borderColor: string;
  x: number;
  y: number;
  hero?: boolean;
}> = [
  {
    key: "webhook",
    name: "Webhook",
    sub: "POST /lead",
    kind: "trigger",
    Icon: Zap,
    tint: "#15803D",
    bg: "rgba(190,242,100,0.55)",
    borderColor: "rgba(101,163,13,0.35)",
    x: 13,
    y: 56,
  },
  {
    key: "ai",
    name: "AI parse",
    sub: "classify · enrich",
    kind: "ai",
    Icon: Bot,
    tint: "#FFFFFF",
    bg: "linear-gradient(135deg, #BEF264, #65A30D)",
    borderColor: "#65A30D",
    x: 48,
    y: 56,
    hero: true,
  },
  {
    key: "hubspot",
    name: "HubSpot",
    sub: "create contact",
    kind: "action",
    Icon: Users,
    tint: "#0F766E",
    bg: "rgba(94,234,212,0.50)",
    borderColor: "rgba(15,118,110,0.30)",
    x: 84,
    y: 26,
  },
  {
    key: "slack",
    name: "Slack",
    sub: "#new-leads",
    kind: "action",
    Icon: MessageCircle,
    tint: "#7C2D12",
    bg: "rgba(254,215,170,0.78)",
    borderColor: "rgba(124,45,18,0.28)",
    x: 84,
    y: 56,
  },
  {
    key: "gmail",
    name: "Gmail",
    sub: "welcome reply",
    kind: "action",
    Icon: Mail,
    tint: "#B45309",
    bg: "rgba(254,243,199,0.95)",
    borderColor: "rgba(180,83,9,0.30)",
    x: 84,
    y: 86,
  },
];

const FLOW_CONNECTIONS = [
  { from: "webhook", to: "ai" },
  { from: "ai", to: "hubspot" },
  { from: "ai", to: "slack" },
  { from: "ai", to: "gmail" },
];

function IntegrationsVisual() {
  // Half-width of the node icon block in SVG viewBox units (paths stop at
  // node edge, not at centre).
  const NODE_HW = 6.5;
  const nodeMap = Object.fromEntries(FLOW_NODES.map((n) => [n.key, n]));

  return (
    <Stage>
      <div className="relative w-full h-full flex flex-col">
        {/* ── Editor toolbar ─────────────────────────────────────── */}
        <div className="relative z-20 flex items-center justify-between px-3 py-2 border-b border-foreground/8 bg-paper/70 backdrop-blur-sm">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="inline-grid place-items-center w-4 h-4 rounded text-paper shrink-0"
              style={{
                background: "linear-gradient(135deg, #BEF264, #65A30D)",
                boxShadow: "0 2px 4px -1px rgba(101,163,13,0.4)",
              }}
            >
              <Bot className="w-2.5 h-2.5" strokeWidth={2.4} />
            </span>
            <span className="text-[8.5px] font-semibold text-foreground/85 leading-none truncate">
              new-lead.workflow
            </span>
            <span className="text-[6.5px] font-mono uppercase tracking-[0.14em] text-foreground/45 leading-none">
              · v1.4
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[6.5px] font-mono uppercase tracking-[0.14em] text-foreground/55">
            <span>5 nodes</span>
            <span className="w-px h-2 bg-foreground/15" />
            <span>4 links</span>
          </div>
        </div>

        {/* ── Canvas area ────────────────────────────────────────── */}
        <div className="relative flex-1 overflow-hidden">
          {/* Subtle dot grid */}
          <svg
            aria-hidden
            className="absolute inset-0 w-full h-full z-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {Array.from({ length: 11 }).flatMap((_, r) =>
              Array.from({ length: 13 }).map((_, c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={4 + c * 8}
                  cy={6 + r * 9}
                  r={0.22}
                  fill="rgba(31,41,55,0.18)"
                />
              ))
            )}
          </svg>

          {/* Soft lime glow behind the AI node — tonal warmth only */}
          <span
            aria-hidden
            className="absolute z-0 rounded-full"
            style={{
              left: "32%",
              top: "30%",
              width: "36%",
              aspectRatio: "1",
              background:
                "radial-gradient(circle, rgba(190,242,100,0.35), transparent 70%)",
              filter: "blur(24px)",
            }}
          />

          {/* Connector bezier paths */}
          <svg
            aria-hidden
            className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {FLOW_CONNECTIONS.map((c) => {
              const from = nodeMap[c.from];
              const to = nodeMap[c.to];
              const x1 = from.x + NODE_HW;
              const y1 = from.y;
              const x2 = to.x - NODE_HW;
              const y2 = to.y;
              const cpx = (x1 + x2) / 2;
              const d = `M ${x1} ${y1} C ${cpx} ${y1}, ${cpx} ${y2}, ${x2} ${y2}`;
              return (
                <path
                  key={`${c.from}-${c.to}`}
                  d={d}
                  fill="none"
                  stroke="#65A30D"
                  strokeWidth={0.85}
                  strokeLinecap="round"
                  opacity={0.65}
                />
              );
            })}
          </svg>

          {/* Nodes — icon centred on (x%, y%); type chip above, label below */}
          {FLOW_NODES.map((n, i) => (
            <motion.div
              key={n.key}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.12 + i * 0.07,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <FlowNode
                name={n.name}
                sub={n.sub}
                kind={n.kind}
                Icon={n.Icon}
                tint={n.tint}
                bg={n.bg}
                borderColor={n.borderColor}
                hero={n.hero}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

const KIND_LABEL: Record<FlowNodeKind, string> = {
  trigger: "Trigger",
  ai: "AI",
  action: "Action",
};

function FlowNode({
  name,
  sub,
  kind,
  Icon,
  tint,
  bg,
  borderColor,
  hero,
}: {
  name: string;
  sub: string;
  kind: FlowNodeKind;
  Icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
    style?: React.CSSProperties;
  }>;
  tint: string;
  bg: string;
  borderColor: string;
  hero?: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Node type chip — sits above the icon */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap">
        <span
          className="inline-block px-1.5 py-0.5 rounded-full text-[5.5px] font-mono font-bold uppercase tracking-[0.14em]"
          style={{
            background: hero ? "rgba(190,242,100,0.55)" : "rgba(31,41,55,0.06)",
            color: hero ? "#15803D" : "rgba(31,41,55,0.55)",
          }}
        >
          {KIND_LABEL[kind]}
        </span>
      </div>

      {/* Icon body */}
      <div
        className="relative w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-[14px] grid place-items-center"
        style={{
          background: bg,
          border: hero ? `2px solid ${borderColor}` : `1.5px solid ${borderColor}`,
          boxShadow: hero
            ? "0 16px 30px -10px rgba(101,163,13,0.5), 0 4px 10px -3px rgba(11,19,38,0.18)"
            : "0 10px 22px -10px rgba(11,19,38,0.32), 0 2px 6px -2px rgba(11,19,38,0.12)",
        }}
      >
        <Icon
          className="w-5 h-5 md:w-[22px] md:h-[22px]"
          strokeWidth={2.3}
          style={{ color: tint }}
        />
        {/* Connection handle dots — small filled pips on left + right edges */}
        <span
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 -left-[3.5px] w-[6px] h-[6px] rounded-full"
          style={{ background: borderColor, boxShadow: "0 0 0 2px var(--paper)" }}
        />
        <span
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 -right-[3.5px] w-[6px] h-[6px] rounded-full"
          style={{ background: borderColor, boxShadow: "0 0 0 2px var(--paper)" }}
        />
      </div>

      {/* Label below the icon */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-center">
        <div className="text-[9.5px] font-semibold text-foreground/85 leading-none">
          {name}
        </div>
        <div className="mt-0.5 text-[6.5px] font-mono uppercase tracking-[0.1em] text-foreground/50 leading-tight">
          {sub}
        </div>
      </div>
    </div>
  );
}

/* ─── 05 · Website Development ───────────────────────────────────────────── */

function WebsitesVisual() {
  return (
    <Stage>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={FLOAT_TRANSITION}
        className="relative w-[88%]"
        style={{ transform: "rotateX(10deg) rotateY(-13deg) rotateZ(-1deg)" }}
      >
        <div className="bg-paper border border-line rounded-2xl overflow-hidden shadow-[0_50px_90px_-32px_rgba(11,19,38,0.4)]">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line bg-gradient-to-b from-bg-warm to-bg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-2.5 flex-1 inline-flex items-center gap-1 h-4 rounded-[6px] bg-paper border border-line px-2">
              <Lock className="w-2 h-2 text-foreground/40" strokeWidth={2.5} />
              <span className="text-[8px] font-mono text-foreground/55 truncate">
                clixsolution.com
              </span>
            </span>
            <Globe className="w-3 h-3 text-foreground/40" />
          </div>
          {/* Page content */}
          <div className="p-3.5 space-y-3">
            <div className="flex items-end justify-between">
              <div className="space-y-1.5">
                <span className="block h-2.5 w-20 rounded bg-foreground" />
                <span className="block h-1.5 w-28 rounded bg-foreground/30" />
              </div>
              <div className="inline-flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent-soft text-[8px] font-mono uppercase tracking-[0.14em] text-accent">
                  <Zap className="w-2.5 h-2.5 fill-current" />
                  98 PSI
                </span>
                <span className="text-[7px] font-mono text-foreground/45">
                  Lighthouse
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <span
                className="block aspect-[5/3] rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #A3E635, color-mix(in srgb, #A3E635 70%, white))",
                }}
              />
              <span
                className="block aspect-[5/3] rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #5EEAD4, color-mix(in srgb, #5EEAD4 70%, white))",
                }}
              />
              <span
                className="block aspect-[5/3] rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-deep))",
                }}
              />
            </div>
            <div className="space-y-1">
              <span className="block h-1 rounded bg-foreground/15 w-[92%]" />
              <span className="block h-1 rounded bg-foreground/15 w-[78%]" />
              <span className="block h-1 rounded bg-foreground/15 w-[85%]" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent text-paper text-[8px] font-semibold">
                Start a project
                <ArrowRight className="w-2 h-2" strokeWidth={3} />
              </span>
              <span className="text-[8px] font-mono uppercase tracking-[0.14em] text-foreground/50">
                or learn more
              </span>
            </div>
          </div>
        </div>

        {/* Floating performance badge */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ ...FLOAT_TRANSITION, delay: 0.7 }}
          className="absolute -bottom-3 -right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-paper border border-line text-[10px] font-medium text-foreground/80 shadow-[0_18px_30px_-10px_rgba(11,19,38,0.3)]"
        >
          <BarChart3 className="w-3 h-3 text-accent" strokeWidth={2} />
          +24% conversion
        </motion.div>
      </motion.div>
    </Stage>
  );
}

/* ─── 06 · Mobile Development ────────────────────────────────────────────── */
/* A central phone showing a dashboard UI, flanked by floating circular
 * tech-stack badges (mobile dev frameworks/tools), plus two overlapping
 * gear icons and a mini bar chart on the left side. Matches the reference
 * mobile-dev illustration style: tech ecosystem orbiting the device. */

const TECH_BADGES = [
  { Icon: Code2,       label: "Swift",     color: "#FF6B47",  pos: "top-[4%]  right-[22%]", delay: 0.0, size: 32 },
  { Icon: Smartphone,  label: "Native",    color: "#3DDC84",  pos: "top-[2%]  right-[8%]",  delay: 0.2, size: 38 },
  { Icon: Layers,      label: "Expo",      color: "#000000",  pos: "top-[18%] right-[2%]",  delay: 0.4, size: 34 },
  { Icon: Cpu,         label: "Native",    color: "#61DAFB",  pos: "top-[32%] right-[10%]", delay: 0.6, size: 36, logo: true },
  { Icon: Zap,         label: "Fast",      color: "#FFCA28",  pos: "top-[50%] right-[2%]",  delay: 0.8, size: 32 },
  { Icon: Compass,     label: "Qt",        color: "#41CD52",  pos: "top-[64%] right-[12%]", delay: 1.0, size: 38 },
  { Icon: Package,     label: "Pkg",       color: "#A4C639",  pos: "top-[78%] right-[4%]",  delay: 1.2, size: 34 },
  { Icon: GitBranch,   label: "Git",       color: "#F05032",  pos: "top-[88%] right-[24%]", delay: 1.4, size: 30 },
  { Icon: Terminal,    label: "Term",      color: "#2C3E50",  pos: "top-[80%] left-[18%]",  delay: 1.6, size: 34 },
];

function MobileVisual() {
  return (
    <Stage>
      <div className="relative w-full h-full">
        {/* ── Top-left: two overlapping gears (decoration) ──────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute top-[4%] left-[10%] z-20"
        >
          <div className="relative w-12 h-12">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 grid place-items-center text-foreground/35"
            >
              <Settings className="w-full h-full" strokeWidth={1.4} />
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="absolute top-[12%] left-[22%] z-20"
        >
          <div className="relative w-9 h-9">
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 grid place-items-center text-foreground/45"
            >
              <Settings className="w-full h-full" strokeWidth={1.4} />
            </motion.div>
          </div>
        </motion.div>

        {/* ── Left: mini bar chart ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.55 }}
          className="absolute top-[38%] left-[6%] z-20"
        >
          <div className="flex items-end gap-1 h-9">
            {[8, 16, 12, 22, 18, 28].map((h, i) => (
              <motion.span
                key={i}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.06, duration: 0.4 }}
                className="block w-1.5 rounded-t-sm bg-accent origin-bottom"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <div className="mt-0.5 w-12 h-px bg-foreground/30" />
        </motion.div>

        {/* ── Centre phone with dashboard UI ────────────────────────── */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={FLOAT_TRANSITION}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            transform: "translate(-50%, -50%) rotateX(4deg) rotateY(-4deg)",
          }}
        >
          <div className="relative w-[140px] md:w-[160px] aspect-[10/20] rounded-[28px] p-1 bg-gradient-to-br from-ink-warm via-ink to-ink-warm shadow-[0_50px_80px_-26px_rgba(11,19,38,0.55)]">
            {/* Side buttons */}
            <span className="absolute top-[18%] -left-[2px] w-[3px] h-8 rounded-l bg-ink/85" />
            <span className="absolute top-[28%] -left-[2px] w-[3px] h-5 rounded-l bg-ink/85" />
            <span className="absolute top-[20%] -right-[2px] w-[3px] h-12 rounded-r bg-ink/85" />

            <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-gradient-to-b from-paper to-bg-warm">
              {/* Dynamic island */}
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-9 h-2.5 rounded-full bg-ink-warm z-30" />

              {/* Screen content */}
              <div className="absolute inset-0 pt-7 px-3 flex flex-col gap-2">
                {/* Top grid widget */}
                <div className="rounded-lg bg-bg-warm border border-line/60 p-1.5 grid grid-cols-3 gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span
                      key={i}
                      className={`aspect-square rounded-sm ${
                        i === 2 ? "bg-[#FF6B47]" : "bg-accent/30"
                      }`}
                    />
                  ))}
                </div>

                {/* Detail lines */}
                <div className="space-y-1 px-0.5">
                  <span className="block h-1 rounded bg-foreground/25 w-[90%]" />
                  <span className="block h-1 rounded bg-foreground/15 w-[75%]" />
                  <span className="block h-1 rounded bg-foreground/15 w-[60%]" />
                </div>

                {/* Bottom card */}
                <div className="mt-auto mb-4 rounded-lg bg-paper border border-line/70 p-1.5 shadow-sm">
                  <span className="block aspect-[3/1] rounded bg-accent/25 mb-1" />
                  <div className="space-y-0.5">
                    <span className="block h-0.5 rounded bg-foreground/30 w-[70%]" />
                    <span className="block h-0.5 rounded bg-foreground/15 w-[55%]" />
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-ink/30 z-30" />
            </div>
          </div>
        </motion.div>

        {/* ── Clix-branded badge — top-left of the phone ────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          animate={{ y: [0, -4, 0] }}
          className="absolute top-[30%] left-[2%] z-30"
        >
          <div className="w-9 h-9 rounded-full bg-paper grid place-items-center text-ink shadow-[0_10px_20px_-6px_rgba(11,19,38,0.3),inset_0_1px_2px_rgba(255,255,255,0.5)]">
            <LogoMark size={16} />
          </div>
        </motion.div>

        {/* ── Floating tech badges around the phone ─────────────────── */}
        {TECH_BADGES.map(({ Icon, color, pos, delay, size }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.1 + i * 0.05,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`absolute ${pos} z-30`}
            style={{ width: size, height: size }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 4 + (i % 4) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
              className="w-full h-full rounded-full bg-paper grid place-items-center shadow-[0_10px_20px_-6px_rgba(11,19,38,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)]"
            >
              <Icon
                strokeWidth={2}
                style={{
                  width: size * 0.5,
                  height: size * 0.5,
                  color,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </Stage>
  );
}


/* ─── 07 · Custom Software ───────────────────────────────────────────────── */
/* Code editor with sidebar file tree, tabs, line numbers and proper syntax-
 * highlighted code rendered as token bars. */

function SoftwareVisual() {
  const codeLines: Array<{ tabs: number; tokens: Array<{ kind: string; w: number }> }> = [
    { tabs: 0, tokens: [{ kind: "kw", w: 18 }, { kind: "fn", w: 30 }, { kind: "br", w: 4 }] },
    { tabs: 1, tokens: [{ kind: "kw", w: 16 }, { kind: "var", w: 18 }, { kind: "op", w: 8 }, { kind: "str", w: 32 }] },
    { tabs: 1, tokens: [{ kind: "kw", w: 14 }, { kind: "var", w: 16 }, { kind: "op", w: 6 }, { kind: "fn", w: 22 }, { kind: "br", w: 6 }] },
    { tabs: 2, tokens: [{ kind: "var", w: 12 }, { kind: "op", w: 6 }, { kind: "num", w: 14 }] },
    { tabs: 1, tokens: [{ kind: "br", w: 4 }] },
    { tabs: 1, tokens: [{ kind: "kw", w: 18 }, { kind: "var", w: 20 }] },
    { tabs: 0, tokens: [{ kind: "br", w: 4 }] },
  ];

  // Light-mode token palette — readable on the cream paper background.
  // Same hue family as the rest of the service tiles (lime / mint / wheat
  // / cornflower) but darker shades so they pop against paper.
  const tokenColor = (kind: string) => {
    switch (kind) {
      case "kw":  return "#65A30D";                       // deep lime — keywords
      case "fn":  return "#15803D";                       // forest green — function names
      case "var": return "rgba(31,41,55,0.85)";           // ink — identifiers
      case "str": return "#B45309";                       // amber — strings
      case "num": return "#0F766E";                       // mint deep — numbers
      case "op":  return "rgba(31,41,55,0.45)";           // ink soft — operators
      case "br":
      default:    return "rgba(31,41,55,0.30)";           // ink softer — braces
    }
  };

  const files = ["dashboard.tsx", "api.ts", "types.ts", "schema.sql"];

  return (
    <Stage>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={FLOAT_TRANSITION}
        className="relative w-[92%]"
        style={{ transform: "rotateX(10deg) rotateY(-13deg) rotateZ(-1deg)" }}
      >
        <div
          className="rounded-xl overflow-hidden border shadow-[0_30px_60px_-25px_rgba(11,19,38,0.22)]"
          style={{
            background: "var(--paper)",
            borderColor: "rgba(31,41,55,0.12)",
          }}
        >
          {/* Editor header — traffic lights + tab. Soft cream → paper-warm
              gradient (no more dark slate). */}
          <div
            className="flex items-center gap-1.5 px-3 py-2"
            style={{
              background: "linear-gradient(180deg, var(--paper) 0%, var(--bg-warm) 100%)",
              borderBottom: "1px solid rgba(31,41,55,0.08)",
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <span
              className="ml-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8.5px] font-mono"
              style={{
                background: "rgba(190,242,100,0.18)",
                border: "1px solid rgba(101,163,13,0.35)",
                color: "#15803D",
              }}
            >
              <Code2 className="w-2.5 h-2.5" style={{ color: "#65A30D" }} />
              dashboard.tsx
            </span>
          </div>

          {/* Body — sidebar + code, both on paper */}
          <div className="flex" style={{ background: "var(--paper)" }}>
            {/* Sidebar — paper-warm with a subtle right border */}
            <div
              className="w-[32%] py-3 px-2 space-y-1"
              style={{
                background: "var(--bg-warm)",
                borderRight: "1px solid rgba(31,41,55,0.08)",
              }}
            >
              <div
                className="text-[7px] font-mono uppercase tracking-[0.14em] px-1.5 mb-1.5"
                style={{ color: "rgba(31,41,55,0.45)" }}
              >
                Explorer
              </div>
              {files.map((f, i) => (
                <div
                  key={f}
                  className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[8px] font-mono"
                  style={{
                    background: i === 0 ? "rgba(190,242,100,0.28)" : "transparent",
                    color: i === 0 ? "#15803D" : "rgba(31,41,55,0.62)",
                    fontWeight: i === 0 ? 600 : 400,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-sm"
                    style={{ background: i === 0 ? "#65A30D" : "rgba(101,163,13,0.5)" }}
                  />
                  {f}
                </div>
              ))}
            </div>

            {/* Code area */}
            <div className="flex-1 py-3 pr-3 space-y-1.5">
              {codeLines.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                  style={{ paddingLeft: `${l.tabs * 10}px` }}
                >
                  <span
                    className="text-[8px] font-mono w-3 text-right shrink-0 tabular-nums"
                    style={{ color: "rgba(31,41,55,0.30)" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-1 flex-1">
                    {l.tokens.map((t, j) => (
                      <span
                        key={j}
                        className="block h-1.5 rounded"
                        style={{
                          width: `${t.w}px`,
                          background: tokenColor(t.kind),
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status bar — lime gradient on dark ink text */}
          <div
            className="flex items-center justify-between px-3 py-1 text-[7.5px] font-mono uppercase tracking-[0.12em]"
            style={{
              background: "linear-gradient(90deg, #65A30D 0%, #BEF264 100%)",
              color: "#0F172A",
            }}
          >
            <span className="font-semibold">main · TypeScript</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={2.5} />
              build ok
            </span>
          </div>
        </div>
      </motion.div>
    </Stage>
  );
}

/* ─── 08 · AI Strategy & Consulting ──────────────────────────────────────── */
/* Laptop running an "AI Strategy · Q3 Brief" dashboard with three clickable
 * tabs (Audit / Use-cases / Roadmap). Each tab swaps the chart panel below
 * — readiness bars, an impact-vs-effort matrix, and a 6-month roadmap.
 * Two side-cards float at the corners: an AI-readiness score chip and a
 * SOC 2 · GDPR risk-review chip. */

function StrategyVisual() {
  const [active, setActive] = useState(0);

  const tabs = [
    { key: "audit", label: "Audit", count: "5 areas" },
    { key: "cases", label: "Use-cases", count: "12 ranked" },
    { key: "roadmap", label: "Roadmap", count: "6 mo" },
  ];

  return (
    <Stage>
      <div className="relative w-full h-full grid place-items-center">
        {/* Soft halo behind the laptop */}
        <span
          aria-hidden
          className="absolute z-0 rounded-full"
          style={{
            left: "12%",
            top: "12%",
            width: "76%",
            aspectRatio: "1.4",
            background:
              "radial-gradient(circle, rgba(190,242,100,0.30), rgba(94,234,212,0.16) 50%, transparent 76%)",
            filter: "blur(28px)",
          }}
        />

        {/* Laptop */}
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-[88%] max-w-[460px]"
        >
          {/* Screen bezel */}
          <div
            className="relative w-full aspect-[16/10] rounded-t-xl p-[3px] shadow-[0_36px_60px_-22px_rgba(11,19,38,0.4)]"
            style={{
              background: "linear-gradient(180deg, #1A1C23 0%, #262830 100%)",
            }}
          >
            <span className="absolute top-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ink/80 z-10" />

            {/* Screen interior */}
            <div className="relative w-full h-full rounded-[6px] overflow-hidden bg-paper flex flex-col">
              {/* Window title bar */}
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-foreground/8 bg-gradient-to-b from-paper to-bg-warm/70">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28C840]" />
                  <span className="ml-2.5 text-[7px] font-mono uppercase tracking-[0.14em] text-foreground/65">
                    ai strategy · q3 brief
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[6px] font-mono uppercase tracking-[0.14em] text-foreground/55">
                  <span className="w-1 h-1 rounded-full bg-[#65A30D]" />
                  draft
                </span>
              </div>

              {/* Clickable tab bar */}
              <div
                role="tablist"
                className="flex items-center gap-0.5 px-2 pt-1 border-b border-foreground/8 bg-bg-warm/40"
              >
                {tabs.map((t, i) => {
                  const isActive = active === i;
                  return (
                    <button
                      key={t.key}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(i)}
                      className="relative flex items-center gap-1 px-1.5 py-1 text-[8px] font-medium cursor-pointer focus:outline-none"
                      style={{
                        color: isActive ? "#15803D" : "rgba(31,41,55,0.55)",
                      }}
                    >
                      <span>{t.label}</span>
                      <span
                        className="rounded-full px-1 py-px text-[5.5px] font-mono uppercase tracking-[0.1em]"
                        style={{
                          background: isActive
                            ? "rgba(190,242,100,0.55)"
                            : "rgba(31,41,55,0.06)",
                          color: isActive
                            ? "#15803D"
                            : "rgba(31,41,55,0.5)",
                        }}
                      >
                        {t.count}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="strategy-tab-underline"
                          className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#65A30D] rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab content panel */}
              <div className="relative flex-1 p-2.5 overflow-hidden">
                {active === 0 && <StrategyAuditTab />}
                {active === 1 && <StrategyCasesTab />}
                {active === 2 && <StrategyRoadmapTab />}
              </div>
            </div>
          </div>

          {/* Laptop base / keyboard */}
          <div className="relative -mt-px">
            <div
              className="mx-auto rounded-b-xl"
              style={{
                width: "112%",
                marginLeft: "-6%",
                height: "9px",
                background: "linear-gradient(180deg, #E2E8F0 0%, #94A3B8 100%)",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.7), 0 6px 10px -4px rgba(11,19,38,0.3)",
              }}
            />
            <div
              className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[22%] h-[2px] rounded-b-full"
              style={{
                background:
                  "linear-gradient(180deg, #94A3B8 0%, #64748B 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* AI-READY score badge — top-left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute top-[4%] left-[1%] z-20 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-paper border border-line shadow-[0_12px_24px_-8px_rgba(11,19,38,0.28)]"
        >
          <span
            className="grid place-items-center w-7 h-7 rounded-full text-[9.5px] font-bold tabular-nums"
            style={{
              border: "2.5px solid #65A30D",
              color: "#15803D",
              background:
                "conic-gradient(from -90deg, #BEF264 0% 78%, rgba(31,41,55,0.08) 78% 100%)",
            }}
          >
            <span className="w-[18px] h-[18px] rounded-full bg-paper grid place-items-center">
              78
            </span>
          </span>
          <div className="leading-none">
            <div className="text-[6.5px] font-mono uppercase tracking-[0.14em] text-foreground/50">
              ai ready
            </div>
            <div className="mt-0.5 text-[9px] font-bold text-foreground/85">
              Above peers
            </div>
          </div>
        </motion.div>

        {/* Risk-review badge — bottom-left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="absolute bottom-[4%] left-[1%] z-20 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-paper border border-line shadow-[0_12px_24px_-8px_rgba(11,19,38,0.28)]"
        >
          <span
            className="grid place-items-center w-7 h-7 rounded-full"
            style={{
              background: "rgba(94,234,212,0.45)",
              color: "#0F766E",
            }}
          >
            <Shield className="w-3.5 h-3.5" strokeWidth={2.4} />
          </span>
          <div className="leading-none">
            <div className="text-[6.5px] font-mono uppercase tracking-[0.14em] text-foreground/50">
              risk review
            </div>
            <div className="mt-0.5 text-[9px] font-bold text-foreground/85">
              SOC 2 · GDPR
            </div>
          </div>
        </motion.div>
      </div>
    </Stage>
  );
}

/* — Tab 1 · Audit — horizontal readiness-score bars per pillar — */
function StrategyAuditTab() {
  const scores = [
    { label: "Data quality", score: 82, color: "#15803D" },
    { label: "Talent depth", score: 64, color: "#B45309" },
    { label: "Tooling", score: 91, color: "#15803D" },
    { label: "Process maturity", score: 58, color: "#B45309" },
    { label: "Governance", score: 73, color: "#0F766E" },
  ];

  return (
    <motion.div
      key="audit"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-1.5"
    >
      {scores.map((s, i) => (
        <div key={s.label} className="flex items-center gap-1.5">
          <span className="text-[6.5px] font-mono uppercase tracking-[0.1em] text-foreground/65 w-[40%] truncate">
            {s.label}
          </span>
          <div className="relative flex-1 h-1.5 rounded-full bg-bg-warm border border-foreground/5 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${s.score}%` }}
              transition={{
                delay: 0.12 + i * 0.07,
                duration: 0.55,
                ease: "easeOut",
              }}
              style={{
                background: `linear-gradient(90deg, ${s.color}, color-mix(in srgb, ${s.color} 60%, white))`,
              }}
            />
          </div>
          <span
            className="text-[7.5px] font-bold tabular-nums w-5 text-right"
            style={{ color: s.color }}
          >
            {s.score}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* — Tab 2 · Use-cases — impact-vs-effort 2x2 matrix — */
function StrategyCasesTab() {
  const cases = [
    { name: "Lead triage AI", impact: 78, effort: 22, tier: "win" },
    { name: "Voice receptionist", impact: 86, effort: 62, tier: "bet" },
    { name: "RAG knowledge bot", impact: 66, effort: 36, tier: "win" },
    { name: "Forecast model", impact: 52, effort: 72, tier: "rethink" },
    { name: "Auto reports", impact: 38, effort: 16, tier: "fill" },
    { name: "Churn predictor", impact: 70, effort: 58, tier: "bet" },
  ];

  return (
    <motion.div
      key="cases"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative h-full min-h-[110px]"
    >
      {/* Quadrant grid lines */}
      <span className="absolute inset-y-2 left-1/2 w-px bg-foreground/10" />
      <span className="absolute inset-x-2 top-1/2 h-px bg-foreground/10" />

      {/* Axis labels */}
      <span className="absolute left-0.5 top-0.5 text-[5.5px] font-mono uppercase tracking-[0.14em] text-foreground/45">
        ↑ impact
      </span>
      <span className="absolute bottom-0 right-0.5 text-[5.5px] font-mono uppercase tracking-[0.14em] text-foreground/45">
        effort →
      </span>

      {/* Quadrant labels */}
      <span className="absolute top-2 left-3 text-[5.5px] font-mono font-bold uppercase tracking-[0.12em] text-foreground/45">
        QUICK WINS
      </span>
      <span className="absolute top-2 right-3 text-[5.5px] font-mono font-bold uppercase tracking-[0.12em] text-foreground/45">
        BIG BETS
      </span>
      <span className="absolute bottom-3 left-3 text-[5.5px] font-mono font-bold uppercase tracking-[0.12em] text-foreground/45">
        FILL-INS
      </span>
      <span className="absolute bottom-3 right-3 text-[5.5px] font-mono font-bold uppercase tracking-[0.12em] text-foreground/45">
        RE-THINK
      </span>

      {/* Use-case dots positioned by effort (x) and impact (y, bottom-anchored) */}
      {cases.map((c, i) => {
        const tierColor =
          c.tier === "win"
            ? "#15803D"
            : c.tier === "bet"
            ? "#0F766E"
            : c.tier === "fill"
            ? "#B45309"
            : "#7C2D12";
        return (
          <motion.span
            key={c.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.18 + i * 0.06,
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full"
            style={{
              left: `${c.effort}%`,
              bottom: `${c.impact}%`,
              background: tierColor,
              boxShadow: `0 0 0 2px color-mix(in srgb, ${tierColor} 22%, transparent)`,
            }}
            title={c.name}
          />
        );
      })}
    </motion.div>
  );
}

/* — Tab 3 · Roadmap — 6-month Gantt-style lanes — */
function StrategyRoadmapTab() {
  const lanes = [
    { name: "Audit", start: 0, end: 1, color: "#0F766E" },
    { name: "Pilot agent", start: 1, end: 3, color: "#15803D" },
    { name: "Wire CRM", start: 2, end: 4, color: "#B45309" },
    { name: "Train team", start: 3, end: 5, color: "#0F766E" },
    { name: "Scale + govern", start: 4, end: 6, color: "#15803D" },
  ];
  const months = ["M1", "M2", "M3", "M4", "M5", "M6"];

  return (
    <motion.div
      key="roadmap"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-1"
    >
      {/* Month header */}
      <div className="flex items-center gap-1.5">
        <span className="w-[34%]" />
        <div className="flex-1 grid grid-cols-6">
          {months.map((m) => (
            <div
              key={m}
              className="text-[5.5px] font-mono uppercase tracking-[0.1em] text-foreground/45 text-center"
            >
              {m}
            </div>
          ))}
        </div>
      </div>
      {lanes.map((l, i) => (
        <div key={l.name} className="flex items-center gap-1.5">
          <span className="text-[6.5px] font-mono uppercase tracking-[0.1em] text-foreground/65 w-[34%] truncate">
            {l.name}
          </span>
          <div className="relative flex-1 h-2.5 rounded bg-bg-warm border border-foreground/5 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 rounded"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: `${((l.end - l.start) / 6) * 100}%`,
                opacity: 1,
              }}
              transition={{
                delay: 0.15 + i * 0.07,
                duration: 0.5,
                ease: "easeOut",
              }}
              style={{
                left: `${(l.start / 6) * 100}%`,
                background: `linear-gradient(90deg, ${l.color}, color-mix(in srgb, ${l.color} 60%, white))`,
              }}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Shared service-visual helpers ──────────────────────────────────────── */

/** Number that ticks up periodically — makes data cards feel alive. */
function LiveCounter({
  base,
  step = 1,
  interval = 2400,
}: {
  base: number;
  step?: number;
  interval?: number;
}) {
  const [value, setValue] = useState(base);
  useEffect(() => {
    const id = window.setInterval(() => {
      setValue((v) => v + step);
    }, interval);
    return () => window.clearInterval(id);
  }, [step, interval]);
  return <span className="tabular-nums">{value.toLocaleString()}</span>;
}

/** Trailing line+area sparkline drawn under each module stat. */
function CardSparkline({
  data,
  color,
  delay = 0,
}: {
  data: number[];
  color: string;
  delay?: number;
}) {
  const max = Math.max(...data) || 1;
  const path = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${30 - (v / max) * 28}`)
    .join(" L ");
  const areaPath = `M 0,${30 - (data[0] / max) * 28} L ${path} L 100,30 L 0,30 Z`;
  const linePath = `M 0,${30 - (data[0] / max) * 28} L ${path}`;
  const gid = `card-spark-${Math.round(Math.random() * 1e6)}`;
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className="mt-1 block w-full h-4"
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gid})`} />
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: "easeOut", delay }}
      />
    </svg>
  );
}

