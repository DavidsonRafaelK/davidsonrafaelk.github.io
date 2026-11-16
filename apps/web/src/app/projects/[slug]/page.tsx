import { Column, Row } from "@once-ui-system/core";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Inline } from "@/components/inline";
import { mdxComponents } from "@/components/mdx-components";
import { PageShell } from "@/components/page-shell";
import { ProjectList } from "@/components/project-list";
import { ProjectStackRow } from "@/components/project-stack-row";
import { ActionRow } from "@/components/section-ui/action-row";
import {
	SectionHeading,
	SectionRoot,
	SectionText,
} from "@/components/section-ui/section-heading";
import { toSafeJson } from "@/content/json-ld";
import config from "@/content/metadata.json" with { type: "json" };
import { mdxOptions } from "@/lib/mdx";
import {
	getProject,
	getProjectSlugs,
	getProjects,
} from "@/lib/projects-content";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	const slugs = await getProjectSlugs();
	return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const project = await getProject(slug);
	if (!project || project.frontmatter.draft) return {};

	const { summary, publishedAt, updatedAt, cover } = project.frontmatter;
	const title = project.frontmatter.seoTitle ?? project.frontmatter.title;
	const url = `${config.site.url}/projects/${slug}`;

	// Setting `openGraph` here replaces the root object rather than merging into
	// it, so the share image has to be repeated or the card ships without one.
	const image = cover?.src ?? config.openGraph.image;

	return {
		title,
		description: summary,
		alternates: { canonical: `/projects/${slug}` },
		openGraph: {
			title: `${title} — ${config.site.name}`,
			description: summary,
			url,
			type: "article",
			publishedTime: publishedAt.toISOString(),
			modifiedTime: (updatedAt ?? publishedAt).toISOString(),
			authors: [config.site.url],
			images: [{ url: image, alt: cover?.alt ?? title }],
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} — ${config.site.name}`,
			description: summary,
			images: [image],
		},
	};
}

function formatDate(date: Date) {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	});
}

export default async function ProjectPage({ params }: PageProps) {
	const { slug } = await params;
	const project = await getProject(slug);
	if (!project || project.frontmatter.draft) notFound();

	const { frontmatter } = project;
	const { content } = await compileMDX({
		source: project.body,
		options: mdxOptions,
		components: mdxComponents,
	});

	const otherProjects = (await getProjects()).filter(
		(other) => other.slug !== slug,
	);

	const url = `${config.site.url}/projects/${slug}`;
	const person = { "@id": `${config.site.url}/#person` };
	const keywords = frontmatter.stack.join(", ");
	const articleSchema = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "TechArticle",
				"@id": `${url}#article`,
				url,
				headline: frontmatter.seoTitle ?? frontmatter.title,
				description: frontmatter.summary,
				inLanguage: "en",
				datePublished: frontmatter.publishedAt.toISOString(),
				dateModified: (
					frontmatter.updatedAt ?? frontmatter.publishedAt
				).toISOString(),
				author: person,
				publisher: person,
				isPartOf: { "@id": `${config.site.url}/#website` },
				mainEntityOfPage: url,
				keywords,
				image:
					frontmatter.cover?.src ??
					`${config.site.url}${config.openGraph.image}`,
			},
			// Only when there is a repository to point at; `stack` mixes languages
			// with tools and techniques, so it is not a `programmingLanguage`.
			...(frontmatter.repoUrl
				? [
						{
							"@type": "SoftwareSourceCode",
							name: frontmatter.title,
							description: frontmatter.summary,
							url,
							author: person,
							keywords,
							codeRepository: frontmatter.repoUrl,
						},
					]
				: []),
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
					{
						"@type": "ListItem",
						position: 3,
						name: frontmatter.title,
						item: url,
					},
				],
			},
		],
	};

	return (
		<PageShell>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: toSafeJson(articleSchema) }}
			/>

			<SectionRoot id="project">
				<Inline
					as="h1"
					className="font-display font-s text-foreground"
					style={{ fontWeight: "500" }}
				>
					{frontmatter.title}
				</Inline>

				<SectionText>{frontmatter.summary}</SectionText>

				<Row fillWidth vertical="center">
					<span className="font-body font-medium text-stone-500 text-xs">
						Published{" "}
						<time dateTime={frontmatter.publishedAt.toISOString()}>
							{formatDate(frontmatter.publishedAt)}
						</time>
					</span>
				</Row>

				<Row fillWidth marginTop={0.5}>
					<ProjectStackRow stack={frontmatter.stack} />
				</Row>

				{frontmatter.cover && (
					<Column fillWidth marginTop={1}>
						<Image
							src={frontmatter.cover.src}
							alt={frontmatter.cover.alt}
							width={768}
							height={432}
							sizes="(max-width: 768px) 100vw, 768px"
							className="h-auto w-full rounded-2xl object-cover"
							unoptimized
						/>
					</Column>
				)}

				<Column fillWidth gap={1} marginTop={1}>
					{content}
				</Column>

				<ActionRow
					buttons={[
						...(frontmatter.liveUrl
							? [
									{
										text: "See it live",
										boxColor: "bg-teal-500",
										pattern: "globe" as const,
										href: frontmatter.liveUrl,
									},
								]
							: []),
						...(frontmatter.repoUrl
							? [
									{
										text: "Read the code",
										boxColor: "bg-indigo-500",
										pattern: "repository" as const,
										href: frontmatter.repoUrl,
									},
								]
							: []),
						{
							text: "All projects",
							boxColor: "bg-orange-500",
							pattern: "arrow" as const,
							href: "/projects",
						},
					]}
				/>
			</SectionRoot>

			{/* Each write-up links to the others, so none of them depends on the
			    /projects index as its only way in. */}
			{otherProjects.length > 0 && (
				<SectionRoot id="more-projects">
					<SectionHeading before="More" highlight="projects." />
					<ProjectList projects={otherProjects} />
				</SectionRoot>
			)}
		</PageShell>
	);
}
