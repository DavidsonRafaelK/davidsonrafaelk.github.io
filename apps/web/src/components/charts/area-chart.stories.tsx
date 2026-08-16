import type { Meta, StoryObj } from "@storybook/nextjs";
import { curveNatural } from "@visx/curve";
import AreaChart, { Area } from "./area-chart";
import { mockChartData } from "./mock-insights";
import Grid from "./renderers/grid";
import XAxis from "./renderers/x-axis";
import { YAxis } from "./renderers/y-axis";
import { ChartTooltip } from "./tooltip/chart-tooltip";

const data = mockChartData();

const meta = {
	tags: ["autodocs"],
	title: "Charts/AreaChart",
	component: AreaChart,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"The chart engine behind the insights section, built on visx. It is compositional: `AreaChart` owns the scales, the reveal animation and the loading phase, and everything visible is a child (`Grid`, `Area`, `XAxis`, `YAxis`, `ChartTooltip`). Stories here feed it static data so the shape never changes between reloads.",
			},
		},
	},
	argTypes: {
		status: { control: "inline-radio", options: ["loading", "ready"] },
		animationDuration: {
			control: { type: "range", min: 0, max: 3000, step: 100 },
		},
		aspectRatio: { control: "text" },
	},
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two series, the same configuration the insights section ships. */
export const Default: Story = {
	args: {
		data,
		status: "ready",
		yDomainTween: true,
		animationDuration: 1100,
		children: null,
	},
	render: (args) => (
		<AreaChart {...args}>
			<Grid horizontal stroke="var(--chart-grid)" />
			<Area
				dataKey="views"
				curve={curveNatural}
				fill="var(--chart-1)"
				fillOpacity={0.3}
				strokeWidth={2}
				fadeEdges
				gradientToOpacity={0}
				showLine
				showHighlight
			/>
			<Area
				dataKey="visitors"
				curve={curveNatural}
				fill="var(--chart-2)"
				fillOpacity={0.3}
				strokeWidth={2}
				fadeEdges
				gradientToOpacity={0}
				showLine
			/>
			<XAxis />
			<YAxis />
			<ChartTooltip />
		</AreaChart>
	),
};

/**
 * The loading phase is a first-class state rather than a spinner swapped in.
 * The grid shimmers, the line draws in a neutral stroke, and the y-domain
 * tweens into place once real data lands.
 */
export const Loading: Story = {
	...Default,
	args: {
		...Default.args,
		status: "loading",
		loadingLabel: "Loading insights…",
	},
};

/** One series, no axes. What a sparkline-style embed would look like. */
export const Minimal: Story = {
	args: { data, status: "ready", aspectRatio: "4 / 1", children: null },
	render: (args) => (
		<AreaChart {...args}>
			<Area
				dataKey="views"
				curve={curveNatural}
				fill="var(--chart-1)"
				fillOpacity={0.25}
				strokeWidth={2}
				fadeEdges
				gradientToOpacity={0}
				showLine
			/>
		</AreaChart>
	),
};

/** A week instead of a month, to check axis labels when points are sparse. */
export const ShortRange: Story = {
	...Default,
	args: { ...Default.args, data: mockChartData(7) },
};
