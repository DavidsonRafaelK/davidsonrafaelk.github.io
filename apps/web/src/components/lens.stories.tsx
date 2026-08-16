import type { Meta, StoryObj } from "@storybook/nextjs";
import Image from "next/image";
import { Lens } from "./lens";

const meta = {
	tags: ["autodocs"],
	title: "Effects/Lens",
	component: Lens,
	parameters: {
		docs: {
			description: {
				component:
					"A magnifier that follows the pointer over whatever it wraps. Hover to see it. `isStatic` pins it in place, which is the only way to show it in a screenshot or to anyone on a touch device.",
			},
		},
	},
	argTypes: {
		zoomFactor: { control: { type: "range", min: 1, max: 3, step: 0.1 } },
		lensSize: { control: { type: "range", min: 60, max: 300, step: 10 } },
		isStatic: { control: "boolean" },
	},
} satisfies Meta<typeof Lens>;

export default meta;
type Story = StoryObj<typeof meta>;

const sample = (
	<Image
		src="https://i.pinimg.com/736x/1a/f9/7b/1af97bbcaba8b8ed28f2ae1137ab9793.jpg"
		alt="Sample project artwork"
		width={640}
		height={400}
		className="h-auto w-full rounded-2xl object-cover"
		unoptimized
	/>
);

export const Default: Story = {
	args: { zoomFactor: 1.5, lensSize: 170, children: sample },
};

/** Pinned, so it is visible without a pointer. */
export const Static: Story = {
	args: {
		isStatic: true,
		defaultPosition: { x: 220, y: 150 },
		zoomFactor: 1.8,
		lensSize: 180,
		children: sample,
	},
};

/** Heavier magnification, smaller aperture. */
export const TightZoom: Story = {
	args: { zoomFactor: 2.6, lensSize: 110, children: sample },
};
