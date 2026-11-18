
import Link from "next/link";
import {
  MapPin, Waves, Sun, Fish, Leaf, Ship, Camera, Utensils,
  Bus, Navigation, Compass, Ruler, CalendarDays, Route,
  Backpack, ShieldCheck, Droplets, BatteryCharging, Shirt,
  Pill, HeartHandshake,
} from "lucide-react";

export const metadata = {
  title: "Destination – Char Kukri-Mukri · SOROB Rihla'26",
  description:
    "Explore Char Kukri-Mukri, a beautiful island in the Bay of Bengal.",
};

const FACTS = [
  { icon: MapPin, label: "Location", value: "Char Fasson, Bhola" },
  { icon: Ruler, label: "Area", value: "~5 km²" },
  { icon: CalendarDays, label: "Best season", value: "Winter" },
  { icon: Route, label: "Distance", value: "~210 km" },
];

const HIGHLIGHTS = [
  { icon: Waves, title: "Sea beach", desc: "Untouched sandy shoreline beside the Bay of Bengal." },
  { icon: Leaf, title: "Mangrove forest", desc: "Home to Sundari and Keora trees, a peaceful green belt." },
  { icon: Fish, title: "Fishing villages", desc: "Meet local fishermen and taste fresh seafood." },
  { icon: Sun, title: "Sunrise & sunset", desc: "Wide, unobstructed skies over the sea." },
  { icon: Camera, title: "Photography", desc: "Open landscapes made for travel photography." },
  { icon: Utensils, title: "Local cuisine", desc: "Fresh fish, coconut and traditional island dishes." },
];

const ROUTE = [
  { icon: Bus, title: "Dhaka → Bhola", desc: "Overnight launch or bus.", time: "Approx. 8–10 hours" },
  { icon: Navigation, title: "Bhola → Char Fasson", desc: "Local bus or CNG.", time: "Approx. 1.5 hours" },
  { icon: Ship, title: "Char Fasson → Char Kukri-Mukri", desc: "Local boat across the channel.", time: "Approx. 30 minutes" },
];

const BRING = [
  { icon: Droplets, text: "Drinking water and a refillable bottle" },
  { icon: Sun, text: "Sunscreen, cap or hat, sunglasses" },
  { icon: Shirt, text: "Light, modest clothes and a light jacket for the nights" },
  { icon: Backpack, text: "A small bag, towel and a spare set of clothes" },
  { icon: BatteryCharging, text: "Power bank and a waterproof pouch for your phone" },
  { icon: Pill, text: "Personal medicines and a basic first-aid kit" },
];

const cardClass =
  "rounded-2xl border border-[#073D5B]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#159BC1]/40 hover:shadow-lg hover:shadow-[#073D5B]/5";

export default function DestinationPage() {
  return (
    <div className="min-h-screen bg-[#F3FAFF] text-[#123B56]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#073D5B] via-[#075B7C] to-[#159BC1] text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-5xl px-6 pb-32 pt-20 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-sky-100 backdrop-blur">
            <Compass className="h-4 w-4" />
            Explore the destination
          </span>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Char Kukri-Mukri
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-sky-100 sm:text-lg">
            A quiet island in the Bay of Bengal, in Char Fasson upazila
            of Bhola district, known for its unspoiled beaches,
            mangroves and tranquil village life.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#073D5B] transition hover:bg-sky-100"
            >
              Join Rihla&apos;26
            </Link>
            <Link
              href="/schedule"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              View schedule
            </Link>
          </div>
        </div>

        <svg
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          className="absolute bottom-[-1px] left-0 h-16 w-full"
          aria-hidden="true"
        >
          <path
            d="M0 40C150 0 300 80 450 40S750 0 900 40 1100 70 1200 30V80H0Z"
            fill="#F3FAFF"
          />
        </svg>
      </section>

      <main className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">

        {/* Facts */}
        <dl className="relative -mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FACTS.map(({ icon: Icon, label, value }) => (
            <div key={label} className={`${cardClass} p-5`}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3FAFF] text-[#159BC1]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <dt className="text-xs font-medium text-[#123B56]/60">
                {label}
              </dt>
              <dd className="mt-1 font-bold text-[#073D5B]">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Highlights */}
        <section className="mt-16" aria-labelledby="highlights">
          <div className="mb-7">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#159BC1]">
              Discover
            </span>
            <h2 id="highlights" className="mt-2 text-2xl font-bold text-[#073D5B] sm:text-3xl">
              Island Highlights
            </h2>
            <p className="mt-2 text-sm text-[#123B56]/65">
              What makes this island worth the journey.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
              <li key={title} className={`${cardClass} group p-5`}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3FAFF] text-[#159BC1] transition group-hover:bg-[#073D5B] group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-[#073D5B]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#123B56]/65">
                  {desc}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Route */}
        <section className="mt-16" aria-labelledby="reach">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#159BC1]">
            Journey
          </span>
          <h2 id="reach" className="mt-2 text-2xl font-bold text-[#073D5B] sm:text-3xl">
            How to reach
          </h2>
          <p className="mt-2 text-sm text-[#123B56]/65">
            Three legs from Dhaka to the island.
          </p>

          <ol className="relative mt-8 ml-4 space-y-5 border-l-2 border-[#159BC1]/25">
            {ROUTE.map(({ icon: Icon, title, desc, time }, i) => (
              <li key={title} className="relative ml-8">
                <span className="absolute -left-[3.1rem] top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#073D5B] text-sm font-bold text-white ring-4 ring-[#F3FAFF]">
                  {i + 1}
                </span>

                <div className={`${cardClass} p-5`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-bold text-[#073D5B]">
                      <Icon className="h-5 w-5 text-[#159BC1]" aria-hidden="true" />
                      {title}
                    </div>
                    <span className="rounded-full bg-[#F3FAFF] px-3 py-1 text-xs font-semibold text-[#159BC1]">
                      {time}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#123B56]/65">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* What to bring */}
        <section className="mt-16" aria-labelledby="bring">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#073D5B] text-white">
              <Backpack className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#159BC1]">
                Travel essentials
              </span>
              <h2 id="bring" className="mt-1 text-2xl font-bold text-[#073D5B]">
                What to bring
              </h2>
            </div>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {BRING.map(({ icon: Icon, text }) => (
              <li key={text} className={`${cardClass} flex items-start gap-3 p-4 text-sm`}>
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#159BC1]" aria-hidden="true" />
                <span className="leading-6 text-[#123B56]/80">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Organizer note */}
        <aside className="mt-16 flex items-start gap-4 rounded-3xl bg-gradient-to-br from-[#073D5B] to-[#0B6685] p-6 text-white sm:p-8">
          <HeartHandshake className="mt-1 h-6 w-6 shrink-0 text-sky-200" aria-hidden="true" />
          <div>
            <h3 className="font-bold">Travel with SOROB</h3>
            <p className="mt-2 text-sm leading-7 text-sky-100">
              SOROB volunteers coordinate the journey from Dhaka
              to the island and back. Transportation, food and
              accommodation are arranged in advance.
            </p>
          </div>
        </aside>

        {/* Safety */}
        <p className="mt-6 flex items-start gap-3 rounded-2xl border border-[#159BC1]/15 bg-white p-4 text-sm leading-6 text-[#123B56]/70">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#159BC1]" aria-hidden="true" />
          Follow your group leaders near the water. Travel times may
          change depending on weather and tides.
        </p>

        {/* CTA */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-[#073D5B] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#159BC1]"
          >
            Register for Rihla&apos;26
          </Link>
          
        </div>

      </main>
    </div>
  );
}
