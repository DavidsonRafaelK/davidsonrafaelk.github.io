import type { MetadataRoute } from "next";
import config from "@/content/metadata.json" with { type: "json" };

// Answer/generative engines are opted in explicitly so their crawlers do not
// fall back to a conservative default when they ignore the wildcard group.
const aiCrawlers = [
	"Google-Extended",
	"GPTBot",
	"OAI-SearchBot",
	"ChatGPT-User",
	"ClaudeBot",
	"Claude-User",
	"anthropic-ai",
	"PerplexityBot",
	"Perplexity-User",
	"Applebot-Extended",
	"CCBot",
	"Bingbot",
];

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{ userAgent: "*", allow: "/" },
			{ userAgent: aiCrawlers, allow: "/" },
		],
		sitemap: `${config.site.url}/sitemap.xml`,
		host: config.site.url,
	};
}
