
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
        className="
          group fixed bottom-[5.25rem] right-5 z-[101]
          flex h-12 w-12 items-center justify-center
          rounded-full
          border border-[#6BA39E]/40
          bg-[#1D423A]/95
          text-[#DFC5A6]
          shadow-[0_8px_25px_rgba(29,66,58,0.35)]
          backdrop-blur-xl
          transition-all duration-300
          hover:scale-110
          hover:border-[#E07A3E]
          hover:bg-[#246A73]
          hover:text-white
          active:scale-95
        "
      >
        {playing ? (
          <Waves className="h-5 w-5 animate-pulse text-[#6BA39E]" />
        ) : (
          <VolumeX className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        )}

        {/* Active Sound Indicator */}
        {playing && (
          <>
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-[#6BA39E]/40" />

            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#1D423A] bg-[#E07A3E]" />
          </>
        )}

        {/* Ambient Glow */}
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#6BA39E]/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      </button>
    </>
  );
}
