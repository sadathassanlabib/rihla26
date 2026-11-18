"use client";

import { useSession } from "next-auth/react";
import Countdown from "@/components/Countdown";

const REGISTRATION_DEADLINE = "2026-12-20T23:59:00+06:00";
const TOUR_DEPARTURE = "2026-12-24T16:00:00+06:00";

export default function CountdownSection() {
  const { data: session, status } = useSession();

  const role = session?.user?.role;

  // Registered users + admin → tour countdown
  // Everyone else (guest, pending, declined) → registration deadline countdown
  const isTourCountdown = role === "registered" || role === "admin";

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
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#073D5B] via-[#09668D] to-[#159BC1] p-7 shadow-2xl shadow-sky-900/20 md:p-12">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border-[35px] border-white/5" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[35px] border-white/5" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-200">
              {config.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              {config.heading}
            </h2>

            {/* Soft CTA for guests/pending before deadline */}
            {status === "unauthenticated" && (
              <p className="mt-3 text-sm text-sky-100/90">
                Haven't registered yet?{" "}
                <a
                  href="/register"
                  className="underline font-semibold hover:text-white"
                >
                  Register now
                </a>{" "}
                before the deadline.
              </p>
            )}
            {role === "pending" && (
              <p className="mt-3 text-sm text-sky-100/90">
                Your application is still pending — hang tight, the admin will
                review it soon.
              </p>
            )}
          </div>

          <Countdown
            target={config.target}
            title={config.title}
            finishedTitle={config.finishedTitle}
            subtitle={config.subtitle}
          />
        </div>
      </div>
    </section>
  );
}