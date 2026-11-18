"use client";
import { useEffect, useState } from "react";

const money = (v) =>
  `৳ ${Number(v || 0).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
const dateLabel = (v) =>
  v ? new Date(v).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }) : "—";

export default function MoneyPrintPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/summary").then((r) => r.json()),
      fetch("/api/admin/payments").then((r) => r.json()),
      fetch("/api/admin/donations").then((r) => r.json()),
      fetch("/api/admin/expenses").then((r) => r.json()),
    ]).then(([s, p, d, e]) => {
      setData({
        sum: s,
        payments: p.payments || [],
        donations: d.donations || [],
        expenses: e.expenses || [],
      });
    });
  }, []);

  if (!data) return <p className="p-6">Loading…</p>;
  const { sum, payments, donations, expenses } = data;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white text-black">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      `}</style>

      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h1 className="text-2xl font-bold">Rihla'26 — Financial Report</h1>
          <p className="text-sm text-gray-600">
            Generated: {new Date().toLocaleString()}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-1 print-only">
        Rihla'26 — Financial Report
      </h1>
      <p className="text-sm text-gray-600 mb-6 print-only">
        Generated: {new Date().toLocaleString()}
      </p>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1">
          Summary
        </h2>
        <table className="w-full text-sm border">
          <tbody>
            <tr className="border-b">
              <td className="p-2 font-medium">Total Collected</td>
              <td className="p-2 text-right font-bold">{money(sum.collected)}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-medium">Total Donations</td>
              <td className="p-2 text-right font-bold">{money(sum.donations)}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-medium">Total Spent</td>
              <td className="p-2 text-right font-bold">{money(sum.spent)}</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="p-2 font-bold">Current Balance</td>
              <td className="p-2 text-right font-bold">{money(sum.balance)}</td>
            </tr>
            <tr>
              <td className="p-2 font-medium">Total Due (from participants)</td>
              <td className="p-2 text-right font-bold">{money(sum.due)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Payments */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1">
          Payments ({payments.length})
        </h2>
        <table className="w-full text-xs border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1.5 text-left">Date</th>
              <th className="border p-1.5 text-left">User</th>
              <th className="border p-1.5 text-right">Amount</th>
              <th className="border p-1.5 text-left">Method</th>
              <th className="border p-1.5 text-left">TxID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="border p-1.5">{dateLabel(p.date)}</td>
                <td className="border p-1.5">{p.user?.name || "—"}</td>
                <td
                  className={`border p-1.5 text-right font-semibold ${
                    p.isCorrection ? "text-red-600" : ""
                  }`}
                >
                  {p.isCorrection ? "−" : ""}
                  {money(Math.abs(p.amount))}
                </td>
                <td className="border p-1.5 capitalize">{p.method}</td>
                <td className="border p-1.5 font-mono text-[10px]">
                  {p.transactionId || "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={2} className="border p-1.5 font-bold text-right">
                Total:
              </td>
              <td className="border p-1.5 text-right font-bold">
                {money(payments.reduce((s, p) => s + p.amount, 0))}
              </td>
              <td colSpan={2} className="border"></td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Donations */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1">
          Donations ({donations.length})
        </h2>
        <table className="w-full text-xs border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1.5 text-left">Date</th>
              <th className="border p-1.5 text-left">Donor</th>
              <th className="border p-1.5 text-right">Amount</th>
              <th className="border p-1.5 text-left">Note</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d._id} className="border-b">
                <td className="border p-1.5">{dateLabel(d.date)}</td>
                <td className="border p-1.5">{d.donorName}</td>
                <td className="border p-1.5 text-right font-semibold">
                  {money(d.amount)}
                </td>
                <td className="border p-1.5">{d.note || "—"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={2} className="border p-1.5 font-bold text-right">
                Total:
              </td>
              <td className="border p-1.5 text-right font-bold">
                {money(donations.reduce((s, d) => s + d.amount, 0))}
              </td>
              <td className="border"></td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Expenses */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1">
          Expenses ({expenses.length})
        </h2>
        <table className="w-full text-xs border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1.5 text-left">Date</th>
              <th className="border p-1.5 text-left">Title</th>
              <th className="border p-1.5 text-left">Category</th>
              <th className="border p-1.5 text-right">Amount</th>
              <th className="border p-1.5 text-left">Vendor</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e._id} className="border-b">
                <td className="border p-1.5">{dateLabel(e.date)}</td>
                <td className="border p-1.5">{e.title}</td>
                <td className="border p-1.5 capitalize">{e.category}</td>
                <td className="border p-1.5 text-right font-semibold">
                  {money(e.amount)}
                </td>
                <td className="border p-1.5">{e.vendor || "—"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="border p-1.5 font-bold text-right">
                Total:
              </td>
              <td className="border p-1.5 text-right font-bold">
                {money(expenses.reduce((s, e) => s + e.amount, 0))}
              </td>
              <td className="border"></td>
            </tr>
          </tfoot>
        </table>
      </section>

      <div className="mt-8 text-xs text-gray-500 text-center border-t pt-4">
        Rihla'26 · SOROB · Financial Report · Generated{" "}
        {new Date().toLocaleString()}
      </div>
    </div>
  );
}