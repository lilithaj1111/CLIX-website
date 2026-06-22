"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type FloatingShardsProps = {
  density?: number;
  scale?: number;
  position?: [number, number, number];
  accentMix?: number;
  className?: string;
};

/**
 * A drifting cluster of wireframe polyhedra — icosahedrons, octahedrons,
 * tetrahedrons — themed in slate + rust. Each shard floats on a noise
 * trajectory, rotates on its own axis, and gently leans toward the cursor.
 *
 * Used as the `/services` page hero scene to telegraph "many disciplines,
 * one company" through varied geometric forms.
 */
export function FloatingShards({
  density = 1,
  scale = 1,
  position = [0, 0, 0],
  accentMix = 0.45,
  className = "",
}: FloatingShardsProps) {
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
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 6, 4]} intensity={1} color={colors.accent} />
        <Cluster
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

type Shard = {
  kind: 0 | 1 | 2 | 3; // 0=ico, 1=octa, 2=tetra, 3=box
  pos: [number, number, number];
  rotSpeed: [number, number, number];
  size: number;
  accent: boolean;
  phase: number;
};

function Cluster({
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
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const shards: Shard[] = useMemo(() => {
    const count = Math.max(6, Math.floor(11 * density));
    const out: Shard[] = [];
    for (let i = 0; i < count; i++) {
      const r = 1.6 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      out.push({
        kind: (i % 4) as 0 | 1 | 2 | 3,
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.65,
          r * Math.cos(phi),
        ],
        rotSpeed: [
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.3,
        ],
        size: 0.22 + Math.random() * 0.32,
        accent: Math.random() < accentMix,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return out;
  }, [density, accentMix]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    if (reduced) {
      g.rotation.set(0.1, 0.4, 0);
      return;
    }
    const targetX = mouse.current.y * 0.4;
    const targetY = mouse.current.x * 0.6;
    g.rotation.x += (targetX - g.rotation.x) * 0.04;
    g.rotation.y += (targetY - g.rotation.y) * 0.04;
    g.rotation.z += dt * 0.02;
    g.children.forEach((child, i) => {
      const s = shards[i];
      if (!s) return;
      child.rotation.x += dt * s.rotSpeed[0];
      child.rotation.y += dt * s.rotSpeed[1];
      child.rotation.z += dt * s.rotSpeed[2];
      const t = clock.elapsedTime + s.phase;
      child.position.y = s.pos[1] + Math.sin(t * 0.7) * 0.18;
      child.position.x = s.pos[0] + Math.cos(t * 0.5) * 0.12;
    });
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {shards.map((s, i) => (
        <ShardMesh key={i} shard={s} fg={fg} accent={accent} />
      ))}
    </group>
  );
}

function ShardMesh({
  shard,
  fg,
  accent,
}: {
  shard: Shard;
  fg: string;
  accent: string;
}) {
  const color = shard.accent ? accent : fg;
  const geom = useMemo(() => {
    switch (shard.kind) {
      case 0:
        return new THREE.IcosahedronGeometry(shard.size, 0);
      case 1:
        return new THREE.OctahedronGeometry(shard.size, 0);
      case 2:
        return new THREE.TetrahedronGeometry(shard.size, 0);
      default:
        return new THREE.BoxGeometry(shard.size * 1.1, shard.size * 1.1, shard.size * 1.1);
    }
  }, [shard.kind, shard.size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geom), [geom]);
  return (
    <group position={shard.pos}>
      <mesh geometry={geom}>
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.15}
          transparent
          opacity={shard.accent ? 0.7 : 0.5}
          depthWrite={false}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} transparent opacity={0.95} />
      </lineSegments>
    </group>
  );
}
