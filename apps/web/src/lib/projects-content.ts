import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_DIR = join(process.cwd(), "src/content/projects");

// Frontmatter is validated at build time so a post can never ship with an empty
// meta description or an unparseable date — it fails the build instead.
const frontmatterSchema = z.object({
	title: z.string().min(1),
	summary: z.string().min(50).max(160),
	publishedAt: z.coerce.date(),
	updatedAt: z.coerce.date().optional(),
	role: z.string().min(1),
	stack: z.array(z.string()).min(1),
	repoUrl: z.url().optional(),
	liveUrl: z.url().optional(),
	cover: z
		.object({
			src: z.string().min(1),
			alt: z.string().min(1),
		})
		.optional(),
	draft: z.boolean().default(false),
});

export type ProjectFrontmatter = z.infer<typeof frontmatterSchema>;

export type ProjectDoc = {
	slug: string;
	frontmatter: ProjectFrontmatter;
	body: string;
};

async function readDoc(fileName: string): Promise<ProjectDoc> {
	const slug = fileName.replace(/\.mdx$/, "");
	const raw = await readFile(join(CONTENT_DIR, fileName), "utf8");
	const { data, content } = matter(raw);
	const parsed = frontmatterSchema.safeParse(data);

	if (!parsed.success) {
		throw new Error(
			`Invalid frontmatter in content/projects/${fileName}:\n${z.prettifyError(parsed.error)}`,
		);
	}

	return { slug, frontmatter: parsed.data, body: content };
}

async function readAllDocs(): Promise<ProjectDoc[]> {
	let fileNames: string[];
	try {
		fileNames = await readdir(CONTENT_DIR);
	} catch {
		return [];
	}

	const pending: Promise<ProjectDoc>[] = [];
	for (const name of fileNames) {
		if (name.endsWith(".mdx")) pending.push(readDoc(name));
	}

	const docs = await Promise.all(pending);

	return docs.sort(
		(a, b) =>
			b.frontmatter.publishedAt.getTime() - a.frontmatter.publishedAt.getTime(),
	);
}

/** Published docs only — drafts stay out of listings, sitemap and llms.txt. */
export async function getProjects(): Promise<ProjectDoc[]> {
	const docs = await readAllDocs();
	return docs.filter((doc) => !doc.frontmatter.draft);
}

export async function getProject(slug: string): Promise<ProjectDoc | null> {
	const docs = await readAllDocs();
	return docs.find((doc) => doc.slug === slug) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
	const docs = await getProjects();
	return docs.map((doc) => doc.slug);
}
