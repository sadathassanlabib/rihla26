
"use client";

import { useEffect, useState } from "react";

export default function Countdown({
  target,
  title = "The journey begins in",
  finishedTitle = "The journey has begun",
  subtitle,
}) {
  const [time, setTime] = useState(null);
  const targetMs = new Date(target).getTime();

  useEffect(() => {
    const update = () => {
      const distance = Math.max(0, targetMs - Date.now());

      setTime({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance / 3600000) % 24),
        minutes: Math.floor((distance / 60000) % 60),
        seconds: Math.floor((distance / 1000) % 60),
        finished: distance === 0,
      });
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [targetMs]);

  const units = [
    { label: "DAYS", value: time?.days },
    { label: "HOURS", value: time?.hours },
    { label: "MINUTES", value: time?.minutes },
    { label: "SECONDS", value: time?.seconds },
  ];

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-5 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[#6BA39E]/30 bg-[#246A73]/30 px-4 py-2 shadow-sm backdrop-blur-xl">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E07A3E] opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-[#E07A3E]" />
          </span>

          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#DFC5A6] sm:text-xs">
            {time?.finished ? finishedTitle : title}
          </span>
        </div>

        {subtitle && (
          <p className="text-center text-xs leading-relaxed text-[#DFC5A6]/80 sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {/* Countdown Cards */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="group relative overflow-hidden rounded-2xl border border-[#6BA39E]/25 bg-[#1D423A]/65 px-1 py-4 text-center shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#E07A3E]/60 hover:bg-[#246A73]/70 sm:rounded-3xl sm:py-6"
          >
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#6BA39E]/15 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />

            {/* Number */}
            <div className="relative text-2xl font-black tabular-nums tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-b from-[#DFC5A6] via-[#E9D7C1] to-[#6BA39E] bg-clip-text text-transparent">
                {time ? String(unit.value).padStart(2, "0") : "--"}
              </span>
            </div>

            {/* Divider */}
            <div className="mx-auto my-3 h-px w-8 bg-gradient-to-r from-transparent via-[#E07A3E]/70 to-transparent sm:w-12" />

            {/* Label */}
            <div className="relative text-[8px] font-bold tracking-[0.16em] text-[#6BA39E] sm:text-[10px] sm:tracking-[0.22em]">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
