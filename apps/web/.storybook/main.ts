import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
	// Docs pages are scoped to src/stories so the glob never picks up the
	// project case studies in src/content/projects.
	stories: ["../src/stories/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
	addons: [
		"@storybook/addon-docs",
		"@storybook/addon-themes",
		"@storybook/addon-a11y",
	],
	framework: {
		name: "@storybook/nextjs",
		options: {},
	},
	staticDirs: ["../public"],
	typescript: {
		reactDocgen: "react-docgen-typescript",
	},
};

export default config;
