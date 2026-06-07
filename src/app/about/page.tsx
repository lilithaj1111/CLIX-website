import { CTA } from "@/components/CTA";
import { TeamSection } from "@/components/about/TeamSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אודותינו — Clix",
  description:
    "Clix היא חברה ותיקה ובכירה שמפתחת סוכני AI, אוטומציות ותוכנה ייעודית עבור ארגונים שלוקחים את התשתיות הטכנולוגיות שלהם ברצינות.",
};

export default function AboutPage() {
  return (
    <>
      <TeamSection />

      <CTA />
    </>
  );
}
