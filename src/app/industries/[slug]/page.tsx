import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, getIndustry } from "@/lib/industries";
import { services } from "@/lib/services";
import { IndustrySystem } from "@/components/industries/IndustrySystem";
import { IndustryIcon } from "@/components/industries/IndustryIcon";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Building2,
  Landmark,
  HeartPulse,
  ShoppingBag,
  Truck,
  GraduationCap,
  Bot,
  MessageCircle,
  Users,
  Workflow,
  Globe,
  Smartphone,
  Code2,
  Compass,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Landmark,
  HeartPulse,
  ShoppingBag,
  Truck,
  GraduationCap,
};

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "ai-agents": Bot,
  whatsapp: MessageCircle,
  crm: Users,
  integrations: Workflow,
  websites: Globe,
  mobile: Smartphone,
  software: Code2,
  consulting: Compass,
};

/** Per-sector hero wash from the sector's two theme colours. */
const heroWash = (a: string, b: string) =>
  [
    `radial-gradient(46% 58% at 10% 18%, color-mix(in srgb, ${a} 28%, transparent), transparent 70%)`,
    `radial-gradient(40% 50% at 30% 8%, color-mix(in srgb, ${a} 16%, transparent), transparent 72%)`,
    `radial-gradient(46% 56% at 90% 24%, color-mix(in srgb, ${b} 28%, transparent), transparent 70%)`,
    `radial-gradient(52% 60% at 74% 94%, color-mix(in srgb, ${a} 20%, transparent), transparent 72%)`,
    `radial-gradient(42% 52% at 20% 98%, color-mix(in srgb, ${b} 22%, transparent), transparent 72%)`,
  ].join(", ");

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return { title: "תעשיות — Clix" };
  return { title: `${ind.name} — Clix`, description: `${ind.verb}. ${ind.pain}` };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();

  const Icon = ICONS[ind.icon];
  const [c1, c2] = ind.theme;
  const grad = `linear-gradient(135deg, ${c1}, ${c2})`;
  // The outcome card stays the brand's signature blue→lime on every sector.
  const blueLime = "linear-gradient(135deg, #845EF7, #A99BF5)";
  const related = ind.relatedServices
    .map((s) => services.find((x) => x.slug === s))
    .filter((x): x is (typeof services)[number] => Boolean(x));
  const others = industries.filter((i) => i.slug !== ind.slug).slice(0, 4);

  return (
    <>
      {/* ── Hero — layered blue + lime wash, two columns ──────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none" style={{ background: heroWash(c1, c2) }} />
        <div aria-hidden className="absolute inset-0 z-[1] hidden opacity-[0.04] mix-blend-multiply md:block" style={{ backgroundImage: GRAIN }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-[1] h-28 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }} />

        <div className="relative z-[2] mx-auto max-w-[1240px] px-6 lg:px-10">
          <Link
            href="/industries"
            className="inline-flex items-center gap-1.5 font-mono text-[12.5px] uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:text-accent"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
            כל התעשיות
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4">
                <IndustryIcon Icon={Icon} size="lg" />
                <span className="eyebrow">תעשייה</span>
              </div>

              <h1 className="mt-6 text-[clamp(2.3rem,5.2vw,4.2rem)] font-medium leading-[1.0] tracking-[-0.035em] text-ink">
                {ind.name}
              </h1>
              <p
                className="mt-3 serif-italic text-[clamp(1.5rem,3vw,2.3rem)] leading-tight"
                style={{ color: c1 }}
              >
                {ind.verb}.
              </p>
              <p className="mt-6 max-w-[560px] text-[16px] leading-relaxed text-foreground/75">
                {ind.intro}
              </p>

              <Link
                href="/contact"
                className="btn-shine btn-violet group mt-8 inline-flex items-center justify-center gap-2 rounded-full py-2.5 pe-2 ps-7 text-sm font-medium text-on-dark"
              >
                בואו נדבר על {ind.name}
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/40 text-paper backdrop-blur-sm transition-transform duration-300 group-hover:-translate-x-0.5">
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
                </span>
              </Link>
            </div>

            {/* outcome card — signature blue→lime radiant ring over glass */}
            <div className="lg:col-span-5">
              <div className="rounded-[1.8rem] p-[1.5px] shadow-[0_40px_80px_-30px_rgba(11,19,38,0.3)]" style={{ background: blueLime }}>
                <div className="relative overflow-hidden rounded-[calc(1.8rem-1.5px)] bg-paper/80 p-8 backdrop-blur-md md:p-10">
                  <span aria-hidden className="absolute -right-16 -top-16 block h-44 w-44 rounded-full opacity-60 blur-3xl" style={{ background: "#845EF7" }} />
                  <span aria-hidden className="absolute -bottom-16 -left-16 block h-44 w-44 rounded-full opacity-60 blur-3xl" style={{ background: "#A99BF5" }} />
                  <div className="relative">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-paper" style={{ background: blueLime }}>
                      <TrendingUp className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <div className="mt-5 eyebrow">התוצאה</div>
                    <p className="mt-3 text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium leading-snug tracking-[-0.02em] text-ink">
                      {ind.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The challenge + the system we build (animated) ────────────────── */}
      <IndustrySystem
        name={ind.name}
        pain={ind.pain}
        systemLead={ind.systemLead}
        solutions={ind.solutions}
        outcome={ind.outcome}
        theme={ind.theme}
        layout={ind.layout}
      />

      {/* ── Related services ──────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-line py-12 md:py-14">
          <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
            <div className="eyebrow">שירותים רלוונטיים</div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((s) => {
                const SIcon = SERVICE_ICONS[s.slug];
                return (
                  <Link
                    key={s.slug}
                    href={`/services#${s.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent/60 shadow-[0_24px_50px_-32px_rgba(11,19,38,0.2)]"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1 origin-right scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ background: grad }}
                    />
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-deep transition-colors duration-500 group-hover:bg-accent group-hover:text-paper">
                        {SIcon && <SIcon className="h-5 w-5" strokeWidth={1.75} />}
                      </span>
                      <span className="font-mono text-[11px] text-foreground/40">{s.num}</span>
                    </div>
                    <span className="mt-5 text-[17px] font-medium tracking-[-0.01em] transition-colors group-hover:text-accent">
                      {s.title}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[13px] text-foreground/60">
                      {s.verb}
                      <ChevronLeft className="h-4 w-4 text-accent opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-0.5" strokeWidth={2.25} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── More industries ───────────────────────────────────────────────── */}
      <section className="border-t border-line bg-bg-warm py-12 md:py-14">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <div className="eyebrow">תעשיות נוספות</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => {
              const OIcon = ICONS[o.icon];
              return (
                <Link
                  key={o.slug}
                  href={`/industries/${o.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-line bg-paper p-4 transition-colors duration-500 hover:border-accent/60"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-deep transition-colors duration-500 group-hover:bg-accent group-hover:text-paper">
                    {OIcon && <OIcon className="h-5 w-5" strokeWidth={1.75} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium tracking-[-0.01em] transition-colors group-hover:text-accent">
                      {o.name}
                    </span>
                    <span className="block truncate text-[13px] text-foreground/55">{o.verb}</span>
                  </span>
                  <ChevronLeft className="ms-auto h-4 w-4 shrink-0 text-foreground/30 transition-all duration-300 group-hover:text-accent group-hover:-translate-x-0.5" strokeWidth={2.25} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
