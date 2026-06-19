"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { projects } from "@/lib/work";

export function WorkGallery() {
  return (
    <section className="relative border-t border-white/10 bg-ink-warm py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#8CA0B3]">
              תוצאות בשטח
            </p>
            <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-on-dark">
              מערכות שבנינו. תוצאות שהן הביאו.
            </h2>
          </div>

          <Link
            href="/work"
            className="hidden items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-on-dark transition-colors hover:bg-white/10 md:inline-flex"
          >
            לכל העבודות
            <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((project, i) => {
            const [featured, ...rest] = project.metrics;

            return (
              <Reveal key={project.slug} delay={i * 0.08}>
                <Link
                  href="/work"
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-paper transition-colors duration-300 hover:border-line-strong"
                >
                  <div
                    className="p-7 text-on-dark"
                    style={{
                      background:
                        "linear-gradient(135deg, #2A3540 0%, #3D4A59 100%)",
                    }}
                  >
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#8CA0B3]">
                      {project.category}
                    </span>
                    <p className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-[-0.02em]">
                      {featured.value}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-on-dark/60">
                      {featured.label}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                      {project.client}
                    </span>
                    <h3 className="mt-2 text-xl font-bold leading-snug tracking-[-0.01em] text-ink">
                      {project.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-foreground/65">
                      {project.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {rest.map((metric) => (
                        <span
                          key={metric.label}
                          className="inline-flex items-baseline gap-1.5 rounded-full border border-line bg-bg-warm px-3 py-1 text-xs text-foreground/70"
                        >
                          <span className="font-semibold text-ink">
                            {metric.value}
                          </span>
                          <span className="text-foreground/55">·</span>
                          <span>{metric.label}</span>
                        </span>
                      ))}
                    </div>

                    <span className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-all duration-300 group-hover:-translate-x-1 group-hover:bg-bg-warm">
                      <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
