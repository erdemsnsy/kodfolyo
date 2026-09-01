# App Shell Redesign — Playful Maximalist + Kodi Mascot

**Status:** Approved by user (brand kit mockup + mascot poses reviewed and accepted).
**Scope:** Architectural — touches many files across the app shell; excludes the independent portfolio-output theme system.

## Goal

Redesign every part of the app the *operator* sees and touches — landing page, navbar (in its app-shell context), dashboard editor, and the theme-picker's own chrome — into a bold "playful maximalist" identity, and introduce an original mascot ("Kodi") that appears bouncing on the landing hero. The generated public portfolios (`/[username]`), which run on their own 10-preset theme system (`theme.ts`), are explicitly out of scope and keep their current look untouched, aside from the previously-approved custom-accent-color feature layered into that system separately (see "Relationship to the theme-selector work" below).

Trigger: the project is about to be re-pushed to Vercel and re-shared publicly (GitHub, LinkedIn); the bar is "people who saw it before come back and are floored."

## Non-goals

- No redesign of the 10 portfolio output themes (`src/lib/theme.ts`) or components that render *inside* a generated portfolio (`PortfolioHero`, `ProjectCard`, `ProjectGrid`, `PortfolioFooter`, `TechStack`, `ShareModal`). Those stay on the existing system.
- No recreation of GitHub's Octocat likeness — Kodi is an original character (see brand kit).
- No new heavy animation dependency — `framer-motion` is already installed and unused; it covers everything needed here.
- No test-suite introduction — the repo has none today; verification is manual via the `run` skill.

## Brand kit (approved)

**Palette** (hex, used directly in Tailwind arbitrary-value classes, matching the codebase's existing convention of inlined hex rather than CSS custom properties):

| Token | Hex | Use |
|---|---|---|
| Ink (bg) | `#0a0a12` | page background |
| Surface | `#15141f` | cards |
| Surface 2 | `#1c1a29` | elevated/inset elements |
| Border | `#2a2740` | borders |
| Text primary | `#f5f3ff` | headings/body |
| Text secondary | `#b8b3d1` | supporting text |
| Text muted | `#78748f` | captions |
| Accent violet (primary) | `#8b5cf6` / darker `#7c3aed` / outline `#5b21b6` | primary buttons, links, mascot body |
| Accent coral (secondary) | `#ff6b57` | headline highlight word, secondary emphasis |
| Accent lime (sparkle, used sparingly) | `#c6ff4a` | CTA glow ring, mascot antenna, success states only |

**Typography** — three fonts, all already-allowed Google Fonts, loaded via `next/font/google` in `layout.tsx`:
- **Space Grotesk** (700/800) — new, for all display headlines (`h1`/`h2`/hero text). Added as `--font-display`.
- **Plus Jakarta Sans** (400–800) — kept, body copy. Already wired as `--font-sans`.
- **JetBrains Mono** (400/600/700) — kept, labels/badges/tags/code bits. Already wired as `--font-mono`.

**Shape & motion tokens:**
- Radius: cards 20–24px (up from 16px), buttons full pill (`rounded-full`), replacing the current `rounded-xl`/`rounded-2xl` mix.
- Shadow: colored glow shadows (`box-shadow` using the element's own accent color at low alpha) instead of pure-black shadows.
- Motion easing: one signature "bounce ease" `cubic-bezier(0.34, 1.56, 0.64, 1)` used via `framer-motion` `transition.ease` for button hover/press, card entrance, and all mascot motion.

Full visual reference: brand kit canvas (published artifact, reviewed and approved) and the sections below.

## Kodi, the mascot

Original single-blob character (rounded body via one large-radius rect), `</>` chest emblem, lime antenna, no resemblance to Octocat (flat single body, no tentacle legs, no cat ears). Delivered as inline SVG + `framer-motion`, four poses:

- **idle** — default resting state.
- **jump** — continuous bounce loop (translateY + squash/stretch + shadow inverse-scale + sparkle particles). This is the one used on the landing hero.
- **wave** — one arm raised, waving. Reserved for empty/success states, optional for v1.
- **wink** — reserved for empty/error states, optional for v1.

Visual details already validated in the mockup: gradient body fill, glossy highlight ellipse, blush cheeks, double eye-sparkle, eyebrows on energetic poses, twinkle-star particles on jump, colored ambient glow behind the character, `drop-shadow` filter for a "sticker" pop.

**Component:** `src/components/mascot/Kodi.tsx` — `<Kodi pose="jump" size={170} />`. Poses are separate render branches inside one component (shared `<defs>` gradients per instance to avoid SVG id collisions when multiple instances exist on a page — suffix gradient ids with a `useId()`-based key). Animation via `framer-motion`'s `animate` prop with `repeat: Infinity`, not raw CSS `@keyframes`, to match how the rest of the app will start using motion and to make the bounce easing token reusable in code (a shared `BOUNCE_EASE` constant exported from the component file or a small `src/lib/motion.ts`).

## File-by-file changes

**New files:**
- `src/components/mascot/Kodi.tsx` — the mascot component described above.

**Font wiring:**
- `src/app/layout.tsx` — add `Space_Grotesk` from `next/font/google`, variable `--font-display`; add its class to `<html>`.
- `src/app/globals.css` — add a `.font-display { font-family: var(--font-display); }` utility (or use the Tailwind arbitrary `font-[family-name:--font-display]`, whichever reads cleaner in context) and leave `h1`–`h6` mapped to it instead of `--font-sans`.

**App-shell reskin (playful maximalist tokens applied):**
- `src/app/page.tsx` — landing shell: page background, CTA box, footer.
- `src/components/landing/LandingHero.tsx` — headline in Space Grotesk with coral-highlighted word, pill input/button with glow, Kodi (`pose="jump"`) placed beside the headline.
- `src/components/landing/LandingPreview.tsx` — reskin to new tokens (read in full during implementation; currently a self-contained 61-line preview block).
- `src/components/landing/LandingFeatures.tsx` — reskin (69 lines, feature cards → new radius/shadow/color tokens).
- `src/app/dashboard/page.tsx` — dashboard shell: background, the "unsaved changes" banner, save buttons.
- `src/components/dashboard/ProfileEditor.tsx`, `RepoSelector.tsx`, `CustomLinksManager.tsx`, `SyncButton.tsx` — mechanical token substitution (colors/radii/fonts only; no logic changes).
- `src/components/dashboard/ThemeSelector.tsx` — its own chrome (the picker's cards, header, buttons) gets the new app-shell skin. What it lets the user choose (the 10 portfolio presets it renders previews of) is unaffected — see next section.

**Navbar — dual-context component, branches instead of reskinning wholesale:**
- `src/components/navbar/Navbar.tsx` currently derives all its styling from `getTheme(themeType)`. It's called two ways: `<Navbar />` with no `themeType` on the landing page and dashboard (app-shell context, currently defaults to `corporate-dark`), and `<Navbar themeType={profile.theme} headerStyle={...} .../>` on public portfolio pages (portfolio-output context). The change: branch on `themeType === undefined` → render the new app-shell skin (new palette/fonts, small Kodi badge instead of the generic `Code2` square in the logo) for that case only; when `themeType` is provided, keep the existing `getTheme`-driven rendering completely unchanged. This is the one file where the two design systems visibly meet, and the split must stay exact so portfolio pages never see the new palette.

**Explicitly unchanged:** `src/lib/theme.ts`, `PortfolioHero.tsx`, `ProjectCard.tsx`, `ProjectGrid.tsx`, `PortfolioFooter.tsx`, `TechStack.tsx`, `ShareModal.tsx`, `src/app/[username]/page.tsx`'s own styling (only whatever the earlier-approved custom-accent feature touches there).

## Relationship to the theme-selector / custom-accent work

Earlier in this session a separate, already-approved bounded change was scoped: redesign `ThemeSelector.tsx`'s live-preview cards (sourced from real `theme.ts` values instead of duplicated data) and add a per-user custom accent color layered onto a chosen preset, persisted as `customAccent` and threaded through `getTheme(theme, customAccent)` at every consumer. That work is orthogonal to this redesign (it changes the *portfolio* theme system, not the app shell) and is still pending. Since `ThemeSelector.tsx` is touched by both efforts, it's implemented in the same pass as this redesign, in two clearly separate parts of the same diff: the component's own chrome takes the new app-shell tokens; its live-preview cards and the new accent-picker keep reading from `theme.ts` exactly as scoped before, unaffected by the new palette.

## Testing / verification

No test suite exists in this repo. Verification is manual, via the `run` skill:
1. `next dev`, walk landing page, dashboard, and one public portfolio page (`/ornek-ogrenci` or a demo user).
2. Confirm the mascot's jump loop renders and animates on the landing hero.
3. Confirm a public portfolio page still renders with its original (untouched) theme — no palette bleed from the app shell.
4. Check mobile width (375px) on landing and dashboard — headline wrap, button targets ≥44px, no horizontal scroll.
5. `npm run build` (or the project's lint/build script) to catch type errors from the `getTheme` signature change and the new font wiring.

## Rollout

User pushes to Vercel themselves once satisfied with the local/dev result — not part of this implementation pass.
