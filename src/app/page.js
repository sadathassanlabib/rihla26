
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import CountdownSection from "@/components/CountdownSection";
import {
  MapPin,
  CalendarDays,
  Users,
  ArrowUpRight,
  Phone,
  Waves,
  Sun,
  Compass,
  Ship,
  Camera,
  Mountain,
  Anchor,
  ArrowRight,
  Clock,
  TentTree,
  Globe2,
  Heart,
} from "lucide-react";
import FAQ from "@/components/FAQ";
import TermsConditions from "@/components/TermsConditions";

async function getSettings() {
  "use cache";
  await connectDB();

  const settings = await Settings.findOne({ key: "site" }).lean();

  if (!settings) return null;

  return JSON.parse(JSON.stringify(settings));
}

export default async function Home() {
  const s = await getSettings();

  const heroImage =
    s?.homeImage ||
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=90";

  return (
    <main className="overflow-hidden bg-[#F3FAFF] text-[#123B56]">

      {/* HERO */}
      <section className="relative flex min-h-[850px] items-center overflow-hidden bg-[#073D5B]">

        <div
          className="absolute inset-0 scale-105 animate-[heroZoom_25s_ease-in-out_infinite_alternate] bg-cover bg-center"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#052C46]/60 via-[#073D5B]/45 to-[#052C46]/95" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#052C46]/70 via-transparent to-transparent" />

        {/* Floating decorative elements */}
        <div className="absolute right-[12%] top-28 h-40 w-40 animate-pulse rounded-full bg-sky-300/10 blur-3xl" />
        <div className="absolute bottom-28 left-[10%] h-48 w-48 animate-pulse rounded-full bg-blue-300/10 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-32 md:pt-36">

          <div className="max-w-4xl">

            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-xl">
              <Waves className="h-4 w-4 text-sky-300" />
              <span className="tracking-widest">
                SOROB PRESENTS · WINTER 2026
              </span>
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.45em] text-sky-300">
              A JOURNEY OF DISCOVERY
            </p>

            <h1 className="text-7xl font-black tracking-tight text-white md:text-9xl">
              {s?.homeTitle || "Rihla'26"}
              <span className="text-sky-300">.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-9 text-sky-50/90 md:text-xl">
              {s?.homeBody ||
                "Beyond the familiar roads, across the blue horizon. A journey to explore nature, strengthen bonds and create memories that last."}
            </p>

            {/* Location */}
            <div className="mt-8 flex flex-wrap gap-5 text-sm font-medium text-white">
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-300" />
                Char Kukri-Mukri, Bhola
              </span>
              <span className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-sky-300" />
                24–28 December 2026
              </span>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-sky-400 px-8 py-4 font-bold text-[#073D5B] shadow-xl shadow-sky-500/20 transition-all hover:-translate-y-1 hover:bg-sky-300"
              >
                Register for the Journey
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/40 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Discover Rihla
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 md:flex">
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore</span>
            <div className="h-10 w-6 rounded-full border border-white/50 p-1">
              <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-white" />
            </div>
          </div>

        </div>

        <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#F3FAFF] to-transparent" />
      </section>

      {/* COUNTDOWN */}
    <CountdownSection status={s?.registrationStatus} role={s?.userRole} />

      {/* TRIP OVERVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="mb-14 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-600">
            THE JOURNEY AT A GLANCE
          </p>
          <h2 className="mt-4 text-4xl font-black text-[#103D59] md:text-5xl">
            A little journey. A lot of memories.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
            Everything you need to know about our upcoming journey with SOROB.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              icon: MapPin,
              label: "DESTINATION",
              value: "Char Kukri-Mukri",
              sub: "Bhola, Bangladesh",
            },
            {
              icon: CalendarDays,
              label: "TRAVEL DATE",
              value: "24–28 December",
              sub: "Winter 2026",
            },
            {
              icon: Clock,
              label: "DEPARTURE",
              value: "4:00 PM",
              sub: "24 December 2026",
            },
            {
              icon: Users,
              label: "PARTICIPANTS",
              value: "Limited Seats",
              sub: "Registration required",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="group rounded-3xl border border-sky-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-900/10"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 transition group-hover:bg-sky-600 group-hover:text-white">
                <item.icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold tracking-[0.15em] text-sky-600">
                {item.label}
              </p>
              <h3 className="mt-2 text-lg font-extrabold text-[#123B56]">
                {item.value}
              </h3>
              <p className="mt-1 text-sm text-slate-400">{item.sub}</p>
            </div>
          ))}

        </div>
      </section>

      {/* DESTINATION */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-600">
              OUR DESTINATION
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight text-[#103D59] md:text-5xl">
              Discover the beauty of
              <span className="text-sky-500"> Char Kukri-Mukri.</span>
            </h2>

            <p className="mt-7 leading-8 text-slate-500">
              Far from the rush of everyday life, Char Kukri-Mukri offers a
              beautiful coastal setting to experience nature and explore
              the charm of an island journey.
            </p>

            <div className="mt-8 space-y-5">

              {[
                [Waves, "Coastal Landscapes", "Experience the beauty of the sea and island surroundings."],
                [Sun, "Open Horizons", "Enjoy the sky, fresh air and peaceful natural environment."],
                [Heart, "Meaningful Connections", "Build friendships and share memorable moments."],
              ].map(([Icon, title, desc]) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#123B56]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}

            </div>

            <Link
              href="/about"
              className="mt-9 inline-flex items-center gap-2 font-bold text-sky-700 hover:text-sky-500"
            >
              Learn more about the journey
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] border-2 border-sky-200" />
            <img
              src={heroImage}
              alt="Coastal ocean landscape"
              className="relative h-[420px] w-full rounded-[2rem] object-cover shadow-xl md:h-[550px]"
            />
            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/30 bg-[#073D5B]/70 px-6 py-4 text-white backdrop-blur-lg">
              <p className="text-xs tracking-widest text-sky-200">EXPLORE WITH SOROB</p>
              <p className="mt-1 text-xl font-bold">Beyond the Horizon</p>
            </div>
          </div>

        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-600">
            WHAT MAKES IT SPECIAL
          </p>
          <h2 className="mt-4 text-4xl font-black text-[#103D59]">
            More than just travelling.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">

          {[
            {
              icon: Compass,
              title: "Explore",
              text: "Discover new places, experience different surroundings and enjoy the beauty of nature.",
            },
            {
              icon: Users,
              title: "Connect",
              text: "Meet fellow travellers, strengthen friendships and create shared memories.",
            },
            {
              icon: Camera,
              title: "Remember",
              text: "Capture meaningful moments and take home stories worth remembering.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-sky-100 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 text-sky-700">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-2xl font-extrabold">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-500">{item.text}</p>
            </div>
          ))}

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#073D5B] via-[#08658B] to-[#159BC1] px-6 py-24 text-center text-white">

        <div className="absolute -right-20 -top-40 h-96 w-96 animate-pulse rounded-full bg-sky-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <Ship className="mx-auto h-12 w-12 text-sky-300" />

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.35em] text-sky-200">
            YOUR NEXT STORY BEGINS HERE
          </p>

          <h2 className="mt-5 text-4xl font-black md:text-6xl">
            The horizon is waiting.
          </h2>

          <p className="mx-auto mt-6 max-w-xl leading-8 text-sky-100">
            Be a part of Rihla'26. Join the journey, meet new people and
            create memories together.
          </p>

          <Link
            href="/register"
            className="mt-10 inline-flex items-center gap-3 rounded-xl bg-white px-9 py-4 font-bold text-[#073D5B] transition hover:-translate-y-1 hover:bg-sky-100"
          >
            Register Now
            <ArrowUpRight className="h-5 w-5" />
          </Link>



        </div>
      </section>

      
      
      <FAQ/>
      
{/* ANIMATED SIGNATURE FOOTER */}




    </main>
  );
}
