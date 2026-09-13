"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { Suspense, useEffect, useRef, useState } from "react";

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
		posthog.capture("$pageview", {
			$current_url: pageUrl,
		});
	}, [pageUrl]);

	return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	const initialized = useRef(false);
	/**
	 * React flushes child effects before parent effects, so a `PageViewTracker`
	 * rendered unconditionally would `capture()` against an uninitialised
	 * instance and posthog-js would drop that first pageview. Mounting it only
	 * once `init()` has run makes the ordering explicit.
	 */
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		if (!posthogKey) return;

		if (!initialized.current) {
			initialized.current = true;
			posthog.init(posthogKey, {
				api_host: "/a",
				capture_pageview: false,
			});
		}

		setReady(true);
	}, []);

	return (
		<>
			{ready && (
				<Suspense fallback={null}>
					<PageViewTracker />
				</Suspense>
			)}
			{children}
		</>
	);
}
