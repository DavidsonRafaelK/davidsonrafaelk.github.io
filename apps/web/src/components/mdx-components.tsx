import { Column, Row, Text } from "@once-ui-system/core";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Inline } from "@/components/inline";

/**
 * Long-form MDX renders into the same primitives the homepage sections use, so
 * article pages stay inside the design system rather than looking bolted on.
 *
 * One deliberate departure: `SectionText` is `opacity-70` + bold, which reads
 * well for a two-sentence intro and poorly for 600 words. Body copy here runs
 * at full opacity and normal weight in the same font family.
 *
 * Intrinsic props are intentionally not spread onto Once UI components — their
 * prop types are element-specific and MDX only supplies children anyway.
 */

type Children = { children?: ReactNode };

const headingClass = "font-display font-s text-foreground";

const linkClass =
	"underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground";

export const mdxComponents = {
	h2: ({ children }: Children) => (
		<Inline as="h2" className={`${headingClass} mt-8`}>
			<b>{children}</b>
		</Inline>
	),

	h3: ({ children }: Children) => (
		<Inline as="h3" className="mt-6 font-body font-semibold text-lg">
			{children}
		</Inline>
	),

	p: ({ children }: Children) => (
		<Text
			as="p"
			variant="body-default-l"
			onBackground="neutral-strong"
			className="font-body leading-relaxed"
		>
			{children}
		</Text>
	),

	ul: ({ children }: Children) => (
		<ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>
	),

	ol: ({ children }: Children) => (
		<ol className="flex list-decimal flex-col gap-2 pl-5">{children}</ol>
	),

	li: ({ children }: Children) => (
		<li className="font-body text-foreground text-lg leading-relaxed">
			{children}
		</li>
	),

	a: ({ href = "", children }: Children & { href?: string }) => {
		if (href.startsWith("/") || href.startsWith("#")) {
			return (
				<Link href={href as Route} className={linkClass}>
					{children}
				</Link>
			);
		}

		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={linkClass}
			>
				{children}
			</a>
		);
	},

	blockquote: ({ children }: Children) => (
		<blockquote className="flex flex-col gap-2 border-border border-l-2 pl-4 text-muted-foreground">
			{children}
		</blockquote>
	),

	// Inline code only — `rehype-pretty-code` replaces the `code` inside `pre`.
	code: ({ children }: Children) => (
		<code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
			{children}
		</code>
	),

	pre: ({ children }: Children) => (
		<pre className="overflow-x-auto rounded-2xl border border-border bg-muted p-4 font-mono text-sm leading-relaxed">
			{children}
		</pre>
	),

	hr: () => <hr className="my-4 border-border" />,

	table: ({ children }: Children) => (
		<Row fillWidth className="overflow-x-auto">
			<table className="w-full border-collapse text-left text-sm">
				{children}
			</table>
		</Row>
	),

	th: ({ children }: Children) => (
		<th className="border-border border-b p-2 font-semibold">{children}</th>
	),

	td: ({ children }: Children) => (
		<td className="border-border/60 border-b p-2 text-muted-foreground">
			{children}
		</td>
	),

	img: ({ src, alt = "" }: { src?: string; alt?: string }) => (
		<Image
			src={src ?? ""}
			alt={alt}
			width={768}
			height={432}
			sizes="(max-width: 768px) 100vw, 768px"
			className="h-auto w-full rounded-2xl object-cover"
		/>
	),

	Column,
	Row,
};
