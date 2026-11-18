"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Wallet, FileText, CalendarDays } from "lucide-react";

const TABS = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/money", label: "Money", icon: Wallet },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/schedule", label: "Schedule", icon: CalendarDays },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="mb-6 flex gap-2 overflow-x-auto pb-1">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-bold transition-all motion-reduce:transition-none ${
              active
                ? "bg-sky-900 text-white shadow-[0_4px_0_0_rgba(8,47,73,0.35)]"
                : "bg-white text-sky-800 border-2 border-sky-100 hover:border-cyan-300 hover:-translate-y-0.5"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}