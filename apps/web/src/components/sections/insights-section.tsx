"use client";

import dynamic from "next/dynamic";
import { type Ref, useRef } from "react";
import { ActionRow } from "@/components/section-ui/action-row";
import {
	SectionHeading,
	SectionRoot,
	SectionText,
} from "@/components/section-ui/section-heading";
import { useNearViewport } from "@/components/use-near-viewport";

/** Same box the chart draws its loading state in, so nothing moves on mount. */
function ChartBox({ ref }: { ref?: Ref<HTMLDivElement> }) {
	return (
		<div
			ref={ref}
			className="relative w-full"
			style={{ aspectRatio: "2 / 1" }}
		/>
	);
}

const ViewChart = dynamic(
	() =>
		import("@/components/insights-chart").then((m) => ({
			default: m.ViewChart,
		})),
	{ ssr: false, loading: () => <ChartBox /> },
);

/**
 * The chart (visx + d3) and its `/api/insights` fetch sit far below the fold,
 * so both wait until the section is about to scroll into view.
 */
function LazyViewChart() {
	const ref = useRef<HTMLDivElement>(null);
	const near = useNearViewport(ref, "600px");
	return near ? <ViewChart /> : <ChartBox ref={ref} />;
}

export default function InsightsSection({ id }: { id: string }) {
	return (
		<SectionRoot id={id}>
			<SectionHeading before="Insights" />
			<SectionText>
				The graph below shows the live insights of the visitors of this website.
				Hover over the bars to see the exact values. It's pretty cool right??
			</SectionText>
			<LazyViewChart />
			<ActionRow
				buttons={[
					{
						text: "Reload for updates",
						boxColor: "bg-taupe-500",
						pattern: "arrow",
						action: () => window.location.reload(),
					},
				]}
			/>
		</SectionRoot>
	);
}
