"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * ServiceMini3D — four compact 3D scenes used inside the hero's floating
 * service cards. Each renders in its own small Canvas (alpha-on, DPR
 * clamped) so they composite cleanly into the parent card layout.
 *
 *   AI         → Fibonacci network sphere (mini ConstellationSphere)
 *   Mobile     → tilted phone-frame mesh, floating
 *   Websites   → tilted browser-window mesh, floating
 *   Automations → counter-rotating torus rings (loop motif)
 *
 * All four share the sage/forest palette and `reduced` motion semantics.
 * Pointer events off so they never intercept hover on the parent card.
 * ──────────────────────────────────────────────────────────────────────── */

interface MiniSceneProps {
  reduced?: boolean;
}

function MiniCanvas({ children }: { children: React.ReactNode }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.6], fov: 40 }}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[2, 3, 3]} intensity={0.9} />
      <directionalLight position={[-2, -1, 2]} intensity={0.35} color="#5c7a6e" />
      {children}
    </Canvas>
  );
}

/* ─── 1. AI — Fibonacci network sphere ──────────────────────────────────── */

export function MiniSphereScene({ reduced = false }: MiniSceneProps) {
  return (
    <MiniCanvas>
      <fog attach="fog" args={["#efeee7", 3.2, 6]} />
      <NetworkSphere reduced={reduced} />
    </MiniCanvas>
  );
}

function NetworkSphere({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);

  const { pointsBuf, linesBuf } = useMemo(() => {
    const count = 72;
    const radius = 1.15;
    const pts: [number, number, number][] = [];
    const phi = Math.PI * (Math.sqrt(5) - 1);
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      pts.push([
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius,
      ]);
    }
    const points = new Float32Array(count * 3);
    pts.forEach(([x, y, z], i) => {
      points[i * 3] = x;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = z;
    });
    const linesArr: number[] = [];
    for (let i = 0; i < count; i++) {
      const a = pts[i];
      const d: { idx: number; v: number }[] = [];
      for (let j = 0; j < count; j++) {
        if (j === i) continue;
        const b = pts[j];
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        d.push({ idx: j, v: dx * dx + dy * dy + dz * dz });
      }
      d.sort((p, q) => p.v - q.v);
      for (let k = 0; k < 3; k++) {
        const j = d[k].idx;
        if (j > i) linesArr.push(...a, ...pts[j]);
      }
    }
    return { pointsBuf: points, linesBuf: new Float32Array(linesArr) };
  }, []);

  const pointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pointsBuf, 3));
    return g;
  }, [pointsBuf]);
  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linesBuf, 3));
    return g;
  }, [linesBuf]);

  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
  });

  return (
    <group ref={ref}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color="#4a6258"
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={pointGeom}>
        <pointsMaterial
          color="#2f4039"
          size={3.5}
          sizeAttenuation={false}
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* ─── 2. Mobile — tilted phone frame ────────────────────────────────────── */

export function MiniPhoneScene({ reduced = false }: MiniSceneProps) {
  return (
    <MiniCanvas>
      <PhoneShape reduced={reduced} />
    </MiniCanvas>
  );
}

function PhoneShape({ reduced }: { reduced: boolean }) {
  return (
    <Float
      speed={reduced ? 0 : 1.3}
      rotationIntensity={reduced ? 0 : 0.5}
      floatIntensity={reduced ? 0 : 0.4}
    >
      <group rotation={[0.15, -0.5, 0.05]}>
        {/* Phone body */}
        <mesh>
          <boxGeometry args={[0.78, 1.55, 0.1]} />
          <meshStandardMaterial
            color="#2f4039"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.052]}>
          <boxGeometry args={[0.68, 1.4, 0.01]} />
          <meshStandardMaterial
            color="#e6ebe5"
            roughness={0.1}
            metalness={0}
            emissive="#7a9285"
            emissiveIntensity={0.18}
          />
        </mesh>
        {/* Status bar at top of screen */}
        <mesh position={[0, 0.55, 0.06]}>
          <boxGeometry args={[0.45, 0.05, 0.005]} />
          <meshBasicMaterial color="#4a6258" />
        </mesh>
        {/* Content blocks on screen */}
        <mesh position={[-0.12, 0.25, 0.06]}>
          <boxGeometry args={[0.4, 0.18, 0.005]} />
          <meshBasicMaterial
            color="#4a6258"
            transparent
            opacity={0.35}
          />
        </mesh>
        <mesh position={[-0.12, 0, 0.06]}>
          <boxGeometry args={[0.55, 0.18, 0.005]} />
          <meshBasicMaterial
            color="#4a6258"
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh position={[-0.12, -0.25, 0.06]}>
          <boxGeometry args={[0.32, 0.18, 0.005]} />
          <meshBasicMaterial
            color="#4a6258"
            transparent
            opacity={0.35}
          />
        </mesh>
        {/* Home indicator */}
        <mesh position={[0, -0.65, 0.06]}>
          <boxGeometry args={[0.18, 0.025, 0.005]} />
          <meshBasicMaterial color="#4a6258" />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── 3. Websites — tilted browser window ───────────────────────────────── */

export function MiniBrowserScene({ reduced = false }: MiniSceneProps) {
  return (
    <MiniCanvas>
      <BrowserShape reduced={reduced} />
    </MiniCanvas>
  );
}

function BrowserShape({ reduced }: { reduced: boolean }) {
  return (
    <Float
      speed={reduced ? 0 : 1.1}
      rotationIntensity={reduced ? 0 : 0.4}
      floatIntensity={reduced ? 0 : 0.4}
    >
      <group rotation={[0.18, 0.45, -0.06]}>
        {/* Window frame */}
        <mesh>
          <boxGeometry args={[1.75, 1.15, 0.08]} />
          <meshStandardMaterial
            color="#2f4039"
            roughness={0.35}
            metalness={0.5}
          />
        </mesh>
        {/* Window background */}
        <mesh position={[0, -0.08, 0.046]}>
          <boxGeometry args={[1.65, 0.92, 0.005]} />
          <meshStandardMaterial color="#fafaf4" roughness={0.2} />
        </mesh>
        {/* Title bar */}
        <mesh position={[0, 0.48, 0.046]}>
          <boxGeometry args={[1.65, 0.14, 0.005]} />
          <meshStandardMaterial color="#dde5dd" />
        </mesh>
        {/* Traffic-light dots */}
        {[-0.74, -0.66, -0.58].map((x) => (
          <mesh key={x} position={[x, 0.48, 0.053]}>
            <circleGeometry args={[0.025, 16]} />
            <meshBasicMaterial color="#4a6258" />
          </mesh>
        ))}
        {/* Address bar */}
        <mesh position={[0.2, 0.48, 0.053]}>
          <boxGeometry args={[0.8, 0.06, 0.005]} />
          <meshBasicMaterial color="#b5c0b8" />
        </mesh>
        {/* Content lines */}
        {[0.2, 0, -0.2].map((y, i) => (
          <mesh
            key={i}
            position={[-0.35 + i * 0.05, y, 0.052]}
          >
            <boxGeometry args={[0.85 - i * 0.18, 0.06, 0.005]} />
            <meshBasicMaterial
              color="#4a6258"
              transparent
              opacity={0.35 + i * 0.15}
            />
          </mesh>
        ))}
        {/* CTA block */}
        <mesh position={[-0.5, -0.43, 0.052]}>
          <boxGeometry args={[0.32, 0.12, 0.005]} />
          <meshStandardMaterial
            color="#4a6258"
            emissive="#4a6258"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── 4. Automations — counter-rotating torus rings ─────────────────────── */

export function MiniLoopScene({ reduced = false }: MiniSceneProps) {
  return (
    <MiniCanvas>
      <LoopTorus reduced={reduced} />
    </MiniCanvas>
  );
}

function LoopTorus({ reduced }: { reduced: boolean }) {
  const outer = useRef<THREE.Mesh>(null);
  const middle = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (outer.current) {
      outer.current.rotation.x = t * 0.4;
      outer.current.rotation.y = t * 0.2;
    }
    if (middle.current) {
      middle.current.rotation.x = -t * 0.5;
      middle.current.rotation.z = t * 0.3;
    }
    if (inner.current) {
      inner.current.rotation.y = t * 0.7;
      inner.current.rotation.z = -t * 0.4;
    }
  });

  return (
    <group rotation={[0.4, 0.4, 0]}>
      <mesh ref={outer}>
        <torusGeometry args={[1.05, 0.045, 16, 96]} />
        <meshStandardMaterial
          color="#4a6258"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh ref={middle} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.78, 0.035, 16, 96]} />
        <meshStandardMaterial
          color="#5c7a6e"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      <mesh ref={inner} rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[0.5, 0.028, 16, 96]} />
        <meshStandardMaterial
          color="#2f4039"
          roughness={0.4}
          metalness={0.6}
          emissive="#4a6258"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}
