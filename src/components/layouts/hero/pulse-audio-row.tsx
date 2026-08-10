import { DotMatrix } from "dot-anime-react";
import AudioPlayer from "@/components/ui/AudioPlayer";

export function PulseAudioRow({
  sequence,
  audioSrc,
}: {
  sequence: number[][];
  audioSrc: string;
}) {
  return (
    <div className="mt-12 flex w-full items-center gap-3">
      <DotMatrix
        sequence={sequence}
        cols={7}
        rows={7}
        dotSize={3}
        gap={1.5}
        shape="circle"
        interval={100}
        color="#00ffff"
        inactiveColor="#222222"
        className="rounded-xl border p-2"
      />

      <div className="flex-1">
        <AudioPlayer src={audioSrc} />
      </div>
    </div>
  );
}
