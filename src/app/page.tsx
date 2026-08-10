import FlipWordsDemo from "@/components/layouts/flip-words-demo";
import { AboutMeSection } from "@/components/layouts/sections/about-me-section";
import { SkillsSection } from "@/components/layouts/sections/skills-section";
import { WorkEducationSection } from "@/components/layouts/sections/work-education-section";

// Section order here drives scroll order and must match the anchor order in navbar.tsx.
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-32 px-16 dark:bg-black sm:items-start">
        <FlipWordsDemo />
        <AboutMeSection />
        <SkillsSection />
        <WorkEducationSection />
      </main>
    </div>
  );
}
