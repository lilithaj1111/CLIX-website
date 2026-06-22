"use client";

import { useEffect, useRef } from "react";

/* Animated "platform" backdrop — recreates the cinematic ripple loop:
   deep charcoal base, large concentric hairline arcs expanding from below the
   frame, and shimmering vertical light-ray curtains at the left/right edges
   with drifting sparks. Recolored to the brand palette:
     · Electric Cobalt Blue  #3A46F0
     · Vibrant Violet        #845EF7
     · Soft Lavender Flare   #E3E1F5
     · Deep Charcoal Shadow  #24272B
     · Muted Cyan            #3A94C5
   Canvas 2D, DPR-aware, additive glow, seamless loop. Respects
   prefers-reduced-motion. Sizes to its parent — give the parent `relative`. */

const COBALT = "#3A46F0";
const VIOLET = "#845EF7";
const LAVENDER = "#E3E1F5";
const CYAN = "#3A94C5";

type Ray = {
  x: number;
  edge: number; // 0..1, how close to the edge (1 = at the edge)
  base: number; // base brightness
  phase: number;
  sp: number; // shimmer speed
  width: number;
  color: string;
};

type Spark = {
  x: number;
  y: number;
  vy: number;
  r: number;
  phase: number;
  sp: number;
  color: string;
};

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

export function PlatformWaves({
  className = "",
  vivid = false,
}: {
  className?: string;
  /** Neon variant: bright violet arcs with bloom + a cyan→violet light pool. */
  vivid?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let time = 0;
    let rays: Ray[] = [];
    let sparks: Spark[] = [];

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      rays = [];
      sparks = [];
      const perSide = reduce ? 22 : 42;
      const curtainW = Math.max(90, w * 0.17);

      for (let side = 0; side < 2; side++) {
        const leftSide = side === 0;
        for (let i = 0; i < perSide; i++) {
          // Push lines toward the edge (squared distribution).
          const u = Math.random() * Math.random();
          const dx = u * curtainW;
          const x = leftSide ? dx : w - dx;
          const edge = 1 - dx / curtainW;
          const palette = leftSide ? [CYAN, COBALT, CYAN] : [VIOLET, COBALT, VIOLET];
          rays.push({
            x,
            edge,
            base: rnd(0.12, 0.55) * (0.45 + edge),
            phase: rnd(0, Math.PI * 2),
            sp: rnd(0.5, 1.7),
            width: Math.random() < 0.18 ? rnd(1.6, 2.6) : rnd(0.6, 1.3),
            color: palette[(Math.random() * palette.length) | 0],
          });
        }
      }

      const sparkN = reduce ? 0 : 64;
      const curtainW2 = curtainW;
      for (let i = 0; i < sparkN; i++) {
        const leftSide = i % 2 === 0;
        const dx = Math.random() * Math.random() * curtainW2;
        sparks.push({
          x: leftSide ? dx : w - dx,
          y: rnd(0, h),
          vy: rnd(4, 16),
          r: rnd(0.5, 1.7),
          phase: rnd(0, Math.PI * 2),
          sp: rnd(0.8, 2.2),
          color: leftSide
            ? Math.random() < 0.5
              ? CYAN
              : LAVENDER
            : Math.random() < 0.5
              ? VIOLET
              : LAVENDER,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      const rect = parent
        ? parent.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    resize();
    window.addEventListener("resize", resize);

    const ARCS = vivid ? 4 : 5;

    const drawArcs = () => {
      // Centre just off the bottom-left corner — arcs emerge near the corner and
      // sweep up and across to the upper-right (flowing rightward).
      const acx = vivid ? w * 0.34 : w * 0.5;
      const acy = vivid ? h * 1.08 : h * 1.02;
      const startR = Math.min(w, h) * (vivid ? 0.44 : 0.12);
      const maxR = Math.hypot(w, h) * (vivid ? 1.05 : 1.02);
      const span = maxR - startR;
      const p = (time * (vivid ? 0.13 : 0.045)) % 1; // progress through a spacing
      // Vivid: arcs wrap the off-centre orb. Subtle: symmetric concentric arcs from bottom-centre.
      const a0 = vivid ? Math.PI * 0.82 : Math.PI * 0.98;
      const a1 = vivid ? Math.PI * 2.12 : Math.PI * 2.02;

      ctx.globalCompositeOperation = "lighter";
      for (let k = 0; k < ARCS; k++) {
        const frac = (p + k / ARCS) % 1;
        const r = startR + frac * span;
        const a = Math.pow(Math.sin(frac * Math.PI), 0.7); // fade in/out
        if (a <= 0.001) continue;

        if (vivid) {
          // Bright violet neon: wide bloom + medium glow + hot core line.
          ctx.beginPath();
          ctx.arc(acx, acy, r, a0, a1);
          ctx.strokeStyle = hexA(VIOLET, a * 0.14);
          ctx.lineWidth = 18;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(acx, acy, r, a0, a1);
          ctx.strokeStyle = hexA(VIOLET, a * 0.42);
          ctx.lineWidth = 6;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(acx, acy, r, a0, a1);
          ctx.strokeStyle = hexA("#EDE6FF", a * 0.95);
          ctx.lineWidth = 1.6;
          ctx.stroke();
        } else {
          // Subtle lavender hairline (UiPath-style).
          ctx.beginPath();
          ctx.arc(acx, acy, r, a0, a1);
          ctx.strokeStyle = hexA(LAVENDER, a * 0.05);
          ctx.lineWidth = 6;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(acx, acy, r, a0, a1);
          ctx.strokeStyle = hexA(LAVENDER, a * 0.75);
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    };

    const drawOrb = () => {
      // Glowing cyan→violet lens at the centre where the arcs converge.
      const cx0 = w * 0.34;
      const cy0 = h * 1.08;
      const pulse = 0.88 + 0.12 * Math.sin(time * 0.8);
      const R = Math.min(w, h) * 0.72 * pulse;
      ctx.globalCompositeOperation = "lighter";

      // Violet halo
      const halo = ctx.createRadialGradient(cx0, cy0, 0, cx0, cy0, R * 1.3);
      halo.addColorStop(0, hexA(VIOLET, 0.34));
      halo.addColorStop(0.4, hexA(VIOLET, 0.12));
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // Cyan core, offset slightly up/right → cyan-left, violet-right blend
      const ccx = w * 0.42;
      const ccy = cy0 - R * 0.12;
      const core = ctx.createRadialGradient(ccx, ccy, 0, ccx, ccy, R * 0.5);
      core.addColorStop(0, hexA(CYAN, 0.5));
      core.addColorStop(0.35, hexA("#8FE0EC", 0.18));
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, w, h);

      // Hot white-cyan nucleus
      const nuc = ctx.createRadialGradient(ccx, ccy, 0, ccx, ccy, R * 0.2);
      nuc.addColorStop(0, hexA("#EAFBFF", 0.4));
      nuc.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nuc;
      ctx.fillRect(0, 0, w, h);
    };

    const drawCurtains = () => {
      ctx.globalCompositeOperation = "lighter";
      const scale = vivid ? 0.5 : 1; // calmer side curtains in the neon variant
      for (const ray of rays) {
        const shimmer = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * ray.sp + ray.phase));
        const a = ray.base * shimmer * scale;
        if (a <= 0.004) continue;
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, hexA(ray.color, 0));
        grad.addColorStop(0.18, hexA(ray.color, a * 0.5));
        grad.addColorStop(0.52, hexA(ray.color, a));
        grad.addColorStop(0.85, hexA(ray.color, a * 0.4));
        grad.addColorStop(1, hexA(ray.color, 0));
        ctx.strokeStyle = grad;
        ctx.lineWidth = ray.width;
        ctx.beginPath();
        ctx.moveTo(ray.x, 0);
        ctx.lineTo(ray.x, h);
        ctx.stroke();
      }
    };

    const drawSparks = (dt: number) => {
      ctx.globalCompositeOperation = "lighter";
      for (const s of sparks) {
        s.y -= s.vy * dt;
        if (s.y < -4) s.y = h + 4;
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * s.sp + s.phase));
        ctx.fillStyle = hexA(s.color, 0.7 * tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawBackground = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#191B1E"; // deep charcoal base
      ctx.fillRect(0, 0, w, h);

      // Subtle cool vignette glow at the bottom-centre (where the arcs converge),
      // then darken edges.
      const g1 = ctx.createRadialGradient(w * 0.5, h * 1.02, 0, w * 0.5, h * 1.02, Math.max(w, h) * 0.85);
      g1.addColorStop(0, hexA(CYAN, 0.12));
      g1.addColorStop(0.5, hexA(COBALT, 0.05));
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      if (vivid) {
        // Deep-blue wash top-right, like the reference.
        const g3 = ctx.createRadialGradient(w * 0.9, -h * 0.1, 0, w * 0.9, -h * 0.1, Math.max(w, h) * 0.75);
        g3.addColorStop(0, hexA(COBALT, 0.13));
        g3.addColorStop(0.6, hexA(COBALT, 0.03));
        g3.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g3;
        ctx.fillRect(0, 0, w, h);
      }

      const g2 = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.2, w * 0.5, h * 0.5, w * 0.7);
      g2.addColorStop(0, "rgba(0,0,0,0)");
      g2.addColorStop(1, "rgba(8,9,11,0.55)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    };

    const drawFrame = (dt: number) => {
      drawBackground();
      if (vivid) drawOrb();
      drawArcs();
      drawCurtains();
      drawSparks(dt);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };

    if (reduce) {
      time = 6;
      drawFrame(0);
    } else {
      const tick = () => {
        time += 0.016;
        drawFrame(0.016);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [vivid]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
