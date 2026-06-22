"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * HeroScene3D — focal 3D scene for the hero's right column.
 *
 *   Core         : iridescent glass icosahedron — the "AI brain"
 *   Satellites   : 5 wireframe icos orbiting at varied planes / speeds
 *   Connectors   : faint sage lines from core to each satellite
 *   Dust         : sparse drifting particles for atmospheric depth
 *
 * Read as an "AI system at work" — a central intelligence with networked
 * modules moving around it. Sage/teal palette, warm amber rim light from
 * the brand's secondary accent. Canvas is alpha + pointerEvents:none so it
 * composites cleanly into the page.
 * ──────────────────────────────────────────────────────────────────────── */

interface HeroScene3DProps {
  reduced?: boolean;
}

interface SatelliteConfig {
  radius: number;
  speed: number;
  phase: number;
  size: number;
  detail: number;
  tilt: [number, number, number];
}

const SATELLITES: SatelliteConfig[] = [
  { radius: 2.6, speed: 0.35, phase: 0, size: 0.42, detail: 1, tilt: [0.2, 0.1, 0] },
  { radius: 2.95, speed: -0.28, phase: 1.4, size: 0.32, detail: 1, tilt: [0.5, -0.3, 0.2] },
  { radius: 2.3, speed: 0.46, phase: 2.6, size: 0.28, detail: 1, tilt: [-0.3, 0.5, 0.1] },
  { radius: 3.1, speed: -0.22, phase: 3.8, size: 0.38, detail: 2, tilt: [0.1, -0.6, 0.3] },
  { radius: 2.7, speed: 0.32, phase: 5.0, size: 0.25, detail: 1, tilt: [-0.5, -0.2, 0.4] },
];

export function HeroScene3D({ reduced = false }: HeroScene3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.8], fov: 42 }}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      {/* Fog matched to the page background so the back of the scene
          dissolves into the cream surface — no hard horizon. */}
      <fog attach="fog" args={["#E8E6F5", 7, 13]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight
        position={[-4, -2, 3]}
        intensity={0.7}
        color="#845EF7"
      />
      <pointLight position={[0, 0, 2]} intensity={0.45} color="#845EF7" />

      {/* Studio environment drives the iridescent reflections on the core. */}
      <Environment preset="apartment" />

      <CentralCore reduced={reduced} />

      {SATELLITES.map((s, i) => (
        <OrbitingSatellite key={i} config={s} reduced={reduced} />
      ))}

      <Connectors reduced={reduced} />
      <Dust reduced={reduced} />
    </Canvas>
  );
}

/* ─── Central core — iridescent glass icosahedron ───────────────────────── */

function CentralCore({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.18;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.04;
      haloRef.current.scale.set(s, s, s);
    }
  });

  return (
    <Float
      speed={reduced ? 0 : 1.2}
      rotationIntensity={0}
      floatIntensity={0.4}
      floatingRange={[-0.12, 0.12]}
    >
      <group>
        {/* Outer atmospheric halo — slowly breathes */}
        <mesh ref={haloRef}>
          <icosahedronGeometry args={[1.55, 0]} />
          <meshBasicMaterial
            color="#845EF7"
            transparent
            opacity={0.06}
            depthWrite={false}
          />
        </mesh>

        {/* Core mesh — iridescent glass */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.25, 1]} />
          <meshPhysicalMaterial
            color="#E2DFF2"
            metalness={0.35}
            roughness={0.08}
            transmission={0.55}
            thickness={1.2}
            ior={1.5}
            attenuationColor="#845EF7"
            attenuationDistance={2.2}
            clearcoat={1}
            clearcoatRoughness={0.04}
            iridescence={1}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[300, 820]}
            sheen={0.55}
            sheenColor={new THREE.Color("#A99BF5")}
            sheenRoughness={0.3}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Subtle wireframe overlay on the core — accents the facets without
            relying solely on the iridescent reflections. */}
        <lineSegments>
          <edgesGeometry args={[new THREE.IcosahedronGeometry(1.25, 1)]} />
          <lineBasicMaterial
            color="#2A2456"
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </lineSegments>
      </group>
    </Float>
  );
}

/* ─── Orbiting satellites ───────────────────────────────────────────────── */

function OrbitingSatellite({
  config,
  reduced,
}: {
  config: SatelliteConfig;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.LineSegments>(null);

  // Pre-compute the basis vectors for this satellite's orbital plane from
  // its tilt vector. We just rotate a unit-axis around so the orbit sits
  // on a tilted plane instead of always xz.
  const { ux, uy } = useMemo(() => {
    const tilt = new THREE.Euler(...config.tilt);
    const ux = new THREE.Vector3(1, 0, 0).applyEuler(tilt);
    const uy = new THREE.Vector3(0, 1, 0).applyEuler(tilt);
    return { ux, uy };
  }, [config.tilt]);

  const geom = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.IcosahedronGeometry(config.size, config.detail),
      ),
    [config.size, config.detail],
  );

  useFrame((state) => {
    if (!groupRef.current || reduced) return;
    const t = state.clock.elapsedTime * config.speed + config.phase;
    const x = ux.x * Math.cos(t) + uy.x * Math.sin(t);
    const y = ux.y * Math.cos(t) + uy.y * Math.sin(t);
    const z = ux.z * Math.cos(t) + uy.z * Math.sin(t);
    groupRef.current.position.set(x * config.radius, y * config.radius, z * config.radius);

    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.6;
      meshRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={meshRef} geometry={geom}>
        <lineBasicMaterial
          color="#845EF7"
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </lineSegments>
      {/* Tiny solid pip at the satellite's center — acts as a node marker */}
      <mesh>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#2A2456" />
      </mesh>
    </group>
  );
}

/* ─── Connectors — sage lines from core to each satellite ───────────────── */

function Connectors({ reduced }: { reduced: boolean }) {
  // One BufferGeometry rewritten each frame — much cheaper than recreating
  // a geometry per satellite. Each line is two endpoints (core + sat).
  const ref = useRef<THREE.LineSegments>(null);

  const positions = useMemo(
    () => new Float32Array(SATELLITES.length * 6),
    [],
  );
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  // Re-derive each satellite's orbital basis once at mount (the
  // OrbitingSatellite component duplicates this calc internally, but
  // computing here keeps the connectors logic self-contained).
  const bases = useMemo(
    () =>
      SATELLITES.map((s) => {
        const tilt = new THREE.Euler(...s.tilt);
        return {
          ux: new THREE.Vector3(1, 0, 0).applyEuler(tilt),
          uy: new THREE.Vector3(0, 1, 0).applyEuler(tilt),
        };
      }),
    [],
  );

  useFrame((state) => {
    if (reduced) {
      // Static positions when motion is disabled — endpoints sit at the
      // satellites' initial phase positions.
      for (let i = 0; i < SATELLITES.length; i++) {
        const s = SATELLITES[i];
        const { ux, uy } = bases[i];
        const t = s.phase;
        positions[i * 6 + 0] = 0;
        positions[i * 6 + 1] = 0;
        positions[i * 6 + 2] = 0;
        positions[i * 6 + 3] = (ux.x * Math.cos(t) + uy.x * Math.sin(t)) * s.radius;
        positions[i * 6 + 4] = (ux.y * Math.cos(t) + uy.y * Math.sin(t)) * s.radius;
        positions[i * 6 + 5] = (ux.z * Math.cos(t) + uy.z * Math.sin(t)) * s.radius;
      }
      geom.attributes.position.needsUpdate = true;
      return;
    }

    const elapsed = state.clock.elapsedTime;
    for (let i = 0; i < SATELLITES.length; i++) {
      const s = SATELLITES[i];
      const { ux, uy } = bases[i];
      const t = elapsed * s.speed + s.phase;
      // core endpoint
      positions[i * 6 + 0] = 0;
      positions[i * 6 + 1] = 0;
      positions[i * 6 + 2] = 0;
      // satellite endpoint
      positions[i * 6 + 3] = (ux.x * Math.cos(t) + uy.x * Math.sin(t)) * s.radius;
      positions[i * 6 + 4] = (ux.y * Math.cos(t) + uy.y * Math.sin(t)) * s.radius;
      positions[i * 6 + 5] = (ux.z * Math.cos(t) + uy.z * Math.sin(t)) * s.radius;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={ref} geometry={geom}>
      <lineBasicMaterial
        color="#845EF7"
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* ─── Dust — sparse drifting particles for atmospheric depth ────────────── */

function Dust({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 100;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // Distribute in a fat shell around the core, biased away from
      // direct overlap with the central icosahedron.
      const r = 2 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 1;
    }
    return arr;
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.025;
    ref.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.05) * 0.08;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        color="#845EF7"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}
