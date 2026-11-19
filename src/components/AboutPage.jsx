import Link from "next/link";
import {
  HeartHandshake, MapPin, CalendarDays, Clock, Users, ClipboardList,
  BadgeCheck, Wallet, Printer, Phone, ArrowRight, Code2,
} from "lucide-react";

/* ------------------------------------------------------------------
   CONTENT — edit everything here.
   Replace INTRO with the wording from the SOROB Facebook page's
   About / Intro section so the site and the page say the same thing.
------------------------------------------------------------------- */
const FACEBOOK_URL = "https://www.facebook.com/the.sorob";
const HOTLINE = "+880000000";
const DEV_FACEBOOK = process.env.NEXT_PUBLIC_DEV_FACEBOOK;

const INTRO = [
  "SOROB (সরব) is a volunteer organization. Its work is done by volunteers who give their time, and Rihla'26 is one of the journeys they organize.",
  "This website helps the volunteers run the tour openly: registration, approval, payments and schedule are all in one place, so every participant knows where things stand.",
];

const TOUR_FACTS = [
  { icon: MapPin, label: "Route", value: "Dhaka → Bhola → Char Fasson → Char Kukri-Mukri & Char Hare" },
  { icon: CalendarDays, label: "Starts", value: "Thursday, 24 December 2026" },
  { icon: Clock, label: "Length", value: "About 4–5 days" },
  { icon: Users, label: "Organized by", value: "SOROB volunteers" },
];

const STEPS = [
  { icon: ClipboardList, title: "Register", desc: "Fill in the registration form with your details." },
  { icon: BadgeCheck, title: "Get approved", desc: "An admin reviews your registration. Your status shows on your profile." },
  { icon: Wallet, title: "Track your money", desc: "After approval, see your fee, what you have paid and what is due." },
  { icon: Printer, title: "Print your details", desc: "Print your participant details to carry on the tour." },
];

/* Add more people here as objects: { name, role, href } */


const card = "rounded-2xl border border-[#246A73]/15 bg-white shadow-sm";

const css = `
@keyframes abWave{0%{transform:translateX(0)}100%{transform:translateX(-400px)}}
.ab-wave{animation:abWave 20s linear infinite}
@media (prefers-reduced-motion:reduce){.ab-wave{animation:none}}`;

const wave = `M0 40 q100 -14 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 V120 H0Z`;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#DFC5A6] text-[#1D423A]">
      <style>{css}</style>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1D423A] via-[#246A73] to-[#4F8E8E] text-white">
        <div className="mx-auto max-w-4xl px-6 pb-40 pt-20 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-[#DFC5A6] backdrop-blur-xl">
            <HeartHandshake className="h-4 w-4" aria-hidden="true" />
            About SOROB
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            সরব <span className="text-[#DFC5A6]">·</span> SOROB
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#DFC5A6]/90 sm:text-lg">
            Beyond the familiar. Towards unforgettable.
          </p>
        </div>

        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-[-1px] left-0 h-20 w-full" aria-hidden="true">
          <g className="ab-wave"><path d={wave} fill="#6BA39E" opacity="0.45" /></g>
          <path d="M0 92 C200 70 420 108 640 90 S1000 74 1200 92 V120 H0Z" fill="#DFC5A6" />
        </svg>
      </section>

      <main className="mx-auto my-20 max-w-4xl pt-10 px-5 pb-20 sm:px-8">
        {/* WHO WE ARE */}
        <section className="-mt-16 grid gap-5 md:grid-cols-5" aria-labelledby="who">
          <div className={`${card} p-6 md:col-span-3`}>
            <h2 id="who" className="text-xl font-bold">Who we are</h2>
            {INTRO.map((p) => (
              <p key={p} className="mt-3 text-sm leading-7 text-[#1D423A]/80">{p}</p>
            ))}
          </div>

          <div className={`${card} p-6 md:col-span-2`}>
            <h2 className="text-xl font-bold">Find us</h2>
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#246A73] underline-offset-4 hover:underline">
                  facebook.com/the.sorob
                </a>
                <p className="text-xs text-[#246A73]/70">News and updates from SOROB</p>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#246A73]" aria-hidden="true" />
                <a href={`tel:${HOTLINE}`} className="font-semibold hover:underline">{HOTLINE}</a>
              </li>
            </ul>
          </div>
        </section>

        {/* ABOUT THE TOUR */}
        <section className="mt-16" aria-labelledby="tour">
          <h2 id="tour" className="text-2xl font-bold sm:text-3xl">About Rihla&apos;26</h2>
          <p className="mt-2 text-sm text-[#246A73]/70">A volunteer-organized journey to two islands of the Bay of Bengal.</p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {TOUR_FACTS.map(({ icon: Icon, label, value }) => (
              <div key={label} className={`${card} flex items-start gap-3 p-4`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DFC5A6] text-[#246A73]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-xs text-[#246A73]/65">{label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold leading-6">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
          <Link href="/destination" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#246A73] hover:underline">
            See the destination <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-16" aria-labelledby="how">
          <h2 id="how" className="text-2xl font-bold sm:text-3xl">How the tour works</h2>
          <p className="mt-2 text-sm text-[#246A73]/70">From registration to the day we leave.</p>
          <ol className="relative ml-4 mt-8 space-y-5 border-l-2 border-dashed border-[#246A73]/25">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="relative ml-8">
                <span className="absolute -left-[3.1rem] top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#1D423A] text-sm font-bold text-white ring-4 ring-[#DFC5A6]">{i + 1}</span>
                <div className={`${card} flex items-start gap-3 p-5`}>
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#246A73]" aria-hidden="true" />
                  <div>
                    <p className="font-bold">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#246A73]/75">{desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

    

        {/* CTA */}
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="group inline-flex items-center gap-2 rounded-xl bg-[#1D423A] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#246A73]">
            Register for Rihla&apos;26
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#1D423A]/25 bg-white/60 px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white">
            Follow SOROB on Facebook
          </a>
        </div>
      </main>
    </div>
  );
}