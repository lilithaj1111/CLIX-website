"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Animated three.js canvas — torus-knot "silk weave" of ~50k
 * particles, gently rotating and reacting to mouse position. The
 * particle palette is sampled from a baby-blue gradient (sky-blue →
 * light cornflower → soft periwinkle) so the canvas reads as a calm
 * brand-aligned backdrop.
 *
 * Designed to be dropped as an absolute backdrop inside a relative
 * parent (`absolute inset-0 z-0` on the canvas root). Content layered
 * on top should use a higher z-index.
 */
export function WovenCanvas({ className = "absolute inset-0 z-0" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0); // transparent canvas
    mount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // ── Particle weave ───────────────────────────────────────────
    const PARTICLE_COUNT = 50_000;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    const geometry = new THREE.BufferGeometry();
    const sourceGeom = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);
    const posAttr = sourceGeom.attributes.position;
    const vertCount = posAttr.count;

    // Baby-blue palette — sky → light cornflower → soft periwinkle.
    // Stays inside the pale-blue range so the weave reads as one calm
    // brand-aligned tone rather than a multi-colour ribbon.
    const palette = [
      new THREE.Color(0xbfdbfe), // baby blue
      new THREE.Color(0x93c5fd), // sky blue
      new THREE.Color(0x7dd3fc), // sky cyan
      new THREE.Color(0x60a5fa), // light cornflower
      new THREE.Color(0xa5b4fc), // soft periwinkle
      new THREE.Color(0x93c5fd), // back toward sky
      new THREE.Color(0xbfdbfe), // baby blue (loop close)
    ];
    const sampleColor = (t: number, out: THREE.Color) => {
      const x = Math.min(1, Math.max(0, t)) * (palette.length - 1);
      const i = Math.floor(x);
      const f = x - i;
      const a = palette[i];
      const b = palette[Math.min(palette.length - 1, i + 1)];
      out.set(0, 0, 0).lerpColors(a, b, f);
    };

    const tmpColor = new THREE.Color();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const vIndex = i % vertCount;
      const x = posAttr.getX(vIndex);
      const y = posAttr.getY(vIndex);
      const z = posAttr.getZ(vIndex);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Sample colour based on particle index → smooth blue→lime band.
      // A bit of noise per particle so the weave doesn't read as solid.
      const t = (i / PARTICLE_COUNT + Math.sin(i * 0.0011) * 0.06 + 1) % 1;
      sampleColor(t, tmpColor);
      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      // NormalBlending so coloured particles read against the cream
      // page surface. AdditiveBlending would lift everything to white
      // on a light background and the weave would disappear.
      size: 0.03,
      vertexColors: true,
      blending: THREE.NormalBlending,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Interaction + animation ──────────────────────────────────
    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const mouseWorld = new THREE.Vector3();
    let rafId = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      mouseWorld.set(mouse.x * 3, mouse.y * 3, 0);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const cx = positions[ix];
        const cy = positions[iy];
        const cz = positions[iz];

        // Inline distance-to-mouse — avoids per-particle Vector3 alloc.
        const dx = cx - mouseWorld.x;
        const dy = cy - mouseWorld.y;
        const dz = cz - mouseWorld.z;
        const dist = Math.hypot(dx, dy, dz);

        let vx = velocities[ix];
        let vy = velocities[iy];
        let vz = velocities[iz];

        if (dist < 1.5 && dist > 0.001) {
          const force = (1.5 - dist) * 0.01;
          vx += (dx / dist) * force;
          vy += (dy / dist) * force;
          vz += (dz / dist) * force;
        }

        // Spring back to origin
        vx += (originalPositions[ix] - cx) * 0.001;
        vy += (originalPositions[iy] - cy) * 0.001;
        vz += (originalPositions[iz] - cz) * 0.001;

        // Damping
        vx *= 0.95;
        vy *= 0.95;
        vz *= 0.95;

        positions[ix] = cx + vx;
        positions[iy] = cy + vy;
        positions[iz] = cz + vz;
        velocities[ix] = vx;
        velocities[iy] = vy;
        velocities[iz] = vz;
      }
      geometry.attributes.position.needsUpdate = true;

      points.rotation.y = elapsed * 0.05;
      points.rotation.x = Math.sin(elapsed * 0.07) * 0.1;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    if (reducedMotion) {
      // Render one static frame, no animation loop.
      renderer.render(scene, camera);
    } else {
      rafId = requestAnimationFrame(animate);
    }

    // ── Resize handling ──────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      ro.disconnect();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      sourceGeom.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden />;
}
