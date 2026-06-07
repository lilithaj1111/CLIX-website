"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Light-theme RTL variant of the TuringLanding hero, adapted for the
 * Clix Hebrew site. Colour palette inverted from the original
 * dark/blue version: paper-cream surface, baby-blue + lime gradient
 * overlays, dark-slate text. Layout mirrored so the headline sits on
 * the right and the stats on the left (matches RTL reading order).
 *
 * The video background is the same generative motion clip from the
 * original demo; on a light surface it sits behind the gradient wash
 * and reads as a subtle living texture rather than the foreground.
 */
export function TuringLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-paper text-foreground overflow-x-hidden relative"
    >
      {/* Baby-blue + lime gradient overlays — replaces the original
          blue-only wash. Stacked diagonally so the colour story moves
          across the section rather than sitting on one side. */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(to left, color-mix(in srgb, #93C5FD 35%, transparent), transparent 60%)",
            opacity: 0.7,
          }}
        />
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(to top right, color-mix(in srgb, #A3E635 30%, transparent), transparent 60%)",
            opacity: 0.65,
          }}
        />
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 80%, color-mix(in srgb, #BEF264 32%, transparent), transparent 70%)",
          }}
        />
      </div>

      <main className="main min-h-screen pt-[300px] pb-20 relative">
        {/* Hero video background — kept from the original spec. On the
            light surface it composites under the gradient wash and
            reads as a subtle texture, not a focal element. */}
        <video
          className="hero-video absolute -top-[20%] left-0 w-full h-[120%] object-cover z-0 opacity-50 mix-blend-multiply"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://mybycketvercelprojecttest.s3.sa-east-1.amazonaws.com/animation-bg.mp4"
            type="video/mp4"
          />
        </video>

        <div className="content-wrapper max-w-[1400px] mx-auto px-[60px] flex justify-between items-end relative z-[2]">
          {/* Right column (RTL: first child) — value proposition */}
          <div className="max-w-[800px]">
            <h1 className="text-[80px] font-light leading-[1.1] mb-8 tracking-[-2px] text-ink">
              האיצו את הפריסה
              <br />
              של בינה מלאכותית
            </h1>
            <p className="text-lg leading-relaxed text-foreground/70 mb-12 font-normal">
              ארגונים מובילים סומכים עלינו לפתור אתגרים עסקיים
              <br />
              ולהגדיל פרודוקטיביות באמצעות מערכות חכמות.
            </p>
            <div className="flex gap-5 items-center">
              <button className="flex items-center gap-2.5 bg-[#3B82F6] text-white py-3.5 px-7 rounded-md text-base font-medium hover:bg-[#2563EB] hover:-translate-x-0.5 transition-all duration-200">
                בואו נתחיל
                <ArrowRight className="w-5 h-5 -scale-x-100" />
              </button>
              <button className="bg-transparent text-foreground/70 py-3.5 px-7 text-base font-medium hover:text-foreground transition-colors duration-200">
                למידע נוסף
              </button>
            </div>
          </div>

          {/* Left column (RTL: second child) — stats */}
          <div className="flex gap-20 items-end">
            <div className="text-center">
              <div className="text-[64px] font-light leading-none mb-3 text-ink">
                +40
              </div>
              <div className="text-base text-foreground/65 font-normal">
                ענפים שחידשנו
              </div>
            </div>
            <div className="text-center">
              <div className="text-[64px] font-light leading-none mb-3 text-ink">
                +3M
              </div>
              <div className="text-base text-foreground/65 font-normal">
                מומחים זמינים
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
