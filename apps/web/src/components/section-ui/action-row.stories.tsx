import type { Meta, StoryObj } from "@storybook/nextjs";
import { ActionRow } from "./action-row";

const meta = {
	title: "Actions/ActionRow",
	component: ActionRow,
	parameters: {
		docs: {
			description: {
				component:
					'Calls to action are always an `ActionRow`, never a bare button. It joins `PremiumButton`s with a lowercase "or" between them, which is what makes the choice read as an offer rather than a toolbar.',
			},
		},
	},
} satisfies Meta<typeof ActionRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The about section: three ways to get in touch. */
export const ThreeOptions: Story = {
	args: {
		buttons: [
			{
				text: "Email me",
				boxColor: "bg-orange-500",
				pattern: "mail",
				href: "mailto:davidsonrafael20@gmail.com",
			},
			{
				text: "See my Kaggle",
				boxColor: "bg-teal-500",
				pattern: "globe",
				href: "https://www.kaggle.com/davidsonrafaelkn",
			},
			{
				text: "Connect on LinkedIn",
				boxColor: "bg-sky-500",
				pattern: "linkedin",
				href: "https://www.linkedin.com/in/davidson-rafael-5b2683428/",
			},
		],
	},
};

/**
 * The experience section pairs a real action with a deliberately useless one.
 * "Do nothing" is part of the site's voice, not a placeholder.
 */
export const WithAJoke: Story = {
	args: {
		buttons: [
			{
				text: "Get my Resume",
				boxColor: "bg-teal-500",
				href: "/files/Davidson_Rafael_Resume.pdf",
				download: "Davidson_Rafael_Resume.pdf",
			},
			{ text: "Do nothing", boxColor: "bg-yellow-500", pattern: "x" },
		],
	},
};

/** A project page closes with these three. */
export const OnAProjectPage: Story = {
	args: {
		buttons: [
			{
				text: "See it live",
				boxColor: "bg-teal-500",
				pattern: "globe",
				href: "https://u-reserve.vercel.app",
			},
			{
				text: "Read the code",
				boxColor: "bg-indigo-500",
				pattern: "repository",
				href: "https://github.com/DavidsonRafaelK/U-Reserve",
			},
			{
				text: "All projects",
				boxColor: "bg-orange-500",
				pattern: "arrow",
				href: "/projects",
			},
		],
	},
};

/** A single button still goes through ActionRow. No "or" is rendered. */
export const SingleButton: Story = {
	args: {
		buttons: [
			{
				text: "Back home",
				boxColor: "bg-rose-500",
				pattern: "arrow",
				href: "/",
			},
		],
	},
};
