"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * ParticleLogo — the home hero particle field (promoted from the /lab experiment).
 *
 *  - Intro: a small, compressed Clix mark at the centre EXPANDS to full size.
 *  - Continuous SLOW morph cycle through HOLLOW 3D tube shapes:
 *      logo → circle (torus) → square (tube) → triangle (tube) → logo → …
 *  - One colour for ALL particles, cycling to a new colour every 1.7s.
 *  - Scroll down → the field morphs into the Clix logo.
 *  - Alive fluid flow + gentle sway + free drag-orbit.
 * ──────────────────────────────────────────────────────────────────────── */

const VERT = `
  uniform float uTime;
  uniform float uScale;
  uniform float uSize;
  uniform float uMorph;
  uniform float uFlowAmp;
  uniform float uScrollForm;
  uniform int uShapeA;
  uniform int uShapeB;
  attribute vec3 aLogo;
  attribute vec3 aTorus;
  attribute vec3 aSquare;
  attribute vec3 aTri;
  attribute float aPhase;
  vec3 shapeAt(int idx) {
    if (idx == 0) return aLogo;
    else if (idx == 1) return aTorus;
    else if (idx == 2) return aSquare;
    return aTri;
  }
  void main() {
    vec3 cyclePos = mix(shapeAt(uShapeA), shapeAt(uShapeB), uMorph);
    vec3 base = mix(cyclePos, aLogo, uScrollForm);   // scroll down → Clix logo
    float ft = uTime * 0.35;
    vec3 flow = vec3(
      sin(ft + base.y * 0.5 + aPhase),
      sin(ft * 0.9 + base.x * 0.5 + aPhase * 1.3),
      sin(ft * 1.15 + (base.x + base.y) * 0.35 + aPhase * 0.7)
    );
    base += flow * uFlowAmp;
    vec4 mv = modelViewMatrix * vec4(base, 1.0);
    gl_PointSize = uSize * (uScale / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uBright;
  uniform vec3 uColor;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(uColor * uBright, tex.a * uOpacity);
  }
`;

// colour cycle — one vivid colour for the whole field, switching every 1.7s
const CYCLE = [
  new THREE.Color("#FF3B5C"), new THREE.Color("#FF9A3B"), new THREE.Color("#FFE03B"),
  new THREE.Color("#46E86B"), new THREE.Color("#3BE0FF"), new THREE.Color("#3B7BFF"),
  new THREE.Color("#A24BFF"), new THREE.Color("#FF3BD0"),
];
const COLOR_EVERY = 10;
// The shapes cycle hues, but the Clix LOGO (scroll-formed) settles to brand blue.
const LOGO_BLUE = new THREE.Color("#3B7BF5");
// Intro colour beat: the forming logo goes blue → yellow → then the random cycle.
const INTRO_YELLOW = new THREE.Color("#FFC400");

export function ParticleLogo({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const MIN_DT = isMobile ? 1 / 32 : 0; // cap mobile redraw to ~32fps (halves GPU fill on capable devices)
    const N = isMobile ? 7000 : 44000;    // lighter particle count on mobile
    const WORLD = isMobile ? 11 : 28;      // smaller mark on mobile (fit naturally on the screen)
    const S = isMobile ? 0.40 : 1;         // smaller shapes on mobile

    const g1 = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    let logo: Float32Array | null = null;

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
        const cropW = Math.min(iw, Math.round(ih * 1.08));
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
        logo = new Float32Array(N * 3);
        const M = pts.length / 2;
        for (let i = 0; i < N; i++) {
          const k = Math.floor(Math.random() * M) * 2, px = pts[k], py = pts[k + 1];
          const hs = spread[i] * 1.7;                     // gentler halo on the logo (keep the mark readable)
          logo[i * 3] = (px - cxm) * scale + g1() * 0.28 + g1() * hs;
          logo[i * 3 + 1] = -(py - cym) * scale + g1() * 0.28 + g1() * hs;
          logo[i * 3 + 2] = (Math.random() - 0.5) * 7.0 + g1() * 0.6 + g1() * hs; // wide Z volume
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

    const pr = Math.min(window.devicePixelRatio || 1, isMobile ? 0.8 : 1.5); // lower DPR = big mobile fill-rate win
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, powerPreference: "high-performance" }); // no MSAA on mobile
    renderer.setPixelRatio(pr);
    const size = () => { const r = canvas.getBoundingClientRect(); return { w: r.width || window.innerWidth, h: r.height || window.innerHeight }; };
    let { w, h } = size(); renderer.setSize(w, h, false);
    const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x000000, 0.01);
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200); camera.position.set(0, 0, 26);

    const uniforms = {
      uTime: { value: 0 }, uScale: { value: h * 0.5 }, uSize: { value: 0.27 * pr * (isMobile ? 0.72 : 1) },
      uMorph: { value: 0 }, uShapeA: { value: 0 }, uShapeB: { value: 0 }, uFlowAmp: { value: 0.18 },
      uScrollForm: { value: 0 }, uOpacity: { value: 1.0 }, uBright: { value: 2.4 }, uMap: { value: sprite() }, uColor: { value: LOGO_BLUE.clone() },
    };
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });

    const dustGeo = new THREE.BufferGeometry();
    { const n = isMobile ? 500 : 2200, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - .5) * 130; p[i * 3 + 1] = (Math.random() - .5) * 90; p[i * 3 + 2] = (Math.random() - .5) * 130; } dustGeo.setAttribute("position", new THREE.BufferAttribute(p, 3)); }
    const dustMat = new THREE.PointsMaterial({ size: 0.07, color: 0x222a40, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
    scene.add(new THREE.Points(dustGeo, dustMat));

    const aPhase = new Float32Array(N);
    for (let i = 0; i < N; i++) aPhase[i] = Math.random() * Math.PI * 2;
    const torus = new Float32Array(N * 3), square = new Float32Array(N * 3), tri = new Float32Array(N * 3);

    // halo: particles drift OFF the shape outline into a soft surrounding cloud →
    // real volume, not a thin shell. Two tiers: a NEAR cloud hugging the form, plus
    // sparse OUTER wisps scattered well beyond it. spread[i] is per-particle and
    // consistent across every shape.
    const HALO_FRAC = 0.22, OUTER_FRAC = 0.11, HALO = 2.4 * S;
    const spread = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = Math.random();
      spread[i] = r < OUTER_FRAC ? 2.6 + Math.random() * 2.4                 // outer wisps — scattered a bit far
        : r < OUTER_FRAC + HALO_FRAC ? 0.4 + Math.random() * Math.random() * 2.0 // near halo hugging the form
          : 0;                                                                // on the outline
    }

    // place a particle on a hollow FRAME edge (ax,ay)->(bx,by): thin IN-PLANE band
    // (width `wall`) but THICK in Z (`depth`) → thin from the front, volume from the
    // side. `bend` bows the edge slightly inward (0 at corners, max at mid-edge).
    function tube(arr: Float32Array, o: number, ax: number, ay: number, bx: number, by: number, wall: number, depth: number, bend: number) {
      const t = Math.random();
      let px = ax + (bx - ax) * t, py = ay + (by - ay) * t;
      const m = Math.sin(Math.PI * t) * bend, pl = Math.hypot(px, py) || 1;
      px -= (px / pl) * m; py -= (py / pl) * m;        // concave edge
      let dx = bx - ax, dy = by - ay; const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
      const nx = -dy, ny = dx;                          // in-plane normal
      const ip = (Math.random() * 2 - 1) * wall;        // thin band in-plane
      arr[o] = px + nx * ip; arr[o + 1] = py + ny * ip; arr[o + 2] = (Math.random() * 2 - 1) * depth;
    }

    function buildShapes() {
      const R = 13.2 * S, WALL = 0.5 * S, DEPTH = 5.4 * S; // donut: bigger ring, thin wall, thick Z
      const H = 13.8 * S, bend = 2.5 * S;                  // diamond half-extent
      const Rt = 16.4 * S, bendT = 3.4 * S;                // triangle circumradius
      const TV = [0, 1, 2].map((k) => { const a = Math.PI / 2 + k * (2 * Math.PI / 3); return [Math.cos(a) * Rt, Math.sin(a) * Rt]; });
      const SQ = [[0, H], [H, 0], [0, -H], [-H, 0]]; // diamond (square tilted 45°)
      for (let i = 0; i < N; i++) {
        const o = i * 3;
        // circle = a ring WALL (cylinder): thin radially (front = thin ring), thick in Z (side = volume)
        { const a = Math.random() * Math.PI * 2, wr = R + (Math.random() * 2 - 1) * WALL;
          torus[o] = wr * Math.cos(a); torus[o + 1] = wr * Math.sin(a); torus[o + 2] = (Math.random() * 2 - 1) * DEPTH; }
        // hollow square frame (thin band, thick Z, bowed inward)
        { const s = Math.floor(Math.random() * 4), c0 = SQ[s], c1 = SQ[(s + 1) % 4]; tube(square, o, c0[0], c0[1], c1[0], c1[1], WALL, DEPTH, bend); }
        // hollow triangle frame (thin band, thick Z, bowed inward)
        { const e = Math.floor(Math.random() * 3), c0 = TV[e], c1 = TV[(e + 1) % 3]; tube(tri, o, c0[0], c0[1], c1[0], c1[1], WALL, DEPTH, bendT); }
        // halo: push the drift particles off each outline into a soft surrounding cloud
        if (spread[i] > 0) {
          const hs = spread[i] * HALO;
          torus[o] += g1() * hs; torus[o + 1] += g1() * hs; torus[o + 2] += g1() * hs;
          square[o] += g1() * hs; square[o + 1] += g1() * hs; square[o + 2] += g1() * hs;
          tri[o] += g1() * hs; tri[o + 1] += g1() * hs; tri[o + 2] += g1() * hs;
        }
      }
    }

    let geo: THREE.BufferGeometry | null = null, points: THREE.Points | null = null;

    let raf = 0, lastT = performance.now() / 1000, lastInteract = -100;
    let introStage = 0, introT = 0, cycleT = 0, scrollForm = 0, clockT = 0, bootT = 0, introColT = 0;   // 0 reveal, 2 cycle+loop
    let dragging = false, dpx = 0, dpy = 0, rotY = 0, rotX = 0, tRotY = 0, tRotX = 0, velY = 0, velX = 0;
    const REVEAL = 1.5, CLOCK_STEP = 10.0, CLOCK_A = 1.0, STAGE = 22, HOLD = 6.0, CLOCK_CRAWL = 1.0;
    const INTRO_DELAY = 2.7; // hold the mark hidden until the hero text + CTA finish rendering (see ParticleHero timing)
    const CLOCK_MAXV = 0.22; // rad/s — cap so resuming after a drag CRAWLS back, never snaps
    const LIFT_WORLD = 13.5; // ≈ half the camera's visible world-height: raise the logo per viewport scrolled so it stays centred above the sliding content
    const CLOCKS = [[-0.5, 0.866], [1, 0], [0.5, -0.866], [-0.866, -0.5], [0, 0]]; // 11,3,5,8,centre (dx,dy)
    const ss = (p: number) => { p = Math.min(1, Math.max(0, p)); return p * p * (3 - 2 * p); };
    const colA = new THREE.Color(), colB = new THREE.Color(), colC = new THREE.Color(), colD = new THREE.Color();

    const onDown = (e: PointerEvent) => { dragging = true; dpx = e.clientX; dpy = e.clientY; tRotY = rotY; tRotX = rotX; velY = velX = 0; lastInteract = performance.now() / 1000; canvas.style.cursor = "grabbing"; };
    const onUp = () => { dragging = false; lastInteract = performance.now() / 1000; canvas.style.cursor = "grab"; };
    const onDrag = (e: PointerEvent) => { if (!dragging) return; tRotY += (e.clientX - dpx) * 0.004; if (!isMobile) tRotX += (e.clientY - dpy) * 0.004; dpx = e.clientX; dpy = e.clientY; lastInteract = performance.now() / 1000; }; // mobile: horizontal rotates, vertical scrolls
    const onResize = () => { const s = size(); w = s.w; h = s.h; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false); uniforms.uScale.value = h * 0.5; };

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      now /= 1000;
      if (now - lastT < MIN_DT) return;                 // ~32fps cap on mobile (MIN_DT = 0 on desktop)
      const t = now, dt = Math.min(0.05, t - lastT); lastT = t;
      if (window.scrollY > window.innerHeight * 1.05) return;

      // scroll down → Clix logo
      const sfTarget = Math.min(1, window.scrollY / (window.innerHeight * 0.40));
      scrollForm += (sfTarget - scrollForm) * 0.08;
      uniforms.uScrollForm.value = scrollForm;

      // hold the mark fully HIDDEN until the hero text + buttons have rendered
      // (don't collapse to scale 0 — that stacks every particle into one bright dot)
      if (bootT < INTRO_DELAY) {
        bootT += dt;
        if (points) points.visible = false;
        uniforms.uTime.value = t;
        renderer.render(scene, camera);
        return;
      }
      if (points && !points.visible) points.visible = true;
      introColT += dt; // drives the blue → yellow → cycle intro colour beat

      if (introStage === 0) {
        // reveal: super-compressed dot → full logo, held CENTRED
        introT += dt;
        const e = ss(Math.min(1, introT / REVEAL));
        if (points) points.scale.setScalar(0.015 + 0.985 * e);
        uniforms.uShapeA.value = 0; uniforms.uShapeB.value = 0; uniforms.uMorph.value = 0;
        rotY += (0 - rotY) * 0.12; rotX += (0 - rotX) * 0.12;
        if (introT >= REVEAL) { introStage = 2; cycleT = 0; clockT = 0; }
      } else {
        // shape cycle
        if (points) points.scale.setScalar(1);
        cycleT += dt;
        const stage = Math.floor(cycleT / STAGE) % 4;
        const local = cycleT % STAGE;
        uniforms.uShapeA.value = stage;
        uniforms.uShapeB.value = (stage + 1) % 4;
        uniforms.uMorph.value = local < HOLD ? 0 : ss((local - HOLD) / (STAGE - HOLD));
        // rotation: heavy drag-orbit, else a smooth LOOPING clock tumble: centre→11→3→5→8→centre→…
        const free = (t - lastInteract) < 6.0;
        if (dragging) {
          const ny = rotY + (tRotY - rotY) * 0.06, nx = rotX + (tRotX - rotX) * 0.06; // heavy, laggy follow
          velY = ny - rotY; velX = nx - rotX; rotY = ny; rotX = nx;
        } else if (free) {
          rotY += velY; rotX += velX; velY *= 0.965; velX *= 0.965;                   // long, heavy glide
        } else {
          clockT += dt;
          const period = CLOCKS.length * CLOCK_STEP, ph = clockT % period;
          const idx = Math.floor(ph / CLOCK_STEP), frac = (ph % CLOCK_STEP) / CLOCK_STEP;
          const prev = CLOCKS[(idx - 1 + CLOCKS.length) % CLOCKS.length], cur = CLOCKS[idx];
          const m = Math.min(1, frac / CLOCK_CRAWL);     // LINEAR constant-velocity crawl (no ease = no snap)
          const k = 1 - scrollForm;                       // settle to centre/front when scrolled to the logo
          const tgtY = (prev[0] + (cur[0] - prev[0]) * m) * CLOCK_A * k;
          const tgtX = -(prev[1] + (cur[1] - prev[1]) * m) * CLOCK_A * k;
          const cap = CLOCK_MAXV * dt;                    // speed limit → no instant catch-up after a drag
          const dY = (tgtY - rotY) * 0.16, dX = (tgtX - rotX) * 0.16; // heavy, smooth follow
          rotY += Math.max(-cap, Math.min(cap, dY));
          rotX += Math.max(-cap, Math.min(cap, dX));
          velY *= 0.9; velX *= 0.9;
        }
        // scroll down → FORCE the mark to face front (rotation → 0) so the Clix logo
        // reads clearly, overriding any drag/clock tilt as the logo forms.
        const face = scrollForm * scrollForm;
        rotY += (0 - rotY) * face * 0.25;
        rotX += (0 - rotX) * face * 0.25;
      }
      uniforms.uTime.value = t;

      // intro colour beat: blue → yellow, then hand off to the random hue cycle
      colC.copy(LOGO_BLUE).lerp(INTRO_YELLOW, ss((introColT - 1.6) / 0.7)); // blue, then yellow by ~2.3s
      // random hue cycle (hold, then crossfade)
      const ci = Math.floor(t / COLOR_EVERY), cf = t / COLOR_EVERY - ci;
      colA.copy(CYCLE[ci % CYCLE.length]); colB.copy(CYCLE[(ci + 1) % CYCLE.length]);
      colD.copy(colA).lerp(colB, ss((cf - 0.8) / 0.2));
      // hand off intro → cycle after the yellow beat, then bias to brand blue as the logo forms
      const handoff = ss((introColT - 3.2) / 1.0);
      (uniforms.uColor.value as THREE.Color).copy(colC).lerp(colD, handoff).lerp(LOGO_BLUE, scrollForm);
      uniforms.uBright.value = 2.4 - 1.0 * scrollForm; // ease brightness down so the logo blue stays saturated

      if (points) {
        points.rotation.y = rotY; points.rotation.x = rotX;
        // Float gently while idle, then settle + RISE as the logo forms so it stays
        // centred in the strip still visible above the sliding content.
        const idle = 1 - scrollForm;
        const sf = Math.min(1, window.scrollY / (h || window.innerHeight));
        points.position.set(
          Math.sin(t * 0.16) * 0.6 * idle,
          Math.sin(t * 0.23) * 0.7 * idle + sf * LIFT_WORLD,
          0,
        );
      }
      renderer.render(scene, camera);
    }

    let cancelled = false;
    loadMark().then((ok) => {
      if (cancelled) return;
      if (!ok) { logo = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const a = Math.random() * Math.PI * 2, rr = 7 + g1() * 1.4; logo[i * 3] = Math.cos(a) * rr; logo[i * 3 + 1] = Math.sin(a) * rr; logo[i * 3 + 2] = (Math.random() - 0.5) * 0.9; } }
      buildShapes();
      geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(logo!, 3));
      geo.setAttribute("aLogo", new THREE.BufferAttribute(logo!, 3));
      geo.setAttribute("aTorus", new THREE.BufferAttribute(torus, 3));
      geo.setAttribute("aSquare", new THREE.BufferAttribute(square, 3));
      geo.setAttribute("aTri", new THREE.BufferAttribute(tri, 3));
      geo.setAttribute("aPhase", new THREE.BufferAttribute(aPhase, 1));
      points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      points.scale.setScalar(0.05);
      scene.add(points);

      if (reduce) { introStage = 2; points.scale.setScalar(1); uniforms.uShapeA.value = 0; uniforms.uShapeB.value = 0; uniforms.uMorph.value = 0; renderer.render(scene, camera); return; }

      window.addEventListener("resize", onResize);
      canvas.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      window.addEventListener("pointermove", onDrag);
      if (isMobile) canvas.style.touchAction = "pan-y"; // vertical = scroll, horizontal drag = rotate
      else canvas.style.cursor = "grab";
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onDrag);
      geo?.dispose(); mat.dispose(); dustGeo.dispose(); dustMat.dispose();
      (uniforms.uMap.value as THREE.Texture)?.dispose(); renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}

export default ParticleLogo;
