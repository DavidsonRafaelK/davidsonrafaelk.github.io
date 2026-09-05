import type { MetadataRoute } from "next";
import config from "@/content/metadata.json" with { type: "json" };

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: config.site.name,
		short_name: config.site.name,
		description: config.site.description,
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#cf885c",
		icons: [
			{
				src: "/icons/pwa/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/pwa/icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/pwa/icon-512-maskable.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}
