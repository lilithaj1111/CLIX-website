"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * ProductsDevices3D — real 3D laptop + phone, replacing the CSS mockups.
 *
 *   Laptop  : two rounded boxes joined at a hinge (base + screen panel
 *             tilted back ~110°), with a glowing sage screen plane and
 *             a subtle keyboard inset.
 *   Phone   : rounded box body + emissive screen plane + notch +
 *             on-screen UI proxies (small accent-tinted planes).
 *
 * Both float gently, drift on their own timing, and respect the
 * `reduced` motion flag.
 * ──────────────────────────────────────────────────────────────────────── */

interface ProductsDevices3DProps {
  reduced?: boolean;
}

export function ProductsDevices3D({ reduced = false }: ProductsDevices3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 6.8], fov: 38 }}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      {/* Page-tinted fog so the devices' far edges fade into the cream
          surface instead of ending hard. */}
      <fog attach="fog" args={["#E8E6F5", 8, 14]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.05} color="#ffffff" />
      <directionalLight
        position={[-3, -1, 2]}
        intensity={0.55}
        color="#845EF7"
      />
      <pointLight position={[0, 0, 4]} intensity={0.3} color="#845EF7" />

      <Environment preset="apartment" />

      {/* Laptop — positioned to the left + tilted slightly toward camera */}
      <group position={[-1.4, -0.55, 0]} rotation={[0, 0.32, 0]}>
        <Laptop3D reduced={reduced} />
      </group>

      {/* Phone — positioned upper-right of cluster, slight counter-tilt */}
      <group position={[1.55, 0.7, 1.1]} rotation={[0, -0.45, 0.08]}>
        <Phone3D reduced={reduced} />
      </group>

      {/* Soft contact shadow under the cluster */}
      <ContactShadow />
    </Canvas>
  );
}

/* ─── Laptop ────────────────────────────────────────────────────────────── */

function Laptop3D({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current || reduced) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.28) * 0.16;
    ref.current.position.y = Math.cos(t * 0.45) * 0.06;
  });

  return (
    <Float
      speed={reduced ? 0 : 0.9}
      rotationIntensity={reduced ? 0 : 0.18}
      floatIntensity={reduced ? 0 : 0.28}
    >
      <group ref={ref}>
        {/* Base */}
        <RoundedBox
          args={[3.2, 0.12, 2.15]}
          radius={0.04}
          smoothness={4}
          position={[0, -0.06, 0]}
          castShadow
        >
          <meshStandardMaterial
            color="#1f2a24"
            metalness={0.75}
            roughness={0.28}
          />
        </RoundedBox>

        {/* Keyboard inset (subtle darker plane) */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.85, 1.85]} />
          <meshStandardMaterial
            color="#161d1a"
            metalness={0.4}
            roughness={0.7}
          />
        </mesh>

        {/* Trackpad */}
        <mesh position={[0, 0.008, 0.62]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.0, 0.6]} />
          <meshStandardMaterial
            color="#0f1614"
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>

        {/* Hinge + screen group */}
        <group position={[0, 0, -1.05]} rotation={[-Math.PI * 0.42, 0, 0]}>
          {/* Screen panel back */}
          <RoundedBox
            args={[3.2, 1.95, 0.1]}
            radius={0.05}
            smoothness={4}
            position={[0, 0.97, 0]}
          >
            <meshStandardMaterial
              color="#1f2a24"
              metalness={0.75}
              roughness={0.28}
            />
          </RoundedBox>

          {/* Screen display plane */}
          <mesh position={[0, 0.97, 0.052]}>
            <planeGeometry args={[2.96, 1.78]} />
            <meshStandardMaterial
              color="#fff5e5"
              emissive="#fff5e5"
              emissiveIntensity={0.42}
              roughness={0.2}
              metalness={0}
            />
          </mesh>

          {/* Screen UI — sidebar */}
          <mesh position={[-1.2, 0.97, 0.054]}>
            <planeGeometry args={[0.52, 1.62]} />
            <meshBasicMaterial color="#ebdfc8" transparent opacity={0.85} />
          </mesh>

          {/* Screen UI — chart hero block (sage accent) */}
          <mesh position={[0.3, 1.4, 0.054]}>
            <planeGeometry args={[1.8, 0.55]} />
            <meshBasicMaterial color="#845EF7" transparent opacity={0.78} />
          </mesh>

          {/* Screen UI — 3 KPI cards */}
          <mesh position={[-0.3, 0.85, 0.054]}>
            <planeGeometry args={[0.52, 0.32]} />
            <meshBasicMaterial color="#1e1a2a" transparent opacity={0.45} />
          </mesh>
          <mesh position={[0.3, 0.85, 0.054]}>
            <planeGeometry args={[0.52, 0.32]} />
            <meshBasicMaterial color="#1e1a2a" transparent opacity={0.45} />
          </mesh>
          <mesh position={[0.9, 0.85, 0.054]}>
            <planeGeometry args={[0.52, 0.32]} />
            <meshBasicMaterial color="#1e1a2a" transparent opacity={0.45} />
          </mesh>

          {/* Screen UI — bottom activity rows */}
          <mesh position={[0.3, 0.45, 0.054]}>
            <planeGeometry args={[1.78, 0.16]} />
            <meshBasicMaterial color="#1e1a2a" transparent opacity={0.35} />
          </mesh>
          <mesh position={[0.3, 0.27, 0.054]}>
            <planeGeometry args={[1.78, 0.16]} />
            <meshBasicMaterial color="#1e1a2a" transparent opacity={0.35} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

/* ─── Phone ─────────────────────────────────────────────────────────────── */

function Phone3D({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current || reduced) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.4) * 0.14;
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.05;
    ref.current.position.y = Math.sin(t * 0.55) * 0.1;
  });

  return (
    <Float
      speed={reduced ? 0 : 1.1}
      rotationIntensity={reduced ? 0 : 0.22}
      floatIntensity={reduced ? 0 : 0.35}
    >
      <group ref={ref}>
        {/* Body */}
        <RoundedBox
          args={[1.2, 2.45, 0.18]}
          radius={0.18}
          smoothness={5}
          castShadow
        >
          <meshStandardMaterial
            color="#1f2a24"
            metalness={0.7}
            roughness={0.32}
          />
        </RoundedBox>

        {/* Screen display plane */}
        <mesh position={[0, 0, 0.092]}>
          <planeGeometry args={[1.04, 2.22]} />
          <meshStandardMaterial
            color="#fff5e5"
            emissive="#fff5e5"
            emissiveIntensity={0.45}
            roughness={0.18}
            metalness={0}
          />
        </mesh>

        {/* Dynamic-island notch */}
        <mesh position={[0, 1.02, 0.094]}>
          <RoundedBoxMini width={0.32} height={0.08} depth={0.005} radius={0.04} color="#0a0a0f" />
        </mesh>

        {/* Status bar pip (time) */}
        <mesh position={[-0.36, 1.02, 0.094]}>
          <planeGeometry args={[0.16, 0.04]} />
          <meshBasicMaterial color="#1e1a2a" transparent opacity={0.55} />
        </mesh>

        {/* Title block (emissive sage card) */}
        <mesh position={[0, 0.62, 0.094]}>
          <planeGeometry args={[0.88, 0.3]} />
          <meshBasicMaterial color="#845EF7" transparent opacity={0.85} />
        </mesh>

        {/* Content cards */}
        <mesh position={[0, 0.18, 0.094]}>
          <planeGeometry args={[0.88, 0.34]} />
          <meshBasicMaterial color="#ebdfc8" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, -0.22, 0.094]}>
          <planeGeometry args={[0.88, 0.34]} />
          <meshBasicMaterial color="#ebdfc8" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0, -0.62, 0.094]}>
          <planeGeometry args={[0.88, 0.34]} />
          <meshBasicMaterial color="#ebdfc8" transparent opacity={0.4} />
        </mesh>

        {/* Home indicator */}
        <mesh position={[0, -1.07, 0.094]}>
          <planeGeometry args={[0.32, 0.03]} />
          <meshBasicMaterial color="#1e1a2a" transparent opacity={0.45} />
        </mesh>
      </group>
    </Float>
  );
}

/* Tiny helper: RoundedBox-as-mesh-child can't accept material-as-child the
   same way a primitive mesh can — wrap a plain mesh + box around the
   notch so the rounded look isn't required. */
function RoundedBoxMini({
  width,
  height,
  depth,
  color,
}: {
  width: number;
  height: number;
  depth: number;
  radius: number;
  color: string;
}) {
  return (
    <>
      <boxGeometry args={[width, height, depth]} />
      <meshBasicMaterial color={color} />
    </>
  );
}

/* ─── Soft contact shadow under the cluster ─────────────────────────────── */

function ContactShadow() {
  // A blurred dark ellipse below the devices — gives them weight on the
  // cream canvas without a real shadow plane / shadow camera setup.
  return (
    <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5.5, 2.4]} />
      <meshBasicMaterial
        color="#1e1a2a"
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </mesh>
  );
}
