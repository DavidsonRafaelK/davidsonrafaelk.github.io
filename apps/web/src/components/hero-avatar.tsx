"use client";

import { Flex } from "@once-ui-system/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import { pfpOverlays } from "@/content/pfp-overlays";

const pfpDurations = pfpOverlays.map(() => 3000);

/** The GitHub avatar with a rotating, cross-fading avatar decoration on top. */
export function HeroAvatar() {
	const [pfpIndex, setPfpIndex] = useState(0);
	const [pfpFade, setPfpFade] = useState(true);
	const pfp = pfpOverlays[pfpIndex];

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
		<Flex fit className="relative">
			<div
				className={`absolute top-0 left-0 z-[9999] size-[128px] scale-[1.25] overflow-hidden rounded-2xl transition-opacity duration-500 ${pfpFade ? "opacity-100" : "opacity-0"}`}
			>
				<Image
					src={pfp}
					alt=""
					aria-hidden
					fill
					className="object-cover"
					sizes="128px"
					unoptimized
				/>
			</div>
			<div className="size-[128px] overflow-hidden rounded-2xl">
				<Image
					src="https://avatars.githubusercontent.com/u/171815443?v=4"
					alt="Portrait of Davidson Rafael, web developer based in Jakarta"
					width={128}
					height={128}
					loading="eager"
					className="size-full object-cover"
					unoptimized
				/>
			</div>
		</Flex>
	);
}
