import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

// Warm-neutral Shiki themes to match the stone/orange palette in globals.css.
// `keepBackground: false` drops Shiki's own surface so code blocks inherit our
// tokens and stay correct in both themes.
const prettyCodeOptions: PrettyCodeOptions = {
	theme: { light: "vitesse-light", dark: "vitesse-dark" },
	keepBackground: false,
	defaultLang: "tsx",
};

export const mdxOptions: MDXRemoteProps["options"] = {
	parseFrontmatter: false,
	mdxOptions: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
	},
};
