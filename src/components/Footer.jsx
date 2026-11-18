'use client'
import {
  Compass,
  Users,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#031F32] px-6 py-16 text-white">

      {/* Animated background glow */}
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-sky-500/10 blur-[100px] animate-pulse" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px] animate-pulse" />

      {/* Animated waves */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden opacity-20">
        <div className="h-20 w-[200%] animate-[wave_12s_ease-in-out_infinite] rounded-[50%] border-t border-sky-300/60" />
        <div className="absolute left-[-25%] top-5 h-20 w-[200%] animate-[wave_16s_ease-in-out_infinite_reverse] rounded-[50%] border-t border-cyan-300/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-300/10 text-sky-300 shadow-[0_0_40px_rgba(56,189,248,0.12)]">
            <Compass className="h-8 w-8 animate-[spin_12s_linear_infinite]" />
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight">
            Rihla<span className="text-sky-400">'26</span>
          </h2>

          <p className="mt-3 text-sm tracking-wide text-sky-100/50">
            Beyond the familiar. Towards unforgettable.
          </p>

          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
        </div>

        {/* Developer signature */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-sky-300/60">
            Crafted with intention
          </p>

          <p className="mt-4 text-sm text-slate-400">
            Design & Development
          </p>

          <a
            href="https://www.facebook.com/YOUR-FACEBOOK-ID"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-3 inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-300/[0.06] px-7 py-4 transition-all duration-500 hover:-translate-y-1 hover:border-sky-300/60 hover:bg-sky-300/10 hover:shadow-[0_0_35px_rgba(56,189,248,0.18)]"
          >
            <span className="absolute inset-0 rounded-full bg-sky-300/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/15 text-sky-300 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
              <Users className="h-4 w-4" />
            </span>

            <span className="relative text-lg font-bold tracking-wide text-white">
              Sadat Hassan Labib
            </span>

            <ArrowUpRight className="relative h-4 w-4 text-sky-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>

          <p className="mt-4 text-xs text-slate-500">
            Exploring ideas. Building digital experiences.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 SOROB. All rights reserved.</p>
          <p className="tracking-widest">
            MADE FOR THE JOURNEY.
          </p>
        </div>

      </div>
    </footer>
  );
}
