import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import { Waves, MapPin, CalendarDays, Ship, Users, HeartHandshake, Compass } from "lucide-react";

export const metadata = { title: "About – SOROB · Rihla'26" };

const DEFAULTS = {
  aboutTitle: "About SOROB",
  aboutBody:
    "SOROB (সরব) is a volunteer organization. We believe that brotherhood, service and time spent in nature help people discover themselves anew.",
  rihlaTitle: "What is Rihla'26?",
  rihlaBody:
    "Rihla'26 is SOROB's annual tour: four to five days from Dhaka to Char Kukri Mukri in Bhola, among rivers, mangroves and open skies. We travel together, learn together and make memories together.",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

async function AboutContent() {
  await connection();
  await connectDB();
  const s = (await Settings.findOne({ key: "site" }).lean()) || {};

  const aboutTitle = s.aboutTitle?.trim() || DEFAULTS.aboutTitle;
  const aboutBody = s.aboutBody?.trim() || DEFAULTS.aboutBody;
  const rihlaTitle = s.rihlaTitle?.trim() || DEFAULTS.rihlaTitle;
  const rihlaBody = s.rihlaBody?.trim() || DEFAULTS.rihlaBody;
  const tourDate = s.tourDate ? formatDate(s.tourDate) : "24 December 2026";

  const facts = [
    { icon: CalendarDays, label: "Departure", value: tourDate },
    { icon: MapPin, label: "Destination", value: "Char Kukri Mukri, Bhola" },
    { icon: Ship, label: "Duration", value: "Approx. 4–5 days" },
  ];
  const values = [
    { icon: HeartHandshake, title: "Brotherhood", text: "Walking together and standing by one another." },
    { icon: Compass, title: "Exploration", text: "New places, new experiences, new lessons." },
    { icon: Users, title: "Volunteering", text: "Everything built by everyone, for everyone." },
  ];

  return (
    <div className="bg-sky-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-sky-900 via-sky-700 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-28 text-center">
          <Waves className="w-10 h-10 mx-auto mb-4 text-sky-200" />
          <h1 className="text-3xl md:text-5xl font-bold">{aboutTitle}</h1>
          <p className="mt-3 text-sky-100 text-lg">SOROB · Rihla'26</p>
        </div>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none"
          className="absolute bottom-[-1px] left-0 w-full h-16" aria-hidden="true">
          <path d="M0 40C150 0 300 80 450 40S750 0 900 40 1100 70 1200 30V80H0Z" className="fill-sky-50" />
        </svg>
      </section>

      <main className="max-w-4xl mx-auto px-6 -mt-6 pb-16 space-y-10">
        {/* About SOROB */}
        <section className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-sky-900 mb-3">{aboutTitle}</h2>
          <p className="whitespace-pre-line leading-relaxed text-slate-700">{aboutBody}</p>
          {s.aboutImage && (
            <img src={s.aboutImage} alt="SOROB activities" loading="lazy"
              className="mt-5 rounded-xl w-full object-cover max-h-96" />
          )}
        </section>

        {/* Values */}
        <section className="grid gap-4 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-xl border border-sky-100 p-5">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sky-900">{title}</h3>
              <p className="text-sm text-slate-600 mt-1">{text}</p>
            </div>
          ))}
        </section>

        {/* About Rihla */}
        <section className="rounded-2xl bg-gradient-to-br from-sky-800 to-cyan-700 text-white p-6 md:p-8">
          <h2 className="text-xl font-bold mb-3">{rihlaTitle}</h2>
          <p className="whitespace-pre-line leading-relaxed text-sky-50">{rihlaBody}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-white/10 border border-white/20 p-4">
                <Icon className="w-5 h-5 text-sky-200 mb-2" />
                <p className="text-xs text-sky-200">{label}</p>
                <p className="font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <Link href="/register"
            className="inline-block mt-6 rounded-lg bg-white text-sky-900 font-semibold px-5 py-2.5 hover:bg-sky-100 transition-colors">
            Register for Rihla'26
          </Link>
        </section>
      </main>
    </div>
  );
}

export default function About() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-sky-50 flex items-center justify-center text-sky-700">
          Loading...
        </div>
      }
    >
      <AboutContent />
    </Suspense>
  );
}