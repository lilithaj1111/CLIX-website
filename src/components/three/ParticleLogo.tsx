"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * ParticleLogo — a 3D particle field that forms the Clix mark.
 *
 * Performance: ALL per-particle motion (scatter wander, scatter→mark morph,
 * breathe, depth) runs on the GPU in the vertex shader. The CPU only updates a
 * couple of uniforms per frame (uForm, uTime) and the object's rotation — so
 * there's no 44k-element JS loop and no per-frame buffer upload. Render
 * resolution is capped, and rendering pauses while the hero is scrolled away.
 *
 * Behaviour (unchanged): ~44k additive particles sampled from the LEFTMOST
 * SQUARE of /clix-logo.png (the mark), centred + extruded for real depth.
 * `form` ∈ [0,1] driven by scroll → built/centred by ~40% scroll; idle
 * auto-build/scatter at the top; slow auto-rotate while scattered, front-facing
 * & still when formed; free drag-orbit with inertia. Reduced-motion → static.
 * ──────────────────────────────────────────────────────────────────────── */

const VERT = `
  uniform float uForm;
  uniform float uTime;
  uniform float uScale;
  uniform float uSize;
  attribute vec3 aTarget;
  attribute vec3 aColor;
  attribute float aPhase;
  attribute float aTh;
  attribute float aSpd;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    float e = smoothstep(aTh, aTh + 0.5, uForm);
    // scattered wander around the all-around home (position = scatter base)
    vec3 s = position;
    s.x += sin(uTime * 0.10 * aSpd + aPhase) * 1.6;
    s.y += sin(uTime * 0.09 * aSpd + aPhase * 1.7) * 1.6;
    s.z += sin(uTime * 0.11 * aSpd + aPhase * 0.6) * 1.6;
    float br = 0.09 * sin(uTime * 0.6 + aPhase);            // tiny breathe when formed
    vec3 tgt = aTarget + vec3(br, br, br * 0.6);
    vec3 p = mix(s, tgt, e);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (uScale / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(vColor, tex.a * uOpacity);          // additive: rgb weighted by sprite alpha
  }
`;

export function ParticleLogo({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // device tier — scale the work to the hardware (same effects, lighter on phones)
    const isMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const N = isMobile ? 20000 : 44000;          // particle count
    const WORLD = isMobile ? 12 : 18.5;          // mark size (fits a narrow screen)
    const SX = isMobile ? 18 : 32, SY = 20, SZ = isMobile ? 11 : 16; // scatter spread

    // bright, on-theme blues end-to-end (no near-black outer tones) so the mark
    // reads as a luminous theme-blue logo. core → accent.
    const PAL = [
      new THREE.Color("#EAF6FF"), new THREE.Color("#C8E2FF"),
      new THREE.Color("#8FC0FF"), new THREE.Color("#5C93F7"), new THREE.Color("#3B7BF5"),
    ];
    const MAG = new THREE.Color("#9FE0FF"); // bright cyan sparkle (on-theme)
    const colorFor = (t: number, out: THREE.Color) => {
      if (Math.random() < 0.035) { out.copy(MAG); return; }
      const f = Math.min(0.999, Math.max(0, t)) * (PAL.length - 1), i = Math.floor(f);
      out.copy(PAL[i]).lerp(PAL[i + 1], f - i);
    };
    const g1 = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    let logo: Float32Array | null = null, lcol: Float32Array | null = null;

    async function loadMark(): Promise<boolean> {
      try {
        const img = await new Promise<HTMLImageElement>((res, rej) => {
          const im = new Image(); im.crossOrigin = "anonymous";
          im.onload = () => res(im); im.onerror = rej; im.src = "/clix-logo.png";
        });
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const cv = document.createElement("canvas"); cv.width = iw; cv.height = ih;
        const cx = cv.getContext("2d")!; cx.drawImage(img, 0, 0);
        const d = cx.getImageData(0, 0, iw, ih).data;
        const cropW = Math.min(iw, Math.round(ih * 1.08)); // leftmost square ≈ the mark
        let pts: number[] = [], minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, opaque = 0;
        for (let y = 0; y < ih; y++) for (let x = 0; x < cropW; x++) {
          if (d[(y * iw + x) * 4 + 3] > 140) { opaque++; pts.push(x, y); if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
        }
        if (opaque < 1500) {
          pts = []; minX = 1e9; maxX = -1e9; minY = 1e9; maxY = -1e9;
          for (let y = 0; y < ih; y++) for (let x = 0; x < cropW; x++) {
            const i = (y * iw + x) * 4, l = (d[i] + d[i + 1] + d[i + 2]) / 3;
            if (d[i + 3] > 40 && l < 140) { pts.push(x, y); if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
          }
        }
        if (pts.length < 400) return false;
        const bw = maxX - minX, bh = maxY - minY, cxm = (minX + maxX) / 2, cym = (minY + maxY) / 2;
        const scale = WORLD / Math.max(bw, bh);
        logo = new Float32Array(N * 3); lcol = new Float32Array(N * 3);
        const c = new THREE.Color(); const M = pts.length / 2;
        for (let i = 0; i < N; i++) {
          const k = Math.floor(Math.random() * M) * 2, px = pts[k], py = pts[k + 1];
          logo[i * 3] = (px - cxm) * scale + g1() * 0.28;
          logo[i * 3 + 1] = -(py - cym) * scale + g1() * 0.28;
          logo[i * 3 + 2] = (Math.random() - 0.5) * 5.0 + g1() * 0.5;
          const dist = Math.hypot((px - cxm) / (bw / 2), (py - cym) / (bh / 2));
          colorFor(dist * 0.9, c); const b = 0.7 + Math.random() * 0.55;
          lcol[i * 3] = Math.min(1, c.r * b); lcol[i * 3 + 1] = Math.min(1, c.g * b); lcol[i * 3 + 2] = Math.min(1, c.b * b);
        }
        return true;
      } catch { return false; }
    }

    const sprite = () => {
      const cv = document.createElement("canvas"); cv.width = cv.height = 64;
      const x = cv.getContext("2d")!, gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.35, "rgba(255,255,255,.7)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
      const t = new THREE.Texture(cv); t.needsUpdate = true; return t;
    };

    const pr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5); // cap render resolution
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(pr);
    const size = () => { const r = canvas.getBoundingClientRect(); return { w: r.width || window.innerWidth, h: r.height || window.innerHeight }; };
    let { w, h } = size(); renderer.setSize(w, h, false);
    const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x000000, 0.01);
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200); camera.position.set(0, 0, 26);

    const uniforms = {
      uForm: { value: 0 }, uTime: { value: 0 },
      uScale: { value: h * 0.5 }, uSize: { value: 0.165 * pr * (isMobile ? 1.35 : 1) },
      uOpacity: { value: 0.95 }, uMap: { value: sprite() },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms, vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });

    // faint starfield (cheap, static)
    const dustGeo = new THREE.BufferGeometry();
    { const n = isMobile ? 1100 : 2200, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - .5) * 130; p[i * 3 + 1] = (Math.random() - .5) * 90; p[i * 3 + 2] = (Math.random() - .5) * 130; } dustGeo.setAttribute("position", new THREE.BufferAttribute(p, 3)); }
    const dustMat = new THREE.PointsMaterial({ size: 0.08, color: 0x223f73, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
    scene.add(new THREE.Points(dustGeo, dustMat));

    const scat = new Float32Array(N * 3);
    const phase = new Float32Array(N), th = new Float32Array(N), spd = new Float32Array(N);
    for (let i = 0; i < N; i++) { phase[i] = Math.random() * Math.PI * 2; th[i] = Math.random() * 0.5; spd[i] = 0.7 + Math.random() * 0.8; }
    function buildScatter() {
      for (let i = 0; i < N; i++) { const o = i * 3; scat[o] = (Math.random() * 2 - 1) * SX; scat[o + 1] = (Math.random() * 2 - 1) * SY; scat[o + 2] = (Math.random() * 2 - 1) * SZ; }
    }

    let geo: THREE.BufferGeometry | null = null, points: THREE.Points | null = null;

    let raf = 0, lastT = performance.now() / 1000, lastScroll = lastT, form = 0, intro = true;
    let autoW = 0, autoPhase = 0, synced = false;
    let dragging = false, dpx = 0, dpy = 0, rotY = 0, rotX = 0, velY = 0, velX = 0, lastInteract = -100;
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const AUTO_SPEED = 0.30, IDLE = 1.2;

    const onScroll = () => { lastScroll = performance.now() / 1000; synced = false; };
    const onMove = (e: MouseEvent) => { tmx = e.clientX / window.innerWidth - .5; tmy = e.clientY / window.innerHeight - .5; };
    const onDown = (e: PointerEvent) => { dragging = true; dpx = e.clientX; dpy = e.clientY; velY = velX = 0; lastInteract = performance.now() / 1000; canvas.style.cursor = "grabbing"; };
    const onUp = () => { dragging = false; lastInteract = performance.now() / 1000; canvas.style.cursor = "grab"; };
    const onDrag = (e: PointerEvent) => { if (!dragging) return; const dx = (e.clientX - dpx) * 0.006, dy = (e.clientY - dpy) * 0.006; rotY += dx; rotX += dy; velY = dx; velX = dy; dpx = e.clientX; dpy = e.clientY; lastInteract = performance.now() / 1000; };
    const onResize = () => { const s = size(); w = s.w; h = s.h; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false); uniforms.uScale.value = h * 0.5; };

    const ss = (a: number, b: number, x: number) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      now /= 1000; const t = now, dt = Math.min(0.05, t - lastT); lastT = t;

      // pause rendering while the hero is fully scrolled past / covered
      if (window.scrollY > window.innerHeight * 1.05) return;

      if (intro) {
        // fresh load → assemble the mark immediately (snappy entrance), then hand
        // off to the normal scroll / idle behaviour.
        form += (1 - form) * 0.09;
        if (form > 0.985 || window.scrollY > 4) intro = false;
      } else {
        const sf = Math.min(1, window.scrollY / (window.innerHeight * 0.40));
        const idle = (t - lastScroll) > IDLE && window.scrollY < window.innerHeight * 0.05;
        autoW += ((idle ? 1 : 0) - autoW) * (idle ? 0.02 : 0.10);
        if (idle && !synced) { autoPhase = Math.acos(Math.min(1, Math.max(-1, 1 - 2 * form))); synced = true; }
        if (idle) { const ph = autoPhase % (Math.PI * 2); autoPhase += dt * AUTO_SPEED * (ph < Math.PI ? 0.55 : 1.0); }
        const autoForm = 0.5 - 0.5 * Math.cos(autoPhase);
        const formTarget = sf * (1 - autoW) + autoForm * autoW;
        form += (formTarget - form) * 0.06;
      }
      uniforms.uForm.value = form;
      uniforms.uTime.value = t;
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;

      const spin = Math.max(0, 1 - form * 1.4);
      const free = (t - lastInteract) < 5.0;
      if (dragging) { /* pointer-driven */ }
      else if (free) { rotY += velY; rotX += velX; velY *= 0.94; velX *= 0.94; }
      else {
        rotY += dt * 0.16 * spin;
        const front = Math.round(rotY / (Math.PI * 2)) * Math.PI * 2;
        rotY += (front - rotY) * (1 - spin) * 0.05;
        rotX += (0 - rotX) * (1 - spin) * 0.05;
        velY *= 0.9; velX *= 0.9;
      }
      const ctrl = dragging || free;
      if (points) { points.rotation.y = rotY; points.rotation.x = rotX + (ctrl ? 0 : my * 0.05 * spin); }
      const camFac = ctrl ? 0 : spin;
      camera.position.x = mx * 1.4 * camFac; camera.position.y = -my * 1.1 * camFac; camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    let cancelled = false;
    loadMark().then((ok) => {
      if (cancelled) return;
      if (!ok) {
        logo = new Float32Array(N * 3); lcol = new Float32Array(N * 3); const c = new THREE.Color();
        for (let i = 0; i < N; i++) { const a = Math.random() * Math.PI * 2, rr = 7 + g1() * 1.4; logo[i * 3] = Math.cos(a) * rr; logo[i * 3 + 1] = Math.sin(a) * rr; logo[i * 3 + 2] = (Math.random() - 0.5) * 5; colorFor(Math.random(), c); lcol[i * 3] = c.r; lcol[i * 3 + 1] = c.g; lcol[i * 3 + 2] = c.b; }
      }
      buildScatter();
      geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(scat, 3));     // scatter home (static)
      geo.setAttribute("aTarget", new THREE.BufferAttribute(logo!, 3));     // mark target (static)
      geo.setAttribute("aColor", new THREE.BufferAttribute(lcol!, 3));
      geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
      geo.setAttribute("aTh", new THREE.BufferAttribute(th, 1));
      geo.setAttribute("aSpd", new THREE.BufferAttribute(spd, 1));
      points = new THREE.Points(geo, mat);
      scene.add(points);

      if (reduce) { uniforms.uForm.value = 1; uniforms.uTime.value = 0; renderer.render(scene, camera); return; }

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("wheel", onScroll, { passive: true });
      window.addEventListener("touchmove", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      if (!isMobile) {                          // desktop: cursor parallax + drag-to-orbit
        window.addEventListener("mousemove", onMove);
        canvas.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointermove", onDrag);
        canvas.style.cursor = "grab";
      }
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchmove", onScroll);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onDrag);
      window.removeEventListener("resize", onResize);
      geo?.dispose(); mat.dispose(); dustGeo.dispose(); dustMat.dispose();
      (uniforms.uMap.value as THREE.Texture)?.dispose(); renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}

export default ParticleLogo;
