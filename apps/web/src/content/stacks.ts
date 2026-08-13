export interface StackItem {
	url: string;
	label: string;
	color?: string;
	overrideMediaUrl?: string;
}

export interface StackCategory {
	category: string;
	parentColor: string;
	items: StackItem[];
}

export const stacksData: StackCategory[] = [
	{
		category: "Programming",
		parentColor: "border-blue-500",
		items: [
			{ url: "https://www.python.org", label: "Python" },
			{ url: "https://www.typescriptlang.org", label: "TypeScript" },
			{ url: "https://dev.java", label: "Java" },
			{ url: "https://www.php.net", label: "PHP" },
		],
	},
	{
		category: "Stack",
		parentColor: "border-amber-500",
		items: [
			{ url: "https://react.dev", label: "React" },
			{ url: "https://nextjs.org", label: "Next.js" },
			{ url: "https://tailwindcss.com", label: "Tailwind CSS" },
			{ url: "https://once-ui.com", label: "Once UI" },
			{ url: "https://ui.shadcn.com", label: "shadcn/ui" },
		],
	},
	{
		category: "Databases",
		parentColor: "border-teal-500",
		items: [
			{ url: "https://www.postgresql.org", label: "PostgreSQL" },
			{ url: "https://www.mysql.com", label: "MySQL" },
			{ url: "https://supabase.com", label: "Supabase" },
			{ url: "https://orm.drizzle.team", label: "Drizzle" },
		],
	},
	{
		category: "Others",
		parentColor: "border-gray-500",
		items: [
			{ url: "https://git-scm.com", label: "Git" },
			{ url: "https://github.com/features/actions", label: "GitHub Actions" },
			{ url: "https://biomejs.dev", label: "Biome" },
		],
	},
	{
		category: "DevOps / Cloud",
		parentColor: "border-cyan-500",
		items: [{ url: "https://www.linux.org", label: "Linux" }],
	},
];
