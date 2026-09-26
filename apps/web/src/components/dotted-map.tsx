"use memo";

import { cn } from "@homepage/ui/lib/utils";
import type * as React from "react";
import { createMap } from "svg-dotted-map";
import { DeferredUse } from "@/components/deferred-use";

export interface Marker {
	lat: number;
	lng: number;
	size?: number;
	pulse?: boolean;
}

/** addMarkers returns markers with lat/lng removed; only x, y and other props (e.g. size) remain */
type MapMarker<M extends Marker> = Omit<M, "lat" | "lng"> & {
	x: number;
	y: number;
};

export interface Region {
	lat: { min: number; max: number };
	lng: { min: number; max: number };
}

/** Everything that decides where the dots land. */
export interface DotGrid {
	width?: number;
	height?: number;
	mapSamples?: number;
	region?: Region;
	dotRadius?: number;
	stagger?: boolean;
}

export interface DottedMapProps<M extends Marker = Marker>
	extends DotGrid,
		Omit<React.SVGProps<SVGSVGElement>, keyof DotGrid> {
	markers?: M[];
	dotColor?: string;
	markerColor?: string;
	pulse?: boolean;
	/**
	 * URL of a document produced by `dotsSvg()` for the same grid, as
	 * `path#dots`. The dots are then referenced with `<use>` instead of inlined,
	 * which keeps thousands of <circle>s out of the HTML and the RSC payload,
	 * and fetched only once the map nears the viewport.
	 */
	dotsHref?: string;

	renderMarkerOverlay?: (args: {
		marker: MapMarker<M>;
		index: number;
		x: number;
		y: number;
		r: number;
	}) => React.ReactNode;
}

const GRID_DEFAULTS = {
	width: 150,
	height: 75,
	mapSamples: 5000,
	dotRadius: 0.2,
	stagger: true,
} satisfies DotGrid;

/** Two decimals is far below a pixel at any size the map is drawn. */
const round = (n: number) => Math.round(n * 100) / 100;

function layoutGrid(grid: DotGrid) {
	const { width, height, mapSamples, region, stagger } = {
		...GRID_DEFAULTS,
		...grid,
	};
	const { points, addMarkers } = createMap({
		width,
		height,
		mapSamples,
		region,
	});

	// Compute stagger helpers in a single, simple pass
	const { xStep, yToRowIndex } = (() => {
		const sorted = points.toSorted((a, b) => a.y - b.y || a.x - b.x);
		const rowMap = new Map<number, number>();
		let step = 0;
		let prevY = Number.NaN;
		let prevXInRow = Number.NaN;

		for (const p of sorted) {
			if (p.y !== prevY) {
				// new row
				prevY = p.y;
				prevXInRow = Number.NaN;
				if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size);
			}
			if (!Number.isNaN(prevXInRow)) {
				const delta = p.x - prevXInRow;
				if (delta > 0) step = step === 0 ? delta : Math.min(step, delta);
			}
			prevXInRow = p.x;
		}

		return { xStep: step || 1, yToRowIndex: rowMap };
	})();

	const offsetX = (y: number) => {
		const rowIndex = yToRowIndex.get(y) ?? 0;
		return stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
	};

	return { points, addMarkers, offsetX };
}

/**
 * The dot grid as a standalone SVG document for `dotsHref`. The circles carry
 * no fill of their own, so they take the fill (and `currentColor`) of the
 * `<use>` that references `#dots`.
 */
export function dotsSvg(grid: DotGrid) {
	const { width, height, dotRadius } = { ...GRID_DEFAULTS, ...grid };
	const { points, offsetX } = layoutGrid(grid);
	const circles = points
		.map(
			(p) =>
				`<circle cx="${round(p.x + offsetX(p.y))}" cy="${round(p.y)}" r="${dotRadius}"/>`,
		)
		.join("");
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><g id="dots">${circles}</g></svg>`;
}

export function DottedMap<M extends Marker = Marker>({
	width = GRID_DEFAULTS.width,
	height = GRID_DEFAULTS.height,
	mapSamples = GRID_DEFAULTS.mapSamples,
	region,
	markers = [],
	dotColor = "currentColor",
	markerColor = "#FF6900",
	dotRadius = GRID_DEFAULTS.dotRadius,
	stagger = GRID_DEFAULTS.stagger,
	pulse = false,
	dotsHref,
	renderMarkerOverlay,
	className,
	style,
	...svgProps
}: DottedMapProps<M>) {
	const { points, addMarkers, offsetX } = layoutGrid({
		width,
		height,
		mapSamples,
		region,
		stagger,
	});
	const processedMarkers = addMarkers(markers);

	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			className={cn("text-gray-500 dark:text-gray-500", className)}
			style={{ width: "100%", height: "100%", ...style }}
			{...svgProps}
			aria-label="World map with highlighted locations"
		>
			<title>World Map</title>
			{dotsHref ? (
				<DeferredUse href={dotsHref} fill={dotColor} />
			) : (
				points.map((point, index) => (
					<circle
						cx={point.x + offsetX(point.y)}
						cy={point.y}
						r={dotRadius}
						fill={dotColor}
						key={`${point.x}-${point.y}-${index}`}
					/>
				))
			)}

			{processedMarkers.map((marker, index) => {
				const x = marker.x + offsetX(marker.y);
				const y = marker.y;
				const r = marker.size ?? dotRadius;
				const shouldPulse = pulse
					? marker.pulse !== false
					: marker.pulse === true;
				const pulseTo = r * 2.8;

				return (
					<g key={`${marker.x}-${marker.y}-${index}`}>
						<circle cx={x} cy={y} r={r} fill={markerColor} />

						{shouldPulse ? (
							<g pointerEvents="none">
								<circle
									cx={x}
									cy={y}
									r={r}
									fill="none"
									stroke={markerColor}
									strokeOpacity={1}
									strokeWidth={0.35}
								>
									<animate
										attributeName="r"
										values={`${r};${pulseTo}`}
										dur="1.4s"
										repeatCount="indefinite"
									/>
									<animate
										attributeName="opacity"
										values="1;0"
										dur="1.4s"
										repeatCount="indefinite"
									/>
								</circle>
								<circle
									cx={x}
									cy={y}
									r={r}
									fill="none"
									stroke={markerColor}
									strokeOpacity={0.9}
									strokeWidth={0.3}
								>
									<animate
										attributeName="r"
										values={`${r};${pulseTo}`}
										dur="1.4s"
										begin="0.7s"
										repeatCount="indefinite"
									/>
									<animate
										attributeName="opacity"
										values="0.9;0"
										dur="1.4s"
										begin="0.7s"
										repeatCount="indefinite"
									/>
								</circle>
							</g>
						) : null}

						{renderMarkerOverlay?.({
							marker: { ...marker, x, y },
							index,
							x,
							y,
							r,
						})}
					</g>
				);
			})}
		</svg>
	);
}
