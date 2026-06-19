"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type ClixOrbProps = {
  /** Particle count multiplier (default 1 = ~600 points). */
  density?: number;
  /** Overall scale of the orb. */
  scale?: number;
  /** R3F translation, in world units. */
  position?: [number, number, number];
  /** 0 = pure slate, 1 = pure rust. Default 0.4. */
  accentMix?: number;
  /** Toggle cursor-follow rotation. Default true. */
  interactive?: boolean;
  className?: string;
};

/**
 * A wireframe icosphere-like cluster of particles in slate with rust line
 * segments between near neighbours. Self-rotates slowly, lerps toward the
 * cursor, and pulses gently with scroll. All colors are read from the page
 * tokens (`--fg` / `--accent`) at mount so the scene tracks the theme.
 *
 * Use via `next/dynamic` with `ssr: false`. See `Hero.tsx` / `PageHero.tsx`.
 */
export function ClixOrb({
  density = 1,
  scale = 1,
  position = [0, 0, 0],
  accentMix = 0.4,
  interactive = true,
  className = "",
}: ClixOrbProps) {
  const [colors, setColors] = useState<{
    fg: string;
    accent: string;
  } | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setColors({
      fg: (cs.getPropertyValue("--fg") || "#2C3641").trim(),
      accent: (cs.getPropertyValue("--accent") || "#5C7488").trim(),
    });
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!colors) {
    // Avoid flashing a wrong-color frame before tokens are read.
    return <div className={className} aria-hidden />;
  }

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[4, 4, 4]} intensity={1.1} color={colors.accent} />
        <pointLight position={[-4, -2, 3]} intensity={0.5} color={colors.fg} />
        <Orb
          density={density}
          scale={scale}
          position={position}
          accentMix={accentMix}
          interactive={interactive}
          reduced={reduced}
          fg={colors.fg}
          accent={colors.accent}
        />
      </Canvas>
    </div>
  );
}

type OrbInternalProps = Required<
  Omit<ClixOrbProps, "className">
> & {
  fg: string;
  accent: string;
  reduced: boolean;
};

function Orb({
  density,
  scale,
  position,
  accentMix,
  interactive,
  reduced,
  fg,
  accent,
}: OrbInternalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  // Base rotation that always advances each frame — kept in refs so the
  // cursor parallax can be applied as an additive offset without ever
  // slowing or cancelling the spin. Earth-like: continuous Y axis.
  const baseY = useRef(0);
  const baseX = useRef(0);
  const { size } = useThree();
  const glowMatRef = useRef<THREE.PointsMaterial>(null);
  const bloomMatRef = useRef<THREE.PointsMaterial>(null);

  // Build a fibonacci-sphere of points, then mix in a smaller inner shell
  const { positions, colors, segIndices, litPositions } = useMemo(() => {
    const count = Math.max(120, Math.floor(620 * density));
    const positions = new Float32Array(count * 3);
    const colorArr = new Float32Array(count * 3);
    const points: THREE.Vector3[] = [];
    const litArr: number[] = [];

    const cFg = new THREE.Color(fg);
    const cAcc = new THREE.Color(accent);

    const phi = Math.PI * (Math.sqrt(5) - 1);
    for (let i = 0; i < count; i++) {
      // Mix outer shell (r=1) with inner shell (r=0.55)
      const inner = i % 7 === 0;
      const r = inner ? 0.55 : 1;
      const y = 1 - (i / Math.max(1, count - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y)) * r;
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const yy = y * r;
      positions[i * 3] = x;
      positions[i * 3 + 1] = yy;
      positions[i * 3 + 2] = z;

      // Per-point color tint biased toward accent for some points
      const tint = (Math.sin(i * 12.9898) * 0.5 + 0.5) * accentMix;
      const blended = cFg.clone().lerp(cAcc, tint);
      colorArr[i * 3] = blended.r;
      colorArr[i * 3 + 1] = blended.g;
      colorArr[i * 3 + 2] = blended.b;

      // ~1 in 9 points are picked as "lit" nodes for the accent glow layer.
      // Hash-based selection so the same density picks consistent lights.
      if (Math.floor(Math.abs(Math.sin(i * 78.233) * 9973)) % 9 === 0) {
        litArr.push(x, yy, z);
      }

      points.push(new THREE.Vector3(x, yy, z));
    }

    // Compute line segments between near neighbours (cheap O(N^2))
    const idx: number[] = [];
    const thresh = 0.32; // 3D distance for "neighbour"
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < thresh) {
          idx.push(i, j);
        }
      }
    }

    return {
      positions,
      colors: colorArr,
      segIndices: new Uint32Array(idx),
      litPositions: new Float32Array(litArr),
    };
  }, [density, fg, accent, accentMix]);

  // Build line geometry from indices into the positions buffer
  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const linePositions = new Float32Array(segIndices.length * 3);
    for (let k = 0; k < segIndices.length; k++) {
      const p = segIndices[k] * 3;
      linePositions[k * 3] = positions[p];
      linePositions[k * 3 + 1] = positions[p + 1];
      linePositions[k * 3 + 2] = positions[p + 2];
    }
    g.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return g;
  }, [positions, segIndices]);

  const pointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  // Subset of points that get a bright accent glow.
  const litGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(litPositions, 3));
    return g;
  }, [litPositions]);

  // Soft radial-gradient sprite for the glow points. Without this, the
  // PointsMaterial default sprite is a hard square that reads as "pixel"
  // instead of "light". Generated once at mount.
  const glowSprite = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const r = size / 2;
    const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0.0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
    grad.addColorStop(0.55, "rgba(255,255,255,0.15)");
    grad.addColorStop(1.0, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => {
    return () => {
      glowSprite?.dispose();
    };
  }, [glowSprite]);

  // Track normalized cursor (-0.5 .. 0.5)
  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [interactive]);

  // Track scroll progress (page) for subtle scale pulse
  const scrollT = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      scrollT.current = Math.min(1, Math.max(0, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (!g) return;
    if (reduced) {
      g.rotation.set(0.3, 0.6, 0);
    } else {
      // Continuous Earth-like spin — base rotation always advances every
      // frame regardless of cursor or scroll state. Stored in refs and
      // assigned (not added) to the visible rotation so nothing can
      // accumulate against it.
      baseY.current += dt * 0.08;
      baseX.current += dt * 0.012;

      // Cursor parallax — applied as an additive offset on top of the
      // base spin. When the cursor is centered, offset is zero; off-axis
      // movement tilts the orb subtly without ever halting its rotation.
      const cursorX = interactive ? mouse.current.y * 0.25 : 0;
      const cursorY = interactive ? mouse.current.x * 0.35 : 0;

      g.rotation.x = baseX.current + cursorX;
      g.rotation.y = baseY.current + cursorY;

      // Scroll pulse
      const s = scale * (1 - scrollT.current * 0.18);
      g.scale.setScalar(s);
    }
    // Breathing pulse on the glow + bloom layers (slow, ~14s cycle)
    if (!reduced) {
      const t = state.clock.elapsedTime;
      if (glowMatRef.current) {
        glowMatRef.current.opacity = 0.7 + Math.sin(t * 0.45) * 0.2;
      }
      if (bloomMatRef.current) {
        bloomMatRef.current.opacity = 0.18 + Math.sin(t * 0.45 + 0.4) * 0.08;
      }
    }
  });

  // Slight size-aware tweak to avoid micro-orb on very small viewports
  const pointSize = Math.max(0.018, Math.min(0.032, size.width / 65000 + 0.02));

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <points geometry={pointGeom}>
        <pointsMaterial
          size={pointSize}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color={accent}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </lineSegments>
      {/* Glowing accent nodes — additive-blended sprites with a radial
          gradient map (`glowSprite`) draw a soft round bloom on a subset of
          vertices. Two layers: large soft halo + smaller bright core. Both
          breathe via useFrame so the lights feel alive. */}
      {glowSprite && (
        <>
          <points geometry={litGeom}>
            <pointsMaterial
              ref={bloomMatRef}
              map={glowSprite}
              alphaMap={glowSprite}
              size={pointSize * 10}
              color={accent}
              transparent
              opacity={0.22}
              sizeAttenuation
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
          <points geometry={litGeom}>
            <pointsMaterial
              ref={glowMatRef}
              map={glowSprite}
              alphaMap={glowSprite}
              size={pointSize * 4}
              color={accent}
              transparent
              opacity={0.85}
              sizeAttenuation
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
        </>
      )}
    </group>
  );
}
