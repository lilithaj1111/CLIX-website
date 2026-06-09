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

const links = [
  { href: "/services", label: "שירותים" },
  { href: "/work", label: "פרויקטים" },
  { href: "/insights", label: "תובנות" },
  { href: "/playground", label: "פלייגראונד" },
  { href: "/about", label: "אודותינו" },
];

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Landmark,
  HeartPulse,
  ShoppingBag,
  Truck,
  GraduationCap,
};

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The home page floats the nav over the dark video hero, so the dark wordmark
  // needs to be painted light there. Initialise from the path to avoid a
  // first-paint flash of the invisible dark logo.
  const [logoLight, setLogoLight] = useState(pathname === "/");
  const [open, setOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileIndustries, setMobileIndustries] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the logo light while the dark hero sits behind the nav (home only),
  // and swap to the dark mark once the light page scrolls up under it. The
  // hero is clamp(640px, 100svh, 960px) tall; flip ~130px before its bottom so
  // the change lands as the light fade passes under the nav.
  useEffect(() => {
    if (pathname !== "/") {
      setLogoLight(false);
      return;
    }
    const onScroll = () => {
      const heroH = Math.min(Math.max(window.innerHeight, 640), 960);
      setLogoLight(window.scrollY < heroH - 130);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
    setIndustriesOpen(false);
  }, [pathname]);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIndustriesOpen(true);
  };
  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setIndustriesOpen(false), 140);
  };

  const industriesActive = pathname.startsWith("/industries");

  /* A single capsule link with the shared active/hover pill treatment. */
  const renderLink = (l: { href: string; label: string }) => {
    const active = pathname === l.href || pathname.startsWith(l.href + "/");
    const showHoverPill = hoveredHref === l.href && !active;
    return (
      <Link
        key={l.href}
        href={l.href}
        onMouseEnter={() => setHoveredHref(l.href)}
        className="relative px-4 py-1.5 text-sm transition-colors"
      >
        {active && (
          <motion.span
            layoutId="nav-active-pill"
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background: "color-mix(in srgb, var(--accent) 14%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 32%, transparent)",
            }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          />
        )}
        {showHoverPill && (
          <motion.span
            layoutId="nav-hover-pill"
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: "color-mix(in srgb, var(--accent) 8%, transparent)" }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          />
        )}
        <span
          className={`relative z-10 transition-colors ${
            active ? "text-foreground font-medium" : "text-foreground/75 hover:text-foreground"
          }`}
        >
          {l.label}
        </span>
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div
        className={`mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10 flex items-center justify-between transition-all duration-500 ${
          scrolled ? "pt-3 md:pt-4" : "pt-5 md:pt-6"
        }`}
      >
        {/* Left — logo. Painted light over the dark hero, dark otherwise. */}
        <div className="pointer-events-auto">
          <Logo
            size={38}
            className={`transition-colors duration-300 ${
              logoLight ? "text-on-dark" : "text-foreground"
            }`}
          />
        </div>

        {/* Center — floating capsule with nav links + industries dropdown */}
        <nav
          className="pointer-events-auto hidden md:flex items-center gap-0.5 relative rounded-full px-2 py-1.5 bg-paper/85 backdrop-blur-md border border-line/70 shadow-[0_10px_30px_-12px_rgba(31,20,41,0.18),inset_0_1px_0_0_rgba(255,255,255,0.5)]"
          onMouseLeave={() => setHoveredHref(null)}
        >
          {renderLink(links[0])}

          {/* תעשיות dropdown trigger + panel */}
          <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
            <Link
              href="/industries"
              onMouseEnter={() => setHoveredHref("/industries")}
              className="relative flex items-center gap-1 px-4 py-1.5 text-sm transition-colors"
            >
              {industriesActive && (
                <motion.span
                  layoutId="nav-active-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 14%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--accent) 32%, transparent)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              {hoveredHref === "/industries" && !industriesActive && (
                <motion.span
                  layoutId="nav-hover-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{ background: "color-mix(in srgb, var(--accent) 8%, transparent)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  industriesActive
                    ? "text-foreground font-medium"
                    : "text-foreground/75 hover:text-foreground"
                }`}
              >
                תעשיות
              </span>
              <ChevronDown
                className={`relative z-10 h-3.5 w-3.5 text-foreground/55 transition-transform duration-300 ${
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
                  className="absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3"
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                >
                  <div className="w-[340px] rounded-2xl border border-line bg-paper/95 p-2.5 backdrop-blur-md shadow-[0_24px_50px_-20px_rgba(31,20,41,0.28)]">
                    <div className="px-3 pb-1.5 pt-2 text-[10.5px] font-mono uppercase tracking-[0.18em] text-foreground/45">
                      תעשיות שאנחנו בונים בהן
                    </div>
                    <div className="grid gap-0.5">
                      {industries.map((ind) => {
                        const Icon = ICONS[ind.icon];
                        return (
                          <Link
                            key={ind.slug}
                            href={`/industries/${ind.slug}`}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-accent/10"
                          >
                            <IndustryIcon
                              Icon={Icon}
                              size="sm"
                              className="transition-transform duration-300 group-hover:scale-110"
                            />
                            <span className="min-w-0">
                              <span className="block text-[13.5px] font-medium text-foreground">
                                {ind.name}
                              </span>
                              <span className="block truncate text-[12px] text-foreground/55">
                                {ind.verb}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    <Link
                      href="/industries"
                      className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-accent transition-colors hover:bg-accent/10"
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

        {/* Right — CTA pill + mobile menu */}
        <div className="pointer-events-auto flex items-center gap-3">
          <Link
            href="/contact"
            className="btn-shine btn-violet group hidden md:inline-flex items-center gap-2 text-sm ps-4 pe-1.5 py-1.5 rounded-full font-medium"
          >
            בואו נתחיל
            <span className="inline-flex w-6 h-6 rounded-full bg-ink/30 text-paper items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 9L9 1M9 1H3M9 1V7"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
          <button
            aria-label="פתיחת תפריט"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-paper/85 backdrop-blur-md border border-line/70 shadow-[0_8px_24px_-12px_rgba(31,20,41,0.18)] transition-colors hover:bg-accent/10"
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

      {/* Soft top fade */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--bg) 75%, transparent) 0%, transparent 100%)",
        }}
      />

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto md:hidden mt-3 mx-4 rounded-2xl bg-paper/95 backdrop-blur-md border border-line shadow-[0_18px_40px_-16px_rgba(31,20,41,0.25)]"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {/* שירותים */}
              <MobileLink href="/services" label="שירותים" pathname={pathname} delay={0.05} />

              {/* תעשיות collapsible accordion */}
              <div>
                <button
                  onClick={() => setMobileIndustries((v) => !v)}
                  aria-expanded={mobileIndustries}
                  className={`flex w-full items-center justify-between py-2.5 text-lg transition-colors ${
                    industriesActive ? "text-accent font-medium" : "text-foreground hover:text-accent"
                  }`}
                >
                  תעשיות
                  <ChevronDown
                    className={`h-5 w-5 text-foreground/50 transition-transform duration-300 ${
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
                      <div className="flex flex-col gap-0.5 border-r-2 border-accent/25 pr-3 pb-1">
                        {industries.map((ind) => (
                          <Link
                            key={ind.slug}
                            href={`/industries/${ind.slug}`}
                            className="py-1.5 text-[15px] text-foreground/75 transition-colors hover:text-accent"
                          >
                            {ind.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* פרויקטים + תובנות + אודותינו */}
              <MobileLink href="/work" label="פרויקטים" pathname={pathname} delay={0.1} />
              <MobileLink href="/insights" label="תובנות" pathname={pathname} delay={0.13} />
              <MobileLink href="/about" label="אודותינו" pathname={pathname} delay={0.16} />

              <Link
                href="/contact"
                className="btn-violet mt-3 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full font-medium w-full"
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

/* Mobile sheet link with entrance + active state. */
function MobileLink({
  href,
  label,
  pathname,
  delay,
}: {
  href: string;
  label: string;
  pathname: string;
  delay: number;
}) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className={`block py-2.5 text-lg transition-colors ${
          active ? "text-accent font-medium" : "text-foreground hover:text-accent"
        }`}
      >
        {label}
      </Link>
    </motion.div>
  );
}
