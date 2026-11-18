
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  Waves,
  Compass,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Unable to process your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[#061A2B] px-4 py-16">

      {/* Ocean Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-[100px]" />

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
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">

        {/* Brand */}
        <div className="mb-9 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
              <Compass size={23} />
            </div>

            <span className="text-2xl font-bold tracking-tight text-white">
              Rihla<span className="text-cyan-400">'26</span>
            </span>
          </Link>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-cyan-400/30" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
              Account Recovery
            </p>
            <span className="h-px w-8 bg-cyan-400/30" />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-sky-300/15 bg-[#0B2D45]/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">

          <div className="mb-7">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
              {success ? (
                <CheckCircle2 size={27} />
              ) : (
                <Mail size={26} />
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              {success ? "Check Your Email" : "Forgot Password?"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {success
                ? "If an account exists with this email, you will receive a password reset link shortly. Please check your inbox."
                : "No worries! Enter the email address associated with your account. We'll send you instructions to reset your password."}
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">

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

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-3.5 text-sm font-bold text-[#061A2B] shadow-lg shadow-cyan-950/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              className="w-full rounded-xl border border-sky-300/20 bg-sky-400/10 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-sky-400/15"
            >
              Try Another Email
            </button>
          )}

          <div className="mt-7 border-t border-sky-200/10 pt-6">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={14} className="text-cyan-500/70" />
          <span>Secure Account Recovery · SOROB</span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] text-slate-600">
          <Waves size={13} />
          <span>Explore Beyond the Horizon</span>
        </div>
      </div>
    </main>
  );
}
