import { ProgressiveBlur } from "@homepage/ui/skiper-ui/progressive-blur";
import { Column, Flex } from "@once-ui-system/core";
import type { ReactNode } from "react";
import { FluidGradientText } from "@/components/fluid-gradient-text";
import SiteHeader from "@/components/sections/site-header";

/**
 * The homepage frame minus its full-bleed crowd canvas: header, one rounded
 * accent panel holding a 768px reading column, and the wordmark. Subpages use
 * this so they sit inside the same system instead of looking bolted on.
 */
export function PageShell({ children }: { children: ReactNode }) {
	return (
		<>
			<ProgressiveBlur position="top" backgroundColor="#f5f4f3" height="0px" />
			<Flex
				fillWidth
				fitHeight
				minWidth="100vw"
				paddingX={1.5}
				paddingY={1.5}
				horizontal="center"
				direction="column"
				gap={1}
				vertical="start"
			>
				<SiteHeader />
				<Flex direction="column" fitHeight fillWidth>
					<Flex
						className="rounded-3xl bg-accent"
						// Short pages (a listing with two entries) would otherwise leave the
						// panel floating in a screen of background with the wordmark stranded
						// halfway up. The homepage fills that space with its crowd canvas.
						style={{ minHeight: "calc(100svh - 11rem)" }}
						fillHeight
						fillWidth
						paddingX={2}
						paddingY={2}
						direction="column"
						horizontal="center"
						vertical="start"
					>
						<Column
							fillWidth
							fillHeight
							horizontal="start"
							vertical="start"
							maxWidth="s"
							gap={4}
						>
							{children}
						</Column>
					</Flex>
				</Flex>
				<Flex fillWidth paddingBottom={0.75}>
					<FluidGradientText text="davidsonrafael" />
				</Flex>
			</Flex>
			<ProgressiveBlur
				position="bottom"
				backgroundColor="#f5f4f3"
				height="110px"
			/>
		</>
	);
}
