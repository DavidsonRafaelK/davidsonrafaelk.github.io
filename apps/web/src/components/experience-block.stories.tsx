import type { Meta, StoryObj } from "@storybook/nextjs";
import { education, experiences } from "@/content/experiences";
import { ExperienceBlock } from "./experience-block";

const meta = {
	tags: ["autodocs"],
	title: "Lists/ExperienceBlock",
	component: ExperienceBlock,
	parameters: {
		docs: {
			description: {
				component:
					"The row shape used for work and education. A 48px logo on the left, the organisation in `text-foreground/80` above a muted secondary line, and the date range pushed to the right. `ProjectsBlock` and the projects listing use the same anatomy, which is why a section can mix them without looking assembled from parts.",
			},
		},
	},
} satisfies Meta<typeof ExperienceBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Work history. A single freelance entry, which is honest rather than padded. */
export const Work: Story = {
	args: { experiences },
};

/**
 * Education runs the same component. Entries with a `url` get an external link
 * icon next to the name, the rest do not.
 */
export const Education: Story = {
	args: { experiences: education },
};

/** How the experience section actually stacks them, split by a rule. */
export const AsUsedOnTheSite: Story = {
	args: { experiences },
	render: () => (
		<div className="flex flex-col gap-4">
			<ExperienceBlock experiences={experiences} />
			<hr />
			<ExperienceBlock experiences={education} />
		</div>
	),
};

/** Some logos are dark marks that need inverting on the light panel. */
export const InvertedLogo: Story = {
	args: {
		experiences: [
			{
				company: "Independent",
				role: "Freelance Web Developer",
				logo: "/whj.webp",
				startDate: "2025",
				endDate: "2026",
				invert: true,
			},
		],
	},
};

/** Nothing to show. The component renders an empty column rather than a message. */
export const Empty: Story = {
	args: { experiences: [] },
};
