import { FlipWords } from "@/components/ui/flip-words";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export function HeroFlipIntro({
  words,
  description,
}: {
  words: string[];
  description: string;
}) {
  return (
    <>
      Delivering <FlipWords words={words} />
      <br />
      solutions for your business challenges.
      <TextGenerateEffect words={description} className="font-normal" />
    </>
  );
}
