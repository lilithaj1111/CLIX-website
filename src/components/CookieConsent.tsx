"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "clix:cookie-consent";
type Category = "essential" | "analytics" | "marketing";
type Prefs = Record<Category, boolean>;

const DEFAULT_PREFS: Prefs = {
  essential: true, // always on, can't be disabled
  analytics: false,
  marketing: false,
};

/**
 * First-visit cookie consent banner. Stores the user's choice in localStorage
 * and never reappears once a choice is made. The banner supports three
 * actions:
 *
 *   - Accept all        → all categories on (essential + analytics + marketing)
 *   - Only essential    → only the essentials, others off
 *   - Customize         → opens a categorized panel where the user can
 *                         opt-in per category before saving
 *
 * This matches the categorized-consent pattern most Israeli accessibility-
 * audited sites use under Regulation 35 / GDPR, and is what Clix's Privacy
 * Policy promises ("you can set preferences"). We don't load any tracker
 * yet — the stored value is here for forward-compat: read it before
 * initializing any analytics or ad SDK.
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const reduced = useReducedMotion();

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (!existing) setShow(true);
    } catch {
      // localStorage unavailable — surface the banner; no persistence.
      setShow(true);
    }
  }, []);

  const save = (next: Prefs) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ prefs: next, at: new Date().toISOString() }),
      );
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  const acceptAll = () =>
    save({ essential: true, analytics: true, marketing: true });
  const acceptEssential = () =>
    save({ essential: true, analytics: false, marketing: false });
  const savePrefs = () => save(prefs);

  const togglePref = (k: Category) => {
    if (k === "essential") return; // essential always on
    setPrefs((p) => ({ ...p, [k]: !p[k] }));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-label="העדפות עוגיות (Cookies)"
          aria-describedby="cookie-consent-desc"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md z-[60]"
        >
          <div className="glass grad-border rounded-2xl p-4 md:p-5 text-[13.5px] leading-relaxed text-foreground/85">
            <p id="cookie-consent-desc">
              אנחנו משתמשים בעוגיות (Cookies) כדי שהאתר יפעל כראוי, למדוד
              שימוש באופן אנונימי, ובאישורכם לשפר את הרלוונטיות השיווקית.
              ניתן לאשר את כל הקטגוריות, להסתפק בעוגיות החיוניות בלבד, או
              לבחור לפי קטגוריה. כל הפרטים נמצאים ב
              <Link href="/privacy" className="text-foreground link-underline">
                מדיניות הפרטיות
              </Link>
              {" "}שלנו.
            </p>

            {expanded && (
              <fieldset className="mt-4 space-y-2.5 border-t border-line/60 pt-4">
                <legend className="sr-only">קטגוריות עוגיות</legend>
                <CookieRow
                  id="cookie-essential"
                  label="חיוניות"
                  description="דרושות לפעולת האתר התחברות, אבטחה ושליחת טפסים. פעילות באופן קבוע."
                  checked
                  disabled
                  onChange={() => togglePref("essential")}
                />
                <CookieRow
                  id="cookie-analytics"
                  label="ניתוח נתונים"
                  description="נתוני שימוש אנונימיים, כדי שנדע מה עובד ומה דורש שיפור. ללא מזהים אישיים."
                  checked={prefs.analytics}
                  onChange={() => togglePref("analytics")}
                />
                <CookieRow
                  id="cookie-marketing"
                  label="שיווק"
                  description="משמשות למדידת ביצועי פרסום ולמיקוד מחדש של מבקרים בפלטפורמות חיצוניות (למשל Meta, Google)."
                  checked={prefs.marketing}
                  onChange={() => togglePref("marketing")}
                />
              </fieldset>
            )}

            <div className="mt-3.5 flex flex-wrap gap-2">
              {expanded ? (
                <>
                  <button
                    type="button"
                    onClick={savePrefs}
                    className="btn-violet text-sm px-4 py-1.5 rounded-full font-medium"
                  >
                    שמירת ההעדפות
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="text-sm px-4 py-1.5 rounded-full border border-foreground/25 hover:border-accent hover:text-accent transition-colors"
                  >
                    חזרה
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="btn-violet text-sm px-4 py-1.5 rounded-full font-medium"
                  >
                    אישור כולל
                  </button>
                  <button
                    type="button"
                    onClick={acceptEssential}
                    className="text-sm px-4 py-1.5 rounded-full border border-foreground/25 hover:border-accent hover:text-accent transition-colors"
                  >
                    חיוניות בלבד
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="text-sm px-4 py-1.5 rounded-full text-foreground/70 hover:text-accent underline underline-offset-4 decoration-foreground/25 hover:decoration-accent transition-colors"
                  >
                    התאמה אישית
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CookieRow({
  id,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 cursor-pointer group"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-0.5 w-4 h-4 accent-[var(--accent)] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
      />
      <span className="flex-1 min-w-0">
        <span className="block text-[13px] font-medium text-foreground">
          {label}
          {disabled && (
            <span className="ml-2 text-[10px] font-mono uppercase tracking-[0.16em] text-foreground/45">
              תמיד פעיל
            </span>
          )}
        </span>
        <span className="block text-[12px] text-foreground/65 mt-0.5 leading-snug">
          {description}
        </span>
      </span>
    </label>
  );
}
