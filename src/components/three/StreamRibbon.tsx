"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type StreamRibbonProps = {
  density?: number;
  scale?: number;
  position?: [number, number, number];
  accentMix?: number;
  className?: string;
  /** When false, the ribbon bundle does NOT track the cursor — only
   *  the continuous z-rotation runs, producing a calm one-direction
   *  drift. Defaults to true so existing call sites keep their
   *  interactive behaviour. */
  interactive?: boolean;
};

/**
 * A bundle of flowing 3D ribbons — particles that travel along tube curves,
 * leaving glowing trails. The whole bundle drifts toward the cursor. The
 * sense is "lines of communication" — fitting for the contact page.
 */
export function StreamRibbon({
  density = 1,
  scale = 1,
  position = [0, 0, 0],
  accentMix = 0.6,
  className = "",
  interactive = true,
}: StreamRibbonProps) {
  const [colors, setColors] = useState<{ fg: string; accent: string } | null>(
    null
  );
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setColors({
      fg: (cs.getPropertyValue("--fg") || "#1e1a2a").trim(),
      accent: (cs.getPropertyValue("--accent") || "#547A95").trim(),
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
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 4, 4]} intensity={0.9} color={colors.accent} />
        <Ribbons
          density={density}
          scale={scale}
          position={position}
          accentMix={accentMix}
          reduced={reduced}
          interactive={interactive}
          fg={colors.fg}
          accent={colors.accent}
        />
      </Canvas>
    </div>
  );
}

function Ribbons({
  density,
  scale,
  position,
  accentMix,
  reduced,
  interactive,
  fg,
  accent,
}: {
  density: number;
  scale: number;
  position: [number, number, number];
  accentMix: number;
  reduced: boolean;
  interactive: boolean;
  fg: string;
  accent: string;
}) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const curves = useMemo(() => {
    const count = Math.max(3, Math.floor(5 * density));
    const out: { points: THREE.Vector3[]; accent: boolean }[] = [];
    for (let i = 0; i < count; i++) {
      const pts: THREE.Vector3[] = [];
      const segs = 24;
      const baseY = (i / Math.max(1, count - 1) - 0.5) * 1.8;
      const phase = i * 0.6;
      for (let s = 0; s <= segs; s++) {
        const t = (s / segs - 0.5) * 6.5;
        pts.push(
          new THREE.Vector3(
            t,
            baseY + Math.sin(t * 0.9 + phase) * 0.55,
            Math.cos(t * 0.7 + phase) * 0.9
          )
        );
      }
      out.push({ points: pts, accent: Math.random() < accentMix });
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

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    if (reduced) {
      g.rotation.set(0.1, 0.2, 0);
      return;
    }
    if (interactive) {
      // Cursor-tracked drift + screen-plane z-rotation (legacy
      // services-page behaviour).
      const tX = mouse.current.y * 0.4;
      const tY = mouse.current.x * 0.5;
      g.rotation.x += (tX - g.rotation.x) * 0.05;
      g.rotation.y += (tY - g.rotation.y) * 0.05;
      g.rotation.z += dt * 0.04;
    } else {
      // Non-interactive: continuous one-direction z-rotation only,
      // no cursor tracking.
      g.rotation.z += dt * 0.04;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {curves.map((c, i) => (
        <RibbonLine key={i} curve={c} fg={fg} accent={accent} reduced={reduced} />
      ))}
    </group>
  );
}

function RibbonLine({
  curve,
  fg,
  accent,
  reduced,
}: {
  curve: { points: THREE.Vector3[]; accent: boolean };
  fg: string;
  accent: string;
  reduced: boolean;
}) {
  const tubeRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  const cCurve = useMemo(
    () => new THREE.CatmullRomCurve3(curve.points, false, "catmullrom", 0.4),
    [curve.points]
  );
  const tubeGeom = useMemo(
    () => new THREE.TubeGeometry(cCurve, 96, 0.012, 8, false),
    [cCurve]
  );
  const color = curve.accent ? accent : fg;
  const tRef = useRef(Math.random());

  useFrame((_, dt) => {
    tRef.current += dt * (reduced ? 0 : 0.18);
    if (tRef.current > 1) tRef.current -= 1;
    const p = cCurve.getPointAt(tRef.current);
    if (particleRef.current) {
      particleRef.current.position.copy(p);
    }
  });

  return (
    <group>
      <mesh ref={tubeRef} geometry={tubeGeom}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={curve.accent ? 0.7 : 0.4}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={accent} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}
