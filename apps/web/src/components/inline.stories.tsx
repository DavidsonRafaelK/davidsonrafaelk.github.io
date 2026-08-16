import type { Meta, StoryObj } from "@storybook/nextjs";
import { Inline } from "./inline";

const meta = {
	tags: ["autodocs"],
	title: "Foundations/Inline",
	component: Inline,
	parameters: {
		docs: {
			description: {
				component:
					"A polymorphic wrapper that forces `display: inline` on whatever element it renders. It exists so a heading can be a real `h1` or `h2` for semantics and search engines while still flowing as inline text, which is what lets the two-tone heading split a phrase across two colours mid-line.",
			},
		},
	},
	argTypes: {
		as: {
			control: "text",
			description: "Element to render. Defaults to span.",
		},
	},
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { children: "An inline span" },
};

/**
 * The hero. A real `h1` for crawlers, inline so the joke can sit beside the
 * name in the same visual line.
 */
export const AsHeading: Story = {
	args: {
		as: "h1",
		className: "font-display font-s text-foreground",
		style: { fontWeight: "500" },
		children: (
			<>
				Hi I'm Davidson Rafael, web developer{" "}
				<span className="text-muted-foreground">
					why do programmers prefer dark mode? light attracts bugs.
				</span>
			</>
		),
	},
};

/**
 * Why it exists: an `h2` is block-level by default, so the two halves would
 * stack. Compare the two.
 */
export const WhyNotAPlainHeading: Story = {
	args: { children: "comparison" },
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<p className="mb-2 font-mono text-muted-foreground text-xs">
					Inline as="h2"
				</p>
				<Inline as="h2" className="font-display font-s text-foreground">
					<b>
						Featured <span className="text-muted-foreground">projects.</span>
					</b>
				</Inline>
			</div>
			<div>
				<p className="mb-2 font-mono text-muted-foreground text-xs">
					plain h2 with a nested span
				</p>
				<h2 className="font-display font-s text-foreground">
					<b>
						Featured{" "}
						<span className="block text-muted-foreground">projects.</span>
					</b>
				</h2>
			</div>
		</div>
	),
};
