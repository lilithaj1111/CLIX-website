"use client";

import { useEffect, useRef } from "react";

/* Convergence palette — blue → violet → periwinkle with a cyan spark, echoing
   the brand reference orb. Weighted toward violet so it reads on-theme; the
   cyan/light tones are the minority highlights that catch the eye. */
const COLORS = [
  "#845EF7", // brand violet
  "#845EF7", // violet
  "#845EF7", // light violet
  "#A99BF5", // periwinkle
  "#A99BF5", // periwinkle light
  "#3A46F0", // blue
  "#3A94C5", // cyan spark (rare)
  "#D9CFFA", // near-white highlight (rare)
];

const BASE = "#1A1C20"; // deep indigo-black

type Particle = {
  side: number; // -1 = enters from left, +1 = enters from right
  a: number; // angle around centre
  r: number; // radius from centre
  spin: number; // angular speed (rad / frame)
  pull: number; // easing toward the ring radius
  wob: number; // radial wobble amplitude
  wobPhase: number;
  wobSpeed: number;
  life: number;
  maxLife: number;
  color: string;
  width: number;
  x: number;
  y: number;
  px: number;
  py: number;
};

/**
 * Animated "video" background: two streams of glowing particles pour in from
 * the left and right edges, spiral toward the centre and wind onto a central
 * ring — building a luminous sphere with a violet core. Canvas 2D, DPR-aware,
 * additive glow with motion-blur trails. Respects prefers-reduced-motion.
 * Sizes to its parent — give the parent `position: relative`.
 */
export function CirculatingLines({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let R = 0; // target ring radius
    let maxR = 0; // spawn radius (off the edges)
    let ySquash = 0.82; // vertical squash → ring reads as a tilted sphere
    let raf = 0;
    let t = 0;
    const parts: Particle[] = [];

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    // Bias colour pick toward the front of the list (violets) so cyan / white
    // stay as occasional sparks.
    const pickColor = () => {
      const u = Math.random();
      const i = Math.floor(u * u * COLORS.length); // squared → front-weighted
      return COLORS[Math.min(i, COLORS.length - 1)];
    };

    const spawn = (p?: Particle): Particle => {
      const side = Math.random() < 0.5 ? 1 : -1;
      // Right stream enters near angle 0, left stream near π — a narrow band so
      // the two arrivals read as distinct horizontal "tails".
      const base = side > 0 ? 0 : Math.PI;
      const a = base + rnd(-0.5, 0.5);
      const r = maxR * rnd(0.78, 1.06);
      const out: Particle = {
        side,
        a,
        r,
        spin: rnd(0.0055, 0.0115), // all CCW → coherent swirl into the ring
        pull: rnd(0.009, 0.018),
        wob: rnd(6, 22),
        wobPhase: rnd(0, Math.PI * 2),
        wobSpeed: rnd(0.5, 1.1),
        life: 0,
        maxLife: rnd(240, 460),
        color: pickColor(),
        width: rnd(0.8, 2.2),
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r * ySquash,
        px: 0,
        py: 0,
      };
      out.px = out.x;
      out.py = out.y;
      if (p) return Object.assign(p, out);
      return out;
    };

    // Fade-in over the first slice of life, fade-out over the last slice, so
    // particles never pop in/out at the edges.
    const env = (life: number, maxLife: number) => {
      const u = life / maxLife;
      const fin = Math.min(1, u / 0.14);
      const fout = Math.min(1, (1 - u) / 0.28);
      return Math.max(0, Math.min(fin, fout));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const parent = canvas.parentElement;
      const rect = parent
        ? parent.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      cx = w / 2;
      cy = h / 2;
      R = Math.min(w, h) * 0.27;
      maxR = Math.hypot(w, h) * 0.62;
      ySquash = h > w ? 0.92 : 0.8;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = BASE;
      ctx.fillRect(0, 0, w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const N = reduce ? 120 : 240;
    for (let i = 0; i < N; i++) {
      const p = spawn();
      p.life = rnd(0, p.maxLife); // stagger so the field starts already full
      parts.push(p);
    }

    const drawCoreGlow = () => {
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 1;
      // Soft violet core
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.7);
      g.addColorStop(0, "rgba(132, 94, 247, 0.22)");
      g.addColorStop(0.45, "rgba(58, 70, 240, 0.10)");
      g.addColorStop(1, "rgba(26, 28, 32, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // Tiny bright nucleus
      const c = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.5);
      c.addColorStop(0, "rgba(196, 170, 255, 0.18)");
      c.addColorStop(1, "rgba(120, 90, 230, 0)");
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, w, h);
    };

    const drawFrame = () => {
      // Fade previous frame slightly → motion-blur trails turn the moving dots
      // into flowing lines.
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(26, 28, 32, 0.10)";
      ctx.fillRect(0, 0, w, h);

      drawCoreGlow();

      // Additive glowing strokes for the streams + ring.
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (const p of parts) {
        p.px = p.x;
        p.py = p.y;

        p.life += 1;
        p.a += p.spin * (1 + 0.22 * Math.sin(t * 0.5 + p.wobPhase));
        p.r += (R - p.r) * p.pull; // ease inward onto the ring, then orbit it

        const wob =
          Math.sin(t * p.wobSpeed + p.wobPhase + p.a) *
          p.wob *
          (p.r / maxR + 0.12);
        const rr = p.r + wob;
        p.x = cx + Math.cos(p.a) * rr;
        p.y = cy + Math.sin(p.a) * rr * ySquash;

        const e = env(p.life, p.maxLife);
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = 0.5 * e;
        ctx.lineWidth = p.width;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (p.life >= p.maxLife) spawn(p);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      t += 0.016;
      drawFrame();
      raf = requestAnimationFrame(tick);
    };

    let io: IntersectionObserver | null = null;
    let onVis: (() => void) | null = null;

    if (reduce) {
      // Static single pass so there's still a luminous orb, no animation.
      for (let i = 0; i < 240; i++) {
        t += 0.05;
        drawFrame();
      }
    } else {
      let visible = true;
      let pageVisible = true;
      const start = () => {
        if (!raf) raf = requestAnimationFrame(tick);
      };
      const stop = () => {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };
      const sync = () => (visible && pageVisible ? start() : stop());
      // Pause the loop whenever the canvas is off-screen or the tab is hidden.
      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          sync();
        },
        { threshold: 0 },
      );
      io.observe(canvas);
      onVis = () => {
        pageVisible = document.visibilityState === "visible";
        sync();
      };
      document.addEventListener("visibilitychange", onVis);
      sync();
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      io?.disconnect();
      if (onVis) document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
