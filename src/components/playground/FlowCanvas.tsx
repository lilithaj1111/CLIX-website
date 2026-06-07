"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NODE_LIST,
  NODE_SPECS,
  NODE_WIDTH,
  NODE_HEIGHT,
  PORT_Y_OFFSET,
  type FlowEdge,
  type FlowNode,
  type NodeSpec,
} from "./types";
import { Play, Square, RotateCcw, Trash2, Plus } from "lucide-react";

type DragKind =
  | { type: "none" }
  | { type: "palette"; spec: NodeSpec; x: number; y: number }
  | { type: "node"; id: string; offsetX: number; offsetY: number }
  | { type: "wire"; fromId: string; toX: number; toY: number };

/* Default playground scene — clean 2×4 grid with two parallel rails and
 * two cross-traffic diagonals placed in separate column-gaps so no two
 * lines visibly cross:
 *
 *   Triggers          Routing           Brain + data        Actions
 *   ──────────────────────────────────────────────────────────────────
 *   WhatsApp In  ──→  Classifier  ──→  AI Agent     ──→  WhatsApp Send
 *                                ↗               ↘
 *   Webhook      ──→  Branch     ──→  Database   ──→  Slack
 *
 * 8 nodes, 8 edges. Top rail handles conversational intent. Bottom rail
 * handles structured data. The diagonals (Branch → AI Agent in the col
 * 2→3 gap; AI Agent → Slack in the col 3→4 gap) show the brain pulling
 * from both lanes and notifying across channels — and because each
 * diagonal lives in its own gap and shares a node with its neighbour
 * rail edges, none of the lines visibly intersect. */
/* Hub-style starter layout: two parallel rails (intent on top, data on
 * bottom) converge into a centered AI Agent that bridges them, then fan
 * back out to the two action endpoints. Spaced for a typical desktop
 * canvas (~1280px); on the narrowest desktop the rightmost column may
 * just clip past the visible area. */
const STARTER_NODES: FlowNode[] = [
  // Top rail — intent track
  { id: "n1", kind: "wa-trigger", x: 60,   y: 80  },
  { id: "n3", kind: "classifier", x: 370,  y: 80  },
  { id: "n7", kind: "wa-send",    x: 1020, y: 80  },
  // Centered brain + the data store directly below it
  { id: "n5", kind: "agent",      x: 680,  y: 270 },
  { id: "n6", kind: "db",         x: 680,  y: 490 },
  // Bottom rail — data track
  { id: "n2", kind: "webhook",    x: 60,   y: 490 },
  { id: "n4", kind: "branch",     x: 370,  y: 490 },
  { id: "n8", kind: "slack",      x: 1020, y: 490 },
];

const STARTER_EDGES: FlowEdge[] = [
  // Top rail — intent → brain → reply
  { id: "e1", from: "n1", to: "n3" }, // WhatsApp In → Classifier
  { id: "e3", from: "n3", to: "n5" }, // Classifier  → AI Agent
  { id: "e5", from: "n5", to: "n7" }, // AI Agent    → WhatsApp Send
  // Bottom rail — data → store → notify
  { id: "e2", from: "n2", to: "n4" }, // Webhook     → Branch
  { id: "e4", from: "n4", to: "n6" }, // Branch      → Database
  { id: "e6", from: "n6", to: "n8" }, // Database    → Slack
  // Cross-traffic — each diagonal in its own column-gap
  { id: "e7", from: "n4", to: "n5" }, // Branch      → AI Agent (col 2→3 gap)
  { id: "e8", from: "n5", to: "n8" }, // AI Agent    → Slack    (col 3→4 gap)
];

let _id = 100;
const nextId = () => `n${++_id}`;

const CATEGORY_LABELS: Record<"Trigger" | "AI" | "Action" | "Data", string> = {
  Trigger: "טריגרים",
  AI: "AI",
  Action: "פעולות",
  Data: "נתונים",
};

export function FlowCanvas() {
  const [nodes, setNodes] = useState<FlowNode[]>(STARTER_NODES);
  const [edges, setEdges] = useState<FlowEdge[]>(STARTER_EDGES);
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(true);
  const [drag, setDrag] = useState<DragKind>({ type: "none" });
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const portOut = useCallback(
    (n: FlowNode) => ({ x: n.x + NODE_WIDTH, y: n.y + PORT_Y_OFFSET }),
    []
  );
  const portIn = useCallback(
    (n: FlowNode) => ({ x: n.x, y: n.y + PORT_Y_OFFSET }),
    []
  );

  const byId = useMemo(() => {
    const m = new Map<string, FlowNode>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  // Global pointer handlers for dragging — pointer events cover mouse,
  // touch, and pen with one code path. We listen on the window so the
  // pointer can leave the canvas mid-drag without losing the event.
  useEffect(() => {
    if (drag.type === "none") return;

    const onMove = (e: PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (drag.type === "node") {
        setNodes((cur) =>
          cur.map((n) =>
            n.id === drag.id
              ? {
                  ...n,
                  x: Math.max(0, x - drag.offsetX),
                  y: Math.max(0, y - drag.offsetY),
                }
              : n
          )
        );
      } else if (drag.type === "wire") {
        setDrag({ ...drag, toX: x, toY: y });
      } else if (drag.type === "palette") {
        setDrag({ ...drag, x: e.clientX, y: e.clientY });
      }
    };

    const onUp = (e: PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (drag.type === "palette" && rect) {
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        if (inside) {
          const x = e.clientX - rect.left - NODE_WIDTH / 2;
          const y = e.clientY - rect.top - NODE_HEIGHT / 2;
          setNodes((cur) => [
            ...cur,
            {
              id: nextId(),
              kind: drag.spec.kind,
              x: Math.max(0, x),
              y: Math.max(0, y),
            },
          ]);
        }
      } else if (drag.type === "wire" && rect) {
        // check if dropped on a node's input port
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const target = nodes.find((n) => {
          if (n.id === drag.fromId) return false;
          const p = portIn(n);
          const dx = p.x - x;
          const dy = p.y - y;
          // generous hit area on the left edge — slightly bigger for touch
          return (
            Math.abs(dx) < 30 &&
            Math.abs(dy) < NODE_HEIGHT / 2 + 8 &&
            x < n.x + NODE_WIDTH / 2
          );
        });
        if (target) {
          setEdges((cur) => {
            // prevent duplicates and self-loops
            if (cur.some((e) => e.from === drag.fromId && e.to === target.id))
              return cur;
            return [
              ...cur,
              {
                id: `e${Date.now()}`,
                from: drag.fromId,
                to: target.id,
              },
            ];
          });
        }
      }
      setDrag({ type: "none" });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [drag, nodes, portIn]);

  // Keyboard delete
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      )
        return;
      if ((e.key === "Backspace" || e.key === "Delete") && selected) {
        setNodes((cur) => cur.filter((n) => n.id !== selected));
        setEdges((cur) =>
          cur.filter((e) => e.from !== selected && e.to !== selected)
        );
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const reset = () => {
    setNodes(STARTER_NODES);
    setEdges(STARTER_EDGES);
    setSelected(null);
  };

  const clearAll = () => {
    setNodes([]);
    setEdges([]);
    setSelected(null);
  };

  const startNodeDrag = (e: React.PointerEvent, n: FlowNode) => {
    if (
      (e.target as HTMLElement).closest("[data-port]") ||
      (e.target as HTMLElement).closest("[data-no-drag]")
    )
      return;
    e.stopPropagation();
    setSelected(n.id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag({
      type: "node",
      id: n.id,
      offsetX: e.clientX - rect.left - n.x,
      offsetY: e.clientY - rect.top - n.y,
    });
  };

  const startWire = (e: React.PointerEvent, n: FlowNode) => {
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const out = portOut(n);
    setDrag({
      type: "wire",
      fromId: n.id,
      toX: out.x,
      toY: out.y,
    });
  };

  const startPaletteDrag = (e: React.PointerEvent, spec: NodeSpec) => {
    e.preventDefault();
    setDrag({ type: "palette", spec, x: e.clientX, y: e.clientY });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Palette — horizontal strip above the canvas. Nodes are grouped
          inline by category, with subtle dividers between groups. Scrolls
          horizontally on narrow viewports. Soft accent-blue background
          ties the palette to the brand colour. */}
      <aside className="border border-accent-deep/40 rounded-2xl overflow-hidden bg-accent">
        <div className="px-4 md:px-5 py-3 border-b border-paper/20 flex items-baseline justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/70">
              מדף הצמתים
            </div>
            <h3 className="mt-1 text-sm md:text-[15px] tracking-tight text-paper">
              גררו אל הקנבס
            </h3>
          </div>
          <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50 whitespace-nowrap">
            {NODE_LIST.length} צמתים זמינים
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden p-3">
          <div className="flex items-end gap-4 md:gap-6 w-max">
            {(["Trigger", "AI", "Action", "Data"] as const).map((cat, ci) => (
              <div key={cat} className="flex items-end gap-4 md:gap-6 shrink-0">
                {ci > 0 && (
                  <span
                    aria-hidden
                    className="self-stretch w-px bg-paper/25 mb-1"
                  />
                )}
                <div className="shrink-0">
                  <div className="px-1 mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60">
                    {CATEGORY_LABELS[cat]}
                  </div>
                  <div className="flex gap-1.5">
                    {NODE_LIST.filter((n) => n.category === cat).map((n) => {
                      const Icon = n.icon;
                      return (
                        <button
                          key={n.kind}
                          onPointerDown={(e) => startPaletteDrag(e, n)}
                          className="group flex items-center gap-2 ps-2 pe-3 py-1.5 rounded-full border border-paper/40 bg-paper hover:bg-paper/90 transition cursor-grab active:cursor-grabbing select-none text-start touch-none"
                        >
                          <span
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{
                              background: `color-mix(in srgb, ${n.accent} 14%, transparent)`,
                              color: n.accent,
                            }}
                          >
                            <Icon size={13} />
                          </span>
                          <div className="text-[12.5px] leading-tight font-medium whitespace-nowrap text-foreground">
                            {n.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Canvas wrapper — full width beneath the palette. */}
      <div className="relative h-[60vh] min-h-[420px] md:h-[640px]">
        {/* Toolbar */}
        <div className="absolute z-30 top-2 md:top-3 left-2 md:left-3 right-2 md:right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper/80 backdrop-blur border border-line/70 font-mono text-[10px] tracking-[0.14em] text-foreground/55 whitespace-nowrap">
            <span className="tabular-nums">{nodes.length}</span>
            <span>צמתים</span>
            <span className="text-foreground/20">/</span>
            <span className="tabular-nums">{edges.length}</span>
            <span>חיבורים</span>
          </div>
          <div className="pointer-events-auto flex items-center gap-1.5 md:gap-2 ml-auto">
            <button
              onClick={() => setRunning((r) => !r)}
              className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition ${
                running
                  ? "border border-accent/40 bg-accent/12 text-accent hover:bg-accent/20"
                  : "border border-transparent bg-accent text-paper hover:opacity-90"
              }`}
            >
              {running ? <Square size={12} /> : <Play size={12} />}
              <span className="hidden sm:inline">
                {running ? "עצירה" : "הפעלה"}
              </span>
            </button>
            <button
              onClick={reset}
              aria-label="איפוס"
              className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1.5 rounded-full text-xs md:text-sm border border-line bg-paper hover:border-foreground/40 text-foreground/75 hover:text-foreground transition"
            >
              <RotateCcw size={12} />
              <span className="hidden md:inline">איפוס</span>
            </button>
            <button
              onClick={clearAll}
              aria-label="ניקוי"
              className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1.5 rounded-full text-xs md:text-sm border border-line bg-paper hover:border-foreground/40 text-foreground/75 hover:text-foreground transition"
            >
              <Trash2 size={12} />
              <span className="hidden md:inline">ניקוי</span>
            </button>
          </div>
        </div>

        <div
          ref={canvasRef}
          onPointerDown={() => setSelected(null)}
          className="relative w-full h-full rounded-2xl border border-line overflow-hidden bg-paper touch-none"
        >
          {/* Lime / mint radiant atmosphere — same family as the home
              page's IntegrationsSection / VoiceAgentSection backgrounds,
              tying the playground into the site's visual rhythm. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                "radial-gradient(40% 50% at 25% 30%, color-mix(in srgb, #A3E635 22%, transparent), transparent 70%)",
                "radial-gradient(38% 48% at 75% 60%, color-mix(in srgb, #5EEAD4 20%, transparent), transparent 70%)",
                "radial-gradient(32% 42% at 50% 85%, color-mix(in srgb, #FDE68A 18%, transparent), transparent 70%)",
              ].join(", "),
            }}
          />

          {/* Dot grid — sits above the lime atmosphere so both read at once. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, color-mix(in srgb, var(--line-strong) 55%, transparent) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0",
            }}
          />

          {/* Edges */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--fg)" opacity="0.3" />
              </marker>
            </defs>

            {edges.map((e) => {
              const a = byId.get(e.from);
              const b = byId.get(e.to);
              if (!a || !b) return null;
              const p1 = portOut(a);
              const p2 = portIn(b);
              const d = bezier(p1.x, p1.y, p2.x, p2.y);
              return (
                <g key={e.id}>
                  <path
                    id={`p-${e.id}`}
                    d={d}
                    fill="none"
                    stroke="var(--fg)"
                    strokeOpacity="0.18"
                    strokeWidth={1.25}
                    markerEnd="url(#arrow)"
                  />
                  {running && (
                    <circle r="3" fill="var(--accent)">
                      <animateMotion
                        dur="2.4s"
                        repeatCount="indefinite"
                        rotate="auto"
                        path={d}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {drag.type === "wire" &&
              (() => {
                const from = byId.get(drag.fromId);
                if (!from) return null;
                const p1 = portOut(from);
                const d = bezier(p1.x, p1.y, drag.toX, drag.toY);
                return (
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                );
              })()}
          </svg>

          {/* Nodes */}
          {nodes.map((n) => {
            const spec = NODE_SPECS[n.kind];
            const Icon = spec.icon;
            const isSel = selected === n.id;
            return (
              <div
                key={n.id}
                onPointerDown={(e) => startNodeDrag(e, n)}
                onClick={(e) => e.stopPropagation()}
                className={`absolute select-none transition-shadow touch-none ${
                  isSel ? "shadow-2xl" : "shadow-sm"
                }`}
                style={{
                  left: n.x,
                  top: n.y,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                  cursor:
                    drag.type === "node" && drag.id === n.id
                      ? "grabbing"
                      : "grab",
                }}
              >
                <div
                  className={`relative w-full h-full rounded-xl border ${
                    isSel
                      ? "border-accent shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
                      : "border-accent/20 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                  } overflow-hidden transition-shadow`}
                  style={{ background: "color-mix(in srgb, var(--accent) 8%, var(--paper))" }}
                >
                  <div className="px-3.5 py-3 flex items-center gap-3 h-full">
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: `color-mix(in srgb, ${spec.accent} 14%, transparent)`,
                        color: spec.accent,
                      }}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] leading-tight font-medium text-foreground">
                        {spec.label}
                      </div>
                      <div className="text-[10.5px] text-foreground/50 leading-tight truncate mt-0.5">
                        {spec.subtitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input port */}
                <div
                  data-port="in"
                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 bg-background"
                  style={{ borderColor: "var(--line-strong)" }}
                  title="כניסה"
                />
                {/* Output port — drag start. Slightly larger hit area on
                    mobile via the negative inset, plus touch-none so a
                    finger drag here doesn't scroll the page. */}
                <div
                  data-port="out"
                  onPointerDown={(e) => startWire(e, n)}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent cursor-crosshair hover:scale-125 transition-transform touch-none"
                  title="גררו כדי לחבר"
                />
              </div>
            );
          })}

          {/* Hint when empty */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <div className="inline-flex w-10 h-10 rounded-full border border-line items-center justify-center bg-paper">
                <Plus size={18} className="text-foreground/45" />
              </div>
              <div className="mt-3 text-sm text-foreground/55">
                גררו צומת מהמדף שבצד כדי להתחיל
              </div>
            </div>
          )}
        </div>

        {/* Palette ghost while dragging */}
        {drag.type === "palette" && (
          <div
            className="fixed pointer-events-none z-50 px-3 py-2 rounded-xl bg-paper border border-accent/70 shadow-[0_18px_40px_-12px_color-mix(in_srgb,var(--accent)_55%,transparent)] flex items-center gap-2.5"
            style={{
              left: drag.x - 16,
              top: drag.y - 16,
            }}
          >
            <span
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: `color-mix(in srgb, ${drag.spec.accent} 18%, transparent)`,
                color: drag.spec.accent,
              }}
            >
              <drag.spec.icon size={14} />
            </span>
            <span className="text-sm">{drag.spec.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const offset = Math.max(60, Math.abs(x2 - x1) * 0.45);
  return `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
}
