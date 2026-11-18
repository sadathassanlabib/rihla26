"use client";
import { useEffect, useState } from "react";
import {
  Phone, Mail, MapPin, Cake, Droplet, Shirt, User, ShieldAlert,
  Ticket, Wallet, Printer, StickyNote, Sparkles, TrendingUp, AlertCircle,
} from "lucide-react";

const PACKAGES = {
  roundtrip: "Dhaka Round Trip",
  oneway: "Dhaka One-Way",
  destination: "Join at Destination",
};

const taka = (n) => "৳" + Number(n || 0).toLocaleString("en-IN");
const fmtDob = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt) ? String(d) : dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading profile">
      <div className="h-36 rounded-3xl bg-sky-100" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 rounded-2xl bg-sky-100" />
        <div className="h-20 rounded-2xl bg-sky-100" />
        <div className="h-20 rounded-2xl bg-sky-100" />
      </div>
      <div className="h-44 rounded-3xl bg-sky-100" />
    </div>
  );
}

function Chip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sky-600">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="truncate text-sm font-medium text-slate-900">{value || "—"}</p>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-sky-600" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function MePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load your profile"))))
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error)
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div role="alert" className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}. Refresh or try again in a moment.
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="mx-auto max-w-2xl p-4">
        <Skeleton />
      </div>
    );

  const u = data.user;
  const fee = Number(data.fee || 0);
  const paid = Number(data.totalPaid || 0);
  const owes = data.due > 0;
  const pct = fee > 0 ? Math.min(100, Math.round((paid / fee) * 100)) : 0;
  const settled = !owes && fee > 0;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-cyan-500 p-6 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-sky-600">
            {u.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur">
              <Sparkles className="h-3 w-3" aria-hidden="true" /> Rihla'26
            </span>
            <h1 className="mt-1 truncate text-xl font-bold leading-tight">{u.name}</h1>
            <p className="truncate text-sm text-sky-50/90">{u.email}</p>
          </div>
        </div>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <a href={`tel:${u.phone}`} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur transition hover:bg-white/25">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {u.phone || "—"}
          </a>
          <a href={`mailto:${u.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur transition hover:bg-white/25">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email
          </a>
        </div>
      </section>

      {/* Money */}
      <section aria-labelledby="money-h">
        <h2 id="money-h" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Wallet className="h-4 w-4 text-sky-600" aria-hidden="true" /> Payment
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Fee</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{taka(fee)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Paid</p>
            <p className="mt-1 text-lg font-bold text-emerald-800">{taka(paid)}</p>
          </div>
          <div className={`rounded-2xl border p-4 ${owes ? "border-amber-200 bg-amber-50" : "border-sky-200 bg-sky-50"}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${owes ? "text-amber-700" : "text-sky-700"}`}>
              {owes ? "Due" : "Advance"}
            </p>
            <p className={`mt-1 text-lg font-bold ${owes ? "text-amber-800" : "text-sky-800"}`}>
              {taka(owes ? data.due : data.advance)}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-900">
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-sky-600" aria-hidden="true" /> Progress
            </span>
            <span>{pct}%</span>
          </div>
          <div
            role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
            className="h-2 overflow-hidden rounded-full bg-slate-100"
          >
            <div
              style={{ width: `${pct}%` }}
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-1000 ease-out motion-reduce:transition-none"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {fee === 0
              ? "Your fee has not been set yet."
              : settled
              ? "All paid up. You're good to go 🎉"
              : `${taka(data.due)} left to pay.`}
          </p>
        </div>
      </section>

      {/* Package */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Ticket className="h-4 w-4 text-sky-600" aria-hidden="true" /> Your Package
          </span>
          <span className="text-xs text-slate-400">Rihla'26</span>
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Type</p>
            <p className="text-base font-bold text-slate-900">{PACKAGES[u.packageType] || "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Fee</p>
            <p className="text-base font-bold text-slate-900">{taka(u.packageFee)}</p>
          </div>
        </div>
      </section>

      {/* Personal */}
      <Section icon={User} title="Personal">
        <div className="grid gap-2 sm:grid-cols-2">
          <Chip icon={Cake} label="Date of birth" value={fmtDob(u.dob)} />
          <Chip icon={User} label="Gender" value={u.gender} />
          <Chip icon={Droplet} label="Blood group" value={u.bloodGroup} />
          <Chip icon={Shirt} label="T-shirt size" value={u.tshirtSize} />
          <Chip icon={MapPin} label="Address" value={u.address} />
        </div>
      </Section>

      {/* Emergency */}
      <Section icon={ShieldAlert} title="Emergency contact">
        <div className="grid gap-2 sm:grid-cols-2">
          <Chip icon={User} label="Name" value={u.emergencyName} />
          <Chip icon={Phone} label="Phone" value={u.emergencyPhone} />
        </div>
      </Section>

      {u.notes && (
        <Section icon={StickyNote} title="Notes">
          <p className="whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{u.notes}</p>
        </Section>
      )}

      <a
        href="/me/print"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <Printer className="h-4 w-4" aria-hidden="true" /> Print my sheet
      </a>
    </div>
  );
}