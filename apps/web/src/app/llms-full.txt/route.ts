import {
	buildProfile,
	formatProjectDate,
	projectUrl,
	textHeaders,
} from "@/lib/llms";
import { getProjects } from "@/lib/projects-content";

// Built once per deploy: the content only changes with a commit, and this
// keeps the filesystem read out of the request path.
export const dynamic = "force-static";

/**
 * `llms.txt` with the project write-ups inlined, so an answer engine can read
 * the whole site in one request instead of rendering each page. The MDX bodies
 * are plain Markdown (no imports or JSX), so they are served as written.
 */
export async function GET() {
	const docs = await getProjects();

	const projects = docs
		.map((doc) => {
			const { title, summary, role, stack, repoUrl, liveUrl } = doc.frontmatter;
			const facts = [
				`- URL: ${projectUrl(doc)}`,
				`- Published: ${formatProjectDate(doc)}`,
				`- Role: ${role}`,
				`- Stack: ${stack.join(", ")}`,
				...(repoUrl ? [`- Source: ${repoUrl}`] : []),
				...(liveUrl ? [`- Live: ${liveUrl}`] : []),
			].join("\n");

			// Body headings start at `##`; push them one level down so each
			// write-up nests under its own project heading.
			const body = doc.body.trim().replace(/^(#{2,5}) /gm, "#$1 ");

			return `## ${title}

> ${summary}

${facts}

${body}`;
		})
		.join("\n\n---\n\n");

	const body = `${buildProfile(docs)}
---

${projects}
`;

	return new Response(body, { headers: textHeaders });
}
