// Home page — UiPath-style layout, arranged to match UiPath's homepage section
// order: hero → solutions → platform/ROI → customer gallery → resources →
// latest/news → closing CTA. Built entirely from Clix data.
import { HeroUiPath } from "@/components/home/HeroUiPath";
import { StackSection } from "@/components/home/StackSection";
import { SolutionsTabs } from "@/components/home/SolutionsTabs";
import { WorkGallery } from "@/components/home/WorkGallery";
import { Testimonial } from "@/components/Testimonial";
import { ResourcesGrid } from "@/components/home/ResourcesGrid";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { FinalCTABand } from "@/components/home/FinalCTABand";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <HeroUiPath />
      {/* The stack — every tool you use feeds one Clix brain */}
      <StackSection />
      {/* Latest from Clix — news/services cards */}
      <PlatformFeatures />
      {/* Solutions by industry (vertical tabs) */}
      <SolutionsTabs />
      {/* Platform / "Agentic AI meets ROI" — results cards */}
      <WorkGallery />
      {/* Gallery of customer achievement — testimonial carousel */}
      <Testimonial />
      {/* Resources — insights icon-grid (light wavy backdrop) */}
      <ResourcesGrid />
      {/* Closing CTA band */}
      <FinalCTABand />
    </>
  );
}
