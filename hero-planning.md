# Hero Planning — Clix particle-mark hero + smooth scroll

Status: **design locked in preview, not yet built into the site.** The look was iterated live in a standalone preview (`hero-particles-preview.html`, served at `/hero-particles-preview.html`). This doc is the spec to build it into the app.

---

## Context

**Goal:** Replace the home video hero ([VideoHero.tsx](src/components/VideoHero.tsx)) with a **3D particle field that forms the Clix logo mark**, in the spirit of the Gemini "Canvas" hero the user referenced (a glowing particle cloud on black — *not* a mesh gradient; that earlier direction was dropped).

**How we got here:** Started from a mesh-gradient idea → user shared the real Gemini reference (a 3D particle burst) → built a three.js particle preview → iterated to the exact behavior below.

**Two additions requested:**
1. Document the **particle hero animation** (this file).
2. Integrate **Lenis smooth scrolling** — *the smooth-scroll animation only*, not the demo component's sticky sections / placeholder copy. Smooth scroll pairs naturally with the scroll-driven build.

**Palette stays the live blue theme** ([globals.css](src/app/globals.css)): `--accent #3B7BF5`, `--accent-2 #7FA9F7`, `--accent-deep #1E4DB8`, dark base `--ink-warm #0F1A2E` / pure black for the hero.

**Reuse, don't rebuild:** the project already ships the stack — [`three`](package.json), `@react-three/fiber`, `@react-three/drei` are installed, and there are existing particle components ([WovenLightHero.tsx](src/components/ui/woven-light-hero.tsx), [ParticleWave.tsx](src/components/three/ParticleWave.tsx)) and the `next/dynamic({ ssr:false })` lazy-mount convention (see [ServicesHero.tsx](src/components/ServicesHero.tsx)).

---

## Part A — The particle hero animation (the locked behavior)

The single source of truth for exact values is the working preview file; key parameters:

**Particles & look**
- ~**44,000** points, additive blending, soft radial sprite, `depthWrite:false`, `sizeAttenuation`, size ~0.15, per-vertex color. Background pure black + faint `FogExp2`. A sparse ~2,200-point **dust starfield** behind for depth.
- **Color:** cyan/white core → cornflower `#3B7BF5` → deep blue, mapped by distance from the mark's center, with ~**3.5% magenta** (`#C026D3`) sparks.

**The mark target (formed state)**
- Sample **only the Clix mark** = the **leftmost square** of `/clix-logo.png` (drops the "clix" wordmark), auto-centered via the sampled pixels' bounding box, fit to ~**15 world units**.
- **Loose, not packed:** XY jitter ±0.28, and a real **Z extrusion (~5-unit thickness)** so the mark is a volumetric slab — turning it side-on shows its **width/depth**, not a flat sheet.

**The scattered state**
- Particles spread **all around the field** (broad volume ≈ ±32 × ±20 × ±16) — the mark explodes outward to fill the space (no ring/circle), then gently floats with a slow, small per-particle wander.

**The build/scatter driver — `form` ∈ [0,1]** (0 = scattered, 1 = mark formed)
- Per-particle staggered `smoothstep(th, th+0.5, form)` with `th ∈ [0, 0.5]` → the mark assembles **gradually**, not all at once.
- `form` is driven by the **max-blend of two sources**, eased (`form += (target-form)*0.06`):
  1. **Scroll:** `scrollY / maxScroll` — scroll down builds, scroll up scatters.
  2. **Idle auto-cycle:** after ~1.2s of no scroll, a cosine cycle builds then disperses forever; **forming runs ~2× slower than dispersing**. Handoff resumes from the current `form` (no jump).

**3D rotation**
- **Auto-rotate** (slow continuous Y spin) on by default, so the depth reads as it turns.
- **Drag to orbit** (pointer drag = spin/tilt, tilt clamped), smoothed; auto-rotate pauses while dragging. Mild camera parallax on mouse.

**In-app changes vs. the preview**
- The preview uses a tall fake spacer to demo scroll. In the app, drive `form` from the hero's own scroll via Framer Motion **`useScroll`** (`scrollYProgress` of the hero section) — no spacer.
- Keep the existing RTL content card (eyebrow / 2-line headline / subhead / 2 CTAs) from VideoHero overlaid on top; the mark sits behind/around it.

### Site build — files

| Action | File | Notes |
|---|---|---|
| **new** | `src/components/three/ParticleLogo.tsx` | R3F `Points` (BufferGeometry + `useFrame` position updates) implementing the spec above. Client-only. |
| **new** | `src/components/ParticleHero.tsx` | `<section dir="rtl">` + `ParticleLogo` (via `next/dynamic ssr:false`) + the VideoHero content card + bottom fade to page bg. Drives `form` with `useScroll`. |
| **edit** | `src/app/page.tsx` | One-line swap `<VideoHero />` → `<ParticleHero />`. VideoHero left intact for easy revert. |
| **asset** | `/clix-logo.png` | Already present; sampled at runtime (mark = leftmost square). |

**Performance & a11y**
- `next/dynamic({ ssr:false, loading:()=>null })`; pure-black section bg covers until WebGL paints.
- Cap `pixelRatio` to ≤2; pause `useFrame` work when the hero is off-screen (`useInView`).
- `useReducedMotion` → render the **mark statically formed** (form=1, no animation loop, no auto-rotate), so it's a still logo constellation. `aria-hidden` on the canvas; h1 hierarchy unchanged.

---

## Part B — Lenis smooth scroll (animation only)

We take **only the smooth-scroll behavior** from the provided `smooth-scroll.tsx` (the `ReactLenis root` wrapper). The demo's three sticky `<section>`s and placeholder headings are **discarded** — they were just a showcase.

**Project compatibility (the integration checklist):**
- **shadcn structure / components path:** the project already has `src/components/ui/` (TS + Tailwind v4). No `components.json`, but it's not needed — we're hand-adding one file. `/components/ui` → **`src/components/ui/`**. (This folder matters because it's the conventional home for reusable, presentation-level UI primitives; keeping the provider here keeps it discoverable and separate from feature components.)
- **Dependency:** `npm i lenis` (one package; it earns its place — smooth scroll is core to the scroll-driven hero feel).
- **Assets / icons:** none. (The demo's Unsplash images / lucide icons are not used — animation only.)
- **Props/state:** none required; it's a global root wrapper. Options control feel.
- **Responsive:** global; affects the whole window scroll on all breakpoints.
- **Where to use:** the **root layout**, wrapping all page content once.

**Files**

| Action | File | Notes |
|---|---|---|
| **new** | `src/components/ui/smooth-scroll.tsx` | A `SmoothScroll` **provider** (not the demo). See skeleton below. |
| **edit** | `src/app/layout.tsx` | Wrap the body content in `<SmoothScroll>…</SmoothScroll>` (around the Nav / `main` / Footer group, [layout.tsx:88-103](src/app/layout.tsx#L88-L103)). |
| **edit** | `src/app/globals.css` *(or the provider)* | `import "lenis/dist/lenis.css";` once (recommended Lenis base styles). |

```tsx
// src/components/ui/smooth-scroll.tsx
"use client";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

/** Site-wide smooth scrolling (Lenis). Animation only — no demo sections. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;                    // respect reduced-motion → native scroll
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
```

**Notes & cautions**
- Lenis animates the real window scroll, so the hero's `useScroll`/`scrollY`-driven `form` keeps working — and gets **smoother**, which is the point.
- Reduced-motion path returns children unwrapped (native scroll) — important for a11y/vestibular safety.
- Watch interplay with any `position: sticky` headers (Nav) and the in-page anchor links — verify they still behave; Lenis generally supports both.

---

## Part C — Sticky reveal on the particle hero (decided: hero only)

**Decision (user):** apply the sticky effect to **the particle hero itself — one section.** The hero **pins** in place while the **next content section slides up and over it** (rounded top + top-shadow = the "card sliding over" reveal). It's a CSS effect (independent of Lenis); Lenis just makes it glide. Previewed in `hero-particles-preview.html`.

**How it works (as previewed, to port to the app)**
- The particle hero stays **pinned** while you scroll its region; the Clix mark **builds** as you scroll through that region (scroll progress → `form`), and the hero's content card **fades** as you go.
- The following content section is **opaque, `position: relative; z-index` above the hero, with `border-radius: 34px 34px 0 0` + a top shadow**, so it rises over the pinned hero. Scroll up → it slides back off and the hero (and particles) return.
- In the app: pin via `position: sticky; top: 0` on the hero (or a fixed canvas behind an opaque next section), and drive `form` from the hero's scroll via Framer Motion `useScroll` (no fake spacer). The idle auto-cycle still runs when not scrolling.

**Constraints / caveats**
- The section that slides over must be **opaque and full-viewport** so it cleanly covers the hero.
- Only the **hero** is sticky — the rest of the page scrolls normally (no multi-panel stack).
- Verify the sticky **Nav** and in-page anchors still behave; reduced-motion → skip the pin/slide (normal flow) and show the static formed mark.

**Files (when built)**: handled inside `src/components/ParticleHero.tsx` (sticky/pinned wrapper + `useScroll`-driven `form` + the fade), plus a small style for the opaque "slide-over" wrapper around the first content section in [page.tsx](src/app/page.tsx).

> A separate multi-section stacking demo also exists (`sticky-sections-preview.html`) if you ever want the effect on more sections — not adopted for now.

---

## Verification

- **Dev server:** use the running instance (port **3001**); hard-reload `/`.
- **Hero:** mark assembles gradually on idle, disperses all-around, reforms; scroll up/down drives build/scatter; **drag to orbit** shows the 3D **side/width**; auto-rotate spins slowly.
- **Smooth scroll:** wheel/trackpad scrolling eases (Lenis); anchor links & sticky Nav still work.
- **375 / 768 / 1440:** mark scales, card readable, CTAs reflow; particle count/pixelRatio acceptable on a phone.
- **Reduced motion:** DevTools → emulate `prefers-reduced-motion: reduce` → static formed mark, no auto-rotate, **native** (non-Lenis) scroll.
- **No white flash** before WebGL paints (black section bg).
- **Lighthouse `/`:** Performance 90+, Accessibility 95+, SEO 90+.
- **Revert:** restore `page.tsx` to `<VideoHero />`; remove `<SmoothScroll>` wrapper.

## Execution steps (when approved)

1. `npm i lenis`.
2. Add `src/components/ui/smooth-scroll.tsx`; wrap layout body; import lenis css.
3. Create `src/components/three/ParticleLogo.tsx` (port the preview's geometry + frame loop into R3F `useFrame`).
4. Create `src/components/ParticleHero.tsx` (dynamic ParticleLogo + VideoHero content card + `useScroll`-driven `form` + idle cycle + reduced-motion static fallback).
5. Swap the hero in `src/app/page.tsx`.
6. Run dev, verify the checklist, tune particle count/size/timing for production.
7. Delete the throwaway preview files (`hero-particles-preview.html`, `hero-gradient-preview.html`, and their `public/` copies).
