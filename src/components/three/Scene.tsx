"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * Lazy router for the four 3D scenes. SSR-disabled so pages stay statically
 * prerendered and three.js never reaches the server bundle.
 *
 * Each scene is also viewport-gated: the actual canvas only mounts while it's
 * near the viewport and UNMOUNTS when scrolled well away — so off-screen
 * scenes do zero GPU/CPU work and free their WebGL context. This matters most
 * on mobile, where several always-on canvases drain the battery. A wrapper div
 * keeps the original box so layout never shifts.
 */
const ClixOrb = dynamic(
  () => import("./ClixOrb").then((m) => m.ClixOrb),
  { ssr: false, loading: () => null }
);
const FloatingShards = dynamic(
  () => import("./FloatingShards").then((m) => m.FloatingShards),
  { ssr: false, loading: () => null }
);
const GridWave = dynamic(
  () => import("./GridWave").then((m) => m.GridWave),
  { ssr: false, loading: () => null }
);
const StreamRibbon = dynamic(
  () => import("./StreamRibbon").then((m) => m.StreamRibbon),
  { ssr: false, loading: () => null }
);
const NetworkGraph = dynamic(
  () => import("./NetworkGraph").then((m) => m.NetworkGraph),
  { ssr: false, loading: () => null }
);
const ParticleWave = dynamic(
  () => import("./ParticleWave").then((m) => m.ParticleWave),
  { ssr: false, loading: () => null }
);
const FlowMesh = dynamic(
  () => import("./FlowMesh").then((m) => m.FlowMesh),
  { ssr: false, loading: () => null }
);

export type SceneKind =
  | "orb"
  | "shards"
  | "grid"
  | "ribbon"
  | "network"
  | "wave"
  | "flow";

export type SceneProps = {
  kind?: SceneKind;
  density?: number;
  scale?: number;
  position?: [number, number, number];
  accentMix?: number;
  className?: string;
};

function pick(kind: SceneKind, props: Omit<SceneProps, "kind">) {
  switch (kind) {
    case "shards":
      return <FloatingShards {...props} />;
    case "grid":
      return <GridWave {...props} />;
    case "ribbon":
      return <StreamRibbon {...props} />;
    case "network":
      return <NetworkGraph {...props} />;
    case "wave":
      return <ParticleWave {...props} />;
    case "flow":
      return <FlowMesh {...props} />;
    case "orb":
    default:
      return <ClixOrb {...props} />;
  }
}

export function Scene({ kind = "orb", className = "", ...rest }: SceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // mount a little before it scrolls in, unmount once it's well past
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "300px 0px 300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Wrapper preserves the original box (so layout never shifts); the heavy
  // canvas mounts only while `active`.
  return (
    <div ref={ref} className={className} aria-hidden>
      {active ? pick(kind, { ...rest, className }) : null}
    </div>
  );
}
