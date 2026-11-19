
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";

import {
  Waves,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  Info,
  CalendarDays,
  MapPin,
  LayoutDashboard,
  Home,
} from "lucide-react";

const COMMON_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/destination", label: "Destination", icon: MapPin },
  { href: "/about", label: "About", icon: Info },
];

const ROLE_CONFIG = {
  admin: { profile: "/admin" },
  registered: { profile: "/me" },
  pending: { profile: "/status" },
};

const SCHEDULE_LINK = {
  href: "/schedule",
  label: "Schedule",
  icon: CalendarDays,
};

const linkBase =
  "relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white";

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
            ? "bg-white/15 text-white"
            : ""
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}

        {active && (
          <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-[#E07A3E]" />
        )}
      </Link>
    );
  };

  return (
    <div className="hidden items-center gap-1 md:flex">
      {COMMON_LINKS.map(({ href, label, icon }) =>
        navLink(href, label, icon)
      )}

      {role &&
        navLink(
          SCHEDULE_LINK.href,
          SCHEDULE_LINK.label,
          SCHEDULE_LINK.icon
        )}
    </div>
  );
}

function MobileLinks({
  role,
  session,
  profileHref,
  initial,
  onClose,
}) {
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const mobileLinkClass = (href) =>
    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
      isActive(href)
        ? "bg-white/15 text-white"
        : "text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {COMMON_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className={mobileLinkClass(href)}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}

      {role && (
        <Link
          href={SCHEDULE_LINK.href}
          onClick={onClose}
          className={mobileLinkClass(SCHEDULE_LINK.href)}
        >
          <SCHEDULE_LINK.icon className="h-4 w-4" />
          {SCHEDULE_LINK.label}
        </Link>
      )}

      <div className="mt-3 space-y-1 border-t border-white/15 pt-3">
        {role ? (
          <>
            <Link
              href={profileHref}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFC5A6] text-xs font-bold text-[#1D423A]">
                {initial}
              </span>

              <span className="flex-1 truncate">
                {session?.user?.name || "My Account"}
              </span>

              <LayoutDashboard className="h-4 w-4 text-white/70" />
            </Link>

            <button
              onClick={() => {
                onClose();
                signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-200 transition hover:bg-red-400/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/85 transition hover:bg-white/10"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#DFC5A6] px-3 py-3 text-sm font-bold text-[#1D423A] transition hover:bg-[#E07A3E] hover:text-white"
            >
              <UserPlus className="h-4 w-4" />
              Register
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const role = session?.user?.role;

  const profileHref = role
    ? ROLE_CONFIG[role]?.profile || "/"
    : "/";

  const initial =
    session?.user?.name?.charAt(0).toUpperCase() || "?";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav
      className={`
        sticky top-0 z-50 w-full
        border-b border-white/15
        bg-[#1D423A]/80
        backdrop-blur-2xl
        backdrop-saturate-150
        shadow-[0_4px_24px_rgba(15,40,34,0.12)]
        transition-all duration-500
        ${mounted ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}
      `}
    >
      {/* Glass Reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[#DFC5A6] transition-all duration-300 group-hover:bg-white/20">
              <Waves className="h-5 w-5" />
            </span>

            <span className="text-base font-bold tracking-wide text-white">
              Rihla<span className="text-[#E07A3E]">'26</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <Suspense
            fallback={
              <div className="hidden h-8 w-56 animate-pulse rounded-lg bg-white/10 md:block" />
            }
          >
            <DesktopLinks role={role} />
          </Suspense>

          {/* Desktop Account */}
          <div className="hidden items-center gap-2 md:flex">
            {status === "loading" ? (
              <div className="h-9 w-24 animate-pulse rounded-lg bg-white/10" />
            ) : role ? (
              <>
                <Link
                  href={profileHref}
                  className="flex max-w-[150px] items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white transition hover:bg-white/20"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DFC5A6] text-xs font-bold text-[#1D423A]">
                    {initial}
                  </span>

                  <span className="truncate text-sm font-medium">
                    {session?.user?.name}
                  </span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  aria-label="Logout"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition hover:bg-red-400/15 hover:text-red-200"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#DFC5A6] px-4 py-2 text-sm font-bold text-[#1D423A] transition hover:bg-[#E07A3E] hover:text-white"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen((current) => !current)}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu
              className={`absolute h-5 w-5 transition-all duration-300 ${
                open
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />

            <X
              className={`absolute h-5 w-5 transition-all duration-300 ${
                open
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows,visibility] duration-300 md:hidden ${
          open
            ? "visible grid-rows-[1fr]"
            : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 bg-[#1D423A]/90 px-4 pb-5 pt-3 backdrop-blur-2xl">
            <Suspense fallback={null}>
              <MobileLinks
                role={role}
                session={session}
                profileHref={profileHref}
                initial={initial}
                onClose={() => setOpen(false)}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Bottom Glass Reflection */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </nav>
  );
}
