import type { Meta, StoryObj } from "@storybook/nextjs";
import { projectsData } from "@/content/projects";
import { ProjectsBlock } from "./projects-block";

const meta = {
	tags: ["autodocs"],
	title: "Lists/ProjectsBlock",
	component: ProjectsBlock,
	parameters: {
		docs: {
			description: {
				component:
					"The compact project list on the homepage. Same row anatomy as `ExperienceBlock`: 48px thumbnail, title, one-line description. This is the summary view, and the full write-ups live on `/projects/[slug]`.",
			},
		},
	},
} satisfies Meta<typeof ProjectsBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every project in `content/projects.ts`. */
export const Default: Story = {
	args: { projects: projectsData },
};

/** A single row, to check how a long description wraps inside 768px. */
export const SingleRow: Story = {
	args: { projects: projectsData.slice(0, 1) },
};

/**
 * With no projects the block renders a placeholder row rather than collapsing.
 * Worth knowing, because an empty content file produces this rather than
 * nothing.
 */
export const Empty: Story = {
	args: { projects: [] },
};

/** Dark thumbnails are flagged `invert` in the content file. */
export const InvertedThumbnail: Story = {
	args: {
		projects: projectsData.filter((project) => project.invert),
	},
};
