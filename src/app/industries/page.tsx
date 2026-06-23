import Link from "next/link";
import { industries } from "@/lib/industries";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { IndustryIcon } from "@/components/industries/IndustryIcon";
import {
  Building2,
  Landmark,
  HeartPulse,
  ShoppingBag,
  Truck,
  GraduationCap,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תעשיות — Clix",
  description:
    "מערכות AI ואוטומציה מותאמות למגזר שלכם נדל״ן, פיננסים, בריאות, קמעונאות, לוגיסטיקה וחינוך. לא תבנית גנרית, אלא פתרון שמכיר את התחום.",
};

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Landmark,
  HeartPulse,
  ShoppingBag,
  Truck,
  GraduationCap,
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow={<span>תעשיות · לפי מגזר</span>}
        title={
          <>
            AI שמדבר את השפה של{" "}
            <span className="serif-italic text-accent">התעשייה שלכם.</span>
          </>
        }
        scene="flow"
        sceneSide="right"
        sceneProps={{ accentMix: 0.6 }}
      />

      <section className="border-t border-line bg-bg-warm py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => {
              const Icon = ICONS[ind.icon];
              const [c1, c2] = ind.theme;
              const grad = `linear-gradient(135deg, ${c1}, ${c2})`;
              return (
                <Reveal key={ind.slug} delay={(i % 3) * 0.06}>
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper p-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 shadow-[0_24px_50px_-30px_rgba(11,19,38,0.18)] hover:shadow-[0_34px_66px_-30px_color-mix(in_srgb,var(--accent)_30%,transparent)]"
                  >
                    {/* sector gradient bar — draws in from the right on hover */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1 origin-right scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ background: grad }}
                    />
                    {/* soft sector glow — fades in on hover for depth */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-40"
                      style={{ background: c2 }}
                    />

                    {/* icon + name — glossy baby-blue app-icon tile */}
                    <div className="relative flex items-center gap-3.5">
                      <IndustryIcon
                        Icon={Icon}
                        size="md"
                        className="transition-transform duration-500 group-hover:scale-[1.07]"
                      />
                      <h2 className="text-xl font-medium tracking-[-0.01em]">
                        {ind.name}
                      </h2>
                    </div>

                    {/* verb + benefit kicker */}
                    <p
                      className="relative mt-5 serif-italic text-[17px] leading-snug"
                      style={{ color: c1 }}
                    >
                      {ind.verb}.
                    </p>

                    {/* pain */}
                    <p className="relative mt-2 text-[14px] leading-relaxed text-foreground/65">
                      {ind.pain}
                    </p>

                    {/* solutions */}
                    <ul className="relative mt-5 flex flex-col gap-2">
                      {ind.solutions.map((s) => (
                        <li
                          key={s.title}
                          className="flex gap-2.5 text-[13.5px] leading-snug text-foreground/80"
                        >
                          <span
                            className="mt-[6px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: grad }}
                          />
                          {s.title}
                        </li>
                      ))}
                    </ul>

                    {/* outcome tag */}
                    <div className="relative mt-auto pt-6">
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium"
                        style={{
                          background: `color-mix(in srgb, ${c1} 12%, white)`,
                          color: `color-mix(in srgb, ${c1} 80%, #24272B)`,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: c1 }}
                        />
                        {ind.outcome}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {/* "don't see yours" line — honest, low-pressure, on-brand */}
          <Reveal delay={0.1}>
            <p className="mt-12 text-center text-[15px] text-foreground/65">
              לא רואים את התחום שלכם?{" "}
              <a
                href="/contact"
                className="link-underline font-medium text-accent hover:text-accent-deep"
              >
                הכאב התפעולי דומה בכל מגזר בואו נדבר
              </a>
              <ChevronLeft className="mr-1 inline h-4 w-4 text-accent" strokeWidth={2.25} />
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
