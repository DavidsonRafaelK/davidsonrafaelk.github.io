import { env } from "@homepage/env/server";

const INSIGHTS_DAYS = 30;

/**
 * Bounds on the pagination crawl. PostHog decides how many pages a window of
 * events spans, so the loop needs its own ceiling: without one a long `next`
 * chain accumulates events until the function times out or runs out of memory.
 */
const EVENTS_PER_PAGE = 10000;
const MAX_PAGES = 10;
const MAX_EVENTS = 100000;

async function queryPosthogEvents() {
	const baseUrl = `https://app.posthog.com/api/projects/${env.POSTHOG_PROJECT_ID}/events/`;
	const since = new Date(Date.now() - INSIGHTS_DAYS * 24 * 60 * 60 * 1000)
		.toISOString()
		.slice(0, 10);

	const allEvents: Array<{
		timestamp: string;
		distinct_id: string;
		properties: Record<string, unknown>;
	}> = [];
	let url: string | null =
		`${baseUrl}?event=$pageview&after=${since}&limit=${EVENTS_PER_PAGE}`;

	const visited = new Set<string>();
	let pages = 0;

	while (url && pages < MAX_PAGES && allEvents.length < MAX_EVENTS) {
		// A `next` that points back at a URL already fetched would otherwise spin
		// forever while the page and event caps never advance.
		if (visited.has(url)) break;
		visited.add(url);
		pages += 1;

		const res: Response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${env.POSTHOG_PERSONAL_API_KEY}`,
			},
			cache: "no-store",
		});
		if (!res.ok) {
			throw new Error(`PostHog API error: ${res.status}`);
		}
		const json: {
			results?: Array<{
				timestamp: string;
				distinct_id: string;
				properties: Record<string, unknown>;
			}>;
			next?: string | null;
		} = await res.json();
		allEvents.push(...(json.results ?? []));

		// `next` already carries its own query string, limit included. Appending
		// to it duplicates parameters on every hop.
		url = json.next ?? null;
	}

	return allEvents.length > MAX_EVENTS
		? allEvents.slice(0, MAX_EVENTS)
		: allEvents;
}

export { INSIGHTS_DAYS, MAX_EVENTS, MAX_PAGES, queryPosthogEvents };
