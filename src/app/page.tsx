// Home page — hero followed by the marketing sections. (redeploy trigger v2)
import { ParticleHero } from "@/components/ParticleHero";
import { WhisperReveal } from "@/components/WhisperReveal";
import { IntegrationsSection } from "@/components/IntegrationsSection";
import { VoiceAgentSection } from "@/components/VoiceAgentSection";
import { ProductsSection } from "@/components/ProductsSection";
import { LecturesSection } from "@/components/LecturesSection";
import { Process } from "@/components/Process";
import { Testimonial } from "@/components/Testimonial";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <ParticleHero />
      {/* Contents slides UP and OVER the pinned particle hero. Its leading edge
          is a "whisper reveal": a soft gradient that dissolves the black hero
          into the page background (near-white) — at rest it reads as a gentle
          white band at the foot of the hero; on scroll it sweeps up and the
          black goes solid white (Gemini-style). */}
      <div className="relative z-10">
        <WhisperReveal />
        {/* Opaque content — bg-background keeps it solid so it covers the hero. */}
        <div className="bg-background">
          <IntegrationsSection />
          <VoiceAgentSection />
          <ProductsSection />
          <Testimonial />
          <LecturesSection />
          <Process />
          <CTA />
        </div>
      </div>
    </>
  );
}
