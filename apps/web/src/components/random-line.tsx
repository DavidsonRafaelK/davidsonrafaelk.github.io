"use client";

import { useEffect, useRef, useState } from "react";

const pools = {
	programmer: () =>
		import("@/content/programmer-jokes").then((m) => m.programmerJokes),
	dad: () => import("@/content/dad-jokes").then((m) => m.dadJokes),
} satisfies Record<string, () => Promise<readonly string[]>>;

export type LinePool = keyof typeof pools;

function pickLine(lines: readonly string[]) {
	return lines[Math.floor(Math.random() * lines.length)];
}

/**
 * Shows one random line from a pool. The server renders `fallback`, and the
 * pool is fetched as its own chunk after mount so hundreds of jokes stay out
 * of the page bundle.
 *
 * If an inline script already swapped the text before first paint (the hero
 * does this so its `h1` never reflows after load), it marks the span with
 * `data-picked` and that choice is kept.
 */
export function RandomLine({
	id,
	pool,
	fallback,
}: {
	id?: string;
	pool: LinePool;
	fallback: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const [line, setLine] = useState(fallback);

	useEffect(() => {
		if (ref.current?.dataset.picked) return;
		let live = true;
		pools[pool]().then((lines) => {
			if (live) setLine(pickLine(lines) ?? fallback);
		});
		return () => {
			live = false;
		};
	}, [pool, fallback]);

	return (
		<span id={id} ref={ref} suppressHydrationWarning>
			{line}
		</span>
	);
}
