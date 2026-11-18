import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import ScheduleDay from "@/models/ScheduleDay";
import { Waves, Clock, MapPin, Info, CalendarDays } from "lucide-react";

export const metadata = { title: "Schedule – SOROB · Rihla'26" };

// Shown only until the admin adds real days.
const SAMPLE = [
  { day: 1, title: "Departure from Dhaka", summary: "Gather, check the list and begin the journey toward Bhola.", activities: [] },
  { day: 2, title: "Arrival and settling in", summary: "Reach Bhola, check in and rest. Short local exploration.", activities: [] },
  { day: 3, title: "Char Kukri Mukri exploration", summary: "Nature walk, boat trip, group activities and photography.", activities: [] },
  { day: 4, title: "Closing activities", summary: "Group gathering and preparation for the return.", activities: [] },
  { day: 5, title: "Return to Dhaka", summary: "The final schedule will be confirmed by the organizers.", activities: [] },
];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

async function ScheduleContent() {
  await connection();
  await connectDB();
  const rows = await ScheduleDay.find().sort({ day: 1 }).lean();
  const tentative = rows.length === 0;
  const days = tentative ? SAMPLE : rows;

  return (
    <div className="bg-sky-50 min-h-screen">
      <section className="relative bg-gradient-to-b from-sky-900 via-sky-700 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-28 text-center">
          <Waves className="w-10 h-10 mx-auto mb-4 text-sky-200" />
          <h1 className="text-3xl md:text-5xl font-bold">Tour Schedule</h1>
          <p className="mt-3 text-sky-100">Rihla'26 · Dhaka → Char Kukri Mukri, Bhola</p>
        </div>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="absolute bottom-[-1px] left-0 w-full h-16" aria-hidden="true">
          <path d="M0 40C150 0 300 80 450 40S750 0 900 40 1100 70 1200 30V80H0Z" className="fill-sky-50" />
        </svg>
      </section>

      <main className="max-w-3xl mx-auto px-6 pt-10 -mt-6 pb-16">
        {tentative && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px- py-3 text-sm">
            This is a tentative outline. The organizers will publish the final schedule soon.
          </div>
        )}

        <nav className="flex gap-2 overflow-x-auto pb-3 mb-6" aria-label="Jump to day">
          {days.map((d) => (
            <a key={d.day} href={`#day-${d.day}`}
              className="whitespace-nowrap rounded-full bg-white border border-sky-200 text-sky-800 px-4 py-1.5 text-sm font-medium hover:bg-sky-100">
              Day {d.day}
            </a>
          ))}
        </nav>

        <div className="space-y-12">
          {days.map((d) => (
            <section key={d.day} id={`day-${d.day}`} className="scroll-mt-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="w-11 h-11 shrink-0 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold">{d.day}</span>
                <div>
                  <h2 className="text-xl font-bold text-sky-900">{d.title}</h2>
                  {d.date && (
                    <p className="text-sm text-sky-700 inline-flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" /> {fmtDate(d.date)}
                    </p>
                  )}
                  {d.summary && <p className="text-sm text-slate-600 mt-1">{d.summary}</p>}
                </div>
              </div>

              {d.activities?.length > 0 && (
                <ol className="relative border-l-2 border-sky-200 ml-5 space-y-4">
                  {d.activities.map((a, i) => (
                    <li key={a._id?.toString() || i} className="ml-6 relative">
                      <span className="absolute -left-[33px] top-5 w-4 h-4 rounded-full bg-white border-4 border-cyan-500" />
                      <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-4">
                        {(a.startTime || a.endTime) && (
                          <p className="text-xs font-semibold text-cyan-700 inline-flex items-center gap-1 mb-1">
                            <Clock className="w-3.5 h-3.5" />
                            {a.startTime}{a.endTime ? ` – ${a.endTime}` : ""}
                          </p>
                        )}
                        <h3 className="font-semibold text-sky-900">{a.title}</h3>
                        {a.description && <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">{a.description}</p>}
                        {a.location && (
                          <p className="text-sm text-slate-500 mt-2 inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {a.location}
                          </p>
                        )}
                        {a.note && (
                          <p className="mt-3 text-sm rounded-lg bg-sky-50 text-sky-900 px-3 py-2 flex gap-2">
                            <Info className="w-4 h-4 mt-0.5 shrink-0" /> {a.note}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/register" className="inline-block rounded-lg bg-sky-700 text-white font-semibold px-6 py-3 hover:bg-sky-800">
            Register for Rihla'26
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sky-50 flex items-center justify-center text-sky-700">Loading...</div>}>
      <ScheduleContent />
    </Suspense>
  );
}