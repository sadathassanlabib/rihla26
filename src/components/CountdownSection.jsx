
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Countdown from "@/components/Countdown";

const REGISTRATION_DEADLINE = "2026-12-20T23:59:00+06:00";
const TOUR_DEPARTURE = "2026-12-24T16:00:00+06:00";

export default function CountdownSection() {
  const { data: session, status } = useSession();

  const role = session?.user?.role;

  const isTourCountdown =
    role === "registered" || role === "admin";

  const config = isTourCountdown
    ? {
        target: TOUR_DEPARTURE,
        eyebrow: "THE COUNTDOWN HAS BEGUN",
        heading: "Every second brings us closer.",
        title: "The journey begins in",
        finishedTitle: "The journey has begun",
        subtitle: "24 December 2026 · 4:00 PM · Bangladesh Time",
      }
    : {
        target: REGISTRATION_DEADLINE,
        eyebrow: "REGISTRATION CLOSES SOON",
        heading: "Don't miss the boat.",
        title: "Registration closes in",
        finishedTitle: "Registration has closed",
        subtitle: "20 December 2026 · 11:59 PM · Bangladesh Time",
      };

  return (
    <section className="relative z-20 mx-auto -mt-10 max-w-6xl px-5">

      <div className="relative isolate overflow-hidden rounded-3xl border border-[#6BA39E]/30 bg-[#DFC5A6] px-5 py-9 shadow-[0_20px_60px_rgba(29,66,58,0.13)] sm:px-8 sm:py-11 md:px-12">

        {/* Background Decorations */}
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border-[35px] border-[#246A73]/[0.09]" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full border-[35px] border-[#1D423A]/[0.08]" />

        <div className="pointer-events-none absolute right-1/3 top-0 -z-10 h-48 w-48 rounded-full bg-[#6BA39E]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl">

          {/* Heading */}
          <div className="mb-8 text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#246A73]/20 bg-[#1D423A]/[0.07] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#246A73]">
              <Clock3 size={13} className="text-[#E07A3E]" />
              {config.eyebrow}
            </div>

            <h2 className="text-2xl font-black tracking-tight text-[#1D423A] sm:text-3xl md:text-4xl">
              {config.heading}
            </h2>

            <p className="mt-3 text-sm font-medium text-[#246A73]/80">
              {config.title}
            </p>

            {/* Guest CTA */}
            {status === "unauthenticated" && (
              <p className="mt-5 text-sm text-[#1D423A]/70">
                Haven't registered yet?{" "}
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 font-bold text-[#C45F2D] transition-colors hover:text-[#246A73]"
                >
                  Register now
                  <ArrowUpRight size={14} />
                </Link>
              </p>
            )}

            {/* Pending Notice */}
            {role === "pending" && (
              <p className="mx-auto mt-5 max-w-lg rounded-xl border border-[#246A73]/15 bg-[#F7F3EB]/70 px-4 py-3 text-xs leading-6 text-[#246A73]">
                Your application is still pending. Our team will
                review it and contact you soon.
              </p>
            )}
          </div>

          {/* Countdown Glass Panel */}
          <div className="relative overflow-hidden rounded-2xl border border-[#6BA39E]/30 bg-[#1D423A] px-3 py-6 shadow-[0_12px_35px_rgba(29,66,58,0.18)] sm:px-6 sm:py-8">

            {/* Glass Effects */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#246A73]/40 via-transparent to-[#1D423A]/20" />

            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#6BA39E]/10 blur-3xl" />

            <div className="relative z-10">
              <Countdown
                target={config.target}
                title={config.title}
                finishedTitle={config.finishedTitle}
                subtitle={config.subtitle}
              />
            </div>
          </div>

          {/* Footer Date */}
          <div className="mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#246A73]/30" />

            <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#246A73]">
              RIHLA'26 · 24 — 29 DECEMBER 2026
            </p>

            <span className="h-px w-8 bg-[#246A73]/30" />
          </div>

        </div>
      </div>
    </section>
  );
}
