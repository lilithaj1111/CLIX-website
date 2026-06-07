You are a senior frontend engineer building a premium, cinematic AI company website. Follow every instruction precisely. Do not vibe-code. Every decision must be intentional.

---

## PROJECT OVERVIEW

Build a multi-page marketing website for an AI implementation company. The company builds AI agents, WhatsApp chatbots, CRM systems, workflow automations, custom software, and AI strategy consulting for businesses and organizations.

Reference site for content/copy inspiration and palette structure: https://clixsolution.netlify.app/ (we inherit its warm paper surfaces; accent is swapped from burnt orange to warm purple — see Colors below).

---

## TECH STACK (non-negotiable)

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (scroll animations, page transitions)
- GSAP + ScrollTrigger (hero animations, counter animations, timeline sequences)
- next/font with a premium font pair: Inter or Geist for body, a display font (e.g. Cal Sans or Playfair Display) for hero headlines

---

## DESIGN SYSTEM

### Colors
Warm paper palette borrowed from the Clix reference site, with a warm purple accent (not cool/electric, not white-with-purple). Cream surfaces, deep slate ink, rich plum-purple accent.

- Background base (`--bg`): #F1EDE4 (warm cream)
- Background warm (`--bg-warm`): #EBE6DB (deeper cream, section contrast)
- Paper (`--paper`): #F9F6EE (lightest surface, cards/sheets)
- Foreground / text primary (`--fg`): #262830 (dark slate)
- Ink (`--ink`): #1A1C23 (deepest text, headlines)
- Foreground muted (`--fg-muted`): #6B6961 (secondary text)
- Accent (`--accent`): #7B3AA8 (warm royal purple — CTAs, highlights)
- Accent deep (`--accent-deep`): #5A2880 (pressed states, deep emphasis)
- Accent soft (`--accent-soft`): #E8DAF0 (lavender tint for chips, hover backgrounds)
- Line (`--line`): #D6CFD8 (warm grey-violet borders/dividers)
- Line strong (`--line-strong`): #B5ACBF (emphasized borders)
- Dark section bg (`--ink-warm`): #1F1429 (deep warm plum — for inverted sections, NOT pure black)
- Text on dark (`--fg-on-dark`): #F0E8F5 (soft lavender-white)

Expose these as CSS custom properties (same variable names) in `globals.css` and map them in `tailwind.config` so utilities like `bg-bg`, `text-fg`, `border-line`, `text-accent` work directly.

### Typography scale
- Display (hero): 72–96px, font-weight 700, tight letter-spacing (-0.03em)
- H1: 48–64px, weight 700
- H2: 36–48px, weight 600
- H3: 24px, weight 600
- Body: 16–18px, weight 400, line-height 1.7
- Label/caption: 12–13px, weight 500, uppercase, letter-spacing 0.08em

### Animation principles
- Page load: staggered text reveal (each word or line, not character)
- Scroll: fade-up with slight Y offset (40px → 0), opacity 0 → 1, duration 0.6s, ease out
- Hover: subtle scale(1.02) + shadow lift on cards
- CTA buttons: shimmer sweep on hover using pseudo-element
- Counter animation: count up from 0 when element enters viewport
- DO NOT animate every element. Reserve GSAP for max 4 key moments per page.

### Cursor
- Custom cursor: 12px ink dot (`--ink`) + 40px ring in `--accent` (warm purple) that lags behind with lerp
- Ring fills with `--accent-soft` and scales up on hoverable elements; on dark sections the dot inverts to `--fg-on-dark`

---

## PAGES TO BUILD

### 1. `/` — Home
Sections in order:
1. **Hero** — Full viewport. Large display headline split into two lines. Subheadline (one sentence). Two CTAs: "Start a project" (filled `--accent`, text `--fg-on-dark`) + "Try the Playground" (ghost, border `--line-strong`, text `--ink`). Background: deep plum `--ink-warm` with a slow-moving radial `--accent` orb (CSS animation, not canvas). Noise texture overlay at 4% opacity.
2. **Marquee** — Scrolling ticker of tool/partner logos (WhatsApp, OpenAI, Claude, n8n, Make, Monday.com, HubSpot, Vapi, Gemini). `--paper` background. Infinite loop, pauseable on hover.
3. **System visualization** — Animated SVG or canvas showing interconnected nodes: "AI Brain" center node, surrounding nodes for WhatsApp, CRM, Calendar, Slack, Email. Pulsing connection lines in `--accent` / `--accent-soft`. `--ink-warm` background section.
4. **Services grid** — 6 cards in a 2×3 or 3×2 grid on `--bg-warm`. Each card: number (01–06), service name, one-line description, "Read more" link. Cards sit on `--paper` with `--line` border, shifting to `--accent` border on hover.
5. **Live workflow preview** — 4-step animated sequence (Customer message → AI parses → Systems update → Confirmation sent). Steps highlight in sequence on a 1.5s interval when in viewport.
6. **Process** — Horizontal or vertical 4-step layout: Diagnose, Architect, Build, Operate. Each step has an icon, title, and 2-sentence description.
7. **Stats** — 4 large numbers with labels. Animate count-up on scroll enter. Numbers: 25+ clients, 6 markets, 50+ automations, 2 years.
8. **Testimonials** — Horizontal scroll-snap. 3–4 cards. Each: photo (use placeholder), name, role/company, quote (2–3 sentences), outcome tag.
9. **CTA banner** — Full-width dark section. Large headline. Two CTAs. Subtle animated background.

### 2. `/services` — Services
Sections:
1. **Page hero** — Headline + short paragraph. Light background.
2. **6 service deep-dives** — Each service gets a full anchored section with: service name, tagline, 3-bullet "what you get", tools used (logo chips), and ideal client description. Alternate layout (text left/right) per section.
	- AI Agents
	- WhatsApp Automations
	- CRM Implementation
	- Integrations & Automations
	- Custom Software
	- AI Strategy & Consulting
3. **Tech stack grid** — Logo wall of all tools used. Grayscale by default, color on hover.
4. **Industry chips** — Horizontal scrollable row: Real Estate, Finance, Healthcare, E-commerce, Hospitality, Legal, Education
5. **FAQ accordion** — 8 questions. Animated expand/collapse.
6. **CTA** — "Not sure what you need? Let's talk."

### 3. `/work` — Work
Sections:
1. **Page headline** — "Systems we've shipped. Results they've delivered."
2. **Filter bar** — Filter by: All, AI Agent, WhatsApp, CRM, Custom Software. Pill buttons, animated active state.
3. **Case study grid** — Cards showing: Client name (or anonymized), industry, services used, 1–2 outcome metrics, short description. Minimum 6 cards (use realistic placeholder data).
4. **Featured case** — Full-width expanded card for one case study. Problem → Solution → Stack → Result layout.
5. **Aggregate stats** — 25+ brands, 6 markets, 4 languages.
6. **Testimonials strip** — 2–3 quotes tied to case studies.

### 4. `/playground` — Playground
Sections:
1. **Intro** — "Don't take our word for it. Try it." + short paragraph.
2. **Live AI chatbot** — Embed a working chat widget powered by the Anthropic API (claude-sonnet-4-20250514). System prompt: "You are an AI assistant for [BRAND], an AI implementation company. Ask the user about their business, identify their biggest operational bottleneck, and explain how [BRAND] could solve it with AI automation. Be concise, warm, and direct. Never give generic answers." Show a typing indicator. Style the chat to match the site theme.
3. **Demo modules** — 3 interactive cards: WhatsApp bot simulator (mock conversation UI), AI intake form (fill in your business type and get a custom recommendation), CRM auto-fill demo (paste text, watch it extract name/company/need).
4. **"What powered this" explainer** — After any demo interaction, show a breakdown card: tools used, what happened behind the scenes, estimated time saved.
5. **CTA** — "Ready to build this for your business?" → /contact

### 5. `/about` — About
Sections:
1. **Mission** — Full viewport section. One large sentence. Dark background.
2. **Story** — 3 paragraphs. Who built this, why, what they believe about AI in business.
3. **Team** — 2–4 team member cards. Photo placeholder, name, role, one-line philosophy.
4. **Values** — 3–4 named values. Each: name + 2-sentence explanation. Not buzzwords.
5. **Manifesto** — Long-form editorial section (400–600 words). What "intelligent business" means. Good typography, pull quotes.
6. **CTA** — "Work with us."

---

## SHARED COMPONENTS

### Navbar
- Transparent on load, frosted glass (backdrop-blur-md, `bg-paper/80` with `border-b border-line`) on scroll
- Logo left, links center, CTA button right ("Start a project" — filled `--accent`, text `--fg-on-dark`)
- Mobile: hamburger → full-screen overlay menu (`--ink-warm` bg, `--fg-on-dark` text) with staggered link animation

### Footer
- `--ink-warm` background, text in `--fg-on-dark`
- 4 columns: Brand + tagline | Navigation | Services | Contact
- Bottom row: copyright, legal links, social icons
- Persistent "Book a 30-min call" CTA block at the top of footer

### PageTransition
- Framer Motion layoutId-based transitions between pages
- Subtle fade + slight Y movement

### ScrollReveal wrapper component
```tsx
// components/ScrollReveal.tsx
// Wraps any child and animates it in when it enters the viewport
// Props: delay (number), direction ('up' | 'left' | 'right')
```

### Custom cursor
- Only on desktop (hidden on touch devices)
- Small dot + lagging ring
- Ring scales to 60px and inverts color on `<a>` and `<button>` hover

### ContactModal
- Triggered by any CTA button
- Floating overlay with: Name, Company, Email, What do you need? (textarea), Submit
- Framer Motion scale-in animation

---

## CONTENT GUIDELINES

- All copy must sound like a premium, confident, direct tech company
- No filler phrases ("cutting-edge", "robust", "seamless", "leverage")
- Lead with outcomes, not features
- Numbers and specifics wherever possible
- Tone: intelligent, warm, no-nonsense
- Use the Clix reference site copy as inspiration but rewrite everything

---

---

## RULES

1. Every animation must have a purpose. No animation for decoration alone.
2. The site must be fully responsive. Test every section at 375px, 768px, and 1440px.
3. All data (services, testimonials, case studies, team) lives in /lib/constants.ts — never hardcoded inline.
4. The Playground chatbot must be functional using the Anthropic API. Use environment variable ANTHROPIC_API_KEY.
5. Lighthouse score target: Performance 90+, Accessibility 95+, SEO 90+.
6. Use semantic HTML throughout. Headings hierarchy must be correct on every page.
7. No placeholder "Lorem ipsum" text anywhere. Write real copy.
8. Dark sections use `--ink-warm` (#1F1429, deep warm plum). Never use pure black (#000000) and never use cool slate.
9. Warm purple (`--accent`) is the accent, not the base. The primary background is warm cream (`--bg` / `--paper`) — never pure white, never cool/blue-tinted off-white.
10. Do not install unnecessary packages. Every dependency must earn its place.

---

## START SEQUENCE

Build in this order:
1. Project setup (Next.js, Tailwind config with design tokens, font config)
2. /lib/constants.ts with all site content
3. Shared components: Navbar, Footer, ScrollReveal, CustomCursor, ContactModal
4. Home page (all 9 sections)
5. Services page
6. Work page
7. Playground page (with live Anthropic API integration)
8. About page
9. Final pass: mobile responsiveness, animation polish, Lighthouse audit

Begin with step 1.
