import { education, experiences } from "@/content/experiences";
import config from "@/content/metadata.json" with { type: "json" };
import { projectsData } from "@/content/projects";
import { socials } from "@/content/socials";
import { stacksData } from "@/content/stacks";

function formatRange(start: string, end?: string) {
	return `${start} - ${end ?? "Now"}`;
}

export function GET() {
	const skills = stacksData
		.map(
			(cat) => `- ${cat.category}: ${cat.items.map((i) => i.label).join(", ")}`,
		)
		.join("\n");

	const work = experiences
		.map(
			(e) =>
				`- ${e.role} at ${e.company} (${formatRange(e.startDate, e.endDate)})`,
		)
		.join("\n");

	const edu = education
		.map(
			(e) =>
				`- ${e.role} at ${e.company} (${formatRange(e.startDate, e.endDate)})`,
		)
		.join("\n");

	const projects = projectsData
		.map(
			(p) =>
				`- ${p.title}: ${p.description}${p.repoUrl ? ` (${p.repoUrl})` : ""}`,
		)
		.join("\n");

	const body = `# ${config.site.name}

> ${config.site.description}

## Work Experience
${work}

## Education
${edu}

## Skills & Stacks
${skills}

## Projects
${projects}

## Contact
- GitHub: ${socials.github}
- LinkedIn: ${socials.linkedin}
- Kaggle: ${socials.kaggle}
- Email: ${socials.email}

## Site
${config.site.url}
`;

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
