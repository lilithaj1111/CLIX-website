"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";

type Pillar = {
  slug: string;
  label: string;
  title: string;
  desc: string;
  image: string;
};

const pillars: Pillar[] = [
  {
    slug: "ai-agents",
    label: "אוטומציה",
    title: "סוכני AI",
    desc: "חברי צוות אוטונומיים למכירות, תמיכה ותפעול שלא נחים אף פעם.",
    image: "/card-ai-agent.png",
  },
  {
    slug: "integrations",
    label: "אינטגרציות",
    title: "אוטומציות ואינטגרציות",
    desc: "מחברים את כל המערכות שלכם וממכנים את כל העבודה החוזרת.",
    image: "/card-automation.jpg",
  },
  {
    slug: "whatsapp",
    label: "ערוצים",
    title: "אוטומציות WhatsApp",
    desc: "עוזרים חכמים שמוכרים, תומכים ועוקבים איפה שהלקוח כבר נמצא.",
    image: "/card-whatsapp-2.png",
  },
  {
    slug: "software",
    label: "פיתוח",
    title: "תוכנה מותאמת אישית",
    desc: "אתרים, אפליקציות ומערכות שנבנות בדיוק סביב העסק שלכם.",
    image: "/card-software.jpg",
  },
];

export function PlatformFeatures() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink-warm py-20 md:py-28">
      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#A99BF5]">
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
          {pillars.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.07}>
              <Link
                href={`/services#${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#2C3037] transition-colors duration-300 hover:border-white/25"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width:768px) 100vw, 25vw"
                    className={`object-cover ${p.slug === "software" ? "object-top" : "object-center"} transition-transform duration-700 group-hover:scale-[1.04]`}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#A99BF5]">
                    {p.label}
                  </span>
                  <h3 className="mt-3 text-[17px] font-bold leading-snug text-on-dark">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-on-dark/75">
                    {p.desc}
                  </p>
                  <span className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-on-dark/80 transition-all duration-300 group-hover:-translate-x-1 group-hover:bg-white/10 group-hover:text-on-dark">
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
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
              className="inline-flex items-center gap-2 rounded-full bg-[#845EF7] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9A7BF8]"
            >
              דברו איתנו
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
