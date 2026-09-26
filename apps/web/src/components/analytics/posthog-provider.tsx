"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { PostHog } from "posthog-js";
import { Suspense, useEffect } from "react";

/** How long the page has to sit untouched after `load` before PostHog loads anyway. */
const IDLE_LOAD_DELAY_MS = 4000;

const INTERACTION_EVENTS = [
	"pointerdown",
	"keydown",
	"touchstart",
	"wheel",
] as const;

let client: Promise<PostHog | null> | undefined;

function afterInteractionOrIdle() {
	return new Promise<void>((resolve) => {
		let timer: number | undefined;
		const done = () => {
			for (const event of INTERACTION_EVENTS) {
				window.removeEventListener(event, done);
			}
			window.clearTimeout(timer);
			resolve();
		};
		for (const event of INTERACTION_EVENTS) {
			window.addEventListener(event, done, { once: true, passive: true });
		}
		const startTimer = () => {
			timer = window.setTimeout(done, IDLE_LOAD_DELAY_MS);
		};
		if (document.readyState === "complete") startTimer();
		else window.addEventListener("load", startTimer, { once: true });
	});
}

/**
 * posthog-js, and the recorder and surveys bundles it fetches after init, are
 * the heaviest scripts on the page. They load on the visitor's first
 * interaction, or a few seconds after `load` if there is none, so they never
 * compete with hydration. Captures made before then queue on this promise,
 * which also guarantees `init()` has run before the first `capture()`.
 */
function getPostHog() {
	client ??= afterInteractionOrIdle().then(async () => {
		const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		if (!posthogKey) return null;

		const { default: posthog } = await import("posthog-js");
		posthog.init(posthogKey, {
			api_host: "/a",
			capture_pageview: false,
		});
		return posthog;
	});
	return client;
}

/**
 * Renders nothing and, crucially, does not wrap the page. `useSearchParams`
 * forces its closest Suspense boundary to be client-rendered, so anything
 * inside this component would be missing from the prerendered HTML.
 */
function PageViewTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const pageUrl =
		pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

	useEffect(() => {
		getPostHog().then((posthog) =>
			posthog?.capture("$pageview", {
				$current_url: pageUrl,
			}),
		);
	}, [pageUrl]);

	return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Suspense fallback={null}>
				<PageViewTracker />
			</Suspense>
			{children}
		</>
	);
}
