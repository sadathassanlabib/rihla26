"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

import {
  Waves, Menu, X, FileText, LogOut, LogIn, UserPlus, Info,
  CalendarDays, MapPin, Shield, LayoutDashboard, Home,
} from "lucide-react";

const COMMON_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/destination", label: "Destination", icon: MapPin },
  { href: "/about", label: "About", icon: Info },
];

const ROLE_CONFIG = {
  admin: {
    dashboard: { href: "/admin", label: "Dashboard", icon: Shield },
    profile: "/admin",
  },
  registered: {
    dashboard: { href: "/me", label: "Dashboard", icon: LayoutDashboard },
    profile: "/me",
  },
  pending: {
    dashboard: { href: "/status", label: "Status", icon: FileText },
    profile: "/status",
  },
};

const SCHEDULE_LINK = {
  href: "/schedule",
  label: "Schedule",
  icon: CalendarDays,
};

// ─── Shared link class ─────────────────────────────────
const linkBase =
  "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 " +
  "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-cyan-300 after:transition-transform after:duration-300";

// ─── Desktop nav links (uses usePathname → needs Suspense) ───
function DesktopLinks({ role }) {
  const pathname = usePathname();
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLink = (href, label, Icon) => {
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={`${linkBase} ${
          active
            ? "bg-white/15 text-white after:scale-x-100"
            : "text-sky-100/90 hover:bg-white/10 hover:text-white after:scale-x-0 hover:after:scale-x-100"
        }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </Link>
    );
  };

  return (
    <div className="hidden md:flex items-center gap-1">
      {COMMON_LINKS.map(({ href, label, icon }) => navLink(href, label, icon))}
      {role && navLink(SCHEDULE_LINK.href, SCHEDULE_LINK.label, SCHEDULE_LINK.icon)}
    </div>
  );
}

// ─── Mobile nav links (uses usePathname → needs Suspense) ───
function MobileLinks({ role, session, dashboard, profileHref, initial, onClose }) {
  const pathname = usePathname();
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {COMMON_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
            isActive(href)
              ? "bg-white/15 text-white"
              : "text-sky-100 hover:bg-white/10"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}

      {role && (
        <Link
          href={SCHEDULE_LINK.href}
          onClick={onClose}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
            isActive(SCHEDULE_LINK.href)
              ? "bg-white/15 text-white"
              : "text-sky-100 hover:bg-white/10"
          }`}
        >
          <SCHEDULE_LINK.icon className="w-4 h-4" />
          {SCHEDULE_LINK.label}
        </Link>
      )}

      <div className="pt-3 mt-2 border-t border-sky-800/60 space-y-1">
        {role ? (
          <>
            {dashboard && (
              <Link
                href={dashboard.href}
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-cyan-400 text-sky-950"
              >
                <dashboard.icon className="w-4 h-4" />
                {dashboard.label}
              </Link>
            )}

            <Link
              href={profileHref}
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-sky-50 hover:bg-white/10"
            >
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-300 to-sky-500 text-sky-950 flex items-center justify-center text-xs font-bold">
                {initial}
              </span>
              {session.user.name}
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-200 hover:bg-red-500/15"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-sky-100 hover:bg-white/10"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-white text-sky-900 hover:bg-cyan-100"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </>
        )}
      </div>
    </>
  );
}

// ─── Main Navbar (no usePathname here) ─────────────────
export default function Navbar() {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const role = session?.user?.role;
  const config = role ? ROLE_CONFIG[role] : null;
  const dashboard = config?.dashboard;
  const profileHref = config?.profile || "/";
  const initial = session?.user?.name?.charAt(0).toUpperCase() || "?";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-500 ${
        mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        scrolled
          ? "bg-sky-950/95 border-sky-700/60 shadow-lg shadow-sky-950/30"
          : "bg-sky-900/85 border-sky-800/60"
      }`}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-sky-50">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center shadow-md">
              <Waves className="w-4 h-4" />
            </span>
            <span className="hidden sm:inline tracking-wide">
              SOROB <span className="text-cyan-300">· Rihla'26</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <Suspense
            fallback={
              <div className="hidden md:flex items-center gap-1">
                {COMMON_LINKS.map(({ href, label, icon: Icon }) => (
                  <span
                    key={href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-sky-100/70"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                ))}
              </div>
            }
          >
            <DesktopLinks role={role} />
          </Suspense>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />

            {status === "loading" ? (
              <div className="w-20 h-8 rounded-lg bg-white/10 animate-pulse" />
            ) : role ? (
              <>
                {dashboard && (
                  <Link
                    href={dashboard.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/10 text-sky-50 hover:bg-white/20"
                  >
                    <dashboard.icon className="w-4 h-4" />
                    {dashboard.label}
                  </Link>
                )}

                <Link
                  href={profileHref}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20"
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-300 to-sky-500 text-sky-950 flex items-center justify-center text-xs font-bold">
                    {initial}
                  </span>
                  <span className="text-sm font-medium text-sky-50 truncate max-w-[100px]">
                    {session.user.name}
                  </span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-sky-100 hover:bg-white/10 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-sky-100 hover:bg-white/10 rounded-lg"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-white text-sky-900 hover:bg-cyan-100"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />

            <button
              onClick={() => setOpen((o) => !o)}
              className="relative w-10 h-10 rounded-lg text-sky-100 hover:bg-white/10"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu
                className={`absolute inset-0 m-auto w-5 h-5 transition-all ${
                  open ? "rotate-90 scale-0 opacity-0" : ""
                }`}
              />
              <X
                className={`absolute inset-0 m-auto w-5 h-5 transition-all ${
                  open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden grid transition-[grid-template-rows,visibility] duration-300 ${
          open ? "grid-rows-[1fr] visible" : "grid-rows-[0fr] invisible"
        }`}
      >
        <div className="overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 pb-4 pt-2 space-y-1 border-t border-sky-800/60">
            <Suspense fallback={null}>
              <MobileLinks
                role={role}
                session={session}
                dashboard={dashboard}
                profileHref={profileHref}
                initial={initial}
                onClose={() => setOpen(false)}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}