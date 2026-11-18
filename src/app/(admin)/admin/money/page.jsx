"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Banknote,
  AlertCircle,
  Loader2,
  Plus,
  FileSpreadsheet,
  Trash2,
  X,
  CreditCard,
  Gift,
  Receipt,
  Search,
  RefreshCw,
  CheckCircle2,
  UserRound,
  Filter,
  Printer,
} from "lucide-react";

const TABS = [
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "donations", label: "Donations", icon: Gift },
  { key: "expenses", label: "Expenses", icon: Receipt },
];

const EXPENSE_CATEGORIES = [
  "transport",
  "food",
  "boat",
  "stay",
  "activities",
  "misc",
];

const money = (value) =>
  `৳ ${Number(value || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

const dateLabel = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.error || data.message || `Request failed (${response.status})`
    );
  }
  return data;
}

const EMPTY_FORM = {
  payments: { userId: "", amount: "", method: "", transactionId: "" },
  donations: { donorName: "", amount: "", note: "" },
  expenses: { title: "", category: "", amount: "", vendor: "" },
};

export default function MoneyPage() {
  const [sum, setSum] = useState(null);
  const [payments, setPayments] = useState([]);
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("payments");
  const [form, setForm] = useState(EMPTY_FORM.payments);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError("");
    try {
      const endpoints = [
        "/api/admin/summary",
        "/api/admin/payments",
        "/api/admin/donations",
        "/api/admin/expenses",
        "/api/admin/users?limit=1000",
      ];
      const responses = await Promise.all(endpoints.map((url) => fetch(url)));
      const [s, p, d, e, u] = await Promise.all(responses.map(readResponse));
      setSum(s);
      setPayments(Array.isArray(p.payments) ? p.payments : []);
      setDonations(Array.isArray(d.donations) ? d.donations : []);
      setExpenses(Array.isArray(e.expenses) ? e.expenses : []);
      setUsers(Array.isArray(u.users) ? u.users : []);
    } catch (err) {
      setError(err.message || "Could not load money data.");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!modalOpen && !deleteTarget) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !busy && !deleting) {
        setModalOpen(false);
        setDeleteTarget(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, deleteTarget, busy, deleting]);

  const openAddModal = () => {
    setForm({ ...EMPTY_FORM[tab] });
    setModalOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter an amount greater than zero.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const payload = { ...form, amount };
      const response = await fetch(`/api/admin/${tab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await readResponse(response);
      setModalOpen(false);
      setForm({ ...EMPTY_FORM[tab] });
      setNotice(
        `${
          tab === "payments"
            ? "Payment"
            : tab === "donations"
            ? "Donation"
            : "Expense"
        } added successfully.`
      );
      await refresh(false);
    } catch (err) {
      setError(err.message || "Could not save this entry.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/${deleteTarget.kind}/${deleteTarget.id}`,
        { method: "DELETE" }
      );
      await readResponse(response);
      setDeleteTarget(null);
      setNotice(
        "Entry deleted. A correction entry may be created by the server."
      );
      await refresh(false);
    } catch (err) {
      setError(err.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const currentRows =
    tab === "payments" ? payments : tab === "donations" ? donations : expenses;

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return currentRows;
    return currentRows.filter((item) => {
      const values =
        tab === "payments"
          ? [
              item.user?.name,
              item.user?.email,
              item.method,
              item.transactionId,
              item.amount,
            ]
          : tab === "donations"
          ? [item.donorName, item.note, item.amount]
          : [item.title, item.category, item.vendor, item.amount];
      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [currentRows, search, tab]);

  const openDelete = (kind, item) => {
    setDeleteTarget({
      kind,
      id: item._id,
      title:
        kind === "payments"
          ? `${item.user?.name || "Payment"} · ${money(item.amount)}`
          : kind === "donations"
          ? `${item.donorName || "Donation"} · ${money(item.amount)}`
          : `${item.title || "Expense"} · ${money(item.amount)}`,
    });
  };

  if (loading && !sum) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading money dashboard…</span>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-6 p-3 sm:p-5 lg:p-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Finance management
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Money Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage payments, donations and event expenses.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <a
            href="/admin/money/print"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" />
            Print
          </a>

          <a
            href="/api/admin/export/money"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </a>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="min-w-0 flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          <CheckCircle2 className="h-4 w-4" /> {notice}
        </div>
      )}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <SummaryCard
          icon={<TrendingUp />}
          label="Collected"
          value={sum?.collected}
          tone="emerald"
        />
        <SummaryCard
          icon={<Gift />}
          label="Donations"
          value={sum?.donations}
          tone="blue"
        />
        <SummaryCard
          icon={<TrendingDown />}
          label="Spent"
          value={sum?.spent}
          tone="rose"
        />
        <SummaryCard
          icon={<Wallet />}
          label="Balance"
          value={sum?.balance}
          tone={Number(sum?.balance || 0) >= 0 ? "emerald" : "rose"}
        />
        <SummaryCard
          icon={<AlertCircle />}
          label="Due"
          value={sum?.due}
          tone="amber"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Transactions</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Browse and manage your finance records.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
          >
            <Plus className="h-4 w-4" />
            Add{" "}
            {tab === "payments"
              ? "Payment"
              : tab === "donations"
              ? "Donation"
              : "Expense"}
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 md:w-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTab(key);
                  setSearch("");
                }}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                  tab === key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    tab === key
                      ? "bg-slate-100 text-slate-700"
                      : "bg-slate-200/70 text-slate-500"
                  }`}
                >
                  {key === "payments"
                    ? payments.length
                    : key === "donations"
                    ? donations.length
                    : expenses.length}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${tab}…`}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredRows.length === 0 ? (
            <EmptyState
              message={
                search ? "No matching records found" : `No ${tab} records yet`
              }
            />
          ) : (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {tab === "payments" ? (
                  <tr>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3">Transaction ID</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                ) : tab === "donations" ? (
                  <tr>
                    <th className="px-5 py-3">Donor</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3">Note</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-5 py-3">Expense</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3">Vendor</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-slate-50/80"
                  >
                    {tab === "payments" ? (
                      <>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800">
                            {item.user?.name || "Unknown user"}
                          </div>
                          <div className="mt-0.5 text-xs text-slate-400">
                            {item.user?.email || "—"}
                          </div>
                        </td>
                        <td
                          className={`px-5 py-4 text-right font-bold tabular-nums ${
                            item.isCorrection
                              ? "text-rose-600"
                              : "text-slate-900"
                          }`}
                        >
                          {item.isCorrection ? "− " : ""}
                          {money(Math.abs(Number(item.amount || 0)))}
                          {item.isCorrection && (
                            <div className="text-[10px] font-medium text-rose-500">
                              Correction
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill>{item.method || "—"}</StatusPill>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">
                          {item.transactionId || "—"}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                          {dateLabel(item.date)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {!item.isCorrection && (
                            <DeleteButton
                              onClick={() => openDelete("payments", item)}
                            />
                          )}
                        </td>
                      </>
                    ) : tab === "donations" ? (
                      <>
                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {item.donorName || "—"}
                        </td>
                        <td className="px-5 py-4 text-right font-bold tabular-nums text-blue-700">
                          {money(item.amount)}
                        </td>
                        <td className="max-w-xs truncate px-5 py-4 text-slate-500">
                          {item.note || "—"}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                          {dateLabel(item.date)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <DeleteButton
                            onClick={() => openDelete("donations", item)}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {item.title || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill tone="rose">
                            {item.category || "Other"}
                          </StatusPill>
                        </td>
                        <td className="px-5 py-4 text-right font-bold tabular-nums text-rose-600">
                          {money(item.amount)}
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {item.vendor || "—"}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                          {dateLabel(item.date)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <DeleteButton
                            onClick={() => openDelete("expenses", item)}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
          <span>
            Showing {filteredRows.length} of {currentRows.length} records
          </span>
          <span className="inline-flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Live search
          </span>
        </div>
      </section>

      {modalOpen && (
        <Modal onClose={() => !busy && setModalOpen(false)}>
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                New transaction
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Add{" "}
                {tab === "payments"
                  ? "Payment"
                  : tab === "donations"
                  ? "Donation"
                  : "Expense"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the details below to save this record.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={busy}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4 px-5 py-5 sm:px-6">
            {tab === "payments" ? (
              <>
                <Field label="Select user" icon={<UserRound />}>
                  <select
                    required
                    value={form.userId}
                    onChange={(e) =>
                      setForm({ ...form, userId: e.target.value })
                    }
                    className="modal-input"
                  >
                    <option value="">Choose a user…</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Amount (BDT)">
                    <input
                      required
                      min="0.01"
                      step="0.01"
                      type="number"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      placeholder="e.g. 1500"
                      className="modal-input"
                    />
                  </Field>
                  <Field label="Payment method">
                    <select
                      required
                      value={form.method}
                      onChange={(e) =>
                        setForm({ ...form, method: e.target.value })
                      }
                      className="modal-input"
                    >
                      <option value="">Choose method…</option>
                      <option value="bkash">bKash</option>
                      <option value="nagad">Nagad</option>
                      <option value="rocket">Rocket</option>
                      <option value="cash">Cash</option>
                    </select>
                  </Field>
                </div>
                <Field label="Transaction ID" optional>
                  <input
                    value={form.transactionId}
                    onChange={(e) =>
                      setForm({ ...form, transactionId: e.target.value })
                    }
                    placeholder="Enter transaction ID (optional)"
                    className="modal-input"
                  />
                </Field>
              </>
            ) : tab === "donations" ? (
              <>
                <Field label="Donor name">
                  <input
                    required
                    value={form.donorName}
                    onChange={(e) =>
                      setForm({ ...form, donorName: e.target.value })
                    }
                    placeholder="Enter donor name"
                    className="modal-input"
                  />
                </Field>
                <Field label="Amount (BDT)">
                  <input
                    required
                    min="0.01"
                    step="0.01"
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    placeholder="e.g. 5000"
                    className="modal-input"
                  />
                </Field>
                <Field label="Note" optional>
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={(e) =>
                      setForm({ ...form, note: e.target.value })
                    }
                    placeholder="Add a short note…"
                    className="modal-input resize-none"
                  />
                </Field>
              </>
            ) : (
              <>
                <Field label="Expense title">
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g. Bus rental"
                    className="modal-input"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Category">
                    <select
                      required
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="modal-input"
                    >
                      <option value="">Choose category…</option>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category[0].toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Amount (BDT)">
                    <input
                      required
                      min="0.01"
                      step="0.01"
                      type="number"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      placeholder="e.g. 2500"
                      className="modal-input"
                    />
                  </Field>
                </div>
                <Field label="Vendor" optional>
                  <input
                    value={form.vendor}
                    onChange={(e) =>
                      setForm({ ...form, vendor: e.target.value })
                    }
                    placeholder="Vendor or provider name"
                    className="modal-input"
                  />
                </Field>
              </>
            )}

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={busy}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {busy ? "Saving…" : "Save transaction"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal onClose={() => !deleting && setDeleteTarget(null)} small>
          <div className="p-6 text-center sm:p-7">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Delete this entry?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              You are about to delete{" "}
              <span className="font-semibold text-slate-700">
                {deleteTarget.title}
              </span>
              .
              {deleteTarget.kind === "payments"
                ? " The server may create a correction entry for this payment."
                : " This action cannot be undone."}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
      <style jsx global>{`
        .modal-input {
          display: block;
          width: 100%;
          min-height: 44px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          padding: 10px 12px;
          color: #0f172a;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .modal-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgb(16 185 129 / 0.12);
        }
        .modal-input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </main>
  );
}

function SummaryCard({ icon, label, value, tone = "slate" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    slate: "bg-slate-50 text-slate-700 ring-slate-100",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div
        className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}
      >
        {icon}
      </div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        {money(value)}
      </div>
    </div>
  );
}

function Field({ label, optional, icon, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        {icon && (
          <span className="text-slate-400 [&>svg]:h-3.5 [&>svg]:w-3.5">
            {icon}
          </span>
        )}
        {label}
        {optional && (
          <span className="font-normal text-slate-400">(optional)</span>
        )}
      </span>
      {children}
    </label>
  );
}

function Modal({ children, onClose, small = false }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        className={`my-auto w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 ${
          small ? "max-w-md" : "max-w-xl"
        }`}
      >
        {children}
      </section>
    </div>
  );
}

function StatusPill({ children, tone = "slate" }) {
  const styles =
    tone === "rose"
      ? "bg-rose-50 text-rose-700"
      : "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize ${styles}`}
    >
      {children}
    </span>
  );
}

function DeleteButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Delete entry"
      aria-label="Delete entry"
      className="inline-flex rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Banknote className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{message}</p>
      <p className="mt-1 text-xs text-slate-400">
        Your records will appear here.
      </p>
    </div>
  );
}