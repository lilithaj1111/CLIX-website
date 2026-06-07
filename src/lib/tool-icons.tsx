/* Brand icons for the homepage ToolFlow section.
 *
 * Source: `simple-icons` (MIT) for 10 of 12 brands. The package doesn't
 * include OpenAI, monday.com or Vapi (removed/unsupported upstream), so
 * those use small geometric stand-ins. Each icon renders inside a 24×24
 * viewBox so they can be swapped freely. */

import type { SVGProps } from "react";
import {
  siWhatsapp,
  siN8n,
  siMake,
  siGooglecalendar,
  siGoogledocs,
  siGooglesheets,
  siClaude,
  siGooglegemini,
  siHostinger,
} from "simple-icons";

export type ToolId =
  | "vapi"
  | "n8n"
  | "make"
  | "openai"
  | "gemini"
  | "monday"
  | "whatsapp"
  | "claude"
  | "gdocs"
  | "gsheets"
  | "gcal"
  | "hostinger";

export type Tool = {
  id: ToolId;
  name: string;
  brand: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
};

/** Render a simple-icons entry's SVG path inside a 24×24 viewBox. The path
 *  data is the official trademarked mark; we recolor via fill so each icon
 *  reads in its brand color on the cream/white tiles. */
function brandIcon(path: string) {
  return function BrandIcon(p: SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        {...p}
      >
        <path d={path} />
      </svg>
    );
  };
}

/* ─── Custom stand-ins for brands not in simple-icons ──────────────────── */

const OpenAI = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" {...p}>
    {/* Simplified knot mark — abstract representation, not the official logo */}
    <path d="M21.55 10.4a5.4 5.4 0 00-.47-4.43 5.46 5.46 0 00-5.87-2.62 5.4 5.4 0 00-4.08-1.83 5.46 5.46 0 00-5.21 3.78 5.4 5.4 0 00-3.61 2.62 5.46 5.46 0 00.67 6.4 5.4 5.4 0 00.47 4.43 5.46 5.46 0 005.87 2.62 5.4 5.4 0 004.08 1.83 5.46 5.46 0 005.21-3.79 5.4 5.4 0 003.61-2.62 5.46 5.46 0 00-.67-6.39zM12.2 21a4.05 4.05 0 01-2.6-.94l.13-.07 4.32-2.5a.7.7 0 00.36-.62v-6.1l1.83 1.06a.07.07 0 01.03.05v5.05A4.06 4.06 0 0112.2 21zM3.5 17.27a4.04 4.04 0 01-.48-2.72l.13.08 4.32 2.5a.7.7 0 00.71 0l5.27-3.05v2.11a.07.07 0 01-.02.06l-4.37 2.52a4.06 4.06 0 01-5.56-1.5zM2.4 8.94a4.04 4.04 0 012.11-1.78V12.34a.7.7 0 00.36.61l5.25 3.03-1.83 1.06a.07.07 0 01-.06 0L3.86 14.5A4.06 4.06 0 012.4 8.94zM17.6 12.51l-5.26-3.06 1.82-1.05a.07.07 0 01.07 0l4.37 2.52a4.05 4.05 0 01-.62 7.33v-5.13a.71.71 0 00-.38-.61zm1.82-2.74l-.13-.08-4.31-2.51a.7.7 0 00-.71 0L9 10.22V8.11a.06.06 0 01.02-.05l4.37-2.52a4.05 4.05 0 016.03 4.2zM8.03 13.53l-1.83-1.05a.07.07 0 01-.03-.06V7.36A4.05 4.05 0 0112.86 3.7l-.13.07L8.41 6.27a.7.7 0 00-.36.61z" />
  </svg>
);

const Monday = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" {...p}>
    {/* Three rounded pills (red, yellow, green) — monday.com style */}
    <rect x="3" y="9.5" width="6" height="5" rx="2.5" fill="#FB275D" />
    <rect x="10.5" y="9.5" width="6" height="5" rx="2.5" fill="#FFCB00" />
    <circle cx="20" cy="12" r="2.5" fill="#00CA72" />
  </svg>
);

const Vapi = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" {...p}>
    {/* Hexagonal snowflake / voice-AI mark — custom geometric */}
    <path
      d="M12 2v6m0 8v6M4.34 6.34l4.24 4.24m6.84 6.84l4.24 4.24M2 12h6m8 0h6M4.34 17.66l4.24-4.24m6.84-6.84l4.24-4.24"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M12 9.5l2.6 1.5v3L12 15.5l-2.6-1.5v-3z"
      stroke="currentColor"
      strokeWidth="1.4"
      fill="none"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Catalog ──────────────────────────────────────────────────────────── */

export const TOOLS: Tool[] = [
  { id: "vapi",      name: "Vapi",            brand: "#5DAFA0",        Icon: Vapi },
  { id: "n8n",       name: "n8n",             brand: `#${siN8n.hex}`,           Icon: brandIcon(siN8n.path) },
  { id: "make",      name: "Make",            brand: `#${siMake.hex}`,          Icon: brandIcon(siMake.path) },
  { id: "openai",    name: "OpenAI",          brand: "#10A37F",        Icon: OpenAI },
  { id: "gemini",    name: "Gemini",          brand: `#${siGooglegemini.hex}`,  Icon: brandIcon(siGooglegemini.path) },
  { id: "monday",    name: "monday.com",      brand: "#FF3D57",        Icon: Monday },
  { id: "whatsapp",  name: "WhatsApp",        brand: `#${siWhatsapp.hex}`,      Icon: brandIcon(siWhatsapp.path) },
  { id: "claude",    name: "Claude",          brand: `#${siClaude.hex}`,        Icon: brandIcon(siClaude.path) },
  { id: "gdocs",     name: "Google Docs",     brand: `#${siGoogledocs.hex}`,    Icon: brandIcon(siGoogledocs.path) },
  { id: "gsheets",   name: "Google Sheets",   brand: `#${siGooglesheets.hex}`,  Icon: brandIcon(siGooglesheets.path) },
  { id: "gcal",      name: "Google Calendar", brand: `#${siGooglecalendar.hex}`,Icon: brandIcon(siGooglecalendar.path) },
  { id: "hostinger", name: "Hostinger",       brand: `#${siHostinger.hex}`,     Icon: brandIcon(siHostinger.path) },
];
