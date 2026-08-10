"use client";
import { GithubActivity } from "@/components/layouts/hero/github-activity";
import {
  audioSrc,
  flipWords,
  githubUsername,
  heroDescription,
  pulseSequence,
} from "@/components/layouts/hero/hero-data";
import { HeroFlipIntro } from "@/components/layouts/hero/hero-flip-intro";
import { HeroGreeting } from "@/components/layouts/hero/hero-heading";
import { PulseAudioRow } from "@/components/layouts/hero/pulse-audio-row";

// Hero section: composes the greeting, flip-words intro, pulse/audio row,
// and GitHub activity graph. Copy/data lives in hero/hero-data.ts.
export default function FlipWordsDemo() {
  return (
    <div className="flex min-h-[25rem] flex-col px-4">
      <HeroGreeting />

      <div className="mx-auto text-left text-4xl font-normal text-neutral-600 dark:text-neutral-400">
        <HeroFlipIntro words={flipWords} description={heroDescription} />

        <PulseAudioRow sequence={pulseSequence} audioSrc={audioSrc} />

        <GithubActivity username={githubUsername} />
      </div>
    </div>
  );
}
