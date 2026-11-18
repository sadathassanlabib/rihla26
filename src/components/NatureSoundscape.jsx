
"use client";

import { useEffect, useRef, useState } from "react";
import { Waves, VolumeX } from "lucide-react";

export default function NatureSoundscape() {
  const oceanRef = useRef(null);
  const birdsRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const startSound = async () => {
    const ocean = oceanRef.current;
    const birds = birdsRef.current;

    if (!ocean || !birds) return;

    ocean.volume = 0.55;
    birds.volume = 0.25;

    const results = await Promise.allSettled([
      ocean.play(),
      birds.play(),
    ]);

    setPlaying(
      results.some((result) => result.status === "fulfilled")
    );
  };

  const toggleSound = async () => {
    if (playing) {
      oceanRef.current?.pause();
      birdsRef.current?.pause();
      setPlaying(false);
    } else {
      await startSound();
    }
  };

  useEffect(() => {
    // Browser autoplay restrictions may prevent automatic playback.
    startSound();

    return () => {
      oceanRef.current?.pause();
      birdsRef.current?.pause();
    };
  }, []);

  return (
    <>
      <audio
        ref={oceanRef}
        src="/audio/ocean-waves.mp3"
        loop
        preload="auto"
      />

      <audio
        ref={birdsRef}
        src="/audio/birds.mp3"
        loop
        preload="auto"
      />

      <button
        onClick={toggleSound}
        aria-label={
          playing ? "Pause nature sounds" : "Play nature sounds"
        }
        title={
          playing ? "Pause nature sounds" : "Play nature sounds"
        }
        className="fixed bottom-[5.25rem] right-5 z-[101] flex h-12 w-12 items-center justify-center rounded-full border border-sky-300/20 bg-[#052E47]/95 text-sky-300 shadow-lg shadow-sky-950/30 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-sky-300/50 hover:bg-[#073D5B] active:scale-95"
      >
        {playing ? (
          <Waves className="h-5 w-5 animate-pulse" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}

        {playing && (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-sky-300/40" />
        )}
      </button>
    </>
  );
}
