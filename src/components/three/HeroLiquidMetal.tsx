"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * HeroLiquidMetal — flowing chrome torus-knot form for the hero right
 * column. Inspired by the Orbsite "liquid metal" hero: heavy metalness +
 * studio IBL produces the chrome-with-reflections look, and a sage sheen
 * tint plus a warm-amber rim light keep it inside the brand palette
 * instead of reading as plain silver.
 *
 *   Form        : TorusKnotGeometry (p=2, q=3) — a classic two-loop knot
 *                 that reads as a continuous curling ribbon
 *   Material    : meshPhysicalMaterial, metalness 1, low roughness,
 *                 clearcoat 1, sage sheen
 *   Motion      : slow Y-rotation + sine-modulated X/Z drift + Float
 *                 wrapper for ambient bob. `reduced` freezes it all.
 *   Lighting    : neutral key + warm amber rim + sage fill + studio env
 *   Atmosphere  : alpha canvas + fog matched to bg so the back of the
 *                 form fades into the cream surface.
 * ──────────────────────────────────────────────────────────────────────── */

interface HeroLiquidMetalProps {
  reduced?: boolean;
}

export function HeroLiquidMetal({ reduced = false }: HeroLiquidMetalProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 42 }}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      {/* Soft fog matched to bg — back of the form fades into cream */}
      <fog attach="fog" args={["#f4e9d5", 6, 12]} />

      {/* Bright key + warm fill + sage rim — gives the chrome a luminous,
          airy feel instead of heavy contrast. */}
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 5, 5]} intensity={1.6} color="#ffffff" />
      <directionalLight
        position={[-3, 2, 4]}
        intensity={0.8}
        color="#fff5e5"
      />
      <directionalLight
        position={[-2, -3, 3]}
        intensity={0.5}
        color="#8CA0B3"
      />
      <pointLight position={[2, 0, 4]} intensity={0.4} color="#8CA0B3" />

      {/* `studio` preset is the brightest of the Drei built-ins — required
          for the lift-from-the-shadows chrome look. */}
      <Environment preset="studio" />

      <ChromeForm reduced={reduced} />
    </Canvas>
  );
}

function ChromeForm({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current || reduced) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.2;
    ref.current.rotation.x = Math.sin(t * 0.35) * 0.18 + 0.3;
    ref.current.rotation.z = Math.cos(t * 0.28) * 0.1 + 0.5;
  });

  return (
    <Float
      speed={reduced ? 0 : 1}
      rotationIntensity={reduced ? 0 : 0.2}
      floatIntensity={reduced ? 0 : 0.5}
      floatingRange={[-0.18, 0.18]}
    >
      {/* Tilted so the knot's longest visual axis runs diagonally — gives
          the form a vertical spiral feel and lets it bleed off the top
          and bottom edges of the canvas. */}
      <mesh
        ref={ref}
        scale={1.7}
        rotation={[0.3, 0, 0.5]}
        position={[0.3, 0, 0]}
      >
        {/* args: radius, tube, tubularSegments, radialSegments, p, q */}
        <torusKnotGeometry args={[1.15, 0.4, 256, 32, 2, 3]} />
        <meshPhysicalMaterial
          color="#f4efe2"
          metalness={1}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={2.2}
          sheen={0.5}
          sheenColor={new THREE.Color("#8CA0B3")}
          sheenRoughness={0.3}
        />
      </mesh>
    </Float>
  );
}
