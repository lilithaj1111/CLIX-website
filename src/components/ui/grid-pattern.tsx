import { useId } from "react";

import { cn } from "@/lib/utils";

/* GridPattern — SVG grid background with optional highlighted cells.
 * Adapted to the Clix palette: default lines/cells use the accent blue
 * (was gray-400) so it sits on-brand. Pass `squares` to light up cells and a
 * `[mask-image:…]` class to fade it. */

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[x: number, y: number]>;
  strokeDasharray?: string;
  className?: string;
  /** Pulse/blink the highlighted cells (staggered). */
  animateSquares?: boolean;
  [key: string]: unknown;
}

function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className,
  animateSquares = false,
  ...props
}: GridPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-accent/[0.07] stroke-accent/20",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy], i) => (
            <rect
              strokeWidth="0"
              key={`${sx}-${sy}`}
              width={width - 1}
              height={height - 1}
              x={sx * width + 1}
              y={sy * height + 1}
              className={animateSquares ? "grid-cell-pulse fill-accent/25" : undefined}
              style={animateSquares ? { animationDelay: `${((i * 0.55) % 4.4).toFixed(2)}s` } : undefined}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

export { GridPattern };
