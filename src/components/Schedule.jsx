
import {
  Clock3,
  MapPin,
  Ship,
  Compass,
  Waves,
  Mountain,
  Flag,
  ArrowRight,
} from "lucide-react";

const schedule = [
  {
    date: "24",
    day: "THURSDAY",
    title: "Journey Begins",
    place: "Dhaka → Sadarghat",
    icon: Ship,
    events: [
      ["04:00 PM", "Departure from Dhaka"],
      ["08:00 PM", "Launch departure for Char Fasson"],
    ],
  },
  {
    date: "25",
    day: "FRIDAY",
    title: "Arrival at Char Kukri-Mukri",
    place: "Char Fasson → Kachhpia → Char Kukri-Mukri",
    icon: Compass,
    events: [
      ["07:00–08:00 AM", "Arrival at Char Fasson"],
      ["Morning", "Journey to Kachhpia Ghat by bus or auto"],
      ["Morning", "Boat journey to Char Kukri-Mukri"],
      ["10:00 AM", "Expected arrival at destination"],
      ["All Day", "Stay and scheduled activities"],
    ],
  },
  {
    date: "26",
    day: "SATURDAY",
    title: "Exploring Char Kukri-Mukri",
    place: "Char Kukri-Mukri",
    icon: Waves,
    events: [
      ["All Day", "Stay at Char Kukri-Mukri"],
      ["As Scheduled", "Travel and group activities"],
    ],
  },
  {
    date: "27",
    day: "SUNDAY",
    title: "Journey to Char Heyar",
    place: "Char Kukri-Mukri → Char Heyar",
    icon: Mountain,
    events: [
      ["Morning", "Departure for Char Heyar"],
      ["All Day", "Stay and explore Char Heyar"],
    ],
  },
  {
    date: "28",
    day: "MONDAY",
    title: "Return Journey",
    place: "Char Heyar → Dhaka",
    icon: Ship,
    events: [
      ["Morning", "Departure for Dhaka"],
      ["Overnight", "Return journey continues"],
    ],
  },
  {
    date: "29",
    day: "TUESDAY",
    title: "Back to Dhaka",
    place: "Dhaka",
    icon: Flag,
    events: [
      ["06:00 AM", "Expected arrival in Dhaka"],
      ["", "Conclusion of Rihla'26"],
    ],
  },
];

export default function Schedule() {
  return (
    <section
      id="schedule"
      className="relative overflow-hidden bg-[#F7F4ED] py-16 text-[#1D423A] sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-8">

        {/* Heading */}
        <div className="mb-12 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6BA39E]">
            24 — 29 December 2026
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1D423A] sm:text-4xl">
            Journey <span className="text-[#E07A3E]">Schedule</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71817A]">
            Six days of exploration, connection and unforgettable memories.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute bottom-5 left-[17px] top-5 w-px bg-[#D8E5DE] sm:left-[23px]" />

          <div className="space-y-5">
            {schedule.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.date}
                  className="relative pl-11 sm:pl-14"
                >
                  {/* Timeline Icon */}
                  <div className="absolute left-0 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E5DE] bg-[#F7F4ED] text-[#246A73] sm:h-12 sm:w-12">
                    <Icon size={18} />
                  </div>

                  {/* Card */}
                  <div className="rounded-xl border border-[#E7E9E2] bg-white p-4 shadow-[0_3px_15px_rgba(29,66,58,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(29,66,58,0.07)] sm:p-5">

                    {/* Date & Title */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-[#E07A3E]">
                          DAY {index + 1}
                          <span className="text-[#B7C7BE]">/</span>
                          {item.day}
                        </div>

                        <h3 className="mt-1.5 text-base font-bold text-[#1D423A] sm:text-lg">
                          {item.title}
                        </h3>

                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#82928A]">
                          <MapPin size={13} />
                          {item.place}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-baseline gap-1">
                        <span className="text-3xl font-bold leading-none text-[#246A73]/20 sm:text-4xl">
                          {item.date}
                        </span>
                        <span className="text-[10px] font-bold tracking-wider text-[#82928A]">
                          DEC
                        </span>
                      </div>
                    </div>

                    {/* Events */}
                    <div className="mt-4 space-y-3 border-t border-[#EEF0EB] pt-4">
                      {item.events.map(([time, title], i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3"
                        >
                          <span className="flex w-[105px] shrink-0 items-center gap-1.5 pt-0.5 text-[11px] font-semibold text-[#6BA39E]">
                            {time && <Clock3 size={12} />}
                            {time}
                          </span>

                          <span className="text-xs leading-5 text-[#52645C] sm:text-sm">
                            {title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Route Overview */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-[#E5E9E1] bg-white px-4 py-5 text-xs font-semibold text-[#456057]">
          <span>Dhaka</span>
          <ArrowRight size={14} className="text-[#E07A3E]" />
          <span>Char Kukri-Mukri</span>
          <ArrowRight size={14} className="text-[#E07A3E]" />
          <span>Char Heyar</span>
          <ArrowRight size={14} className="text-[#E07A3E]" />
          <span>Dhaka</span>
        </div>

        {/* Notice */}
        <p className="mt-5 text-center text-[11px] leading-6 text-[#89958D]">
          উল্লেখিত সময়গুলো সম্ভাব্য। নদীপথ, আবহাওয়া ও যাতায়াত
          পরিস্থিতির কারণে সময়সূচিতে পরিবর্তন হতে পারে।
        </p>

      </div>
    </section>
  );
}
