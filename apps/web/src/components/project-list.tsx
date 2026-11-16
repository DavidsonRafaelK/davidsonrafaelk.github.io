import { Column, Row, Text } from "@once-ui-system/core";
import Image from "next/image";
import Link from "next/link";
import type { ProjectDoc } from "@/lib/projects-content";

/** Linked rows of project write-ups: cover thumbnail, title and summary. */
export function ProjectList({ projects }: { projects: ProjectDoc[] }) {
	return (
		<Column fillWidth gap={1.5}>
			{projects.map((project) => (
				<Link
					key={project.slug}
					href={`/projects/${project.slug}`}
					className="rounded-2xl no-underline transition-opacity hover:opacity-80"
				>
					<Row fillWidth center gap={0.65} className="overflow-hidden">
						{project.frontmatter.cover && (
							<div className="size-[48px] shrink-0 overflow-hidden rounded-xl">
								<Image
									src={project.frontmatter.cover.src}
									alt={project.frontmatter.cover.alt}
									width={48}
									height={48}
									className="size-full object-cover"
									unoptimized
								/>
							</div>
						)}
						<Column
							fillWidth
							vertical="center"
							horizontal="start"
							className="min-w-0"
						>
							<Text className="font-body font-medium text-foreground/80 text-lg">
								{project.frontmatter.title}
							</Text>
							<span className="font-body font-normal text-md text-muted-foreground">
								{project.frontmatter.summary}
							</span>
						</Column>
					</Row>
				</Link>
			))}
		</Column>
	);
}
