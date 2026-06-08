import { VideoHero } from "@/components/VideoHero";
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
      <VideoHero />
      <IntegrationsSection />
      <VoiceAgentSection />
      <ProductsSection />
      <Testimonial />
      <LecturesSection />
      <Process />
      <CTA />
    </>
  );
}
