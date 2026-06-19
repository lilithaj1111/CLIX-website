"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Scene, type SceneKind, type SceneProps } from "./three/Scene";
import { RevealScene } from "./RevealScene";

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** Which 3D scene plays in this hero. Default `orb`. */
  scene?: SceneKind;
  /** Side of the hero the scene anchors to. */
  sceneSide?: "right" | "left" | "bottom-right" | "full";
  /** Per-page scene overrides. */
  sceneProps?: Partial<SceneProps>;
  /** Adds a soft blue + lime radiant wash behind the hero. */
  radiant?: boolean;
};

/**
 * Shared interactive page hero used by /services, /work, /about, /contact.
 * Each page picks its own 3D scene + position; the scene fades in
 * cinematically on first view via RevealScene, and the text parallax
 * advances with scroll.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  scene = "orb",
  sceneSide = "right",
  sceneProps,
  radiant = false,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  const scenePosition: [number, number, number] =
    sceneProps?.position ??
    (sceneSide === "left"
      ? [-1.4, 0.3, 0]
      : sceneSide === "bottom-right"
        ? [1.6, -1.2, 0]
        : sceneSide === "full"
          ? [0, 0, 0]
          : [1.4, 0.2, 0]);

  return (
    <section
      ref={ref}
      className="relative pt-24 md:pt-32 pb-24 md:pb-32 overflow-hidden"
    >
      <div aria-hidden className="absolute inset-0 z-0 aurora-bg" />

      {radiant && (
        <div
          aria-hidden
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(46% 60% at 88% 6%, color-mix(in srgb, var(--accent-2) 20%, transparent), transparent 66%)",
              "radial-gradient(44% 56% at 10% 0%, color-mix(in srgb, var(--accent-2) 22%, transparent), transparent 66%)",
              "radial-gradient(64% 52% at 50% 104%, color-mix(in srgb, #A9BDD0 13%, transparent), transparent 70%)",
            ].join(", "),
            maskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)",
          }}
        />
      )}

      <RevealScene
        opacity={0.95}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Scene
          kind={scene}
          density={1}
          scale={1.2}
          accentMix={0.5}
          {...sceneProps}
          position={scenePosition}
          className="absolute inset-0"
        />
      </RevealScene>

      {/* Readability veil — strong at mobile + tablet (the scene would otherwise
          paint over the right column), softer at desktop (lets the scene
          breathe while keeping copy legible). */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none bg-background/55 lg:bg-background/15"
      />

      <motion.div style={{ y: textY }} className="relative z-[2]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="eyebrow"
              >
                {eyebrow}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1,
                }}
                className="mt-7 text-[clamp(2rem,4.8vw,4.5rem)] leading-[1] tracking-[-0.035em] font-medium"
              >
                {title}
              </motion.h1>
            </div>
            {intro && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="md:col-span-4 md:pt-10"
              >
                {intro}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
