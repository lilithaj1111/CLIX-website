"use client";

import { AureliaClinicAnimation } from "./AureliaClinicAnimation";
import { AtlasFinanceAnimation } from "./AtlasFinanceAnimation";
import { KindredSupportAnimation } from "./KindredSupportAnimation";
import { LoomlyFactoryAnimation } from "./LoomlyFactoryAnimation";
import { NorthwindAgentAnimation } from "./NorthwindAgentAnimation";
import { ProjectSceneLazy } from "../three/ProjectSceneLazy";

type AnimationCmp = (props: { className?: string }) => React.JSX.Element;

const REGISTRY: Record<string, AnimationCmp> = {
  "northwind-sales-agent": NorthwindAgentAnimation,
  "aurelia-clinic-crm": AureliaClinicAnimation,
  "loomly-ops-portal": LoomlyFactoryAnimation,
  "kindred-support-copilot": KindredSupportAnimation,
  "atlas-finance-flows": AtlasFinanceAnimation,
};

/**
 * Dispatches to a per-project cinematic animation by slug. If a project
 * doesn't have a bespoke animation yet, falls back to the generic
 * `ProjectSceneLazy` torus-knot scene tinted with the project's accent.
 */
export function ProjectTileAnimation({
  slug,
  accent,
  className = "",
}: {
  slug: string;
  accent: string;
  className?: string;
}) {
  const Animation = REGISTRY[slug];
  if (Animation) {
    return <Animation className={className} />;
  }
  return (
    <ProjectSceneLazy
      color={accent}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}
