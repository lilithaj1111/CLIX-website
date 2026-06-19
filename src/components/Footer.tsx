import Link from "next/link";
import { MapPin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative z-[2] border-t border-white/10 bg-ink-warm overflow-hidden text-on-dark">
      {/* Soft slate glow — subtle depth on the dark charcoal footer. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(900px 480px at 12% 110%, color-mix(in srgb, var(--accent-2) 14%, transparent), transparent 65%),
            radial-gradient(700px 420px at 92% 0%, color-mix(in srgb, var(--accent-2) 9%, transparent), transparent 70%)
          `,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent-2) 45%, transparent) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <Logo size={56} className="text-on-dark" />
            <p className="mt-6 max-w-md text-on-dark/65 text-[15px] leading-relaxed">
              סוכני AI, אוטומציות WhatsApp, מערכות CRM, אינטגרציות ותוכנה
              מותאמת אישית נבנים כדי לצמוח יחד איתכם.
            </p>
            {/* Mobile: single-line phrases stacked vertically, smaller type. */}
            <div className="mt-8 md:hidden text-3xl tracking-tight leading-[1.15]">
              <p className="font-bold text-[#A9BDD0]">תוכנה שעובדת,</p>
              <p className="font-bold mt-1 text-on-dark">תוצאות שמדברות.</p>
            </div>

            {/* Desktop: 2-column composition with stacked words per column. */}
            <div className="mt-8 hidden md:flex items-start gap-4 text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              <span className="text-[#A9BDD0] whitespace-pre-line">
                {"תוכנה\nשעובדת,"}
              </span>
              <span className="text-on-dark whitespace-pre-line">
                {"תוצאות\nשמדברות."}
              </span>
            </div>
          </div>

          <div className="col-span-2 md:col-span-4 md:col-start-9">
            <div className="eyebrow text-on-dark/55">צרו קשר</div>
            <ul className="mt-4 space-y-2.5 text-[15px] text-on-dark/85">
              <li>
                <a
                  href="mailto:info@clixsolution.com"
                  className="link-underline hover:text-[#A9BDD0]"
                >
                  info@clixsolution.com
                </a>
              </li>
              <li className="text-on-dark/60">
                א׳–ה׳ · 09:00–18:00
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/W3P4cqXgveANBH9p8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex items-center gap-1.5 text-on-dark/70 hover:text-[#A9BDD0]"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-[#8CA0B3]" strokeWidth={1.75} />
                  תל אביב · שירות גלובלי
                </a>
              </li>
            </ul>

            {/* Tel Aviv map — interactive, lazy-loaded, lightly desaturated to
                sit calmly on the paper surface; colour comes up on hover. */}
            <a
              href="https://maps.app.goo.gl/W3P4cqXgveANBH9p8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="פתיחת המיקום של Clix בתל אביב ב-Google Maps"
              className="group mt-5 block overflow-hidden rounded-xl border border-white/10 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.5)] transition-colors duration-500 hover:border-white/30"
            >
              <iframe
                title="מפת מיקום — תל אביב"
                src="https://www.google.com/maps?q=32.0852999,34.7817676&z=12&hl=iw&output=embed"
                className="pointer-events-none block h-[320px] w-full border-0 grayscale-[0.35] transition-[filter] duration-500 group-hover:grayscale-0 sm:h-[380px] md:h-[260px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-on-dark/55 font-mono">
          <div>© {new Date().getFullYear()} Clix Solutions. כל הזכויות שמורות.</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
            <Link href="/privacy" className="hover:text-on-dark link-underline">
              מדיניות פרטיות
            </Link>
            <Link href="/terms" className="hover:text-on-dark link-underline">
              תנאי שימוש
            </Link>
            <Link href="/accessibility" className="hover:text-on-dark link-underline">
              הצהרת נגישות
            </Link>
            <a href="#top" className="hover:text-on-dark">
              ↑ חזרה למעלה
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
