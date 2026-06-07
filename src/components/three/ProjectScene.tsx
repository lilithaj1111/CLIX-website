"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Props = {
  /** Per-project accent hex (e.g. project.accent from src/lib/work.ts). */
  color: string;
  className?: string;
};

/**
 * A wireframe knot that drifts in 3D, tinted with the project's accent color.
 * Embedded inside each Work-page case-study panel to make the page feel
 * "alive" instead of showing flat gradient rectangles.
 *
 * Independent of CSS tokens — colors come in as props so each card can have
 * its own hue without rebuilding the canvas.
 */
export function ProjectScene({ color, className = "" }: Props) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 4, 4]} intensity={0.9} color="#ffffff" />
        <Knot color={color} reduced={reduced} />
      </Canvas>
    </div>
  );
}

function Knot({ color, reduced }: { color: string; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  const knotGeom = useMemo(() => new THREE.TorusKnotGeometry(1.05, 0.05, 220, 16, 2, 5), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(knotGeom, 25), [knotGeom]);

  // Particles around it
  const points = useMemo(() => {
    const count = 80;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.6 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    if (reduced) {
      g.rotation.set(0.3, 0.6, 0);
      return;
    }
    g.rotation.x += dt * 0.2;
    g.rotation.y += dt * 0.35;
  });

  return (
    <group ref={group}>
      <mesh geometry={knotGeom}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.35}
          metalness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </lineSegments>
      <points geometry={points}>
        <pointsMaterial
          size={0.035}
          color="#ffffff"
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
