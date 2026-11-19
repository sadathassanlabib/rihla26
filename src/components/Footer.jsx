"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";

/* Set in .env.local:
   NEXT_PUBLIC_DEV_FACEBOOK=https://www.facebook.com/your.real.profile */
const DEV_FACEBOOK = process.env.NEXT_PUBLIC_DEV_FACEBOOK;
const SOROB_FACEBOOK = "https://www.facebook.com/the.sorob";
const HOTLINE = "+8801340147316";
const TOUR_START = new Date("2026-12-24T00:00:00+06:00");

const PHRASES = [
  "Beyond the familiar",
  "Towards unforgettable",
  "Char Kukri-Mukri",
  "Char Hare",
  "24 December 2026",
  "Made for the journey",
];

const GROUPS = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/destination", label: "Destination" },
      { href: "/schedule", label: "Schedule" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Join",
    links: [
      { href: "/register", label: "Register" },
      { href: "/login", label: "Log in" },
      { href: "/me", label: "My profile" },
    ],
  },
];

const css = `
@keyframes ftMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes ftWave{0%{transform:translateX(0)}100%{transform:translateX(-400px)}}
.ft-marquee{animation:ftMarquee 45s linear infinite}
.ft-wave{animation:ftWave 22s linear infinite}
@media (prefers-reduced-motion:reduce){.ft-marquee,.ft-wave{animation:none}}`;

const wave =
  "M0 30 q100 -14 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 V80 H0Z";

function Countdown() {
  const [days, setDays] = useState(null);

  // Computed after mount so server and client HTML always match.
  useEffect(() => {
    const calc = () => Math.ceil((TOUR_START - new Date()) / 86400000);
    setDays(calc());
    const id = setInterval(() => setDays(calc()), 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (days === null || days < -5) return null;

  const text =
    days > 1 ? `${days} days to go` : days === 1 ? "Leaving tomorrow" : "The journey is on";

  return (
    <span className="inline-block -rotate-3 rounded-2xl bg-[#E07A3E] px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-black/20">
      {text}
    </span>
  );
}

export default function Footer() {
  const items = [...PHRASES, ...PHRASES];

  return (
    <footer className="relative isolate overflow-hidden bg-[#1D423A] text-[#DFC5A6]">
      <style>{css}</style>

      {/* wavy top edge, same sand as the page above */}
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-10 w-full" aria-hidden="true">
        <g className="ft-wave"><path d={wave} fill="#DFC5A6" /></g>
      </svg>

      {/* marquee */}
      <div className="mt-10 overflow-hidden border-y border-[#DFC5A6]/15 py-3" aria-hidden="true">
        <div className="ft-marquee flex w-max gap-8 whitespace-nowrap text-sm font-semibold">
          {items.map((t, i) => (
            <span key={i} className="flex items-center gap-8">
              {t}
              <span className="h-1.5 w-1.5 rounded-full bg-[#E07A3E]" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 pt-14">
        <div className="grid gap-12 md:grid-cols-12">
          {/* wordmark */}
          <div className="md:col-span-7">
            <p className="text-[clamp(3.5rem,12vw,8.5rem)] font-black leading-[0.9] tracking-tight">
              Rihla<span className="text-[#E07A3E]">&apos;26</span>
            </p>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#DFC5A6]/75">
              Beyond the familiar. Towards unforgettable.
            </p>
            <div className="mt-6">
              <Countdown />
            </div>
          </div>

          {/* links */}
          <nav className="grid grid-cols-2 gap-8 md:col-span-5" aria-label="Footer">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <p className="text-sm font-bold text-white">{g.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[#DFC5A6]/80 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 flex flex-wrap gap-3">
              <a href={`tel:${HOTLINE}`} className="inline-flex items-center gap-2 rounded-full border border-[#DFC5A6]/25 px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#DFC5A6] hover:text-[#1D423A]">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {HOTLINE}
              </a>
              <a href={SOROB_FACEBOOK} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 rounded-full border border-[#DFC5A6]/25 px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#DFC5A6] hover:text-[#1D423A]">
                SOROB on Facebook
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>
          </nav>
        </div>

        {/* developer credit */}
        <div className="mt-14 flex flex-col gap-4 rounded-3xl bg-[#246A73]/45 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm text-[#DFC5A6]/70">Designed and built by</p>
            <p className="mt-0.5 text-xl font-extrabold text-white">Sadat Hassan Labib</p>
            <p className="mt-1 text-sm text-[#DFC5A6]/70">Exploring ideas. Building digital experiences.</p>
          </div>
          {DEV_FACEBOOK && (
            <a
              href={DEV_FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#DFC5A6] px-5 py-3 text-sm font-bold text-[#1D423A] transition-colors hover:bg-white sm:self-auto"
            >
              Say hi
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[#DFC5A6]/15 pt-6 text-xs text-[#DFC5A6]/55 sm:flex-row">
          <p>© 2026 SOROB. All rights reserved.</p>
          <p>Made for the journey.</p>
        </div>
      </div>
    </footer>
  );
}