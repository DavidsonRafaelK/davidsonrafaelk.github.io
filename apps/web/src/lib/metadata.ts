import type { Metadata } from "next";
import config from "@/content/metadata.json" with { type: "json" };
import { socials } from "@/content/socials";

export function getMetadata(): Metadata {
	return {
		title: {
			default: config.site.title,
			template: `%s — ${config.site.name}`,
		},
		description: config.site.description,
		metadataBase: new URL(config.site.url),
		applicationName: config.site.name,
		authors: [{ name: config.site.name, url: config.site.url }],
		creator: config.site.name,
		publisher: config.site.name,
		alternates: {
			canonical: "/",
			types: {
				"text/plain": [{ url: "/llms.txt", title: "llms.txt" }],
			},
		},
		icons: {
			icon: [
				{ url: "/icons/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
				{ url: "/icons/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
			],
			apple: [{ url: "/icons/pwa/apple-touch-icon.png", sizes: "180x180" }],
		},
		openGraph: {
			title: config.site.title,
			description: config.site.description,
			url: config.site.url,
			siteName: config.site.name,
			locale: config.openGraph.locale,
			type: "profile",
			firstName: config.person.givenName,
			lastName: config.person.familyName,
			images: [
				{
					url: config.openGraph.image,
					width: 1200,
					height: 630,
					alt: `${config.site.name} — ${config.person.jobTitle}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: config.site.title,
			description: config.site.description,
			images: [config.twitter.image],
		},
		robots: {
			index: config.robots.index,
			follow: config.robots.follow,
			googleBot: {
				index: config.robots.index,
				follow: config.robots.follow,
				"max-snippet": -1,
				"max-image-preview": "large",
				"max-video-preview": -1,
			},
		},
		other: {
			"profile:username": new URL(socials.github).pathname.slice(1),
		},
	};
}
