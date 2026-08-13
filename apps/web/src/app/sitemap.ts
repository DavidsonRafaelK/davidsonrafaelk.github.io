import type { MetadataRoute } from "next";
import config from "@/content/metadata.json" with { type: "json" };

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: config.site.url,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
	];
}
