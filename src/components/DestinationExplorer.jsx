"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MapPin, Ruler, CalendarDays, Route as RouteIcon, Ship, Bus, Navigation,
  ShieldCheck, HeartHandshake, ArrowRight, Sparkles, Waves, Leaf, Fish, Sun,
  Anchor, Camera,
} from "lucide-react";
import Scene from "@/components/destrination/Scene";
import WhatToBring from "@/components/destrination/WhatToBring";
import IslandHighlights from "@/components/destrination/IslandHighlights";

/* ------------------------------------------------------------------
   CONTENT — edit everything here.
   Photos: drop files in /public/images/destination/ and set `photo`.
   If a photo is missing, the illustration is shown instead.
   Values marked TBA should be filled in by the organizers.
------------------------------------------------------------------- */
const ISLANDS = {
  km: {
    name: "Char Kukri-Mukri",
    badge: "bg-[#246A73] text-white",
    facts: [
      { icon: MapPin, label: "Location", value: "Char Fasson, Bhola" },
      { icon: Ruler, label: "Area", value: "~5 km²" },
      { icon: CalendarDays, label: "Best season", value: "Winter" },
      { icon: RouteIcon, label: "Distance", value: "~210 km" },
    ],
    blurb: "A quiet island with mangroves, a wide beach and fishing villages.",
  },
  ch: {
    name: "Char Hare",
    badge: "bg-[#E07A3E] text-white",
    facts: [
      { icon: MapPin, label: "Location", value: "Bay of Bengal coast" },
      { icon: Anchor, label: "Access", value: "By boat only" },
      { icon: CalendarDays, label: "Best season", value: "Winter" },
      { icon: RouteIcon, label: "Distance", value: "TBA" },
    ],
    blurb: "A remote char with open sand, wide sky and almost no one around.",
  },
};

const SPOTS = [
  { id: "km-beach", island: "km", scene: "beach", photo: "/images/destination/kukri-beach.jpg", icon: Waves, title: "Sea beach", desc: "An untouched sandy shoreline facing the Bay of Bengal. Walk the shore, collect shells and watch the tide change the beach.", tip: "Go barefoot early, before the sun gets strong." },
  { id: "km-mangrove", island: "km", scene: "mangrove", photo: "/images/destination/kukri-mangrove.jpg", icon: Leaf, title: "Mangrove forest", desc: "A green belt of Sundari and Keora trees. Look for birds and listen to the island's quietest corner.", tip: "Wear closed shoes. The ground is muddy near the water." },
  { id: "km-village", island: "km", scene: "village", photo: "/images/destination/kukri-village.jpg", icon: Fish, title: "Fishing village", desc: "Meet local fishermen, see how nets are mended and taste fresh fish, coconut and traditional island dishes.", tip: "Ask before taking photos of people." },
  { id: "km-sunset", island: "km", scene: "sunset", photo: "/images/destination/kukri-sunset.jpg", icon: Sun, title: "Sunset", desc: "Wide, unobstructed skies over the sea. The best light for photography and for the group's evening gathering.", tip: "Keep your phone in a waterproof pouch near the water." },
  { id: "ch-estuary", island: "ch", scene: "estuary", photo: "/images/destination/hare-estuary.jpg", icon: Waves, title: "The open estuary", desc: "Where river water meets the sea. The boat ride in is part of the visit, with flocks of birds over the channels.", tip: "Sit on the shaded side of the boat." },
  { id: "ch-sand", island: "ch", scene: "beach", photo: "/images/destination/hare-sand.jpg", icon: Camera, title: "Sand flats", desc: "Long, open sand that changes with the tide. A good place for group photos and a long walk.", tip: "A hat and sunscreen matter most here." },
  { id: "ch-green", island: "ch", scene: "mangrove", photo: "/images/destination/hare-green.jpg", icon: Leaf, title: "Green patches", desc: "Small stretches of trees and grass that hold the char together and shelter birds.", tip: "Stay on the path the guides choose." },
];

const SHARED_ROUTE = [
  { icon: Bus, title: "Dhaka → Bhola", desc: "Overnight launch or bus with the group.", time: "Approx. 8–10 hours" },
  { icon: Navigation, title: "Bhola → Char Fasson", desc: "Local bus or CNG.", time: "Approx. 1.5 hours" },
];

const FORK = [
  { island: "km", icon: Ship, title: "Char Fasson → Char Kukri-Mukri", desc: "Local trawler or boat from the ghat.", time: "Boat, about 30 minutes" },
  { island: "ch", icon: Ship, title: "Char Fasson → Char Hare", desc: "Boat. Timing depends on the tide; organizers will confirm.", time: "TBA" },
];

const ROTATE_MS = 8000;

/* Calm motion: slow, small, and off when the visitor prefers reduced motion. */
const css = `
@keyframes dxFadeUp{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:none}}
@keyframes dxWaveA{0%{transform:translateX(0)}100%{transform:translateX(-400px)}}
@keyframes dxWaveB{0%{transform:translateX(-400px)}100%{transform:translateX(0)}}
@keyframes dxBob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(3px) rotate(-.8deg)}}
@keyframes dxSway{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1deg)}}
@keyframes dxBird{0%{transform:translateX(-120px)}100%{transform:translateX(920px)}}
@keyframes dxGlow{0%,100%{opacity:.22}50%{opacity:.36}}
@keyframes dxSunset{0%{transform:translateY(-18px)}100%{transform:translateY(22px)}}
@keyframes dxShimmer{0%,100%{opacity:.45}50%{opacity:.8}}
@keyframes dxCloud{0%{transform:translateX(-40px)}100%{transform:translateX(60px)}}
@keyframes dxZoom{0%{transform:scale(1)}100%{transform:scale(1.05)}}
.dx-up{opacity:0;animation:dxFadeUp .6s ease-out forwards}
.dx-wave-a{animation:dxWaveA 16s linear infinite}
.dx-wave-b{animation:dxWaveB 22s linear infinite}
.dx-bob{animation:dxBob 7s ease-in-out infinite;transform-box:fill-box}
.dx-sway{animation:dxSway 8s ease-in-out infinite}
.dx-bird{animation:dxBird 42s linear infinite}
.dx-glow{animation:dxGlow 9s ease-in-out infinite}
.dx-sunset{animation:dxSunset 40s ease-in-out infinite alternate}
.dx-shimmer{animation:dxShimmer 6s ease-in-out infinite}
.dx-cloud{animation:dxCloud 50s ease-in-out infinite alternate}
.dx-zoom{animation:dxZoom 14s ease-out forwards}
@media (prefers-reduced-motion:reduce){
  .dx-up,.dx-wave-a,.dx-wave-b,.dx-bob,.dx-sway,.dx-bird,.dx-glow,.dx-sunset,.dx-shimmer,.dx-cloud,.dx-zoom{animation:none!important;opacity:1}
}`;

const card = "relative overflow-hidden rounded-2xl border border-[#246A73]/15 bg-white shadow-sm";
const wavePath = (top) =>
  `M0 ${top} q100 -14 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 V120 H0Z`;

function IslandTag({ id }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ISLANDS[id].badge}`}>
      {ISLANDS[id].name}
    </span>
  );
}

function Stage({ active, failed, onFail }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-[#1D423A] shadow-lg shadow-[#1D423A]/15 sm:aspect-[16/9]">
      {SPOTS.map((s, i) => {
        const on = i === active;
        const showPhoto = s.photo && !failed.has(s.photo);
        return (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${on ? "opacity-100" : "opacity-0"}`} aria-hidden={!on}>
            {showPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.photo} alt={s.title} onError={() => onFail(s.photo)} className={`h-full w-full object-cover ${on ? "dx-zoom" : ""}`} />
            ) : (
              <Scene kind={s.scene} />
            )}
          </div>
        );
      })}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1D423A]/60 to-transparent" />
      <div className="absolute left-4 top-4">
        <IslandTag id={SPOTS[active].island} />
      </div>
    </div>
  );
}

export default function DestinationExplorer() {
  const [spotIdx, setSpotIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(() => new Set());
  const spot = SPOTS[spotIdx];
  const timer = useRef(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(() => setSpotIdx((i) => (i + 1) % SPOTS.length), ROTATE_MS);
    return () => clearTimeout(timer.current);
  }, [spotIdx, paused]);

  const markFailed = (src) => setFailed((s) => new Set(s).add(src));

  return (
    <>
      <style>{css}</style>
      <div className="min-h-screen overflow-hidden bg-[#DFC5A6] text-[#1D423A]">
        {/* HERO — a quiet sea: slow waves, drifting cloud, one small boat */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#1D423A] via-[#246A73] to-[#4F8E8E] text-white">
          <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <circle className="dx-glow" cx="650" cy="90" r="70" fill="#EBAE7B" />
            <circle cx="650" cy="90" r="30" fill="#EBAE7B" opacity="0.55" />
            <g className="dx-cloud" fill="#fff" opacity="0.08">
              <ellipse cx="160" cy="70" rx="90" ry="16" /><ellipse cx="215" cy="58" rx="50" ry="14" />
              <ellipse cx="480" cy="130" rx="100" ry="16" />
            </g>
          </svg>

          <div className="relative mx-auto max-w-5xl px-6 pb-48 pt-20 text-center sm:pt-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-[#DFC5A6] backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-[#E07A3E]" />
              Two islands, one journey
            </span>

            <h1 className="dx-up mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Char Kukri-Mukri <span className="text-[#DFC5A6]">&amp;</span> Char Hare
            </h1>
            <p className="dx-up mx-auto mt-5 max-w-2xl text-base leading-8 text-[#DFC5A6]/90 sm:text-lg" style={{ animationDelay: "80ms" }}>
              Two quiet islands in the Bay of Bengal, reached from Char Fasson in Bhola.
              Unspoiled beaches, mangroves, open sand and slow village life.
            </p>

            <div className="dx-up mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "160ms" }}>
              <Link href="/register" className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1D423A] transition-colors hover:bg-[#DFC5A6]">
                Join Rihla&apos;26
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/schedule" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20">
                View schedule
              </Link>
            </div>
          </div>

          {/* small boat riding the waves */}
          <svg viewBox="0 0 80 60" className="dx-bob pointer-events-none absolute bottom-16 right-[16%] h-12 w-16 sm:h-14 sm:w-20" aria-hidden="true">
            <path d="M8 44 h64 l-9 12 h-46z" fill="#14302A" />
            <path d="M40 40 V8 l22 28z" fill="#DFC5A6" />
          </svg>

          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-[-1px] left-0 h-24 w-full" aria-hidden="true">
            <g className="dx-wave-b"><path d={wavePath(54)} fill="#6BA39E" opacity="0.45" /></g>
            <g className="dx-wave-a"><path d={wavePath(72)} fill="#DFC5A6" opacity="0.6" /></g>
            <path d="M0 92 C200 70 420 108 640 90 S1000 74 1200 92 V120 H0Z" fill="#DFC5A6" />
          </svg>
        </section>

        <main className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
          {/* AT A GLANCE */}
          <section className="relative -mt-28 grid gap-4 md:grid-cols-2" aria-label="The two islands at a glance">
            {Object.entries(ISLANDS).map(([id, isl], k) => (
              <div key={id} className={`${card} dx-up p-5`} style={{ animationDelay: `${k * 80}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold">{isl.name}</h2>
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${id === "km" ? "bg-[#246A73]" : "bg-[#E07A3E]"}`} aria-hidden="true" />
                </div>
                <p className="mt-1 text-sm text-[#246A73]/75">{isl.blurb}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                  {isl.facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#246A73]" aria-hidden="true" />
                      <div>
                        <dt className="text-xs text-[#246A73]/65">{label}</dt>
                        <dd className="text-sm font-semibold">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </section>

          {/* EXPLORE — one gallery for both islands */}
          <section
            className="mt-16"
            aria-labelledby="explore"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <h2 id="explore" className="text-2xl font-bold sm:text-3xl">Explore the islands</h2>
            <p className="mt-2 text-sm text-[#246A73]/70">Pick a place to see what the day looks like there.</p>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <Stage active={spotIdx} failed={failed} onFail={markFailed} />
              </div>
              <div className="lg:col-span-2">
                <div key={spot.id} className={`${card} dx-up p-6`}>
                  <IslandTag id={spot.island} />
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1D423A] text-white">
                      <spot.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-bold">{spot.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#1D423A]/80">{spot.desc}</p>
                  <p className="mt-4 rounded-xl bg-[#DFC5A6]/50 p-3 text-sm leading-6">
                    <span className="font-semibold">Tip: </span>
                    {spot.tip}
                  </p>
                </div>
              </div>
            </div>

            <div role="tablist" aria-label="Places" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {SPOTS.map((s, i) => {
                const on = i === spotIdx;
                return (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setSpotIdx(i)}
                    className={`rounded-xl border p-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246A73] ${
                      on ? "border-[#246A73] bg-white shadow-sm" : "border-[#246A73]/15 bg-white/60 hover:bg-white"
                    }`}
                  >
                    <s.icon className={`h-5 w-5 ${on ? "text-[#246A73]" : "text-[#246A73]/55"}`} aria-hidden="true" />
                    <p className="mt-2 text-sm font-semibold leading-5">{s.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#246A73]/70">
                      <span className={`h-1.5 w-1.5 rounded-full ${s.island === "km" ? "bg-[#246A73]" : "bg-[#E07A3E]"}`} aria-hidden="true" />
                      {s.island === "km" ? "Kukri-Mukri" : "Char Hare"}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* HIGHLIGHTS */}
          <IslandHighlights />

          {/* ROUTE — shared legs, then a fork to each island */}
          <section className="mt-20" aria-labelledby="reach">
            <h2 id="reach" className="text-2xl font-bold sm:text-3xl">How to reach the islands</h2>
            <p className="mt-2 text-sm text-[#246A73]/70">The first two legs are shared. The last leg goes to each island by boat.</p>

            <ol className="relative ml-4 mt-8 space-y-5 border-l-2 border-dashed border-[#246A73]/25">
              {SHARED_ROUTE.map(({ icon: Icon, title, desc, time }, i) => (
                <li key={title} className="relative ml-8">
                  <span className="absolute -left-[3.1rem] top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#1D423A] text-sm font-bold text-white ring-4 ring-[#DFC5A6]">{i + 1}</span>
                  <div className={`${card} p-5`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-bold">
                        <Icon className="h-5 w-5 text-[#246A73]" aria-hidden="true" />
                        {title}
                      </div>
                      <span className="rounded-full bg-[#DFC5A6]/70 px-3 py-1 text-xs font-semibold text-[#246A73]">{time}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#246A73]/70">{desc}</p>
                  </div>
                </li>
              ))}

              <li className="relative ml-8">
                <span className="absolute -left-[3.1rem] top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#1D423A] text-sm font-bold text-white ring-4 ring-[#DFC5A6]">3</span>
                <div className="grid gap-4 sm:grid-cols-2">
                  {FORK.map(({ island, icon: Icon, title, desc, time }) => (
                    <div key={island} className={`${card} p-5`}>
                      <IslandTag id={island} />
                      <div className="mt-3 flex items-center gap-2 font-bold">
                        <Icon className="h-5 w-5 text-[#246A73]" aria-hidden="true" />
                        {title}
                      </div>
                      <p className="mt-2 text-sm text-[#246A73]/70">{desc}</p>
                      <span className="mt-3 inline-block rounded-full bg-[#DFC5A6]/70 px-3 py-1 text-xs font-semibold text-[#246A73]">{time}</span>
                    </div>
                  ))}
                </div>
              </li>
            </ol>
          </section>

          {/* WHAT TO BRING */}
          <WhatToBring />

          {/* ORGANIZER NOTE */}
          <aside className="mt-16 rounded-3xl bg-gradient-to-br from-[#1D423A] to-[#246A73] p-6 text-white sm:p-8">
            <div className="flex items-start gap-4">
              <HeartHandshake className="mt-1 h-6 w-6 shrink-0 text-[#DFC5A6]" aria-hidden="true" />
              <div>
                <h3 className="font-bold">Travel with SOROB</h3>
                <p className="mt-2 text-sm leading-7 text-[#DFC5A6]/90">
                  SOROB volunteers coordinate the journey from Dhaka to both islands and back.
                  Transportation, food and accommodation are arranged in advance.
                </p>
              </div>
            </div>
          </aside>

          <p className="mt-6 flex items-start gap-3 rounded-2xl border border-[#246A73]/15 bg-white p-4 text-sm leading-6 text-[#1D423A]/70">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#246A73]" aria-hidden="true" />
            Follow your group leaders near the water. Travel times may change depending on weather and tides.
          </p>

          <div className="mt-12 flex justify-center">
            <Link href="/register" className="group inline-flex items-center gap-2 rounded-xl bg-[#1D423A] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#246A73]">
              Register for Rihla&apos;26
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}