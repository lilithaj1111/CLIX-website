"use client";

import dynamic from "next/dynamic";

const ProjectSceneInner = dynamic(
  () => import("./ProjectScene").then((m) => m.ProjectScene),
  { ssr: false, loading: () => null }
);

export function ProjectSceneLazy(props: { color: string; className?: string }) {
  return <ProjectSceneInner {...props} />;
}
