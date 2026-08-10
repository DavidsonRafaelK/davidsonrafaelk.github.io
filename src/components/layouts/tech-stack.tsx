import type { ComponentType } from "react";

type Technology =
  | {
      name: string;
      icon: string;
    }
  | {
      name: string;
      Icon: ComponentType<{ className?: string }>;
    };

export const technologies: Technology[] = [
  { name: "Next.js", icon: "/icons/tech/nextjs-light.svg" },
  { name: "PHP", icon: "/icons/tech/php.svg" },
  { name: "Tailwind CSS", icon: "/icons/tech/tailwindcss.svg" },
  { name: "React", icon: "/icons/tech/react.svg" },
  { name: "Python", icon: "/icons/tech/python.svg" },
  { name: "Once UI", icon: "/icons/tech/once-ui-icon-light.svg" },
  { name: "shadcn/ui", icon: "/icons/tech/shadcn-ui.svg" },
  { name: "Drizzle", icon: "/icons/tech/drizzle.svg" },
  { name: "Supabase", icon: "/icons/tech/supabase.svg" },
  { name: "PostgreSQL", icon: "/icons/tech/postgresql.svg" },
  { name: "MySQL", icon: "/icons/tech/mysql.svg" },
  { name: "Git", icon: "/icons/tech/git.svg" },
  { name: "GitHub Actions", icon: "/icons/tech/github-actions.svg" },
  { name: "Linux", icon: "/icons/tech/linux.svg" },
  { name: "Biome", icon: "/icons/tech/biome.svg" },
  { name: "TypeScript", icon: "/icons/tech/typescript.svg" },
  { name: "Java", icon: "/icons/tech/java.svg" },
];

export function TechStack() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {technologies.map((tech) => (
        <div
          key={tech.name}
          className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm"
        >
          {"icon" in tech ? (
            // biome-ignore lint/performance/noImgElement: static local svg, no next/image benefit
            <img src={tech.icon} alt={tech.name} className="h-6 w-6 shrink-0" />
          ) : (
            <tech.Icon className="h-6 w-6 shrink-0 text-neutral-700" />
          )}
          <span className="text-sm font-normal text-neutral-700">
            {tech.name}
          </span>
        </div>
      ))}
    </div>
  );
}
