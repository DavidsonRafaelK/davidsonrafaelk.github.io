import { Flex, Row, Text } from "@once-ui-system/core";
import { LazyWavePlayer } from "@/components/audio-wave/lazy-wave-player";
import { HeroAvatar } from "@/components/hero-avatar";
import { Inline } from "@/components/inline";
import PremiumButton from "@/components/premium-button";
import { RandomLine } from "@/components/random-line";
import { programmerJokes } from "@/content/programmer-jokes";
import { socials } from "@/content/socials";

const JOKE_ID = "hero-joke";

/**
 * Swaps the hero joke before first paint, so the `h1` (the page's LCP element)
 * is laid out once with its final text instead of reflowing the hero when a
 * client-side pick lands after hydration.
 */
const pickJokeBeforePaint = `(function(){var e=document.getElementById("${JOKE_ID}"),l=${JSON.stringify(programmerJokes).replace(/</g, "\\u003c")};if(!e)return;e.textContent=l[Math.floor(Math.random()*l.length)];e.dataset.picked="1"})()`;

export default function HeroSection({ id }: { id: string }) {
	return (
		<Flex
			id={id}
			direction="column"
			horizontal="start"
			vertical="start"
			fillWidth
			gap={1}
		>
			<HeroAvatar />
			<Inline
				as="h1"
				className="wrap-break-word font-display font-normal font-s text-foreground opacity-90"
				style={{ fontWeight: "500" }}
			>
				<>
					Hi I'm Davidson Rafael, web developer.{" "}
					<span className="text-muted-foreground">
						<RandomLine
							id={JOKE_ID}
							pool="programmer"
							fallback={programmerJokes[0]}
						/>
					</span>
				</>
			</Inline>
			<script dangerouslySetInnerHTML={{ __html: pickJokeBeforePaint }} />
			<Text
				variant="label-default-xl"
				onBackground="neutral-weak"
				className="font-medium opacity-70"
			>
				<b>
					Hi, I'm Davidson, 19, I write code and occasionally it works on the
					first try. Mostly mess around with frontend and backend, still
					deciding which one to blame when stuff breaks.
				</b>
			</Text>
			<Flex
				fillWidth
				fitHeight
				direction="row"
				gap={1}
				m={{ direction: "column-reverse" }}
			>
				<Row center gap={1} className="transition-colors duration-400">
					<PremiumButton
						text="Github"
						className="w-fit"
						boxColor="bg-orange-500"
						href={socials.github}
					/>
					{/* <PremiumButton
            text="Linkedin"
            className="w-fit"
            boxColor="bg-sky-500"
            href={socials.linkedin}
          /> */}
				</Row>
				<Flex fillWidth className="pr-0 md:pr-40">
					<LazyWavePlayer
						src="/struct.mp3"
						waveHeight={28}
						className="h-[44px] w-full rounded-full border border-border bg-accent bg-linear-to-br from-white/80 to-muted shadow-[0_2px_2px_-1px_rgba(0,0,0,0.1)]"
					/>
				</Flex>
			</Flex>
		</Flex>
	);
}
