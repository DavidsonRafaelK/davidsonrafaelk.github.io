# Bug report

Review date: 2026-09-11. Scope: `apps/web/src`, `packages/ui`, `packages/env`, `scripts/`.
Method: manual read of every non-generated source file, plus `bun check-types` (clean) and `biome check` (no correctness errors beyond unused imports).

Findings are ordered by severity. Purely stylistic issues (unused imports, formatting, naming) are left out except where they point at dead behaviour.

---

## Critical

### C1. The first `$pageview` of every page load is dropped

**File:** [apps/web/src/components/analytics/posthog-provider.tsx](apps/web/src/components/analytics/posthog-provider.tsx#L12-L49)

```tsx
function PageViewTracker() {
  // ...
  useEffect(() => {
    posthog.capture("$pageview", { $current_url: pageUrl });
  }, [pageUrl]);
  return null;
}

export function PostHogProvider({ children }) {
  useEffect(() => {
    // ... posthog.init(posthogKey, { api_host: "/a", capture_pageview: false })
  }, []);

  return (
    <>
      <Suspense fallback={null}><PageViewTracker /></Suspense>
      {children}
    </>
  );
}
```

**Why it is a bug:** React runs child effects before parent effects. `PageViewTracker` is a child of `PostHogProvider`, so its `posthog.capture()` call runs *before* `posthog.init()` in the parent. posthog-js does not queue events on the uninitialised default instance; `capture` logs an uninitialised warning and returns without sending anything. Because `capture_pageview: false` disables the library's own automatic pageview, nothing re-sends it.

**Impact:** Every fresh page load loses its pageview. Only client-side route changes after mount are recorded. This is the exact data the Insights section reads back through `/api/insights`, so the chart systematically undercounts, which is very likely why `getInsightsData()` needs a synthetic fallback when it sees fewer than 25 distinct days.

**Fix:** Initialise PostHog before any capture can run. Either move `posthog.init()` into a module-level guard that runs on import of the client module, or have `PostHogProvider` hold an `isInitialized` state and render `<PageViewTracker />` only once init has completed. A `useRef` + `useState` pair is enough:

```tsx
const [ready, setReady] = useState(false);
useEffect(() => { /* init */ setReady(true); }, []);
return <>{ready && <Suspense fallback={null}><PageViewTracker /></Suspense>}{children}</>;
```

---

### C2. `/api/insights` is an unauthenticated, uncached amplifier in front of PostHog

**Files:** [apps/web/src/app/api/insights/route.ts](apps/web/src/app/api/insights/route.ts), [apps/web/src/data/insights/api.ts](apps/web/src/data/insights/api.ts#L14-L41), [apps/web/src/data/insights/use-insights-data.ts](apps/web/src/data/insights/use-insights-data.ts#L15), [apps/web/src/components/use-todays-visitors.ts](apps/web/src/components/use-todays-visitors.ts#L11)

```ts
export const dynamic = "force-dynamic";
// ... headers: { "Cache-Control": "no-store, max-age=0" }
```

```ts
let url: string | null = `${baseUrl}?event=$pageview&after=${since}&limit=10000`;
while (url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY ?? ""}` } });
  // ...
  allEvents.push(...results);
  url = json.next ?? null;
  if (url) url = `${url}&limit=10000`;
}
```

**Why it is a bug:** four problems compound.

1. The route is public, uncached (`force-dynamic` + `no-store`) and does no rate limiting, so each anonymous request triggers a full paginated crawl of 30 days of PostHog events using the owner's *personal* API key.
2. Two independent client hooks (`useInsightsData` for the chart, `useInsightsTotal` for the cursor badge) each fetch `/api/insights?t=${Date.now()}` on every mount, so one page view costs two full crawls.
3. The pagination loop has no page cap, no total-events cap and no loop guard. If PostHog ever returns a `next` that equals the current URL, or simply a very long chain, the function accumulates every event in memory until the 300s function timeout.
4. `json.next` already carries its own query string, and `&limit=10000` is appended to it on every iteration, producing duplicated query parameters on the follow-up requests.

**Impact:** Trivially abusable cost and rate-limit amplification against the PostHog account. Even with normal traffic, every visitor pays two cold PostHog crawls of latency. A pathological `next` chain hangs the function and can OOM it.

**Fix:** Cache the result server-side (`revalidate` on a tag, Next `unstable_cache`/`use cache`, or a short `s-maxage` with `stale-while-revalidate`) and serve every visitor from that cache rather than hitting PostHog per request. Deduplicate the two client hooks onto one shared fetch (a context or a SWR-style shared key) so a page load makes one request. Add a page cap and a total-events cap to the `while` loop, and stop appending `&limit` to the server-provided `next` URL. Read the key through `@homepage/env/server` so a missing key fails loudly instead of sending `Bearer `.

---

## High

### H1. `CrowdCanvas` leaks a GSAP ticker callback on every unmount or `src` change

**File:** [packages/ui/src/skiper-ui/crowd-canvas.tsx](packages/ui/src/skiper-ui/crowd-canvas.tsx#L280-L298)

```ts
const init = () => {
  createPeeps();
  resize();
  gsap.ticker.add(render);
};

img.onload = init;
img.src = config.src;

return () => {
  window.removeEventListener("resize", handleResize);
  gsap.ticker.remove(render);
  crowd.forEach((peep) => { if (peep.walk) peep.walk.kill(); });
};
```

**Why it is a bug:** the cleanup removes `render` from the ticker, but it never cancels the pending image load. If the component unmounts (or `src`/`rows`/`cols` change) while `all-peeps.png` is still downloading, `img.onload` fires afterwards and calls `init()`, which re-adds `render` to the GSAP ticker. That callback is now unreachable by any cleanup and runs forever, drawing into a detached canvas, and it keeps every `Peep`, its GSAP timelines and the image alive.

Note that the canvas is mounted behind an IntersectionObserver in [lazy-crowd-canvas.tsx](apps/web/src/components/lazy-crowd-canvas.tsx), so the load and the scroll-away race is realistic on slow connections.

**Impact:** permanent per-frame CPU burn and a memory leak that survives client-side navigation. Repeated occurrences stack.

**Fix:** guard the load with a cancellation flag and detach the handler in cleanup:

```ts
let cancelled = false;
img.onload = () => { if (!cancelled) init(); };
// cleanup:
cancelled = true;
img.onload = null;
gsap.ticker.remove(render);
```

Also kill the timelines of peeps parked in `availablePeeps`, not only those currently in `crowd`.

---

### H2. Spotify route crashes on a partial response and leaks configuration detail

**File:** [apps/web/src/app/api/spotify/recently-played/route.ts](apps/web/src/app/api/spotify/recently-played/route.ts)

```ts
const recentlyPlayedData = await res.json();
let tracks: TrackData[] = recentlyPlayedData.items.map((item) => ({ /* ... */ }));
```

```ts
} catch (err) {
  const status = err instanceof SpotifyAuthError ? err.status : 500;
  return NextResponse.json({ error: String(err) }, { status });
}
```

**Why it is a bug:** three distinct issues in one handler.

1. `recentlyPlayedData.items` is dereferenced without a guard. Spotify returns `200` with no `items` array in several shapes (empty history, scope changes, partial outage), so `.map` throws a `TypeError` and the whole route answers `500`. The same applies to `item.track.album.images`, which is only index-guarded, not null-guarded.
2. `String(err)` is returned verbatim to the client. For the credential path that string is `Error: Missing Spotify credentials — check SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN in .env`, which tells an anonymous caller exactly how the deployment is wired. For unexpected errors it can leak stack-adjacent detail.
3. The `if (!tokenRes.ok)` block is duplicated at lines 38-43 and 46-51. The second copy is unreachable, so the branch that was meant to surface Spotify's `error_description` never runs and callers always get the generic `"Failed to fetch Spotify token"`.

Separately, this endpoint has no caller anywhere in `apps/web/src` (verified by grep). It is a public, unauthenticated `POST` that spends the owner's refresh token on every call.

**Impact:** avoidable `500`s on a normal Spotify response, information disclosure, and a dead public endpoint anyone can use to burn the account's token-refresh and API quota.

**Fix:** validate the payload (`Array.isArray(recentlyPlayedData.items)`) and fall back to an empty list; delete the unreachable duplicate `!tokenRes.ok` block and keep the informative one; return a fixed generic message to the client and `console.error` the real one; and either delete the route or put it behind the same caching/authorisation treatment as C2 if it is meant to come back.

---

### H3. The site header renders a build-time date and mismatches on hydration

**Files:** [apps/web/src/lib/get-date.ts](apps/web/src/lib/get-date.ts), [apps/web/src/components/sections/site-header.tsx](apps/web/src/components/sections/site-header.tsx#L58)

```ts
export function getDate() {
  const date = new Date();
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${monthName} ${date.getDate()}`;
}
```

**Why it is a bug:** `SiteHeader` is a client component, but `/` has no dynamic marker so it is statically prerendered. `getDate()` therefore runs once at build time on a UTC machine and that string is baked into the HTML under the "Today" label. On the client it runs again with the visitor's clock and locale. Two consequences: the prerendered text is stale until the next deploy, and server and client output differ, which is a hydration mismatch (silently repaired by React with a console error, or visible as a flash).

**Impact:** the header reliably shows the wrong day for any visitor after the deploy date, and produces hydration warnings.

**Fix:** compute the date after mount so there is only ever one source of truth. Render a stable placeholder (or nothing) on the server and set the date in a `useEffect`, or make the value a `useState` initialised in an effect. If the date must appear in the prerendered HTML, the page needs to opt out of full static generation and revalidate daily.

---

## Medium

### M1. `useGitHubContributions` re-fetches whenever the caller re-renders

**File:** [apps/web/src/components/github-calendar.tsx](apps/web/src/components/github-calendar.tsx#L119-L177)

```ts
useEffect(() => {
  // ... fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
}, [username, showYearButtons, onDataLoaded]);
```

**Why it is a bug:** `onDataLoaded` is a public prop of `GitHubCalendar` and is in the effect's dependency array without being stabilised. Any caller that passes an inline arrow function (the normal way to use a callback prop) gets a new identity on every render, so the effect tears down and refires the fetch on every render. The effect itself calls `onDataLoaded(sorted)`, which typically sets state in the parent, which re-renders, which produces a new callback identity: an unbounded fetch loop against a third-party API.

The site's own usage in [github-section.tsx](apps/web/src/components/sections/github-section.tsx#L32-L40) does not pass `onDataLoaded`, so the bug is latent today, but it is a trap for the next caller and for the Storybook stories.

**Impact:** unbounded network loop and re-render loop for any consumer using the documented callback prop.

**Fix:** keep the callback in a ref (`onDataLoadedRef.current = onDataLoaded` in its own effect, call `onDataLoadedRef.current?.(sorted)` inside the fetch) and drop it from the dependency array.

### M2. Calendar tooltip is offset by the label gutters it already accounts for

**Files:** [apps/web/src/components/github-calendar.tsx](apps/web/src/components/github-calendar.tsx#L307-L321), [apps/web/src/components/calendar-grid.tsx](apps/web/src/components/calendar-grid.tsx#L219-L224)

```ts
// github-calendar.tsx : coordinates are already relative to the container
const rect = e.currentTarget.getBoundingClientRect();
const cRect = containerRef.current.getBoundingClientRect();
setTooltip({ x: rect.left - cRect.left + cellSize / 2, y: rect.top - cRect.top, ... });
```

```tsx
// calendar-grid.tsx : the same offsets are added a second time
style={{ left: tooltip.x + LEFT, top: tooltip.y + TOP - 44 }}
```

**Why it is a bug:** `containerRef` is attached to the outer wrapper in `CalendarGrid`, and the cell grid sits inside it at `left: LEFT, top: TOP`. The measured `rect.left - cRect.left` therefore already includes `LEFT`, and `rect.top - cRect.top` already includes `TOP`. Adding them again double-counts both gutters.

**Impact:** with the current props (`dayLabels: true`, month labels on) the tooltip renders 32px too far right and 22px too low relative to the hovered cell, so on the rightmost weeks it can be pushed outside the card.

**Fix:** drop `+ LEFT` and `+ TOP` from the tooltip style and keep only the `- 44` vertical lift, since `tooltip.x`/`tooltip.y` are already container-relative.

### M3. Insights day buckets mix local dates with UTC keys

**Files:** [apps/web/src/data/insights/hydrate.ts](apps/web/src/data/insights/hydrate.ts#L40-L97), [apps/web/src/components/insights-chart.tsx](apps/web/src/components/insights-chart.tsx#L15-L20)

```ts
const todayKey = new Date().toISOString().slice(0, 10);
// ...
for (let i = INSIGHTS_DAYS - 1; i >= 0; i--) {
  const d = new Date(today);
  d.setDate(d.getDate() - i);      // local-time arithmetic
  const key = d.toISOString().slice(0, 10);  // UTC calendar date
```

**Why it is a bug:** `setDate`/`getDate` operate on local wall-clock time while `toISOString()` reports the UTC date. In any runtime east of UTC the two disagree for part of the day. Verified with `TZ=Asia/Jakarta`: at 03:00 local on 2026-09-11 the generated "today" key is `2026-09-10`, so the entire 30-day window is shifted one day back and the real current day never gets a bucket. PostHog timestamps are UTC, so the events land in keys the loop never asks for.

The client side has the mirror problem: `new Date(d.date)` in `insights-chart.tsx` parses `"YYYY-MM-DD"` as UTC midnight, and the x-axis then formats it in the viewer's local zone, so visitors in negative-offset zones see every point labelled with the previous day.

**Impact:** on Vercel (UTC) the server side happens to line up, so this hides in production and bites in local development and any non-UTC runtime. The client-side label shift affects real visitors in the Americas regardless of where the server runs.

**Fix:** build the keys in UTC on both sides. Use `Date.UTC(...)` / `setUTCDate` for the bucket loop, and on the client parse with an explicit local construction (`new Date(y, m - 1, d)` from the split string) so the label matches the bucket it came from.

### M4. `ImageTrail` crashes when the container is missing or has no items

**File:** [apps/web/src/components/image-trail.tsx](apps/web/src/components/image-trail.tsx#L121-L207)

```ts
useEffect(() => {
  allImages.current = containerRef?.current?.querySelectorAll(".image-trail-item") as NodeListOf<HTMLElement>;
  zIndices.current = Array.from({ length: allImages.current.length }, (_, index) => index);
}, [containerRef]);
```

**Why it is a bug:** two unguarded paths.

1. If `containerRef.current` is null when the effect runs, the optional chain yields `undefined` and `allImages.current.length` throws a `TypeError` during the effect.
2. If the query matches nothing, `allImages.current` is an empty `NodeList`, which is truthy, so the `distance > threshold && allImages?.current` guard passes. `N` is then `0`, `allImages.current[current].style.display = "block"` throws, and `(current + 1) % 0` is `NaN`, which poisons `currentId` for every later move.

Separately, the effect depends only on `[containerRef]` (a stable ref object), so the `NodeList` is captured once. Changing `children` or `repeatChildren` afterwards leaves the trail animating a stale set of nodes.

**Impact:** a render-time crash in the section that uses the trail whenever the children are absent or arrive late, and no recovery once `currentId` is `NaN`.

**Fix:** bail out early (`if (!allImages.current?.length) return;`) both in the effect and at the top of the distance branch, and re-run the query when the child set changes (key the effect on `repeatChildren` and the children identity, or use a `MutationObserver`).

### M5. Weather route trusts the upstream payload and echoes upstream errors

**File:** [apps/web/src/app/api/weather/route.ts](apps/web/src/app/api/weather/route.ts)

```ts
return NextResponse.json({
  city: name,
  temperature: Math.round(weather.current.temperature_2m),
  high: Math.round(weather.daily.temperature_2m_max[0]),
  // ...
});
```

**Why it is a bug:** `weather.current` and `weather.daily.*` are dereferenced without a check. Open-Meteo can answer `200` with a different shape (or omit `daily` if the parameter is rejected), in which case this throws and the catch turns it into a `500`, or `Math.round(undefined)` yields `NaN`, which `JSON.stringify` silently writes as `null`. The consumer gets `{"temperature": null}` with a `200` status and no way to distinguish that from a real reading.

Two smaller issues in the same file: the error branches return the raw upstream body to the caller (`Geocoding failed: ${err}`), and the 404 branch returns `{ city }` with no `error` field, so a client checking for `error` sees a success-shaped body. There is also no `Cache-Control`, and no caller in the app, so this is another open uncached proxy.

**Impact:** `NaN`-as-null readings presented as valid, upstream error text passed through to clients, and an anonymous proxy to a third-party API.

**Fix:** validate the response (a small zod schema, or explicit `typeof x === "number"` checks) and return a `502` when the upstream shape is wrong. Return a fixed error message and log the upstream body. Add a `s-maxage` cache header since weather does not change per second.

### M6. `useTimer` ignores `resetOnLoadingChange` and cannot render its default format

**File:** [apps/web/src/components/timer.tsx](apps/web/src/components/timer.tsx#L237-L303)

```ts
export function useTimer({ loading = false, onTick, resetOnLoadingChange = true, format = "SS.MS" }) {
  // resetOnLoadingChange is never read anywhere in the hook
  // ...
  const interval = setInterval(() => { /* ... */ }, 1000);
```

**Why it is a bug:** `resetOnLoadingChange` is documented as "Whether to reset timer when loading state changes", is part of the public `UseTimerOptions` type, is forwarded by `<Timer>`, and is never read. Biome flags it as an unused parameter (`timer.tsx:240`). Callers that pass `resetOnLoadingChange={false}` get the reset anyway, because `start()` unconditionally zeroes the elapsed time.

The tick interval is `1000` ms while the default `format` is `"SS.MS"`, which displays hundredths. The hundredths digits can only ever show whatever the millisecond remainder happened to be at each whole-second sample, so the field looks frozen or jumps randomly instead of counting. The ref holding the interval id is named `rafRef` and typed `ReturnType<typeof setInterval>`, which is what led to the mismatch.

**Impact:** a public option that silently does nothing, and a default display format the tick rate cannot support.

**Fix:** either implement `resetOnLoadingChange` (skip the `setElapsedTime(0)` in `start()` when it is false) or remove it from the type and from `<Timer>`. Drive the tick from `requestAnimationFrame` when the format includes milliseconds, and keep `setInterval(…, 1000)` only for `MM:SS` / `HH:MM:SS`.

### M7. Touch handlers call `preventDefault()` on passive listeners

**File:** [apps/web/src/components/charts/hooks/use-chart-interaction.ts](apps/web/src/components/charts/hooks/use-chart-interaction.ts#L236-L298)

```ts
const handleTouchStart = (event: React.TouchEvent<SVGGElement>) => {
  if (event.touches.length === 1) {
    event.preventDefault();
```

**Why it is a bug:** React attaches `touchstart` and `touchmove` at the root as passive listeners. `preventDefault()` on the synthetic event is therefore a no-op and the browser logs "Unable to preventDefault inside passive event listener invocation" on every touch. The code relies on it to stop the page scrolling while a chart is being scrubbed or pinched.

The `touchAction: "none"` in `interactionStyle` does prevent scrolling on the element itself, so the visible symptom is limited to the console noise plus pinch gestures that still reach the browser's own zoom in some engines.

**Impact:** console spam on every touch interaction with the insights chart, and the intended gesture suppression is not actually coming from the code that appears to provide it.

**Fix:** drop the `preventDefault()` calls and rely on `touch-action: none` (already set), or register non-passive native listeners on the SVG element via a ref if the calls are genuinely needed.

### M8. One bad MDX file takes down `/projects`, the sitemap and `llms.txt`

**File:** [apps/web/src/lib/projects-content.ts](apps/web/src/lib/projects-content.ts#L36-L70)

```ts
if (!parsed.success) {
  throw new Error(`Invalid frontmatter in content/projects/${fileName}: ...`);
}
// ...
const docs = await Promise.all(pending);
```

**Why it is a bug:** the comment says frontmatter "is validated at build time so a post can never ship with an empty meta description ... it fails the build instead". That holds only while every consumer is statically prerendered. `readAllDocs` uses `Promise.all`, so a single invalid file rejects the whole batch, and `getProjects()` is called from `/projects`, `sitemap.ts` and `llms.txt/route.ts`. Any of those rendering on demand (a draft slug, a revalidation, a cache miss) turns one malformed file into a `500` for all three routes rather than one missing entry.

**Impact:** a one-character frontmatter mistake removes the entire projects index, the sitemap and `llms.txt` at once.

**Fix:** keep the strict throw for the build (it is useful), but make the batch resilient: use `Promise.allSettled`, log the rejected files, and return the valid ones. If a hard failure is preferred, add an explicit build-time validation step so the failure surfaces during `bun build` rather than at request time.

---

## Low

### L1. `fetch-jokes.ts` never checks a response before using it

**File:** [scripts/fetch-jokes.ts](scripts/fetch-jokes.ts#L11-L33)

```ts
const probe = await fetch("https://icanhazdadjoke.com/search?limit=30", { headers: { Accept: "application/json" } })
  .then((r) => r.json() as Promise<{ total_pages: number }>);
const page = 1 + Math.floor(Math.random() * probe.total_pages);
```

Neither fetch checks `res.ok`. If the probe returns an error body (rate limit, HTML error page), `probe.total_pages` is `undefined`, `Math.random() * undefined` is `NaN`, and the follow-up request is made against `?page=NaN`. `data.results.map` then throws on the error payload. The programmer-joke fetch is guarded with `?? []`, so a failure there silently produces "no new jokes" instead of a visible error.

Because this script runs on a daily cron that auto-commits, a silent failure mode is easy to miss. Add `if (!res.ok) throw new Error(...)` to both fetches and validate `total_pages` is a finite number before using it.

### L2. `check-lighthouse.mjs` assumes `run.summary` exists and reports every category

**File:** [scripts/check-lighthouse.mjs](scripts/check-lighthouse.mjs#L37-L48)

```js
const failing = Object.entries(run.summary).filter(([, score]) => score < minScore);
// ...
const lines = Object.entries(run.summary).map(([cat, score]) => `- ${cat}: ${Math.round(score * 100)}`).join("\n");
```

`run.summary` is dereferenced without a guard, so a manifest entry without it throws and the workflow step fails instead of skipping as the file header promises. And `failing` is only used for its `.length`: the issue body lists every category, which buries the regression among passing scores. Guard the property and build `lines` from `failing`.

### L3. The fallback data generator's PRNG loses precision, and its invariants are inconsistent

**File:** [apps/web/src/data/insights/hydrate.ts](apps/web/src/data/insights/hydrate.ts#L4-L35)

```ts
s = (s * 1103515245 + 12345) & 0x7fffffff;
```

With `s` near 2^31 the product exceeds 2^53, so the double loses the low bits before the mask is applied. Verified against an exact BigInt implementation: the sequences diverge from the third value onward. The output is still deterministic and adequate for placeholder bars, so this is cosmetic, but it is not the LCG it looks like. Use `Math.imul(s, 1103515245) + 12345` if the standard sequence matters.

In the same function, `visitors` is capped at `Math.min(visitors, views, sessions, 30)` while `sessions` is `Math.min(sessions, views) - 1`, so generated days can report more sessions than views minus one, and visitors are hard-capped at 30 regardless of scale. Real analytics keep `visitors <= sessions <= views`; the fallback should too, or the chart's fake days look structurally different from the real ones.

### L4. Shuffle uses a random comparator

**File:** [apps/web/src/components/project-card.tsx](apps/web/src/components/project-card.tsx#L31-L35)

```ts
setRandomProjects(projectsData.toSorted(() => Math.random() - 0.5).slice(0, 6));
```

A comparator that returns random values is not a valid ordering, so the result is biased toward the input order and the bias depends on the engine's sort implementation. Use a Fisher-Yates shuffle on a copy. (The surrounding comment about avoiding `Math.random()` during SSR is correct and worth keeping.)

### L5. Nav links to a section that no longer renders

**Files:** [apps/web/src/components/sections/site-header.tsx](apps/web/src/components/sections/site-header.tsx#L20), [apps/web/src/app/page.tsx](apps/web/src/app/page.tsx#L62-L64)

`navLinks` contains `{ label: "Awards", href: "/#awards" }`, but `<AwardsSection id="awards" />` is commented out in `page.tsx`. `scrollToHash` finds no element, returns without calling `preventDefault()`, and the click falls through to a navigation to `/#awards` that lands nowhere. Remove the entry, or restore the section.

### L6. Cursor badge is unreadable in dark mode

**File:** [apps/web/src/components/cursor-follower.tsx](apps/web/src/components/cursor-follower.tsx#L50)

```
bg-neutral-800 ... text-white ... dark:bg-neutral-100 dark:text-white
```

In dark mode the background flips to `neutral-100` while the text stays white, so the "Nth User" label disappears. Pair the dark background with a dark foreground (`dark:text-neutral-900`). The component also uses raw palette classes rather than the semantic tokens the rest of the app uses, which is what let the mismatch through.

### L7. `HoverExpand` cards are not keyboard reachable

**File:** [packages/ui/src/skiper-ui/hover-expand.tsx](packages/ui/src/skiper-ui/hover-expand.tsx#L80-L90)

```tsx
<m.div role="button" onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleActivate(); }} ...>
```

`role="button"` with an `onKeyDown` handler but no `tabIndex={0}` means the element can never receive focus, so the key handler is dead code and the gallery is mouse-only. Add `tabIndex={0}`, and call `e.preventDefault()` for the space key so activating a card does not also scroll the page.

### L8. `llms.txt` reports a "Last updated" date frozen at build time

**File:** [apps/web/src/app/llms.txt/route.ts](apps/web/src/app/llms.txt/route.ts#L50)

The handler uses no dynamic APIs, so Next prerenders it and `new Date().toISOString()` is evaluated once during the build. The served file then advertises a `Last updated` date that stops moving until the next deploy. `sitemap.ts` documents this behaviour deliberately for `lastModified`; here it is unintentional and the value claims more freshness than it has. Either derive the date from the newest project's `updatedAt`, or opt the route into revalidation.

### L9. `Lens` throws during render on invalid props and leaks a pending frame

**File:** [apps/web/src/components/lens.tsx](apps/web/src/components/lens.tsx#L49-L80)

```tsx
if (zoomFactor < 1) throw new Error("zoomFactor must be greater than 1");
```

Throwing during render escalates a prop mistake into a client-side crash of the whole subtree (there is no error boundary around it). Clamp the values instead, or validate at the type level. Additionally, `rafRef` is never cancelled on unmount, so a frame scheduled by `handleMouseMove` can call `setMousePosition` after the component is gone.

### L10. `WavePlayer` can display a negative remaining time

**File:** [apps/web/src/components/audio-wave/wave-player.tsx](apps/web/src/components/audio-wave/wave-player.tsx#L45-L49)

```ts
function formatTime(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
// ...
{formatTime(duration - currentTime)}
```

`currentTime` is sampled at most every 250 ms and wavesurfer's `getCurrentTime()` can slightly exceed `getDuration()` at the end of playback, so `duration - currentTime` goes marginally negative and renders as `-1:-1`. Clamp with `Math.max(0, duration - currentTime)`.

### L11. Chart phase machine has no timeout on its animation handshake

**File:** [apps/web/src/components/charts/hooks/use-chart-phase-orchestrator.ts](apps/web/src/components/charts/hooks/use-chart-phase-orchestrator.ts#L38-L72)

A `loading -> ready` transition with `animationDuration > 0` parks the chart in the `exiting` phase and waits for `notifyLoadingPulseComplete()` to be called by the loading-pulse renderer. Nothing else advances it: unlike the `revealing` phase (which has a `setTimeout` fallback at line 175), `exiting` and `exitingReady` have no timer. If the pulse component is not mounted, is unmounted mid-animation, or its completion callback does not fire (reduced motion, a `motion` version change), the chart stays in a loading phase forever with data already loaded.

This is defensive rather than a confirmed live failure, but the asymmetry with the `revealing` phase is worth closing: add a `setTimeout` fallback of `animationDuration` for the handshake phases so the state machine always makes progress.

---

## Notes that are not bugs but are worth knowing

- **Direct `process.env` reads in API routes.** `apps/web/src/app/api/spotify/recently-played/route.ts` and `apps/web/src/data/insights/api.ts` read `process.env.*` directly, while `CLAUDE.md` states env vars must go through `@homepage/env/server`. `packages/env/src/server.ts` already declares all five of these vars as required, so routing through it would turn today's silent `Bearer ` / `undefined` in a URL into a startup-time failure. This is the root cause of the "missing credentials" leakage in H2.
- **Two dead API routes.** Neither `/api/spotify/recently-played` nor `/api/weather` is called from anywhere in `apps/web/src`. Deleting them removes the whole class of issues in H2 and M5.
- **Unused exports flagged by Biome** (`decimateOhlcData`, `buildYScalesForLines`, `wrapSingleYScale`, `mergeYDomainRecords`, and unused imports in a dozen files) are dead code rather than defects, but `decimateOhlcData` and `buildYScalesForLines` are non-trivial implementations that no longer have a caller and will rot.
- **`bun check-types` passes and Biome reports no correctness errors** beyond unused imports, so none of the above is visible to the current tooling.
