export type StackIcon = {
	src: string;
	/** Single-colour logo that needs inverting so it stays visible in dark mode. */
	mono?: boolean;
};

/**
 * Locally hosted logos, keyed by the label used in `stacks.ts` and in project
 * frontmatter. Serving these ourselves avoids a Google favicon request per chip
 * and stops the icons changing whenever a site swaps its favicon.
 *
 * Coloured marks come from devicon, single-colour ones from simple-icons.
 */
export const stackIcons: Record<string, StackIcon> = {
	Biome: { src: "/icons/stacks/biome.svg", mono: true },
	Drizzle: { src: "/icons/stacks/drizzle.svg", mono: true },
	Git: { src: "/icons/stacks/git.svg" },
	"GitHub Actions": { src: "/icons/stacks/githubactions.svg" },
	Java: { src: "/icons/stacks/java.svg" },
	JavaScript: { src: "/icons/stacks/javascript.svg" },
	Linux: { src: "/icons/stacks/linux.svg", mono: true },
	MySQL: { src: "/icons/stacks/mysql.svg" },
	"Next.js": { src: "/icons/stacks/nextjs.svg", mono: true },
	"Once UI": { src: "/onceui.webp" },
	PHP: { src: "/icons/stacks/php.svg" },
	PostgreSQL: { src: "/icons/stacks/postgresql.svg" },
	Python: { src: "/icons/stacks/python.svg" },
	React: { src: "/icons/stacks/react.svg" },
	Supabase: { src: "/icons/stacks/supabase.svg" },
	"Tailwind CSS": { src: "/icons/stacks/tailwindcss.svg" },
	TypeScript: { src: "/icons/stacks/typescript.svg" },
	"shadcn/ui": { src: "/icons/stacks/shadcnui.svg", mono: true },
};

export function getStackIcon(label: string): StackIcon | undefined {
	return stackIcons[label];
}
