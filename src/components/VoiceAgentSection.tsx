"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Grid3x3,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Plus,
  Users,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LogoMark } from "./LogoMark";

/* ────────────────────────────────────────────────────────────────────────────
 * VoiceAgentSection — TalkNotes-style "press play to hear it" moment.
 * Two-column composition: editorial text-with-colored-emphasis on the
 * left, a centered vertical player card on the right (caption → timer →
 * three-button row → bottom action pill).
 *
 * The audio source has a placeholder intro that needs to be skipped;
 * `INTRO_OFFSET_SECONDS` controls the cut point.
 * ──────────────────────────────────────────────────────────────────────── */

const AUDIO_SRC = "/audio/voice-agent-demo.wav";
// File is pre-cropped to start at the agent's greeting, no runtime offset needed.
const INTRO_OFFSET_SECONDS = 0;

/* ─── Equalizer bar config ──────────────────────────────────────────────────
 * 32 bars with a deterministic pseudo-random distribution of keyframe
 * pattern, duration and start delay so the recorder feels organic without
 * looking like a sine wave. `idleScale` gives each bar a unique resting
 * height — a static waveform silhouette when the call hasn't started. */
const EQ_BARS = Array.from({ length: 32 }, (_, i) => {
  const r = ((i * 9973) % 1000) / 1000;
  return {
    anim: (["a", "b", "c"] as const)[i % 3],
    dur: 0.75 + (((i * 41) % 70) / 100), // 0.75–1.45s
    delay: ((i * 17) % 100) / 100, // 0–1s
    idleScale: 0.12 + r * 0.22, // 0.12–0.34
  };
});

export function VoiceAgentSection() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(Math.max(0, audio.currentTime - INTRO_OFFSET_SECONDS));
    };
    const onLoadedMetadata = () => {
      setDuration(Math.max(0, audio.duration - INTRO_OFFSET_SECONDS));
      audio.currentTime = INTRO_OFFSET_SECONDS;
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // Phone-style toggle: pick up to start a fresh call, press again to
  // hang up. Real phones don't "pause" — hang-up resets the timer and a
  // subsequent press starts a new call from the beginning.
  const togglePhone = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      audio.currentTime = INTRO_OFFSET_SECONDS;
      setCurrentTime(0);
      setIsPlaying(false);
    } else {
      audio.currentTime = INTRO_OFFSET_SECONDS;
      setCurrentTime(0);
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <section className="relative border-t border-line bg-background py-20 md:py-28 overflow-hidden">
      <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" />

      {/* Plus-cross blueprint grid behind everything — a faint "engineered
          paper" texture (UiPath-style technical backdrop). */}
      <PlusGridBackdrop />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* ── Left column — editorial text (7/12, more room for headline) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-lg bg-paper border border-line shadow-[0_10px_24px_-12px_rgba(11,19,38,0.10)]">
              <span className="inline-flex w-6 h-6 rounded-md bg-accent-soft items-center justify-center">
                <Award className="w-3.5 h-3.5 text-accent" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-foreground/55">
                  מומלץ
                </span>
                <span className="mt-1 text-[12.5px] font-medium text-foreground">
                  Voice AI · הדגמה בזמן אמת
                </span>
              </span>
            </div>

            {/* Headline — flows naturally; text-balance keeps lines even */}
            <h2 className="mt-6 max-w-[640px] text-[clamp(2.1rem,4.2vw,3.85rem)] leading-[1.05] tracking-[-0.04em] font-semibold text-balance">
              סוכנים קוליים שמנהלים את כל{" "}
              <span className="serif-italic text-accent">השיחה.</span>
            </h2>

            <p className="mt-5 text-[15px] md:text-[15.5px] font-medium text-accent tracking-[-0.005em]">
              Voice AI ברמת ייצור לצוותים מודרניים.
            </p>

            <p className="mt-4 max-w-[520px] text-foreground/70 leading-[1.65] text-[14.5px] md:text-[15px]">
              סוכן שעונה לשיחות נכנסות, מאמת לידים, קובע פגישות ומעביר
              שיחות לנציג אנושי כשצריך פועל על אותו המערך הטכנולוגי
              שאנחנו מטמיעים אצל הלקוחות.
            </p>

            {/* CTA + trust line grouped as one cluster */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/contact"
                className="btn-shine btn-violet inline-flex items-center gap-2 text-sm ps-6 pe-2 py-2.5 rounded-full font-medium"
              >
                בנו את הסוכן הקולי שלכם
                <span className="inline-flex w-7 h-7 rounded-full bg-ink/40 text-paper items-center justify-center backdrop-blur-sm">
                  →
                </span>
              </Link>
            </div>

          </motion.div>

          {/* ── Right column — player card sits flush-right at lg+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.95,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-5 flex justify-center"
          >
            <PlayerCard
              isPlaying={isPlaying}
              muted={muted}
              currentTime={currentTime}
              duration={duration}
              onTogglePhone={togglePhone}
              onToggleMute={toggleMute}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Player card — caller info + timer (no controls inside) ────────────── */

function PlayerCard({
  isPlaying,
  muted,
  currentTime,
  onTogglePhone,
  onToggleMute,
}: {
  isPlaying: boolean;
  muted: boolean;
  currentTime: number;
  duration: number;
  onTogglePhone: () => void;
  onToggleMute: () => void;
}) {
  return (
    <div className="relative w-full max-w-[320px]">
      {/* Floor shadow */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] w-[78%] h-12 rounded-[50%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(11,19,38,0.42) 0%, rgba(11,19,38,0.12) 50%, transparent 75%)",
          filter: "blur(18px)",
        }}
      />

      {/* Phone body — 2D rotation only (no rotateY/rotateX). Depth comes
          from the bezel gradient, inset highlights, side-button slivers
          and the floor shadow. Avoids 3D-transform hit-test bugs that
          were blocking clicks on the call button. */}
      <div
        className="relative w-full"
        style={{
          transform: "rotate(-1.5deg)",
        }}
      >
        {/* Side buttons — at the bezel edges, no Z displacement */}
        <span
          aria-hidden
          className="absolute top-[16%] -left-[3px] w-[4px] h-12 rounded-l-md pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #26292E 0%, #2A2456 60%, #3A46F0 100%)",
            boxShadow: "inset 1px 0 0 rgba(255,255,255,0.06)",
          }}
        />
        <span
          aria-hidden
          className="absolute top-[26%] -left-[3px] w-[4px] h-8 rounded-l-md pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #26292E 0%, #2A2456 60%, #3A46F0 100%)",
            boxShadow: "inset 1px 0 0 rgba(255,255,255,0.06)",
          }}
        />
        <span
          aria-hidden
          className="absolute top-[18%] -right-[3px] w-[4px] h-16 rounded-r-md pointer-events-none"
          style={{
            background:
              "linear-gradient(-90deg, #26292E 0%, #2A2456 60%, #3A46F0 100%)",
            boxShadow: "inset -1px 0 0 rgba(255,255,255,0.06)",
          }}
        />

        {/* Outer bezel */}
        <div
          className="relative w-full aspect-[10/20] rounded-[44px] p-[5px]"
          style={{
            background:
              "linear-gradient(135deg, #322A60 0%, #24272B 45%, #2A2456 100%)",
            boxShadow: [
              "0 70px 110px -40px rgba(11,19,38,0.55)",
              "0 30px 50px -22px rgba(11,19,38,0.40)",
              "inset 0 1px 0 rgba(255,255,255,0.10)",
              "inset 0 -1px 0 rgba(0,0,0,0.40)",
              "inset 1px 0 0 rgba(255,255,255,0.06)",
              "inset -1px 0 0 rgba(0,0,0,0.30)",
            ].join(", "),
          }}
        >
          {/* Screen */}
          <div
            className="relative w-full h-full rounded-[40px] overflow-hidden bg-paper"
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #F3F1FB 35%, #E2DFF2 100%)",
            }}
          >
            {/* Dynamic island — top notch carrying status */}
            <div
              className="absolute top-[10px] left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-warm"
              style={{
                boxShadow: "0 4px 12px -4px rgba(11,19,38,0.45)",
              }}
            >
              <span className="relative inline-flex">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPlaying ? "bg-accent" : "bg-fg-on-dark/55"
                  }`}
                />
                {isPlaying && (
                  <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                )}
              </span>
              <span className="text-[8.5px] font-mono uppercase tracking-[0.18em] text-fg-on-dark/80">
                {isPlaying ? "בשיחה" : "מתחבר…"}
              </span>
            </div>

            {/* Soft accent wash near top of screen */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-32 pointer-events-none"
              style={{
                background:
                  "radial-gradient(80% 100% at 50% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%)",
              }}
            />

            {/* Screen content — z-20 so it sits above the accent wash and
                below the dynamic island (z-30). The glare overlay below
                is pointer-events-none, but explicit z keeps stacking
                predictable inside a 3D-transformed parent. */}
            <div className="relative z-20 h-full flex flex-col pt-12 px-5 pb-5">
              {/* Caller info row — Clix mark avatar */}
              <div className="flex items-center gap-2.5 mt-3">
                <div className="relative w-10 h-10 rounded-full bg-accent-soft inline-flex items-center justify-center shrink-0 text-ink">
                  <LogoMark size={18} />
                  {isPlaying && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        background:
                          "color-mix(in srgb, var(--accent) 24%, transparent)",
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium text-foreground leading-tight">
                    סוכן קולי · Clix
                  </div>
                  <div className="text-[9px] font-mono uppercase tracking-[0.14em] text-foreground/55 mt-0.5">
                    שיחה נכנסת · הכשרת לידים
                  </div>
                </div>
              </div>

              {/* Call duration */}
              <div className="text-center mt-6">
                <div className="text-[2.8rem] font-medium tracking-[-0.04em] tabular-nums text-foreground leading-none">
                  {formatTime(currentTime)}
                </div>
                <div className="mt-2 text-[9px] font-mono uppercase tracking-[0.18em] text-foreground/45">
                  משך השיחה
                </div>
              </div>

              {/* Live waveform */}
              <div
                className="mt-5 flex items-center justify-center gap-[2px] h-8"
                aria-hidden
              >
                {EQ_BARS.slice(0, 26).map((bar, i) => (
                  <span
                    key={i}
                    className="block w-[2px] h-full rounded-full"
                    style={{
                      background: isPlaying
                        ? "var(--accent)"
                        : "color-mix(in srgb, var(--accent) 28%, transparent)",
                      transformOrigin: "center",
                      transform: isPlaying
                        ? undefined
                        : `scaleY(${bar.idleScale})`,
                      animation: isPlaying
                        ? `eq-${bar.anim} ${bar.dur}s ease-in-out ${bar.delay}s infinite`
                        : undefined,
                      transition: "background 0.3s ease-out",
                    }}
                  />
                ))}
              </div>

              {/* In-call action grid — iOS style. Mute is functional; the
                  rest are decorative for the live-demo feel. Shown only
                  while the call is in progress. */}
              {isPlaying ? (
                <div className="mt-6 grid grid-cols-3 gap-y-4 gap-x-2 px-2">
                  <CallActionButton
                    icon={muted ? MicOff : Mic}
                    label={muted ? "ביטול השתקה" : "השתקה"}
                    active={muted}
                    onClick={onToggleMute}
                  />
                  <CallActionButton icon={Grid3x3} label="חוגה" />
                  <CallActionButton icon={Volume2} label="רמקול" />
                  <CallActionButton icon={Plus} label="שיחה נוספת" />
                  <CallActionButton icon={Video} label="FaceTime" />
                  <CallActionButton icon={Users} label="אנשי קשר" />
                </div>
              ) : (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={onToggleMute}
                    aria-label={muted ? "ביטול השתקה" : "השתקה"}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent hover:bg-accent hover:text-paper text-[10.5px] font-medium transition-colors"
                  >
                    {muted ? (
                      <VolumeX className="w-3 h-3" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                    {muted ? "ביטול השתקה" : "השתקה"}
                  </button>
                </div>
              )}

              {/* Spacer pushes the primary action toward the bottom */}
              <div className="flex-1 min-h-0" />

              {/* Primary action — blue call button when idle, red hangup
                  button while in-call. */}
              <div className="pt-4 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={onTogglePhone}
                  aria-label={isPlaying ? "ניתוק השיחה" : "התחלת שיחה"}
                  className="shrink-0 w-[68px] h-[68px] rounded-full grid place-items-center transition-all duration-300 active:scale-95 cursor-pointer"
                  style={{
                    background: isPlaying
                      ? "linear-gradient(135deg, #f56565 0%, #e53e3e 55%, #c53030 100%)"
                      : "linear-gradient(135deg, color-mix(in srgb, var(--accent) 100%, white 8%) 0%, var(--accent) 55%, var(--accent-deep) 100%)",
                    color: "#fff",
                    boxShadow: isPlaying
                      ? "0 18px 36px -10px rgba(229,62,62,0.55), 0 0 0 5px rgba(229,62,62,0.14), inset 0 1px 0 0 rgba(255,255,255,0.25)"
                      : "0 18px 36px -10px color-mix(in srgb, var(--accent) 60%, transparent), 0 0 0 5px color-mix(in srgb, var(--accent) 12%, transparent), inset 0 1px 0 0 rgba(255,255,255,0.3)",
                  }}
                >
                  {isPlaying ? (
                    <PhoneOff className="w-6 h-6" />
                  ) : (
                    <Phone className="w-6 h-6" />
                  )}
                </button>

                <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-foreground/55">
                  {isPlaying ? "הקישו לניתוק" : ""}
                </span>

                {/* Home indicator bar */}
                <span
                  aria-hidden
                  className="mt-1 block w-[34%] h-[3px] rounded-full bg-ink/30"
                />
              </div>
            </div>

            {/* Screen glare — diagonal highlight reading as glass.
                No blend-mode (some browsers misroute clicks through
                blend-mode layers even with pointer-events: none). */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none rounded-[40px]"
              style={{
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 18%, transparent 35%, transparent 85%, rgba(11,19,38,0.04) 100%)",
              }}
            />
          </div>

          {/* Bezel edge highlight — thin bright line along top-left edge */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-[44px] pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.25) 100%)",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes eq-a {
          0%, 100% { transform: scaleY(0.18); }
          35% { transform: scaleY(0.85); }
          65% { transform: scaleY(0.4); }
        }
        @keyframes eq-b {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes eq-c {
          0%, 100% { transform: scaleY(0.15); }
          25% { transform: scaleY(0.6); }
          60% { transform: scaleY(0.95); }
          85% { transform: scaleY(0.3); }
        }
      `}</style>
    </div>
  );
}


/* ─── In-call action button — iOS-style circle + label ─────────────────── */

function CallActionButton({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group"
    >
      <span
        className={`w-11 h-11 rounded-full inline-flex items-center justify-center transition-all duration-200 ${
          active
            ? "bg-foreground text-paper shadow-[0_4px_12px_-4px_rgba(11,19,38,0.35)]"
            : "bg-foreground/[0.08] text-foreground group-hover:bg-foreground/[0.14] group-active:scale-95"
        }`}
      >
        <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
      </span>
      <span className="text-[9px] font-medium lowercase tracking-[0.02em] text-foreground/70">
        {label}
      </span>
    </button>
  );
}

/* ─── Plus-cross blueprint grid backdrop ────────────────────────────────── */

function PlusGridBackdrop() {
  // A sage "plus mark" repeated on a grid — gives the section the
  // engineered-graph-paper texture from the reference without overwhelming
  // the card. Masked to fade at edges so it integrates with the page bg.
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(color-mix(in srgb, var(--accent) 22%, transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in srgb, var(--accent) 22%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
        backgroundPosition: "0 0",
        opacity: 0.18,
        maskImage:
          "radial-gradient(ellipse 90% 80% at 50% 50%, #000 30%, transparent 95%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 80% at 50% 50%, #000 30%, transparent 95%)",
      }}
    />
  );
}

/* ─── Time formatter ────────────────────────────────────────────────────── */

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
