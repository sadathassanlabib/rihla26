
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export default function FloatingRegisterButton() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const hero = document.getElementById("home-hero");

    if (!hero) {
      setVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, [pathname]);

  if (!visible) return null;

  return (
    <Link
      href="/register"
      aria-label="Register for Rihla 2026"
      className="
        group fixed right-4 bottom-10 z-40
        flex items-center gap-2
        overflow-hidden rounded-full
        border border-[#6BA39E]/40
        bg-[#1D423A]
        px-4 py-2.5
        text-xs font-bold tracking-wide text-[#DFC5A6]
        shadow-[0_8px_25px_rgba(29,66,58,0.3)]
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#E07A3E]
        hover:bg-[#246A73]
        hover:text-white
        active:scale-95
        animate-in slide-in-from-right-4 fade-in
      "
    >
      <span>Register</span>

      <ArrowUpRight
        size={15}
        className="text-[#E07A3E] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
      />

      {/* Hover Glow */}
      <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#6BA39E]/10 to-[#E07A3E]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
}
