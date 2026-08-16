"use client";

import { cn } from "@homepage/ui/lib/utils";
import { Media, Row } from "@once-ui-system/core";
import type { ReactNode } from "react";
import { useState } from "react";
import { getStackIcon } from "@/content/stack-icons";

function extractDomain(url: string): string | null {
	try {
		const normalized = url.match(/^https?:\/\//) ? url : `https://${url}`;
		return new URL(normalized).hostname;
	} catch {
		return null;
	}
}

interface StackButtonProps {
	/** Omit to render a plain chip with no outbound link. */
	url?: string;
	label: string;
	color?: string;
	overrideMediaUrl?: string;
}

export function StackButton({
	url,
	label,
	overrideMediaUrl,
}: StackButtonProps) {
	const icon = getStackIcon(label);
	const domain = url ? extractDomain(url) : null;
	const [useOverride, setUseOverride] = useState(false);

	// Prefer the locally hosted logo; fall back to the site's favicon for
	// anything not in the registry yet.
	const iconSrc = icon
		? icon.src
		: overrideMediaUrl && useOverride
			? overrideMediaUrl
			: domain
				? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
				: null;

	const chip = (
		<Row
			fitWidth
			fitHeight
			className={cn(
				"h-[32px] rounded-lg border-2 bg-border p-1.5 transition-all",
				url && "hover:bg-taupe-300",
			)}
			padding={0.25}
			gap={0.5}
			center
		>
			{iconSrc && (
				<Media
					src={iconSrc}
					width={1.5}
					height={1.5}
					className={cn("rounded-md", icon?.mono && "dark:invert")}
					minWidth={1.5}
					unoptimized
					maxWidth={1.5}
					minHeight={1.5}
					maxHeight={1.5}
					onError={() => setUseOverride(true)}
				/>
			)}
			{label}
		</Row>
	);

	if (!url) return chip;

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="flex h-fit w-fit"
		>
			{chip as ReactNode}
		</a>
	);
}
