"use client";

import { Reveal } from "./Reveal";
import { Tilt } from "./Tilt";
import { CinematicCard } from "./CinematicCard";
import { useInViewAttr } from "@/lib/useInViewAttr";
import { Scene } from "./three/Scene";
import { RevealScene } from "./RevealScene";

const steps = [
  {
    n: "01",
    title: "אבחון",
    body: "אנחנו נפגשים עם הצוות שלכם, ממפים את המערכות הקיימות ומאתרים היכן ה-AI באמת יוצר ערך לעסק.",
  },
  {
    n: "02",
    title: "תכנון",
    body: "אנחנו מתכננים את המערכת הקומפקטית ביותר שפותרת את הבעיה הגדולה ביותר בחירה שמתבססת על ROI, אבטחה ועמידות לאורך זמן.",
  },
  {
    n: "03",
    title: "בנייה",
    body: "מהנדסים בכירים משחררים גרסאות בקצב מהיר. תוצרים מוכנים לשימוש מדי שבוע לא מצגות.",
  },
  {
    n: "04",
    title: "הפעלה",
    body: "אנחנו מנטרים את המערכת, משפרים אותה ומכשירים את הצוות שלכם לתפעל אותה באופן עצמאי. שליטה מלאה, ללא תלות חיצונית.",
  },
];

export function Process() {
  const sectionRef = useInViewAttr<HTMLElement>();
  return (
    <section
      ref={sectionRef}
      className="border-t border-line bg-paper py-20 md:py-28 relative overflow-hidden"
    >
      {/* Horizontal ribbon strip — flows behind the four step cards. */}
      <RevealScene
        opacity={0.3}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70%] pointer-events-none z-0"
      >
        <Scene
          kind="ribbon"
          density={1}
          scale={1.1}
          accentMix={0.6}
          position={[0, 0, 0]}
          className="absolute inset-0"
        />
      </RevealScene>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 relative z-[1]">
        <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20 items-end">
          <Reveal className="md:col-span-6" direction="left">
            <div className="eyebrow">המתודולוגיה שלנו</div>
            <h2 className="mt-5 text-[clamp(2rem,4.5vw,4rem)] leading-[1.02] tracking-[-0.03em]">
              מהירות של <span className="serif-italic text-accent">מעבדה.</span>
              <br />
              משמעת של <span className="serif-italic text-accent">מפעל.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-4 gap-6 md:gap-5">
          {steps.map((s, i) => (
            <CinematicCard key={s.n} delay={i * 0.12} className="h-full">
              <Tilt max={9} scale={1.02} className="h-full">
                <div
                  className="glow-hover relative bg-paper border border-line rounded-xl p-7 md:p-8 flex flex-col gap-6 min-h-[300px] h-full group"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Large embossed number — uses CSS text-shadow stack for 3D feel */}
                  <div
                    className="stamp-3d font-mono text-5xl md:text-6xl font-medium tracking-tight text-foreground/15 group-hover:text-accent/40 transition-colors duration-500"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {s.n}
                  </div>

                  {/* Floating accent dot — small "satellite" with parallax depth */}
                  <span
                    aria-hidden
                    className="absolute top-7 right-7 w-2 h-2 rounded-full bg-accent shadow-[0_0_20px] shadow-accent/60"
                    style={{ transform: "translateZ(40px)" }}
                  />

                  <h3
                    className="text-2xl md:text-3xl tracking-tight"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    {s.title}
                  </h3>

                  <p
                    className="text-[15px] leading-relaxed text-foreground/75 mt-auto"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    {s.body}
                  </p>

                  {/* Hairline connector at bottom — animates on group hover */}
                  <span
                    aria-hidden
                    className="absolute left-7 right-7 bottom-7 h-px bg-foreground/15 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                </div>
              </Tilt>
            </CinematicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
