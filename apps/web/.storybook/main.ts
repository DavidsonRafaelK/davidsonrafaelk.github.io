import type { StorybookConfig } from "@storybook/nextjs";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
	// Docs pages are scoped to src/stories so the glob never picks up the
	// project case studies in src/content/projects.
	stories: ["../src/stories/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
	addons: [
		{
			name: "@storybook/addon-docs",
			options: {
				mdxPluginOptions: {
					// Docs pages lean on Markdown tables, which are GFM rather than
					// core Markdown. Without this they render as literal pipes.
					mdxCompileOptions: { remarkPlugins: [remarkGfm] },
				},
			},
		},
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
