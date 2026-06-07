import { LegalDocPage } from "@/components/LegalDocPage";
import { ACCESSIBILITY } from "@/lib/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הצהרת נגישות — Clix",
  description:
    "כך Clix בונה עבור כולם התקנים שאנחנו שואפים אליהם, מה כבר יושם, ומה עוד בתהליך.",
};

export default function AccessibilityPage() {
  return <LegalDocPage doc={ACCESSIBILITY} />;
}
