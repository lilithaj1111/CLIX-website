"use client";

import { useEffect, useRef, useState } from "react";
import {
  Contrast,
  Eye,
  Link2,
  MousePointer2,
  Scan,
  Type,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * AccessibilityWidget — legal-compliance accessibility control.
 *
 * Floating round button in the bottom-right of every page; clicking opens
 * a dark-themed panel of accessibility controls. Settings persist via
 * localStorage and are reapplied on every page load.
 *
 *   Text size       : 85%–145% on <html>, in 15% steps.
 *   High contrast   : contrast(1.25) on body; images untouched.
 *   Large cursor    : enlarged SVG arrow cursor everywhere.
 *   Highlight links : amber background + underline on every <a>.
 *   Readable font   : Verdana + relaxed letter/word spacing.
 *   Focus mode      : dims decorative imagery and aria-hidden elements.
 *
 * All CSS modes are defined in `globals.css` under `.a11y-*` selectors.
 * ──────────────────────────────────────────────────────────────────────── */

type Settings = {
  fontScale: number; // 0.85 → 1.45 in 0.15 steps
  highContrast: boolean;
  largeCursor: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  focusMode: boolean;
};

const DEFAULTS: Settings = {
  fontScale: 1,
  highContrast: false,
  largeCursor: false,
  highlightLinks: false,
  readableFont: false,
  focusMode: false,
};

const FONT_MIN = 0.85;
const FONT_MAX = 1.45;
const FONT_STEP = 0.15;
const STORAGE_KEY = "clix-a11y";

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Load persisted settings on mount
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        setSettings({ ...DEFAULTS, ...parsed });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Apply settings to <html> + persist
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.style.fontSize = `${settings.fontScale * 100}%`;
    html.classList.toggle("a11y-high-contrast", settings.highContrast);
    html.classList.toggle("a11y-large-cursor", settings.largeCursor);
    html.classList.toggle("a11y-highlight-links", settings.highlightLinks);
    html.classList.toggle("a11y-readable-font", settings.readableFont);
    html.classList.toggle("a11y-focus-mode", settings.focusMode);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings, mounted]);


  // Close on outside click + ESC
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (buttonRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const update = (patch: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  const enlargeFont = () =>
    update({
      fontScale: Math.min(
        FONT_MAX,
        +(settings.fontScale + FONT_STEP).toFixed(2)
      ),
    });
  const reduceFont = () =>
    update({
      fontScale: Math.max(
        FONT_MIN,
        +(settings.fontScale - FONT_STEP).toFixed(2)
      ),
    });

  return (
    <>
      {/* ── Button ────────────────────────────────────────────────── */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="הגדרות נגישות"
        title="הגדרות נגישות"
        aria-expanded={open}
        aria-controls="a11y-panel"
        className="
          fixed left-4 bottom-20 md:left-6 md:bottom-24 z-[62]
          w-12 h-12 rounded-full
          bg-accent text-paper border-2 border-paper
          shadow-[0_14px_28px_-8px_rgba(15,23,42,0.45)]
          flex items-center justify-center
          hover:scale-105 active:scale-95 transition-transform
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
        "
      >
        <AccessibilityIcon />
        <span className="sr-only">נגישות</span>
      </button>

      {/* ── Panel ─────────────────────────────────────────────────── */}
      {open && (
        <div
          id="a11y-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="הגדרות נגישות"
          className="
            fixed left-4 bottom-[140px] md:left-6 md:bottom-[152px] z-[62]
            w-[300px] max-w-[calc(100vw-2rem)]
            rounded-2xl overflow-hidden border border-line
            shadow-[0_28px_60px_-20px_rgba(15,23,42,0.30)]
            text-foreground
          "
          style={{ background: "#FFFFFF" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: "var(--accent)" }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגירת חלון הנגישות"
              className="text-white hover:opacity-80 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-semibold text-white">
              נגישות
            </h3>
            <Eye className="w-4 h-4 text-white" aria-hidden />
          </div>

          {/* Text size */}
          <div
            className="p-3"
            style={{ background: "rgba(15,23,42,0.03)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.14em] opacity-60">
                גודל טקסט
              </span>
              <Type className="w-3.5 h-3.5 opacity-60" aria-hidden />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reduceFont}
                disabled={settings.fontScale <= FONT_MIN}
                aria-label="הקטנת גודל הטקסט"
                className="
                  flex-1 py-2 rounded-lg text-xs font-medium
                  inline-flex items-center justify-center gap-1.5
                  transition-colors disabled:opacity-40
                  hover:bg-black/10 border border-line
                "
                style={{ background: "rgba(15,23,42,0.04)" }}
              >
                <ZoomOut className="w-3.5 h-3.5" />
                הקטנה
              </button>
              <span className="text-sm font-mono tabular-nums w-12 text-center">
                {Math.round(settings.fontScale * 100)}%
              </span>
              <button
                type="button"
                onClick={enlargeFont}
                disabled={settings.fontScale >= FONT_MAX}
                aria-label="הגדלת גודל הטקסט"
                className="
                  flex-1 py-2 rounded-lg text-xs font-medium
                  inline-flex items-center justify-center gap-1.5
                  transition-colors disabled:opacity-40
                  hover:bg-black/10 border border-line
                "
                style={{ background: "rgba(15,23,42,0.04)" }}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                הגדלה
              </button>
            </div>
          </div>

          {/* Toggles */}
          <ToggleRow
            label="ניגודיות גבוהה"
            icon={<Contrast className="w-4 h-4" />}
            active={settings.highContrast}
            onClick={() => update({ highContrast: !settings.highContrast })}
          />
          <ToggleRow
            label="סמן עכבר מוגדל"
            icon={<MousePointer2 className="w-4 h-4" />}
            active={settings.largeCursor}
            onClick={() => update({ largeCursor: !settings.largeCursor })}
          />
          <ToggleRow
            label="הדגשת קישורים"
            icon={<Link2 className="w-4 h-4" />}
            active={settings.highlightLinks}
            onClick={() => update({ highlightLinks: !settings.highlightLinks })}
          />
          <ToggleRow
            label="גופן קריא"
            icon={<Type className="w-4 h-4" />}
            active={settings.readableFont}
            onClick={() => update({ readableFont: !settings.readableFont })}
          />
          <ToggleRow
            label="מצב מיקוד"
            icon={<Scan className="w-4 h-4" />}
            active={settings.focusMode}
            onClick={() => update({ focusMode: !settings.focusMode })}
          />

          {/* Reset */}
          <button
            type="button"
            onClick={() => setSettings(DEFAULTS)}
            className="block w-full px-3 py-3 text-center text-xs opacity-60 hover:opacity-100 transition-opacity"
          >
            איפוס ההגדרות
          </button>
        </div>
      )}
    </>
  );
}

function ToggleRow({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={active}
      className="
        w-full flex items-center justify-between px-4 py-3
        text-sm font-medium transition-colors
        border-t border-line
      "
      style={{
        background: active ? "var(--accent)" : "transparent",
        color: active ? "#FFFFFF" : "var(--fg)",
      }}
    >
      <span>{label}</span>
      <span aria-hidden className="opacity-90">
        {icon}
      </span>
    </button>
  );
}

/* International Symbol of Access — the universal wheelchair glyph, the
   legally-recognised accessibility icon. White on the accent button. */
function AccessibilityIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Head */}
      <circle cx="13.5" cy="4" r="1.7" fill="currentColor" stroke="none" />
      {/* Torso curving forward + arm extending to the right */}
      <path d="M11 7.5 L 10 10.5 L 10 12.5 L 14.5 12.5 L 16.5 14" />
      {/* Leg dropping from torso to the wheel hub */}
      <path d="M10 12.5 L 12 17" />
      {/* Wheel */}
      <circle cx="12" cy="17" r="4.5" />
    </svg>
  );
}
