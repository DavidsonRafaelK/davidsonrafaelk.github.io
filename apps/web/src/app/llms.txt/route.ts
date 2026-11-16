import config from "@/content/metadata.json" with { type: "json" };
import { buildProfile, projectUrl, textHeaders } from "@/lib/llms";
import { getProjects } from "@/lib/projects-content";

// Built once per deploy: the content only changes with a commit, and this
// keeps the filesystem read out of the request path.
export const dynamic = "force-static";

export async function GET() {
	const docs = await getProjects();

	// The llms.txt link-list form: `- [name](url): notes`.
	const projects = docs
		.map((doc) => {
			const { title, summary, repoUrl } = doc.frontmatter;
			const source = repoUrl ? ` Source: ${repoUrl}` : "";
			return `- [${title}](${projectUrl(doc)}): ${summary}${source}`;
		})
		.join("\n");

	const body = `${buildProfile(docs)}
## Projects
${projects}

## Optional
- [Full project write-ups](${config.site.url}/llms-full.txt): every case study on this site as one Markdown file
- [Resume](${config.site.url}/files/Davidson_Rafael_Resume.pdf): PDF
- [Sitemap](${config.site.url}/sitemap.xml)
`;

	return new Response(body, { headers: textHeaders });
}
