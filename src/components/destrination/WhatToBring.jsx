"use client";
import { useState } from "react";
import {
  Backpack, Droplets, BatteryCharging, Shirt, Pill, Sun, Check,
} from "lucide-react";

/* Photos: put files in /public/images/bring/ and set `photo`.
   If a photo is missing, the illustration is shown instead. */
const ITEMS = [
  { id: "water", icon: Droplets, art: "water", photo: "/images/bring/water.jpg", title: "Drinking water", text: "Drinking water and a refillable bottle", detail: "Safe drinking water is hard to find on the islands. Fill your bottle before every boat ride." },
  { id: "sun", icon: Sun, art: "sun", photo: "/images/bring/sun.jpg", title: "Sun protection", text: "Sunscreen, cap or hat, sunglasses", detail: "There is almost no shade on the open sand. Reapply sunscreen after swimming." },
  { id: "clothes", icon: Shirt, art: "clothes", photo: "/images/bring/clothes.jpg", title: "Clothes", text: "Light, modest clothes and a light jacket for the nights", detail: "Quick-dry cotton works best. Nights on the water get cool and windy." },
  { id: "bag", icon: Backpack, art: "bag", photo: "/images/bring/bag.jpg", title: "Bag and towel", text: "A small bag, towel and a spare set of clothes", detail: "Pack light. You will carry your bag on and off boats." },
  { id: "power", icon: BatteryCharging, art: "power", photo: "/images/bring/power.jpg", title: "Power and phone", text: "Power bank and a waterproof pouch for your phone", detail: "Charging points are rare. Keep your phone in the pouch near the water." },
  { id: "medicine", icon: Pill, art: "medicine", photo: "/images/bring/medicine.jpg", title: "Medicines", text: "Personal medicines and a basic first-aid kit", detail: "Bring your own regular medicines, plus plasters, antiseptic and oral saline." },
];

const P = { deep: "#1D423A", teal: "#246A73", sea: "#6BA39E", sand: "#DFC5A6", sun: "#E07A3E", mist: "#DCE9E5", cream: "#F1E7D6" };

const css = `
@keyframes wbUp{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}}
@keyframes wbWave{0%{transform:translateX(0)}100%{transform:translateX(-80px)}}
@keyframes wbDrop{0%{opacity:0;transform:translateY(-8px)}30%{opacity:.8}100%{opacity:0;transform:translateY(26px)}}
@keyframes wbSwing{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@keyframes wbBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes wbGlow{0%,100%{opacity:.25}50%{opacity:.42}}
@keyframes wbBar{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes wbZoom{0%{transform:scale(1)}100%{transform:scale(1.05)}}
.wb-up{opacity:0;animation:wbUp .5s ease-out forwards}
.wb-wave{animation:wbWave 6s linear infinite}
.wb-drop{animation:wbDrop 4.5s ease-in infinite}
.wb-swing{animation:wbSwing 6s ease-in-out infinite;transform-origin:200px 60px}
.wb-bob{animation:wbBob 6s ease-in-out infinite}
.wb-glow{animation:wbGlow 8s ease-in-out infinite}
.wb-bar{animation:wbBar 5s ease-in-out infinite}
.wb-zoom{animation:wbZoom 12s ease-out forwards}
@media (prefers-reduced-motion:reduce){
  .wb-up,.wb-wave,.wb-drop,.wb-swing,.wb-bob,.wb-glow,.wb-bar,.wb-zoom{animation:none!important;opacity:1}
}`;

const svgProps = { viewBox: "0 0 400 300", className: "h-full w-full", preserveAspectRatio: "xMidYMid slice", "aria-hidden": true };

function Water() {
  return (
    <svg {...svgProps}>
      <defs><clipPath id="wb-bottle"><rect x="150" y="80" width="100" height="180" rx="26" /></clipPath></defs>
      <rect width="400" height="300" fill={P.mist} />
      <rect x="176" y="46" width="48" height="38" rx="8" fill={P.teal} />
      <rect x="150" y="80" width="100" height="180" rx="26" fill="#fff" stroke={P.teal} strokeWidth="4" />
      <g clipPath="url(#wb-bottle)">
        <g className="wb-wave">
          <path d="M0 150 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V270 H0Z" fill={P.sea} transform="translate(130 0)" />
        </g>
      </g>
      <g fill={P.sea}>
        <path className="wb-drop" d="M84 80 q7 12 0 18 q-7 -6 0 -18z" />
        <path className="wb-drop" style={{ animationDelay: "2.2s" }} d="M316 110 q7 12 0 18 q-7 -6 0 -18z" />
      </g>
    </svg>
  );
}

function SunArt() {
  return (
    <svg {...svgProps}>
      <rect width="400" height="300" fill={P.cream} />
      <circle className="wb-glow" cx="200" cy="140" r="78" fill={P.sun} />
      <circle cx="200" cy="140" r="44" fill="#EBAE7B" />
      <g className="wb-bob">
        <path d="M130 262 q70 -62 140 0z" fill={P.teal} />
        <rect x="118" y="260" width="164" height="12" rx="6" fill={P.deep} />
      </g>
    </svg>
  );
}

function Clothes() {
  return (
    <svg {...svgProps}>
      <rect width="400" height="300" fill={P.mist} />
      <g className="wb-swing">
        <path d="M200 60 v-14 a9 9 0 1 1 9 9" fill="none" stroke={P.deep} strokeWidth="4" strokeLinecap="round" />
        <path d="M200 60 L142 104 H258Z" fill="none" stroke={P.deep} strokeWidth="4" strokeLinejoin="round" />
        <path d="M148 104 l-52 30 l20 32 l26 -14 v88 h116 v-88 l26 14 l20 -32 l-52 -30 q-20 18 -52 18 t-52 -18z" fill={P.teal} />
        <path d="M172 110 q28 24 56 0" fill="none" stroke={P.deep} strokeWidth="4" opacity="0.6" />
      </g>
    </svg>
  );
}

function BagArt() {
  return (
    <svg {...svgProps}>
      <rect width="400" height="300" fill={P.cream} />
      <g className="wb-bob">
        <path d="M170 92 q30 -34 60 0" fill="none" stroke={P.deep} strokeWidth="8" strokeLinecap="round" />
        <rect x="140" y="88" width="120" height="160" rx="40" fill={P.deep} />
        <rect x="160" y="168" width="80" height="58" rx="14" fill={P.teal} />
        <path d="M200 168 v58" stroke={P.sea} strokeWidth="3" />
        <rect x="150" y="120" width="100" height="12" rx="6" fill={P.sea} />
        <rect x="236" y="196" width="46" height="18" rx="4" fill={P.sand} transform="rotate(-12 236 196)" />
      </g>
    </svg>
  );
}

function Power() {
  return (
    <svg {...svgProps}>
      <rect width="400" height="300" fill={P.mist} />
      <rect x="110" y="106" width="170" height="96" rx="16" fill="#fff" stroke={P.deep} strokeWidth="6" />
      <rect x="280" y="136" width="16" height="36" rx="5" fill={P.deep} />
      {[0, 1, 2].map((i) => (
        <rect key={i} className="wb-bar" style={{ animationDelay: `${i * 1.2}s` }} x={126 + i * 50} y="122" width="40" height="64" rx="8" fill={P.sea} />
      ))}
      <path d="M206 120 l-24 40 h22 l-8 28 l30 -46 h-22z" fill={P.sun} />
    </svg>
  );
}

function Medicine() {
  return (
    <svg {...svgProps}>
      <rect width="400" height="300" fill={P.cream} />
      <path d="M170 100 v-16 q0 -10 10 -10 h40 q10 0 10 10 v16" fill="none" stroke={P.deep} strokeWidth="6" />
      <g className="wb-bob">
        <rect x="110" y="100" width="180" height="130" rx="20" fill="#fff" stroke={P.deep} strokeWidth="6" />
        <rect x="184" y="132" width="32" height="68" rx="6" fill={P.sun} />
        <rect x="166" y="150" width="68" height="32" rx="6" fill={P.sun} />
      </g>
    </svg>
  );
}

const ART = { water: Water, sun: SunArt, clothes: Clothes, bag: BagArt, power: Power, medicine: Medicine };

export default function WhatToBring() {
  const [active, setActive] = useState(0);
  const [packed, setPacked] = useState(() => new Set());
  const [failed, setFailed] = useState(() => new Set());
  const item = ITEMS[active];

  const togglePacked = (id) =>
    setPacked((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <section className="mt-20" aria-labelledby="bring">
      <style>{css}</style>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1D423A] text-white">
          <Backpack className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id="bring" className="text-2xl font-bold">What to bring</h2>
          <p className="text-sm text-[#246A73]/70">
            {packed.size} of {ITEMS.length} packed. Tick items as you pack them.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#DFC5A6] shadow-lg shadow-[#1D423A]/10 sm:aspect-[16/10]">
            {ITEMS.map((it, i) => {
              const on = i === active;
              const Art = ART[it.art];
              const showPhoto = it.photo && !failed.has(it.photo);
              return (
                <div key={it.id} className={`absolute inset-0 transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`} aria-hidden={!on}>
                  {showPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.photo}
                      alt={it.title}
                      onError={() => setFailed((s) => new Set(s).add(it.photo))}
                      className={`h-full w-full object-cover ${on ? "wb-zoom" : ""}`}
                    />
                  ) : (
                    <Art />
                  )}
                </div>
              );
            })}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1D423A]/75 to-transparent" />
            <div key={item.id} className="wb-up absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-lg font-bold">{item.title}</p>
              <p className="mt-1 max-w-md text-sm leading-6 text-white/90">{item.detail}</p>
            </div>
          </div>
        </div>

        <ul className="space-y-2.5 lg:col-span-2" role="tablist" aria-label="Packing list" aria-orientation="vertical">
          {ITEMS.map((it, i) => {
            const on = i === active;
            const done = packed.has(it.id);
            return (
              <li key={it.id} className="flex items-stretch gap-2">
                <button
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={`flex flex-1 items-start gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246A73] ${
                    on ? "border-[#246A73] bg-white shadow-sm" : "border-[#246A73]/15 bg-white/60 hover:bg-white"
                  }`}
                >
                  <it.icon className={`mt-0.5 h-5 w-5 shrink-0 ${on ? "text-[#246A73]" : "text-[#246A73]/60"}`} aria-hidden="true" />
                  <span className={`leading-6 ${done ? "text-[#1D423A]/50 line-through" : "text-[#1D423A]/85"}`}>{it.text}</span>
                </button>
                <button
                  onClick={() => togglePacked(it.id)}
                  aria-pressed={done}
                  aria-label={`${done ? "Unmark" : "Mark"} ${it.title} as packed`}
                  className={`flex w-11 shrink-0 items-center justify-center rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246A73] ${
                    done ? "border-[#246A73] bg-[#246A73] text-white" : "border-[#246A73]/20 bg-white/60 text-transparent hover:text-[#246A73]/40"
                  }`}
                >
                  <Check className="h-5 w-5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}