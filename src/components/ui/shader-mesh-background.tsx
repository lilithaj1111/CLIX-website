"use client";

import { MeshGradient } from "@paper-design/shaders-react";

/* ────────────────────────────────────────────────────────────────────────────
 * ShaderMeshBackground — animated WebGL mesh-gradient backdrop.
 *
 * Adapted from the Paper Shaders hero (kept the layered MeshGradients only,
 * dropped the header / nav / badge / pulsing-border). Recolored from the
 * source's black + cyan/orange to the Clix palette: soft blue (--accent-2 /
 * --accent-soft) and soft lime, washed over cream so dark hero text stays
 * readable. A second, slower, more-distorted layer adds depth and motion.
 *
 * NOTE: this build of @paper-design/shaders-react (0.0.76) exposes only
 * `colors` / `speed` / `distortion` / `swirl` (no `backgroundColor` /
 * `wireframe` — those would leak onto the DOM). The base colour is set on the
 * wrapper instead.
 *
 * Decorative only — aria-hidden, pointer-events none. Drop into a positioned
 * container with `absolute inset-0` and it fills the box.
 * ──────────────────────────────────────────────────────────────────────── */

export function ShaderMeshBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ backgroundColor: "#F7F9FC" }}
    >
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-90"
        colors={["#F2F6FD", "#BFD3FB", "#7FA9F7", "#D4F58A", "#A3E635"]}
        speed={0.3}
        distortion={0.8}
        swirl={0.5}
      />
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-40"
        colors={["#F7F9FC", "#DDE9FE", "#9DC0FA", "#CBF08C"]}
        speed={0.2}
        distortion={1}
        swirl={0.25}
      />
    </div>
  );
}

export default ShaderMeshBackground;
