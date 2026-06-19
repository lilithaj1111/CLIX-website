"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * HeroBackdrop — clean 3D hero canvas. Three floating low-poly wireframe
 * icosahedrons at varied scales and depths, plus a sparse drifting dust
 * field. Sage-tinted at low opacity so it reads as quiet ambient depth
 * rather than a competing visual. Fog matches the page bg so distant
 * geometry fades into the surface — gives the canvas real depth without
 * a hard horizon line.
 *
 * Sized to fit the hero's full bleed; positioned absolutely by the caller.
 * Pointer events off so it never intercepts hover/click on text or CTAs.
 * ──────────────────────────────────────────────────────────────────────── */

interface HeroBackdropProps {
  /** Set true when the user prefers reduced motion — freezes all drift. */
  reduced?: boolean;
}

export function HeroBackdrop({ reduced = false }: HeroBackdropProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      {/* Fog blends distant geometry into the cream page surface — fakes
          depth-of-field without postprocessing. */}
      <fog attach="fog" args={["#fafaf4", 6, 14]} />
      <ambientLight intensity={0.7} />

      {/* Hero icosahedron — large, centered behind the headline. Detail 3
          gives ~80 line segments; subtle but visible at full scale. */}
      <Float
        speed={reduced ? 0 : 0.9}
        rotationIntensity={0.25}
        floatIntensity={0.45}
      >
        <WireIco position={[0, 0, 0]} scale={2.6} detail={3} opacity={0.22} />
      </Float>

      {/* Companion shapes — smaller, offset, deeper into the scene. They
          parallax visually because of fog falloff and different scales. */}
      <Float
        speed={reduced ? 0 : 1.1}
        rotationIntensity={0.4}
        floatIntensity={0.55}
      >
        <WireIco
          position={[3.8, 1.3, -2.2]}
          scale={0.85}
          detail={1}
          opacity={0.32}
        />
      </Float>
      <Float
        speed={reduced ? 0 : 1}
        rotationIntensity={0.35}
        floatIntensity={0.5}
      >
        <WireIco
          position={[-4.2, -1.7, -1.6]}
          scale={1.15}
          detail={2}
          opacity={0.26}
        />
      </Float>
      <Float
        speed={reduced ? 0 : 1.3}
        rotationIntensity={0.5}
        floatIntensity={0.7}
      >
        <WireIco
          position={[-2.8, 2.4, -3]}
          scale={0.5}
          detail={1}
          opacity={0.4}
        />
      </Float>
      <Float
        speed={reduced ? 0 : 0.85}
        rotationIntensity={0.3}
        floatIntensity={0.5}
      >
        <WireIco
          position={[3, -2.3, -2.6]}
          scale={0.6}
          detail={1}
          opacity={0.34}
        />
      </Float>

      <DriftingDust count={90} reduced={reduced} />
    </Canvas>
  );
}

/* ─── Wireframe icosahedron — single primitive ─────────────────────────── */

function WireIco({
  position,
  scale,
  detail,
  opacity,
}: {
  position: [number, number, number];
  scale: number;
  detail: number;
  opacity: number;
}) {
  const ref = useRef<THREE.LineSegments>(null);

  // EdgesGeometry from an icosahedron gives sharp triangle outlines without
  // the diagonal lines a wireframe material adds. Cleaner look.
  const geom = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1, detail);
    return new THREE.EdgesGeometry(ico, 1);
  }, [detail]);

  // Slow continuous rotation. Each instance rotates a touch differently so
  // the trio never feels synchronized.
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.04 + position[0] * 0.1;
    ref.current.rotation.y = t * 0.05 + position[1] * 0.1;
  });

  return (
    <lineSegments
      ref={ref}
      geometry={geom}
      position={position}
      scale={scale}
    >
      <lineBasicMaterial
        color="#8CA0B3"
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* ─── Drifting dust — sparse particle field for ambient depth ──────────── */

function DriftingDust({
  count,
  reduced,
}: {
  count: number;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    return arr;
  }, [count]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        color="#8CA0B3"
        size={0.038}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}
