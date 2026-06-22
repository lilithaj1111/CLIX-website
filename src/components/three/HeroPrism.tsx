"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * HeroPrism — single refractive glass cube floating in the hero. Sage-
 * tinted interior attenuation gives the prism a quiet forest cast instead
 * of a rainbow dichroic (which would clash with the calm palette). Backside
 * rendering + chromatic aberration produce real double-refraction
 * highlights at the edges without dominating the scene. Pointer events
 * off; reduced-motion freezes rotation and float.
 * ──────────────────────────────────────────────────────────────────────── */

interface HeroPrismProps {
  /** Freezes all motion when the user prefers reduced motion. */
  reduced?: boolean;
}

function GlassCube({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current || reduced) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.22;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.12 + 0.4;
  });

  return (
    <Float
      speed={reduced ? 0 : 1.4}
      rotationIntensity={0}
      floatIntensity={0.6}
      floatingRange={[-0.15, 0.15]}
    >
      <mesh ref={ref} rotation={[0.4, 0.35, 0]}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        {/* Iridescent sage glass via meshPhysicalMaterial — more reliable
            than MeshTransmissionMaterial on an alpha canvas where there's
            nothing to refract. Iridescence gives the rainbow-rim feel from
            the H20.AI reference but tuned toward sage/teal sheens instead
            of full-spectrum dichroic. */}
        <meshPhysicalMaterial
          color="#845EF7"
          metalness={0.35}
          roughness={0.08}
          transmission={0.45}
          thickness={1.3}
          ior={1.5}
          attenuationColor="#A99BF5"
          attenuationDistance={1.4}
          clearcoat={1}
          clearcoatRoughness={0.04}
          iridescence={1}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[280, 900]}
          sheen={0.6}
          sheenColor={new THREE.Color("#845EF7")}
          sheenRoughness={0.25}
          envMapIntensity={1.6}
        />
      </mesh>
    </Float>
  );
}

export function HeroPrism({ reduced = false }: HeroPrismProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 36 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      {/* Soft cream ambient + a warm key + a cooler forest rim — gives the
          glass dimensional lighting without over-saturating the sage tint. */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3, 4, 3]}
        intensity={1.6}
        color="#ffffff"
      />
      <directionalLight
        position={[-3, -1, 2]}
        intensity={0.7}
        color="#845EF7"
      />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#fafaf4" />

      {/* `studio` env gives the transmission material real IBL highlights —
          without it the glass looks flat and matte. */}
      <Environment preset="studio" />

      <GlassCube reduced={reduced} />
    </Canvas>
  );
}
