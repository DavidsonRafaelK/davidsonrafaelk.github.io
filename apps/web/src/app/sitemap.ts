import type { MetadataRoute } from "next";
import config from "@/content/metadata.json" with { type: "json" };
import { getProjects } from "@/lib/projects-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const projects = await getProjects();

	// This route is statically prerendered, so the clock is read once during the
	// build rather than per request. Google treats a churning lastmod as noise.
	const buildDate = new Date();

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
