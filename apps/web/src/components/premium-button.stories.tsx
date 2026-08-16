import type { Meta, StoryObj } from "@storybook/nextjs";
import PremiumButton from "./premium-button";

const patterns = [
	"arrow",
	"x",
	"mail",
	"linkedin",
	"repository",
	"globe",
] as const;

const boxColors = [
	"bg-orange-500",
	"bg-teal-500",
	"bg-sky-500",
	"bg-rose-500",
	"bg-indigo-500",
	"bg-yellow-500",
];

const meta = {
	title: "Actions/PremiumButton",
	component: PremiumButton,
	parameters: {
		docs: {
			description: {
				component:
					"The only button on the site. 44px tall, `rounded-[8px]`, scales on hover, and carries an animated pixel-grid icon whose colour comes from `boxColor`. Same-origin `href` values stay in the tab; external ones open a new one. In practice never used bare, always through `ActionRow`.",
			},
		},
	},
	argTypes: {
		pattern: { control: "select", options: patterns },
		boxColor: { control: "select", options: boxColors },
		href: { control: "text" },
		text: { control: "text" },
	},
} satisfies Meta<typeof PremiumButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { text: "Get my Resume", boxColor: "bg-teal-500", pattern: "arrow" },
};

/** All six pixel-grid patterns. Each one animates on its own loop. */
export const Patterns: Story = {
	args: { text: "Pattern" },
	render: () => (
		<div className="flex flex-wrap gap-3">
			{patterns.map((pattern, i) => (
				<PremiumButton
					key={pattern}
					text={pattern}
					pattern={pattern}
					boxColor={boxColors[i % boxColors.length]}
				/>
			))}
		</div>
	),
};

/**
 * Sections pick distinct hues so no two adjacent action rows repeat a colour.
 * These are the six in use.
 */
export const BoxColors: Story = {
	args: { text: "Colour" },
	render: () => (
		<div className="flex flex-wrap gap-3">
			{boxColors.map((color) => (
				<PremiumButton
					key={color}
					text={color.replace("bg-", "").replace("-500", "")}
					boxColor={color}
					pattern="arrow"
				/>
			))}
		</div>
	),
};

/** An internal link renders without `target="_blank"`, an external one with it. */
export const LinkBehaviour: Story = {
	args: {
		text: "Link",
		pattern: "mail",
		boxColor: "bg-sky-500",
	},
	render: () => (
		<div className="flex flex-wrap gap-3">
			<PremiumButton
				text="All projects (internal)"
				href="/projects"
				boxColor="bg-orange-500"
				pattern="arrow"
			/>
			<PremiumButton
				text="View on Github (external)"
				href="https://github.com/davidsonrafaelk"
				boxColor="bg-indigo-500"
				pattern="repository"
			/>
		</div>
	),
};
