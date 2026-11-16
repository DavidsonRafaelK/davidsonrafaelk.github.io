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
	"Claude-SearchBot",
	"anthropic-ai",
	"PerplexityBot",
	"Perplexity-User",
	"Applebot-Extended",
	"CCBot",
	"Amazonbot",
	"DuckAssistBot",
	"meta-externalagent",
	"Bingbot",
];

// Not content: the insights/weather JSON endpoints and the PostHog proxy. A
// crawler that matches a named group ignores the wildcard one, so the same
// exclusions are repeated in both.
const disallow = ["/api/", "/a/"];

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{ userAgent: "*", allow: "/", disallow },
			{ userAgent: aiCrawlers, allow: "/", disallow },
		],
		sitemap: `${config.site.url}/sitemap.xml`,
	};
}
