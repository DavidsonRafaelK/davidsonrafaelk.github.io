"use client";

import dynamic from "next/dynamic";
import { ActionRow } from "@/components/section-ui/action-row";
import {
	SectionHeading,
	SectionRoot,
	SectionText,
} from "@/components/section-ui/section-heading";
import { dadJokes } from "@/content/dad-jokes";
import { socials } from "@/content/socials";

const JokeLine = dynamic(
	() => import("@/components/random-line").then((m) => m.RandomLine),
	{ ssr: false, loading: () => <>{dadJokes[0]}</> },
);

export default function AboutSection({ id }: { id: string }) {
	return (
		<SectionRoot id={id}>
			<SectionHeading before="A little about" highlight="me." />
			<SectionText>
				I'm a Computer Science student at UKRIDA, freelancing on web projects on
				the side. Interest-wise it's AI/ML and web development, and outside of
				code I'm at the gym, going for a run, or buried in manga/anime with
				music always playing in the background. <br />
				<br />
				Fun fact: people say I look like Park Seo-roi from Itaewon Class, and
				honestly, I'll take it. <br />
				<br />
				And since every about page needs a dad joke:{" "}
				<JokeLine lines={dadJokes} />
			</SectionText>
			<ActionRow
				buttons={[
					{
						text: "Email me",
						boxColor: "bg-orange-500",
						pattern: "mail",
						href: socials.email,
					},
					{
						text: "See my Kaggle",
						boxColor: "bg-teal-500",
						pattern: "globe",
						href: socials.kaggle,
					},
					{
						text: "Connect on LinkedIn",
						boxColor: "bg-sky-500",
						pattern: "linkedin",
						href: socials.linkedin,
					},
				]}
			/>
		</SectionRoot>
	);
}
