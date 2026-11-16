import { education, experiences } from "@/content/experiences";
import config from "@/content/metadata.json" with { type: "json" };
import { socials } from "@/content/socials";
import { stacksData } from "@/content/stacks";
import { getLastModified, type ProjectDoc } from "@/lib/projects-content";

function formatRange(start: string, end?: string) {
	return `${start} - ${end ?? "Now"}`;
}

function isoDay(date: Date) {
	return date.toISOString().slice(0, 10);
}

export function projectUrl(doc: ProjectDoc) {
	return `${config.site.url}/projects/${doc.slug}`;
}

export const textHeaders = { "Content-Type": "text/plain; charset=utf-8" };

/**
 * The profile half of `llms.txt`, shared with `llms-full.txt`: everything
 * about the person, before the project list.
 */
export function buildProfile(docs: ProjectDoc[]) {
	const { person, site } = config;
	const email = socials.email.replace("mailto:", "");

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

	// Both routes are prerendered, so `new Date()` would only ever report the
	// build day. The newest write-up is the last time the content changed.
	const lastUpdated = getLastModified(docs);

	return `# ${site.name}

> ${site.description}

- Canonical URL: ${site.url}
- Role: ${person.jobTitle}
- Location: ${person.locality}, ${person.country}${lastUpdated ? `\n- Last updated: ${isoDay(lastUpdated)}` : ""}

## Overview
${site.name} is a web developer and Computer Science student at ${person.alumniOf.name} in ${person.locality}, ${person.country}. He builds full-stack web platforms — most often with Next.js, React, and TypeScript on the front end and Python or Node.js on the back end — and freelances on web projects alongside his studies. His other interest is AI/ML.

## Quick answers
- Who is ${site.name}? A ${person.jobTitle.toLowerCase()} and Computer Science student based in ${person.locality}, ${person.country}.
- Where does he study? ${person.alumniOf.name}, ${person.locality}.
- What does he build with? Mostly Next.js, React, and TypeScript, with Python or Node.js on the back end.
- Does he take freelance work? He freelances on web projects alongside his studies; email ${email}.
- Where is his code? ${socials.github}

## Work Experience
${work}

## Education
${edu}

## Skills & Stacks
${skills}

## Contact
- GitHub: ${socials.github}
- LinkedIn: ${socials.linkedin}
- Kaggle: ${socials.kaggle}
- Email: ${email}
`;
}

export function formatProjectDate(doc: ProjectDoc) {
	return isoDay(doc.frontmatter.publishedAt);
}
