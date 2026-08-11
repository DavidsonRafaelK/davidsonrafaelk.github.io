import { TechStack } from "@/components/layouts/tech-stack";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const intro = "Here's a snapshot of the technologies i work with regularly:";

// id must stay in sync with the "Skills & Stacks" link in navbar.tsx.
export function SkillsSection() {
  return (
    <section className="mt-12" id="skills-and-stacks">
      <h2 className="text-3xl sm:text-4xl">
        Skills & <span className="text-neutral-400">Stacks.</span>
      </h2>
      <TextGenerateEffect words={intro} className="font-normal" />
      <TechStack />
    </section>
  );
}
