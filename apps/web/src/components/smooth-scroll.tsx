"use client";

import type Lenis from "lenis";
import { useEffect } from "react";

/**
 * Page-wide Lenis smooth scrolling, as `<ReactLenis root>` did. It only changes
 * how wheel input feels, so it starts once the browser is idle after
 * hydration instead of adding its weight to the page bundle.
 */
export function SmoothScroll() {
	useEffect(() => {
		let lenis: Lenis | undefined;
		let cancelled = false;

		const start = () => {
			import("lenis").then(({ default: Lenis }) => {
				if (!cancelled) lenis = new Lenis({ autoRaf: true });
			});
		};
		const idle = "requestIdleCallback" in window;
		const handle = idle
			? window.requestIdleCallback(start)
			: window.setTimeout(start, 1);

		return () => {
			cancelled = true;
			if (idle) window.cancelIdleCallback(handle);
			else window.clearTimeout(handle);
			lenis?.destroy();
		};
	}, []);

	return null;
}
