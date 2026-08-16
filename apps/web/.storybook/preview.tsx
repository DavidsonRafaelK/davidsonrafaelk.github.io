import { IconProvider, LayoutProvider } from "@once-ui-system/core";
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/nextjs";
import { domAnimation, LazyMotion } from "motion/react";
import { DM_Sans, Geist, Geist_Mono } from "next/font/google";
import { iconLibrary } from "../src/lib/icon-library";
import "../src/index.css";

// Mirrors app/layout.tsx so type scale and font stack match the real site.
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

const preview: Preview = {
	parameters: {
		layout: "fullscreen",
		controls: { expanded: true },
		options: {
			storySort: {
				order: [
					"Foundations",
					"Section",
					"Actions",
					"Stack",
					"Lists",
					"Content",
					"Text",
					"Charts",
					"Widgets",
					"Effects",
					"Showpieces",
				],
			},
		},
	},

	decorators: [
		// The site's dark mode is next-themes with attribute="class", so the
		// switcher toggles the same `.dark` class the real app uses.
		withThemeByClassName({
			themes: { light: "", dark: "dark" },
			defaultTheme: "light",
		}),

		(Story) => (
			<LayoutProvider>
				<IconProvider icons={iconLibrary}>
					<LazyMotion features={domAnimation}>
						<div
							className={`${dmSans.variable} ${geistSans.variable} ${geistMono.variable} bg-background font-sans`}
						>
							{/*
							 * Stories render inside the same rounded accent panel and 768px
							 * reading column as page.tsx, so spacing and measure are honest.
							 */}
							<div className="flex justify-center p-6">
								<div className="w-full rounded-3xl bg-accent p-8">
									<div className="mx-auto w-full max-w-[768px]">
										<Story />
									</div>
								</div>
							</div>
						</div>
					</LazyMotion>
				</IconProvider>
			</LayoutProvider>
		),
	],
};

export default preview;
