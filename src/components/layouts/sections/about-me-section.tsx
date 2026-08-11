import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

// Short bio shown under the "About Me." heading, revealed word-by-word.
const bio =
  "I'm currently a college student, mostly diving into AI/ML and web development. " +
  "Still figuring things out, but I enjoy building stuff and seeing it actually work. " +
  "Outside of code, I hit the gym, go for runs, and spend way too much time " +
  "reading manga/manhwa/manhua or catching up on anime. Music's usually " +
  "playing in the background no matter what I'm doing.";

// id must stay in sync with the "About Me" link in navbar.tsx.
export function AboutMeSection() {
  return (
    <section className="mt-12" id="about-me">
      <h2 className="text-3xl sm:text-4xl">
        A little about <span className="text-neutral-400">me.</span>
      </h2>
      <TextGenerateEffect words={bio} className="font-normal" />
    </section>
  );
}
