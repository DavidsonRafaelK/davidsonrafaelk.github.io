import type { MetadataRoute } from "next";
import config from "@/content/metadata.json" with { type: "json" };
import { getProjects } from "@/lib/projects-content";

// Frozen at build time so `lastmod` reflects a real content release instead of
// changing on every request (Google treats a churning lastmod as noise).
const buildDate = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const projects = await getProjects();

	return [
		{
			url: config.site.url,
			lastModified: buildDate,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${config.site.url}/projects`,
			lastModified: projects[0]?.frontmatter.publishedAt ?? buildDate,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		...projects.map((project) => ({
			url: `${config.site.url}/projects/${project.slug}`,
			lastModified:
				project.frontmatter.updatedAt ?? project.frontmatter.publishedAt,
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
	];
}
