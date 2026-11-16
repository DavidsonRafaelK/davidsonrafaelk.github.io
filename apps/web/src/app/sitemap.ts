import type { MetadataRoute } from "next";
import config from "@/content/metadata.json" with { type: "json" };
import { getLastModified, getProjects } from "@/lib/projects-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const projects = await getProjects();

	// The jokes workflow commits, and so redeploys, almost daily. A build-time
	// clock would report the homepage as modified every day when only a joke
	// changed, and Google stops trusting a lastmod that churns like that. The
	// newest write-up is the last change a crawler would care about.
	const lastModified = getLastModified(projects) ?? new Date();

	return [
		{
			url: config.site.url,
			lastModified,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${config.site.url}/projects`,
			lastModified,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		...projects.map((project) => ({
			url: `${config.site.url}/projects/${project.slug}`,
			lastModified: getLastModified([project]),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
	];
}
