// Home page — hero followed by the marketing sections. (redeploy trigger)
import { ParticleHero } from "@/components/ParticleHero";
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
      {/* Opaque content that slides UP and OVER the pinned particle hero
          (sharp top edge). bg-background keepss it solid so it covers the hero. */}
      <div className="relative z-10 bg-background">
        <IntegrationsSection />
        <VoiceAgentSection />
        <ProductsSection />
        <Testimonial />
        <LecturesSection />
        <Process />
        <CTA />
      </div>
    </>
  );
}
