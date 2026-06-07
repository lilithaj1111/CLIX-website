"use client";

/* Shared atomic pieces for project tile animations — keeps the tech overlay
   consistent across all five tiles without copy-pasting the same divs. */

export function BgGrid({ size = 32 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 opacity-25"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
        maskImage:
          "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 90%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 90%)",
      }}
    />
  );
}

export function ScanlineOverlay() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none opacity-20 mix-blend-soft-light"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 4px)",
      }}
    />
  );
}

export function StatusChip({
  label,
  reduced,
}: {
  label: string;
  reduced: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-white/85 whitespace-nowrap">
      <span className="relative inline-flex">
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
        {!reduced && (
          <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        )}
      </span>
      {label}
    </div>
  );
}
