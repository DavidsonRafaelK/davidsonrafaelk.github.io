import { MasonryGrid, Media } from "@once-ui-system/core";
import { Lens } from "@/components/lens";

const BUCKET =
	"https://mritcuhqiyieibsbspwt.supabase.co/storage/v1/object/public/assets/site-media/6de62dbd-d8d4-43b9-915c-f7ea250938d5";

const images = [
	{
		src: `${BUCKET}/1781017684713-fxr10o.jpg`,
		alt: "Pink tulips against a blue sky, overlaid with a grid of ASCII characters",
	},
	{
		src: `${BUCKET}/1781021304729-jzuf4f.png`,
		alt: "Pixel art of a ruined stone tower in fog, mountains behind it and purple heather in front",
	},
	{
		src: `${BUCKET}/1781015525373-1yythf.jpg`,
		alt: "Clouds banked against a deep green sky, screened with a chevron halftone pattern",
	},
	{
		src: `${BUCKET}/1781015567660-0m349m.jpg`,
		alt: "Motion-blurred grass and sky in green, gold and blue, dotted with a fine character texture",
	},
	{
		src: `${BUCKET}/1781017857397-neo5cq.png`,
		alt: "Towering clouds rendered in one-bit black and white dither",
	},
	{
		src: `${BUCKET}/1781015545636-vzy0p5.jpg`,
		alt: "Sand dunes at sunset, one ridge catching orange light while the rest falls into shadow",
	},
];

const aspectRatios = ["3 / 4", "4 / 3", "3 / 4", "4 / 5", "1 / 1", "4 / 3"];

export default function PhotoGrid({ id }: { id: string }) {
	return (
		<MasonryGrid
			id={id}
			columns={3}
			m={{ columns: 2 }}
			s={{ columns: 1 }}
			xs={{ columns: 1 }}
			gap="12"
		>
			{images.map((image, i) => (
				<Lens key={image.src}>
					<Media
						src={image.src}
						alt={image.alt}
						className="rounded-2xl"
						aspectRatio={aspectRatios[i]}
					/>
				</Lens>
			))}
		</MasonryGrid>
	);
}
