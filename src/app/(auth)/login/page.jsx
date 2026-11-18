
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowRight,
  Waves,
  Compass,
  Anchor,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) return;

    if (session.user.role === "admin") router.replace("/admin");
    else if (session.user.role === "registered") router.replace("/me");
    else if (session.user.role === "pending") router.replace("/status");
  }, [session, router]);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErr("Invalid email or password. Please try again.");
        return;
      }

      router.refresh();
    } catch {
      setErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#061A2B]">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="relative min-h-[90vh] overflow-hidden bg-[#061A2B] px-4 py-16 flex items-center justify-center">

      {/* Ocean Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-[100px]" />

        {/* Subtle wave lines */}
        <div className="absolute inset-0 opacity-[0.035]">
          <svg
            className="h-full w-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <path
              d="M-100 250 C200 150 400 350 720 250 S1200 150 1540 250"
              stroke="#48CAE4"
              strokeWidth="2"
            />
            <path
              d="M-100 300 C200 200 400 400 720 300 S1200 200 1540 300"
              stroke="#48CAE4"
              strokeWidth="2"
            />
            <path
              d="M-100 650 C200 550 400 750 720 650 S1200 550 1540 650"
              stroke="#48CAE4"
              strokeWidth="2"
            />
            <path
              d="M-100 700 C200 600 400 800 720 700 S1200 600 1540 700"
              stroke="#48CAE4"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">

        {/* Brand */}
        <div className="mb-9 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/20">
              <Compass size={23} />
            </div>

            <span className="text-2xl font-bold tracking-tight text-white">
              Rihla<span className="text-cyan-400">'26</span>
            </span>
          </Link>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-cyan-400/30" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
              The Journey Begins
            </p>
            <span className="h-px w-8 bg-cyan-400/30" />
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome <span className="text-cyan-400">Aboard.</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to continue your journey with SOROB.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-sky-300/15 bg-[#0B2D45]/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">

          <div className="mb-7">
            <h2 className="text-xl font-semibold text-white">
              Member Login
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400/60" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-sky-200/10 bg-[#061A2B]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-sky-300/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-cyan-400 transition hover:text-cyan-300"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400/60" />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-sky-200/10 bg-[#061A2B]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-sky-300/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                />
              </div>
            </div>

            {/* Error */}
            {err && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {err}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-3.5 text-sm font-bold text-[#061A2B] shadow-lg shadow-cyan-950/20 transition duration-300 hover:brightness-110 hover:shadow-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}

              {!loading && (
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 border-t border-sky-200/10 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={14} className="text-cyan-500/70" />
          <span>Secure access · An initiative by SOROB</span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] text-slate-600">
          <Anchor size={12} />
          <span>Explore Beyond the Horizon</span>
          <Waves size={13} />
        </div>
      </div>
    </main>
  );
}
