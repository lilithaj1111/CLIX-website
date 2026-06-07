import { LegalDocPage } from "@/components/LegalDocPage";
import { PRIVACY } from "@/lib/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות פרטיות — Clix",
  description:
    "מה Clix אוספת, לאיזה צורך, וכיצד תוכלו לעיין במידע או לבקש את מחיקתו.",
};

export default function PrivacyPage() {
  return <LegalDocPage doc={PRIVACY} />;
}
