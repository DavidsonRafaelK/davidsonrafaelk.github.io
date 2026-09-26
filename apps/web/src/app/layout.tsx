import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "../index.css";
import { cn } from "@homepage/ui/lib/utils";
import { Flex } from "@once-ui-system/core";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { CursorFollower } from "@/components/cursor-follower";
import Providers from "@/components/providers";
import { SmoothScroll } from "@/components/smooth-scroll";
import { JsonLd } from "@/content/json-ld";
import { getMetadata } from "@/lib/metadata";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = getMetadata();

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#cf885c",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn("font-sans", dmSans.variable)}
		>
			<head>
				{/* <Script
					src="//unpkg.com/react-scan/dist/auto.global.js"
					crossOrigin="anonymous"
					strategy="beforeInteractive"
				/> */}
			</head>
			<body className="overflow-x-hidden antialiased">
				<SmoothScroll />
				<JsonLd />
				<Analytics />
				<SpeedInsights /> <CursorFollower />
				<main>
					<Providers>
						<Flex
							fillWidth
							fillHeight
							className="bg-border dark:bg-accent-foreground"
							horizontal="center"
							vertical="start"
						>
							{children}
						</Flex>
					</Providers>{" "}
				</main>
			</body>
		</html>
	);
}
