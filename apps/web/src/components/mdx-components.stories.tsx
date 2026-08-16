import type { Meta, StoryObj } from "@storybook/nextjs";
import { mdxComponents as c } from "./mdx-components";

const meta = {
	title: "Content/MDX components",
	parameters: {
		docs: {
			description: {
				component:
					"The map MDX renders through on project pages. Long-form copy has to land in the same primitives the sections use, otherwise an article looks bolted onto the site. One deliberate departure: `SectionText` is `opacity-70` and bold, which suits a two-sentence intro and tires the eye over 600 words, so body copy here runs at full opacity and normal weight.",
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A whole article's worth of elements, in the order a case study uses them. */
export const Prose: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<c.h2>How it's built</c.h2>
			<c.p>
				Next.js 15 with the App Router, written in plain JavaScript. Supabase
				handles Postgres and auth, and <c.code>middleware.js</c.code> keeps
				people out of the pages they shouldn't be in.
			</c.p>
			<c.h3>A smaller heading</c.h3>
			<c.p>
				Body copy runs at full opacity so it stays readable at length. Links
				look like <c.a href="/projects">this internal one</c.a> and{" "}
				<c.a href="https://nextjs.org">this external one</c.a>.
			</c.p>
			<c.ul>
				<c.li>Lists keep the same measure as paragraphs</c.li>
				<c.li>Bullets sit outside the text column</c.li>
			</c.ul>
			<c.blockquote>
				<c.p>
					Quotes get a left rule in the border token and drop to muted text.
				</c.p>
			</c.blockquote>
			<c.hr />
			<c.p>
				Tables scroll inside their own container so a wide one never makes the
				page scroll sideways.
			</c.p>
			<c.table>
				<thead>
					<tr>
						<c.th>Layer</c.th>
						<c.th>Owns</c.th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<c.td>Once UI</c.td>
						<c.td>Layout and typography</c.td>
					</tr>
					<tr>
						<c.td>Tailwind + shadcn</c.td>
						<c.td>Colour and radius</c.td>
					</tr>
					<tr>
						<c.td>skiper-ui</c.td>
						<c.td>Showpieces</c.td>
					</tr>
				</tbody>
			</c.table>
		</div>
	),
};

/** Headings only, to check the step down from `h2` to `h3`. */
export const Headings: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<c.h2>What happens if two people want the same room</c.h2>
			<c.h3>Why SVG, and why plain JavaScript</c.h3>
		</div>
	),
};

/**
 * Code blocks are highlighted at build time by `rehype-pretty-code`, so this
 * story shows the container styling rather than live tokens. Real pages get
 * both themes as CSS variables and pick one in `index.css`.
 */
export const Code: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<c.p>
				Inline code looks like <c.code>useOptimistic</c.code> inside a sentence.
			</c.p>
			<c.pre>
				<code>{"const [slots, addSlot] = useOptimistic(initialSlots);"}</code>
			</c.pre>
		</div>
	),
};
