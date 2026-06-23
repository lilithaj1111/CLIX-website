"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { industries } from "@/lib/industries";
import { IndustryIcon } from "@/components/industries/IndustryIcon";
import {
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  Building2,
  Landmark,
  HeartPulse,
  ShoppingBag,
  Truck,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

// lucide dropped brand icons, so inline a small SVG glyph for Instagram.
type IconProps = { className?: string };
const InstagramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const links = [
  { href: "/services", label: "שירותים" },
  { href: "/work", label: "פרויקטים" },
  { href: "/insights", label: "תובנות" },
  { href: "/about", label: "אודותינו" },
  { href: "/contact", label: "צרו קשר" },
];

const socials = [
  { Icon: InstagramIcon, href: "https://www.instagram.com/clix_solution/", label: "Instagram" },
];

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Landmark,
  HeartPulse,
  ShoppingBag,
  Truck,
  GraduationCap,
};

/**
 * Nav — the global Gemini-style navbar (promoted from the /lab/nav experiment).
 * A solid deep-plum bar that sits over every page: brand on the right (RTL),
 * white text links centred with an industries dropdown, social icon + brand CTA
 * on the left. Solid everywhere — the same dark treatment over the dark home
 * hero and the light interior pages alike (Google-Sans-like Heebo via
 * --font-google-sans).
 */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileIndustries, setMobileIndustries] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  // A single solid white bar over every page (dark text/logo). The `light`
  // flag stays true everywhere.
  const [light] = useState(true);

  // Close any open menus when the route changes.
  useEffect(() => {
    setOpen(false);
    setIndustriesOpen(false);
    setMobileIndustries(false);
  }, [pathname]);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIndustriesOpen(true);
  };
  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setIndustriesOpen(false), 140);
  };

  const industriesActive = pathname.startsWith("/industries");

  // The /lab/nav preview owns its own NavLab — hide this one there so they
  // don't stack (kept for the live preview route; the design is now identical).
  if (pathname.startsWith("/lab/nav")) return null;

  /* A single centred text link with the active/hover white treatment. */
  const renderLink = (l: { href: string; label: string }) => {
    const active = pathname === l.href || pathname.startsWith(l.href + "/");
    return (
      <Link
        key={l.href}
        href={l.href}
        className={`text-sm font-medium transition-colors ${
          light
            ? active
              ? "text-foreground"
              : "text-foreground/70 hover:text-foreground"
            : active
              ? "text-white"
              : "text-white/70 hover:text-white"
        }`}
      >
        {l.label}
      </Link>
    );
  };

  return (
    <header
      style={{ fontFamily: "var(--font-rubik)" }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        light
          ? "border-line bg-paper"
          : "border-white/10 bg-ink-warm"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3 lg:px-10">
        {/* Brand — right edge in RTL (Logo renders its own home link) */}
        <Logo
          size={34}
          className={`transition-colors duration-300 ${light ? "text-foreground" : "text-on-dark"}`}
        />

        {/* Centre — white text links + industries dropdown */}
        <nav
          className="hidden items-center gap-7 md:flex"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {renderLink(links[0])}

          {/* תעשיות dropdown */}
          <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
            <Link
              href="/industries"
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                light
                  ? industriesActive
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                  : industriesActive
                    ? "text-white"
                    : "text-white/70 hover:text-white"
              }`}
            >
              תעשיות
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                  industriesOpen ? "rotate-180" : ""
                }`}
              />
            </Link>
            <AnimatePresence>
              {industriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-1/2 top-full translate-x-1/2 pt-4"
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                >
                  <div className="w-[340px] rounded-2xl border border-white/10 bg-[#24272B]/97 p-2.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                    <div className="px-3 pb-1.5 pt-2 text-[10.5px] font-mono uppercase tracking-[0.18em] text-on-dark/45">
                      תעשיות שאנחנו בונים בהן
                    </div>
                    <div className="grid gap-0.5">
                      {industries.map((ind) => {
                        const Icon = ICONS[ind.icon];
                        return (
                          <Link
                            key={ind.slug}
                            href={`/industries/${ind.slug}`}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/10"
                          >
                            <IndustryIcon
                              Icon={Icon}
                              size="sm"
                              className="transition-transform duration-300 group-hover:scale-110"
                            />
                            <span className="min-w-0">
                              <span className="block text-[13.5px] font-medium text-on-dark">
                                {ind.name}
                              </span>
                              <span className="block truncate text-[12px] text-on-dark/55">
                                {ind.verb}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    <Link
                      href="/industries"
                      className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-accent transition-colors hover:bg-white/10"
                    >
                      כל התעשיות
                      <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.slice(1).map(renderLink)}
        </nav>

        {/* Left cluster — social icons + brand CTA + mobile hamburger */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-0.5 md:flex">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  light
                    ? "text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                    : "text-on-dark/70 hover:bg-white/10 hover:text-on-dark"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>

          <Link
            href="/contact"
            className="hidden items-center rounded-full bg-[#845EF7] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9A7BF8] md:inline-flex"
          >
            בואו נתחיל
          </Link>

          {/* Mobile hamburger */}
          <button
            aria-label="פתיחת תפריט"
            onClick={() => setOpen((o) => !o)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-colors md:hidden ${
              light
                ? "border-line bg-paper/80 text-foreground"
                : "border-white/15 bg-white/5 text-on-dark"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 mt-2 rounded-2xl border border-white/10 bg-[#24272B]/97 p-5 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              <Link href="/services" className="py-2 text-lg text-white hover:text-white/70">
                שירותים
              </Link>

              {/* תעשיות collapsible accordion */}
              <div>
                <button
                  onClick={() => setMobileIndustries((v) => !v)}
                  aria-expanded={mobileIndustries}
                  className={`flex w-full items-center justify-between py-2 text-lg transition-colors ${
                    industriesActive ? "text-accent" : "text-white hover:text-white/70"
                  }`}
                >
                  תעשיות
                  <ChevronDown
                    className={`h-5 w-5 text-white/50 transition-transform duration-300 ${
                      mobileIndustries ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {mobileIndustries && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-0.5 border-r-2 border-accent/30 pr-3 pb-1">
                        {industries.map((ind) => (
                          <Link
                            key={ind.slug}
                            href={`/industries/${ind.slug}`}
                            className="py-1.5 text-[15px] text-on-dark/75 transition-colors hover:text-on-dark"
                          >
                            {ind.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {links.slice(1).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="py-2 text-lg text-white hover:text-white/70"
                >
                  {l.label}
                </Link>
              ))}

              <div className="mt-3 flex items-center gap-1">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-dark/70 hover:bg-white/10 hover:text-on-dark"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>

              <Link
                href="/contact"
                className="btn-violet mt-3 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-on-dark"
              >
                בואו נתחיל
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
