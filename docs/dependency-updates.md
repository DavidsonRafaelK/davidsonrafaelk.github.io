# Dependency update report

Generated 2026-09-11 against the working tree at `501f73b`.

Sources: `bun outdated --filter='*'`, `bun audit`, `npm view <pkg> peerDependencies`, and vendor
changelogs. Usage was traced through `apps/web/src` and `packages/ui/src`.

**Nothing has been updated.** No `package.json` and no `bun.lock` was touched. This is a report only.

---

## 1. Triage summary

37 packages are behind. `bun audit` reports **61 advisories in the resolved tree: 2 critical,
30 high, 25 moderate, 4 low.**

| Package | Workspace | Current | Latest | Recommendation |
| --- | --- | --- | --- | --- |
| `next` | web | 16.2.9 | 16.3.4 | **Update now** (2 critical CVEs) |
| `posthog-js` | web | 1.386.6 | 1.430.2 | **Update now** (browser-bundle CVEs) |
| `evlog` | catalog | 2.19.1 | 2.29.0 | Update now |
| `@biomejs/biome` | root | 2.5.0 | 2.5.13 | Update now |
| `turbo` | root | 2.9.18 | 2.10.12 | Update now |
| `lefthook` | root | 2.1.9 | 2.1.12 | Update now |
| `webpack` | web | 5.109.2 | 5.110.3 | Update now |
| `tailwindcss` | catalog | 4.3.1 | 4.3.3 | Update now (with the pair below) |
| `@tailwindcss/postcss` | web | 4.3.1 | 4.3.3 | Update now (with the pair above) |
| `@types/bun` | catalog | 1.3.14 | 1.4.2 | Update now |
| `motion` | web | 12.42.2 | 13.2.0 | Update soon (major, but safe here) |
| `framer-motion` | ui | 12.42.2 | 13.2.0 | Update soon (same major) |
| `@base-ui/react` | ui | 1.5.0 | 1.8.0 | Update soon |
| `lucide-react` | catalog | 1.18.0 | 1.45.0 | Update soon |
| `zod` | catalog | 4.4.3 | 4.6.2 | Update soon (one behaviour check) |
| `swiper` | ui | 14.0.6 | 14.2.0 | Update soon |
| `sonner` | catalog | 2.0.7 | 2.0.8 | Update soon |
| `lenis` | web | 1.3.23 | 1.3.26 | Update soon |
| `wavesurfer.js` | web | 7.12.8 | 7.12.12 | Update soon |
| `countries-list` | web | 3.3.0 | 3.4.1 | Update soon |
| `@radix-ui/react-use-controllable-state` | ui | 1.2.4 | 1.2.6 | Update soon |
| `storybook` + 3 addons | web | 10.5.8 | 10.6.0 | Update soon (as a set) |
| `@once-ui-system/core` | web | 1.7.12 | 1.8.4 | Update, then check the page visually |
| `react` / `react-dom` | catalog | 19.2.7 | 19.3.0 | Wait ~2 weeks |
| `@types/react` / `@types/react-dom` | catalog | 19.2.17 / 19.2.3 | 19.3.0 | Wait, move with React |
| `typescript` | catalog | 6.0.3 | 7.0.2 | **Hold** until 7.1 |
| `@types/node` | web | 20.19.43 | 22.20.2 | Needs a decision (22 vs 24) |
| `shadcn` | web + ui | 4.11.0 / 3.8.5 | 4.21.0 | Needs a decision, see section 4 |

---

## 2. Security

### The one that matters: `next@16.2.9`

The installed version falls inside the advisory range `>=16.0.0 <16.2.11`. That range carries
**two critical advisories**:

- [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36): unauthenticated remote
  code execution on Windows-hosted servers. **Does not apply here.** The site deploys to Vercel,
  which is Linux.
- [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4): unauthenticated remote
  code execution in the Image Optimization API when AVIF files are used. **This one applies.**
  `apps/web/next.config.ts` allows nine remote image hostnames through `images.remotePatterns`,
  including `i.pinimg.com`, `cdn.cosmos.so`, and a Supabase bucket. Any of those can serve an AVIF
  into the optimizer.

The same range also covers, at high severity:

- [GHSA-p9j2-gv94-2wf4](https://github.com/advisories/GHSA-p9j2-gv94-2wf4): SSRF in rewrites via
  attacker-controlled destination hostname. `next.config.ts` has two rewrites (the PostHog proxy),
  both with fixed hostnames, so exposure is limited.
- [GHSA-6gpp-xcg3-4w24](https://github.com/advisories/GHSA-6gpp-xcg3-4w24): middleware/proxy bypass
  in App Router apps using Turbopack and a single locale.
- [GHSA-m99w-x7hq-7vfj](https://github.com/advisories/GHSA-m99w-x7hq-7vfj): DoS via Server Actions.
- [GHSA-89xv-2m56-2m9x](https://github.com/advisories/GHSA-89xv-2m56-2m9x): SSRF in Server Actions
  on custom servers.

Plus moderate-severity cache confusion, image-optimization DoS via SVG, and unauthenticated
disclosure of internal Server Function endpoints.

All of these are fixed in 16.2.11. Current latest is 16.3.4.

### Everything else is transitive

Grouped by the direct dependency that pulls it in:

**Ships to the browser:**

- `posthog-js` pulls `dompurify <=3.4.11` (one low, two moderate, including an XSS via detached
  subtree, [GHSA-55q2-fjhq-7xh7](https://github.com/advisories/GHSA-55q2-fjhq-7xh7)) and
  `fflate >=0.4.5 <0.4.9` (infinite loop on malformed ZIP64). Updating `posthog-js` is the fix.

**Build-time and tooling only, no runtime exposure on the deployed site:**

- `shadcn` pulls `hono`, `@hono/node-server`, `ip-address`, `brace-expansion`, `js-yaml`,
  `browserslist`, `qs`, `body-parser`. This is the largest single contributor and it is avoidable,
  see section 4.
- `@storybook/nextjs` pulls `image-size`, `elliptic`, `js-yaml`, `brace-expansion`, `qs`.
- `evlog` pulls `hono`, `body-parser`, `qs`.
- `gray-matter` pulls `js-yaml >=4.0.0 <4.3.0` (four high-severity quadratic-CPU advisories).
  `gray-matter@4.0.3` is the latest published version, so there is no upgrade path. It is used in
  `apps/web/src/lib/projects-content.ts` to parse front matter from MDX files that live in the repo,
  so the input is trusted.
- Shared build chain: `postcss`, `nanoid`, `baseline-browser-mapping`, `immutable`, `fast-uri`.
  These come in through `next`, `webpack`, `@tailwindcss/postcss`, `@once-ui-system/core` and
  Storybook simultaneously. Most resolve once the direct dependencies above are bumped.

---

## 3. Per-package detail

### `next` 16.2.9 → 16.3.4: **update now**

**What changed.** 16.3 is a large but additive release. Turbopack uses up to 90% less memory in dev,
disk caching now applies to `next build`, App Router SSR moved from web streams to native Node.js
streams (up to 22% more requests under load), and prefetches below a size threshold are bundled
together. New APIs: `catchError` custom error boundaries from `next/error`, `import.meta.glob`,
and root params via `next/root-params`.

The headline feature, Instant Navigations (Partial Prefetching, improved ISR, Navigation Inspector,
the Playwright `instant()` helper), is opt-in behind `cacheComponents: true` and
`partialPrefetching: true`. Neither flag is set in `apps/web/next.config.ts`, so none of it activates
on upgrade.

**Breaking changes.** The only one called out is that `@types/node` now participates in the peer
fingerprint, which matters for projects pinning a Node version. See the `@types/node` entry below.

**How it is used here.** `apps/web` is the only app. `next.config.ts` sets `typedRoutes: true`,
`reactCompiler: true`, `allowedDevOrigins`, nine `images.remotePatterns`, three security headers,
and two PostHog rewrites. There are three API routes (`insights`, `spotify/recently-played`,
`weather`) plus generated `sitemap.ts`, `robots.ts`, and `llms.txt/route.ts`. No Server Actions,
no middleware, no custom server.

**Risk.** Low. Nothing in the repo touches an API 16.3 changed.

**Note for later.** 16.3 adds an experimental Rust port of the React Compiler behind
`experimental.turbopackRustReactCompiler`. Since `reactCompiler: true` is already on and
`babel-plugin-react-compiler` is a dev dependency, that flag is worth trying separately once the
version bump is confirmed stable.

---

### `motion` 12.42.2 → 13.2.0 and `framer-motion` 12.42.2 → 13.2.0: **safe**

**What changed.** v13.0.0 (2026-08-05) has exactly one breaking change:

> Removed optional `@emotion/is-prop-valid` dependency in favour of explicit
> `<MotionConfig isValidProp={isPropValid}>`

This only affects Styled Components and Emotion users. 13.1.0 added multidimensional `Reorder` and
RTL support. 13.1.1 improved React 19 strict-mode compatibility for `AnimatePresence`. 13.2.0 added
`animate.addEffect()`, `motion/three`, and `motion/vgpu`, and shrank the `spring` implementation.
12.43.0 added hardware acceleration for `backgroundColor` and SVG elements.

**How it is used here.** Heavily, across 38 import sites:

- 21 files import from `motion/react`
- 17 files import from `motion/react-m`
- 3 files in `packages/ui/src/skiper-ui/` import from `framer-motion`
- 1 file imports from `motion` directly (`components/image-trail.tsx`)

APIs in use: `LazyMotion` with `domAnimation` (14 and 9 occurrences), `useSpring` (31), `stagger`
(13), `useReducedMotion` (10), `useMotionValue` (10), `AnimatePresence` (8), `scroll` (7),
`useTransform` (6), `useAnimate` (2). The largest concentration is `components/charts/`, which uses
`motion/react-m` throughout its tooltip, renderer, and overlay layers.

**Risk.** Low. The repo has no Emotion and no styled-components, so the sole breaking change is a
no-op. The `LazyMotion` + `domAnimation` + `motion/react-m` pattern the charts subsystem relies on is
unchanged in v13. Peer range is `react ^18.0.0 || ^19.0.0`, satisfied.

**Recommendation.** Update. See section 4 item 2 about consolidating the two packages first.

---

### `typescript` 6.0.3 → 7.0.2: **hold**

**What changed.** TypeScript 7.0 reached GA on 2026-07-08. It is a full native port of the compiler
and language service to Go, with full-build speedups typically between 8x and 12x.

**Breaking changes:**

- **No public compiler API.** TypeScript 7.0 does not ship a programmatic API. 7.1 will introduce a
  new and different one. Until then, any tool consuming the TypeScript API cannot run on TS 7. This
  is the blocker.
- `--strict` on by default
- `--target es5` removed
- `--baseUrl` removed
- `--moduleResolution node10` removed
- Diagnostics do not match the classic compiler 100% yet, though the port was written for
  bug-for-bug type-checking compatibility with 6.0

**How it is used here.** In the catalog, consumed by all four workspaces. `check-types` runs
`tsc --noEmit` per workspace. Config surface:

- Root `tsconfig.json`: `strict: true`, `target: ESNext`, `moduleResolution: bundler`
- `apps/web/tsconfig.json`: `strict: true`, `target: ES2017`, `moduleResolution: bundler`,
  `paths` for `@/*`, `@resources/*`, `@homepage/ui/*`, and the `next` TS plugin

**Config compatibility is clean.** No `baseUrl` anywhere (the `paths` entries are relative and
resolve against the tsconfig location, which TS 7 supports). `moduleResolution` is `bundler`, not
`node10`. Targets are ES2017 and ESNext, not es5. Both configs are already `strict`.

**The actual risk is tooling.** The API-consumer problem hits:

- Biome: **not affected.** It has its own parser and is not typescript-eslint.
- The `next` TS plugin in `tsconfig.json` plugins: needs verification. Next 16.3 explicitly supports
  TS 7 for `next build` type checking via the `useTypeScriptCli` config, which suggests the path is
  supported, but the editor-side language service plugin is a separate question.
- Storybook's component docgen: needs verification. Storybook 10 uses `oxc-parser` and
  `oxc-resolver` as direct dependencies, which suggests it has already moved off the TypeScript API,
  but this was not confirmed.

**Recommendation.** Hold until 7.1 ships the replacement API and the ecosystem catches up. There is
no correctness or security reason to move, only build speed. If the speed is wanted sooner, the low
risk path is to upgrade `next` to 16.3 first and opt into `useTypeScriptCli` for build-time checking
while leaving the catalog on TS 6.

---

### `react` / `react-dom` 19.2.7 → 19.3.0: **wait about two weeks**

**What changed.** 19.3.0 shipped on npm 2026-09-09, two days before this report. It is a minor with
no reported breaking changes. `<ViewTransition>` is now stable, Fragment Refs let you attach DOM
behaviours to a group of siblings without a wrapper div, React DOM adds a `browser()` API to opt
components out of SSR plus Trusted Types support, and Server Components can render Context from a
`'use client'` module without a wrapper Provider.

**How it is used here.** Catalog entry, consumed by `web` and `@homepage/ui`.

**Compatibility.** `next@16.3.4` declares `react: ^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0`,
so 19.3.0 satisfies it. `motion@13.2.0` and `@base-ui/react@1.8.0` also accept `^19`.

**Risk.** Low on paper. The reason to wait is timing, not the changelog: the release is two days old,
`reactCompiler: true` is enabled in `next.config.ts`, and compiler-plus-new-React interactions are
exactly the kind of thing a .1 patch catches. Nothing in the repo needs a 19.3 feature today.

**Recommendation.** Revisit around 2026-09-25 or when 19.3.1 lands. Move `@types/react` and
`@types/react-dom` to 19.3.0 at the same time, not before.

---

### `@once-ui-system/core` 1.7.12 → 1.8.4: **update, then look at the page**

**What changed.** 1.8.0 is a minor: new component props, plus a runtime dependency swap from
`classnames` to `clsx`. Also noted: `DropdownWrapper` floating-ui behaviour changes, a simplified
`DatePicker` year-picker layout, and several components converted from `React.FC` to `forwardRef`.
1.8.1 through 1.8.4 are patch releases with bug fixes only. No prop removals or renames are
documented.

**How it is used here.** This layer owns all layout and typography per `CLAUDE.md`. Import counts:
`Flex` (17), `Column` (11), `Text` (10), `Row` (7), `Media` (3), `StatusIndicator` (1),
`MasonryGrid` (1), `Grid` (1). None of `DropdownWrapper`, `DatePicker`, or the other components
called out in the 1.8.0 notes are used.

**Risk.** Low on documented API, moderate in practice. The changelog does not list breaking changes
for any component this repo uses, but the `forwardRef` conversion and the classnames-to-clsx swap
both touch class-name generation, and this package draws every box on the site.

**Recommendation.** Update, but as its own commit, and run `bun dev:web` and scroll the whole page
before merging. Watch the numeric rem spacing props (`gap={0.65}`, `gap={4}`), the boolean sizing
props, and the breakpoint prop objects (`s={{ hide: true }}`), since those are the repo-specific
usages that upstream tests are least likely to cover.

---

### `@base-ui/react` 1.5.0 → 1.8.0: **safe**

**What changed.** 1.6.0 had two breaking changes: the preview `OTPFieldPreview` export was renamed to
`OTPField`, and `Drawer` was promoted out of preview. 1.7.0 focused on bundle size reduction, 1.8.0
on accessibility, focus management, ARIA attributes, and keyboard navigation. Nothing breaking for
`Button` in either.

**How it is used here.** Exactly one import, in
[packages/ui/src/components/button.tsx:1](packages/ui/src/components/button.tsx#L1):

```ts
import { Button as ButtonPrimitive } from "@base-ui/react/button";
```

**Risk.** Very low. Neither renamed component is used.

**One thing to check.** `@base-ui/react@1.8.0` declares `date-fns ^4.0.0` and `@date-fns/tz ^1.2.0`
as peer dependencies. Neither is installed. Since only the button subpath is imported, these should
stay unmet without consequence, but confirm `bun install` does not start warning.

---

### `shadcn`: **needs a decision, see section 4**

`apps/web` declares `^4.11.0` (resolves to 4.11.0), `packages/ui` declares `^3.6.2` (resolves to
3.8.5). Latest is 4.21.0. Both are in `dependencies`, not `devDependencies`.

There are **zero runtime imports of `shadcn` anywhere in the repo.** It is the scaffolding CLI,
configured by `apps/web/components.json` and `packages/ui/components.json`. Those two config files
also disagree: the web one uses the `phosphor` icon library and `taupe` base colour with four custom
registries, the ui one uses `lucide` and `neutral` with the skiper-ui registry.

Version choice depends on the section 4 decision, so it is covered there.

---

### `posthog-js` 1.386.6 → 1.430.2: **update now**

**What changed.** 44 minor versions. Too many to enumerate here, and PostHog does not publish a
consolidated changelog worth summarising at that span.

**How it is used here.** `apps/web/src/components/analytics/posthog-provider.tsx` calls
`posthog.init()` with `NEXT_PUBLIC_POSTHOG_KEY` and `posthog.capture("$pageview", ...)`. Traffic is
proxied through the `/a/*` rewrites in `next.config.ts`. Separately,
`apps/web/src/data/insights/api.ts` hits the PostHog HTTP API directly with `fetch`, which the SDK
version does not affect.

**Risk.** Low. The surface used is `init` plus `capture`, both stable across the whole range.

**Why now.** This is the only direct dependency shipping vulnerable code to the browser: `dompurify`
and `fflate` advisories both arrive through it.

---

### `evlog` 2.19.1 → 2.29.0: **update now**

**How it is used here.** One file, `apps/web/src/services/evlog.ts`, importing `createEvlog` from
`evlog/next` and `defineNodeInstrumentation` from `evlog/next/instrumentation`.

**Risk.** Low, small surface. Pulls in `hono` and `body-parser` transitively, so a bump likely clears
several advisories.

---

### `lucide-react` 1.18.0 → 1.45.0: **update soon**

**How it is used here.** Catalog entry, 8 import sites across both workspaces. Most consumption is
funnelled through `apps/web/src/lib/icon-library.ts`, which imports `LucideIcon` as a type plus a
block of named icon components.

**Risk.** Low. Lucide adds icons far more often than it removes them, and the barrel file means any
removal surfaces as a single compile error in one place rather than scattered across the app.

**Check.** Run `bun check-types` after the bump and confirm every named export in
`lib/icon-library.ts` still resolves.

---

### `zod` 4.4.3 → 4.6.2: **update, with one check**

**What changed.** 4.5.0 (2026-08-28) added `z.compile()` for roughly 9x faster parsing, `z.validate()`,
`z.creditCard()`, `z.deepPartial()`, `.exactPartial()`, and a 9x reduction in schema memory footprint.
4.6.0 (2026-09-09) added `z.instanceof().properties()`, `z.iban()`, `z.withParser()` for CSP
compliance without `new Function`, and fixed a memory-retention regression from 4.5 in recursive
schemas.

**Two behaviour changes in 4.6.0:**

- Error maps now execute lazily on first `result.error` read, not at parse time.
- `z.emoji()` rejects component-only strings.

**How it is used here.** Three files: `packages/env/src/web.ts`, `packages/env/src/server.ts` (both
via `@t3-oss/env-core` / `@t3-oss/env-nextjs`), and `apps/web/src/lib/projects-content.ts` for MDX
front-matter validation.

**Risk.** Low, with one thing to verify. `@t3-oss/env-*` validates at import time and is expected to
throw loudly with a readable message when a required env var is missing. The lazy error-map change
alters *when* that message is built. It should still surface, but confirm it does.

**Check.** Temporarily remove a required `NEXT_PUBLIC_*` var from `.env.local`, run `bun dev:web`,
and confirm the failure still names the missing variable rather than producing an opaque error.
`z.emoji()` is not used anywhere, so that change is a non-issue.

---

### `@types/node` 20.19.43 → 22.20.2: **needs a decision**

**Why it surfaced.** `apps/web` pins `^20`. Next.js 16.3 now includes `@types/node` in its peer
fingerprint, so a stale major is more visible than it was.

**The decision.** Vercel's current default runtime is Node 24 LTS, and Node 18 is deprecated. Two
options:

- `^22`: what `bun outdated` proposes as latest. Conservative, still behind the runtime.
- `^24`: matches what the code actually runs on in production. More correct, may surface new type
  errors in `scripts/` and the API routes.

**Recommendation.** `^24`, so the types match the deploy target, but do it in its own commit so any
new `tsc --noEmit` failures are isolated.

---

### Storybook 10.5.8 → 10.6.0: **safe, move as a set**

Four packages must move together: `storybook`, `@storybook/nextjs`, `@storybook/addon-a11y`,
`@storybook/addon-docs`, `@storybook/addon-themes`.

**What changed.** CLI and tooling work: matching instances across Windows drive-letter case, offering
10.5 experimental feature flags during upgrade, pointing `init` at `storybook skills get setup`,
rendering the same toolset output as MCP, a security token on the instance registry record, and
token-only WebSocket upgrade without Origin. No breaking changes to story format or addon APIs.

**How it is used here.** `storybook` and `build-storybook` scripts in `apps/web`, with `*.stories.tsx`
files alongside components (`components/charts/area-chart.stories.tsx`,
`components/mdx-components.stories.tsx`, `stories/mdx-components.mdx`).

**Risk.** Low. Development tooling only, not shipped.

---

### The rest: **safe**

| Package | Change | Usage | Note |
| --- | --- | --- | --- |
| `swiper` 14.0.6 → 14.2.0 | minor | One CSS import: `import "swiper/swiper.css"` in [packages/ui/src/skiper-ui/hover-expand.tsx:7](packages/ui/src/skiper-ui/hover-expand.tsx#L7). No JS API used. | Cannot meaningfully break |
| `sonner` 2.0.7 → 2.0.8 | patch | Catalog, `@homepage/ui` | |
| `lenis` 1.3.23 → 1.3.26 | patch | `apps/web/src/app/layout.tsx` | |
| `wavesurfer.js` 7.12.8 → 7.12.12 | patch | `components/audio-wave/` | |
| `countries-list` 3.3.0 → 3.4.1 | minor | Map section | Data-only package |
| `@radix-ui/react-use-controllable-state` 1.2.4 → 1.2.6 | patch | `@homepage/ui` | |
| `webpack` 5.109.2 → 5.110.3 | patch | `apps/web` devDep, present for Storybook | |
| `turbo` 2.9.18 → 2.10.12 | minor | Root, orchestrates all tasks | |
| `@biomejs/biome` 2.5.0 → 2.5.13 | patch | Root, `bun check` | May surface new lint findings; run `bun check` after |
| `lefthook` 2.1.9 → 2.1.12 | patch | Root; hook is currently commented out in `lefthook.yml` | |
| `@types/bun` 1.3.14 → 1.4.2 | minor | Catalog | |
| `tailwindcss` + `@tailwindcss/postcss` 4.3.1 → 4.3.3 | patch | Catalog and web devDep respectively | Must move as a pair, they are separately declared but version-coupled |

---

## 4. Structural issues found while tracing usage

These are not "the version is old" problems. They came up while checking how things are imported.
No action taken on any of them.

### 4.1 `shadcn` is a production dependency that nothing imports

It appears in `dependencies` (not `devDependencies`) of both `apps/web` and `packages/ui`, at
mismatched majors (`^4.11.0` and `^3.6.2`). Grepping `apps/web/src` and `packages/ui/src` for
`from "shadcn"` returns nothing. It is the scaffolding CLI driven by `components.json`.

The cost of that placement: `shadcn` is the single largest contributor to the audit output, dragging
`hono` (10 advisories), `@hono/node-server`, `ip-address` (3), `brace-expansion` (3), `js-yaml` (4),
`browserslist` (2), `qs`, and `body-parser` into the production dependency tree for zero runtime
benefit.

**Options:**

1. Move it to `devDependencies` in both workspaces and align both on `^4.21.0`.
2. Remove it entirely and invoke it as `bunx shadcn@latest` when scaffolding. The `components.json`
   files are what actually carry the configuration; the pinned dependency adds nothing.

Option 2 is cleaner given how rarely a personal site scaffolds new components, but option 1 keeps
the version reproducible. Either way the two workspaces should stop disagreeing about the major.

### 4.2 Two copies of the same animation library

`apps/web` depends on `motion@^12.40.0`, `packages/ui` depends on `framer-motion@^12.42.2`. These are
the same library under two names, and `motion@13.2.0` lists `framer-motion: ^13.2.0` as a direct
dependency, so after the v13 bump both will be present in the bundle.

Three files use the older name:

- [packages/ui/src/skiper-ui/mouse-follow.tsx](packages/ui/src/skiper-ui/mouse-follow.tsx)
- [packages/ui/src/skiper-ui/hover-expand.tsx](packages/ui/src/skiper-ui/hover-expand.tsx)
- [packages/ui/src/skiper-ui/cutout-card.tsx](packages/ui/src/skiper-ui/cutout-card.tsx)

The migration is a rename: swap `from "framer-motion"` to `from "motion/react"`, the API surface is
identical. Then drop `framer-motion` from `packages/ui/package.json`, add `motion` to the workspace
catalog next to `react` and `lucide-react`, and point both workspaces at it.

Worth doing as part of the v13 bump rather than separately, since both touch the same files.

### 4.3 `@visx/*` is pinned to an alpha

Six packages (`curve`, `event`, `grid`, `responsive`, `scale`, `shape`) are pinned to exactly
`4.0.1-alpha.0`. Exact alpha pins are invisible to `bun outdated`, so they will never show up in a
routine sweep. They back the whole `components/charts/` subsystem and `insights-chart.tsx`.

Worth a deliberate look at whether 4.0.1 stable (or a later line) has shipped, and if so whether the
chart code still compiles against it. Not urgent, but it should be a conscious pin rather than a
forgotten one.

### 4.4 `packageManager` disagrees with the installed bun

Root `package.json` pins `bun@1.3.9`. The locally installed bun is 1.3.14. Cosmetic, but it means CI
and local development may resolve differently. Bump the pin, or don't, but pick one.

---

## 5. Suggested update order

Four batches, so that if something breaks, the cause is not buried among unrelated changes.

**Batch 1: security and tooling.** The urgent one plus everything that cannot affect rendering.

```
next  posthog-js  evlog
@biomejs/biome  turbo  lefthook  webpack  @types/bun
tailwindcss + @tailwindcss/postcss
```

Verify: `bun install && bun check-types && bun build`, then `bun audit` and confirm the critical
count drops to zero. Run `bun check` in case Biome's new version flags anything.

**Batch 2: low-risk app dependencies.**

```
motion + framer-motion (do 4.2 consolidation in the same commit)
@base-ui/react  lucide-react  zod
swiper  sonner  lenis  wavesurfer.js  countries-list
@radix-ui/react-use-controllable-state
storybook + the three addons
```

Verify: `bun check-types`, `bun dev:web`, exercise the charts section, the audio player, the map,
and the skiper-ui showpieces. Do the zod env check described above.

**Batch 3: the one that needs eyes.**

```
@once-ui-system/core
```

Its own commit. Scroll the entire page at desktop and phone widths before merging.

**Batch 4: deferred, revisit later.**

- `react` / `react-dom` / `@types/react` / `@types/react-dom`: around 2026-09-25
- `typescript` 7: once 7.1 ships the replacement compiler API
- `@types/node` major: own commit, decide 22 vs 24 first
- The four structural items in section 4

---

## Appendix: how to reproduce

```bash
bun outdated --filter='*'   # version table
bun audit                   # advisories
npm view next@16.3.4 peerDependencies dependencies --json
```
