"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useNearViewport } from "@/components/use-near-viewport";

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
	const visible = useNearViewport(ref);

	return (
		<div ref={ref} className="absolute bottom-0 h-[90vh] w-full">
			{visible && <CrowdCanvas {...props} />}
		</div>
	);
}
