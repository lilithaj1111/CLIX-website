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
      style={{ backgroundColor: "#F3F1FB" }}
    >
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-90"
        colors={["#F3F1FB", "#A99BF5", "#A99BF5", "#845EF7", "#A99BF5"]}
        speed={0.3}
        distortion={0.8}
        swirl={0.5}
      />
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-40"
        colors={["#F3F1FB", "#E6E3F4", "#A99BF5", "#845EF7"]}
        speed={0.2}
        distortion={1}
        swirl={0.25}
      />
    </div>
  );
}

export default ShaderMeshBackground;
