"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * NeuralBackdrop — animated 3D neural-network field. ~110 particles drift
 * on sine-noise paths in a wide 3D volume; whenever two particles are
 * within a threshold distance they're connected by a thin sage line.
 * The set of connections changes every frame so the network feels alive
 * without ever resolving into a recognizable shape. Sage-tinted, very low
 * opacity — quiet ambient depth, not a competing visual.
 *
 * The connections are drawn with one shared BufferGeometry that we
 * rewrite each frame (instead of recreating geometry per frame) — keeps
 * the scene running smoothly even with O(N²) proximity checks.
 * ──────────────────────────────────────────────────────────────────────── */

interface NeuralBackdropProps {
  reduced?: boolean;
  /** Particle count. ~110 gives a dense-feeling network without thrashing. */
  count?: number;
  /** Max distance (world units) at which two particles get connected. */
  threshold?: number;
}

export function NeuralBackdrop({
  reduced = false,
  count = 180,
  threshold = 1.85,
}: NeuralBackdropProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <fog attach="fog" args={["#fafaf4", 6, 14]} />
      <ambientLight intensity={0.6} />
      <Network count={count} threshold={threshold} reduced={reduced} />
    </Canvas>
  );
}

function Network({
  count,
  threshold,
  reduced,
}: {
  count: number;
  threshold: number;
  reduced: boolean;
}) {
  // Each particle gets a deterministic starting position + a phase offset
  // so its drift path is unique. Persisting through useMemo keeps positions
  // stable across re-renders.
  const seeds = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 8 - 1,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      phaseZ: Math.random() * Math.PI * 2,
      speedX: 0.08 + Math.random() * 0.12,
      speedY: 0.06 + Math.random() * 0.1,
      speedZ: 0.05 + Math.random() * 0.08,
      ampX: 0.4 + Math.random() * 0.6,
      ampY: 0.3 + Math.random() * 0.5,
      ampZ: 0.25 + Math.random() * 0.4,
    }));
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Point positions (3 floats per particle) — rewritten each frame.
  const pointPositions = useMemo(
    () => new Float32Array(count * 3),
    [count],
  );

  // Connection line positions — preallocated generously. Each connection
  // needs 2 vertices × 3 floats = 6 floats; we cap at ~3 connections per
  // particle to keep the buffer bounded and the look airy.
  const maxConnections = count * 5;
  const linePositions = useMemo(
    () => new Float32Array(maxConnections * 6),
    [maxConnections],
  );
  const lineOpacities = useMemo(
    () => new Float32Array(maxConnections * 2),
    [maxConnections],
  );

  const pointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(pointPositions, 3),
    );
    return g;
  }, [pointPositions]);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    g.setAttribute("opacity", new THREE.BufferAttribute(lineOpacities, 1));
    g.setDrawRange(0, 0);
    return g;
  }, [linePositions, lineOpacities]);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;

    // 1. Update particle positions on their unique drift paths.
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const x = s.x + Math.sin(t * s.speedX + s.phaseX) * s.ampX;
      const y = s.y + Math.cos(t * s.speedY + s.phaseY) * s.ampY;
      const z = s.z + Math.sin(t * s.speedZ + s.phaseZ) * s.ampZ;
      pointPositions[i * 3] = x;
      pointPositions[i * 3 + 1] = y;
      pointPositions[i * 3 + 2] = z;
    }
    pointGeom.attributes.position.needsUpdate = true;

    // 2. Build the connection set. For each particle, find up to 3 nearest
    //    neighbors within `threshold` and write a line segment.
    const thresholdSq = threshold * threshold;
    let lineWrite = 0;
    for (let i = 0; i < count; i++) {
      const ax = pointPositions[i * 3];
      const ay = pointPositions[i * 3 + 1];
      const az = pointPositions[i * 3 + 2];

      let connections = 0;
      for (let j = i + 1; j < count; j++) {
        if (connections >= 4) break;
        const bx = pointPositions[j * 3];
        const by = pointPositions[j * 3 + 1];
        const bz = pointPositions[j * 3 + 2];
        const dx = ax - bx;
        const dy = ay - by;
        const dz = az - bz;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < thresholdSq) {
          if (lineWrite >= maxConnections) break;
          // Endpoint A
          linePositions[lineWrite * 6 + 0] = ax;
          linePositions[lineWrite * 6 + 1] = ay;
          linePositions[lineWrite * 6 + 2] = az;
          // Endpoint B
          linePositions[lineWrite * 6 + 3] = bx;
          linePositions[lineWrite * 6 + 4] = by;
          linePositions[lineWrite * 6 + 5] = bz;
          lineWrite++;
          connections++;
        }
      }
      if (lineWrite >= maxConnections) break;
    }

    lineGeom.attributes.position.needsUpdate = true;
    lineGeom.setDrawRange(0, lineWrite * 2);
  });

  return (
    <group>
      <points ref={pointsRef} geometry={pointGeom}>
        <pointsMaterial
          color="#4a6258"
          size={0.058}
          sizeAttenuation
          transparent
          opacity={0.78}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeom}>
        <lineBasicMaterial
          color="#4a6258"
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
