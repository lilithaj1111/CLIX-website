import Link from "next/link";
import { MapPin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative z-[2] border-t border-line bg-paper overflow-hidden">
      {/* Blue radial wash — anchors the footer with brand colour without
          fighting the cream/paper surface. Two blooms (bottom-left + right)
          plus a hairline accent stripe along the top border. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(900px 480px at 12% 110%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 65%),
            radial-gradient(700px 420px at 92% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%),
            radial-gradient(500px 340px at 60% 100%, color-mix(in srgb, var(--accent-deep) 12%, transparent), transparent 70%)
          `,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent) 55%, transparent) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <Logo size={56} />
            <p className="mt-6 max-w-md text-foreground/70 text-[15px] leading-relaxed">
              סוכני AI, אוטומציות WhatsApp, מערכות CRM, אינטגרציות ותוכנה
              מותאמת אישית נבנים כדי לצמוח יחד איתכם.
            </p>
            {/* Mobile: single-line phrases stacked vertically, smaller type. */}
            <div className="mt-8 md:hidden text-3xl tracking-tight leading-[1.15]">
              <p className="serif-italic font-normal">תוכנה שעובדת,</p>
              <p className="font-semibold mt-1">תוצאות שמדברות.</p>
            </div>

            {/* Desktop: 2-column composition with stacked words per column. */}
            <div className="mt-8 hidden md:flex items-start gap-4 text-5xl md:text-6xl leading-[1.05] tracking-tight">
              <span className="serif-italic font-normal whitespace-pre-line">
                {"תוכנה\nשעובדת,"}
              </span>
              <span className="font-semibold whitespace-pre-line">
                {"תוצאות\nשמדברות."}
              </span>
            </div>
          </div>

          <div className="col-span-2 md:col-span-4 md:col-start-9">
            <div className="eyebrow">צרו קשר</div>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li>
                <a
                  href="mailto:info@clixsolution.com"
                  className="link-underline hover:text-accent"
                >
                  info@clixsolution.com
                </a>
              </li>
              <li className="text-foreground/70">
                א׳–ה׳ · 09:00–18:00
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/W3P4cqXgveANBH9p8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex items-center gap-1.5 text-foreground/70 hover:text-accent"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
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
              className="group mt-5 block overflow-hidden rounded-xl border border-line shadow-[0_18px_40px_-26px_rgba(11,19,38,0.25)] transition-colors duration-500 hover:border-accent/50"
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

        <div className="mt-16 pt-6 border-t border-line flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-foreground/60 font-mono">
          <div>© {new Date().getFullYear()} Clix Solutions. כל הזכויות שמורות.</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
            <Link href="/privacy" className="hover:text-foreground link-underline">
              מדיניות פרטיות
            </Link>
            <Link href="/terms" className="hover:text-foreground link-underline">
              תנאי שימוש
            </Link>
            <Link href="/accessibility" className="hover:text-foreground link-underline">
              הצהרת נגישות
            </Link>
            <a href="#top" className="hover:text-foreground">
              ↑ חזרה למעלה
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
