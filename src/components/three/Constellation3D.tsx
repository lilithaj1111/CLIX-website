"use client";
/* eslint-disable react-hooks/refs */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type Constellation3DProps = {
  className?: string;
};

/* ─── Network topology ───────────────────────────────────────────────── */

type NodePos = {
  id: string;
  pos: [number, number, number];
  size: number;
};
type Edge = { from: string; to: string };

const NODES: NodePos[] = [
  { id: "hub", pos: [0, 0, 0], size: 0.22 },
  // Branch A — upper right
  { id: "a1", pos: [1.2, 1.1, 0.45], size: 0.13 },
  { id: "a2", pos: [2.2, 1.85, -0.55], size: 0.1 },
  { id: "a3", pos: [3.0, 1.4, 0.6], size: 0.08 },
  // Branch B — right
  { id: "b1", pos: [1.65, 0.05, -0.35], size: 0.13 },
  { id: "b2", pos: [2.8, -0.2, 0.5], size: 0.1 },
  { id: "b3", pos: [3.4, 0.45, -0.4], size: 0.08 },
  // Branch C — lower right
  { id: "c1", pos: [1.15, -1.2, 0.4], size: 0.13 },
  { id: "c2", pos: [2.2, -1.95, -0.55], size: 0.1 },
  { id: "c3", pos: [2.7, -2.55, 0.5], size: 0.08 },
  // Branch D — lower left
  { id: "d1", pos: [-1.0, -1.2, -0.4], size: 0.13 },
  { id: "d2", pos: [-1.95, -2.0, 0.55], size: 0.1 },
  { id: "d3", pos: [-2.7, -1.55, -0.4], size: 0.08 },
  // Branch E — upper left
  { id: "e1", pos: [-1.3, 1.0, 0.55], size: 0.13 },
  { id: "e2", pos: [-2.2, 1.7, -0.6], size: 0.1 },
  { id: "e3", pos: [-2.85, 2.35, 0.45], size: 0.08 },
];

const PRIMARY_EDGES: Edge[] = [
  { from: "hub", to: "a1" }, { from: "hub", to: "b1" }, { from: "hub", to: "c1" },
  { from: "hub", to: "d1" }, { from: "hub", to: "e1" },
  { from: "a1", to: "a2" }, { from: "a2", to: "a3" },
  { from: "b1", to: "b2" }, { from: "b2", to: "b3" },
  { from: "c1", to: "c2" }, { from: "c2", to: "c3" },
  { from: "d1", to: "d2" }, { from: "d2", to: "d3" },
  { from: "e1", to: "e2" }, { from: "e2", to: "e3" },
];

const CROSS_EDGES: Edge[] = [
  { from: "a1", to: "b1" }, { from: "b1", to: "c1" }, { from: "c1", to: "d1" },
  { from: "d1", to: "e1" }, { from: "e1", to: "a1" },
];

/** Bidirectional adjacency map for BFS chain-reaction propagation. */
const ADJACENCY = (() => {
  const map: Record<string, string[]> = {};
  [...PRIMARY_EDGES, ...CROSS_EDGES].forEach(({ from, to }) => {
    (map[from] ??= []).push(to);
    (map[to] ??= []).push(from);
  });
  return map;
})();

/* ─── Top-level component ────────────────────────────────────────────── */

export function Constellation3D({ className = "" }: Constellation3DProps) {
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
        camera={{ position: [0, 0, 7.5], fov: 48 }}
        style={{ pointerEvents: "none", background: "transparent" }}
      >
        {/* Page-tinted fog — fades distant edges into the page surface,
            simulating depth-of-field without postprocessing. */}
        <fog attach="fog" args={["#F3F1FB", 6.5, 15]} />
        <CameraDrift reduced={reduced} />
        <DriftingDust reduced={reduced} />
        <ConstellationScene reduced={reduced} />
      </Canvas>
    </div>
  );
}

/* ─── Camera: cinematic drift + cursor parallax ──────────────────────── */

function CameraDrift({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const baseZ = useRef(camera.position.z);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    camera.position.z =
      baseZ.current + Math.sin(t * 0.16) * 0.28 + mouse.current.y * -0.18;
    camera.position.x =
      Math.sin(t * 0.11) * 0.18 + mouse.current.x * 0.55;
    camera.position.y =
      Math.cos(t * 0.14) * 0.12 + mouse.current.y * -0.35;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Drifting dust particles ────────────────────────────────────────── */

function DriftingDust({ reduced }: { reduced: boolean }) {
  const COUNT = 110;

  const { geom, basePositions } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const basePositions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 3 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geom: g, basePositions };
  }, []);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    const positions = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] =
        basePositions[i * 3] + Math.sin(t * 0.3 + i * 0.5) * 0.18;
      positions[i * 3 + 1] =
        basePositions[i * 3 + 1] + Math.cos(t * 0.36 + i * 0.7) * 0.14;
      positions[i * 3 + 2] =
        basePositions[i * 3 + 2] + Math.sin(t * 0.25 + i * 0.3) * 0.12;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={geom}>
      <pointsMaterial
        color="#845EF7"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Main constellation scene with chain-reactions ──────────────────── */

type PendingActivation = { nodeId: string; at: number; strength: number };

function ConstellationScene({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeMap = useMemo(
    () => Object.fromEntries(NODES.map((n) => [n.id, n])),
    [],
  );

  const primaryGeom = useMemo(
    () => buildEdgeGeom(PRIMARY_EDGES, nodeMap),
    [nodeMap],
  );
  const crossGeom = useMemo(
    () => buildEdgeGeom(CROSS_EDGES, nodeMap),
    [nodeMap],
  );

  // Per-node activation state. Drives a brief halo + core brightening.
  // Persists in a ref so we don't trigger re-renders every frame.
  const activations = useRef<Record<string, number>>({});
  // Queued future activations (chain-reaction waves + pulse arrivals).
  const pending = useRef<PendingActivation[]>([]);
  // Last time we spawned a chain reaction.
  const lastChain = useRef<number>(-Infinity);
  // Last time we sparked a random idle activation.
  const lastSpark = useRef<number>(0);
  // Track which pulse cycle has already triggered an arrival activation —
  // prevents re-triggering every frame the pulse is "near" the target.
  const pulseCycle = useRef<number[]>([]);

  const haloRefs = useRef<(THREE.Mesh | null)[]>([]);
  const coreRefs = useRef<(THREE.Mesh | null)[]>([]);

  const hubEdges = useMemo(
    () => PRIMARY_EDGES.filter((e) => e.from === "hub"),
    [],
  );
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // — Group rotation + X wobble for depth read —
    if (groupRef.current) {
      if (reduced) {
        groupRef.current.rotation.set(0.12, 0.45, 0);
      } else {
        groupRef.current.rotation.y = t * 0.18;
        groupRef.current.rotation.x = Math.sin(t * 0.13) * 0.16;
      }
    }

    // — Activation decay (slow, so the bloom lingers gracefully) —
    const decay = 0.014;
    for (const id of Object.keys(activations.current)) {
      const v = activations.current[id] - decay;
      if (v <= 0.001) delete activations.current[id];
      else activations.current[id] = v;
    }

    // — Spawn chain reactions periodically. Each chain BFS-traverses
    //   from a seed node, queuing wave-by-wave activations with a
    //   short inter-wave delay so the eye sees a ripple propagating. —
    if (!reduced && t - lastChain.current > 6 + Math.random() * 4) {
      lastChain.current = t;
      const seedId = NODES[Math.floor(Math.random() * NODES.length)].id;
      scheduleChain(seedId, t, pending.current);
    }

    // — Idle sparks: a single random node lights softly every ~1.5s
    //   so the network always has subtle "life" between full chains. —
    if (!reduced && t - lastSpark.current > 1.3 + Math.random() * 1.2) {
      lastSpark.current = t;
      const id = NODES[Math.floor(Math.random() * NODES.length)].id;
      activations.current[id] = Math.max(
        activations.current[id] ?? 0,
        0.55,
      );
    }

    // — Process due pending activations —
    pending.current = pending.current.filter((p) => {
      if (t >= p.at) {
        activations.current[p.nodeId] = Math.max(
          activations.current[p.nodeId] ?? 0,
          p.strength,
        );
        return false;
      }
      return true;
    });

    // — Apply visual state to each node —
    NODES.forEach((n, i) => {
      const a = activations.current[n.id] ?? 0;
      const halo = haloRefs.current[i];
      const core = coreRefs.current[i];
      if (halo) {
        const m = halo.material as THREE.MeshBasicMaterial;
        m.opacity = a * 0.42;
        const s = 1 + a * 1.1;
        halo.scale.setScalar(s);
      }
      if (core) {
        // Core color brightens from deep plum toward bright purple when
        // activated — subtle "wake up" effect.
        const m = core.material as THREE.MeshBasicMaterial;
        m.color.setRGB(
          0.353 + a * 0.39, // 0.353 (#5a..) → 0.74 (#bc..) when activated
          0.157 + a * 0.18,
          0.502 + a * 0.32,
        );
      }
    });

    // — Hub-outbound pulses with destination activation on arrival —
    hubEdges.forEach((e, i) => {
      const pulse = pulseRefs.current[i];
      if (!pulse) return;
      const from = nodeMap[e.from].pos;
      const to = nodeMap[e.to].pos;
      const duration = 2.8 + i * 0.4;
      const cycleProgress = (t + i * 0.7) / duration;
      const u = reduced ? 0.5 : cycleProgress % 1;
      pulse.position.set(
        from[0] + (to[0] - from[0]) * u,
        from[1] + (to[1] - from[1]) * u,
        from[2] + (to[2] - from[2]) * u,
      );
      const m = pulse.material as THREE.MeshBasicMaterial;
      const fade =
        u < 0.08 ? u / 0.08 : u > 0.92 ? (1 - u) / 0.08 : 1;
      m.opacity = fade;

      // When the pulse completes its lap, activate the destination
      // node — but only once per cycle. We track the floored cycle
      // number so the trigger fires exactly on the rollover.
      const cycle = Math.floor(cycleProgress);
      if (pulseCycle.current[i] !== cycle) {
        pulseCycle.current[i] = cycle;
        if (cycle > 0) {
          activations.current[e.to] = Math.max(
            activations.current[e.to] ?? 0,
            0.85,
          );
          // Mini-chain: propagate one hop further with a short delay so
          // hub pulses also cause small ripples.
          (ADJACENCY[e.to] ?? []).slice(0, 2).forEach((nid, idx) => {
            pending.current.push({
              nodeId: nid,
              at: t + 0.18 + idx * 0.06,
              strength: 0.5,
            });
          });
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Cross-ring edges — fainter, behind */}
      <lineSegments geometry={crossGeom}>
        <lineBasicMaterial
          color="#845EF7"
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </lineSegments>

      {/* Primary edges — brighter, define the structure */}
      <lineSegments geometry={primaryGeom}>
        <lineBasicMaterial
          color="#845EF7"
          transparent
          opacity={0.56}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes: an activation halo (flashes only when triggered, then
          decays back to invisible) plus a solid plum core that brightens
          toward bright purple at peak activation. */}
      {NODES.map((n, i) => (
        <group key={n.id} position={n.pos}>
          <mesh
            ref={(el) => {
              haloRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[n.size * 1.7, 20, 20]} />
            <meshBasicMaterial
              color="#845EF7"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
          <mesh
            ref={(el) => {
              coreRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[n.size, 24, 24]} />
            <meshBasicMaterial color="#2A2456" />
          </mesh>
        </group>
      ))}

      {/* Pulses traveling from hub outward */}
      {hubEdges.map((_, i) => (
        <mesh
          key={`pulse-${i}`}
          ref={(el) => {
            pulseRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.075, 14, 14]} />
          <meshBasicMaterial
            color="#845EF7"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Chain-reaction scheduler ────────────────────────────────────────
   BFS from `seedId` to depth 4 (covers the whole network from any
   seed). Each wave is queued with a 0.15s offset from the previous,
   and strength fades with depth so the ripple looks like energy
   dissipating outward. */
function scheduleChain(
  seedId: string,
  startTime: number,
  pending: PendingActivation[],
) {
  const visited = new Set<string>([seedId]);
  let frontier: string[] = [seedId];
  let depth = 0;
  const MAX_DEPTH = 4;
  while (frontier.length > 0 && depth <= MAX_DEPTH) {
    const at = startTime + depth * 0.15;
    const strength = Math.max(0.35, 1 - depth * 0.18);
    frontier.forEach((id) => {
      pending.push({ nodeId: id, at, strength });
    });
    const next: string[] = [];
    frontier.forEach((id) => {
      (ADJACENCY[id] ?? []).forEach((nid) => {
        if (!visited.has(nid)) {
          visited.add(nid);
          next.push(nid);
        }
      });
    });
    frontier = next;
    depth++;
  }
}

/* ─── Edge geometry helper ───────────────────────────────────────────── */

function buildEdgeGeom(edges: Edge[], nodeMap: Record<string, NodePos>) {
  const positions: number[] = [];
  edges.forEach((e) => {
    positions.push(...nodeMap[e.from].pos, ...nodeMap[e.to].pos);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return g;
}
