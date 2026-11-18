
"use client";

import { Phone } from "lucide-react";

export default function FloatingCall({ phone }) {
  if (!phone) return null;

  const number = String(phone).replace(/[^\d+]/g, "");

  return (
    <a
      href={`tel:${number}`}
      aria-label="Call SOROB directly"
      className="fixed bottom-5 right-5 z-[101] flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-xl shadow-sky-950/40 transition-all duration-300 hover:scale-110 hover:bg-sky-400 active:scale-95"
    >
      <Phone className="h-5 w-5" />
    </a>
  );
}
