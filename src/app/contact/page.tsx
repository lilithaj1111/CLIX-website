import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "צרו קשר — Clix",
  description: "ספרו לנו על הפרויקט שלכם, ונחזור אליכם תוך יום עסקים אחד.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={<span>צרו קשר</span>}
        title={
          <>
            ספרו לנו מה
            <br />
            אתם{" "}
            <span className="serif-italic text-accent">
              מתכננים לבנות.
            </span>
          </>
        }
        scene="ribbon"
        sceneSide="full"
        sceneProps={{ accentMix: 0.6, scale: 1.05, density: 1.2 }}
      />

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <Reveal className="md:col-span-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 sm:gap-y-8">
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/60">
                    אימייל
                  </div>
                  <a
                    href="mailto:info@clixsolution.com"
                    className="mt-2 block text-[17px] hover:text-accent"
                  >
                    info@clixsolution.com
                  </a>
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/60">
                    WhatsApp
                  </div>
                  <a
                    href="https://wa.me/972559483457"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-[17px] hover:text-accent"
                  >
                    +972 55-948-3457
                  </a>
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/60">
                    שעות פעילות
                  </div>
                  <div className="mt-2 text-[17px]">א׳–ה׳ · 09:00–18:00</div>
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/60">
                    מיקום
                  </div>
                  <div className="mt-2 text-[17px]">פעילות גלובלית</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="md:col-span-6 md:col-start-7">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
