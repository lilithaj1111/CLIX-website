import Link from "next/link";
import { MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { FooterMap } from "./FooterMap";
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

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.18 4.22-9.4 9.41-9.4 2.51 0 4.87.98 6.64 2.76a9.34 9.34 0 0 1 2.75 6.65c0 5.18-4.22 9.4-9.4 9.4zm8-17.4A11.32 11.32 0 0 0 12.04 0C5.8 0 .72 5.08.72 11.32c0 2 .52 3.95 1.51 5.67L.63 24l7.17-1.88a11.3 11.3 0 0 0 5.42 1.38h.01c6.24 0 11.32-5.08 11.32-11.32 0-3.02-1.18-5.87-3.32-8.01z" />
  </svg>
);

const companyLinks = [
  { href: "/work", label: "עבודות" },
  { href: "/insights", label: "תובנות" },
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
          <div className="col-span-2 md:col-span-3">
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
                <a
                  href="https://www.linkedin.com/in/ido-elmaliach-748413334/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-on-dark/70 transition-colors hover:border-white/35 hover:bg-white/10 hover:text-on-dark"
                >
                  <LinkedInIcon className="h-[18px] w-[18px]" />
                </a>
                <a
                  href="https://wa.me/972559483457"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-on-dark/70 transition-colors hover:border-white/35 hover:bg-white/10 hover:text-on-dark"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
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
          <div className="col-span-1 md:col-span-3">
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

            {/* Location map — keyless dark MapLibre map (OpenFreeMap vector
                tiles), styled in the brand palette with Hebrew labels. */}
            <div className="relative mt-5 h-44 overflow-hidden rounded-md border border-white/10 bg-[#1A232A]">
              <FooterMap />
            </div>
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
