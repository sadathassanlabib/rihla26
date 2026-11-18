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
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
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
      <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-300" />
        </span>
        {time?.finished ? finishedTitle : title}
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-2xl border border-white/20 bg-white/10 px-2 py-4 text-center shadow-lg backdrop-blur-md sm:py-6"
          >
            <div className="text-2xl font-black tabular-nums text-white sm:text-4xl md:text-5xl">
              {time ? String(unit.value).padStart(2, "0") : "--"}
            </div>
            <div className="mt-2 text-[9px] font-bold tracking-[0.15em] text-sky-100 sm:text-xs">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      {subtitle && (
        <p className="mt-4 text-center text-xs text-sky-100/80">{subtitle}</p>
      )}
    </div>
  );
}