/**
 * Client-safe entry point. `getInsightsData` is deliberately absent: it reaches
 * for `@homepage/env/server`, so re-exporting it here would drag server-only
 * env validation into every client bundle that imports a hook. Server callers
 * import it from `./hydrate` directly.
 */
export { fetchInsights } from "./fetch-insights";
export type { InsightsDay, InsightsResponse } from "./types";
export { useInsightsData } from "./use-insights-data";
