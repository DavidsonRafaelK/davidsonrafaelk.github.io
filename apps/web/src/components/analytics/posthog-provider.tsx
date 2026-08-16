"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { Suspense, useEffect, useRef } from "react";

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

	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;

		const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		if (!posthogKey) return;
		posthog.init(posthogKey, {
			api_host: "/a",
			capture_pageview: false,
		});
	}, []);

	return (
		<>
			<Suspense fallback={null}>
				<PageViewTracker />
			</Suspense>
			{children}
		</>
	);
}
