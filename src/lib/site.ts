// Shared site-wide constants for metadata, OG image, robots.ts and sitemap.ts.
// NEXT_PUBLIC_SITE_URL should be set in production; falls back to localhost for dev/preview builds.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteName = "Davidson Rafael";

export const siteDescription =
  "Portfolio of Davidson Rafael, a web developer building modern, scalable web platforms with Next.js, React, and Python.";

export const siteKeywords = [
  "Davidson Rafael",
  "web developer",
  "full stack developer",
  "Next.js developer",
  "React developer",
  "portfolio",
  "freelance web developer",
];
