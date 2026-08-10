import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const intro =
  "I'm a developer who learns by building. Here are the projects and experiences that shaped how I work:";

type Experience = {
  title: string;
  organization: string;
  date: string;
  description: string;
};

const experiences: Experience[] = [
  {
    title: "Freelance Web Developer",
    organization: "Independent",
    date: "2025 – 2026",
    description:
      "Built web platforms for local food SMEs, replacing manual WhatsApp/Instagram workflows with automated ordering and inventory systems.",
  },
];

// id must stay in sync with the "Works" link in navbar.tsx.
export function WorkEducationSection() {
  return (
    <section className="mt-12" id="work-and-education">
      <h2 className="text-4xl">
        Work and <span className="text-neutral-400">Education.</span>
      </h2>
      <TextGenerateEffect words={intro} className="font-normal" />

      <div className="mt-8 w-full">
        {experiences.map((experience) => (
          <div
            key={experience.title}
            className="grid grid-cols-[1fr_auto] items-center gap-12"
          >
            <div>
              <h3 className="text-2xl tracking-tight">{experience.title}</h3>
              <p className="mt-3 max-w-3xl text-lg leading-relaxed">
                {experience.description}
              </p>
            </div>

            <div className="self-center whitespace-nowrap font-normal text-neutral-500 dark:text-neutral-400">
              {experience.organization} {experience.date}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
