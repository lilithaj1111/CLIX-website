"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * IndustrySystem — the animated "challenge → system" block on an industry page.
 * Each sector passes its own colour `theme` and a `layout` ("flow" horizontal
 * stepper or "timeline" vertical) so no two sector pages look the same.
 * Scroll-triggered animations; fully disabled under reduced-motion.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

type Solution = { title: string; body: string };

export function IndustrySystem({
  name,
  pain,
  systemLead,
  solutions,
  outcome,
  theme,
  layout,
}: {
  name: string;
  pain: string;
  systemLead: string;
  solutions: Solution[];
  outcome: string;
  theme: [string, string];
  layout: "flow" | "cards";
}) {
  const reduce = useReducedMotion();
  const [c1, c2] = theme;
  const grad = `linear-gradient(135deg, ${c1}, ${c2})`;
  const words = pain.split(" ");

  const node = (i: number) => (
    <span
      className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-mono text-[15px] font-medium text-paper ring-[7px] ring-bg-warm"
      style={{
        background: grad,
        boxShadow: `0 16px 34px -12px color-mix(in srgb, ${c1} 70%, transparent)`,
      }}
    >
      0{i + 1}
    </span>
  );

  return (
    <section className="relative overflow-hidden border-t border-line bg-bg-warm py-20 md:py-28">
      {/* dot-grid texture, tinted to the sector colour, masked to fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, color-mix(in srgb, ${c1} 16%, transparent) 1px, transparent 1.4px)`,
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(72% 60% at 50% 38%, #000 0%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(72% 60% at 50% 38%, #000 0%, transparent 78%)",
        }}
      />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        {/* challenge */}
        <div className="relative mx-auto max-w-[760px] text-center">
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-44 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
            style={{ background: grad }}
          />
          <motion.div
            className="eyebrow justify-center"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            האתגר
          </motion.div>
          <h2 className="mt-4 text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.18] tracking-[-0.025em] text-ink">
            {words.map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                className="inline-block whitespace-pre"
                initial={reduce ? false : { opacity: 0, y: "0.5em", filter: "blur(4px)" }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.05 + i * 0.035 }}
              >
                {w + " "}
              </motion.span>
            ))}
          </h2>
        </div>

        {/* the system */}
        <div className="mt-16 md:mt-24">
          <motion.div
            className="mb-12 text-center md:mb-16"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="eyebrow justify-center">מה אנחנו בונים</div>
            <h2 className="mt-3 text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-[-0.02em]">
              המערכת ל<span style={{ color: c1 }}>{name}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[15.5px] leading-relaxed text-foreground/70">
              {systemLead}
            </p>
          </motion.div>

          {layout === "flow" ? (
            /* ── horizontal flow ── */
            <div className="relative">
              <motion.span
                aria-hidden
                className="absolute inset-x-[16%] top-7 hidden h-[2px] origin-right md:block"
                style={{
                  background: `linear-gradient(90deg, transparent, ${c1} 22%, ${c2} 78%, transparent)`,
                }}
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={reduce ? undefined : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              />
              <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
                {solutions.map((s, i) => (
                  <motion.div
                    key={s.title}
                    className="relative flex flex-col items-center text-center"
                    initial={reduce ? false : { opacity: 0, y: 22, scale: 0.92 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.25 + i * 0.18 }}
                  >
                    {node(i)}
                    <h3 className="mt-6 text-[17px] font-medium tracking-[-0.01em] text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-[320px] text-[14.5px] leading-relaxed text-foreground/70">
                      {s.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            /* ── solid cards ── */
            <div className="grid gap-5 md:grid-cols-3">
              {solutions.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="h-full"
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.1 + i * 0.14 }}
                >
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper p-7 transition-[transform,border-color] duration-500 hover:-translate-y-1.5 hover:border-accent/50 shadow-[0_24px_50px_-30px_rgba(11,19,38,0.18)]">
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1 origin-right scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ background: grad }}
                    />
                    <div className="flex items-center justify-between">
                      <span
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full font-mono text-[14px] font-medium text-paper"
                        style={{
                          background: grad,
                          boxShadow: `0 14px 28px -10px color-mix(in srgb, ${c1} 65%, transparent)`,
                        }}
                      >
                        0{i + 1}
                      </span>
                      <Check
                        className="h-5 w-5"
                        strokeWidth={2.25}
                        style={{ color: `color-mix(in srgb, ${c1} 45%, transparent)` }}
                      />
                    </div>
                    <h3 className="mt-5 text-[17.5px] font-medium tracking-[-0.01em] text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/70">
                      {s.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* outcome pill rises last */}
          <motion.div
            className="mx-auto mt-14 flex max-w-fit items-center gap-2.5 rounded-full border bg-paper px-5 py-2.5 text-[14px] font-medium shadow-[0_18px_40px_-26px_rgba(11,19,38,0.25)]"
            style={{
              borderColor: `color-mix(in srgb, ${c1} 30%, transparent)`,
              color: `color-mix(in srgb, ${c1} 80%, #24272B)`,
            }}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          >
            <Check className="h-4 w-4" strokeWidth={2.5} style={{ color: c1 }} />
            {outcome}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
