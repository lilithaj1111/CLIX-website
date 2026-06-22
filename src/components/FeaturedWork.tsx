"use client";

import Link from "next/link";
import { CalendarHeart, Sparkles, Workflow } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { useIsMobile } from "@/lib/useIsMobile";
import { projects, type Project } from "@/lib/work";

/* ────────────────────────────────────────────────────────────────────────────
 * Selected work — bento grid. Five static case-study cards laid out as a
 * 6-col grid: row 1 → three 2-col cards, row 2 → two 3-col cards. Replaces
 * the older scroll-pinned reel; denser, no empty space at ultra-wide.
 * ──────────────────────────────────────────────────────────────────────── */

type Visual =
  | { kind: "stat"; value: string; label: string }
  | { kind: "icon"; Icon: ComponentType<SVGProps<SVGSVGElement>> }
  | { kind: "chart" }
  | { kind: "panel"; Icon: ComponentType<SVGProps<SVGSVGElement>>; metric: Project["metrics"][number] }
  | { kind: "list"; Icon: ComponentType<SVGProps<SVGSVGElement>>; items: { label: string; value: string }[] };

type Tile = {
  project: Project;
  span: "lg:col-span-2" | "lg:col-span-3";
  visual: Visual;
};

const tiles: Tile[] = [
  {
    project: projects[0], // Northwind — AI Agents · WhatsApp
    span: "lg:col-span-2",
    visual: { kind: "stat", value: "+312%", label: "לידים איכותיים נכנסים" },
  },
  {
    project: projects[1], // Aurelia — CRM · Automation
    span: "lg:col-span-2",
    visual: { kind: "icon", Icon: CalendarHeart },
  },
  {
    project: projects[2], // Loomly — Custom Software
    span: "lg:col-span-2",
    visual: { kind: "chart" },
  },
  {
    project: projects[3], // Kindred — AI Agents copilot
    span: "lg:col-span-3",
    visual: {
      kind: "panel",
      Icon: Sparkles,
      metric: projects[3].metrics[0],
    },
  },
  {
    project: projects[4], // Atlas — Integrations
    span: "lg:col-span-3",
    visual: {
      kind: "list",
      Icon: Workflow,
      items: projects[4].metrics.slice(0, 3),
    },
  },
];

export function FeaturedWork() {
  const isMobile = useIsMobile();

  return (
    <MotionConfig transition={isMobile ? { duration: 0 } : undefined}>
      <FeaturedWorkSection />
    </MotionConfig>
  );
}

function FeaturedWorkSection() {
  return (
    <section className="relative border-t border-line bg-background py-20 md:py-28 overflow-hidden">
      {/* Lime/mint radiant — matches the AI Agents service card atmosphere. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(40% 50% at 25% 30%, color-mix(in srgb, #845EF7 28%, transparent), transparent 70%)",
            "radial-gradient(38% 48% at 75% 60%, color-mix(in srgb, #A99BF5 24%, transparent), transparent 70%)",
            "radial-gradient(32% 42% at 50% 85%, color-mix(in srgb, #845EF7 20%, transparent), transparent 70%)",
          ].join(", "),
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <header className="grid md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="md:col-span-8">
            <div className="eyebrow">
              <span>03 · עבודות נבחרות</span>
            </div>
            <h2 className="mt-6 text-[clamp(2rem,5vw,4rem)] leading-[0.98] tracking-[-0.035em] font-medium">
              בנוי ל{" "}
              <span className="serif-italic text-accent">מערכות אמיתיות,</span>{" "}
              לא למצגות.
            </h2>
          </div>
          <p className="md:col-span-4 text-[15px] md:text-base text-foreground/75 leading-relaxed max-w-md">
            חמש מערכות שעלו לאוויר ב-18 החודשים האחרונים. הקליקו על כל
            כרטיס לצפייה במקרה הבוחן המלא.
          </p>
        </header>

        <div className="grid grid-cols-6 gap-4 md:gap-5">
          {tiles.map((tile, i) => (
            <Reveal
              as="article"
              key={tile.project.slug}
              delay={i * 0.06}
              className={`col-span-6 sm:col-span-3 ${tile.span} group`}
            >
              <Link
                href={`/work#${tile.project.slug}`}
                className="block h-full"
              >
                <Card>
                  <CardVisual visual={tile.visual} />
                  <CardMeta project={tile.project} />
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Card chrome ───────────────────────────────────────────────────────── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-full rounded-2xl border border-line bg-paper overflow-hidden transition-[border-color,box-shadow] duration-300 group-hover:border-accent/50 group-hover:shadow-[0_18px_48px_-20px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
    >
      <div className="relative flex flex-col h-full">{children}</div>
    </motion.div>
  );
}

function CardMeta({ project }: { project: Project }) {
  return (
    <div className="mt-auto p-6 md:p-7 border-t border-line/70">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55 flex items-center gap-2">
        <span>{project.category}</span>
        <span className="text-foreground/30" aria-hidden>
          ·
        </span>
        <span>{project.year}</span>
      </div>
      <div className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-accent">
        {project.client}
      </div>
      <h3 className="mt-3 text-lg md:text-xl leading-tight tracking-tight">
        {project.title}
      </h3>
    </div>
  );
}

/* ─── Visuals ───────────────────────────────────────────────────────────── */

function CardVisual({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "stat":
      return <StatVisual value={visual.value} label={visual.label} />;
    case "icon":
      return <IconVisual Icon={visual.Icon} />;
    case "chart":
      return <ChartVisual />;
    case "panel":
      return <PanelVisual Icon={visual.Icon} metric={visual.metric} />;
    case "list":
      return <ListVisual Icon={visual.Icon} items={visual.items} />;
  }
}

function StatVisual({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const parsed = parseStat(value);

  return (
    <div
      ref={ref}
      className="flex-1 grid place-items-center px-6 pt-10 pb-6 min-h-[200px]"
    >
      <div className="relative">
        <svg
          aria-hidden
          className="absolute -inset-x-6 top-1/2 -translate-y-1/2 w-[calc(100%+3rem)] h-24 text-line"
          viewBox="0 0 254 104"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7292Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          />
        </svg>
        <div className="relative text-center">
          <div className="text-[clamp(2.6rem,5.4vw,4rem)] font-semibold tracking-[-0.04em] tabular-nums text-foreground">
            {parsed ? (
              <Counter
                from={0}
                to={parsed.value}
                inView={inView}
                prefix={parsed.prefix}
                suffix={parsed.suffix}
                decimals={parsed.decimals}
                duration={1.4}
              />
            ) : (
              value
            )}
          </div>
          <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground/55">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Pulls a numeric value out of strings like "+312%", "-96%", "2.1×", "210".
 *  Returns null for transition patterns like "11d → 3d" or "6 → 1" — those
 *  read better as static values than as a count-up. */
function parseStat(
  raw: string,
): { prefix: string; value: number; suffix: string; decimals: number } | null {
  if (raw.includes("→")) return null;
  const match = raw.match(/^([+\-−]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return {
    prefix,
    value: parseFloat(num),
    suffix,
    decimals,
  };
}

function Counter({
  from,
  to,
  inView,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.2,
}: {
  from: number;
  to: number;
  inView: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const isMobile = useIsMobile();
  const mv = useMotionValue(isMobile ? to : from);
  const formatted = useTransform(mv, (latest) =>
    `${prefix}${latest.toFixed(decimals)}${suffix}`,
  );
  const [display, setDisplay] = useState(
    `${prefix}${(isMobile ? to : from).toFixed(decimals)}${suffix}`,
  );

  useEffect(() => {
    const unsub = formatted.on("change", setDisplay);
    return () => unsub();
  }, [formatted]);

  useEffect(() => {
    if (!inView || isMobile) {
      if (isMobile) mv.set(to);
      return;
    }
    const controls = animate(mv, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, isMobile, mv, to, duration]);

  return <span>{display}</span>;
}

function IconVisual({
  Icon,
}: {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const isMobile = useIsMobile();

  return (
    <div
      ref={ref}
      className="flex-1 grid place-items-center px-6 pt-10 pb-6 min-h-[200px]"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative grid place-items-center w-28 h-28 rounded-full border border-line"
      >
        <motion.span
          aria-hidden
          className="absolute -inset-2 rounded-full border border-line/60"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
        />
        <motion.span
          aria-hidden
          className="absolute -inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent), transparent 65%)",
            filter: "blur(10px)",
          }}
          animate={
            isMobile
              ? { opacity: 0.8 }
              : inView
                ? { opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }
                : { opacity: 0 }
          }
          transition={
            isMobile
              ? { duration: 0 }
              : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <motion.span
          initial={{ rotate: -8, opacity: 0 }}
          animate={inView ? { rotate: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <Icon className="w-9 h-9 text-foreground" strokeWidth={1.25} />
        </motion.span>
      </motion.div>
    </div>
  );
}

function ChartVisual() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="flex-1 px-6 pt-10 pb-4 min-h-[200px]">
      <svg
        aria-hidden
        className="w-full h-32 text-line"
        viewBox="0 0 386 123"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fw-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M3 123C3 123 14 95 35 89C56 83 66 81 66 81C66 81 80 81 92 81C103 81 100 64 109 64C117 64 117 92 124 92C132 92 142 78 153 81C165 83 186 92 193 92C200 92 206 64 214 64C221 64 238 94 244 92C249 90 258 60 266 60C272 60 284 88 286 88C294 88 300 73 305 73C312 73 323 65 335 64C347 62 348 82 363 81C367 80 372 82 376 87C379 91 381 97 382 105C383 109 382 123 382 123"
          fill="url(#fw-chart-fill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
        />
        <motion.path
          d="M3 121C3 121 15 94 36 88C56 82 66 81 66 81C66 81 80 81 92 81C102 81 100 64 108 64C116 64 117 92 125 92C132 92 142 78 153 81C165 83 186 92 193 92C199 92 205 64 213 64C220 64 237 94 243 92C248 90 257 60 265 60C271 60 283 87 285 88C293 88 299 73 304 73C311 73 321 66 333 64C345 62 346 82 362 81C377 79 383 106 383 106"
          stroke="var(--accent)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
        <span>כלים שאוחדו</span>
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="tabular-nums text-foreground"
        >
          6 → 1
        </motion.span>
      </div>
    </div>
  );
}

function PanelVisual({
  Icon,
  metric,
}: {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  metric: Project["metrics"][number];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const parsed = parseStat(metric.value);

  return (
    <div
      ref={ref}
      className="grid sm:grid-cols-2 gap-6 md:gap-8 p-6 md:p-7 pb-0 min-h-[220px]"
    >
      <div className="flex flex-col justify-between gap-8">
        <div className="relative grid place-items-center w-12 h-12 rounded-full border border-line">
          <span
            aria-hidden
            className="absolute -inset-2 rounded-full border border-line/60"
          />
          <Icon className="w-5 h-5 text-foreground" strokeWidth={1.25} />
        </div>
        <p className="text-sm text-foreground/75 leading-relaxed">
          Copilot פרטי שאומן על חמש שנות פניות, מסמכים פנימיים והנחיות
          קליניות של הצוות.
        </p>
      </div>
      <div className="relative rounded-tl-xl border-l border-t border-line p-5 -mb-px -mr-px sm:ml-auto sm:w-full">
        <div className="absolute left-3 top-2 flex gap-1">
          <span className="block w-1.5 h-1.5 rounded-full bg-line-strong" />
          <span className="block w-1.5 h-1.5 rounded-full bg-line-strong" />
          <span className="block w-1.5 h-1.5 rounded-full bg-line-strong" />
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/55">
              {metric.label}
            </span>
            <span className="font-sans text-2xl tabular-nums tracking-[-0.02em] text-foreground">
              {parsed ? (
                <Counter
                  from={0}
                  to={parsed.value}
                  inView={inView}
                  prefix={parsed.prefix}
                  suffix={parsed.suffix}
                  decimals={parsed.decimals}
                  duration={1.2}
                />
              ) : (
                metric.value
              )}
            </span>
          </div>
          <div className="space-y-1.5">
            <Bar pct={45} delay={0.1} inView={inView} />
            <Bar pct={72} delay={0.25} inView={inView} />
            <Bar pct={88} delay={0.4} inView={inView} />
            <Bar pct={94} delay={0.55} inView={inView} accent />
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({
  pct,
  delay = 0,
  inView,
  accent = false,
}: {
  pct: number;
  delay?: number;
  inView: boolean;
  accent?: boolean;
}) {
  return (
    <div className="h-1.5 w-full rounded-full bg-line/70 overflow-hidden">
      <motion.div
        className={`h-full rounded-full origin-left ${accent ? "bg-accent" : "bg-foreground/30"}`}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{
          duration: 0.9,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ListVisual({
  Icon,
  items,
}: {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  items: { label: string; value: string }[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      className="grid sm:grid-cols-2 gap-6 md:gap-8 p-6 md:p-7 pb-0 min-h-[220px]"
    >
      <div className="flex flex-col justify-between gap-8">
        <div className="relative grid place-items-center w-12 h-12 rounded-full border border-line">
          <span
            aria-hidden
            className="absolute -inset-2 rounded-full border border-line/60"
          />
          <Icon className="w-5 h-5 text-foreground" strokeWidth={1.25} />
        </div>
        <p className="text-sm text-foreground/75 leading-relaxed">
          שנה של התאמות ידניות בין הנהלת חשבונות, CRM ומערכות דיווח
          הוחלפה ב-n8n וב-middleware מותאם אישית.
        </p>
      </div>
      <ul className="relative sm:border-l sm:border-line sm:pl-6 sm:-my-1 flex flex-col gap-3 justify-center">
        {items.map((item, i) => {
          const parsed = parseStat(item.value);
          return (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: 12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-baseline justify-between gap-3 py-2 border-b border-line/60 last:border-b-0"
            >
              <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/55 max-w-[55%]">
                {item.label}
              </span>
              <span className="font-sans text-lg tabular-nums tracking-[-0.02em] text-foreground">
                {parsed ? (
                  <Counter
                    from={0}
                    to={parsed.value}
                    inView={inView}
                    prefix={parsed.prefix}
                    suffix={parsed.suffix}
                    decimals={parsed.decimals}
                    duration={1.1}
                  />
                ) : (
                  item.value
                )}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

