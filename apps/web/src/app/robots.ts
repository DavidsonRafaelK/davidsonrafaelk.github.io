import type { MetadataRoute } from "next";
import config from "@/content/metadata.json" with { type: "json" };

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${config.site.url}/sitemap.xml`,
	};
}
