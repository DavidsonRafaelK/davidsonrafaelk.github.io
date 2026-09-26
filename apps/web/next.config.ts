import "@homepage/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	allowedDevOrigins: ["10.26.216.207"],
	images: {
		// Every source here is effectively static; the 4 hour default re-ran
		// optimization for the same images several times a day.
		minimumCacheTTL: 2678400,
		remotePatterns: [
			{ protocol: "https", hostname: "i.pinimg.com" },
			{ protocol: "https", hostname: "mritcuhqiyieibsbspwt.supabase.co" },
			{ protocol: "https", hostname: "www.google.com" },
			{ protocol: "https", hostname: "i.scdn.co" },
			{ protocol: "https", hostname: "img.avatardecoration.com" },
			{ protocol: "https", hostname: "cdn.cosmos.so" },
			{ protocol: "https", hostname: "avatars.githubusercontent.com" },
			{ protocol: "https", hostname: "raw.githubusercontent.com" },
			{ protocol: "https", hostname: "skiper-ui.com" },
		],
	},
	async headers() {
		// Baked in at build time by Vercel. It lets the post-deploy check confirm
		// which build is actually answering, instead of trusting that any 200 came
		// from the deployment it just triggered. Absent on local builds.
		const commitSha = process.env.VERCEL_GIT_COMMIT_SHA;

		// Media in /public changes rarely but is not content-hashed, so it gets a
		// week of freshness plus a long revalidate window rather than `immutable`.
		const publicMedia = [
			{
				key: "Cache-Control",
				value: "public, max-age=604800, stale-while-revalidate=2592000",
			},
		];

		return [
			{ source: "/images/:path*", headers: publicMedia },
			{ source: "/icons/stacks/:path*", headers: publicMedia },
			{ source: "/:file([^/]+\\.(?:webp|mp3))", headers: publicMedia },
			{
				source: "/(.*)",
				headers: [
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					...(commitSha ? [{ key: "X-Commit-Sha", value: commitSha }] : []),
				],
			},
		];
	},
	async rewrites() {
		return [
			{
				source: "/a/static/:path*",
				destination: "https://us-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/a/:path*",
				destination: "https://us.i.posthog.com/:path*",
			},
		];
	},
};

export default nextConfig;
