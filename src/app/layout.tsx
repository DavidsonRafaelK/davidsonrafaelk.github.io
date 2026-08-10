import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { NavProgressiveBlur } from "@/components/layouts/nav-progressive-blur";
import { NavBar } from "@/components/layouts/navbar";
import { SiteFooter } from "@/components/layouts/site-footer";
import { SmoothScroll } from "@/components/layouts/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
import { siteDescription, siteKeywords, siteName, siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const dmSansHeading = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Web Developer`,
    template: `%s — ${siteName}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} — Web Developer`,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Web Developer`,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        roboto.variable,
        dmSansHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Global: smooth-scroll behavior, nav, and footer wrap every route. */}
          <SmoothScroll />
          <NavProgressiveBlur />
          <NavBar />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
