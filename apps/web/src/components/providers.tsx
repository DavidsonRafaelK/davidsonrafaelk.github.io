"use client";

import { LayoutProvider } from "@once-ui-system/core";
import { domAnimation, LazyMotion } from "motion/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PostHogProvider } from "@/components/analytics";

/**
 * Only providers something on the page reads. Once UI's ToastProvider and
 * IconProvider, and the sonner Toaster, had no consumers (nothing calls
 * `toast()`, `useToast` or renders Once UI's `Icon`) but pulled floating-ui,
 * react-icons and sonner into every page's bundle.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<LayoutProvider>
			<NextThemesProvider
				attribute="class"
				defaultTheme="light"
				enableSystem
				disableTransitionOnChange
			>
				<LazyMotion features={domAnimation}>
					<PostHogProvider>{children}</PostHogProvider>
				</LazyMotion>
			</NextThemesProvider>
		</LayoutProvider>
	);
}
