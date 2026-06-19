import { FlowCanvas } from "@/components/playground/FlowCanvas";
import { CTA } from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "פלייגראונד — Clix",
  description:
    "סביבת ניסוי אינטראקטיבית של המערכות שאנחנו בונים. גררו סוכנים, טריגרים ופעולות לקנבס וצפו בנתונים זורמים בזמן אמת.",
};

export default function PlaygroundPage() {
  return (
    <>
      {/* Mobile-only screen: blocks the entire page experience and asks
          the visitor to open on desktop. All the other sections below
          are `hidden md:block` so they never render on phone. */}
      <section className="md:hidden min-h-[calc(100svh-120px)] flex items-center px-6 pt-24 pb-16">
        <div className="mx-auto max-w-md w-full text-center">
          <div className="inline-flex w-14 h-14 rounded-full bg-accent-soft/60 items-center justify-center mb-5">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-accent"
              aria-hidden
            >
              <rect x="2" y="4" width="20" height="13" rx="2" />
              <path d="M8 21h8M12 17v4" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium tracking-tight">
            הפלייגראונד זמין במחשב בלבד
          </h1>
          <p className="mt-4 text-foreground/70 text-[14.5px] leading-relaxed">
            בניית התהליכים מתבססת על גרירה ושחרור של צמתים על הקנבס
            חוויה שלא מתאימה למסך מגע קטן. פתחו את העמוד הזה במחשב כדי
            להתחיל לבנות.
          </p>
          <a
            href="/"
            className="mt-7 inline-flex items-center justify-center text-sm px-5 py-2 rounded-full border border-foreground/25 hover:border-accent hover:text-accent transition-colors bg-paper/85 backdrop-blur-sm font-medium"
          >
            חזרה לעמוד הבית
          </a>
        </div>
      </section>

      <section className="hidden md:block relative pt-20 md:pt-24 pb-8 overflow-hidden">
        {/* Lime/mint radiant — matches the atmosphere across the home page
            sections and the AI Agents service card. */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(40% 50% at 25% 30%, color-mix(in srgb, #8CA0B3 28%, transparent), transparent 70%)",
              "radial-gradient(38% 48% at 75% 60%, color-mix(in srgb, #A9BDD0 24%, transparent), transparent 70%)",
              "radial-gradient(32% 42% at 50% 85%, color-mix(in srgb, #8CA0B3 20%, transparent), transparent 70%)",
            ].join(", "),
          }}
        />
        <div className="relative z-[1] mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <Reveal className="md:col-span-8">
              <div className="eyebrow">פלייגראונד · v0.1</div>
              <h1 className="mt-7 text-[clamp(2.2rem,5.5vw,5.5rem)] leading-[0.95] tracking-[-0.035em]">
                בנו מערכת
                <br />
                ב<span className="serif-italic text-accent">דפדפן שלכם.</span>
              </h1>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Tip bar — desktop only. */}
      <section className="hidden md:block pb-4">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <div className="glass grad-border rounded-xl px-4 py-3 md:px-5 md:py-3.5 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-[11.5px] md:text-[12px] font-mono text-foreground/65 leading-relaxed">
              <span>
                <span className="text-foreground">טיפ ·</span> גררו מהנקודה
                הימנית של צומת אחד לנקודה השמאלית של צומת אחר כדי לחבר ביניהם.
              </span>
              <span aria-hidden className="hidden md:inline text-foreground/30">
                ·
              </span>
              <span>
                <span className="text-foreground">מחיקה ·</span> סימון + ⌫
                להסרת צומת.
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Canvas — desktop only. Drag-and-drop UX doesn't translate to
          touch screens, so on mobile we replace it with a notice below
          asking the visitor to open the page on a desktop. */}
      <section className="hidden md:block pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <FlowCanvas />
          </Reveal>
        </div>
      </section>

      <div className="hidden md:block">
        <CTA />
      </div>
    </>
  );
}
