"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const CrowdCanvas = dynamic(
	() => import("@homepage/ui/skiper-ui/crowd-canvas").then((m) => m.default),
	{
		ssr: false,
		loading: () => (
			<div className="absolute bottom-0 h-[90vh] w-full animate-pulse bg-taupe-500/10" />
		),
	},
);

export function LazyCrowdCanvas(props: {
	src: string;
	rows?: number;
	cols?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} className="absolute bottom-0 h-[90vh] w-full">
			{visible && <CrowdCanvas {...props} />}
		</div>
	);
}
