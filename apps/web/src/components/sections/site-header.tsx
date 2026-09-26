"use client";

import { Column, Flex, StatusIndicator, Text } from "@once-ui-system/core";
import type { Route } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDate } from "@/lib/get-date";

/**
 * DotGothic16's latin subset, self-hosted. `next/font/google` emits an
 * @font-face for every one of its 120+ Japanese subsets regardless of
 * `subsets`, which put ~33KB of render-blocking CSS on every page.
 */
const bitcountFont = localFont({
	src: "../../fonts/dotgothic16-latin-400.woff2",
	weight: "400",
	display: "swap",
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
	/**
	 * `/` is statically prerendered, so calling `getDate()` during render bakes
	 * the build machine's UTC date into the HTML: stale for every visitor after
	 * deploy day, and a hydration mismatch against the client's own clock.
	 * Resolving it after mount leaves one source of truth, the visitor's.
	 */
	const [today, setToday] = useState<string | null>(null);

	useEffect(() => {
		setToday(getDate());
	}, []);

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
						{/* Non-breaking space holds the line height until the date lands. */}
						{today ?? "\u00a0"}
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
