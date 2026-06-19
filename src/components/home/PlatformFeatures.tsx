"use client";

import Link from "next/link";
import { ArrowLeft, Bot, Workflow, MessageCircle, Code2, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";

type Pillar = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const pillars: Pillar[] = [
  {
    icon: Bot,
    title: "סוכני AI",
    desc: "חברי צוות אוטונומיים למכירות, תמיכה ותפעול שלא נחים אף פעם.",
  },
  {
    icon: Workflow,
    title: "אוטומציות ואינטגרציות",
    desc: "מחברים את כל המערכות שלכם וממכנים את כל העבודה החוזרת.",
  },
  {
    icon: MessageCircle,
    title: "אוטומציות WhatsApp",
    desc: "עוזרים חכמים שמוכרים, תומכים ועוקבים איפה שהלקוח כבר נמצא.",
  },
  {
    icon: Code2,
    title: "תוכנה מותאמת אישית",
    desc: "אתרים, אפליקציות ומערכות שנבנות בדיוק סביב העסק שלכם.",
  },
];

export function PlatformFeatures() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink-warm py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#8CA0B3]">
            מה אנחנו בונים
          </p>
          <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-on-dark">
            AI שמייצר ROI, לא רק רעש.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-on-dark/65 md:text-base">
            ארבעה תחומי ליבה שמרכיבים מערכת אחת — מתוכננת סביב החזר השקעה, אבטחה ועמידות לאורך זמן.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#3D4A59] text-on-dark">
                    <Icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="text-lg font-bold text-on-dark">{pillar.title}</h3>
                  <p className="text-[14px] leading-relaxed text-on-dark/60">{pillar.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-on-dark px-6 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              גלו את השירותים
              <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#54728A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#62809a]"
            >
              דברו איתנו
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
