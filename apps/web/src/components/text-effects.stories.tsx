import type { Meta, StoryObj } from "@storybook/nextjs";
import { FluidGradientText } from "@/components/fluid-gradient-text";
import { RandomLine } from "@/components/random-line";
import { ShimmeringText } from "@/components/shimmering-text";
import { dadJokes } from "@/content/dad-jokes";
import { programmerJokes } from "@/content/programmer-jokes";

const meta = {
	tags: ["autodocs"],
	title: "Text/Effects",
	parameters: {
		docs: {
			description: {
				component:
					"Three pieces of text that move. Two are decoration, one is content, and the difference matters: `RandomLine` changes what the page says, so it needs care that the other two do not.",
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A colour sweep across characters. Respects `prefers-reduced-motion`, which is
 * why `isStopped` exists as an explicit escape hatch too.
 */
export const Shimmering: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<ShimmeringText text="Still deciding which one to blame" />
			<ShimmeringText text="Slower cycle, four seconds" duration={4} />
			<ShimmeringText text="Stopped on purpose" isStopped />
		</div>
	),
};

/**
 * The wordmark under the page panel. Rendered as SVG text with an animated
 * gradient fill, so it scales without going soft.
 */
export const Wordmark: Story = {
	parameters: { layout: "padded" },
	render: () => <FluidGradientText text="davidsonrafael" />,
};

/**
 * Picks a line at random on mount. This is the one effect that changes meaning
 * rather than appearance.
 *
 * It is loaded with `ssr: false` everywhere it is used, with the first line of
 * the list as the loading fallback, so the server always renders real text.
 * Without that fallback the hero `h1` would be empty in the HTML, which is
 * exactly the sort of thing that costs you in search.
 */
export const Joke: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<p className="font-body text-foreground text-lg">
				<RandomLine lines={programmerJokes} />
			</p>
			<p className="font-body text-lg text-muted-foreground">
				<RandomLine lines={dadJokes} />
			</p>
			<p className="font-mono text-muted-foreground text-xs">
				{programmerJokes.length} programmer lines, {dadJokes.length} dad lines,
				both refreshed daily by CI.
			</p>
		</div>
	),
};
