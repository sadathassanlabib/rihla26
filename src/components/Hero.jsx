import Link from "next/link";
import { Waves, MapPin, CalendarDays, ArrowUpRight, ArrowRight } from "lucide-react";

/* Usage in your Home page:

   import HomeHero from "@/components/home/HomeHero";

   <HomeHero
     title={s?.homeTitle}
     body={s?.homeBody}
     image={heroImage}
   />

   Every prop is optional. With no `image`, an animated sea scene is drawn. */

const DEFAULT_TITLE = "Rihla'26";
const DEFAULT_BODY =
  "Beyond the familiar roads, across the blue horizon. A journey to explore nature, strengthen bonds and create memories that last.";

const STOPS = [
  "Dhaka",
  "Bhola",
  "Char Fasson",
  "Char Kukri-Mukri & Char Hare",
];

const css = `
@keyframes hhZoom{0%{transform:scale(1.05)}100%{transform:scale(1.12)}}
@keyframes hhWaveA{0%{transform:translateX(0)}100%{transform:translateX(-400px)}}
@keyframes hhWaveB{0%{transform:translateX(-400px)}100%{transform:translateX(0)}}
@keyframes hhCloud{0%{transform:translateX(-40px)}100%{transform:translateX(60px)}}
@keyframes hhGlow{0%,100%{opacity:.22}50%{opacity:.36}}
@keyframes hhBob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(3px) rotate(-.8deg)}}
@keyframes hhUp{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}
.hh-zoom{animation:hhZoom 30s ease-in-out infinite alternate}
.hh-wave-a{animation:hhWaveA 18s linear infinite}
.hh-wave-b{animation:hhWaveB 24s linear infinite}
.hh-cloud{animation:hhCloud 50s ease-in-out infinite alternate}
.hh-glow{animation:hhGlow 9s ease-in-out infinite}
.hh-bob{animation:hhBob 7s ease-in-out infinite}
.hh-up{opacity:0;animation:hhUp .7s ease-out forwards}
@media (prefers-reduced-motion:reduce){
  .hh-zoom,.hh-wave-a,.hh-wave-b,.hh-cloud,.hh-glow,.hh-bob,.hh-up{animation:none!important;opacity:1}
}`;

const wave = (top) =>
  `M0 ${top} q100 -14 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 V120 H0Z`;

export default function HomeHero({
  title,
  body,
  image,
  dates = "24–28 December 2026",
  places = "Char Kukri-Mukri & Char Hare, Bhola",
}) {
  return (
    <section
      id="home-hero"
      className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-[#1D423A] text-white"
    >
      <style>{css}</style>

      {/* Background: your photo, or a calm animated sea when there is none */}
      {image ? (
        <div
          aria-hidden="true"
          className="hh-zoom absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url("${image}")` }}
        />
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 -z-20 h-full w-full"
        >
          <defs>
            <linearGradient id="hh-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1D423A" />
              <stop offset="0.55" stopColor="#246A73" />
              <stop offset="1" stopColor="#4F8E8E" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#hh-sky)" />
          <circle className="hh-glow" cx="640" cy="130" r="80" fill="#EBAE7B" />
          <circle cx="640" cy="130" r="32" fill="#EBAE7B" opacity="0.55" />
          <g className="hh-cloud" fill="#fff" opacity="0.08">
            <ellipse cx="160" cy="100" rx="90" ry="16" />
            <ellipse cx="215" cy="88" rx="50" ry="14" />
            <ellipse cx="480" cy="170" rx="100" ry="16" />
          </g>
        </svg>
      )}

      {/* Readability overlays */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1D423A]/70 via-[#246A73]/45 to-[#1D423A]/90" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1D423A]/80 via-[#246A73]/20 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-36 pt-32 md:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left: message */}
          <div className="lg:col-span-7">
            <div className="hh-up inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-[#DFC5A6] backdrop-blur-xl">
              <Waves className="h-4 w-4 text-[#E07A3E]" aria-hidden="true" />
              SOROB presents · Winter 2026
            </div>

            <h1
              className="hh-up mt-7 text-[clamp(3.75rem,13vw,9rem)] font-black leading-[0.92] tracking-tight"
              style={{ animationDelay: "80ms" }}
            >
              {title || DEFAULT_TITLE}
              <span className="text-[#E07A3E]">.</span>
            </h1>

            <p
              className="hh-up mt-7 max-w-xl text-lg leading-8 text-[#DFC5A6]/90 md:text-xl md:leading-9"
              style={{ animationDelay: "160ms" }}
            >
              {body || DEFAULT_BODY}
            </p>

            <ul
              className="hh-up mt-8 flex flex-wrap gap-3 text-sm font-semibold"
              style={{ animationDelay: "240ms" }}
            >
              <li className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <MapPin className="h-4 w-4 text-[#E07A3E]" aria-hidden="true" />
                {places}
              </li>
              <li className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <CalendarDays className="h-4 w-4 text-[#E07A3E]" aria-hidden="true" />
                {dates}
              </li>
            </ul>

            <div
              className="hh-up mt-10 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "320ms" }}
            >
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#E07A3E] px-8 py-4 font-bold text-white shadow-xl shadow-black/25 transition-colors hover:bg-[#c9682f]"
              >
                Register
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-8 py-4 font-bold backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Discover Rihla
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right: route sticker */}
          <div className="hh-up lg:col-span-5" style={{ animationDelay: "400ms" }}>
            <div className="relative mx-auto max-w-sm rotate-2 rounded-3xl bg-[#DFC5A6] p-6 text-[#1D423A] shadow-2xl shadow-black/30">
              <span className="absolute -right-3 -top-4 -rotate-6 rounded-2xl bg-[#E07A3E] px-4 py-2 text-sm font-extrabold text-white shadow-lg">
                4–5 days
              </span>
              <p className="text-lg font-extrabold">Our route</p>
              <ol className="relative mt-5 space-y-5 border-l-2 border-dashed border-[#246A73]/35 pl-6">
                {STOPS.map((stop, i) => (
                  <li key={stop} className="relative">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[1.95rem] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-[#DFC5A6] ${
                        i === STOPS.length - 1 ? "bg-[#E07A3E]" : "bg-[#1D423A]"
                      }`}
                    />
                    <span className={`text-sm ${i === STOPS.length - 1 ? "font-extrabold" : "font-semibold"}`}>
                      {stop}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-xs leading-5 text-[#246A73]/80">
                Two islands, one journey, organized by SOROB volunteers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Small boat on the waves */}
      <svg viewBox="0 0 80 60" aria-hidden="true" className="hh-bob pointer-events-none absolute bottom-20 left-[8%] h-12 w-16 sm:h-14 sm:w-20">
        <path d="M8 44 h64 l-9 12 h-46z" fill="#14302A" />
        <path d="M40 40 V8 l22 28z" fill="#DFC5A6" />
      </svg>

      {/* Waves that melt into the sand page below */}
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true" className="absolute bottom-[-1px] left-0 h-24 w-full">
        <g className="hh-wave-b"><path d={wave(56)} fill="#6BA39E" opacity="0.45" /></g>
        <g className="hh-wave-a"><path d={wave(74)} fill="#DFC5A6" opacity="0.6" /></g>
        <path d="M0 94 C200 72 420 110 640 92 S1000 76 1200 94 V120 H0Z" fill="#DFC5A6" />
      </svg>
    </section>
  );
}