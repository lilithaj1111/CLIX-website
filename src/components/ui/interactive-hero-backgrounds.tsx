"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
  Vector2,
  Vector3,
  MeshPhysicalMaterial,
  Color,
  Object3D,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  Raycaster,
  Plane,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";
import { WebGLShader } from "@/components/ui/web-gl-shader";

/* ────────────────────────────────────────────────────────────────────────────
 * Interactive ball-pit hero (physics spheres that follow the cursor), adapted
 * from the 21st.dev component to the Clix codebase: dropped next-themes (the
 * site is single-theme), recoloured the spheres to the accent-blue family, and
 * wrapped it in a Hebrew/RTL hero with a lime radial glow + the site's CTAs.
 * The Three.js classes (scene, physics, instanced spheres) are kept intact.
 * ──────────────────────────────────────────────────────────────────────── */

// --- Three.js scene boilerplate ---
class X {
  #config: any;
  #resizeObserver?: ResizeObserver;
  #intersectionObserver?: IntersectionObserver;
  #resizeTimer?: number;
  #animationFrameId: number = 0;
  #clock: Clock = new Clock();
  #animationState = { elapsed: 0, delta: 0 };
  #isAnimating: boolean = false;
  #isVisible: boolean = false;
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  scene: Scene;
  renderer: WebGLRenderer;
  size: any = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  onBeforeRender: (state: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize: (size: any) => void = () => {};

  constructor(config: any) {
    this.#config = config;
    this.canvas = this.#config.canvas;
    this.camera = new PerspectiveCamera(50, 1, 0.1, 100);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      alpha: true,
      antialias: true,
      ...this.#config.rendererOptions,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.canvas.style.display = "block";
    this.#initObservers();
    this.resize();
  }
  #initObservers() {
    const parentEl =
      this.#config.size === "parent" ? (this.canvas.parentNode as Element) : null;
    if (parentEl) {
      this.#resizeObserver = new ResizeObserver(this.#onResize.bind(this));
      this.#resizeObserver.observe(parentEl);
    } else {
      window.addEventListener("resize", this.#onResize.bind(this));
    }
    this.#intersectionObserver = new IntersectionObserver(
      this.#onIntersection.bind(this),
      { threshold: 0 }
    );
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", this.#onVisibilityChange.bind(this));
  }
  #onResize() {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = window.setTimeout(this.resize.bind(this), 100);
  }
  resize() {
    const parentEl =
      this.#config.size === "parent" ? (this.canvas.parentNode as HTMLElement) : null;
    const w = parentEl ? parentEl.offsetWidth : window.innerWidth;
    const h = parentEl ? parentEl.offsetHeight : window.innerHeight;
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    this.camera.aspect = this.size.ratio;
    this.camera.updateProjectionMatrix();
    const fovRad = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.z;
    this.size.wWidth = this.size.wHeight * this.camera.aspect;
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.onAfterResize(this.size);
  }
  #onIntersection(e: any) {
    this.#isAnimating = e[0].isIntersecting;
    this.#isAnimating ? this.#startAnimation() : this.#stopAnimation();
  }
  #onVisibilityChange() {
    if (this.#isAnimating) document.hidden ? this.#stopAnimation() : this.#startAnimation();
  }
  #startAnimation() {
    if (this.#isVisible) return;
    this.#isVisible = true;
    this.#clock.start();
    const f = () => {
      this.#animationFrameId = requestAnimationFrame(f);
      this.#animationState.delta = this.#clock.getDelta();
      this.#animationState.elapsed += this.#animationState.delta;
      this.onBeforeRender(this.#animationState);
      this.renderer.render(this.scene, this.camera);
    };
    f();
  }
  #stopAnimation() {
    if (this.#isVisible) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#isVisible = false;
      this.#clock.stop();
    }
  }
  dispose() {
    this.#stopAnimation();
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    window.removeEventListener("resize", this.#onResize.bind(this));
    document.removeEventListener("visibilitychange", this.#onVisibilityChange.bind(this));
    this.scene.clear();
    this.renderer.dispose();
  }
}

// --- Physics ---
class W {
  config: any;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center: Vector3 = new Vector3();

  constructor(config: any) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count);
    this.velocityData = new Float32Array(3 * config.count);
    this.sizeData = new Float32Array(config.count);
    this.#initializePositions();
    this.setSizes();
  }
  #initializePositions() {
    const { count, maxX, maxY, maxZ } = this.config;
    this.center.toArray(this.positionData, 0);
    for (let i = 1; i < count; i++) {
      const idx = 3 * i;
      this.positionData[idx] = MathUtils.randFloatSpread(2 * maxX);
      this.positionData[idx + 1] = MathUtils.randFloatSpread(2 * maxY);
      this.positionData[idx + 2] = MathUtils.randFloatSpread(2 * maxZ);
    }
  }
  setSizes() {
    const { count, size0, minSize, maxSize } = this.config;
    this.sizeData[0] = size0;
    for (let i = 1; i < count; i++) this.sizeData[i] = MathUtils.randFloat(minSize, maxSize);
  }
  update(deltaInfo: { delta: number }) {
    const { config, center, positionData, sizeData, velocityData } = this;
    const startIdx = config.controlSphere0 ? 1 : 0;
    if (config.controlSphere0) {
      new Vector3().fromArray(positionData, 0).lerp(center, 0.1).toArray(positionData, 0);
      new Vector3(0, 0, 0).toArray(velocityData, 0);
    }
    for (let i = startIdx; i < config.count; i++) {
      const base = 3 * i;
      const pos = new Vector3().fromArray(positionData, base);
      const vel = new Vector3().fromArray(velocityData, base);
      vel.y -= deltaInfo.delta * config.gravity * sizeData[i];
      vel.multiplyScalar(config.friction);
      vel.clampLength(0, config.maxVelocity);
      pos.add(vel);
      for (let j = i + 1; j < config.count; j++) {
        const otherBase = 3 * j;
        const otherPos = new Vector3().fromArray(positionData, otherBase);
        const diff = new Vector3().subVectors(otherPos, pos);
        const dist = diff.length();
        const sumRadius = sizeData[i] + sizeData[j];
        if (dist < sumRadius) {
          const overlap = (sumRadius - dist) * 0.5;
          diff.normalize();
          pos.addScaledVector(diff, -overlap);
          otherPos.addScaledVector(diff, overlap);
          pos.toArray(positionData, base);
          otherPos.toArray(positionData, otherBase);
        }
      }
      if (Math.abs(pos.x) + sizeData[i] > config.maxX) {
        pos.x = Math.sign(pos.x) * (config.maxX - sizeData[i]);
        vel.x *= -config.wallBounce;
      }
      if (pos.y - sizeData[i] < -config.maxY) {
        pos.y = -config.maxY + sizeData[i];
        vel.y *= -config.wallBounce;
      }
      if (Math.abs(pos.z) + sizeData[i] > config.maxZ) {
        pos.z = Math.sign(pos.z) * (config.maxZ - sizeData[i]);
        vel.z *= -config.wallBounce;
      }
      pos.toArray(positionData, base);
      vel.toArray(velocityData, base);
    }
  }
}

// --- Instanced spheres ---
const U = new Object3D();
class Z extends InstancedMesh {
  config: any;
  physics: W;
  ambientLight: AmbientLight;
  light: PointLight;
  constructor(renderer: WebGLRenderer, params: any) {
    const pmrem = new PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment()).texture;
    pmrem.dispose();
    const geometry = new SphereGeometry(1, 24, 24);
    const material = new MeshPhysicalMaterial({ envMap: envTexture, ...params.materialParams });
    super(geometry, material, params.count);
    this.config = params;
    this.physics = new W(this.config);
    this.ambientLight = new AmbientLight(0xffffff, params.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(0xffffff, params.lightIntensity, 100, 1);
    this.add(this.light);
    this.setColors(this.config.colors);
  }
  setColors(colors: (string | Color)[]) {
    if (!Array.isArray(colors) || !colors.length) return;
    const colorObjs = colors.map((c) => (c instanceof Color ? c : new Color(c)));
    for (let i = 0; i < this.count; i++) this.setColorAt(i, colorObjs[i % colorObjs.length]);
    if (this.instanceColor) this.instanceColor.needsUpdate = true;
  }
  update(deltaInfo: { delta: number }) {
    this.physics.update(deltaInfo);
    for (let i = 0; i < this.count; i++) {
      U.position.fromArray(this.physics.positionData, 3 * i);
      U.scale.setScalar(this.physics.sizeData[i]);
      U.updateMatrix();
      this.setMatrixAt(i, U.matrix);
    }
    this.instanceMatrix.needsUpdate = true;
    if (this.config.controlSphere0) this.light.position.fromArray(this.physics.positionData, 0);
  }
}

// --- Pointer ---
const pointer = new Vector2();
function onPointerMove(e: PointerEvent) {
  pointer.set(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
}

const defaultBallpitConfig = {
  count: 200,
  materialParams: { metalness: 0.82, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.15 },
  minSize: 0.4,
  maxSize: 0.9,
  size0: 1.0,
  gravity: 0.4,
  friction: 0.995,
  wallBounce: 0.2,
  maxVelocity: 0.1,
  maxX: 10,
  maxY: 10,
  maxZ: 10,
  controlSphere0: true,
  followCursor: true,
  lightIntensity: 3.5,
  ambientIntensity: 1.6,
};

// Accent-blue sphere palette (Clix tokens).
const BLUE_BALLS = ["#1E4DB8", "#3B7BF5", "#5C93F7", "#7FA9F7", "#A9CFF0"];

// Hero palette — the blue family with a lime accent dropped in roughly every
// eighth sphere (colours are assigned i % length), so a glossy blue pit gets
// occasional brand-lime pops without tipping green.
const HERO_BALLS = [
  "#1E4DB8",
  "#2F6BF0",
  "#3B7BF5",
  "#5C93F7",
  "#7FA9F7",
  "#A9CFF0",
  "#3B7BF5",
  "#A3E635",
];

type BallpitProps = {
  className?: string;
  colors?: (string | Color)[];
  config?: Partial<typeof defaultBallpitConfig>;
};

export function Ballpit({ className = "", colors = BLUE_BALLS, config = {} }: BallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const merged = useMemo(
    () => ({ ...defaultBallpitConfig, ...config, colors }),
    [config, colors]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const three = new X({ canvas, size: "parent" });
    three.renderer.toneMapping = ACESFilmicToneMapping;
    three.camera.position.set(0, 0, 20);
    three.resize();

    const spheres = new Z(three.renderer, merged);
    three.scene.add(spheres);

    const raycaster = new Raycaster();
    const plane = new Plane(new Vector3(0, 0, 1), 0);
    const intersectionPoint = new Vector3();

    // Rest the cursor-led sphere below the viewport so it isn't parked over the
    // headline before the first pointer move; it snaps to the cursor on hover.
    if (merged.followCursor) {
      pointer.set(0, -1.6);
      window.addEventListener("pointermove", onPointerMove);
    }

    three.onBeforeRender = (deltaInfo) => {
      if (merged.followCursor) {
        raycaster.setFromCamera(pointer, three.camera);
        if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
          spheres.physics.center.copy(intersectionPoint);
        }
      }
      spheres.update(deltaInfo);
    };

    three.onAfterResize = (size) => {
      spheres.physics.config.maxX = size.wWidth / 2;
      spheres.physics.config.maxY = size.wHeight / 2;
      spheres.physics.config.maxZ = size.wWidth / 4;
    };

    return () => {
      if (merged.followCursor) window.removeEventListener("pointermove", onPointerMove);
      three.dispose();
    };
  }, [merged]);

  return <canvas ref={canvasRef} aria-hidden className={cn("block h-full w-full", className)} />;
}

// Stable config reference so the Ballpit effect runs once.
const HERO_BALLPIT_CONFIG: Partial<typeof defaultBallpitConfig> = {
  count: 180,
  // Vivid, candy-glossy shell: low metalness lets the brand colours read
  // (high metalness would mirror the room and wash them out); strong clearcoat
  // gives the wet, premium highlight.
  materialParams: { metalness: 0.4, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.08 },
  minSize: 0.45,
  maxSize: 0.95,
  size0: 0.7, // cursor-led sphere blends in with the rest (no obvious "special" ball)
  // Light gravity + bouncy walls + near-frictionless air keeps the spheres
  // drifting and rebounding across the whole frame instead of dead-piling at
  // the bottom — a buoyant, premium orb field rather than a literal ball pit.
  gravity: 0.16,
  friction: 0.998,
  wallBounce: 0.5,
  maxVelocity: 0.14,
  controlSphere0: true, // sphere 0 follows the cursor and carries the light
  followCursor: true, // the field reacts to the mouse — the engaging moment
  lightIntensity: 3.8,
  ambientIntensity: 1.75,
};

/* The marketing payoff line. Each phrase is the full second line of the
   headline and is grammatically self-contained — every one agrees with the
   feminine-plural subject "מערכות" (…עונות / מוכרות / חוסכות), so the swap
   never breaks. Outcome-led, specific, no hype filler. The rotation itself
   carries meaning: it shows the breadth of what the systems actually do. */
const HERO_PHRASES = [
  "שעונות 24/7.",
  "שמוכרות לבד.",
  "שחוסכות שעות.",
  "שלא נחות לרגע.",
  "שפשוט עובדות.",
];

/** Cycles the headline payoff line with a soft slide-up + blur swap. Honors
 *  reduced-motion by rendering a single stable phrase. */
function RotatingPayoff() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setI((n) => (n + 1) % HERO_PHRASES.length),
      2600
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  if (reduce) {
    return <span className="block text-accent">{HERO_PHRASES[0]}</span>;
  }

  // Phrases stack in one centred grid cell and crossfade. The cell auto-sizes
  // to the current phrase — one line on wide screens, two when a longer phrase
  // wraps on mobile — so there's no fixed reserve leaving a big gap, and no
  // overflow that would overlap the paragraph below.
  return (
    <span className="grid min-h-[1.18em] place-items-center">
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "0.14em", filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.14em", filter: "blur(7px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="[grid-area:1/1] block text-accent"
        >
          {HERO_PHRASES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function BallpitHero() {
  const reduce = useReducedMotion();
  return (
    <section
      dir="rtl"
      className="relative flex h-[100svh] min-h-[640px] max-h-[920px] flex-col items-center justify-center overflow-hidden px-6 pb-[14vh] text-center"
      style={{
        background:
          "linear-gradient(165deg, #EFF6FD 0%, #E6F0F8 50%, #DEEAF6 100%)",
      }}
    >
      {/* Living aurora — two slow-drifting glow layers (lime + blue) that
          parallax against each other behind the grid. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            "radial-gradient(48% 60% at 4% 26%, color-mix(in srgb, #A3E635 34%, transparent), transparent 68%)",
            "radial-gradient(40% 52% at 14% 82%, color-mix(in srgb, #BEF264 26%, transparent), transparent 70%)",
            "radial-gradient(48% 60% at 96% 28%, color-mix(in srgb, #A3E635 34%, transparent), transparent 68%)",
            "radial-gradient(40% 52% at 86% 84%, color-mix(in srgb, #BEF264 26%, transparent), transparent 70%)",
          ].join(", "),
        }}
        animate={
          reduce ? undefined : { scale: [1, 1.08, 1], x: ["0%", "1.5%", "0%"], y: ["0%", "-1.5%", "0%"] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            "radial-gradient(58% 54% at 50% 96%, color-mix(in srgb, #7FA9F7 30%, transparent), transparent 74%)",
            "radial-gradient(42% 48% at 26% 6%, color-mix(in srgb, #93C5FD 24%, transparent), transparent 72%)",
            "radial-gradient(42% 48% at 76% 4%, color-mix(in srgb, #BFD3FB 22%, transparent), transparent 72%)",
          ].join(", "),
        }}
        animate={
          reduce ? undefined : { scale: [1, 1.1, 1], x: ["0%", "-2%", "0%"], y: ["0%", "2%", "0%"] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* tech grid pattern (SVG) — faint accent lines with a few lit cells */}
      <GridPattern
        width={46}
        height={46}
        animateSquares
        squares={[
          // spread across the full width so the centre-masked cluster stays
          // balanced at any zoom (low columns also cover narrow / mobile)
          [1, 5],
          [3, 10],
          [4, 3],
          [6, 7],
          [8, 11],
          [10, 4],
          [12, 8],
          [14, 2],
          [15, 11],
          [17, 6],
          [19, 9],
          [21, 3],
          [23, 7],
          [25, 11],
          [27, 5],
          [29, 9],
          [31, 3],
          [33, 8],
          [35, 6],
          [37, 10],
          [39, 4],
        ]}
        className="z-[2] [mask-image:radial-gradient(82%_78%_at_50%_44%,#000_24%,transparent_82%)]"
      />

      {/* animated flowing lines — blue + lime, recoloured for the light backdrop */}
      <WebGLShader className="absolute inset-0 z-[2] block h-full w-full" />

      {/* soft scrim behind the headline for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "radial-gradient(58% 48% at 50% 43%, color-mix(in srgb, #F4F8FD 86%, transparent) 0%, color-mix(in srgb, #F4F8FD 48%, transparent) 44%, transparent 72%)",
        }}
      />

      {/* bottom fade — melts the hero into the section below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-36"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg) 92%)" }}
      />

      {/* content */}
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Headline. Line 1 is the fixed positioning ("AI systems"); line 2 is
            the rotating outcome promise — the marketing centerpiece. aria-label
            gives assistive tech one clean, stable sentence. */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.6rem,6.4vw,5.4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-ink"
          aria-label="מערכות AI שעובדות בשביל העסק שלכם"
        >
          <span aria-hidden className="block">
            מערכות AI
          </span>
          <span aria-hidden>
            <RotatingPayoff />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-base leading-[1.7] text-foreground/70 md:text-lg"
        >
          מתכננים, בונים ומתחזקים את כל מערך ה-AI של העסק מהאסטרטגיה ועד
          השורה האחרונה בקוד. אתם מתפנים לגדול, המערכת דואגת לשאר.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/contact"
            className="btn-shine btn-violet inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 pe-2 ps-7 text-sm font-medium text-on-dark sm:w-auto"
          >
            בואו נתחיל
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/40 text-paper backdrop-blur-sm">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/playground"
            className="inline-flex w-full items-center justify-center rounded-full border border-foreground/25 bg-paper/80 px-7 py-3 text-sm font-medium backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:w-auto"
          >
            נסו את הפלייגראונד
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default BallpitHero;
