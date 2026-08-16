"use client";

import { Column, Flex, StatusIndicator, Text } from "@once-ui-system/core";
import type { Route } from "next";
import { DotGothic16 } from "next/font/google";
import Link from "next/link";
import { getDate } from "@/lib/get-date";

const bitcountFont = DotGothic16({
	subsets: ["latin"],
	weight: "400",
});

const navLinks = [
	{ label: "Introduction", href: "/#hero" },
	{ label: "About", href: "/#about" },
	{ label: "Stacks", href: "/#skills" },
	{ label: "Works", href: "/#experience" },
	{ label: "Projects", href: "/projects" },
	{ label: "Awards", href: "/#awards" },
	{ label: "Insights", href: "/#insights" },
];

/**
 * Hash links smooth-scroll when the section is already on the page; anywhere
 * else the click falls through to `Link` so it navigates home first.
 */
function scrollToHash(e: React.MouseEvent<HTMLAnchorElement>) {
	const href = e.currentTarget.getAttribute("href");
	const id = href?.split("#")[1];
	if (!id) return;

	const el = document.getElementById(id);
	if (!el) return;

	e.preventDefault();
	el.scrollIntoView({ behavior: "smooth" });
}

export default function SiteHeader() {
	return (
		<Flex
			vertical="end"
			fillWidth
			direction="row"
			horizontal="between"
			fitHeight
		>
			<Column vertical="center" horizontal="start">
				<Flex
					className={bitcountFont.className}
					direction="row"
					gap={1}
					vertical="center"
					horizontal="center"
				>
					<Text variant="label-default-l" className="text-muted-foreground">
						{getDate()}
					</Text>
					<Flex fit overflow="hidden" className="roudned-full">
						<StatusIndicator color="orange" className="rounded-full" size="m" />
					</Flex>
				</Flex>
				<Flex className={bitcountFont.className}>
					<Text variant="display-default-s" className="text-foreground">
						Today
					</Text>
				</Flex>
			</Column>
			<Column vertical="end" horizontal="end" fillHeight>
				<Flex
					className={`${bitcountFont.className} hidden md:flex`}
					direction="row"
					gap={1}
					vertical="end"
					horizontal="end"
					fillHeight
					m={{ hide: true }}
				>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href as Route}
							onClick={scrollToHash}
							className="flex min-h-11 min-w-11 cursor-pointer touch-manipulation items-center justify-center"
						>
							<Text
								variant="label-default-l"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</Text>
						</Link>
					))}
				</Flex>
			</Column>
		</Flex>
	);
}
