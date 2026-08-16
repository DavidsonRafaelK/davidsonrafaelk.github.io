import type { Decorator, Meta, StoryObj } from "@storybook/nextjs";
import { GitHubCalendar } from "./github-calendar";

/**
 * Deterministic contribution history for a full year, weighted so weekdays are
 * busier than weekends. Keeps the stories identical on every reload and stops
 * Storybook depending on a third-party API.
 */
function mockContributions() {
	const end = Date.UTC(2026, 7, 16);
	return Array.from({ length: 371 }, (_, i) => {
		const day = new Date(end - (370 - i) * 86_400_000);
		const weekday = day.getUTCDay();
		const weekend = weekday === 0 || weekday === 6;
		const wave = Math.sin(i / 27) * 3 + Math.sin(i / 6) * 2;
		const raw = Math.round(3 + wave - (weekend ? 3 : 0) + ((i * 7) % 4) - 1);
		return { date: day.toISOString().slice(0, 10), count: Math.max(0, raw) };
	});
}

/** The component fetches on mount, so the stub goes in front of `fetch`. */
function withMockedContributions(fail = false): Decorator {
	return (Story) => {
		const original = globalThis.fetch;

		globalThis.fetch = (async (
			input: RequestInfo | URL,
			init?: RequestInit,
		) => {
			const url = typeof input === "string" ? input : input.toString();
			if (!url.includes("github-contributions-api"))
				return original(input, init);

			if (fail) return new Response("nope", { status: 500 });

			return new Response(
				JSON.stringify({ contributions: mockContributions() }),
				{ headers: { "Content-Type": "application/json" } },
			);
		}) as typeof fetch;

		return <Story />;
	};
}

const meta = {
	tags: ["autodocs"],
	title: "Widgets/GitHubCalendar",
	component: GitHubCalendar,
	decorators: [withMockedContributions()],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"The contribution grid in the GitHub section. It fetches a year of activity from `github-contributions-api.jogruber.de` on mount, which means it is client-only and its content never appears in the server-rendered HTML. That is fine here because it is decoration, not content that needs to be found in search.",
			},
		},
	},
	argTypes: {
		colorScheme: {
			control: "select",
			options: [
				"green",
				"blue",
				"purple",
				"orange",
				"pink",
				"dracula",
				"halloween",
			],
		},
		cellShape: {
			control: "inline-radio",
			options: ["square", "circle", "rounded"],
		},
		weekStart: { control: "inline-radio", options: ["sun", "mon"] },
		cellSize: { control: { type: "range", min: 6, max: 20, step: 1 } },
		cellGap: { control: { type: "range", min: 0, max: 8, step: 1 } },
		animate: { control: "boolean" },
	},
} satisfies Meta<typeof GitHubCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { username: "davidsonrafaelk" },
};

/** The seven colour schemes, stacked. */
export const ColorSchemes: Story = {
	args: { username: "davidsonrafaelk" },
	render: () => (
		<div className="flex flex-col gap-6">
			{(
				[
					"green",
					"blue",
					"purple",
					"orange",
					"pink",
					"dracula",
					"halloween",
				] as const
			).map((scheme) => (
				<div key={scheme}>
					<p className="mb-2 font-mono text-muted-foreground text-xs">
						{scheme}
					</p>
					<GitHubCalendar
						username="davidsonrafaelk"
						colorScheme={scheme}
						animate={false}
					/>
				</div>
			))}
		</div>
	),
};

/** Round cells, bigger grid, no chrome. */
export const CirclesWithoutLabels: Story = {
	args: {
		username: "davidsonrafaelk",
		cellShape: "circle",
		cellSize: 13,
		cellGap: 3,
		display: { monthLabels: false, dayLabels: false, yearButtons: false },
	},
};

/** Weeks starting Monday rather than Sunday. */
export const MondayStart: Story = {
	args: { username: "davidsonrafaelk", weekStart: "mon" },
};

/**
 * The API is down. The component surfaces a short message instead of an empty
 * grid, so a dead third party does not read as "no contributions".
 */
export const FetchFails: Story = {
	args: { username: "davidsonrafaelk" },
	decorators: [withMockedContributions(true)],
};
