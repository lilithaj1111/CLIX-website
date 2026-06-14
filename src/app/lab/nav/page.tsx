import { NavLab } from "@/components/NavLab";
import { ParticleHero } from "@/components/ParticleHero";

/**
 * /lab/nav — preview the experimental Gemini-style transparent navbar over the
 * real dark particle hero. The global <Nav> hides itself on this route so the
 * two don't stack. Live nav stays untouched.
 */
export const metadata = {
  title: "Lab · navbar",
  robots: { index: false, follow: false },
};

export default function LabNav() {
  return (
    <>
      <NavLab />
      <ParticleHero />
      <div className="relative z-10 bg-background" dir="rtl">
        <section className="flex min-h-screen items-center justify-center px-6 text-center">
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-semibold tracking-[-0.03em]">
            תוכן לבדיקת הנאבבר
          </h2>
        </section>
      </div>
    </>
  );
}
