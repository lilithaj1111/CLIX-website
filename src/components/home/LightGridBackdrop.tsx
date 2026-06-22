/* Light "playground" backdrop — pale surface gets a soft violet/cyan radial
   glow plus a faint dot grid, mirroring the playground FlowCanvas look.
   Render as the first child of a `relative` section, then put the section
   content above it with `relative z-[1]`. */
export function LightGridBackdrop() {
  return (
    <>
      {/* Soft brand-palette glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(45% 55% at 22% 24%, color-mix(in srgb, #845EF7 16%, transparent), transparent 70%)",
            "radial-gradient(40% 50% at 82% 30%, color-mix(in srgb, #3A94C5 12%, transparent), transparent 70%)",
            "radial-gradient(55% 55% at 60% 104%, color-mix(in srgb, #A99BF5 16%, transparent), transparent 70%)",
          ].join(", "),
        }}
      />
      {/* Faint dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--line-strong) 50%, transparent) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
    </>
  );
}
