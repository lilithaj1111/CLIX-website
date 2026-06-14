"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { industries } from "@/lib/industries";
import { ChevronDown, Menu, X } from "lucide-react";

// lucide dropped brand icons, so inline a small SVG glyph for Instagram.
type IconProps = { className?: string };
const InstagramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * NavLab — lab-only experiment: a Gemini-style TRANSPARENT navbar over the dark
 * hero. Brand on the right (RTL), centred text links with a caret dropdown, and
 * a social-icon row + a light pill CTA on the left. Previewed at /lab/nav; the
 * live <Nav> is hidden on that route so they don't stack.
 */
const links = [
  { href: "/services", label: "שירותים" },
  { href: "/work", label: "פרויקטים" },
  { href: "/insights", label: "תובנות" },
  { href: "/playground", label: "פלייגראונד" },
  { href: "/about", label: "אודותינו" },
];

const socials = [
  { Icon: InstagramIcon, href: "https://www.instagram.com/clix_solution/", label: "Instagram" },
];

export function NavLab() {
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{ fontFamily: "var(--font-google-sans)" }}
      className="pointer-events-auto fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0b0712]"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3 lg:px-10">
        {/* Brand — right edge in RTL */}
        <div className="pointer-events-auto">
          <Logo size={34} className="text-on-dark" />
        </div>

        {/* Centre — transparent text links (Google-Sans-like Heebo) */}
        <nav
          className="pointer-events-auto hidden items-center gap-7 md:flex"
          style={{ fontFamily: "var(--font-google-sans)" }}
        >
          <Link
            href="/services"
            className="text-sm font-medium text-white transition-colors hover:text-white/70"
          >
            שירותים
          </Link>

          {/* תעשיות dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIndustriesOpen(true)}
            onMouseLeave={() => setIndustriesOpen(false)}
          >
            <Link
              href="/industries"
              className="flex items-center gap-1 text-sm font-medium text-white transition-colors hover:text-white/70"
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
                >
                  <div className="w-[260px] rounded-2xl border border-white/10 bg-[#140b1c]/90 p-2 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                    {industries.map((ind) => (
                      <Link
                        key={ind.slug}
                        href={`/industries/${ind.slug}`}
                        className="block rounded-xl px-3 py-2 text-[13.5px] text-on-dark/80 transition-colors hover:bg-white/10 hover:text-on-dark"
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
              className="text-sm font-medium text-white transition-colors hover:text-white/70"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Left cluster — social icons + light pill CTA */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="hidden items-center gap-0.5 md:flex">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-dark/70 transition-colors hover:bg-white/10 hover:text-on-dark"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>

          <Link
            href="/contact"
            className="btn-shine btn-violet hidden items-center rounded-full px-5 py-2.5 text-sm font-medium text-on-dark transition-transform duration-300 hover:-translate-y-0.5 md:inline-flex"
          >
            בואו נתחיל
          </Link>

          {/* Mobile hamburger */}
          <button
            aria-label="תפריט"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-on-dark backdrop-blur-sm md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
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
            className="pointer-events-auto mx-4 mt-2 rounded-2xl border border-white/10 bg-[#140b1c]/95 p-5 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              <Link href="/services" className="py-2 text-lg text-white hover:text-white/70">שירותים</Link>
              <Link href="/industries" className="py-2 text-lg text-white hover:text-white/70">תעשיות</Link>
              {links.slice(1).map((l) => (
                <Link key={l.href} href={l.href} className="py-2 text-lg text-white hover:text-white/70">
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center gap-1">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
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

export default NavLab;
