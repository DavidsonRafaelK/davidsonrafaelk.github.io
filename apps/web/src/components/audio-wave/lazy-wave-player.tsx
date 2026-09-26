"use client";

import { cn } from "@homepage/ui/lib/utils";
import { lazy, Suspense, useEffect, useState } from "react";
import type { WavePlayerProps } from "./wave-player";

const WavePlayer = lazy(() =>
	import("./wave-player").then((m) => ({ default: m.WavePlayer })),
);

/**
 * Client-only (wavesurfer needs the DOM) and split out of the page bundle.
 * Until it loads, an empty shell carrying the player's outer classes holds its
 * box, so the Github button below it on mobile does not jump when it lands.
 */
export function LazyWavePlayer(props: WavePlayerProps) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const shell = <div className={cn("flex w-full", props.className)} />;
	if (!mounted) return shell;

	return (
		<Suspense fallback={shell}>
			<WavePlayer {...props} />
		</Suspense>
	);
}
