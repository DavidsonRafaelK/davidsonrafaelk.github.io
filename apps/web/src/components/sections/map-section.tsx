import { Flex } from "@once-ui-system/core";
import type { TCountryCode } from "countries-list";
import { DottedMap, type Marker } from "@/components/dotted-map";

type MyMarker = Marker & {
	overlay: {
		countryCode: TCountryCode;
		label: string;
	};
};

const markers: MyMarker[] = [
	{
		lat: -6.2088,
		lng: 106.8456,
		size: 1,
		overlay: { countryCode: "ID", label: "Jakarta" },
	},
];

export default function MapSection({ id }: { id: string }) {
	return (
		<Flex id={id} fillWidth fitHeight>
			<DottedMap<MyMarker>
				width={150}
				height={94}
				mapSamples={10000}
				region={{ lat: { min: -30, max: 30 }, lng: { min: 57, max: 157 } }}
				dotRadius={0.12}
				markers={markers}
				pulse={true}
				renderMarkerOverlay={({ marker, x, y, r }) => {
					const { label } = marker.overlay;
					const fontSize = r * 2.5;
					const pillH = r * 5.5;
					const pillW = label.length * (fontSize * 0.62) + r * 1;
					const pillX = x + r + r * 1.8;
					const pillY = y - pillH / 2;
					return (
						<g style={{ pointerEvents: "none" }} className="scale-1.8">
							<rect
								x={pillX}
								y={pillY}
								width={pillW}
								height={pillH}
								rx={pillH / 2}
								fill="rgba(0,0,0,0.55)"
							/>
							<text
								x={pillX + r * 0.7}
								y={y + fontSize * 0.35}
								fontSize={fontSize}
								fill="white"
							>
								{label}
							</text>
						</g>
					);
				}}
			/>
		</Flex>
	);
}
