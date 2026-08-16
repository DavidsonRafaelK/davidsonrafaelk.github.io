import type { Meta, StoryObj } from "@storybook/nextjs";
import { DottedMap } from "./dotted-map";

const jakarta = { lat: -6.2088, lng: 106.8456, size: 1 };

const meta = {
	tags: ["autodocs"],
	title: "Widgets/DottedMap",
	component: DottedMap,
	parameters: {
		docs: {
			description: {
				component:
					"A world map drawn as a dot grid, cropped to a region and marked with a pulsing point. The homepage uses it for one thing only: saying where I am. `mapSamples` controls dot density and is the knob that decides whether it reads as a map or as noise.",
			},
		},
	},
	argTypes: {
		mapSamples: {
			control: { type: "range", min: 2000, max: 20000, step: 1000 },
		},
		dotRadius: { control: { type: "range", min: 0.05, max: 0.5, step: 0.01 } },
		pulse: { control: "boolean" },
	},
} satisfies Meta<typeof DottedMap>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The homepage settings: Southeast Asia, one marker on Jakarta. */
export const Default: Story = {
	args: {
		width: 150,
		height: 94,
		mapSamples: 10000,
		dotRadius: 0.12,
		pulse: true,
		region: { lat: { min: -30, max: 30 }, lng: { min: 57, max: 157 } },
		markers: [jakarta],
	},
};

/** Fewer samples. Cheaper to render, and it stops looking like a coastline. */
export const LowDensity: Story = {
	args: {
		...Default.args,
		mapSamples: 3000,
		dotRadius: 0.2,
	},
};

/** No region crop, so the whole world is in frame. */
export const Worldwide: Story = {
	args: {
		width: 200,
		height: 100,
		mapSamples: 12000,
		dotRadius: 0.12,
		markers: [jakarta],
	},
};
