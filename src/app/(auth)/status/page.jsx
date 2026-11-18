"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  LogOut,
  ArrowLeft,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";

const ROLE_META = {
  pending: {
    label: "Pending Review",
    description:
      "Your application is under review. The admin will approve or decline it soon.",
    icon: Clock,
    color: "amber",
  },
  declined: {
    label: "Declined",
    description:
      "Unfortunately, your application was declined. Please contact the organizers for more details.",
    icon: XCircle,
    color: "red",
  },
  registered: {
    label: "Approved",
    description: "You're all set! Redirecting to your dashboard…",
    icon: CheckCircle2,
    color: "sky",
  },
  admin: {
    label: "Admin",
    description: "Redirecting to the admin panel…",
    icon: ShieldCheck,
    color: "sky",
  },
};

const COLOR_CLASSES = {
  amber: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    iconWrap: "bg-amber-100 text-amber-600",
    ring: "ring-amber-200",
  },
  red: {
    badge: "bg-red-50 text-red-700 border-red-200",
    iconWrap: "bg-red-100 text-red-600",
    ring: "ring-red-200",
  },
  sky: {
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    iconWrap: "bg-sky-100 text-sky-600",
    ring: "ring-sky-200",
  },
};

export default function StatusPage() {
  const { data: s, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (s.user.role === "registered") router.replace("/me");
      if (s.user.role === "admin") router.replace("/admin");
    }
  }, [s, status, router]);

  // ── Loading ──
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#F0F9FF] flex items-center justify-center px-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading your status…
        </div>
      </main>
    );
  }

  // ── Not logged in ──
  if (!s) {
    return (
      <main className="min-h-screen bg-[#F0F9FF] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-sky-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
            <User className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Not Signed In
          </h1>

          <p className="text-slate-600 mb-6 leading-relaxed">
            Please sign in to view your application status.
          </p>

          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="px-6 py-3 border border-sky-100 text-slate-700 rounded-xl font-semibold hover:bg-sky-50 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const role = s.user.role || "pending";
  const meta = ROLE_META[role] || ROLE_META.pending;
  const Icon = meta.icon;
  const colors = COLOR_CLASSES[meta.color];

  return (
    <main className="min-h-screen bg-[#F0F9FF] py-10 px-4">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-sky-600 mb-5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold mb-4">
              <MapPin className="w-3.5 h-3.5" />
              SOROB · Rihla'26
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Application Status
            </h1>

            <p className="text-slate-500 mt-1 text-sm">
              {s.user.name || s.user.email}
            </p>

            <div className="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-sky-500 to-blue-400" />
          </div>

          {/* Status card */}
          <div
            className={`rounded-xl border p-4 flex items-start gap-3 ${colors.badge}`}
          >
            <span
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colors.iconWrap}`}
            >
              <Icon className="w-5 h-5" />
            </span>

            <div>
              <p className="font-semibold text-sm">{meta.label}</p>
              <p className="text-xs mt-0.5 leading-relaxed">
                {meta.description}
              </p>
            </div>
          </div>

          {/* Details */}
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Role</dt>
              <dd className="font-medium text-slate-800 capitalize">
                {role}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-800 truncate max-w-[60%] text-right">
                {s.user.email}
              </dd>
            </div>

            {s.user.packageType && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Package</dt>
                <dd className="font-medium text-slate-800 capitalize">
                  {s.user.packageType}
                </dd>
              </div>
            )}
          </dl>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-sky-100 text-slate-700 rounded-xl font-semibold hover:bg-sky-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Organized by SOROB · Rihla'26
        </p>
      </div>
    </main>
  );
}