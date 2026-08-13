"use client";

import { Flex, Row, Text } from "@once-ui-system/core";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import { Inline } from "@/components/inline";
import PremiumButton from "@/components/premium-button";
import { pfpOverlays } from "@/content/pfp-overlays";
import { programmerJokes } from "@/content/programmer-jokes";
import { socials } from "@/content/socials";

const WavePlayer = dynamic(
	() =>
		import("@/components/audio-wave/wave-player").then((m) => ({
			default: m.WavePlayer,
		})),
	{ ssr: false },
);

const pfpDurations = pfpOverlays.map(() => 3000);

export default function HeroSection({ id }: { id: string }) {
	const [pfpIndex, setPfpIndex] = useState(0);
	const [pfp, setPfp] = useState(pfpOverlays[0]);
	const [pfpFade, setPfpFade] = useState(true);
	const [joke, setJoke] = useState(programmerJokes[0]);

	useLayoutEffect(() => {
		setJoke(
			programmerJokes[Math.floor(Math.random() * programmerJokes.length)],
		);
	}, []);

	// Sync the displayed pfp whenever the index advances.
	useEffect(() => {
		setPfp(pfpOverlays[pfpIndex]);
	}, [pfpIndex]);

	// Schedule the fade-out once the current pfp has been shown long enough.
	useEffect(() => {
		const duration = pfpDurations[pfpIndex] ?? 3000;
		const timeout = setTimeout(() => setPfpFade(false), duration * 2);
		return () => clearTimeout(timeout);
	}, [pfpIndex]);

	// Once faded out, wait for the fade transition then advance and fade back in.
	useEffect(() => {
		if (pfpFade) return;
		const timeout = setTimeout(() => {
			setPfpIndex((prev) => (prev + 1) % pfpOverlays.length);
			setPfpFade(true);
		}, 500);
		return () => clearTimeout(timeout);
	}, [pfpFade]);

	return (
		<Flex
			id={id}
			direction="column"
			horizontal="start"
			vertical="start"
			fillWidth
			gap={1}
		>
			<Flex fit className="relative">
				<div
					className={`absolute top-0 left-0 z-[9999] size-[128px] scale-[1.25] overflow-hidden rounded-2xl transition-opacity duration-500 ${pfpFade ? "opacity-100" : "opacity-0"}`}
				>
					<Image
						src={pfp}
						alt=""
						fill
						className="object-cover"
						sizes="128px"
						unoptimized
					/>
				</div>
				<div className="size-[128px] overflow-hidden rounded-2xl">
					<Image
						src="https://avatars.githubusercontent.com/u/171815443?v=4"
						alt=""
						width={128}
						height={128}
						className="size-full object-cover"
						unoptimized
					/>
				</div>
			</Flex>
			<Inline
				className="wrap-break-word font-display font-normal font-s text-foreground opacity-90"
				style={{ fontWeight: "500" }}
			>
				<>
					Hi I'm Davidson Rafael —{" "}
					<span className="text-muted-foreground">{joke}</span>
				</>
			</Inline>
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
					<WavePlayer
						src="/struct.mp3"
						waveHeight={28}
						className="h-[44px] w-full rounded-full border border-border bg-accent bg-linear-to-br from-white/80 to-muted shadow-[0_2px_2px_-1px_rgba(0,0,0,0.1)]"
					/>
				</Flex>
			</Flex>
		</Flex>
	);
}
