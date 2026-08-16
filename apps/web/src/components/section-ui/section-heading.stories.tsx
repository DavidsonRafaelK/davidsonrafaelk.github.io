import type { Meta, StoryObj } from "@storybook/nextjs";
import { SectionHeading, SectionRoot, SectionText } from "./section-heading";

const meta = {
	title: "Section/SectionHeading",
	component: SectionHeading,
	parameters: {
		docs: {
			description: {
				component:
					"Every section heading on the site is this component. It renders a two-tone `h2`: `before` in `text-foreground`, `highlight` in `text-muted-foreground`. House rule is that the highlight half ends in a period, which is what gives the page its rhythm.",
			},
		},
	},
	argTypes: {
		before: { control: "text", description: "Plain half, full contrast." },
		highlight: {
			control: "text",
			description: "Muted half. Ends in a period.",
		},
	},
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { before: "Featured", highlight: "projects." },
};

/** Without a highlight the heading loses its two-tone read. Avoid in practice. */
export const WithoutHighlight: Story = {
	args: { before: "Featured projects." },
};

/** The four headings the live site ships, so the pattern is visible at a glance. */
export const AsUsedOnTheSite: Story = {
	args: { before: "Featured", highlight: "projects." },
	render: () => (
		<div className="flex flex-col gap-6">
			<SectionHeading before="A little about" highlight="me." />
			<SectionHeading before="Skills &" highlight="stacks." />
			<SectionHeading before="Work and" highlight="Education." />
			<SectionHeading before="Selected" highlight="projects." />
		</div>
	),
};

/** Heading, intro, content: the opening beats of every section. */
export const InsideASection: Story = {
	args: { before: "Selected", highlight: "projects." },
	render: (args) => (
		<SectionRoot id="demo">
			<SectionHeading {...args} />
			<SectionText>
				Longer write-ups of what I've built. What the problem actually was, and
				what I got wrong.
			</SectionText>
		</SectionRoot>
	),
};
