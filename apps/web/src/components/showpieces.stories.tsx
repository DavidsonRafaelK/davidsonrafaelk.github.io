import { HoverExpand_001 } from "@homepage/ui/skiper-ui/hover-expand";
import { ProgressiveBlur } from "@homepage/ui/skiper-ui/progressive-blur";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProjectCard } from "@/components/project-card";
import { projectsData } from "@/content/projects";

const meta = {
	title: "Showpieces/Overview",
	parameters: {
		docs: {
			description: {
				component:
					"Animated one-offs from `@homepage/ui/skiper-ui`. House rule is one per section at most, usually as a full-bleed break after the content, which is why they are documented together rather than treated as general-purpose components.",
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const projectImages = projectsData.map((project) => ({
	src: project.imageUrl ?? "",
	alt: project.title,
	code: project.title,
}));

/**
 * Sits at the end of the projects section. Hover a panel and it expands while
 * the others contract. Needs room to breathe, so it renders full-bleed rather
 * than inside the reading column.
 */
export const HoverExpand: Story = {
	parameters: { layout: "padded" },
	render: () => <HoverExpand_001 images={projectImages} />,
};

/**
 * The cutout card, driven by `projectsData`. Each render picks six projects at
 * random, so the order changes between reloads.
 */
export const CutoutCards: Story = {
	render: () => <ProjectCard />,
};

/**
 * A fixed gradient mask pinned to the top or bottom of the viewport. This is
 * the one component allowed to carry a hardcoded hex, because it has to match
 * the page background exactly rather than track a token.
 */
export const ProgressiveBlurBottom: Story = {
	name: "ProgressiveBlur",
	render: () => (
		<div className="relative h-[320px] overflow-hidden rounded-2xl bg-background">
			<div className="flex flex-col gap-2 p-4">
				{Array.from({ length: 12 }, (_, i) => (
					<div
						key={`row-${i + 1}`}
						className="h-6 rounded-md bg-muted-foreground/20"
					/>
				))}
			</div>
			<ProgressiveBlur
				position="bottom"
				backgroundColor="#f5f4f3"
				height="110px"
				className="absolute"
			/>
		</div>
	),
};
