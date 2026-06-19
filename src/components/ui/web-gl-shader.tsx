"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Full-bleed animated WebGL shader — chromatic sine-wave "light streams".
 * Tuned for a LIGHT backdrop: the canvas is transparent and the streams are
 * drawn as translucent blue + lime strokes (lime emphasised) that composite
 * over whatever sits behind the canvas. Renders into a contained,
 * absolutely-positioned canvas sized to its parent (not the window).
 */
export function WebGLShader({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.OrthographicCamera | null;
    renderer: THREE.WebGLRenderer | null;
    mesh: THREE.Mesh | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uniforms: any;
    animationId: number | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const { current: refs } = sceneRef;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

        // Translucent blue + lime streaks for a light backdrop. The line
        // intensity drives alpha; colour leans lime where the distorted
        // channel dominates (lime emphasised), blue elsewhere. Output is
        // premultiplied (col * alpha) to match three's default blending.
        vec3 blue = vec3(0.663, 0.741, 0.816); // #A9BDD0 lighter blue
        vec3 lime = vec3(0.549, 0.627, 0.702); // #8CA0B3 muted blue-grey

        float sum = r + g + b;
        vec3 col = mix(blue, lime, clamp((b * 1.5) / (sum + 0.001), 0.0, 1.0));

        // Lighter & glowier: a faint core plus a wider, stronger soft halo
        // (sqrt spreads the falloff outward into a bloom) for an airy glow.
        float core = clamp(sum * 0.23, 0.0, 0.54);
        float halo = clamp(sqrt(sum) * 0.17, 0.0, 0.40);
        float alpha = clamp(core + halo, 0.0, 0.80);
        col = clamp(col * 1.24, 0.0, 1.0);

        gl_FragColor = vec4(col * alpha, alpha);
      }
    `;

    const sizeOf = () => {
      const rect = canvas.getBoundingClientRect();
      return {
        w: Math.max(1, Math.round(rect.width)),
        h: Math.max(1, Math.round(rect.height)),
      };
    };

    const initScene = () => {
      refs.scene = new THREE.Scene();
      refs.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.setClearColor(0x000000, 0);

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

      const { w, h } = sizeOf();
      refs.uniforms = {
        resolution: { value: [w, h] },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.5 },
        distortion: { value: 0.05 },
      };

      const position = [
        -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0,
        1.0, 0.0, 1.0, 1.0, 0.0,
      ];

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", positions);

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
        transparent: true,
      });

      refs.mesh = new THREE.Mesh(geometry, material);
      refs.scene.add(refs.mesh);

      handleResize();
    };

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.01;
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
      refs.animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return;
      const { w, h } = sizeOf();
      refs.renderer.setSize(w, h, false);
      refs.uniforms.resolution.value = [w, h];
    };

    initScene();
    animate();

    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);
    window.addEventListener("resize", handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh);
        refs.mesh.geometry.dispose();
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose();
        }
      }
      refs.renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className || "absolute inset-0 block h-full w-full"}
    />
  );
}
