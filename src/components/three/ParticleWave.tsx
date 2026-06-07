"use client";
/* eslint-disable react-hooks/refs */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type ParticleWaveProps = {
  density?: number;
  scale?: number;
  position?: [number, number, number];
  accentMix?: number;
  className?: string;
};

/**
 * Dense field of points laid out on a grid; each point's height is the
 * sum of a few sines driven by world position + time, so the field reads
 * as an undulating wave surface. Higher peaks brighten toward lavender;
 * troughs sit in the deep accent purple. Designed to live inside a
 * contained dark plum panel beside the hero text on /services.
 */
export function ParticleWave({
  density = 1,
  scale = 1,
  position = [0, 0, 0],
  accentMix = 0.7,
  className = "",
}: ParticleWaveProps) {
  const [colors, setColors] = useState<{
    accent: string;
    accentDeep: string;
    bg: string;
  } | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setColors({
      accent: (cs.getPropertyValue("--accent") || "#547A95").trim(),
      accentDeep: (cs.getPropertyValue("--accent-deep") || "#2C3947").trim(),
      bg: (cs.getPropertyValue("--bg") || "#f4e9d5").trim(),
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
        camera={{ position: [0, 1.7, 4.2], fov: 52 }}
        style={{ pointerEvents: "none" }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0, 0);
        }}
      >
        {/* Fog tinted to the page bg so far points dissolve into the cream
            surface rather than being clipped or piling up on the horizon. */}
        <fog attach="fog" args={[colors.bg, 3.2, 7.5]} />
        <CameraDrift reduced={reduced} />
        <Wave
          density={density}
          scale={scale}
          position={position}
          accentMix={accentMix}
          reduced={reduced}
          accent={colors.accent}
          accentDeep={colors.accentDeep}
          bg={colors.bg}
        />
      </Canvas>
    </div>
  );
}

/* ─── Camera drift ─────────────────────────────────────────────────────── */

function CameraDrift({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const base = useRef({ z: camera.position.z, y: camera.position.y });
  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.18) * 0.45;
    camera.position.y = base.current.y + Math.cos(t * 0.22) * 0.12;
    camera.position.z = base.current.z + Math.sin(t * 0.3) * 0.2;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Wave field ───────────────────────────────────────────────────────── */

function Wave({
  density,
  scale,
  position,
  accentMix,
  reduced,
  accent,
  accentDeep,
  bg,
}: {
  density: number;
  scale: number;
  position: [number, number, number];
  accentMix: number;
  reduced: boolean;
  accent: string;
  accentDeep: string;
  bg: string;
}) {
  const geomRef = useRef<THREE.BufferGeometry>(null);

  // Grid resolution scales with density. Default ~70×50 = 3500 points.
  const GRID_X = Math.max(40, Math.floor(70 * density));
  const GRID_Z = Math.max(28, Math.floor(50 * density));
  const SPACING_X = 0.11;
  const SPACING_Z = 0.11;
  const COUNT = GRID_X * GRID_Z;

  const { positions, colors: colorBuffer } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colorBuffer = new Float32Array(COUNT * 3);
    const cA1 = new THREE.Color(accent);

    for (let i = 0; i < GRID_X; i++) {
      for (let j = 0; j < GRID_Z; j++) {
        const idx = (i * GRID_Z + j) * 3;
        positions[idx] = (i - GRID_X / 2) * SPACING_X;
        positions[idx + 1] = 0;
        positions[idx + 2] = (j - GRID_Z / 2) * SPACING_Z;

        colorBuffer[idx] = cA1.r;
        colorBuffer[idx + 1] = cA1.g;
        colorBuffer[idx + 2] = cA1.b;
      }
    }
    return { positions, colors: colorBuffer };
  }, [COUNT, GRID_X, GRID_Z, accent]);

  // Reusable color objects to avoid GC churn in the per-frame loop.
  // For cream surfaces we work in the DARKER half of the purple range —
  // additive/white-tinted highlights wash out on cream, so crests get
  // the deepest purple and troughs sit at the regular accent.
  const cBase = useMemo(() => new THREE.Color(accent), [accent]);
  const cHigh = useMemo(() => new THREE.Color(accentDeep), [accentDeep]);
  const cTrough = useMemo(
    () => new THREE.Color(accent).lerp(new THREE.Color("#c8b3d9"), 0.45),
    [accent],
  );
  const cBg = useMemo(() => new THREE.Color(bg), [bg]);
  const cTmp = useMemo(() => new THREE.Color(), []);

  // Distance-from-center falloff so the wave fades toward the panel edges
  // and the dark plum bg shows through. Pre-compute per-point so we don't
  // recompute the sqrt every frame.
  const falloff = useMemo(() => {
    const arr = new Float32Array(COUNT);
    const halfX = (GRID_X / 2) * SPACING_X;
    const halfZ = (GRID_Z / 2) * SPACING_Z;
    const maxDist = Math.sqrt(halfX * halfX + halfZ * halfZ);
    for (let i = 0; i < GRID_X; i++) {
      for (let j = 0; j < GRID_Z; j++) {
        const x = (i - GRID_X / 2) * SPACING_X;
        const z = (j - GRID_Z / 2) * SPACING_Z;
        const d = Math.sqrt(x * x + z * z) / maxDist;
        // Hold full intensity through 60%, then ease to 0 by 100%
        const f =
          d < 0.6 ? 1 : Math.max(0, 1 - (d - 0.6) / 0.4);
        arr[i * GRID_Z + j] = f;
      }
    }
    return arr;
  }, [COUNT, GRID_X, GRID_Z]);

  useFrame(({ clock }) => {
    const geom = geomRef.current;
    if (!geom) return;
    const t = reduced ? 0 : clock.elapsedTime * 0.8;
    const posAttr = geom.attributes.position.array as Float32Array;
    const colorAttr = geom.attributes.color.array as Float32Array;

    for (let i = 0; i < GRID_X; i++) {
      for (let j = 0; j < GRID_Z; j++) {
        const idx = (i * GRID_Z + j) * 3;
        const x = posAttr[idx];
        const z = posAttr[idx + 2];
        // Three layered waves combining to create organic crest patterns.
        const y =
          Math.sin(x * 0.85 + t * 0.7) * 0.34 +
          Math.cos(z * 0.65 + t * 0.55) * 0.27 +
          Math.sin((x + z) * 0.45 + t * 0.42) * 0.18;

        const f = falloff[i * GRID_Z + j];
        posAttr[idx + 1] = y * f;

        // Color: high crests → deepest purple; troughs → soft lavender.
        // We stay in the dark half of the purple range so crests punch on
        // cream — pushing toward white here would dissolve into the bg.
        const norm = (y + 0.8) / 1.6; // 0..1
        if (norm > 0.55) {
          cTmp
            .copy(cBase)
            .lerp(cHigh, Math.min(1, (norm - 0.55) / 0.45) * accentMix);
        } else {
          cTmp.copy(cBase).lerp(cTrough, (0.55 - norm) * 0.6);
        }
        // Edge falloff: lerp the vertex color toward the page bg so
        // particles dissolve into the cream rather than darken. f=1 at
        // center → full purple visible; f=0 at edges → matches bg →
        // invisible.
        colorAttr[idx] = cBg.r + (cTmp.r - cBg.r) * f;
        colorAttr[idx + 1] = cBg.g + (cTmp.g - cBg.g) * f;
        colorAttr[idx + 2] = cBg.b + (cTmp.b - cBg.b) * f;
      }
    }
    geom.attributes.position.needsUpdate = true;
    geom.attributes.color.needsUpdate = true;
  });

  return (
    <points position={position} scale={scale} rotation={[0, 0, 0]}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorBuffer, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
