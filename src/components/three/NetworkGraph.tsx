"use client";
/* eslint-disable react-hooks/refs, react-hooks/set-state-in-effect */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type NetworkGraphProps = {
  density?: number;
  scale?: number;
  position?: [number, number, number];
  accentMix?: number;
  className?: string;
};

/**
 * Multi-layer perceptron visualization — four columns of neurons fully
 * connected to the next layer, with edge alpha varying by "weight" and
 * data pulses flowing left to right as signals propagate. Output nodes
 * fire periodically (winner-takes-all). Reads --bg / --fg / --accent /
 * --accent-2 on mount.
 */
export function NetworkGraph({
  density = 1,
  scale = 1,
  position = [0, 0, 0],
  accentMix = 0.55,
  className = "",
}: NetworkGraphProps) {
  const [colors, setColors] = useState<{
    bg: string;
    fg: string;
    accent: string;
    accent2: string;
  } | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setColors({
      bg: (cs.getPropertyValue("--bg") || "#F2F2F2").trim(),
      fg: (cs.getPropertyValue("--fg") || "#2C3641").trim(),
      accent: (cs.getPropertyValue("--accent") || "#5C7488").trim(),
      accent2: (cs.getPropertyValue("--accent-2") || "#8CA0B3").trim(),
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
        camera={{ position: [0, 0, 7], fov: 46 }}
        style={{ pointerEvents: "none" }}
      >
        <fog attach="fog" args={[colors.bg, 6.5, 12]} />
        <ambientLight intensity={0.55} />
        <pointLight position={[3.5, 3, 4]} intensity={1} color={colors.accent} />
        <pointLight position={[-3, -2, 3]} intensity={0.7} color={colors.accent2} />
        <CameraBreathe reduced={reduced} />
        <NeuralNet
          density={density}
          scale={scale}
          position={position}
          accentMix={accentMix}
          reduced={reduced}
          fg={colors.fg}
          accent={colors.accent}
          accent2={colors.accent2}
        />
      </Canvas>
    </div>
  );
}

/* ─── Camera breathe ───────────────────────────────────────────────────── */

function CameraBreathe({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const base = useRef({ z: camera.position.z });
  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    camera.position.z = base.current.z + Math.sin(t * 0.32) * 0.15;
    camera.position.x = Math.sin(t * 0.2) * 0.1;
    camera.position.y = Math.cos(t * 0.27) * 0.07;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Neural net ───────────────────────────────────────────────────────── */

type NetNode = {
  pos: THREE.Vector3;
  layer: number;
  /** Persistent activation 0..1, decays over time, spikes when a pulse arrives. */
  activation: number;
};

type NetEdge = {
  from: number; // node index
  to: number;
  /** Static "weight" 0..1 — drives line alpha. */
  weight: number;
};

type SignalSpec = {
  edge: number;
  startTime: number;
  duration: number;
};

type NetData = {
  nodes: NetNode[];
  edges: NetEdge[];
  edgeGeom: THREE.BufferGeometry;
  /** Per-edge color buffer so we can paint strong-weight lines with the accent. */
  edgeColors: Float32Array;
  /** Indices by layer for fast lookup. */
  byLayer: number[][];
};

const LAYER_X: number[] = [-3.4, -1.15, 1.15, 3.4];
const LAYER_COUNTS: number[] = [4, 7, 7, 3];

function NeuralNet({
  density,
  scale,
  position,
  accentMix,
  reduced,
  fg,
  accent,
  accent2,
}: {
  density: number;
  scale: number;
  position: [number, number, number];
  accentMix: number;
  reduced: boolean;
  fg: string;
  accent: string;
  accent2: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const haloRefs = useRef<(THREE.Mesh | null)[]>([]);
  /** Currently-active signals; each one represents a pulse traveling on an edge. */
  const signals = useRef<SignalSpec[]>([]);
  /** Pre-allocated pulse meshes; assigned to active signals each frame. */
  const pulseMeshes = useRef<THREE.Mesh[]>([]);
  const trailMeshes = useRef<THREE.Mesh[][]>([]);

  // Up to MAX_PULSES simultaneous signals — we rotate them across edges.
  const MAX_PULSES = 18;

  const data: NetData = useMemo(() => {
    const counts = LAYER_COUNTS.map((c) =>
      Math.max(2, Math.floor(c * Math.sqrt(density))),
    );

    const rng = (i: number) => {
      const v = Math.sin(i * 91.3 + 4.7) * 43758.5453;
      return v - Math.floor(v);
    };

    const nodes: NetNode[] = [];
    const byLayer: number[][] = [];

    counts.forEach((n, layer) => {
      const indices: number[] = [];
      const x = LAYER_X[layer];
      const spread = 2.6; // vertical extent
      for (let i = 0; i < n; i++) {
        const y =
          n === 1 ? 0 : ((i / (n - 1)) - 0.5) * spread;
        const z = (rng(layer * 31 + i * 7) - 0.5) * 0.4;
        nodes.push({
          pos: new THREE.Vector3(x, y, z),
          layer,
          activation: 0,
        });
        indices.push(nodes.length - 1);
      }
      byLayer.push(indices);
    });

    // Fully-connect adjacent layers.
    const edges: NetEdge[] = [];
    for (let L = 0; L < counts.length - 1; L++) {
      const a = byLayer[L];
      const b = byLayer[L + 1];
      for (const from of a) {
        for (const to of b) {
          // Pseudo-random "weight". A few strong ones, most modest.
          const r = rng(from * 53 + to * 17);
          const weight = r > 0.85 ? 0.7 + (r - 0.85) * 2 : 0.15 + r * 0.45;
          edges.push({ from, to, weight: Math.min(1, weight) });
        }
      }
    }

    // Edge geometry: flat float32 buffer for LineSegments.
    const edgePositions = new Float32Array(edges.length * 2 * 3);
    const edgeColors = new Float32Array(edges.length * 2 * 3);
    const cFg = new THREE.Color(fg);
    const cA1 = new THREE.Color(accent);
    for (let e = 0; e < edges.length; e++) {
      const { from, to, weight } = edges[e];
      const pa = nodes[from].pos;
      const pb = nodes[to].pos;
      edgePositions[e * 6] = pa.x;
      edgePositions[e * 6 + 1] = pa.y;
      edgePositions[e * 6 + 2] = pa.z;
      edgePositions[e * 6 + 3] = pb.x;
      edgePositions[e * 6 + 4] = pb.y;
      edgePositions[e * 6 + 5] = pb.z;

      // Strong weights tinted with accent; weak weights neutral charcoal.
      // accentMix biases the overall tint.
      const tint = cFg.clone().lerp(cA1, weight * (0.4 + accentMix * 0.6));
      edgeColors[e * 6] = tint.r;
      edgeColors[e * 6 + 1] = tint.g;
      edgeColors[e * 6 + 2] = tint.b;
      edgeColors[e * 6 + 3] = tint.r;
      edgeColors[e * 6 + 4] = tint.g;
      edgeColors[e * 6 + 5] = tint.b;
    }

    const edgeGeom = new THREE.BufferGeometry();
    edgeGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(edgePositions, 3),
    );
    edgeGeom.setAttribute("color", new THREE.BufferAttribute(edgeColors, 3));

    return { nodes, edges, edgeGeom, edgeColors, byLayer };
  }, [density, fg, accent, accentMix]);

  // Cursor parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Seed initial signals — pick MAX_PULSES random edges with staggered start times.
  useEffect(() => {
    const arr: SignalSpec[] = [];
    for (let i = 0; i < MAX_PULSES; i++) {
      arr.push({
        edge: Math.floor(Math.random() * data.edges.length),
        startTime: -Math.random() * 3, // some already in-flight at t=0
        duration: 1.6 + Math.random() * 1.6,
      });
    }
    signals.current = arr;
  }, [data.edges.length]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    const g = groupRef.current;
    if (g) {
      if (reduced) {
        g.rotation.set(0.05, 0.25, 0);
      } else {
        // Slight off-axis tilt so layer depth reads; cursor pushes it.
        const targetX = 0.04 + mouse.current.y * 0.2;
        const targetY = 0.25 + mouse.current.x * 0.35;
        g.rotation.x += (targetX - g.rotation.x) * 0.03;
        g.rotation.y += (targetY - g.rotation.y) * 0.03;
      }
    }

    // Decay node activations.
    for (const node of data.nodes) {
      if (node.activation > 0) {
        node.activation = Math.max(0, node.activation - 0.018);
      }
    }

    // Drive signals — each pulse animates 0→1 along its edge. On arrival,
    // it bumps the destination node's activation and respawns on a new
    // edge. Output-layer arrivals get a bigger activation bump so the
    // final layer "fires" visibly.
    const sigs = signals.current;
    for (let i = 0; i < sigs.length; i++) {
      const s = sigs[i];
      const elapsed = t - s.startTime;
      const u = reduced ? 0.5 : elapsed / s.duration;

      if (u >= 1) {
        // Pulse arrived — fire destination node, then respawn.
        const edge = data.edges[s.edge];
        if (edge) {
          const toLayer = data.nodes[edge.to].layer;
          const bump = toLayer === LAYER_COUNTS.length - 1 ? 1 : 0.65;
          data.nodes[edge.to].activation = Math.min(
            1,
            data.nodes[edge.to].activation + bump,
          );
        }
        // Respawn on a new random edge with a fresh duration.
        sigs[i] = {
          edge: Math.floor(Math.random() * data.edges.length),
          startTime: t + Math.random() * 0.4, // small jitter before relaunch
          duration: 1.6 + Math.random() * 1.6,
        };
      }
    }

    // Position pulse meshes by walking the active signal list.
    for (let i = 0; i < MAX_PULSES; i++) {
      const head = pulseMeshes.current[i];
      if (!head) continue;
      const s = sigs[i];
      const elapsed = t - s.startTime;
      const u = reduced ? 0.5 : elapsed / s.duration;
      const edge = data.edges[s.edge];
      const visible = u >= 0 && u <= 1 && edge;

      const setBead = (
        mesh: THREE.Mesh | undefined,
        uu: number,
        dim: number,
      ) => {
        if (!mesh) return;
        const e = data.edges[s.edge];
        if (!e || uu < 0 || uu > 1) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = 0;
          return;
        }
        const pa = data.nodes[e.from].pos;
        const pb = data.nodes[e.to].pos;
        mesh.position.set(
          pa.x + (pb.x - pa.x) * uu,
          pa.y + (pb.y - pa.y) * uu,
          pa.z + (pb.z - pa.z) * uu,
        );
        const m = mesh.material as THREE.MeshBasicMaterial;
        const fade =
          uu < 0.08
            ? uu / 0.08
            : uu > 0.92
              ? (1 - uu) / 0.08
              : 1;
        // Modulate by edge weight — strong-weight pulses pop more.
        m.opacity = 0.95 * fade * dim * (0.4 + e.weight * 0.7);
      };

      if (visible) {
        setBead(head, u, 1);
        const tr = trailMeshes.current[i];
        if (tr) {
          setBead(tr[0], u - 0.05, 0.55);
          setBead(tr[1], u - 0.1, 0.3);
        }
      } else {
        (head.material as THREE.MeshBasicMaterial).opacity = 0;
        const tr = trailMeshes.current[i];
        if (tr) {
          tr.forEach(
            (m) => m && ((m.material as THREE.MeshBasicMaterial).opacity = 0),
          );
        }
      }
    }

    // Drive node visuals from activation level.
    for (let i = 0; i < data.nodes.length; i++) {
      const mesh = nodeRefs.current[i];
      if (!mesh) continue;
      const halo = haloRefs.current[i];
      const node = data.nodes[i];
      const baseScale = node.layer === 0 || node.layer === LAYER_COUNTS.length - 1 ? 1 : 0.85;
      const s = baseScale + node.activation * 0.6;
      mesh.scale.setScalar(s);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + node.activation * 0.45;
      if (halo) {
        halo.scale.setScalar(1 + node.activation * 1.2);
        const hm = halo.material as THREE.MeshBasicMaterial;
        hm.opacity = node.activation * 0.55;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Edges — single LineSegments draw with per-vertex colors. */}
      <lineSegments geometry={data.edgeGeom}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </lineSegments>

      {/* Neurons — each node is a small sphere + halo (visible when
          activated). Output layer uses accent2 for the winner-takes-all
          visual punch. */}
      {data.nodes.map((node, i) => {
        const isOutput = node.layer === LAYER_COUNTS.length - 1;
        const isInput = node.layer === 0;
        const color = isOutput ? accent2 : isInput ? accent : fg;
        return (
          <group key={`n-${i}`} position={node.pos.toArray()}>
            <mesh
              ref={(el) => {
                haloRefs.current[i] = el;
              }}
            >
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial
                color={isOutput ? accent2 : accent}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
            >
              <sphereGeometry args={[0.07, 18, 18]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}

      {/* Pre-allocated pulse meshes (head + 2-bead trail per signal). */}
      {Array.from({ length: MAX_PULSES }).map((_, i) => (
        <group key={`pulse-${i}`}>
          <mesh
            ref={(el) => {
              if (el) pulseMeshes.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshBasicMaterial
              color={i % 5 === 0 ? accent2 : accent}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {[0, 1].map((b) => (
            <mesh
              key={`trail-${i}-${b}`}
              ref={(el) => {
                if (!trailMeshes.current[i]) trailMeshes.current[i] = [];
                if (el) trailMeshes.current[i][b] = el;
              }}
            >
              <sphereGeometry args={[0.035 - b * 0.01, 8, 8]} />
              <meshBasicMaterial
                color={i % 5 === 0 ? accent2 : accent}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
