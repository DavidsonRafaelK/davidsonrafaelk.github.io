import type { DotGrid } from "@/components/dotted-map";

/** The homepage map: Southeast Asia, shared by the section and `/map/dots.svg`. */
export const homeMapGrid = {
	width: 150,
	height: 94,
	mapSamples: 10000,
	region: { lat: { min: -30, max: 30 }, lng: { min: 57, max: 157 } },
	dotRadius: 0.12,
} satisfies DotGrid;

export const homeMapDotsHref = "/map/dots.svg#dots";
