import type { Meta, StoryObj } from "@storybook/nextjs";
import { stackIcons } from "@/content/stack-icons";
import { stacksData } from "@/content/stacks";
import { ProjectStackRow } from "./project-stack-row";
import { StackButton } from "./stack-button";

const meta = {
	title: "Stack/StackButton",
	component: StackButton,
	parameters: {
		docs: {
			description: {
				component:
					"One chip shape for every technology on the site, used by both the skills section and project pages. The logo is looked up by `label` in `content/stack-icons.ts`, so callers pass a name and get the right mark. Drop `url` and it renders the same chip with no link and no hover.",
			},
		},
	},
	argTypes: {
		label: { control: "text" },
		url: { control: "text" },
	},
} satisfies Meta<typeof StackButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { label: "Next.js", url: "https://nextjs.org" },
};

/** Without a `url` the chip keeps its shape but stops being a link. */
export const WithoutLink: Story = {
	args: { label: "dnd-kit" },
};

/** Every logo in the registry. Watch the mono ones when you flip to dark. */
export const AllIcons: Story = {
	args: { label: "Next.js" },
	render: () => (
		<div className="flex flex-wrap gap-3">
			{Object.keys(stackIcons).map((label) => (
				<StackButton key={label} label={label} />
			))}
		</div>
	),
};

/**
 * Single-colour marks are stored as black SVGs and flagged `mono` in the
 * registry, which applies `dark:invert`. Without that they vanish on the dark
 * chip background.
 */
export const MonoIconsNeedInverting: Story = {
	args: { label: "Biome" },
	render: () => (
		<div className="flex flex-wrap gap-3">
			{Object.entries(stackIcons)
				.filter(([, icon]) => icon.mono)
				.map(([label]) => (
					<StackButton key={label} label={label} />
				))}
		</div>
	),
};

/** The skills section, grouped the way `content/stacks.ts` orders it. */
export const SkillsSection: Story = {
	args: { label: "Next.js" },
	render: () => (
		<div className="flex flex-col gap-6">
			{stacksData.map((category) => (
				<div key={category.category} className="flex flex-wrap gap-3">
					{category.items.map((item) => (
						<StackButton key={item.label} url={item.url} label={item.label} />
					))}
				</div>
			))}
		</div>
	),
};

/**
 * `ProjectStackRow` takes plain labels from MDX frontmatter and resolves each
 * one against `stacks.ts`. Known names become links, unknown ones stay chips.
 */
export const ProjectStackRowStory: Story = {
	name: "ProjectStackRow",
	args: { label: "Next.js" },
	render: () => (
		<ProjectStackRow
			stack={["Next.js", "JavaScript", "Supabase", "PostgreSQL", "dnd-kit"]}
		/>
	),
};
