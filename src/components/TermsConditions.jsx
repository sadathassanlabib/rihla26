
import React from "react";
import {
  Waves,
  ShieldCheck,
  FileText,
  ChevronRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

const terms = [
  {
    title: "Registration",
    points: [
      "Every participant must complete an individual registration form.",
      "All information provided during registration must be accurate and up to date.",
      "Submission of the registration form does not guarantee participation.",
      "Registration is considered confirmed only after verification and approval by the organizing team.",
      "The SOROB team will contact participants by phone regarding registration confirmation.",
    ],
  },
  {
    title: "Package Selection",
    points: [
      "Participants must select one of the available packages:",
    ],
    packages: [
      ["Dhaka Round Trip", "৳3,500"],
      ["Dhaka One-Way", "৳3,000"],
      ["Join at Destination", "৳2,500"],
    ],
    extra:
      "Participants are responsible for selecting the package that correctly reflects their intended travel arrangements.",
  },
  {
    title: "Payment Policy",
    points: [
      "Participants may pay through Full Payment, Partial Payment or Hand Cash.",
      "Online payments are accepted through bKash, Nagad and Rocket.",
      "Participants making online payments must provide a valid Transaction ID.",
      "Participants paying by cash must provide the receiver's name and a valid Slip or Receipt Number.",
      "Participants are responsible for providing accurate payment information.",
    ],
  },
  {
    title: "Partial Payment",
    points: [
      "The minimum initial payment for Partial Payment is ৳1,000.",
      "The remaining balance must be paid within 3 days of the initial payment.",
      "Failure to complete the remaining payment within the specified period may affect the participant's registration status.",
      "Participants should contact the organizing team regarding any payment-related difficulties.",
    ],
  },
  {
    title: "Cancellation & Refund Policy",
    points: [
      "Rihla'26 follows a Full Refund Policy.",
      "Participants who cancel their registration are eligible for a refund of the full amount they have paid.",
      "Refund requests must be communicated to the SOROB organizing team.",
      "Refunds will be processed after verification of the participant's registration and payment records.",
    ],
  },
  {
    title: "Participant Responsibilities",
    points: [
      "Participants must provide a valid emergency contact.",
      "Participants should disclose relevant medical conditions, dietary requirements or other important information in the Additional Information section.",
      "Participants must follow the instructions and guidelines provided by the organizing team.",
      "Participants are expected to behave responsibly and respectfully throughout the journey.",
    ],
  },
  {
    title: "Travel & Safety",
    points: [
      "Participants must follow the designated travel schedule and reporting instructions.",
      "Participants must cooperate with the organizers during transportation, accommodation and other trip-related activities.",
      "Any changes to travel arrangements or schedules will be communicated by the organizing team.",
      "Participants must take reasonable care of their personal belongings and health throughout the journey.",
    ],
  },
  {
    title: "Organizational Authority",
    points: [
      "SOROB reserves the right to make necessary changes to the itinerary, schedule or travel arrangements when required.",
      "The organizing team reserves the right to take appropriate action in case of serious violations of trip rules or disruptive behavior.",
      "Important updates and instructions will be communicated through official SOROB channels.",
    ],
  },
  {
    title: "Agreement",
    points: [
      "By submitting the registration form, participants confirm that they have read, understood and agreed to these Terms & Conditions.",
    ],
  },
];

export default function TermsConditions() {
  return (
    <section
      id="terms"
      className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50 to-blue-50 px-4 py-16 sm:px-6 lg:py-24"
    >
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200">
            <FileText size={28} />
          </div>

          <span className="rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
            Rihla'26 • Important Information
          </span>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Terms &
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
              {" "}Conditions
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            By registering for Rihla'26, organized by SOROB,
            participants agree to the following terms and conditions.
          </p>
        </div>

        {/* Terms Cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {terms.map((term, index) => (
            <div
              key={term.title}
              className="group rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl hover:shadow-blue-100/70 sm:p-7"
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-md shadow-blue-200 transition-transform group-hover:scale-110">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  {term.title}
                </h3>
              </div>

              <ul className="space-y-3">
                {term.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ChevronRight
                      size={17}
                      className="mt-1 shrink-0 text-sky-500"
                    />
                    <span className="text-sm leading-7 text-slate-600">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Package Pricing */}
              {term.packages && (
                <div className="mt-5 space-y-2">
                  {term.packages.map(([name, price]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {name}
                      </span>
                      <span className="font-bold text-blue-700">
                        {price}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {term.extra && (
                <p className="mt-4 rounded-xl bg-sky-50 p-4 text-sm leading-7 text-slate-600">
                  {term.extra}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Agreement Highlight */}
        <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-7 text-white shadow-xl shadow-blue-200 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <ShieldCheck size={30} />
            </div>

            <h3 className="text-2xl font-extrabold sm:text-3xl">
              Organized by SOROB
            </h3>

            <p className="mt-3 text-sm leading-7 text-blue-100">
              By registering for Rihla'26, you acknowledge and
              agree to follow all the terms and conditions.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-sm font-semibold text-white">
              <span className="flex items-center gap-2">
                <Waves size={17} />
                Rihla'26
              </span>

              <span className="flex items-center gap-2">
                <MapPin size={17} />
                Char Kukri-Mukri, Bhola
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays size={17} />
                24 December 2026
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
