"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Activity,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Layers,
  Mail,
  MessageCircle,
  Mic,
  Phone,
  Search,
  Settings,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { MagneticButton } from "./MagneticButton";

/* ────────────────────────────────────────────────────────────────────────────
 * ProductsSection — web + mobile development feature spotlight.
 *
 *   Layout:
 *     Left   : detailed CSS-rendered laptop + phone mockups (Operations
 *              dashboard on the laptop, Pulse app on the phone), tilted in
 *              real CSS 3D perspective for depth — crisp text, native font
 *              rendering, no expensive Three.js texturing.
 *     Right  : value proposition text.
 *
 *   Devices use `perspective` + `rotate3d` on a parent container so the
 *   bezels recede into the page and the screens read at a believable
 *   isometric angle. Each device has its own subtle continuous float +
 *   hover-lift micro-interaction.
 * ──────────────────────────────────────────────────────────────────────── */

export function ProductsSection() {
  return (
    <section className="relative border-t border-line py-20 md:py-28 overflow-hidden">
      {/* Lime/mint radiant — distributed across both sides so the green
          undertone reads on the right (text) column as well as the left
          (device mockups). */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: [
            "radial-gradient(40% 50% at 20% 30%, color-mix(in srgb, #A3E635 30%, transparent), transparent 70%)",
            "radial-gradient(40% 50% at 80% 30%, color-mix(in srgb, #A3E635 28%, transparent), transparent 70%)",
            "radial-gradient(38% 48% at 50% 65%, color-mix(in srgb, #5EEAD4 26%, transparent), transparent 70%)",
            "radial-gradient(34% 44% at 88% 75%, color-mix(in srgb, #5EEAD4 26%, transparent), transparent 70%)",
            "radial-gradient(32% 42% at 30% 88%, color-mix(in srgb, #FDE68A 22%, transparent), transparent 70%)",
          ].join(", "),
        }}
      />

      {/* Subtle blueprint grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--accent) 28%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.11,
          maskImage:
            "radial-gradient(ellipse 95% 90% at 50% 50%, #000 30%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 90% at 50% 50%, #000 30%, transparent 95%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ── Left column — CSS device cluster ─────────────────────── */}
          <div className="md:col-span-7 order-2 md:order-1">
            <DeviceCluster />
          </div>

          {/* ── Right column — value proposition ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5 order-1 md:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-paper/80 backdrop-blur-sm">
              <Layers className="w-3 h-3 text-accent" />
              <span className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-foreground/70">
                ווב + מובייל · עיצוב והנדסה
              </span>
            </div>

            <h2 className="mt-7 text-[clamp(2rem,4vw,3.6rem)] leading-[1] tracking-[-0.03em] font-medium">
              אפליקציות ו{" "}
              <span className="serif-italic">אתרים,</span>{" "}
              <span className="serif-italic">מהונדסים</span>{" "}
              <span className="serif-italic">כמערכות.</span>
            </h2>

            <p className="mt-6 max-w-[480px] text-foreground/70 leading-[1.7] text-[15px]">
              ממערכות ניהול CRM ועד פורטלי לקוחות, מאפליקציות מובייל
              נייטיב ועד אתרים ייעודיים אנחנו מספקים מוצרי Full-stack
              שמשתלבים בכל מערכי התפעול שלכם. ללא תבניות גנריות, ללא קוד
              נטוש שאי-אפשר לתחזק.
            </p>

            <ul className="mt-6 space-y-2.5 text-foreground/75">
              <FeatureBullet>
                iOS ו-Android נייטיב, או React Native כשהקצב הוא העיקר.
              </FeatureBullet>
              <FeatureBullet>
                אתרים ייעודיים עיצוב, תוכן, ביצועים, והכל בבעלותכם המלאה.
              </FeatureBullet>
              <FeatureBullet>
                משתלבים באותם סוכנים, אוטומציות ומערכות CRM שאנחנו בונים.
              </FeatureBullet>
            </ul>

            <div className="mt-9 flex items-center gap-5">
              <MagneticButton
                href="/contact"
                className="btn-shine btn-violet inline-flex items-center gap-2 text-sm ps-6 pe-2 py-2.5 rounded-full font-medium"
              >
                בואו נתחיל
                <span className="inline-flex w-7 h-7 rounded-full bg-ink/40 text-paper items-center justify-center backdrop-blur-sm">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </MagneticButton>
              <Link
                href="/work"
                className="text-sm text-foreground/65 hover:text-accent underline underline-offset-4 decoration-foreground/25 hover:decoration-accent transition-colors"
              >
                לכל העבודות שלנו
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[14px]">
      <CheckCircle2 className="w-3.5 h-3.5 mt-1 shrink-0 text-accent" />
      <span>{children}</span>
    </li>
  );
}

/* ─── Device cluster — laptop + phone in CSS 3D perspective ─────────────── */

function DeviceCluster() {
  return (
    <div
      className="relative w-full min-h-[320px] sm:min-h-[420px] md:min-h-[600px] flex items-center justify-center"
      style={{ perspective: "2400px", perspectiveOrigin: "50% 50%" }}
    >
      <div
        className="relative w-full max-w-[680px] mx-auto h-[460px] md:h-[560px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Soft ground shadow under the devices — only on desktop where
            both devices are visible; on mobile the phone is centered
            and gets its own subtler shadow via the device mockup. */}
        <div
          aria-hidden
          className="hidden md:block absolute left-[16%] right-[10%] bottom-[6%] h-14 rounded-[50%]"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in srgb, var(--ink) 22%, transparent), transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Laptop — desktop only. Its 380–440px width overflows phones,
            so on mobile we show just the phone instead. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:block absolute md:left-[4%] md:bottom-[10%]"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(8deg) rotateY(20deg) rotateZ(-2deg)",
          }}
        >
          <LaptopMockup />
        </motion.div>

        {/* Phone — centered on mobile (the only device shown there),
            offset to the upper-right on desktop where it shares the
            stage with the laptop. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:left-auto md:translate-x-0 md:translate-y-0 md:right-[6%] md:top-[4%]"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(6deg) rotateY(-12deg) rotateZ(2deg)",
          }}
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Laptop mockup — clix.studio/dashboard ─────────────────────────────── */

function LaptopMockup() {
  return (
    <div
      className="relative"
      style={{
        transformStyle: "preserve-3d",
        filter:
          "drop-shadow(0 50px 70px rgba(30,26,42,0.22)) drop-shadow(0 18px 32px rgba(30,26,42,0.12))",
      }}
    >
      {/* Screen body */}
      <div
        className="relative w-[380px] md:w-[440px] rounded-t-xl p-1.5"
        style={{
          background:
            "linear-gradient(180deg, var(--ink-warm) 0%, color-mix(in srgb, var(--ink-warm) 80%, black) 100%)",
        }}
      >
        <div
          className="relative w-full aspect-[16/10] rounded-md overflow-hidden"
          style={{ background: "var(--paper)" }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line bg-bg-warm">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/25" />
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/25" />
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/25" />
            <span className="ml-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8.5px] font-mono uppercase tracking-[0.14em] text-foreground/55 bg-paper border border-line">
              <span className="w-1 h-1 rounded-full bg-accent" />
              clix.studio/dashboard
            </span>
          </div>

          {/* Dashboard content */}
          <div className="grid grid-cols-[100px_1fr] h-[calc(100%-30px)]">
            <div className="border-r border-line/70 bg-bg-warm/60 px-2.5 py-3 space-y-2">
              <div className="text-[7.5px] font-mono uppercase tracking-[0.14em] text-foreground/55 mb-1.5">
                סביבת עבודה
              </div>
              <SidebarItem label="סקירה כללית" active />
              <SidebarItem label="סוכנים" />
              <SidebarItem label="פייפליין" />
              <SidebarItem label="תיבת דואר" />
              <SidebarItem label="תובנות" />
            </div>

            <div className="px-3.5 py-3">
              <div className="flex items-center gap-2">
                <div className="text-[10.5px] font-medium text-foreground">
                  תפעול
                </div>
                <span className="text-[7.5px] font-mono uppercase tracking-[0.14em] text-foreground/50 inline-flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                  בזמן אמת
                </span>
                <Search className="ml-auto w-2.5 h-2.5 text-foreground/40" />
              </div>

              <div className="mt-2 grid grid-cols-3 gap-1.5">
                <KPI label="נסגרו" value="1.2k" />
                <KPI label="p50" value="842ms" />
                <KPI label="זמינות" value="99.9" />
              </div>

              <div className="mt-2.5 rounded-md border border-line bg-bg-warm/40 p-2">
                <div className="flex items-center justify-between text-[7px] font-mono uppercase tracking-[0.14em] text-foreground/50 mb-1">
                  <span>פייפליין לידים · 7 ימים</span>
                  <span className="text-accent">+18%</span>
                </div>
                <MiniChart />
              </div>

              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <ActivityRow label="סוכן LeadGen" />
                <ActivityRow label="סינון תיבת דואר" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Laptop base wedge */}
      <div
        className="relative mx-auto h-2.5 -mt-px"
        style={{
          width: "108%",
          marginLeft: "-4%",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--ink-warm) 85%, black) 0%, color-mix(in srgb, var(--ink-warm) 65%, black) 100%)",
          clipPath: "polygon(2% 0, 98% 0, 100% 100%, 0 100%)",
          borderBottomLeftRadius: "14px",
          borderBottomRightRadius: "14px",
        }}
      />
      <div
        className="mx-auto -mt-1 w-20 h-1 rounded-b-full"
        style={{
          background: "color-mix(in srgb, var(--ink-warm) 60%, black)",
        }}
      />
    </div>
  );
}

function SidebarItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[8.5px] font-medium ${
        active
          ? "bg-accent-soft text-accent"
          : "text-foreground/55 hover:text-foreground"
      }`}
    >
      <span
        className={`w-1 h-1 rounded-full ${
          active ? "bg-accent" : "bg-foreground/25"
        }`}
      />
      {label}
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper px-2 py-1.5">
      <div className="text-[6.5px] font-mono uppercase tracking-[0.14em] text-foreground/50">
        {label}
      </div>
      <div className="mt-0.5 text-[11px] font-medium text-foreground tabular-nums tracking-tight">
        {value}
      </div>
    </div>
  );
}

function MiniChart() {
  return (
    <svg
      width="100%"
      height="36"
      viewBox="0 0 200 36"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="laptop-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,28 L20,24 L40,26 L60,18 L80,22 L100,14 L120,16 L140,9 L160,12 L180,6 L200,8"
        stroke="var(--accent)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0,28 L20,24 L40,26 L60,18 L80,22 L100,14 L120,16 L140,9 L160,12 L180,6 L200,8 L200,36 L0,36 Z"
        fill="url(#laptop-fill)"
      />
    </svg>
  );
}

function ActivityRow({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-line bg-paper px-2 py-1.5 flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-accent" />
      <span className="text-[8.5px] text-foreground/80 truncate">{label}</span>
      <span className="ml-auto text-[6.5px] font-mono uppercase tracking-[0.14em] text-foreground/45">
        ok
      </span>
    </div>
  );
}

/* ─── Phone mockup — Clix Pulse (4 tabs, switchable) ───────────────────── */

type PhoneTabKey = "activity" | "layers" | "bell" | "settings";

function PhoneMockup() {
  const [tab, setTab] = useState<PhoneTabKey>("activity");

  return (
    <div
      className="relative"
      style={{
        transformStyle: "preserve-3d",
        filter:
          "drop-shadow(0 50px 70px rgba(30,26,42,0.24)) drop-shadow(0 18px 32px rgba(30,26,42,0.14))",
      }}
    >
      {/* Phone body */}
      <div
        className="relative w-[230px] md:w-[260px] rounded-[40px] p-2"
        style={{
          background:
            "linear-gradient(155deg, color-mix(in srgb, var(--ink-warm) 85%, black) 0%, var(--ink-warm) 50%, color-mix(in srgb, var(--ink-warm) 92%, black) 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-x-3 top-px h-px rounded-full"
          style={{
            background:
              "color-mix(in srgb, var(--fg-on-dark) 18%, transparent)",
          }}
        />

        <div
          className="relative w-full aspect-[9/19] rounded-[32px] overflow-hidden"
          style={{ background: "var(--paper)" }}
        >
          {/* Notch */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full z-10"
            style={{ background: "var(--ink-warm)" }}
          />

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-2.5 pb-1.5 text-[8px] font-medium text-foreground/75 font-mono">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1 rounded-sm bg-foreground/60" />
              <span className="w-3 h-1.5 rounded-sm border border-foreground/50" />
            </span>
          </div>

          {/* Screen content — swaps per tab */}
          <div className="absolute inset-x-0 top-[26px] bottom-[54px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                {tab === "activity" && <ActivityScreen />}
                {tab === "layers" && <LayersScreen />}
                {tab === "bell" && <BellScreen />}
                {tab === "settings" && <SettingsScreen />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tab bar */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 pt-2 pb-3 border-t border-line/70 flex items-center justify-around"
            style={{ background: "var(--paper)" }}
          >
            <PhoneTab
              icon={<Activity className="w-3.5 h-3.5" />}
              active={tab === "activity"}
              onClick={() => setTab("activity")}
              label="פעילות"
            />
            <PhoneTab
              icon={<Layers className="w-3.5 h-3.5" />}
              active={tab === "layers"}
              onClick={() => setTab("layers")}
              label="תהליכים"
            />
            <PhoneTab
              icon={<Bell className="w-3.5 h-3.5" />}
              active={tab === "bell"}
              onClick={() => setTab("bell")}
              label="התראות"
            />
            <PhoneTab
              icon={<Settings className="w-3.5 h-3.5" />}
              active={tab === "settings"}
              onClick={() => setTab("settings")}
              label="הגדרות"
            />
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-full bg-foreground/30" />
        </div>
      </div>
    </div>
  );
}

/* ─── Per-tab screens ─────────────────────────────────────────────────── */

function ActivityScreen() {
  return (
    <div className="h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4">
        <div className="text-[7.5px] font-mono uppercase tracking-[0.14em] text-foreground/55">
          Clix · פעימה
        </div>
        <div className="mt-1 text-[14px] font-medium text-foreground leading-tight">
          בוקר טוב,
          <br />
          <span className="serif-italic text-accent">מאיה.</span>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2.5">
        <div className="rounded-xl bg-bg-warm border border-line/70 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono uppercase tracking-[0.14em] text-foreground/55">
              תפעול
            </span>
            <span className="inline-flex items-center gap-1 text-[8px] font-mono uppercase tracking-[0.14em] text-accent">
              <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
              בזמן אמת
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-3">
            <div>
              <div className="text-[16px] font-medium text-foreground tabular-nums leading-none">
                1,284
              </div>
              <div className="text-[7px] font-mono uppercase tracking-[0.14em] text-foreground/45 mt-0.5">
                נסגרו היום
              </div>
            </div>
            <div className="ml-auto text-[10px] text-accent font-medium">+18%</div>
          </div>
        </div>

        <div className="rounded-xl bg-paper border border-line/70 px-3 py-2.5">
          <div className="flex items-center justify-between text-[7.5px] font-mono uppercase tracking-[0.14em] text-foreground/55">
            <span>אחוז סגירה · 7 ימים</span>
            <span className="text-accent font-medium normal-case tracking-normal">
              ↗ +24%
            </span>
          </div>
          <PhoneSparkline />
          <div className="mt-1 flex items-center justify-between text-[6.5px] font-mono uppercase tracking-[0.14em] text-foreground/40">
            <span>ב׳</span>
            <span>ג׳</span>
            <span>ד׳</span>
            <span>ה׳</span>
            <span>ו׳</span>
            <span>ש׳</span>
            <span>א׳</span>
          </div>
        </div>

        <div className="rounded-xl bg-paper border border-line/70 p-3 space-y-2">
          <div className="flex items-center justify-between text-[7.5px] font-mono uppercase tracking-[0.14em] text-foreground/55">
            <span>פעילות אחרונה</span>
            <Bell className="w-2.5 h-2.5" />
          </div>
          <PhoneActivityRow title="סוכן LeadGen" detail="סגר 18 לידים" />
          <PhoneActivityRow title="סינון תיבת דואר" detail="טיפל ב-412 הודעות" />
          <PhoneActivityRow title="סוכן קולי" detail="קבע 24 שיחות" />
        </div>
      </div>
    </div>
  );
}

function LayersScreen() {
  const workflows = [
    { Icon: MessageCircle, name: "סוכן LeadGen",   state: "פעיל · 18/יום",  bars: [3, 5, 4, 6, 7, 8, 9],   tint: "var(--accent)" },
    { Icon: Mail,          name: "סינון תיבת דואר", state: "פעיל · 412/יום", bars: [4, 6, 5, 7, 6, 9, 10],  tint: "#5EEAD4" },
    { Icon: Phone,         name: "סוכן קולי",       state: "פעיל · 24/יום",  bars: [2, 3, 4, 3, 5, 6, 7],   tint: "#A3E635" },
    { Icon: Calendar,      name: "בוט יומן",        state: "במצב המתנה",     bars: [1, 1, 1, 2, 1, 0, 1],   tint: "#FDE68A" },
  ];
  return (
    <div className="h-full overflow-hidden px-4 pt-4 space-y-3">
      <div>
        <div className="text-[7.5px] font-mono uppercase tracking-[0.14em] text-foreground/55">
          תהליכים
        </div>
        <div className="mt-1 text-[14px] font-medium text-foreground leading-tight">
          <span className="serif-italic text-accent">4 פעילות</span> אוטומציות.
        </div>
      </div>
      <div className="rounded-xl bg-bg-warm border border-line/70 px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[7.5px] font-mono uppercase tracking-[0.14em] text-foreground/55">
            זמינות · 30 ימים
          </span>
          <span className="text-[10px] font-semibold text-foreground tabular-nums">99.94%</span>
        </div>
        <div className="mt-1.5 flex items-center gap-[2px]">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="flex-1 h-3 rounded-sm"
              style={{
                background:
                  i === 12 ? "#EF4444" : i === 22 ? "#F59E0B" : "var(--accent)",
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-paper border border-line/70 p-3 space-y-2.5">
        {workflows.map((w) => (
          <div key={w.name} className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-md inline-flex items-center justify-center text-paper shrink-0"
              style={{ background: w.tint }}
            >
              <w.Icon className="w-3 h-3" strokeWidth={2.2} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-semibold text-foreground truncate leading-none">
                {w.name}
              </div>
              <div className="text-[7px] font-mono text-foreground/55 mt-0.5 truncate">
                {w.state}
              </div>
            </div>
            <div className="flex items-end gap-[1px] h-4 shrink-0">
              {w.bars.map((b, i) => (
                <span
                  key={i}
                  className="block w-1 rounded-sm"
                  style={{
                    height: `${(b / 10) * 100}%`,
                    background: w.tint,
                    opacity: 0.65,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BellScreen() {
  const items: Array<{
    Icon: typeof Bell;
    title: string;
    body: string;
    when: string;
    tone: "alert" | "info" | "success";
  }> = [
    { Icon: Sparkles, title: "הסוכן הקולי קבע 3 שיחות", body: "Acme · Vex · Orbit",        when: "2 דק׳",  tone: "success" },
    { Icon: Mail,     title: "סינון תיבת הדואר הושלם",  body: "412 הודעות עובדו",           when: "18 דק׳", tone: "info"    },
    { Icon: Zap,      title: "תהליך הושהה",              body: "סנכרון Stripe · API timeout", when: "1 שעה",  tone: "alert"   },
    { Icon: CheckCircle2, title: "עסקת Atlas התקדמה",   body: "מוכשרת → הצעה",              when: "3 שעות", tone: "info"    },
  ];
  return (
    <div className="h-full overflow-hidden px-4 pt-4 space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[7.5px] font-mono uppercase tracking-[0.14em] text-foreground/55">
            התראות
          </div>
          <div className="mt-1 text-[14px] font-medium text-foreground leading-tight">
            <span className="serif-italic text-accent">3 שלא נקראו.</span>
          </div>
        </div>
        <button
          type="button"
          className="text-[8px] font-mono uppercase tracking-[0.14em] text-foreground/55 hover:text-accent"
        >
          סימון הכל
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((it, i) => {
          const colour =
            it.tone === "alert" ? "#DC2626" : it.tone === "success" ? "#16A34A" : "var(--accent)";
          const isUnread = i < 3;
          return (
            <div
              key={it.title}
              className="rounded-xl border px-3 py-2 flex items-start gap-2"
              style={{
                background: isUnread ? "var(--paper)" : "var(--bg-warm)",
                borderColor: isUnread ? `color-mix(in srgb, ${colour} 28%, var(--line))` : "var(--line)",
              }}
            >
              <span
                className="w-6 h-6 rounded-md inline-flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in srgb, ${colour} 14%, white)`, color: colour }}
              >
                <it.Icon className="w-3 h-3" strokeWidth={2.2} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="text-[9px] font-semibold text-foreground leading-tight truncate">
                    {it.title}
                  </div>
                  {isUnread && (
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: colour }} />
                  )}
                </div>
                <div className="text-[7.5px] text-foreground/55 truncate mt-0.5">{it.body}</div>
              </div>
              <span className="text-[7px] font-mono text-foreground/45 shrink-0 mt-0.5">{it.when}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="h-full overflow-hidden px-4 pt-4 space-y-3">
      <div>
        <div className="text-[7.5px] font-mono uppercase tracking-[0.14em] text-foreground/55">
          הגדרות
        </div>
        <div className="mt-1 text-[14px] font-medium text-foreground leading-tight">
          <span className="serif-italic text-accent">מאיה צ׳ן.</span>
        </div>
      </div>

      {/* Profile card */}
      <div className="rounded-xl bg-bg-warm border border-line/70 px-3 py-2.5 flex items-center gap-2.5">
        <span
          className="w-9 h-9 rounded-full grid place-items-center text-[11px] font-bold text-paper shrink-0"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), var(--accent-deep))",
          }}
        >
          MC
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[9.5px] font-semibold text-foreground truncate leading-tight">
            מאיה צ׳ן
          </div>
          <div className="text-[7.5px] text-foreground/55 truncate">
            סמנכ״לית תפעול · Acme Co.
          </div>
        </div>
        <ChevronRight className="w-3 h-3 text-foreground/40" strokeWidth={2.2} />
      </div>

      {/* Toggle list */}
      <div className="rounded-xl bg-paper border border-line/70 divide-y divide-line/60 overflow-hidden">
        <SettingsToggle Icon={Sparkles} label="סוכני AI"           on />
        <SettingsToggle Icon={Mail}     label="סיכומי אימייל"      on />
        <SettingsToggle Icon={Phone}    label="התראות WhatsApp"    on={false} />
        <SettingsToggle Icon={Shield}   label="אימות דו-שלבי"      on />
      </div>

      {/* Sign-out row */}
      <div className="rounded-xl bg-paper border border-line/70 px-3 py-2 flex items-center gap-2">
        <span className="w-5 h-5 rounded-md grid place-items-center bg-bg-warm">
          <Zap className="w-2.5 h-2.5 text-foreground/55" strokeWidth={2} />
        </span>
        <span className="text-[9px] font-semibold text-foreground flex-1">מסלול · Pro</span>
        <span className="text-[7.5px] font-mono uppercase tracking-[0.12em] text-accent">
          ניהול
        </span>
      </div>
    </div>
  );
}

function SettingsToggle({
  Icon,
  label,
  on,
}: {
  Icon: typeof Bell;
  label: string;
  on: boolean;
}) {
  return (
    <div className="px-3 py-2 flex items-center gap-2">
      <span className="w-5 h-5 rounded-md grid place-items-center bg-bg-warm text-foreground/65 shrink-0">
        <Icon className="w-2.5 h-2.5" strokeWidth={2} />
      </span>
      <span className="text-[9px] font-semibold text-foreground flex-1 truncate">
        {label}
      </span>
      <span
        className="relative inline-block w-6 h-3.5 rounded-full transition-colors"
        style={{ background: on ? "var(--accent)" : "var(--line-strong)" }}
      >
        <motion.span
          className="absolute top-[2px] w-2.5 h-2.5 rounded-full bg-paper shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
          animate={{ left: on ? 12 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </span>
    </div>
  );
}

function PhoneSparkline() {
  // 7-day resolution-rate trajectory — ends with a sharp upward leg so
  // the "↗ +24%" label has visual evidence.
  const data = [38, 34, 46, 42, 55, 64, 78];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 26;
  const padY = 3;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = padY + (1 - (v - min) / range) * (h - padY * 2);
    return { x, y };
  });
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="mt-2 w-full h-10"
      aria-hidden
    >
      <defs>
        <linearGradient id="phone-sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#phone-sparkline-fill)" />
      <path
        d={linePath}
        stroke="var(--accent)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={last.x}
        cy={last.y}
        r="2"
        fill="var(--accent)"
        stroke="var(--paper)"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function PhoneActivityRow({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-5 h-5 rounded-md bg-accent-soft inline-flex items-center justify-center shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[8.5px] font-medium text-foreground truncate">
          {title}
        </div>
        <div className="text-[7.5px] text-foreground/55 truncate">{detail}</div>
      </div>
    </div>
  );
}

function PhoneTab({
  icon,
  active,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex w-7 h-7 rounded-lg items-center justify-center transition-colors duration-200 cursor-pointer ${
        active
          ? "bg-accent-soft text-accent"
          : "text-foreground/40 hover:text-accent hover:bg-accent-soft/50"
      }`}
    >
      {icon}
    </button>
  );
}
