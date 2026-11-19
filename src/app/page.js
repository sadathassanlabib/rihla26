import Link from "next/link";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import CountdownSection from "@/components/CountdownSection";
import HomeHero from "@/components/Hero";
import {
  MapPin,
  CalendarDays,
  Users,
  ArrowUpRight,
  Waves,
  Sun,
  Compass,
  Ship,
  Camera,
  ArrowRight,
  Clock,
  Heart,
} from "lucide-react";

import FAQ from "@/components/FAQ";

// ==========================================
// RIHLA'26 COLOR PALETTE
// ==========================================

const COLORS = {
  deepMangrove: "#1D423A",   // Primary Dark
  riverTeal: "#246A73",      // Primary Mid
  seafoamMist: "#6BA39E",    // Secondary Cool
  warmSand: "#DFC5A6",       // Neutral Base
  sunsetAmber: "#E07A3E",    // Accent
};

// ==========================================
// DATABASE SETTINGS
// ==========================================

async function getSettings() {
  "use cache";

  await connectDB();

  const settings = await Settings.findOne({
    key: "site",
  }).lean();

  if (!settings) return null;

  return JSON.parse(JSON.stringify(settings));
}

// ==========================================
// HOME PAGE
// ==========================================

export default async function Home() {
  const s = await getSettings();

  const heroImage =
    s?.homeImage ||
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=90";

  return (
    <main className="overflow-hidden bg-[#DFC5A6] text-[#1D423A]">

      {/* =====================================
          HERO SECTION
      ====================================== */}

    <HomeHero
     title={s?.homeTitle}
     body={s?.homeBody}
     image={heroImage}
   />


      {/* =====================================
          COUNTDOWN
      ====================================== */}

      <CountdownSection
        status={s?.registrationStatus}
        role={s?.userRole}
      />

      {/* =====================================
          TRIP OVERVIEW
      ====================================== */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="mb-14 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#246A73]">
            THE JOURNEY AT A GLANCE
          </p>

          <h2 className="mt-4 text-4xl font-black text-[#1D423A] md:text-5xl">
            A little journey. A lot of memories.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#246A73]/70">
            Everything you need to know about our upcoming journey with SOROB.
          </p>

        </div>

        {/* Overview Cards */}

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
          ].map((item, index) => (

            <div
              key={item.label}
              className="group rounded-3xl border border-[#246A73]/15 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#1D423A]/10"
            >

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DFC5A6] text-[#246A73] transition-all duration-300 group-hover:bg-[#246A73] group-hover:text-white">

                <item.icon className="h-6 w-6" />

              </div>

              <p className="text-xs font-bold tracking-[0.15em] text-[#6BA39E]">
                {item.label}
              </p>

              <h3 className="mt-2 text-lg font-extrabold text-[#1D423A]">
                {item.value}
              </h3>

              <p className="mt-1 text-sm text-[#246A73]/55">
                {item.sub}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* =====================================
          DESTINATION SECTION
      ====================================== */}

      <section className="bg-white py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">

          {/* Destination Content */}

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6BA39E]">
              OUR DESTINATION
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight text-[#1D423A] md:text-5xl">

              Discover the beauty of

              <span className="text-[#246A73]">
                {" "}Char Kukri-Mukri.
              </span>

            </h2>

            <p className="mt-7 leading-8 text-[#246A73]/70">

              Far from the rush of everyday life, Char Kukri-Mukri offers a
              beautiful coastal setting to experience nature and explore
              the charm of an island journey.

            </p>

            {/* Destination Highlights */}

            <div className="mt-8 space-y-5">

              {[
                [
                  Waves,
                  "Coastal Landscapes",
                  "Experience the beauty of the sea and island surroundings.",
                ],
                [
                  Sun,
                  "Open Horizons",
                  "Enjoy the sky, fresh air and peaceful natural environment.",
                ],
                [
                  Heart,
                  "Meaningful Connections",
                  "Build friendships and share memorable moments.",
                ],
              ].map(([Icon, title, desc]) => (

                <div key={title} className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DFC5A6] text-[#246A73]">

                    <Icon className="h-5 w-5" />

                  </div>

                  <div>

                    <h3 className="font-bold text-[#1D423A]">
                      {title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#246A73]/65">
                      {desc}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* Learn More */}

            <Link
              href="/about"
              className="mt-9 inline-flex items-center gap-2 font-bold text-[#246A73] transition hover:text-[#E07A3E]"
            >

              Learn more about the journey

              <ArrowRight className="h-4 w-4" />

            </Link>

          </div>

          {/* Destination Image */}

          <div className="relative">

            <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] border-2 border-[#6BA39E]/50" />

            <img
              src={heroImage}
              alt="Coastal ocean landscape"
              className="relative h-[420px] w-full rounded-[2rem] object-cover shadow-xl md:h-[550px]"
            />

            {/* Image Caption */}

            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/20 bg-[#1D423A]/85 px-6 py-4 text-white backdrop-blur-lg">

              <p className="text-xs tracking-widest text-[#E07A3E]">
                EXPLORE WITH SOROB
              </p>

              <p className="mt-1 text-xl font-bold">
                Beyond the Horizon
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          EXPERIENCE SECTION
      ====================================== */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="text-center">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6BA39E]">
            WHAT MAKES IT SPECIAL
          </p>

          <h2 className="mt-4 text-4xl font-black text-[#1D423A]">
            More than just travelling.
          </h2>

        </div>

        {/* Experience Cards */}

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
              className="group rounded-3xl border border-[#246A73]/15 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#1D423A]/10"
            >

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DFC5A6] to-[#6BA39E]/40 text-[#246A73] transition-all duration-300 group-hover:bg-[#246A73] group-hover:text-white">

                <item.icon className="h-8 w-8" />

              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-[#1D423A]">
                {item.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#246A73]/65">
                {item.text}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* =====================================
          FINAL CTA SECTION
      ====================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1D423A] via-[#246A73] to-[#1D423A] px-6 py-24 text-center text-white">

        {/* Decorative Background */}

        <div className="absolute -right-20 -top-40 h-96 w-96 animate-pulse rounded-full bg-[#6BA39E]/25 blur-3xl" />

        <div className="absolute -bottom-40 -left-20 h-96 w-96 animate-pulse rounded-full bg-[#E07A3E]/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">

          <Ship className="mx-auto h-12 w-12 text-[#E07A3E]" />

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.35em] text-[#E07A3E]">
            YOUR NEXT STORY BEGINS HERE
          </p>

          <h2 className="mt-5 text-4xl font-black md:text-6xl">
            The horizon is waiting.
          </h2>

          <p className="mx-auto mt-6 max-w-xl leading-8 text-[#DFC5A6]">

            Be a part of Rihla'26. Join the journey, meet new people and
            create memories together.

          </p>

          <Link
            href="/register"
            className="mt-10 inline-flex items-center gap-3 rounded-xl bg-[#E07A3E] px-9 py-4 font-bold text-white shadow-xl shadow-black/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#F08E55]"
          >

            Register Now

            <ArrowUpRight className="h-5 w-5" />

          </Link>

        </div>

      </section>

      {/* =====================================
          FAQ SECTION
      ====================================== */}

      <FAQ />

    </main>
  );
}