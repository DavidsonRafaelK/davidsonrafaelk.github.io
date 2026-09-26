import { dotsSvg } from "@/components/dotted-map";
import { homeMapGrid } from "@/content/map";

export const dynamic = "force-static";

/** The homepage map's dot grid, referenced by `<use>` from `MapSection`. */
export function GET() {
	return new Response(dotsSvg(homeMapGrid), {
		headers: {
			"Content-Type": "image/svg+xml",
			// Not content-hashed, so browsers revalidate after a day rather than
			// holding it forever; the CDN copy is replaced on every deploy.
			"Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
		},
	});
}
