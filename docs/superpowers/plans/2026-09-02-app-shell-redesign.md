# App Shell Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the whole app shell (landing, navbar in its app-shell context, dashboard, theme-picker chrome) into a warm dark "playful maximalist" identity, add an original bouncing mascot ("Kodi") to the landing hero, and (bundled in because it touches the same files) ship the previously-approved custom-accent-color feature for the portfolio theme system.

**Architecture:** Two independent concerns share this plan because they touch overlapping files: (1) a pure visual reskin driven by a fixed hex/token table applied file-by-file, with `Navbar.tsx` branching on whether `themeType` is passed so portfolio pages never see the new palette; (2) a small feature addition (`custom_accent`) threaded from Supabase through `getTheme()` to every portfolio-rendering component. No test suite exists in this repo — every task's verification step is `npx tsc --noEmit` plus a precise manual browser check, per the spec's Testing section.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS v4, `framer-motion` (already installed, unused until this plan), Supabase, `next/font/google`.

**Spec:** `docs/superpowers/specs/2026-09-02-app-shell-redesign-design.md`

## Global Constraints

- Palette (exact hex, from spec): ink `#14110f`, surface `#1f1a16`, surface-2 `#291f19`, border `#3a2c22`, text primary `#fdf6ec`, text secondary `#cbb9a0`, text muted `#8a7864`, accent coral `#ff5a3c`, accent mustard `#f5b83d`, accent sky `#4fd8ff` (sparingly — sparkle particles / success states only).
- Shadows are flat and hard-edged (`Npx Npy 0 0 #14110f`, no blur) — never a blurred/colored glow. Cards get `rounded-3xl` (24px, Tailwind built-in), buttons get `rounded-full`.
- Motion easing token: `[0.34, 1.56, 0.64, 1]` (cubic-bezier), used for every `framer-motion` transition in this plan.
- Mascot fill is flat solid color — no gradients, no soft ambient glow.
- `src/lib/theme.ts`, `PortfolioHero.tsx`, `ProjectCard.tsx`, `ProjectGrid.tsx`, `PortfolioFooter.tsx`, `TechStack.tsx`, `ShareModal.tsx` keep their existing visual system untouched except for the mechanical `customAccent` parameter threading in Task 13 — never apply the new palette there.
- `Navbar.tsx` renders the new palette ONLY when `themeType` is `undefined` (app-shell call sites); when `themeType` is provided (portfolio pages) it must render exactly as it does today.
- No new dependencies. No test framework introduction.
- Every task ends with `npx tsc --noEmit` passing and a git commit.

---

## Task 1: Fonts and heading typography

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS variable `--font-display` (Space Grotesk), applied to `h1`–`h6` globally. Later tasks reference `font-[family-name:--font-display]` or rely on the automatic `h1`–`h6` mapping — no task needs to import a font itself.

- [ ] **Step 1: Add the Space Grotesk font in `layout.tsx`**

Replace the full contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kodfolyo - Terminal & Developer Minimalist Portfolyo',
  description:
    'GitHub profilinizdeki verileri (bio, repolar, diller) otomatik çekerek sade, karakterli ve minimalist portföy siteleri oluşturan ücretsiz web uygulaması.',
  keywords: ['GitHub', 'Portfolyo', 'CV', 'Developer Portfolio', 'Minimalist', 'Next.js', 'Kodfolyo'],
  openGraph: {
    title: 'Kodfolyo - Minimalist Portfolyo Üreteci',
    description: 'GitHub profilinizden sade, terminal estetiğinde portföy oluşturun.',
    siteName: 'Kodfolyo',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${jetbrainsMono.variable} ${plusJakartaSans.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#14110f] text-[#fdf6ec] font-sans antialiased selection:bg-[#ff5a3c] selection:text-[#14110f]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update `globals.css` tokens and heading font**

Replace the full contents of `src/app/globals.css` with:

```css
@import "tailwindcss";

@layer base {
  :root {
    --font-mono: 'JetBrains Mono', monospace;
    --font-sans: 'Plus Jakarta Sans', sans-serif;
    --font-display: 'Space Grotesk', sans-serif;
  }

  body {
    font-family: var(--font-sans);
    background-color: #14110f;
    color: #fdf6ec;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
  }

  .font-mono-code {
    font-family: var(--font-sans);
  }
}

/* Kurumsal / Executive Panel Stilleri */
.terminal-window {
  background-color: #141619;
  border: 1px solid #23272e;
  border-radius: 16px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
}

.terminal-header {
  background-color: #0f1013;
  border-bottom: 1px solid #23272e;
  padding: 12px 18px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

/* ================= PDF / PRINT STİLLERİ ================= */
@media print {
  header, footer, nav, .no-print {
    display: none !important;
  }

  body {
    background-color: #ffffff !important;
    color: #09090b !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  main {
    padding: 0 !important;
    margin: 0 !important;
  }

  .print-page {
    box-shadow: none !important;
    border: 1px solid #e4e4e7 !important;
  }
}
```

(`.terminal-window`/`.terminal-header` are unused by anything in this plan's scope — left untouched deliberately; print rules are portfolio-output only and stay untouched per the spec.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, open `http://localhost:3005/`. Confirm the page background is warm near-black (not the old blue-black) and any heading renders in a distinct geometric display face (Space Grotesk), different from the body paragraph font.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: add Space Grotesk display font and warm ink token

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 2: Kodi mascot component

**Files:**
- Create: `src/components/mascot/Kodi.tsx`

**Interfaces:**
- Produces: `export default function Kodi({ pose, size }: { pose: 'idle' | 'wave' | 'jump' | 'wink'; size?: number })`, and `export const BOUNCE_EASE: [number, number, number, number]`. Later tasks (`LandingHero.tsx`, `LandingFeatures.tsx`) import `Kodi` as `import Kodi from '@/components/mascot/Kodi'`.
- Consumes: `framer-motion` (`motion.svg`, `motion.g`, `motion.ellipse`, `motion.circle`, `motion.path`) — already a project dependency.

- [ ] **Step 1: Create the component**

Create `src/components/mascot/Kodi.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';

export const BOUNCE_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

interface KodiProps {
  pose: 'idle' | 'wave' | 'jump' | 'wink';
  size?: number;
}

const BODY = '#ff5a3c';
const OUTLINE = '#7c2d18';
const CREAM = '#fdf6ec';
const DARK = '#3a1810';
const BLUSH = '#ffb199';
const MUSTARD = '#f5b83d';
const SKY = '#4fd8ff';

function Torso() {
  return (
    <>
      <rect x="23" y="19" width="114" height="118" rx="52" ry="52" fill={BODY} stroke={OUTLINE} strokeWidth="3" />
      <ellipse cx="58" cy="42" rx="20" ry="12" fill="#ffffff" opacity="0.16" transform="rotate(-18 58 42)" />
      <rect x="60" y="47" width="40" height="20" rx="8" fill={CREAM} />
      <text x="80" y="61" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700" fill={OUTLINE}>{'</>'}</text>
      <ellipse cx="60" cy="155" rx="14" ry="10" fill={OUTLINE} />
      <ellipse cx="100" cy="155" rx="14" ry="10" fill={OUTLINE} />
    </>
  );
}

function Antenna({ animated }: { animated: boolean }) {
  return (
    <>
      <line x1="80" y1="19" x2="80" y2="3" stroke={MUSTARD} strokeWidth="3" strokeLinecap="round" />
      {animated ? (
        <motion.circle
          cx="80" cy="0" r="7" fill={MUSTARD}
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: BOUNCE_EASE }}
        />
      ) : (
        <circle cx="80" cy="0" r="7" fill={MUSTARD} />
      )}
    </>
  );
}

function Idle() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 195">
      <ellipse cx="80" cy="180" rx="44" ry="9" fill="#000000" opacity="0.35" />
      <Antenna animated={false} />
      <Torso />
      <ellipse cx="40" cy="93" rx="7" ry="4" fill={BLUSH} opacity="0.65" />
      <ellipse cx="120" cy="93" rx="7" ry="4" fill={BLUSH} opacity="0.65" />
      <ellipse cx="47" cy="75" rx="12" ry="15" fill={CREAM} />
      <ellipse cx="113" cy="75" rx="12" ry="15" fill={CREAM} />
      <circle cx="50" cy="79" r="5" fill={DARK} />
      <circle cx="116" cy="79" r="5" fill={DARK} />
      <circle cx="47.5" cy="75.5" r="1.8" fill="#ffffff" />
      <circle cx="113.5" cy="75.5" r="1.8" fill="#ffffff" />
      <path d="M63 103 Q80 113 97 103" stroke={DARK} strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="25" cy="105" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(-14 25 105)" />
      <ellipse cx="135" cy="105" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(14 135 105)" />
    </svg>
  );
}

function Wave() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 195">
      <ellipse cx="80" cy="180" rx="44" ry="9" fill="#000000" opacity="0.35" />
      <Antenna animated={true} />
      <Torso />
      <ellipse cx="40" cy="93" rx="7" ry="4" fill={BLUSH} opacity="0.65" />
      <ellipse cx="120" cy="93" rx="7" ry="4" fill={BLUSH} opacity="0.65" />
      <path d="M38 58 Q46 51 54 57" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M106 57 Q114 51 122 58" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="47" cy="76" rx="12" ry="16" fill={CREAM} />
      <ellipse cx="113" cy="76" rx="12" ry="16" fill={CREAM} />
      <circle cx="50" cy="79" r="5.5" fill={DARK} />
      <circle cx="116" cy="79" r="5.5" fill={DARK} />
      <circle cx="47.5" cy="75" r="2" fill="#ffffff" />
      <circle cx="113.5" cy="75" r="2" fill="#ffffff" />
      <path d="M60 101 Q80 119 100 101" stroke={DARK} strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="25" cy="107" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(-14 25 107)" />
      <motion.g
        style={{ transformOrigin: '133px 45px' }}
        animate={{ rotate: [0, 18, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: BOUNCE_EASE }}
      >
        <ellipse cx="133" cy="45" rx="10" ry="16" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(150 133 45)" />
      </motion.g>
    </svg>
  );
}

function Wink() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 195">
      <ellipse cx="80" cy="180" rx="44" ry="9" fill="#000000" opacity="0.35" />
      <Antenna animated={false} />
      <Torso />
      <ellipse cx="40" cy="93" rx="8" ry="4.5" fill={BLUSH} opacity="0.7" />
      <ellipse cx="120" cy="93" rx="7" ry="4" fill={BLUSH} opacity="0.6" />
      <path d="M40 75 Q47 82 54 75" stroke={DARK} strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="113" cy="75" rx="12" ry="15" fill={CREAM} />
      <circle cx="116" cy="79" r="5" fill={DARK} />
      <circle cx="113.5" cy="75.5" r="1.8" fill="#ffffff" />
      <path d="M60 103 Q80 115 100 99" stroke={DARK} strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="25" cy="105" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(-14 25 105)" />
      <ellipse cx="135" cy="65" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(-70 135 65)" />
    </svg>
  );
}

function Jump() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 195">
      <motion.ellipse
        cx="80" cy="180" rx="44" ry="9" fill="#000000" opacity="0.4"
        style={{ transformOrigin: '80px 180px' }}
        animate={{ scaleX: [1, 0.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: BOUNCE_EASE }}
      />
      <motion.path
        d="M20 45 L23 39 L26 45 L23 51 Z" fill={SKY}
        animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.1, 0.7], rotate: [0, 20, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: BOUNCE_EASE }}
      />
      <motion.path
        d="M144 30 L147 24 L150 30 L147 36 Z" fill={MUSTARD}
        animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.1, 0.7], rotate: [0, 20, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: BOUNCE_EASE, delay: 0.4 }}
      />
      <motion.path
        d="M85 -10 L88 -16 L91 -10 L88 -4 Z" fill={SKY}
        animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.1, 0.7], rotate: [0, 20, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: BOUNCE_EASE, delay: 0.8 }}
      />
      <motion.g
        animate={{ y: [0, -22, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: BOUNCE_EASE }}
      >
        <Antenna animated={true} />
        <Torso />
        <ellipse cx="40" cy="91" rx="7.5" ry="4.5" fill={BLUSH} opacity="0.7" />
        <ellipse cx="120" cy="91" rx="7.5" ry="4.5" fill={BLUSH} opacity="0.7" />
        <path d="M37 56 Q46 47 55 55" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M105 55 Q114 47 123 56" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <ellipse cx="47" cy="73" rx="12" ry="17" fill={CREAM} />
        <ellipse cx="113" cy="73" rx="12" ry="17" fill={CREAM} />
        <circle cx="50" cy="75" r="6" fill={DARK} />
        <circle cx="116" cy="75" r="6" fill={DARK} />
        <circle cx="47.5" cy="70.5" r="2.2" fill="#ffffff" />
        <circle cx="113.5" cy="70.5" r="2.2" fill="#ffffff" />
        <path d="M57 101 Q80 121 103 101" stroke={DARK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <ellipse cx="21" cy="87" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(-40 21 87)" />
        <ellipse cx="139" cy="87" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(40 139 87)" />
      </motion.g>
    </svg>
  );
}

export default function Kodi({ pose, size = 160 }: KodiProps) {
  const content =
    pose === 'jump' ? <Jump /> : pose === 'wave' ? <Wave /> : pose === 'wink' ? <Wink /> : <Idle />;

  return (
    <div
      style={{ width: size, height: size * 1.22, filter: 'drop-shadow(3px 4px 0 #14110f)' }}
      aria-hidden="true"
    >
      {content}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/mascot/Kodi.tsx
git commit -m "feat: add Kodi mascot component (idle/wave/jump/wink)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

(Kodi is wired into a real page in Task 4 — verify visually there.)

---

## Task 3: Navbar — dual-context branch

**Files:**
- Modify: `src/components/navbar/Navbar.tsx`

**Interfaces:**
- Consumes: `Kodi` from Task 2 (`pose="idle"`, small size, in the app-shell logo).
- Produces: no signature change — `Navbar`'s props (`headerStyle`, `themeType`, `currentUsername`) are unchanged, so no call site elsewhere needs editing.

- [ ] **Step 1: Add the app-shell branch**

In `src/components/navbar/Navbar.tsx`, add the import and the branch flag right after the existing `getTheme` import line (`import { getTheme } from '@/lib/theme';`):

```tsx
import Kodi from '@/components/mascot/Kodi';
```

Then, immediately after `const theme = getTheme(themeType);` (inside the component body), add:

```tsx
  const isAppShell = themeType === undefined;
```

- [ ] **Step 2: Replace the `<header>` JSX**

Replace the entire `return (...)` block's `<header>` element opening tag and the logo block with app-shell-aware versions. Find:

```tsx
    <header
      className={`sticky top-0 z-50 w-full border-b ${theme.navBorder} transition-all duration-300`}
      style={headerStyle || { backgroundColor: 'rgba(12, 13, 14, 0.9)', backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight transition hover:opacity-80">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${theme.isLight ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'} font-black shadow-sm`}>
            <Code2 className="h-4 w-4" />
          </div>
          <span className={theme.navText}>Kodfolyo<span className={theme.isLight ? 'text-slate-500' : 'text-slate-400'}>.dev</span></span>
        </Link>
```

Replace with:

```tsx
    <header
      className={`sticky top-0 z-50 w-full border-b ${isAppShell ? 'border-[#3a2c22]' : theme.navBorder} transition-all duration-300`}
      style={headerStyle || (isAppShell
        ? { backgroundColor: 'rgba(20, 17, 15, 0.9)', backdropFilter: 'blur(12px)' }
        : { backgroundColor: 'rgba(12, 13, 14, 0.9)', backdropFilter: 'blur(12px)' })}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight transition hover:opacity-80">
          {isAppShell ? (
            <div className="h-8 w-8 shrink-0">
              <Kodi pose="idle" size={32} />
            </div>
          ) : (
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${theme.isLight ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'} font-black shadow-sm`}>
              <Code2 className="h-4 w-4" />
            </div>
          )}
          <span className={isAppShell ? 'text-[#fdf6ec] font-bold' : theme.navText}>
            Kodfolyo<span className={isAppShell ? 'text-[#8a7864]' : (theme.isLight ? 'text-slate-500' : 'text-slate-400')}>.dev</span>
          </span>
        </Link>
```

- [ ] **Step 3: Reskin the app-shell action buttons**

Every button/link in the "Navigation & Actions" block uses `theme.navBorder`, `theme.badge`, `theme.badgeStyle`, `theme.navMuted`, `theme.buttonPrimary`, `theme.buttonPrimaryStyle`, `theme.textMuted`. Wrap each `className`/`style` pair with the `isAppShell` ternary, coral-primary for app shell. Find:

```tsx
              <Link
                href={`/${username}`}
                className={`hidden sm:flex items-center gap-1.5 rounded-lg border ${theme.navBorder} ${theme.badge} px-3 py-1.5 text-xs font-medium ${theme.navMuted} transition`}
                style={theme.badgeStyle}
              >
```

Replace with:

```tsx
              <Link
                href={`/${username}`}
                className={isAppShell
                  ? 'hidden sm:flex items-center gap-1.5 rounded-full border border-[#3a2c22] bg-[#1f1a16] px-3 py-1.5 text-xs font-medium text-[#cbb9a0] hover:text-[#fdf6ec] transition'
                  : `hidden sm:flex items-center gap-1.5 rounded-lg border ${theme.navBorder} ${theme.badge} px-3 py-1.5 text-xs font-medium ${theme.navMuted} transition`}
                style={isAppShell ? undefined : theme.badgeStyle}
              >
```

Find the "Düzenle" primary link:

```tsx
              <Link
                href={editDashboardUrl}
                className={`flex items-center gap-1.5 rounded-lg ${theme.buttonPrimary} px-3.5 py-1.5 text-xs font-bold shadow-sm transition`}
                style={theme.buttonPrimaryStyle}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Düzenle</span>
              </Link>
```

Replace with:

```tsx
              <Link
                href={editDashboardUrl}
                className={isAppShell
                  ? 'flex items-center gap-1.5 rounded-full bg-[#ff5a3c] px-3.5 py-1.5 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition'
                  : `flex items-center gap-1.5 rounded-lg ${theme.buttonPrimary} px-3.5 py-1.5 text-xs font-bold shadow-sm transition`}
                style={isAppShell ? undefined : theme.buttonPrimaryStyle}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Düzenle</span>
              </Link>
```

Find the sign-out button:

```tsx
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={`flex items-center gap-1.5 rounded-lg border ${theme.navBorder} ${theme.badge} px-2.5 py-1.5 text-xs ${theme.textMuted} hover:text-red-500 transition`}
                style={theme.badgeStyle}
                title="Çıkış Yap"
              >
```

Replace with:

```tsx
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={isAppShell
                  ? 'flex items-center gap-1.5 rounded-full border border-[#3a2c22] bg-[#1f1a16] px-2.5 py-1.5 text-xs text-[#8a7864] hover:text-red-400 transition'
                  : `flex items-center gap-1.5 rounded-lg border ${theme.navBorder} ${theme.badge} px-2.5 py-1.5 text-xs ${theme.textMuted} hover:text-red-500 transition`}
                style={isAppShell ? undefined : theme.badgeStyle}
                title="Çıkış Yap"
              >
```

Find the unauthenticated block's two links/button (`Örnek Portfolyo`, the conditional "Düzenle (@user)" link, and the "Portfolyomu Çek" button) and their `theme.navMuted` / `theme.buttonPrimary` usages — apply the same `isAppShell` ternary pattern:

```tsx
              <Link
                href="/ornek-ogrenci"
                className={`text-xs font-semibold ${theme.navMuted} px-2 py-1 transition`}
                title="Canlı Örnek Portfolyoyu İncele"
              >
```

Replace with:

```tsx
              <Link
                href="/ornek-ogrenci"
                className={isAppShell ? 'text-xs font-semibold text-[#cbb9a0] hover:text-[#fdf6ec] px-2 py-1 transition' : `text-xs font-semibold ${theme.navMuted} px-2 py-1 transition`}
                title="Canlı Örnek Portfolyoyu İncele"
              >
```

```tsx
                <Link
                  href={editDashboardUrl}
                  className={`flex items-center gap-1.5 rounded-lg ${theme.buttonPrimary} px-3 sm:px-4 py-2 text-xs font-bold shadow-sm transition active:scale-95`}
                  style={theme.buttonPrimaryStyle}
                >
```

Replace with:

```tsx
                <Link
                  href={editDashboardUrl}
                  className={isAppShell
                    ? 'flex items-center gap-1.5 rounded-full bg-[#ff5a3c] px-3 sm:px-4 py-2 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition active:scale-95'
                    : `flex items-center gap-1.5 rounded-lg ${theme.buttonPrimary} px-3 sm:px-4 py-2 text-xs font-bold shadow-sm transition active:scale-95`}
                  style={isAppShell ? undefined : theme.buttonPrimaryStyle}
                >
```

```tsx
                <button
                  onClick={() => setShowPrompt(true)}
                  className={`flex items-center gap-1.5 sm:gap-2 rounded-lg ${theme.buttonPrimary} px-3 sm:px-4 py-2 text-xs font-bold shadow-sm transition active:scale-95`}
                  style={theme.buttonPrimaryStyle}
                >
```

Replace with:

```tsx
                <button
                  onClick={() => setShowPrompt(true)}
                  className={isAppShell
                    ? 'flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#ff5a3c] px-3 sm:px-4 py-2 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition active:scale-95'
                    : `flex items-center gap-1.5 sm:gap-2 rounded-lg ${theme.buttonPrimary} px-3 sm:px-4 py-2 text-xs font-bold shadow-sm transition active:scale-95`}
                  style={isAppShell ? undefined : theme.buttonPrimaryStyle}
                >
```

- [ ] **Step 4: Reskin the quick-login prompt modal (always app-shell, since it's only ever triggered from an app-shell-context render)**

Find the modal `<div className="w-full max-w-md rounded-2xl border border-[#23272e] bg-[#141619] p-6 shadow-2xl space-y-4">` block and every hardcoded `#23272e`/`#141619`/`#0c0d0e`/`#64748b`/`#94a3b8` inside it (the heading row, close button, description, input row, submit button). Replace each hex with its new-token equivalent:
- `#23272e` → `#3a2c22`
- `#141619` → `#1f1a16`
- `#0c0d0e` → `#14110f`
- `#64748b` → `#8a7864`
- `#94a3b8` → `#cbb9a0`
- the submit button's `bg-white hover:bg-slate-200 ... text-slate-950 shadow` → `bg-[#ff5a3c] hover:bg-[#ff7159] ... text-[#14110f] shadow-[3px_3px_0_0_#14110f]`, and its wrapping `rounded-xl` → `rounded-full`.
- the modal's own `rounded-2xl` → `rounded-3xl`.

This modal is unconditional (not wrapped in `isAppShell`) because it only ever appears when triggered from the unauthenticated app-shell button above, never on a portfolio page.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual check**

`npm run dev`. Open `/` (app shell): confirm the navbar shows warm ink/coral, Kodi's idle pose as the logo mark. Open `/ornek-ogrenci` (portfolio context, `themeType` passed): confirm the navbar looks exactly as it did before this task (old palette, `Code2` icon square) — no bleed.

- [ ] **Step 7: Commit**

```bash
git add src/components/navbar/Navbar.tsx
git commit -m "feat: branch Navbar on themeType for app-shell vs portfolio skin

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 4: LandingHero reskin + Kodi jump

**Files:**
- Modify: `src/components/landing/LandingHero.tsx`

**Interfaces:**
- Consumes: `Kodi` from Task 2 (`pose="jump"`).

- [ ] **Step 1: Replace the returned JSX**

Replace the `return (...)` block of `LandingHero` (everything from `return (` to the matching closing `);` — the component's logic above it, `handleGeneratePortfolio` etc., is unchanged) with:

```tsx
  return (
    <section className="relative overflow-hidden pt-14 pb-14 sm:pt-20 sm:pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Kurumsal Rozet */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3a2c22] bg-[#1f1a16] px-4 py-1.5 text-xs font-semibold text-[#cbb9a0] shadow-[3px_3px_0_0_#14110f]">
              <Code2 className="h-3.5 w-3.5 text-[#ff5a3c]" />
              <span>Geliştiriciler İçin Kurumsal & Sade Portfolyo Üreteci</span>
            </div>

            {/* Ana Başlık */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#fdf6ec] leading-tight">
              GitHub Kullanıcı Adını Gir, <br className="hidden sm:inline" />
              <span className="text-[#f5b83d]">Profesyonel Portfolyonu</span> Anında Çek
            </h1>

            {/* Gövde Metni */}
            <p className="mx-auto lg:mx-0 max-w-2xl text-sm sm:text-base text-[#cbb9a0] leading-relaxed">
              Karmaşık şablonları unut. GitHub kullanıcı adını veya profil URL adresini gir; profilin, projelerin ve dillerin <code className="text-[#fdf6ec] bg-[#1f1a16] px-2 py-0.5 rounded border border-[#3a2c22]">/kullaniciadi</code> adresinde kurumsal bir sade kimlikle yayınlansın.
            </p>

            {/* Hızlı Kullanıcı Adı Girme Formu */}
            <form onSubmit={handleGeneratePortfolio} className="mx-auto lg:mx-0 max-w-lg pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-full border border-[#3a2c22] bg-[#1f1a16] shadow-[4px_4px_0_0_#14110f]">
                <div className="flex items-center gap-2 pl-4 pr-3 flex-1 text-sm text-[#fdf6ec]">
                  <span className="text-[#8a7864] font-bold">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="github_kullanici_adi veya URL"
                    className="w-full bg-transparent border-none outline-none placeholder-[#8a7864] text-xs sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !usernameInput.trim()}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] px-6 py-3 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#f5b83d] transition active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Çekiliyor...</span>
                    </>
                  ) : (
                    <>
                      <GithubIcon className="w-4 h-4" />
                      <span>Portfolyomu Çek</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Doğrulama Hata Mesajı */}
              {errorMsg && (
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-red-400 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>

            {/* Örnek Hızlı Seçenekler */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-[#cbb9a0] pt-1">
              <span>Örnek canlı profiller:</span>
              {['mvanhorn', 'torvalds', 'gaearon', 'sindresorhus'].map((demoUser) => (
                <button
                  key={demoUser}
                  onClick={() => {
                    setUsernameInput(demoUser);
                    router.push(`/${demoUser}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#1f1a16] border border-[#3a2c22] hover:border-[#ff5a3c] hover:text-[#fdf6ec] transition"
                >
                  @{demoUser}
                </button>
              ))}
            </div>

            {/* Güvence Etiketleri */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-[#8a7864]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#ff5a3c]" />
                Otomatik Profil & URL Ayıklama
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#8a7864]" />
                GitHub Public REST API Senkronizasyonu
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Kodi pose="jump" size={170} />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add the `Kodi` import**

At the top of the file, alongside the existing imports, add:

```tsx
import Kodi from '@/components/mascot/Kodi';
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual check**

`npm run dev`, open `/`. Confirm: headline uses the new mustard highlight color, Kodi renders beside the headline (stacked above it on narrow widths) and is continuously bouncing with sparkles.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/LandingHero.tsx
git commit -m "feat: reskin LandingHero and add bouncing Kodi mascot

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 5: LandingFeatures — bento grid + copy fix

**Files:**
- Modify: `src/components/landing/LandingFeatures.tsx`

**Interfaces:**
- Consumes: `Kodi` from Task 2 (`pose="idle"`, small, decorative, next to the section heading).

- [ ] **Step 1: Replace the full file**

```tsx
'use client';

import { ShieldCheck, RefreshCw, FolderGit2, Layers, Link2, Sparkles } from 'lucide-react';
import Kodi from '@/components/mascot/Kodi';

const FEATURES = [
  {
    icon: RefreshCw,
    title: 'Otomatik GitHub API Senkronizasyonu',
    desc: 'GitHub kullanıcı adını gir. Biyografin, en çok yıldız alan projelerin ve dil yetkinliklerin canlı çekilsin.',
    wide: true,
  },
  {
    icon: Sparkles,
    title: 'Canlı & Karakterli Tasarım',
    desc: 'Şablon gibi durmayan, enerjik bir kimlikle öne çık — sosyal medyada paylaşılınca fark yaratır.',
    wide: false,
  },
  {
    icon: FolderGit2,
    title: 'Prestijli Proje Kartları',
    desc: 'Repoların yıldız sayıları, dil etiketleri ve doğrudan GitHub linkleri ile yüksek okunabilirlikte listelenir.',
    wide: false,
  },
  {
    icon: ShieldCheck,
    title: 'Supabase Akıllı Önbellek',
    desc: 'GitHub API rate limitlerine takılmadan yüksek performanslı ve kesintisiz yükleme garantisi.',
    wide: false,
  },
  {
    icon: Layers,
    title: 'Kurumsal Tema Seçenekleri',
    desc: 'Executive Dark, Executive Light, Terminal Amber ve Dracula Slate temalarından tarzına uyanı seç.',
    wide: false,
  },
  {
    icon: Link2,
    title: 'Özel CV & LinkedIn Bağlantıları',
    desc: 'Özgeçmiş PDF dosyanı ve LinkedIn profilini portfolyona dahil et (İstediğin zaman ekleyebilir veya silebilirsin).',
    wide: true,
  },
];

const CHIP_COLORS = ['#ff5a3c', '#f5b83d'];

export default function LandingFeatures() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div className="text-center space-y-2 mb-10 relative">
        <div className="hidden sm:block absolute -top-4 right-4">
          <Kodi pose="idle" size={56} />
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-[#fdf6ec]">
          Neden <span className="text-[#f5b83d]">Kodfolyo</span>?
        </h2>
        <p className="text-xs sm:text-sm text-[#cbb9a0]">
          Geliştiriciler ve mühendisler için iş hayatında prestij sağlayan sade altyapı
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          const chipColor = CHIP_COLORS[idx % CHIP_COLORS.length];
          return (
            <div
              key={feat.title}
              className={`p-5 rounded-3xl border border-[#3a2c22] bg-[#1f1a16] space-y-3 shadow-[4px_4px_0_0_#14110f] hover:-translate-y-0.5 transition-transform ${feat.wide ? 'md:col-span-2' : ''}`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: chipColor }}
              >
                <Icon className="w-4 h-4 text-[#14110f]" />
              </div>
              <div className="text-xs font-bold text-[#fdf6ec]">{feat.title}</div>
              <p className="text-xs text-[#cbb9a0] leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

`npm run dev`, open `/`, scroll to "Neden Kodfolyo?". Confirm: first and last cards span two columns, icon badges alternate coral/mustard, the previously-contradictory second card now reads "Canlı & Karakterli Tasarım" with energetic copy, small idle Kodi peeks near the heading.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/LandingFeatures.tsx
git commit -m "feat: bento-grid LandingFeatures, fix contradicting copy

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 6: LandingPreview — outer wrapper only

**Files:**
- Modify: `src/components/landing/LandingPreview.tsx`

**Interfaces:**
- The embedded `PortfolioHero`/`TechStack`/`ProjectGrid` calls and `demoProfile` object are unchanged — only the surrounding section/badge/mock-browser-bar markup changes.

- [ ] **Step 1: Replace the returned JSX**

Replace everything from `return (` to the closing `);` with:

```tsx
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f1a16] border border-[#3a2c22] text-xs font-semibold text-[#fdf6ec] shadow-[3px_3px_0_0_#14110f]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ff5a3c]" /> Canlı Executive Portfolyo Simülasyonu
        </div>
      </div>

      <div className="rounded-3xl border border-[#3a2c22] bg-[#14110f] p-2 sm:p-4 shadow-[6px_6px_0_0_#1f1a16] overflow-hidden">
        {/* Mock Browser Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1f1a16] rounded-2xl border border-[#3a2c22] mb-4 text-xs text-[#cbb9a0]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a3c]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f5b83d]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#4fd8ff]" />
          </div>
          <div className="px-3 py-0.5 rounded-full bg-[#14110f] text-[11px] text-[#fdf6ec]">
            https://kodfolyo.dev/ornek-ogrenci
          </div>
          <div className="w-10" />
        </div>

        {/* Canlı Bileşen Önizleme */}
        <div className="rounded-2xl bg-[#0c0d0e]">
          <PortfolioHero profile={demoProfile} isDemo={true} />
          <TechStack repos={mockRepos} themeType="corporate-dark" />
          <ProjectGrid repos={mockRepos.slice(0, 4)} themeType="corporate-dark" />
        </div>
      </div>
    </section>
  );
}
```

(The inner `rounded-2xl bg-[#0c0d0e]` wrapper keeps the portfolio-output system's own `corporate-dark` background — untouched, per the spec's theme-system boundary.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

`npm run dev`, open `/`, scroll to the live-preview section. Confirm the outer frame and traffic-light dots use the new flat palette while the embedded demo portfolio inside still looks like the old `corporate-dark` theme.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/LandingPreview.tsx
git commit -m "feat: reskin LandingPreview outer frame only

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 7: Landing shell (`page.tsx`) — CTA and footer

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the full file**

```tsx
import Navbar from '@/components/navbar/Navbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPreview from '@/components/landing/LandingPreview';
import Link from 'next/link';
import { Code2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#14110f] text-[#fdf6ec] flex flex-col selection:bg-[#ff5a3c] selection:text-[#14110f]">
      <Navbar />

      <main className="flex-1 space-y-6">
        <LandingHero />
        <LandingPreview />
        <LandingFeatures />

        {/* CTA Bitiş Kutusu */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 my-16">
          <div className="p-8 sm:p-10 rounded-3xl border border-[#3a2c22] bg-[#1f1a16] text-center space-y-4 shadow-[6px_6px_0_0_#14110f]">
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#fdf6ec]">
              Portfolyonu Bugün Yayınla
            </h2>
            <p className="text-xs sm:text-sm text-[#cbb9a0] max-w-lg mx-auto">
              Sıfır kurulum yükü. GitHub kullanıcı adını gir, sade ve kurumsal portfolyon anında oluşturulsun.
            </p>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] px-6 py-3 text-xs font-bold text-[#14110f] shadow-[4px_4px_0_0_#f5b83d] transition active:scale-95"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Hemen Başla (Ücretsiz)</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3a2c22] bg-[#14110f] py-8 px-4 text-center text-xs text-[#8a7864]">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5a3c] text-[#14110f] font-bold">
              <Code2 className="h-3 w-3" />
            </div>
            <span className="font-bold text-[#fdf6ec]">Kodfolyo.dev</span>
          </div>

          <p>© {new Date().getFullYear()} Kodfolyo. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

`npm run dev`, open `/`, scroll to the bottom. Confirm the CTA box and footer use the new palette.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: reskin landing shell CTA and footer

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 8: Dashboard shell reskin

**Files:**
- Modify: `src/app/dashboard/page.tsx`

**Interfaces:**
- No prop/state signature changes in this task (the `custom_accent` wiring for `ThemeSelector` is added later, in Task 12) — this task is visual-only.

- [ ] **Step 1: Loading-state screen**

Find:

```tsx
  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-[#0c0d0e] text-[#f8fafc] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#94a3b8]">@{activeUsername || 'erdemsnsy'} profil verileri yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }
```

Replace with:

```tsx
  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-[#14110f] text-[#fdf6ec] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#ff5a3c] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#cbb9a0]">@{activeUsername || 'erdemsnsy'} profil verileri yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }
```

- [ ] **Step 2: Page shell + header card**

Find:

```tsx
  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#f8fafc]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
        {/* Üst Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-[#23272e] bg-[#141619] shadow-xl">
          <div className="space-y-1 min-w-0 max-w-full">
            <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Kontrol Paneli</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white truncate">
              Düzenlenen Profil: <span className="text-slate-300">@{displayProfile.username}</span>
            </h1>
            <p className="text-xs text-[#94a3b8]">
              `/{displayProfile.username}` adresindeki portfolyonu buradan kişiselleştirebilirsin.
            </p>
          </div>

          <div className="shrink-0 pt-2 sm:pt-0">
            <Link
              href={`/${displayProfile.username}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-200 px-4 py-2.5 text-xs font-bold text-slate-950 shadow transition active:scale-95 whitespace-nowrap"
            >
              <span>Canlı Portfolyo</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
```

Replace with:

```tsx
  return (
    <div className="min-h-screen bg-[#14110f] text-[#fdf6ec]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
        {/* Üst Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl border border-[#3a2c22] bg-[#1f1a16] shadow-[5px_5px_0_0_#14110f]">
          <div className="space-y-1 min-w-0 max-w-full">
            <div className="text-xs text-[#cbb9a0] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#ff5a3c]" />
              <span>Kontrol Paneli</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#fdf6ec] truncate">
              Düzenlenen Profil: <span className="text-[#f5b83d]">@{displayProfile.username}</span>
            </h1>
            <p className="text-xs text-[#cbb9a0]">
              `/{displayProfile.username}` adresindeki portfolyonu buradan kişiselleştirebilirsin.
            </p>
          </div>

          <div className="shrink-0 pt-2 sm:pt-0">
            <Link
              href={`/${displayProfile.username}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] px-4 py-2.5 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition active:scale-95 whitespace-nowrap"
            >
              <span>Canlı Portfolyo</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
```

- [ ] **Step 3: Unsaved-changes banner + both save buttons**

Find the banner block (`{(hasPendingChanges || saveAllSuccess) && ( ... )}`) and replace its inner card `className` string:

```tsx
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border shadow-2xl transition-all duration-300 ${
              saveAllSuccess
                ? 'border-emerald-500/50 bg-emerald-950/80 backdrop-blur-md'
                : 'border-amber-500/50 bg-[#1a1600]/90 backdrop-blur-md'
            }`}>
```

Replace with:

```tsx
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl border shadow-[5px_5px_0_0_#14110f] transition-all duration-300 ${
              saveAllSuccess
                ? 'border-emerald-500/50 bg-emerald-950/80 backdrop-blur-md'
                : 'border-[#f5b83d]/50 bg-[#1f1a16]/90 backdrop-blur-md'
            }`}>
```

Then replace both occurrences (the banner's inline save button, and the bottom-of-page save button) of:

```tsx
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-sm font-extrabold shadow-lg transition active:scale-95 disabled:opacity-60"
```

with:

```tsx
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] text-[#14110f] text-sm font-extrabold shadow-[3px_3px_0_0_#14110f] transition active:scale-95 disabled:opacity-60"
```

and:

```tsx
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-white hover:bg-slate-200 text-slate-950 text-sm font-extrabold shadow-lg transition active:scale-95 disabled:opacity-60"
```

with:

```tsx
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] text-[#14110f] text-sm font-extrabold shadow-[4px_4px_0_0_#14110f] transition active:scale-95 disabled:opacity-60"
```

- [ ] **Step 4: Suspense fallback**

Find:

```tsx
    <Suspense fallback={<div className="min-h-screen bg-[#0c0d0e] text-white p-8">Yükleniyor...</div>}>
```

Replace with:

```tsx
    <Suspense fallback={<div className="min-h-screen bg-[#14110f] text-[#fdf6ec] p-8">Yükleniyor...</div>}>
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual check**

`npm run dev`, log in / open `/dashboard`. Confirm the shell (header card, save banner, both save buttons) uses the new palette. Trigger a pending change (edit a field) to see the amber-→-mustard banner.

- [ ] **Step 7: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: reskin dashboard shell (header, save banner, buttons)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 9: Dashboard subcomponents — mechanical token substitution

**Files:**
- Modify: `src/components/dashboard/ProfileEditor.tsx`
- Modify: `src/components/dashboard/RepoSelector.tsx`
- Modify: `src/components/dashboard/CustomLinksManager.tsx`
- Modify: `src/components/dashboard/SyncButton.tsx`

**Interfaces:** No prop/behavior changes in any of the four — visual tokens only. All four share this exact substitution table; apply it to every matching string, `replace_all` style, in each file:

| Find | Replace |
|---|---|
| `border-[#23272e]` | `border-[#3a2c22]` |
| `bg-[#141619]` | `bg-[#1f1a16]` |
| `bg-[#0c0d0e]` | `bg-[#14110f]` |
| `text-white` (as a standalone text-color utility, not inside `bg-white`) | `text-[#fdf6ec]` |
| `text-[#94a3b8]` | `text-[#cbb9a0]` |
| `text-[#64748b]` | `text-[#8a7864]` |
| `bg-white/5` (icon chip bg) | `bg-[#ff5a3c]/10` |
| `border-white/10` (icon chip border) | `border-[#ff5a3c]/25` |
| outer card `rounded-2xl` | `rounded-3xl` |
| `shadow-xl` (outer card) | `shadow-[5px_5px_0_0_#14110f]` |
| `bg-white hover:bg-slate-200 ... text-slate-950 shadow` (primary buttons) | `bg-[#ff5a3c] hover:bg-[#ff7159] ... text-[#14110f] shadow-[3px_3px_0_0_#14110f]`, and that button's `rounded-xl`/`rounded-lg` → `rounded-full` |
| `focus:border-white` (inputs) | `focus:border-[#ff5a3c]` |
| `placeholder-[#64748b]` | `placeholder-[#8a7864]` |

Icon color inside the chip (`text-white` on the `<User>`/`<FolderGit2>`/`<Link2>`/`<RefreshCw>` icon) becomes `text-[#ff5a3c]` to read against the new tinted chip background.

- [ ] **Step 1: `ProfileEditor.tsx`**

Apply the table above. Concretely, replace:

```tsx
    <div className="rounded-2xl border border-[#23272e] bg-[#141619] p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 text-white border border-white/10">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Profil & Biyografi Düzenleme</h2>
            <p className="text-xs text-[#94a3b8]">
```

with:

```tsx
    <div className="rounded-3xl border border-[#3a2c22] bg-[#1f1a16] p-6 sm:p-8 shadow-[5px_5px_0_0_#14110f]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/25">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#fdf6ec]">Profil & Biyografi Düzenleme</h2>
            <p className="text-xs text-[#cbb9a0]">
```

Every remaining `border-[#23272e]`, `bg-[#0c0d0e]`, `text-white`, `text-[#94a3b8]`, `text-slate-300`, `focus:border-white`, `placeholder-[#64748b]` in the rest of the file (the textarea, both `grid grid-cols-1 sm:grid-cols-2` input blocks, the AI-suggestion buttons) gets the same table substitutions — `text-slate-300` (used on the `<label>`s) becomes `text-[#cbb9a0]`. The "AI Biyografi Üret" button's indigo styling (`bg-indigo-600/20 ... text-indigo-300 border-indigo-500/30`) and the AI suggestion buttons' `hover:border-indigo-500/50 hover:bg-indigo-500/10` are left as-is — indigo is an unrelated existing accent for the AI feature, not part of this reskin's token table, and the spec does not mention it.

- [ ] **Step 2: `RepoSelector.tsx`**

Apply the same table. The icon chip (`bg-white/5 text-white border-white/10` around `<FolderGit2>`), the outer card (`rounded-2xl border-[#23272e] bg-[#141619] shadow-xl`), heading/description text colors, and the per-repo card borders/backgrounds (`border-[#23272e] bg-[#0c0d0e]` visible / `border-[#1e212b] bg-[#0c0d0e]/40` hidden) all get the table's hex swaps (the hidden-repo `#1e212b` becomes `#291f19`, matching "Surface 2" from the palette). The visibility toggle button's `bg-white/10 text-white border-white/20` (visible state) becomes `bg-[#ff5a3c]/15 text-[#ff5a3c] border-[#ff5a3c]/30`; its hidden state (`bg-[#1e2229] text-[#64748b] border-[#2d323c]`) becomes `bg-[#291f19] text-[#8a7864] border-[#3a2c22]`.

- [ ] **Step 3: `CustomLinksManager.tsx`**

Apply the same table, including the primary "Kaydet" button and the "Ekle" button (`bg-white/10 text-white border-white/20` → `bg-[#ff5a3c]/15 text-[#ff5a3c] border-[#ff5a3c]/30`). The `<select>` and both `<input>`s in the add-link row get the border/bg/placeholder swaps. The link-list rows' `border-[#23272e] bg-[#0c0d0e]` and the label chip's `bg-[#1e2229] border-[#2d323c]` follow the same table (`#1e2229`→`#291f19`, `#2d323c`→`#3a2c22`).

- [ ] **Step 4: `SyncButton.tsx`**

Apply the same table to the outer card and the primary "Yenile" button. Leave the success/error message colors (`text-emerald-400`, `text-red-400`) untouched — they're semantic status colors, not part of the brand palette.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual check**

`npm run dev`, open `/dashboard`, scroll through all four sections. Confirm consistent warm-ink/coral styling, no leftover `#23272e`/`#141619`/`#0c0d0e` visible.

- [ ] **Step 7: Commit**

```bash
git add src/components/dashboard/ProfileEditor.tsx src/components/dashboard/RepoSelector.tsx src/components/dashboard/CustomLinksManager.tsx src/components/dashboard/SyncButton.tsx
git commit -m "feat: reskin dashboard subcomponents to new token set

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 10: `theme.ts` — accent override support

**Files:**
- Modify: `src/lib/theme.ts`

**Interfaces:**
- Produces: `getTheme(themeName?: ThemeType, accentOverride?: string | null): ThemeConfig` (new optional second parameter, backward compatible — every existing single-argument call site keeps working unchanged). Later tasks pass a `custom_accent` value as the second argument.

- [ ] **Step 1: Add a contrast helper and extend `getTheme`**

In `src/lib/theme.ts`, right before `export function getTheme(...)`, add:

```ts
function isValidHex(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

function getContrastTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#020617' : '#f8fafc';
}
```

Then replace:

```ts
export function getTheme(themeName?: ThemeType): ThemeConfig {
  const baseTheme = (themeName && themes[themeName]) ? themes[themeName] : themes['corporate-dark'];
  const isLight = baseTheme.isLight;

  return {
    ...baseTheme,
    iconBg: isLight ? 'bg-slate-900/5' : 'bg-white/5',
    iconBorder: isLight ? 'border-slate-900/10' : 'border-white/10',
    progressBarBg: isLight ? 'bg-slate-200' : 'bg-[#0c0d0e]',
    subtextColor: isLight ? 'text-slate-700 font-semibold' : 'text-slate-300 font-semibold',
    dividerBorder: isLight ? 'border-slate-300/80' : 'border-white/10',
    starColor: isLight ? 'text-amber-600 fill-amber-500/20' : 'text-slate-300 fill-slate-300/20',
    navText: isLight ? 'text-slate-900 font-bold' : 'text-white font-bold',
    navMuted: isLight ? 'text-slate-600 hover:text-slate-950' : 'text-[#94a3b8] hover:text-white',
    navBorder: isLight ? 'border-slate-300/80' : 'border-[#23272e]',
  };
}
```

with:

```ts
export function getTheme(themeName?: ThemeType, accentOverride?: string | null): ThemeConfig {
  const baseTheme = (themeName && themes[themeName]) ? themes[themeName] : themes['corporate-dark'];
  const isLight = baseTheme.isLight;

  const result: ThemeConfig = {
    ...baseTheme,
    iconBg: isLight ? 'bg-slate-900/5' : 'bg-white/5',
    iconBorder: isLight ? 'border-slate-900/10' : 'border-white/10',
    progressBarBg: isLight ? 'bg-slate-200' : 'bg-[#0c0d0e]',
    subtextColor: isLight ? 'text-slate-700 font-semibold' : 'text-slate-300 font-semibold',
    dividerBorder: isLight ? 'border-slate-300/80' : 'border-white/10',
    starColor: isLight ? 'text-amber-600 fill-amber-500/20' : 'text-slate-300 fill-slate-300/20',
    navText: isLight ? 'text-slate-900 font-bold' : 'text-white font-bold',
    navMuted: isLight ? 'text-slate-600 hover:text-slate-950' : 'text-[#94a3b8] hover:text-white',
    navBorder: isLight ? 'border-slate-300/80' : 'border-[#23272e]',
  };

  if (isValidHex(accentOverride)) {
    const contrastText = getContrastTextColor(accentOverride);
    result.accentColor = accentOverride;
    result.buttonPrimaryStyle = {
      ...result.buttonPrimaryStyle,
      background: accentOverride,
      color: contrastText,
    };
    result.badgeAccentStyle = {
      ...result.badgeAccentStyle,
      background: accentOverride,
      color: contrastText,
      border: `1px solid ${accentOverride}`,
    };
  }

  return result;
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/theme.ts
git commit -m "feat: add optional accent-color override to getTheme

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

(No page yet passes a second argument — this is inert until Task 12/13 wire it up. Verified visually there.)

---

## Task 11: `custom_accent` persistence — types, schema, storage, API

**Files:**
- Modify: `src/types/index.ts`
- Modify: `supabase/schema.sql`
- Modify: `src/lib/supabase/server.ts`
- Modify: `src/app/api/profile/update/route.ts`

**Interfaces:**
- Produces: `UserProfile.custom_accent?: string | null` field, persisted end-to-end. Task 12 reads/writes it from the dashboard; Task 13 reads it on portfolio pages.

- [ ] **Step 1: Add the field to `UserProfile`**

In `src/types/index.ts`, find:

```ts
export interface UserProfile {
  id: string;
  github_id: string;
  username: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  custom_bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  theme: ThemeType;
  custom_links: CustomLink[];
  created_at?: string;
  updated_at?: string;
}
```

Replace with:

```ts
export interface UserProfile {
  id: string;
  github_id: string;
  username: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  custom_bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  theme: ThemeType;
  custom_accent: string | null;
  custom_links: CustomLink[];
  created_at?: string;
  updated_at?: string;
}
```

(Made required-but-nullable, not optional, so every construction site below is forced by TypeScript to set it explicitly — this surfaces every place that needs the change instead of silently compiling.)

- [ ] **Step 2: Add the database column**

In `supabase/schema.sql`, find:

```sql
    theme TEXT DEFAULT 'corporate-dark',
    custom_links JSONB DEFAULT '[]'::jsonb,
```

Replace with:

```sql
    theme TEXT DEFAULT 'corporate-dark',
    custom_accent TEXT,
    custom_links JSONB DEFAULT '[]'::jsonb,
```

Then, right after the `CREATE TABLE IF NOT EXISTS public.profiles (...)` statement's closing `);`, add a standalone idempotent migration line for databases that already have the table (fresh installs get the column from the `CREATE TABLE` above; this line is a no-op for them):

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_accent TEXT;
```

- [ ] **Step 3: Wire `custom_accent` through `src/lib/supabase/server.ts`**

Four spots need the field. First, in `getProfileByUsername`'s demo-account branch, find:

```ts
    const mockProfile: UserProfile = {
      id: crypto.randomUUID(),
      github_id: String(mockUser.id),
      username: normalizedUser,
      name: mockUser.name,
      avatar_url: mockUser.avatar_url,
      bio: mockUser.bio,
      custom_bio: null,
      company: mockUser.company,
      location: mockUser.location,
      email: mockUser.email,
      blog: mockUser.blog,
      theme: 'corporate-dark',
      custom_links: [],
    };
```

Replace with:

```ts
    const mockProfile: UserProfile = {
      id: crypto.randomUUID(),
      github_id: String(mockUser.id),
      username: normalizedUser,
      name: mockUser.name,
      avatar_url: mockUser.avatar_url,
      bio: mockUser.bio,
      custom_bio: null,
      company: mockUser.company,
      location: mockUser.location,
      email: mockUser.email,
      blog: mockUser.blog,
      theme: 'corporate-dark',
      custom_accent: null,
      custom_links: [],
    };
```

Second, in the real-GitHub-user branch of the same function, find:

```ts
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      github_id: String(realGithubUser.id),
      username: realGithubUser.login.toLowerCase(),
      name: realGithubUser.name || realGithubUser.login,
      avatar_url: realGithubUser.avatar_url,
      bio: realGithubUser.bio,
      custom_bio: null,
      company: realGithubUser.company,
      location: realGithubUser.location,
      email: realGithubUser.email,
      blog: realGithubUser.blog,
      theme: 'corporate-dark',
      custom_links: [],
    };
```

Replace with:

```ts
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      github_id: String(realGithubUser.id),
      username: realGithubUser.login.toLowerCase(),
      name: realGithubUser.name || realGithubUser.login,
      avatar_url: realGithubUser.avatar_url,
      bio: realGithubUser.bio,
      custom_bio: null,
      company: realGithubUser.company,
      location: realGithubUser.location,
      email: realGithubUser.email,
      blog: realGithubUser.blog,
      theme: 'corporate-dark',
      custom_accent: null,
      custom_links: [],
    };
```

Third, in `upsertProfile`'s Supabase upsert payload, find:

```ts
          {
            github_id: profile.github_id,
            username: normalizedUser,
            name: profile.name,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            custom_bio: profile.custom_bio,
            company: profile.company,
            location: profile.location,
            email: profile.email,
            blog: profile.blog,
            theme: profile.theme || 'corporate-dark',
            custom_links: profile.custom_links || [],
            updated_at: new Date().toISOString(),
          },
```

Replace with:

```ts
          {
            github_id: profile.github_id,
            username: normalizedUser,
            name: profile.name,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            custom_bio: profile.custom_bio,
            company: profile.company,
            location: profile.location,
            email: profile.email,
            blog: profile.blog,
            theme: profile.theme || 'corporate-dark',
            custom_accent: profile.custom_accent ?? null,
            custom_links: profile.custom_links || [],
            updated_at: new Date().toISOString(),
          },
```

Fourth, in `upsertProfile`'s in-memory fallback (used when Supabase isn't configured), find:

```ts
  const updatedProfile: UserProfile = {
    id: existing?.id || crypto.randomUUID(),
    github_id: profile.github_id,
    username: normalizedUser,
    name: profile.name ?? existing?.name ?? null,
    avatar_url: profile.avatar_url || existing?.avatar_url || '',
    bio: profile.bio ?? existing?.bio ?? null,
    custom_bio: profile.custom_bio ?? existing?.custom_bio ?? null,
    company: profile.company ?? existing?.company ?? null,
    location: profile.location ?? existing?.location ?? null,
    email: profile.email ?? existing?.email ?? null,
    blog: profile.blog ?? existing?.blog ?? null,
    theme: profile.theme || existing?.theme || 'corporate-dark',
    custom_links: profile.custom_links || existing?.custom_links || [],
  };
```

Replace with:

```ts
  const updatedProfile: UserProfile = {
    id: existing?.id || crypto.randomUUID(),
    github_id: profile.github_id,
    username: normalizedUser,
    name: profile.name ?? existing?.name ?? null,
    avatar_url: profile.avatar_url || existing?.avatar_url || '',
    bio: profile.bio ?? existing?.bio ?? null,
    custom_bio: profile.custom_bio ?? existing?.custom_bio ?? null,
    company: profile.company ?? existing?.company ?? null,
    location: profile.location ?? existing?.location ?? null,
    email: profile.email ?? existing?.email ?? null,
    blog: profile.blog ?? existing?.blog ?? null,
    theme: profile.theme || existing?.theme || 'corporate-dark',
    custom_accent: profile.custom_accent ?? existing?.custom_accent ?? null,
    custom_links: profile.custom_links || existing?.custom_links || [],
  };
```

- [ ] **Step 4: Accept and validate `custom_accent` in the API route**

In `src/app/api/profile/update/route.ts`, find:

```ts
    const customBio: string | null = typeof body.custom_bio !== 'undefined' ? body.custom_bio : currentProfile.custom_bio;
    const theme: ThemeType = body.theme || currentProfile.theme;
```

Replace with:

```ts
    const customBio: string | null = typeof body.custom_bio !== 'undefined' ? body.custom_bio : currentProfile.custom_bio;
    const theme: ThemeType = body.theme || currentProfile.theme;
    const isValidHexColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
    const customAccent: string | null =
      typeof body.custom_accent === 'undefined'
        ? currentProfile.custom_accent
        : (body.custom_accent === null ? null : (isValidHexColor(body.custom_accent) ? body.custom_accent : currentProfile.custom_accent));
```

Then find the `upsertProfile` call:

```ts
    const updated = await upsertProfile({
      github_id: currentProfile.github_id,
      username: currentProfile.username,
      name,
      avatar_url: currentProfile.avatar_url,
      bio: currentProfile.bio,
      custom_bio: customBio,
      company,
      location,
      email: currentProfile.email,
      blog,
      theme,
      custom_links: customLinks,
    });
```

Replace with:

```ts
    const updated = await upsertProfile({
      github_id: currentProfile.github_id,
      username: currentProfile.username,
      name,
      avatar_url: currentProfile.avatar_url,
      bio: currentProfile.bio,
      custom_bio: customBio,
      company,
      location,
      email: currentProfile.email,
      blog,
      theme,
      custom_accent: customAccent,
      custom_links: customLinks,
    });
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. (This step is where TypeScript will flag any remaining `UserProfile` construction site missing `custom_accent` — if it does, add `custom_accent: null` there too before proceeding; the codebase search in the steps above should have caught every one, but this is the safety net the required-not-optional field choice exists for.)

- [ ] **Step 6: Run the schema migration**

If a Supabase project is connected (check `.env.local` for `NEXT_PUBLIC_SUPABASE_URL`), run the new `ALTER TABLE ... ADD COLUMN IF NOT EXISTS custom_accent TEXT;` line from `supabase/schema.sql` in the Supabase SQL editor. If no Supabase project is connected in this environment, skip this sub-step — the in-memory fallback store in `server.ts` needs no migration and the app will run correctly locally either way.

- [ ] **Step 7: Commit**

```bash
git add src/types/index.ts supabase/schema.sql src/lib/supabase/server.ts src/app/api/profile/update/route.ts
git commit -m "feat: persist custom_accent end-to-end (type, schema, storage, API)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 12: ThemeSelector rewrite + dashboard wiring

**Files:**
- Modify: `src/components/dashboard/ThemeSelector.tsx`
- Modify: `src/app/dashboard/page.tsx`

**Interfaces:**
- Consumes: `themes`, `getTheme` from `@/lib/theme` (Task 10); `UserProfile.custom_accent` (Task 11).
- Produces: `ThemeSelector` now takes `currentAccent: string | null` and `onSelectAccent: (accent: string | null) => Promise<void>` in addition to its existing `currentTheme`/`onSelectTheme` props.

- [ ] **Step 1: Replace `ThemeSelector.tsx` in full**

```tsx
'use client';

import { useState } from 'react';
import { ThemeType } from '@/types';
import { themes, getTheme } from '@/lib/theme';
import { Palette, Check, RotateCcw } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  currentAccent: string | null;
  onSelectTheme: (theme: ThemeType) => Promise<void>;
  onSelectAccent: (accent: string | null) => Promise<void>;
}

const ACCENT_SWATCHES = ['#ff5a3c', '#f5b83d', '#4fd8ff', '#10b981', '#ec4899', '#8b5cf6', '#f43f5e'];

export default function ThemeSelector({ currentTheme, currentAccent, onSelectTheme, onSelectAccent }: ThemeSelectorProps) {
  const currentIsLight = getTheme(currentTheme).isLight;
  const [group, setGroup] = useState<'dark' | 'light'>(currentIsLight ? 'light' : 'dark');
  const [hexInput, setHexInput] = useState(currentAccent ?? '');

  const visibleThemes = Object.values(themes).filter((t) => t.isLight === (group === 'light'));

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      onSelectAccent(value);
    }
  };

  return (
    <div className="rounded-3xl border border-[#3a2c22] bg-[#1f1a16] p-6 sm:p-8 shadow-[5px_5px_0_0_#14110f] space-y-5">
      <div className="flex items-center justify-between gap-4 border-b border-[#3a2c22] pb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/25">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#fdf6ec]">Portfolyo Teması</h2>
            <p className="text-xs text-[#cbb9a0]">
              Bir tema seçin, isterseniz vurgu rengini özelleştirin — değişikliklerinizi en üstteki kaydet butonuyla uygulayın.
            </p>
          </div>
        </div>

        <div className="flex bg-[#14110f] border border-[#3a2c22] rounded-full p-1 gap-0.5">
          {(['dark', 'light'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                group === g ? 'bg-[#ff5a3c] text-[#14110f]' : 'text-[#cbb9a0]'
              }`}
            >
              {g === 'dark' ? 'Koyu' : 'Açık'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleThemes.map((t) => {
          const isSelected = currentTheme === t.id;
          const previewAccent = isSelected && currentAccent ? currentAccent : t.accentColor;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTheme(t.id)}
              className={`relative flex flex-col gap-2.5 p-4 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'border-[#ff5a3c] bg-[#291f19] shadow-[3px_3px_0_0_#ff5a3c]'
                  : 'border-[#3a2c22] bg-[#14110f] hover:border-[#8a7864]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: previewAccent }} />
                  <h4 className="text-sm font-bold text-[#fdf6ec]">{t.name}</h4>
                </div>
                {isSelected && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ff5a3c] text-[#14110f]">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                )}
              </div>

              {/* Canlı önizleme — theme.ts'nin gerçek renklerinden üretilir */}
              <div
                className="rounded-xl p-2.5 flex flex-col gap-2"
                style={{ background: t.bgHex, border: `1px solid ${t.borderHex}` }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: previewAccent }} />
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="h-1.5 rounded-full" style={{ width: '55%', background: t.textPrimaryHex }} />
                    <span className="h-1 rounded-full opacity-70" style={{ width: '35%', background: t.textSecondaryHex }} />
                  </div>
                </div>
                <span
                  className="self-start text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: previewAccent, color: '#ffffff' }}
                >
                  @kullaniciadi
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#3a2c22] pt-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[11px] font-bold text-[#cbb9a0] uppercase tracking-wide">Accent Rengi</span>
            <p className="text-[11px] text-[#8a7864]">Opsiyonel — seçili temanın üzerine uygulanır.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setHexInput('');
              onSelectAccent(null);
            }}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#cbb9a0] hover:text-[#fdf6ec] border border-[#3a2c22] bg-[#14110f] px-3 py-1.5 rounded-full transition"
          >
            <RotateCcw className="w-3 h-3" />
            Sıfırla
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {ACCENT_SWATCHES.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => {
                setHexInput(hex);
                onSelectAccent(hex);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: hex,
                boxShadow: currentAccent === hex ? '0 0 0 2px #14110f, 0 0 0 4px #fdf6ec' : 'none',
              }}
            >
              {currentAccent === hex && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </button>
          ))}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border border-[#3a2c22]" style={{ backgroundColor: hexInput || '#14110f' }} />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#RRGGBB"
              className="w-28 px-3 py-2 rounded-lg border border-[#3a2c22] bg-[#14110f] text-[#fdf6ec] font-mono text-xs focus:border-[#ff5a3c] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire up `dashboard/page.tsx`**

Add a pending-accent state next to `pendingTheme`. Find:

```tsx
  const [pendingTheme, setPendingTheme] = useState<ThemeType | null>(null);
```

Replace with:

```tsx
  const [pendingTheme, setPendingTheme] = useState<ThemeType | null>(null);
  const [pendingAccent, setPendingAccent] = useState<string | null | undefined>(undefined);
```

(`undefined` = "no pending change"; `null` = "user explicitly cleared the accent" — distinct from `undefined`, so `hasPendingChanges` and the save payload can tell "no edit" apart from "edit to null".)

Find `hasPendingChanges`:

```tsx
  const hasPendingChanges =
    pendingTheme !== null ||
    pendingBio !== null ||
```

Replace with:

```tsx
  const hasPendingChanges =
    pendingTheme !== null ||
    pendingAccent !== undefined ||
    pendingBio !== null ||
```

In `handleSaveAll`, find:

```tsx
    const payload: Record<string, unknown> = { username: activeUsername };
    if (pendingTheme !== null) payload.theme = pendingTheme;
```

Replace with:

```tsx
    const payload: Record<string, unknown> = { username: activeUsername };
    if (pendingTheme !== null) payload.theme = pendingTheme;
    if (pendingAccent !== undefined) payload.custom_accent = pendingAccent;
```

Still in `handleSaveAll`, find both places that reset pending state (`setProfile((prev) => ({...}))`'s spread list, and the "Pending değişiklikleri temizle" block). First:

```tsx
          setProfile((prev) => ({
            ...prev!,
            ...(pendingTheme !== null && { theme: pendingTheme }),
            ...(pendingBio !== null && { custom_bio: pendingBio }),
```

Replace with:

```tsx
          setProfile((prev) => ({
            ...prev!,
            ...(pendingTheme !== null && { theme: pendingTheme }),
            ...(pendingAccent !== undefined && { custom_accent: pendingAccent }),
            ...(pendingBio !== null && { custom_bio: pendingBio }),
```

Second, find:

```tsx
        // Pending değişiklikleri temizle
        setPendingTheme(null);
        setPendingBio(null);
```

Replace with:

```tsx
        // Pending değişiklikleri temizle
        setPendingTheme(null);
        setPendingAccent(undefined);
        setPendingBio(null);
```

In `handleSwitchUser`, find the other pending-clear block:

```tsx
      // Bekleyen değişiklikleri temizle
      setPendingTheme(null);
      setPendingBio(null);
```

Replace with:

```tsx
      // Bekleyen değişiklikleri temizle
      setPendingTheme(null);
      setPendingAccent(undefined);
      setPendingBio(null);
```

In the `displayProfile` construction, find:

```tsx
  const displayProfile: UserProfile = {
    ...profile,
    ...(pendingTheme !== null && { theme: pendingTheme }),
    ...(pendingBio !== null && { custom_bio: pendingBio }),
```

Replace with:

```tsx
  const displayProfile: UserProfile = {
    ...profile,
    ...(pendingTheme !== null && { theme: pendingTheme }),
    ...(pendingAccent !== undefined && { custom_accent: pendingAccent }),
    ...(pendingBio !== null && { custom_bio: pendingBio }),
```

Finally, find the `<ThemeSelector>` usage:

```tsx
        <ThemeSelector
          currentTheme={displayProfile.theme}
          onSelectTheme={(theme) => {
            setPendingTheme(theme);
            return Promise.resolve();
          }}
        />
```

Replace with:

```tsx
        <ThemeSelector
          currentTheme={displayProfile.theme}
          currentAccent={displayProfile.custom_accent}
          onSelectTheme={(theme) => {
            setPendingTheme(theme);
            return Promise.resolve();
          }}
          onSelectAccent={(accent) => {
            setPendingAccent(accent);
            return Promise.resolve();
          }}
        />
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual check**

`npm run dev`, open `/dashboard`, scroll to "Portfolyo Teması". Confirm: Koyu/Açık toggle filters the grid, each card's mini-preview uses real theme colors (not a duplicated hardcoded set), picking a swatch or typing a valid hex live-updates the selected card's preview dot/badge, "Sıfırla" clears it, and the unsaved-changes banner appears.

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/ThemeSelector.tsx src/app/dashboard/page.tsx
git commit -m "feat: rewrite ThemeSelector with live preview and custom accent picker

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 13: Propagate `custom_accent` to portfolio consumers

**Files:**
- Modify: `src/components/portfolio/PortfolioHero.tsx`
- Modify: `src/components/portfolio/ProjectCard.tsx`
- Modify: `src/components/portfolio/ProjectGrid.tsx`
- Modify: `src/components/portfolio/PortfolioFooter.tsx`
- Modify: `src/components/portfolio/TechStack.tsx`
- Modify: `src/components/portfolio/ShareModal.tsx`
- Modify: `src/components/navbar/Navbar.tsx`
- Modify: `src/app/[username]/page.tsx`

**Interfaces:**
- `ProjectCard`, `ProjectGrid`, `PortfolioFooter`, `TechStack`, `ShareModal`, `Navbar` each gain an optional `customAccent?: string | null` prop, passed straight through to `getTheme(themeType, customAccent)`.
- `PortfolioHero` needs no new prop — it already receives the full `profile` object.

- [ ] **Step 1: `PortfolioHero.tsx`**

Find:

```tsx
  const theme = getTheme(profile.theme);
```

Replace with:

```tsx
  const theme = getTheme(profile.theme, profile.custom_accent);
```

Also update the `<ShareModal>` call further down to pass it through:

```tsx
      {showShareModal && (
        <ShareModal
          username={profile.username}
          themeType={profile.theme}
          onClose={() => setShowShareModal(false)}
        />
      )}
```

Replace with:

```tsx
      {showShareModal && (
        <ShareModal
          username={profile.username}
          themeType={profile.theme}
          customAccent={profile.custom_accent}
          onClose={() => setShowShareModal(false)}
        />
      )}
```

- [ ] **Step 2: `ProjectCard.tsx`**

Find:

```tsx
interface ProjectCardProps {
  repo: Repository;
  themeType?: ThemeType;
}

export default function ProjectCard({ repo, themeType }: ProjectCardProps) {
  const theme = getTheme(themeType);
```

Replace with:

```tsx
interface ProjectCardProps {
  repo: Repository;
  themeType?: ThemeType;
  customAccent?: string | null;
}

export default function ProjectCard({ repo, themeType, customAccent }: ProjectCardProps) {
  const theme = getTheme(themeType, customAccent);
```

- [ ] **Step 3: `ProjectGrid.tsx`**

Find:

```tsx
interface ProjectGridProps {
  repos: Repository[];
  themeType?: ThemeType;
}

export default function ProjectGrid({ repos, themeType }: ProjectGridProps) {
  const theme = getTheme(themeType);
```

Replace with:

```tsx
interface ProjectGridProps {
  repos: Repository[];
  themeType?: ThemeType;
  customAccent?: string | null;
}

export default function ProjectGrid({ repos, themeType, customAccent }: ProjectGridProps) {
  const theme = getTheme(themeType, customAccent);
```

Then find where it renders `ProjectCard`:

```tsx
        {visibleRepos.map((repo) => (
          <ProjectCard key={repo.github_repo_id || repo.name} repo={repo} themeType={themeType} />
        ))}
```

Replace with:

```tsx
        {visibleRepos.map((repo) => (
          <ProjectCard key={repo.github_repo_id || repo.name} repo={repo} themeType={themeType} customAccent={customAccent} />
        ))}
```

- [ ] **Step 4: `PortfolioFooter.tsx`**

Find:

```tsx
interface PortfolioFooterProps {
  themeType?: ThemeType;
  username: string;
}

export default function PortfolioFooter({ themeType, username }: PortfolioFooterProps) {
  const theme = getTheme(themeType);
```

Replace with:

```tsx
interface PortfolioFooterProps {
  themeType?: ThemeType;
  username: string;
  customAccent?: string | null;
}

export default function PortfolioFooter({ themeType, username, customAccent }: PortfolioFooterProps) {
  const theme = getTheme(themeType, customAccent);
```

- [ ] **Step 5: `TechStack.tsx`**

Find:

```tsx
interface TechStackProps {
  repos: Repository[];
  themeType?: ThemeType;
}
```

and

```tsx
export default function TechStack({ repos, themeType }: TechStackProps) {
  const theme = getTheme(themeType);
```

Replace with:

```tsx
interface TechStackProps {
  repos: Repository[];
  themeType?: ThemeType;
  customAccent?: string | null;
}
```

and

```tsx
export default function TechStack({ repos, themeType, customAccent }: TechStackProps) {
  const theme = getTheme(themeType, customAccent);
```

- [ ] **Step 6: `ShareModal.tsx`**

Find:

```tsx
interface ShareModalProps {
  username: string;
  themeType?: ThemeType;
  onClose: () => void;
}

export default function ShareModal({ username, themeType, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const theme = getTheme(themeType);
```

Replace with:

```tsx
interface ShareModalProps {
  username: string;
  themeType?: ThemeType;
  customAccent?: string | null;
  onClose: () => void;
}

export default function ShareModal({ username, themeType, customAccent, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const theme = getTheme(themeType, customAccent);
```

(`theme` isn't actually referenced elsewhere in this file today — this keeps it available for consistency and future use without changing current rendering, since the file otherwise hardcodes its own dark modal chrome.)

- [ ] **Step 7: `Navbar.tsx` — portfolio-context branch only**

Find:

```tsx
interface NavbarProps {
  headerStyle?: React.CSSProperties;
  themeType?: ThemeType;
  currentUsername?: string;
}

export default function Navbar({ headerStyle, themeType, currentUsername }: NavbarProps = {}) {
```

Replace with:

```tsx
interface NavbarProps {
  headerStyle?: React.CSSProperties;
  themeType?: ThemeType;
  currentUsername?: string;
  customAccent?: string | null;
}

export default function Navbar({ headerStyle, themeType, currentUsername, customAccent }: NavbarProps = {}) {
```

Find:

```tsx
  const theme = getTheme(themeType);
```

Replace with:

```tsx
  const theme = getTheme(themeType, customAccent);
```

- [ ] **Step 8: `src/app/[username]/page.tsx`**

Find:

```tsx
  const repos = await getCachedReposByUsername(decodedUsername);
  const theme = getTheme(profile.theme);

  return (
    <div
      className={`min-h-screen ${theme.bg} transition-all duration-300 flex flex-col`}
      style={theme.backgroundStyle}
    >
      <Navbar headerStyle={theme.headerStyle} themeType={profile.theme} currentUsername={profile.username} />

      <main className="flex-1">
        <PortfolioHero profile={profile} />
        <TechStack repos={repos} themeType={profile.theme} />
        <ProjectGrid repos={repos} themeType={profile.theme} />
      </main>

      <PortfolioFooter username={profile.username} themeType={profile.theme} />
    </div>
  );
```

Replace with:

```tsx
  const repos = await getCachedReposByUsername(decodedUsername);
  const theme = getTheme(profile.theme, profile.custom_accent);

  return (
    <div
      className={`min-h-screen ${theme.bg} transition-all duration-300 flex flex-col`}
      style={theme.backgroundStyle}
    >
      <Navbar headerStyle={theme.headerStyle} themeType={profile.theme} currentUsername={profile.username} customAccent={profile.custom_accent} />

      <main className="flex-1">
        <PortfolioHero profile={profile} />
        <TechStack repos={repos} themeType={profile.theme} customAccent={profile.custom_accent} />
        <ProjectGrid repos={repos} themeType={profile.theme} customAccent={profile.custom_accent} />
      </main>

      <PortfolioFooter username={profile.username} themeType={profile.theme} customAccent={profile.custom_accent} />
    </div>
  );
```

- [ ] **Step 9: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 10: Manual check**

`npm run dev`. In `/dashboard`, pick a theme, set a custom accent (e.g. `#4fd8ff`), save. Open that user's public portfolio page (`/{username}`) in a new tab: confirm the primary button and the `@username` badge render in the chosen accent color, contrast text stays readable, and everything else about that theme is unchanged.

- [ ] **Step 11: Commit**

```bash
git add src/components/portfolio/PortfolioHero.tsx src/components/portfolio/ProjectCard.tsx src/components/portfolio/ProjectGrid.tsx src/components/portfolio/PortfolioFooter.tsx src/components/portfolio/TechStack.tsx src/components/portfolio/ShareModal.tsx src/components/navbar/Navbar.tsx "src/app/[username]/page.tsx"
git commit -m "feat: thread custom_accent through all portfolio-rendering components

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

---

## Task 14: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Full type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors (warnings acceptable only if they pre-date this plan — do not introduce new ones).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual walkthrough (from the spec's Testing section)**

Run: `npm run dev`.
1. Open `/` — landing page: new palette throughout, Kodi bouncing in the hero, bento feature grid, no leftover old-palette hex visible.
2. Open `/dashboard` — new palette throughout, ThemeSelector's live preview and accent picker both work.
3. Open `/ornek-ogrenci` (or another demo/synced user) — confirm it renders with its own original (untouched) portfolio theme, no app-shell palette bleed.
4. Resize to 375px width on `/` and `/dashboard` — headline wraps cleanly, every button/tap target is at least 44px, no horizontal scrollbar.

- [ ] **Step 4: Final commit (only if any fixups were needed in this task)**

```bash
git add -A
git commit -m "fix: address build/lint/manual-QA findings from full verification pass

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EYy7z4hpdftHypYXXJd5in"
```

If nothing needed fixing, skip this step — there is nothing to commit.
