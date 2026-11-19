
"use client";

import { Phone } from "lucide-react";

export default function FloatingCall({ phone }) {
  if (!phone) return null;

  const number = String(phone).replace(/[^\d+]/g, "");

  return (
    <a
      href={`tel:${number}`}
      aria-label="Call SOROB directly"
      className="group fixed bottom-36 right-5 z-[101] flex h-12 w-12 items-center justify-center rounded-full border border-[#6BA39E]/40 bg-[#1D423A] text-[#DFC5A6] shadow-[0_8px_25px_rgba(29,66,58,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#E07A3E] hover:bg-[#246A73] hover:text-white active:scale-95"
    >
      <Phone className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />

      {/* Ambient Glow */}
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#6BA39E]/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
    </a>
  );
}
