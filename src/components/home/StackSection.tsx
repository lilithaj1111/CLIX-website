"use client";

import { motion } from "framer-motion";
import { TOOLS } from "@/lib/tool-icons";

/**
 * Stack section — "every tool you use feeds one brain". A compact layout:
 * headline → a Clix "one brain" toggle → a cloud of tool chips. Palette only
 * (cobalt #3A46F0, violet #845EF7, lavender #E3E1F5, charcoal #24272B,
 * cyan #3A94C5); each chip carries its real brand glyph in a faint brand tint.
 */
export function StackSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F3F1FB] to-[#E7E4F4] py-[135px]">
      {/* soft violet glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(720px 380px at 50% 16%, color-mix(in srgb, #845EF7 14%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1100px] px-6 lg:px-10">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink"
        >
          כל הכלים שאתם משתמשים בהם{" "}
          <span className="bg-[linear-gradient(90deg,#3A46F0,#845EF7,#24272B,#3A94C5)] bg-clip-text text-transparent">
            מזינים מוח אחד.
          </span>
        </motion.h2>

        {/* "One brain · Clix" toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#3A46F0] to-[#845EF7] py-2 pe-2 ps-6 shadow-[0_20px_45px_-15px_rgba(58,70,240,0.6)]">
            <span className="text-[15px] font-bold tracking-tight text-white">
              מוח אחד · Clix
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(20,18,40,0.3)]">
              <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-[#845EF7] to-[#3A46F0]" />
            </span>
          </div>
        </motion.div>

        {/* Tool chips */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
          }}
          className="mx-auto mt-12 flex max-w-[840px] flex-wrap items-center justify-center gap-3 md:gap-3.5"
        >
          {TOOLS.map((tool) => {
            const Icon = tool.Icon;
            return (
              <motion.span
                key={tool.id}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.95 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-[15.5px] font-semibold text-ink shadow-[0_10px_22px_-12px_rgba(36,39,43,0.45)] ring-1 ring-black/[0.04]"
              >
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                  style={{
                    background: `color-mix(in srgb, ${tool.brand} 18%, white)`,
                    color: tool.brand,
                  }}
                >
                  <span className="block h-4 w-4">
                    <Icon />
                  </span>
                </span>
                {tool.name}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
