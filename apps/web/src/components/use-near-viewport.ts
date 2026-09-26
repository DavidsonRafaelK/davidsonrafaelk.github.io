"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * Flips to true once the element comes within `rootMargin` of the viewport,
 * and stays true. Used to defer below-the-fold widgets (and their chunks and
 * fetches) until the visitor scrolls toward them.
 */
export function useNearViewport(
	ref: RefObject<Element | null>,
	rootMargin = "200px",
) {
	const [near, setNear] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el || near) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setNear(true);
					observer.disconnect();
				}
			},
			{ rootMargin },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [ref, rootMargin, near]);

	return near;
}
