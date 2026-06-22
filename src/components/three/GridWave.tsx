"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type GridWaveProps = {
  density?: number;
  scale?: number;
  position?: [number, number, number];
  accentMix?: number;
  className?: string;
};

/**
 * A perspective-tilted wireframe plane whose vertices ripple in waves —
 * faster and taller where the cursor is, calmer elsewhere. Themed in slate
 * lines with rust hotspots where the wave peaks. Reads like a blueprint or
 * a topo map for the systems we ship.
 *
 * Used as the `/work` page hero scene.
 */
export function GridWave({
  density = 1,
  scale = 1,
  position = [0, 0, 0],
  accentMix = 0.5,
  className = "",
}: GridWaveProps) {
  const [colors, setColors] = useState<{ fg: string; accent: string } | null>(
    null
  );
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setColors({
      fg: (cs.getPropertyValue("--fg") || "#1e1a2a").trim(),
      accent: (cs.getPropertyValue("--accent") || "#845EF7").trim(),
    });
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!colors) return <div className={className} aria-hidden />;

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 1.6, 4.5], fov: 50 }}
        style={{ pointerEvents: "none" }}
      >
        <Plane
          density={density}
          scale={scale}
          position={position}
          accentMix={accentMix}
          reduced={reduced}
          fg={colors.fg}
          accent={colors.accent}
        />
      </Canvas>
    </div>
  );
}

function Plane({
  density,
  scale,
  position,
  accentMix,
  reduced,
  fg,
  accent,
}: {
  density: number;
  scale: number;
  position: [number, number, number];
  accentMix: number;
  reduced: boolean;
  fg: string;
  accent: string;
}) {
  const mesh = useRef<THREE.LineSegments>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const segs = Math.max(20, Math.floor(34 * density));
  const size = 7;

  const { geometry, basePositions, colors } = useMemo(() => {
    const cFg = new THREE.Color(fg);
    const cAcc = new THREE.Color(accent);

    // Build grid vertices
    const verts: number[] = [];
    for (let z = 0; z <= segs; z++) {
      for (let x = 0; x <= segs; x++) {
        verts.push(
          (x / segs - 0.5) * size,
          0,
          (z / segs - 0.5) * size
        );
      }
    }
    const base = new Float32Array(verts);

    // Build line indices (horizontal + vertical strands)
    const idx: number[] = [];
    for (let z = 0; z <= segs; z++) {
      for (let x = 0; x < segs; x++) {
        const i = z * (segs + 1) + x;
        idx.push(i, i + 1);
      }
    }
    for (let x = 0; x <= segs; x++) {
      for (let z = 0; z < segs; z++) {
        const i = z * (segs + 1) + x;
        idx.push(i, i + (segs + 1));
      }
    }

    // Build line-vertex positions buffer (2 verts per segment)
    const linePos = new Float32Array(idx.length * 3);
    const lineCol = new Float32Array(idx.length * 3);
    for (let k = 0; k < idx.length; k++) {
      const p = idx[k] * 3;
      linePos[k * 3] = base[p];
      linePos[k * 3 + 1] = base[p + 1];
      linePos[k * 3 + 2] = base[p + 2];
      // Color tint by distance from center -> rust at center, slate at edges
      const d = Math.hypot(base[p], base[p + 2]) / (size * 0.5);
      const tint = Math.max(0, 1 - d) * accentMix;
      const c = cFg.clone().lerp(cAcc, tint);
      lineCol[k * 3] = c.r;
      lineCol[k * 3 + 1] = c.g;
      lineCol[k * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
    return { geometry: g, basePositions: linePos.slice(), colors: lineCol };
  }, [segs, accentMix, fg, accent]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.elapsedTime;
    const posAttr = m.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const mx = reduced ? 0 : mouse.current.x * 3.5;
    const mz = reduced ? 0 : -mouse.current.y * 2.5;
    for (let i = 0; i < arr.length; i += 3) {
      const x = basePositions[i];
      const z = basePositions[i + 2];
      const r = Math.hypot(x - mx, z - mz);
      const wave = Math.sin(r * 1.5 - t * (reduced ? 0 : 2.2));
      const localAmp = Math.exp(-r * 0.55) * 0.55;
      const globalAmp = Math.sin(x * 0.7 + t * 0.6) * Math.cos(z * 0.6 - t * 0.4) * 0.15;
      arr[i + 1] = wave * localAmp + (reduced ? 0 : globalAmp);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group position={position} scale={scale}>
      {/* slight forward tilt — like a blueprint laid on a desk */}
      <group rotation={[-0.55, 0, 0]}>
        <lineSegments ref={mesh} geometry={geometry}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.72}
            depthWrite={false}
          />
        </lineSegments>
      </group>
    </group>
  );
}
