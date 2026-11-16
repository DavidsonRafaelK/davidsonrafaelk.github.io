import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ActionRow } from "@/components/section-ui/action-row";
import {
	SectionHeading,
	SectionRoot,
	SectionText,
} from "@/components/section-ui/section-heading";

export const metadata: Metadata = {
	title: "Page not found",
	description: "This page doesn't exist.",
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return (
		<PageShell>
			<SectionRoot id="not-found">
				<SectionHeading as="h1" before="Page" highlight="not found." />
				<SectionText>
					Nothing lives at this address. It may have moved, or the link was
					wrong to begin with.
				</SectionText>
				<ActionRow
					buttons={[
						{
							text: "Back home",
							boxColor: "bg-rose-500",
							pattern: "arrow",
							href: "/",
						},
						{
							text: "See the projects",
							boxColor: "bg-orange-500",
							pattern: "arrow",
							href: "/projects",
						},
					]}
				/>
			</SectionRoot>
		</PageShell>
	);
}
