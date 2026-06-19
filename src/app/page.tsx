// Home page — UiPath-style layout (flat alternating light/dark bands, bold
// headlines, clean card grids), built entirely from Clix data.
import { HeroUiPath } from "@/components/home/HeroUiPath";
import { SolutionsTabs } from "@/components/home/SolutionsTabs";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { LecturesSection } from "@/components/LecturesSection";
import { WorkGallery } from "@/components/home/WorkGallery";
import { Testimonial } from "@/components/Testimonial";
import { FinalCTABand } from "@/components/home/FinalCTABand";

export default function Home() {
  return (
    <>
      {/* Dark hero */}
      <HeroUiPath />
      {/* Light — solutions by industry (tabbed) */}
      <SolutionsTabs />
      {/* Dark — platform / what we build */}
      <PlatformFeatures />
      {/* Light — lectures, trainings & consulting */}
      <LecturesSection />
      {/* White — customer results gallery */}
      <WorkGallery />
      {/* Dark — video testimonials as UiPath news cards */}
      <Testimonial />
      {/* Dark — closing CTA band */}
      <FinalCTABand />
    </>
  );
}
