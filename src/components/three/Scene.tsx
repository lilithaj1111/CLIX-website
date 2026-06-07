"use client";

import dynamic from "next/dynamic";

/**
 * Lazy router for the four 3D scenes. SSR-disabled so pages stay statically
 * prerendered and three.js never reaches the server bundle.
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

export function Scene({ kind = "orb", ...rest }: SceneProps) {
  switch (kind) {
    case "shards":
      return <FloatingShards {...rest} />;
    case "grid":
      return <GridWave {...rest} />;
    case "ribbon":
      return <StreamRibbon {...rest} />;
    case "network":
      return <NetworkGraph {...rest} />;
    case "wave":
      return <ParticleWave {...rest} />;
    case "flow":
      return <FlowMesh {...rest} />;
    case "orb":
    default:
      return <ClixOrb {...rest} />;
  }
}
