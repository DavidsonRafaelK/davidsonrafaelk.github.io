# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when work this repo.

## Commands

- `npm run dev` — start dev server (Next.js, Turbopack)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — Biome check (lint + format check)
- `npm run format` — Biome format, writes fixes

No test runner. No single-test command — no test files in repo.

## Architecture

Next.js 16 (App Router) personal portfolio site. React 19 + React Compiler on (`reactCompiler: true` in `next.config.ts`).

- `src/app/` — App Router routes. `layout.tsx` sets fonts (Geist, Geist Mono, DM Sans headings, Roboto body) as CSS variables, wraps all pages in `<ThemeProvider>` (next-themes, `attribute="class"`) then `<SmoothScroll/>`, `<NavProgressiveBlur/>`, `<NavBar/>`, `<SiteFooter/>`. `page.tsx` composes homepage sections (`FlipWordsDemo`, `AboutMeSection`, `SkillsSection`, `WorkEducationSection`) — order there drives scroll order and must match anchor `id`s in `navbar.tsx`. `robots.ts`, `sitemap.ts`, `opengraph-image.tsx` and `layout.tsx`'s metadata all read shared constants from `src/lib/site.ts` (siteName/siteUrl/siteDescription/siteKeywords) — update that file, not each route, when site metadata changes.
- `src/components/layouts/` — page-level composed sections.
  - `sections/` — homepage sections (`about-me-section.tsx`, `skills-section.tsx`, `work-education-section.tsx`).
  - `hero/` — hero sub-components (`hero-heading.tsx`, `hero-flip-intro.tsx`, `pulse-audio-row.tsx`, `github-activity.tsx`) + `hero-data.ts` for copy/content, composed by `flip-words-demo.tsx`. That file's two top-level wrapper divs need `w-full` explicitly — the parent `<main>` uses `items-center` (not `stretch`), so without it they shrink-wrap to their widest child (the GitHub calendar) and overflow the viewport on mobile.
  - `navbar.tsx`, `site-footer.tsx`, `smooth-scroll.tsx` (Lenis inertia scroll — do not re-add `scroll-behavior: smooth` in globals.css, fights Lenis), `tech-stack.tsx`, `nav-progressive-blur.tsx` (fixed bottom-viewport fade, theme-aware pair of `ProgressiveBlur` instances toggled via `dark:`).
- `src/components/ui/` — shadcn-style primitives + animation components (installed via shadcn CLI, see below). Includes Aceternity-sourced components (`resizable-navbar.tsx`, `flip-words.tsx`, `text-generate-effect.tsx`, `text-hover-effect.tsx`, `typing-animation.tsx`), skiper-ui-sourced components (`skiper-ui/skiper26.tsx` — `ThemeToggleButton`/view-transition theme toggle, wired into `navbar.tsx`; `skiper-ui/skiper41.tsx` — `ProgressiveBlur`), plus `AudioPlayer.tsx`. In `resizable-navbar.tsx`, `NavItems` is `absolute inset-0` over the full navbar — it must keep `pointer-events-none` on the wrapper and `pointer-events-auto` on each link, or it silently eats clicks on whatever renders after it in `NavBody` (e.g. the theme toggle / "Book a call" button).
- `src/components/theme-provider.tsx` — thin client wrapper around next-themes' `ThemeProvider`.
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge), standard way compose conditional Tailwind classes across codebase.
- `public/icons/tech/` — brand SVG icons (devicon/simple-icons sourced) for tech-stack section.

### Styling

Tailwind CSS v4, config-less (no `tailwind.config.*` — theme tokens live `src/app/globals.css` under `@theme inline`, CSS custom properties for colors, radii, fonts, custom animations). Dark mode via `.dark` class variant (`@custom-variant dark`), toggled at runtime by next-themes (`ThemeProvider` in `layout.tsx`); actual page backgrounds use hardcoded `bg-zinc-50 dark:bg-black` (not the `--background` token) — match that when adding theme-aware surfaces.

### shadcn / component registries

`components.json` configures shadcn with custom registries:
- `@aceternity` → `https://ui.aceternity.com/registry/{name}.json`
- `@magicui` → `https://magicui.design/r/{name}`
- `@skiper-ui` → `https://skiper-ui.com/registry/{name}.json`

Add new UI components: `npx shadcn add <name>` or `npx shadcn add @aceternity/<name>` / `@magicui/<name>` / `@skiper-ui/<name>`; land in `src/components/ui/`. Path aliases (`@/components`, `@/lib`, `@/ui`, `@/hooks`) defined `components.json`, mirrored `tsconfig.json` (`@/*` → `./src/*`).

### Linting/formatting

Biome (not ESLint/Prettier) — 2-space indent, organizes imports on save via `assist` config. Run `npm run lint` before call change done.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
