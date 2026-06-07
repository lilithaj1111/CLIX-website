"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────────
 * HeroTileField — radial domino fan (styled after tt.jpg).
 *
 * Extruded indigo-glass bars radiate from a focal point on the right and fan
 * out to the left, like the reference render. A domino wave then ripples
 * *around the arc*: each bar tips toward its neighbour in sequence while its
 * bright inner edge flares — a pulse of motion + light travelling across the
 * fan, looping. The convergence core glows and breathes underneath.
 *
 * Decorative only — aria-hidden, pointer-events none, behind content.
 * ──────────────────────────────────────────────────────────────────────── */

const N = 11;
const PLANE_W = 660;
const PLANE_H = 580;
const CX = PLANE_W * 0.62; // focal point — right of centre, like the image
const CY = PLANE_H * 0.44;

const ANGLE_START = 130; // upper bars point up-left …
const ANGLE_END = 258; // … sweeping round to lower-left / down
const INNER_R = 18; // bars nearly meet at the core
const THICK = 30;
const LEN_START = 218; // upper bars are the longest in the render
const LEN_END = 150;
const TIP = 14; // how far each bar tips onto its neighbour (deg)

/* Wave timing (seconds) */
const INTRO = 0.3;
const STEP = 0.12; // contact delay between neighbours
const TIP_DUR = 0.28; // tip-over
const BACK_DUR = 0.46; // settle back
const HOLD_END = 0.6; // breath before the wave restarts

export function HeroTileField({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  const cycle = INTRO + (N - 1) * STEP + TIP_DUR + BACK_DUR + HOLD_END;

  const glassBg =
    "linear-gradient(90deg, rgba(99,102,241,0.92) 0%, rgba(129,140,248,0.85) 30%, rgba(165,180,252,0.70) 65%, rgba(199,210,254,0.40) 100%)";
  const glassShadow =
    "4px 7px 0 0 rgba(79,70,229,0.28), 0 16px 30px -10px rgba(79,70,229,0.40), inset 0 2px 0 rgba(255,255,255,0.60), inset 0 -3px 6px rgba(67,56,202,0.30)";

  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <div
        className="absolute top-1/2 left-[1%] sm:left-[2%] md:left-[3%] lg:left-[4%] -translate-y-1/2 scale-[0.5] sm:scale-[0.62] md:scale-[0.8] lg:scale-100 origin-left"
        style={{ width: PLANE_W, height: PLANE_H }}
      >
        {/* convergence core glow — breathes softly */}
        <motion.div
          className="absolute rounded-full"
          style={{
            left: CX - 150,
            top: CY - 150,
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle, rgba(99,102,241,0.40) 0%, rgba(129,140,248,0.18) 35%, transparent 70%)",
            filter: "blur(8px)",
          }}
          initial={reduce ? false : { opacity: 0.6, scale: 0.92 }}
          animate={reduce ? undefined : { opacity: [0.5, 0.8, 0.5], scale: [0.92, 1.04, 0.92] }}
          transition={reduce ? undefined : { duration: cycle, repeat: Infinity, ease: "easeInOut" }}
        />

        {Array.from({ length: N }).map((_, i) => {
          const t = i / (N - 1);
          const angle = ANGLE_START + t * (ANGLE_END - ANGLE_START);
          const len = LEN_START + t * (LEN_END - LEN_START);

          const waveAt = INTRO + i * STEP;
          const times = [
            0,
            waveAt / cycle,
            (waveAt + TIP_DUR) / cycle,
            (waveAt + TIP_DUR + BACK_DUR) / cycle,
            1,
          ];

          const barStyle = {
            position: "absolute" as const,
            left: 0,
            top: -THICK / 2,
            width: len,
            height: THICK,
            borderRadius: 7,
            transformOrigin: "0% 50%", // hinge at the inner (core-facing) end
            background: glassBg,
            boxShadow: glassShadow,
            willChange: "transform",
          };

          // bright inner-edge glow that flares as the wave passes
          const glowStyle = {
            position: "absolute" as const,
            left: -THICK * 0.6,
            top: THICK / 2 - THICK * 0.8,
            width: THICK * 1.6,
            height: THICK * 1.6,
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(67,56,202,0.95) 0%, rgba(79,86,255,0.55) 45%, transparent 72%)",
            filter: "blur(5px)",
          };

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: CX,
                top: CY,
                width: 0,
                height: 0,
                transformOrigin: "0 0",
                transform: `rotate(${angle}deg) translateX(${INNER_R}px)`,
              }}
            >
              {reduce ? (
                <div style={barStyle}>
                  <div style={{ ...glowStyle, opacity: 0.4 }} />
                </div>
              ) : (
                <motion.div
                  style={barStyle}
                  initial={{ rotate: 0, scale: 1 }}
                  animate={{ rotate: [0, 0, TIP, 0, 0], scale: [1, 1, 1.04, 1, 1] }}
                  transition={{
                    duration: cycle,
                    times,
                    ease: ["linear", "easeIn", "easeOut", "linear", "linear"],
                    repeat: Infinity,
                  }}
                >
                  <motion.div
                    style={glowStyle}
                    initial={{ opacity: 0.18 }}
                    animate={{ opacity: [0.18, 0.18, 1, 0.18, 0.18] }}
                    transition={{
                      duration: cycle,
                      times,
                      ease: "easeOut",
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
