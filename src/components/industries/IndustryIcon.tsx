import type { LucideIcon } from "lucide-react";

/* Foreplay-inspired glossy app-icon tile, in baby blue. A light-blue gradient
 * base with a top sheen, a soft inner glow, and a crisp white glyph — reads
 * like a premium 3D app icon. Used on the /industries cards, the sector detail
 * hero, and the nav dropdown. Presentational only (safe in server & client). */

const SIZES = {
  sm: { box: "h-9 w-9 rounded-[0.65rem]", icon: "h-[18px] w-[18px]" },
  md: { box: "h-14 w-14 rounded-2xl", icon: "h-[26px] w-[26px]" },
  lg: { box: "h-16 w-16 rounded-[1.15rem]", icon: "h-7 w-7" },
} as const;

export function IndustryIcon({
  Icon,
  size = "md",
  className = "",
}: {
  Icon?: LucideIcon;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ring-1 ring-white/50 ${s.box} ${className}`}
      style={{
        background: "linear-gradient(158deg, #A99BF5 0%, #A99BF5 46%, #845EF7 100%)",
        boxShadow:
          "inset 0 1.5px 0 rgba(255,255,255,0.85), inset 0 -8px 13px rgba(43,92,162,0.28), 0 16px 28px -12px rgba(96,158,235,0.6)",
      }}
    >
      {/* glossy top sheen */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.65), transparent)" }}
      />
      {/* soft inner glow */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(62% 56% at 50% 40%, rgba(255,255,255,0.5), transparent 72%)" }}
      />
      {/* faint lime accent — just a touch in the corner */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(40% 38% at 80% 84%, rgba(163,230,53,0.42), transparent 66%)" }}
      />
      {Icon && (
        <Icon
          className={`relative text-white ${s.icon}`}
          strokeWidth={2}
          style={{ filter: "drop-shadow(0 1px 2px rgba(40,86,156,0.55))" }}
        />
      )}
    </span>
  );
}
