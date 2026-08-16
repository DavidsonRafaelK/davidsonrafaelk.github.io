import type { MetadataRoute } from "next";
import config from "@/content/metadata.json" with { type: "json" };

// Frozen at build time so `lastmod` reflects a real content release instead of
// changing on every request (Google treats a churning lastmod as noise).
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: config.site.url,
			lastModified,
			changeFrequency: "weekly",
			priority: 1,
		},
	];
}
