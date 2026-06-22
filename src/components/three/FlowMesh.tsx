"use client";
/* eslint-disable react-hooks/refs */

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type FlowMeshProps = {
  density?: number;
  scale?: number;
  position?: [number, number, number];
  accentMix?: number;
  className?: string;
};

/**
 * Flowing ribbon mesh — three layered parametric ribbons twist through
 * 3D space along a curving path, rendered as cross-rib wireframes with
 * additive blending so they glow against the dark purple backdrop. A
 * field of luminous particle sparks drifts around them. Cursor parallax
 * adds responsiveness without making the camera feel jumpy.
 */
export function FlowMesh({
  density = 1,
  scale = 1,
  position = [0, 0, 0],
  className = "",
}: FlowMeshProps) {
  const [colors, setColors] = useState<{
    light: string;
    mid: string;
    deep: string;
  } | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setColors({
      // Muted teals on warm cream surfaces. Additive bloom would wash
      // these out so we use normal blending with the dark half of the
      // accent range — the ribbon stays visible.
      light: (cs.getPropertyValue("--accent") || "#845EF7").trim(),
      mid: (cs.getPropertyValue("--accent-deep") || "#3A46F0").trim(),
      deep: "#26292E", // deepest slate for the back layer
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
        camera={{ position: [0, 0, 9], fov: 52 }}
        style={{ pointerEvents: "none" }}
      >
        {/* Three ribbons at different phases / twist multipliers — depth
            without redundancy. */}
        <Ribbon
          density={density}
          scale={scale}
          position={position}
          reduced={reduced}
          color={colors.light}
          phase={0}
          opacity={0.85}
          twistMul={1.0}
          freqMul={1.0}
          radius={1.7}
          withLights
          lightColor="#845EF7"
          lightCount={Math.max(18, Math.floor(28 * density))}
        />
        <Ribbon
          density={density}
          scale={scale}
          position={position}
          reduced={reduced}
          color={colors.mid}
          phase={1.7}
          opacity={0.75}
          twistMul={1.3}
          freqMul={0.85}
          radius={1.35}
          withLights
          lightColor="#A99BF5"
          lightCount={Math.max(12, Math.floor(18 * density))}
        />
        <Ribbon
          density={density}
          scale={scale}
          position={position}
          reduced={reduced}
          color={colors.deep}
          phase={3.4}
          opacity={0.6}
          twistMul={0.75}
          freqMul={1.2}
          radius={2.05}
        />
        <Particles
          color={colors.light}
          count={Math.floor(80 * density)}
          reduced={reduced}
        />
      </Canvas>
    </div>
  );
}

/* ─── Ribbon ──────────────────────────────────────────────────────────── */

function Ribbon({
  density,
  scale,
  position,
  reduced,
  color,
  phase,
  opacity,
  twistMul,
  freqMul,
  radius,
  withLights = false,
  lightColor = "#845EF7",
  lightCount = 24,
}: {
  density: number;
  scale: number;
  position: [number, number, number];
  reduced: boolean;
  color: string;
  phase: number;
  opacity: number;
  twistMul: number;
  freqMul: number;
  radius: number;
  withLights?: boolean;
  lightColor?: string;
  lightCount?: number;
}) {
  // NU = length subdivisions, NV = cross-rib count. NU scales with
  // density; NV stays fixed (the cross-rib density is what gives the
  // "data fabric" look — more isn't better past ~10).
  const NU = Math.max(40, Math.floor(80 * density));
  const NV = 10;

  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { geom, positions } = useMemo(() => {
    const positions = new Float32Array(NU * NV * 3);
    const indexArray: number[] = [];

    // Cross-rib lines (perpendicular to flow) — the dominant pattern.
    for (let u = 0; u < NU; u++) {
      for (let v = 0; v < NV - 1; v++) {
        indexArray.push(u * NV + v, u * NV + (v + 1));
      }
    }
    // Sparse longitudinal stays (every 3rd v) — adds mesh structure
    // without making the ribbon read as a dense grid.
    for (let v = 0; v < NV; v += 3) {
      for (let u = 0; u < NU - 1; u++) {
        indexArray.push(u * NV + v, (u + 1) * NV + v);
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setIndex(indexArray);

    return { geom: g, positions };
  }, [NU, NV]);

  // Lights geometry — bright dots embedded in the ribbon that ride its
  // motion. Sampled from specific (u, v) coords on the ribbon, then
  // updated each frame to match the ribbon's current positions. Two
  // tracks (mid-line + alternating edges) so the lights look intentional
  // rather than evenly distributed.
  const lightsInfo = useMemo(() => {
    if (!withLights) return null;
    const positions = new Float32Array(lightCount * 3);
    // Sample (u, v) pairs along the ribbon. Walking U in even steps;
    // alternating between mid-line (v=NV/2) and the two edges so the
    // lights read as a row of LEDs with a few outliers on the rails.
    const samples: { u: number; v: number }[] = [];
    const midV = Math.floor(NV / 2);
    for (let i = 0; i < lightCount; i++) {
      const u = Math.floor((i + 0.5) * (NU / lightCount));
      const v = i % 4 === 0 ? 1 : i % 4 === 2 ? NV - 2 : midV;
      samples.push({ u: Math.min(NU - 1, u), v });
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geom: g, positions, samples };
  }, [withLights, lightCount, NU, NV]);

  const lightsMatRef = useRef<THREE.PointsMaterial>(null);

  // Window-level cursor tracking so the canvas can stay pointer-none and
  // not interfere with text selection / clicks.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    const t = reduced ? phase : clock.elapsedTime + phase;

    // Parametric ribbon — for each U we compute a path point (px,py,pz),
    // a twist angle, and a width scale; then for each V we offset across
    // the ribbon's plane (rotated by the twist).
    for (let u = 0; u < NU; u++) {
      const tu = u / (NU - 1);
      const tu_c = tu - 0.5;

      const px = tu_c * 13;
      const py = Math.sin(tu_c * Math.PI * 1.8 * freqMul + t * 0.32) * 2.4;
      const pz = Math.cos(tu_c * Math.PI * 2.2 * freqMul + t * 0.24) * 1.8;

      const twistAngle = tu_c * Math.PI * 2.5 * twistMul + t * 0.42;
      const widthScale =
        radius + Math.sin(tu_c * Math.PI * 2 + t * 0.22) * 0.45;

      const cosT = Math.cos(twistAngle);
      const sinT = Math.sin(twistAngle);

      for (let v = 0; v < NV; v++) {
        const tv = v / (NV - 1);
        const tv_c = tv - 0.5;
        const offset = tv_c * widthScale;

        const idx = (u * NV + v) * 3;
        positions[idx] = px;
        positions[idx + 1] = py + offset * cosT;
        positions[idx + 2] = pz + offset * sinT;
      }
    }
    geom.attributes.position.needsUpdate = true;

    // Sample the just-updated ribbon positions into the lights buffer so
    // each light sits exactly on the ribbon surface.
    if (lightsInfo) {
      const { samples, positions: lpos, geom: lgeom } = lightsInfo;
      for (let i = 0; i < samples.length; i++) {
        const s = samples[i];
        const idx = (s.u * NV + s.v) * 3;
        lpos[i * 3] = positions[idx];
        lpos[i * 3 + 1] = positions[idx + 1];
        lpos[i * 3 + 2] = positions[idx + 2];
      }
      lgeom.attributes.position.needsUpdate = true;
      // Subtle group breathing — all lights pulse together. Gives the
      // "live indicator" rhythm without per-light shader complexity.
      if (lightsMatRef.current) {
        lightsMatRef.current.opacity = reduced
          ? 0.9
          : 0.78 + Math.sin(t * 1.9) * 0.18;
      }
    }

    // Subtle cursor parallax — group leans toward the cursor.
    if (groupRef.current && !reduced) {
      const targetX = -mouse.current.y * 0.12;
      const targetY = mouse.current.x * 0.18;
      groupRef.current.rotation.x +=
        (targetX - groupRef.current.rotation.x) * 0.04;
      groupRef.current.rotation.y +=
        (targetY - groupRef.current.rotation.y) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <lineSegments geometry={geom}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </lineSegments>
      {lightsInfo && (
        <points geometry={lightsInfo.geom}>
          <pointsMaterial
            ref={lightsMatRef}
            color={lightColor}
            size={0.085}
            sizeAttenuation
            transparent
            opacity={0.9}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </points>
      )}
    </group>
  );
}

/* ─── Particle sparks ─────────────────────────────────────────────────── */

function Particles({
  color,
  count,
  reduced,
}: {
  color: string;
  count: number;
  reduced: boolean;
}) {
  const { geom, positions, basePositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 4;
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geom: g, positions, basePositions };
  }, [count]);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = basePositions[i * 3] + Math.sin(t * 0.4 + i * 1.7) * 0.15;
      positions[i * 3 + 1] =
        basePositions[i * 3 + 1] + Math.sin(t * 0.5 + i) * 0.13;
      positions[i * 3 + 2] =
        basePositions[i * 3 + 2] + Math.cos(t * 0.45 + i * 1.3) * 0.1;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={geom}>
      <pointsMaterial
        color={color}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
