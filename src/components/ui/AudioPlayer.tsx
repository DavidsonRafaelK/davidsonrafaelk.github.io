"use client";
import { Pause, Play } from "lucide-react";
import posthog from "posthog-js";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function AudioPlayer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#a1a1aa",
      progressColor: "#18181b",
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      height: 32,
      url: src,
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on("ready", () => {
      setDuration(wavesurfer.getDuration());
    });

    wavesurfer.on("play", () => setIsPlaying(true));
    wavesurfer.on("pause", () => setIsPlaying(false));
    wavesurfer.on("finish", () => setIsPlaying(false));

    return () => {
      wavesurfer.destroy();
    };
  }, [src]);

  const togglePlay = () => {
    if (!isPlaying) {
      posthog.capture("portfolio_audio_played");
    }
    wavesurferRef.current?.playPause();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 rounded-full border px-4 py-2 bg-white dark:bg-zinc-900">
      <button
        type="button"
        onClick={togglePlay}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" fill="currentColor" />
        ) : (
          <Play className="h-4 w-4" fill="currentColor" />
        )}
      </button>
      <div ref={containerRef} className="flex-1" />
      <span className="text-sm text-zinc-500 shrink-0 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}
