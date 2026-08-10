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

- `src/app/` — App Router routes. `layout.tsx` sets fonts (Geist, Geist Mono, DM Sans headings, Roboto body) as CSS variables, wraps all pages with `<NavBar/>`.
- `src/components/layouts/` — page-level composed sections (e.g. `navbar.tsx`).
- `src/components/ui/` — shadcn-style primitives + animation components (installed via shadcn CLI, see below). Includes Aceternity-sourced components (`resizable-navbar.tsx`, `flip-words.tsx`, `text-generate-effect.tsx`).
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge), standard way compose conditional Tailwind classes across codebase.

### Styling

Tailwind CSS v4, config-less (no `tailwind.config.*` — theme tokens live `src/app/globals.css` under `@theme inline`, CSS custom properties for colors, radii, fonts, custom animations). Dark mode via `.dark` class variant (`@custom-variant dark`).

### shadcn / component registries

`components.json` configures shadcn with custom registries:
- `@aceternity` → `https://ui.aceternity.com/registry/{name}.json`
- `@magicui` → `https://magicui.design/r/{name}`

Add new UI components: `npx shadcn add <name>` or `npx shadcn add @aceternity/<name>` / `@magicui/<name>`; land in `src/components/ui/`. Path aliases (`@/components`, `@/lib`, `@/ui`, `@/hooks`) defined `components.json`, mirrored `tsconfig.json` (`@/*` → `./src/*`).

### Linting/formatting

Biome (not ESLint/Prettier) — 2-space indent, organizes imports on save via `assist` config. Run `npm run lint` before call change done.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
