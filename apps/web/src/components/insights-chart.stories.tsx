import type { Decorator, Meta, StoryObj } from "@storybook/nextjs";
import { mockInsights } from "@/components/charts/mock-insights";
import { ViewChart } from "./insights-chart";

/**
 * `ViewChart` calls `/api/insights`, which does not exist in Storybook. Stubbing
 * `fetch` keeps the component untouched while making the story deterministic and
 * offline-safe.
 */
function withMockedInsights(delayMs = 0, fail = false): Decorator {
	return (Story) => {
		const original = globalThis.fetch;

		globalThis.fetch = (async (
			input: RequestInfo | URL,
			init?: RequestInit,
		) => {
			const url = typeof input === "string" ? input : input.toString();

			if (!url.includes("/api/insights")) return original(input, init);

			if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
			if (fail) throw new Error("insights unavailable");

			return new Response(
				JSON.stringify({ data: mockInsights(), meta: { isFallback: false } }),
				{ headers: { "Content-Type": "application/json" } },
			);
		}) as typeof fetch;

		return <Story />;
	};
}

const meta = {
	tags: ["autodocs"],
	title: "Charts/InsightsChart",
	component: ViewChart,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"The insights section's chart. It is a thin wrapper: `useInsightsData` fetches from `/api/insights`, which proxies PostHog server-side so the personal API key never reaches the browser, and everything visual comes from the `AreaChart` primitives. Because the component owns its own fetch, these stories stub `fetch` rather than pass props.",
			},
		},
	},
} satisfies Meta<typeof ViewChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Data resolves immediately. */
export const Ready: Story = {
	decorators: [withMockedInsights()],
};

/**
 * A slow response, so the loading phase is visible for two seconds before the
 * y-domain tweens into the real range.
 */
export const SlowResponse: Story = {
	decorators: [withMockedInsights(2000)],
};

/**
 * The request fails. The hook leaves the chart in its loading phase rather than
 * showing an error, which is a deliberate choice for a decorative section: a
 * broken analytics widget should not shout at a visitor.
 */
export const RequestFails: Story = {
	decorators: [withMockedInsights(0, true)],
};
