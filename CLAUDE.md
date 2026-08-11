# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

A portfolio site whose job is **lead generation** for web, app and AI-agent
development work, plus a resume for recruiters. Vite + React 19 + TypeScript +
Tailwind v4, deployed on Vercel.

The owner is a student currently interning, with two shipped projects. The site
therefore wins on **demonstrated capability**, not track record — which is why
the interactive component Lab is the centrepiece, not a garnish.

## Commands

```bash
npm run dev          # dev server on :5173
npm run build        # typecheck + production build
npm run typecheck    # types only
npm run check:secrets # MUST pass before any deploy — see below
```

## Design system — read this before touching styles

The visual language is **editorial / gallery**: warm off-white paper, oversized
Instrument Serif headlines, hairline rules, wide margins. Light is the default;
dark is a first-class alternate.

**All colour lives in `src/styles/globals.css` as semantic roles.** Never write a
raw hex or a Tailwind palette colour (`violet-500`, `zinc-800`) in a component.

| Use | Token |
|---|---|
| Page background | `bg-paper` |
| Cards, nav, panels | `bg-paper-2` |
| Insets, code wells, hovers | `bg-paper-3` |
| Headlines, primary text | `text-ink` |
| Body copy | `text-ink-2` |
| Labels, captions, meta | `text-ink-3` |
| Hairlines | `border-rule`, `border-rule-strong` |
| Accent (petrol) | `text-accent`, `bg-accent`, `text-on-accent` |

Roles resolve through `@theme inline`, so `bg-paper` emits `var(--paper)` and one
attribute flip re-themes the whole site. Changing the accent is **two lines** in
`globals.css` (light and dark).

### Rules that are easy to break

- **Accent discipline.** Roughly one accent element per viewport — a section
  number, one word in a headline, the active state. Two competing accents on
  screen means one is wrong.
- **No monospace in the UI.** `font-mono` belongs only in `CodeBlock.tsx`. Mono
  labels and eyebrows are what made the previous design read as a dev tool.
  Use the `.eyebrow` class for catalogue labels.
- **No glassmorphism, no gradient meshes, no neon glow.** Depth comes from
  hairlines, shadow and whitespace. `.card` is the only surface.
- **`--redline` is reserved** for motorcycle easter eggs only — never as a general
  error or accent colour. It is deliberately distinct from the accent.
- **Chart colour is exempt from brand rules.** `--series-1/2` are validated per
  theme for contrast and colour-blind separation. Do not "fix" them to match the
  accent; one hue cannot encode two series.

### Motion

Two easing curves: `[0.16, 1, 0.3, 1]` for entrances, `[0.76, 0, 0.24, 1]` for
curtains. Animate `transform`/`opacity`/`clip-path` only.

Every motion component gates on `useReducedMotion()`, and hover-driven effects
(cursor, magnetic, tilt, spotlight, hover previews) also gate on
`usePointerFine()` — they misbehave badly on touch.

## Architecture

```
api/chat.ts              Vercel edge fn — the ONLY place provider keys are read
src/content/*.ts         All copy and data. Edit here, never inline in JSX.
src/components/motion/    Magnetic, Spotlight, Tilt3D, Reveal, CountUp, LetterSwap
src/components/ui/        Card, Button, Chip, Section, SectionHeading, Wheel, …
src/components/layout/    Nav, Footer, Cursor, ThemeToggle, Curtain, Preloader, …
src/components/sections/  One file per page section
src/components/lab/       The 12 demos + registry + snippets
```

`src/content/` is the single source of truth: it drives the rendered page **and**
the AI agent's RAG corpus (`src/lib/rag.ts`), so the agent can never contradict
what the site claims. Update a project there and the agent's answers update too.

## The AI agent — three-tier cascade

`Databricks Model Serving → OpenRouter free models → scripted answers`

- Tier 1 and 2 live in `api/chat.ts`. Tier 3 is client-side in `src/lib/fallback.ts`
  so it works even when `/api` does not exist (plain `vite preview`, static host).
- OpenRouter free model ids churn constantly, so the function fetches the live
  zero-price list rather than hardcoding one. The hardcoded list is a last-ditch seed.

### Credential safety — non-negotiable

`api/chat.ts` must **never** be imported from `src/`. A Databricks PAT is a
*workspace credential*, not just a billing risk — it inherits the permissions of
the identity that minted it. Anything Vite can see ships to the browser in
plaintext.

Run `npm run check:secrets` after every build. It fails the build if a credential
reaches `dist/`.

## Placeholders still to fill

`src/content/site.ts` holds every unfilled value, each marked `TODO`: name,
GitHub, LinkedIn, WhatsApp, resume path, Web3Forms key. Real project screenshots
go in `src/content/projects.ts` and feed the Work section's hover previews.
