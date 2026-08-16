import { Column, Row, Text } from "@once-ui-system/core";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ActionRow } from "@/components/section-ui/action-row";
import {
	SectionHeading,
	SectionRoot,
	SectionText,
} from "@/components/section-ui/section-heading";
import config from "@/content/metadata.json" with { type: "json" };
import { socials } from "@/content/socials";
import { getProjects } from "@/lib/projects-content";

export const metadata: Metadata = {
	title: "Projects",
	description:
		"Write-ups from Davidson Rafael on the things he's built: reservation systems, commerce platforms, and inventory tooling using Next.js, TypeScript, and Postgres.",
	alternates: { canonical: "/projects" },
	openGraph: {
		title: `Projects — ${config.site.name}`,
		description:
			"Write-ups from Davidson Rafael on the things he's built: reservation systems, commerce platforms, and inventory tooling.",
		url: `${config.site.url}/projects`,
		type: "website",
	},
};

export default async function ProjectsPage() {
	const projects = await getProjects();

	const listSchema = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "CollectionPage",
				"@id": `${config.site.url}/projects`,
				name: "Projects",
				isPartOf: { "@id": `${config.site.url}/#website` },
				about: { "@id": `${config.site.url}/#person` },
			},
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Home",
						item: config.site.url,
					},
					{
						"@type": "ListItem",
						position: 2,
						name: "Projects",
						item: `${config.site.url}/projects`,
					},
				],
			},
			{
				"@type": "ItemList",
				numberOfItems: projects.length,
				itemListElement: projects.map((project, index) => ({
					"@type": "ListItem",
					position: index + 1,
					url: `${config.site.url}/projects/${project.slug}`,
					name: project.frontmatter.title,
				})),
			},
		],
	};

	return (
		<PageShell>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(listSchema).replace(/</g, "\\u003C"),
				}}
			/>
			<SectionRoot id="projects">
				<SectionHeading before="Selected" highlight="projects." />
				<SectionText>
					Longer write-ups of what I've built. What the problem actually was,
					and what I got wrong.
				</SectionText>

				<Column fillWidth gap={1.5} marginTop={1}>
					{projects.map((project) => (
						<Link
							key={project.slug}
							href={`/projects/${project.slug}`}
							className="rounded-2xl no-underline transition-opacity hover:opacity-80"
						>
							<Row fillWidth center gap={0.65} className="overflow-hidden">
								{project.frontmatter.cover && (
									<div className="size-[48px] shrink-0 overflow-hidden rounded-xl">
										<Image
											src={project.frontmatter.cover.src}
											alt={project.frontmatter.cover.alt}
											width={48}
											height={48}
											className="size-full object-cover"
											unoptimized
										/>
									</div>
								)}
								<Column
									fillWidth
									vertical="center"
									horizontal="start"
									className="min-w-0"
								>
									<Text className="font-body font-medium text-foreground/80 text-lg">
										{project.frontmatter.title}
									</Text>
									<span className="font-body font-normal text-md text-muted-foreground">
										{project.frontmatter.summary}
									</span>
								</Column>
							</Row>
						</Link>
					))}
				</Column>

				<ActionRow
					buttons={[
						{
							text: "Back home",
							boxColor: "bg-rose-500",
							pattern: "arrow",
							href: "/",
						},
						{
							text: "View on Github",
							boxColor: "bg-indigo-500",
							pattern: "repository",
							href: socials.github,
						},
					]}
				/>
			</SectionRoot>
		</PageShell>
	);
}
