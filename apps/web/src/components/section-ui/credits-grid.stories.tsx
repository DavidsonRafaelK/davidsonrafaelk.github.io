import type { Meta, StoryObj } from "@storybook/nextjs";
import { CreditsGrid } from "./credits-grid";

const meta = {
	tags: ["autodocs"],
	title: "Lists/CreditsGrid",
	component: CreditsGrid,
	parameters: {
		docs: {
			description: {
				component:
					"The footer credits, rendered as a two-column Once UI `Grid`. The list is hardcoded inside the component rather than sitting in `content/`, which is deliberate: it changes when the stack changes, not when the copy does. An entry with an empty label continues the group above it, so a heading is written once and its items follow underneath.",
			},
		},
	},
} satisfies Meta<typeof CreditsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
