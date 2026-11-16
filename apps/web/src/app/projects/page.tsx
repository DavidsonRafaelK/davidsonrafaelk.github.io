import { Column } from "@once-ui-system/core";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ProjectList } from "@/components/project-list";
import { ActionRow } from "@/components/section-ui/action-row";
import {
	SectionHeading,
	SectionRoot,
	SectionText,
} from "@/components/section-ui/section-heading";
import { toSafeJson } from "@/content/json-ld";
import config from "@/content/metadata.json" with { type: "json" };
import { socials } from "@/content/socials";
import { getProjects } from "@/lib/projects-content";

const title = "Projects & Case Studies";
const description =
	"Project case studies by Davidson Rafael, a web developer in Jakarta: what each one solves, how it was built, and what went wrong along the way.";

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: "/projects" },
	openGraph: {
		title: `${title} — ${config.site.name}`,
		description,
		url: `${config.site.url}/projects`,
		type: "website",
		// `openGraph` replaces the root object instead of merging, so the share
		// image has to be repeated here.
		images: [{ url: config.openGraph.image, width: 1200, height: 630 }],
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
				url: `${config.site.url}/projects`,
				name: title,
				description,
				inLanguage: "en",
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
				dangerouslySetInnerHTML={{ __html: toSafeJson(listSchema) }}
			/>
			<SectionRoot id="projects">
				<SectionHeading as="h1" before="Selected" highlight="projects." />
				<SectionText>
					Longer write-ups of what I've built. What the problem actually was,
					and what I got wrong.
				</SectionText>

				<Column fillWidth marginTop={1}>
					<ProjectList projects={projects} />
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
