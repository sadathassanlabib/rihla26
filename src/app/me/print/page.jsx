"use client";
import { useEffect, useState } from "react";
import { Printer, Waves, AlertCircle, ArrowLeft } from "lucide-react";

const taka = (n) => "৳" + Number(n || 0).toLocaleString("en-IN");
const fmt = (d) => {
  const dt = new Date(d);
  return isNaN(dt) ? "—" : dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const PACKAGES = {
  roundtrip: "Dhaka Round Trip",
  oneway: "Dhaka One-Way",
  destination: "Join at Destination",
};

const PRINT_CSS = `
@page { size: A4; margin: 12mm; }
@media print {
  nav, header, footer, .no-print { display: none !important; }
  html, body { background: #fff !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .sheet { box-shadow: none !important; border: 1px solid #bae6fd !important; margin: 0 !important; max-width: none !important; }
  tr, .keep { break-inside: avoid; }
}
`;

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">{label}</p>
      <p className="text-sm font-semibold text-sky-950">{value || "—"}</p>
    </div>
  );
}

export default function MyPrint() {
  const [d, setD] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load your receipt"))))
      .then(setD)
      .catch((e) => setError(e.message));
  }, []);

  if (error)
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div role="alert" className="flex items-center gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-5 text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" /> {error}. Refresh the page or try again in a moment.
        </div>
      </div>
    );

  if (!d)
    return (
      <div className="mx-auto max-w-2xl space-y-3 p-6 animate-pulse" aria-busy="true">
        <div className="h-24 rounded-3xl bg-sky-200/70" />
        <div className="h-40 rounded-3xl bg-sky-200/70" />
        <div className="h-48 rounded-3xl bg-sky-200/70" />
      </div>
    );

  const u = d.user;
  const payments = d.payments || [];
  const owes = d.due > 0;
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-sky-50 px-4 py-6 print:bg-white print:p-0">
      <style>{PRINT_CSS}</style>

      {/* Screen-only toolbar */}
      <div className="no-print mx-auto mb-4 flex max-w-2xl items-center justify-between gap-3">
        <a href="/me" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-800 hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to profile
        </a>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-2xl bg-sky-900 px-5 py-2.5 font-extrabold text-white shadow-[0_5px_0_0_rgba(8,47,73,0.35)] transition hover:bg-sky-800 active:translate-y-1 active:shadow-none"
        >
          <Printer className="h-4 w-4" aria-hidden="true" /> Print
        </button>
      </div>

      {/* The receipt */}
      <article className="sheet mx-auto max-w-2xl overflow-hidden rounded-3xl border-2 border-sky-100 bg-white text-black shadow-xl shadow-sky-500/10">
        {/* Header */}
        <header className="relative bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-500 px-6 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-cyan-100">
                <Waves className="h-4 w-4" aria-hidden="true" /> SOROB · সরব
              </p>
              <h1 className="mt-1 text-3xl font-black leading-tight">Rihla'26 Receipt</h1>
              <p className="text-sm text-sky-50">Dhaka → Char Kukri-Mukri, Bhola · 24 December 2026</p>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/20 px-3 py-2 text-right text-xs backdrop-blur">
              <p className="font-bold uppercase tracking-wider text-cyan-100">Printed</p>
              <p className="font-semibold">{today}</p>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-6">
          {/* Participant */}
          <section className="keep">
            <h2 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-sky-700">Participant</h2>
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-sky-50 p-4 sm:grid-cols-3">
              <Field label="Name" value={u.name} />
              <Field label="Phone" value={u.phone} />
              <Field label="Package" value={PACKAGES[u.packageType]} />
            </div>
          </section>

          {/* Summary */}
          <section className="keep">
            <h2 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-sky-700">Summary</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border-2 border-sky-100 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Fee</p>
                <p className="text-lg font-black text-sky-950">{taka(d.fee)}</p>
              </div>
              <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Paid</p>
                <p className="text-lg font-black text-emerald-800">{taka(d.totalPaid)}</p>
              </div>
              <div className={`rounded-2xl border-2 p-3 ${owes ? "border-amber-200 bg-amber-50" : "border-cyan-200 bg-cyan-50"}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${owes ? "text-amber-700" : "text-cyan-700"}`}>
                  {owes ? "Due" : "Advance"}
                </p>
                <p className={`text-lg font-black ${owes ? "text-amber-800" : "text-cyan-800"}`}>
                  {taka(owes ? d.due : d.advance)}
                </p>
              </div>
            </div>
          </section>

          {/* Payments */}
          <section>
            <h2 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-sky-700">Payment history</h2>
            {payments.length === 0 ? (
              <p className="rounded-2xl bg-sky-50 p-4 text-sm text-slate-600">No payments recorded yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border-2 border-sky-100">
                <table className="w-full min-w-[480px] text-sm">
                  <thead className="bg-sky-900 text-left text-[11px] uppercase tracking-wider text-sky-50">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Method</th>
                      <th className="px-3 py-2">Transaction ID</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={p._id || i} className={i % 2 ? "bg-sky-50/60" : ""}>
                        <td className="px-3 py-2 text-slate-500">{i + 1}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{fmt(p.date)}</td>
                        <td className="px-3 py-2">{p.method || "—"}</td>
                        <td className="px-3 py-2 font-mono text-xs">{p.transactionId || "—"}</td>
                        <td className="px-3 py-2 text-right font-bold">{taka(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-sky-200 bg-sky-50">
                      <td colSpan={4} className="px-3 py-2 text-right text-xs font-extrabold uppercase tracking-wider text-sky-800">Total paid</td>
                      <td className="px-3 py-2 text-right font-black text-sky-950">{taka(d.totalPaid)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>

          {/* Signature + footer */}
          <footer className="keep grid grid-cols-2 gap-8 pt-8">
            <div>
              <div className="border-t-2 border-dashed border-sky-300" />
              <p className="mt-1 text-xs font-semibold text-slate-600">Participant signature</p>
            </div>
            <div>
              <div className="border-t-2 border-dashed border-sky-300" />
              <p className="mt-1 text-xs font-semibold text-slate-600">Authorized by SOROB</p>
            </div>
          </footer>
          <p className="text-center text-[11px] text-slate-500">
            This is a system-generated summary for Rihla'26. Keep it for your records.
          </p>
        </div>
      </article>
    </div>
  );
}