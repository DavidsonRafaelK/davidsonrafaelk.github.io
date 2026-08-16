import type { InsightsDay } from "@/data/insights/types";

/**
 * Deterministic sample traffic, used by stories so the charts render the same
 * shape on every reload and never depend on the network.
 */
export function mockInsights(days = 30): InsightsDay[] {
	const start = Date.UTC(2026, 6, 18);

	return Array.from({ length: days }, (_, i) => {
		const wave = Math.sin(i / 3.5) * 18 + Math.sin(i / 11) * 26;
		const views = Math.max(6, Math.round(52 + wave + (i % 5) * 3));
		const visitors = Math.max(3, Math.round(views * 0.42));

		return {
			date: new Date(start + i * 86_400_000).toISOString().slice(0, 10),
			views,
			visitors,
			sessions: Math.max(visitors, views - 4),
		};
	});
}

export function mockChartData(days = 30) {
	return mockInsights(days).map((d) => ({
		date: new Date(d.date),
		views: d.views,
		visitors: d.visitors,
		sessions: d.sessions,
	}));
}
