import { LegalDocPage } from "@/components/LegalDocPage";
import { TERMS } from "@/lib/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תנאי שימוש — Clix",
  description: "התנאים החלים על השימוש שלכם באתר clixsolution.com ועל ההתקשרויות עם Clix.",
};

export default function TermsPage() {
  return <LegalDocPage doc={TERMS} />;
}
