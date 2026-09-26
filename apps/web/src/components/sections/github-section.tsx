"use client";

import { Flex } from "@once-ui-system/core";
import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(
	() =>
		import("@/components/github-calendar").then((m) => ({
			default: m.GitHubCalendar,
		})),
	{ ssr: true },
);

const LEGEND_CELL_SIZE = 16;

const ContributionLegend = dynamic(
	() =>
		import("@/components/github-calendar").then((m) => ({
			default: m.ContributionLegend,
		})),
	{
		ssr: false,
		// Same row height as the legend (a cell next to 11px text), so the page
		// below does not shift when it mounts.
		loading: () => (
			<div className="flex items-center" aria-hidden="true">
				<span className="text-[11px]">{"\u00a0"}</span>
				<div style={{ height: LEGEND_CELL_SIZE }} />
			</div>
		),
	},
);

export default function GitHubSection({ id }: { id: string }) {
	return (
		<Flex
			id={id}
			fillWidth
			fillHeight
			direction="column"
			overflowY="hidden"
			gap={0.5}
		>
			<GitHubCalendar
				username="davidsonrafaelk"
				colorScheme="orange"
				cellSize={16}
				cellShape="rounded"
				display={{ dayLabels: true }}
				startDate="2024-09-06"
				endDate="auto"
			/>
			<Flex fillWidth horizontal="end">
				<ContributionLegend
					colorScheme="orange"
					cellSize={LEGEND_CELL_SIZE}
					cellShape="rounded"
				/>
			</Flex>
		</Flex>
	);
}
