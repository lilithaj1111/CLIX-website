"use client";

import { useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────────────────────────
 * ParticleWaveBackground — canvas recreation of the HomeFlow-style flowing
 * wave, recoloured to the Clix palette (accent blue + soft lime) and kept on
 * the baby-blue surface.
 *
 * Layers, back → front:
 *   1. Soft flowing light ribbon (silk streak) through the upper-middle.
 *   2. Several stacked wave "dunes" — filled gradients for depth, each with a
 *      glowing rim-light stroke along its crest.
 *   3. A dense particle texture hugging each crest, thinning downward.
 *   4. Large faint bokeh dots floating throughout.
 * Small particles + ribbon + bokeh drift continuously; freezes for
 * prefers-reduced-motion. Decorative — aria-hidden.
 * ──────────────────────────────────────────────────────────────────────── */

const LAYERS = 4;

export function ParticleWaveBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    let w = 0;
    let h = 0;
    let raf = 0;
    const start = performance.now();

    type Dot = {
      x: number;
      layer: number;
      depth: number;
      size: number;
      mix: number;
      alpha: number;
      drift: number;
      seed: number;
    };
    type Bokeh = {
      x: number;
      y: number;
      r: number;
      mix: number;
      alpha: number;
      drift: number;
      seed: number;
    };
    let dots: Dot[] = [];
    let bokeh: Bokeh[] = [];

    const col = (mix: number, a: number) => {
      const r = Math.round(140 + (169 - 140) * mix);
      const g = Math.round(160 + (189 - 160) * mix);
      const b = Math.round(179 + (208 - 179) * mix);
      return `rgba(${r},${g},${b},${a})`;
    };

    function build() {
      dots = [];
      const perLayer = Math.min(130, Math.floor(w / 11));
      for (let layer = 0; layer < LAYERS; layer++) {
        for (let i = 0; i < perLayer; i++) {
          dots.push({
            x: Math.random() * w,
            layer,
            depth: Math.pow(Math.random(), 1.7), // denser near the crest
            size: rnd(0.5, 2.1),
            mix: Math.random() < 0.27 ? rnd(0.55, 1) : rnd(0, 0.18),
            alpha: rnd(0.3, 0.85),
            drift: rnd(0.3, 1),
            seed: Math.random() * 1000,
          });
        }
      }
      bokeh = [];
      const bn = Math.min(16, Math.floor(w / 110));
      for (let i = 0; i < bn; i++) {
        bokeh.push({
          x: Math.random() * w,
          y: rnd(h * 0.28, h * 0.96),
          r: rnd(8, 26),
          mix: Math.random() < 0.34 ? rnd(0.5, 1) : rnd(0, 0.2),
          alpha: rnd(0.05, 0.16),
          drift: rnd(0.2, 0.7),
          seed: Math.random() * 1000,
        });
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent!.clientWidth;
      h = parent!.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function crestY(layer: number, x: number, t: number) {
      const base = h * (0.46 + layer * 0.135);
      const ph = layer * 1.3 + t * (0.06 + layer * 0.035);
      return (
        base +
        Math.sin(x * (0.001 + layer * 0.00035) + ph) * (h * 0.055) +
        Math.sin(x * 0.0026 + ph * 1.6) * (h * 0.022)
      );
    }

    function ribbonY(x: number, t: number) {
      return (
        h * 0.34 +
        Math.sin(x * 0.0016 + t * 0.12) * (h * 0.05) +
        Math.sin(x * 0.004 + t * 0.2) * (h * 0.018)
      );
    }

    function draw(now: number) {
      const t = reduce ? 0 : (now - start) / 1000;
      ctx!.clearRect(0, 0, w, h);

      // 1 — flowing light ribbon
      ctx!.beginPath();
      for (let x = 0; x <= w; x += 12) {
        const y = ribbonY(x, t);
        if (x === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.lineCap = "round";
      ctx!.lineWidth = 26;
      ctx!.strokeStyle = "rgba(169,189,208,0.10)";
      ctx!.shadowColor = "rgba(140,160,179,0.55)";
      ctx!.shadowBlur = 30;
      ctx!.stroke();
      ctx!.shadowBlur = 0;

      // 2 — stacked wave dunes + rim light
      for (let layer = 0; layer < LAYERS; layer++) {
        ctx!.beginPath();
        ctx!.moveTo(0, h);
        for (let x = 0; x <= w; x += 14) ctx!.lineTo(x, crestY(layer, x, t));
        ctx!.lineTo(w, h);
        ctx!.closePath();
        const tone = 0.1 + layer * 0.045;
        const g = ctx!.createLinearGradient(0, crestY(layer, w / 2, t) - 24, 0, h);
        g.addColorStop(0, `rgba(140,160,179,${tone})`);
        g.addColorStop(1, `rgba(61,74,89,${tone * 0.4})`);
        ctx!.fillStyle = g;
        ctx!.fill();
        if (layer === 1) {
          ctx!.fillStyle = "rgba(140,160,179,0.045)";
          ctx!.fill();
        }

        ctx!.beginPath();
        for (let x = 0; x <= w; x += 10) {
          const y = crestY(layer, x, t);
          if (x === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.lineWidth = 1.4;
        ctx!.strokeStyle = `rgba(231,234,238,${0.55 - layer * 0.09})`;
        ctx!.shadowColor = "rgba(140,160,179,0.9)";
        ctx!.shadowBlur = 14 - layer * 2;
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      }

      // 3 — particle texture hugging the crests
      for (const d of dots) {
        const float = reduce ? 0 : Math.sin(d.seed + t * d.drift) * 5;
        const y = crestY(d.layer, d.x, t) + d.depth * h * 0.18 + float;
        ctx!.beginPath();
        ctx!.fillStyle = col(d.mix, d.alpha * (1 - d.depth * 0.7));
        ctx!.arc(d.x, y, d.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      // 4 — floating bokeh
      for (const bk of bokeh) {
        const float = reduce ? 0 : Math.sin(bk.seed + t * bk.drift) * 10;
        ctx!.beginPath();
        ctx!.fillStyle = col(bk.mix, bk.alpha);
        ctx!.arc(bk.x, bk.y + float, bk.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    }

    resize();
    if (reduce) draw(performance.now());
    else raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

export default ParticleWaveBackground;
