import Link from "next/link";
import { MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { services } from "@/lib/services";
import { industries } from "@/lib/industries";

// lucide dropped brand glyphs, so inline a small Instagram mark.
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const companyLinks = [
  { href: "/work", label: "עבודות" },
  { href: "/insights", label: "תובנות" },
  { href: "/playground", label: "פלייגראונד" },
  { href: "/about", label: "אודותינו" },
  { href: "/contact", label: "צרו קשר" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[2] overflow-hidden border-t border-white/10 bg-ink-warm text-on-dark">
      {/* Soft slate glow + top accent hairline. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(900px 480px at 12% 110%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 65%),
            radial-gradient(700px 420px at 92% 0%, color-mix(in srgb, var(--accent-2) 14%, transparent), transparent 70%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent) 50%, transparent) 35%, color-mix(in srgb, var(--accent-2) 45%, transparent) 65%, transparent 100%)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1400px] px-6 lg:px-10 py-16 md:py-20">
        {/* ── Link columns (UiPath-style) ─────────────────────────────── */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand + connect */}
          <div className="col-span-2 md:col-span-4">
            <Logo size={48} className="text-on-dark" />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-on-dark/60">
              סוכני AI, אוטומציות, מערכות CRM ותוכנה מותאמת אישית — נבנים כדי
              לצמוח יחד איתכם.
            </p>

            <div className="mt-7">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-on-dark/45">
                בואו נתחבר
              </div>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href="https://www.instagram.com/clix_solution/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-on-dark/70 transition-colors hover:border-white/35 hover:bg-white/10 hover:text-on-dark"
                >
                  <InstagramIcon className="h-[18px] w-[18px]" />
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <FooterCol title="שירותים">
            {services.map((s) => (
              <FooterLink key={s.slug} href={`/services#${s.slug}`}>
                {s.title}
              </FooterLink>
            ))}
          </FooterCol>

          {/* Industries */}
          <FooterCol title="תעשיות">
            {industries.map((ind) => (
              <FooterLink key={ind.slug} href={`/industries/${ind.slug}`}>
                {ind.name}
              </FooterLink>
            ))}
          </FooterCol>

          {/* Company / navigation */}
          <FooterCol title="ניווט">
            {companyLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          {/* Contact */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[13px] font-semibold text-on-dark">צרו קשר</h3>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-on-dark/60">
              <li>
                <a
                  href="mailto:info@clixsolution.com"
                  className="transition-colors hover:text-on-dark"
                >
                  info@clixsolution.com
                </a>
              </li>
              <li>א׳–ה׳ · 09:00–18:00</li>
              <li>
                <a
                  href="https://maps.app.goo.gl/W3P4cqXgveANBH9p8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-on-dark"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-[#A99BF5]" strokeWidth={1.75} />
                  תל אביב · שירות גלובלי
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Legal bar ───────────────────────────────────────────────── */}
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 font-mono text-xs text-on-dark/55 md:flex-row md:items-center">
          <div>© {year} Clix Solutions. כל הזכויות שמורות.</div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="link-underline hover:text-on-dark">
              מדיניות פרטיות
            </Link>
            <Link href="/terms" className="link-underline hover:text-on-dark">
              תנאי שימוש
            </Link>
            <Link href="/accessibility" className="link-underline hover:text-on-dark">
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

/* ─── Column primitives ──────────────────────────────────────────────── */

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="col-span-1 md:col-span-2">
      <h3 className="text-[13px] font-semibold text-on-dark">{title}</h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block text-[13.5px] leading-relaxed text-on-dark/60 transition-colors hover:text-on-dark"
      >
        {children}
      </Link>
    </li>
  );
}
