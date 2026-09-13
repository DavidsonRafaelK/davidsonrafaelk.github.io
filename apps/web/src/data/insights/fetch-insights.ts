"use client";

import type { InsightsDay, InsightsResponse } from "./types";

/**
 * The chart and the cursor badge both want this payload and both mount on the
 * same page, so their effects fire in the same commit. Sharing the in-flight
 * promise collapses that into one request instead of two.
 *
 * The handle is cleared once the request settles rather than kept as a result
 * cache: repeat visits should still see fresh numbers, and the expensive half
 * (the PostHog crawl) is already cached server-side in `getInsightsData`.
 */
let inflight: Promise<InsightsDay[]> | null = null;

export function fetchInsights(): Promise<InsightsDay[]> {
	if (inflight) return inflight;

	const request = fetch("/api/insights")
		.then(async (r) => {
			if (!r.ok) throw new Error(`HTTP ${r.status}`);
			const body: InsightsResponse | InsightsDay[] = await r.json();
			return Array.isArray(body) ? body : (body.data ?? []);
		})
		.finally(() => {
			if (inflight === request) inflight = null;
		});

	inflight = request;
	return request;
}
