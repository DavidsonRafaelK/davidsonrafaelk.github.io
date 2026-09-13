import { NextResponse } from "next/server";
import { getInsightsData } from "@/data/insights/hydrate";

/**
 * The handler stays dynamic so the PostHog crawl never runs at build time. The
 * crawl itself is cached in `getInsightsData`, and these headers let the CDN
 * absorb repeat anonymous hits before they reach the function at all.
 */
export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const result = await getInsightsData();
		return NextResponse.json(result, {
			headers: {
				"Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
			},
		});
	} catch (err) {
		console.error("insights fetch failed", err);
		return NextResponse.json(
			{ error: "Failed to fetch insights" },
			{ status: 500 },
		);
	}
}
