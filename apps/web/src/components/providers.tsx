"use client";

import { Toaster } from "@homepage/ui/components/sonner";
import {
	IconProvider,
	LayoutProvider,
	ToastProvider,
} from "@once-ui-system/core";
import { domAnimation, LazyMotion } from "motion/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PostHogProvider } from "@/components/analytics";
import { iconLibrary } from "@/lib/icon-library";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<LayoutProvider>
			<ToastProvider>
				<IconProvider icons={iconLibrary}>
					<NextThemesProvider
						attribute="class"
						defaultTheme="light"
						enableSystem
						disableTransitionOnChange
					>
						<LazyMotion features={domAnimation}>
							<PostHogProvider>{children}</PostHogProvider>
						</LazyMotion>
						<Toaster richColors />
					</NextThemesProvider>
				</IconProvider>
			</ToastProvider>
		</LayoutProvider>
	);
}
