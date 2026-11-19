"use client";
import { useState } from "react";
import Scene from "./Scene";

/* Uses the .dx-* animation classes defined in DestinationExplorer.
   Photos: put files in /public/images/highlights/ and set `photo`.
   If a photo is missing, the illustration is shown instead. */

const BADGE = {
  km: { label: "Kukri-Mukri", cls: "bg-[#246A73] text-white" },
  ch: { label: "Char Hare", cls: "bg-[#E07A3E] text-white" },
};

const HIGHLIGHTS = [
  { id: "beach", scene: "beach", photo: "/images/highlights/beach.jpg", title: "Sea beach", desc: "Untouched sandy shoreline beside the Bay of Bengal.", on: ["km", "ch"] },
  { id: "mangrove", scene: "mangrove", photo: "/images/highlights/mangrove.jpg", title: "Mangrove forest", desc: "Home to Sundari and Keora trees, a peaceful green belt.", on: ["km"] },
  { id: "village", scene: "village", photo: "/images/highlights/village.jpg", title: "Fishing villages", desc: "Meet local fishermen and taste fresh seafood.", on: ["km"] },
  { id: "sky", scene: "sunset", photo: "/images/highlights/sky.jpg", title: "Sunrise & sunset", desc: "Wide, unobstructed skies over the sea.", on: ["km", "ch"] },
  { id: "photo", scene: "camera", photo: "/images/highlights/photo.jpg", title: "Photography", desc: "Open landscapes made for travel photography.", on: ["km", "ch"] },
  { id: "food", scene: "food", photo: "/images/highlights/food.jpg", title: "Local cuisine", desc: "Fresh fish, coconut and traditional island dishes.", on: ["km", "ch"] },
];

export default function IslandHighlights() {
  const [failed, setFailed] = useState(() => new Set());

  return (
    <section className="mt-20" aria-labelledby="highlights">
      <h2 id="highlights" className="text-2xl font-bold sm:text-3xl">Island Highlights</h2>
      <p className="mt-2 text-sm text-[#246A73]/70">
        What makes these islands worth the journey.
      </p>

      <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HIGHLIGHTS.map((h, i) => {
          const showPhoto = h.photo && !failed.has(h.photo);
          return (
            <li
              key={h.id}
              className="dx-up group overflow-hidden rounded-2xl border border-[#246A73]/15 bg-white shadow-sm transition-shadow duration-500 hover:shadow-lg hover:shadow-[#1D423A]/10"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#DFC5A6]">
                {showPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={h.photo}
                    alt={h.title}
                    onError={() => setFailed((s) => new Set(s).add(h.photo))}
                    className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                  />
                ) : (
                  <Scene kind={h.scene} />
                )}
                <div className="absolute left-3 top-3 flex gap-1.5">
                  {h.on.map((k) => (
                    <span key={k} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE[k].cls}`}>
                      {BADGE[k].label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold">{h.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#246A73]/75">{h.desc}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}