"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * ConstellationSphere — dense wireframe globe of node points. Points are
 * distributed via Fibonacci spiral for uniform surface coverage; each point
 * connects to its 5 nearest neighbors (gives tessellated surface lines)
 * plus 2 random far-side points (gives the crossing-diagonal look that
 * makes the sphere read as a 3D network, not a tessellated mesh). Rotates
 * slowly on Y; reduced motion freezes it.
 * ──────────────────────────────────────────────────────────────────────── */

interface ConstellationSphereProps {
  className?: string;
  reduced?: boolean;
  /** Number of points on the sphere. Higher = denser. */
  count?: number;
  /** Local-neighbor connections per point (surface tessellation density). */
  neighbors?: number;
  /** Random far-point connections per point (interior diagonals). */
  diagonals?: number;
}

export function ConstellationSphere({
  className = "",
  reduced = false,
  count = 760,
  neighbors = 6,
  diagonals = 1,
}: ConstellationSphereProps) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 38 }}
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Fog matched to bg so the back of the sphere fades into the page
            — adds depth without a hard horizon. */}
        <fog attach="fog" args={["#fafaf4", 4.5, 8]} />
        <Sphere
          count={count}
          neighbors={neighbors}
          diagonals={diagonals}
          reduced={reduced}
        />
      </Canvas>
    </div>
  );
}

function Sphere({
  count,
  neighbors,
  diagonals,
  reduced,
}: {
  count: number;
  neighbors: number;
  diagonals: number;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const RADIUS = 1.55;

  // Fibonacci-spiral distribution — uniform point coverage on a sphere
  // surface, no clustering at poles. Memoized so the layout is stable.
  const points = useMemo(() => {
    const arr: [number, number, number][] = [];
    const phi = Math.PI * (Math.sqrt(5) - 1); // golden angle
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const rSlice = Math.sqrt(1 - y * y);
      const theta = phi * i;
      arr.push([
        Math.cos(theta) * rSlice * RADIUS,
        y * RADIUS,
        Math.sin(theta) * rSlice * RADIUS,
      ]);
    }
    return arr;
  }, [count]);

  const pointPositions = useMemo(() => {
    const buf = new Float32Array(points.length * 3);
    points.forEach(([x, y, z], i) => {
      buf[i * 3] = x;
      buf[i * 3 + 1] = y;
      buf[i * 3 + 2] = z;
    });
    return buf;
  }, [points]);

  // Build the connection set once at mount: for each point, link its N
  // nearest neighbors (i < j only, to avoid duplicate edges) plus a few
  // random far-side points for visual depth.
  const linePositions = useMemo(() => {
    const lines: number[] = [];

    // Surface tessellation — nearest neighbors.
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const dists: { idx: number; d: number }[] = [];
      for (let j = 0; j < points.length; j++) {
        if (j === i) continue;
        const b = points[j];
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        dists.push({ idx: j, d: dx * dx + dy * dy + dz * dz });
      }
      dists.sort((p, q) => p.d - q.d);
      for (let k = 0; k < neighbors; k++) {
        const j = dists[k].idx;
        if (j > i) {
          const b = points[j];
          lines.push(a[0], a[1], a[2], b[0], b[1], b[2]);
        }
      }
    }

    // Interior diagonals — each point connects to a small number of random
    // far-side points so the wireframe reads as a 3D network, not a flat
    // tessellated mesh.
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let k = 0; k < diagonals; k++) {
        const j = Math.floor(Math.random() * points.length);
        if (j === i) continue;
        const b = points[j];
        lines.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      }
    }

    return new Float32Array(lines);
  }, [points, neighbors, diagonals]);

  const pointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    return g;
  }, [pointPositions]);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return g;
  }, [linePositions]);

  useFrame((state) => {
    if (!groupRef.current || reduced) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color="#4a6258"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </lineSegments>
      {/* Square node marks — sizeAttenuation off gives screen-space pixel
          size so points read as crisp square pips at every camera distance,
          matching the reference look. */}
      <points geometry={pointGeom}>
        <pointsMaterial
          color="#2f4039"
          size={5}
          sizeAttenuation={false}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
