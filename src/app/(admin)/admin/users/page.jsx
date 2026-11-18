"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search, Users, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight,
  Phone, UserCheck, UserX, Loader2, Shield, AlertCircle, X,
} from "lucide-react";

const STATUS = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  registered: { label: "Registered", cls: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2 },
  declined: { label: "Declined", cls: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  admin: { label: "Admin", cls: "bg-sky-100 text-sky-800 border-sky-200", icon: Shield },
};

const FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "registered", label: "Registered" },
  { value: "declined", label: "Declined" },
];

// 01711000111 -> +8801711000111 so the phone dialer accepts it
function telHref(p) {
  const d = String(p || "").replace(/[^\d+]/g, "");
  if (!d) return null;
  if (d.startsWith("+")) return `tel:${d}`;
  if (d.startsWith("880")) return `tel:+${d}`;
  if (d.startsWith("0")) return `tel:+88${d}`;
  return `tel:${d}`;
}

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ users: [], total: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmAct, setConfirmAct] = useState(null); // { user, action }
  const [note, setNote] = useState("");
  const [actError, setActError] = useState("");
  const abortRef = useRef(null);

  // search only after the admin stops typing
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(q.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    abortRef.current?.abort(); // drop any older request still in flight
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ q: debouncedQ, status, page: String(page) });
      const res = await fetch(`/api/admin/users?${params}`, { signal: ctrl.signal });
      if (!res.ok) throw new Error(res.status === 403 ? "You don't have access to this page" : "Could not load users");
      const json = await res.json();
      setData({
        users: Array.isArray(json.users) ? json.users : [],
        total: Number(json.total) || 0,
        limit: Number(json.limit) || 20,
      });
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message || "Could not load users");
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [debouncedQ, status, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => () => abortRef.current?.abort(), []);

  function openConfirm(user, action) {
    setNote("");
    setActError("");
    setConfirmAct({ user, action });
  }

  async function runAction() {
    const { user, action } = confirmAct;
    setBusy(true);
    setActError("");
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: action === "decline" ? note.trim() : "" }),
      });
      if (!res.ok) {
        setActError((await res.json().catch(() => ({}))).error || "Action failed. Please try again.");
        return;
      }
      setConfirmAct(null);
      await load();
    } catch {
      setActError("Network problem. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const pages = Math.max(1, Math.ceil(data.total / data.limit));
  const hasFilters = q || status;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-sky-950">Users</h1>
          <p className="text-sm text-slate-600">Review applications and manage tour participants.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-sky-100 bg-white px-4 py-2 text-sm font-bold text-sky-800">
          <Users className="h-4 w-4 text-cyan-600" aria-hidden="true" />
          {data.total} {status ? STATUS[status].label.toLowerCase() : "total"}
        </div>
      </div>

      {/* Search + filter pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search users"
            placeholder="Search name, email or phone…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-2xl border-2 border-sky-100 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-cyan-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.value || "all"}
              onClick={() => { setStatus(f.value); setPage(1); }}
              aria-pressed={status === f.value}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition ${
                status === f.value
                  ? "bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30"
                  : "border-2 border-sky-100 bg-white text-sky-800 hover:border-cyan-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div aria-live="polite">
        {loading ? (
          <div className="space-y-3" aria-busy="true">
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-3xl bg-sky-200/60" />)}
          </div>
        ) : error ? (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-3xl border-2 border-red-200 bg-red-50 p-5 text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> {error}
            <button onClick={load} className="ml-auto rounded-xl bg-red-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-700">Retry</button>
          </div>
        ) : data.users.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-sky-200 bg-white py-14 text-center">
            <Users className="mx-auto mb-2 h-10 w-10 text-sky-300" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-600">No users found.</p>
            {hasFilters && (
              <button onClick={() => { setQ(""); setStatus(""); }} className="mt-2 text-sm font-bold text-sky-700 underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {data.users.map((u) => {
              const s = STATUS[u.role];
              const SIcon = s?.icon;
              const tel = telHref(u.phone);
              return (
                <li key={u._id} className="group flex flex-wrap items-center gap-3 rounded-3xl border-2 border-sky-100 bg-white p-4 shadow-[0_5px_0_0_rgba(14,116,144,0.07)] transition hover:-translate-y-0.5 hover:border-cyan-300 motion-reduce:transition-none">
                  <Link href={`/admin/users/${u._id}`} className="flex min-w-0 flex-1 basis-56 items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600 text-lg font-black text-white transition-transform group-hover:-rotate-6">
                      {u.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-sky-950">{u.name || "Unnamed"}</span>
                      <span className="block truncate text-xs text-slate-500">{u.email}</span>
                    </span>
                  </Link>

                  {tel ? (
                    <a href={tel} className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800 transition hover:bg-cyan-100">
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {u.phone}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">No phone</span>
                  )}

                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${s?.cls || "border-gray-200 bg-gray-100 text-gray-700"}`}>
                    {SIcon && <SIcon className="h-3 w-3" aria-hidden="true" />}
                    {s?.label || u.role}
                  </span>

                  <div className="ml-auto flex gap-2">
                    {u.role === "pending" ? (
                      <>
                        <button
                          disabled={busy}
                          onClick={() => openConfirm(u, "approve")}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <UserCheck className="h-3.5 w-3.5" aria-hidden="true" /> Approve
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => openConfirm(u, "decline")}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                          <UserX className="h-3.5 w-3.5" aria-hidden="true" /> Decline
                        </button>
                      </>
                    ) : (
                      <Link href={`/admin/users/${u._id}`} className="inline-flex items-center gap-1 rounded-xl border-2 border-sky-100 px-3 py-2 text-xs font-bold text-sky-800 transition hover:border-cyan-300">
                        View <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="inline-flex items-center gap-1 rounded-xl border-2 border-sky-100 bg-white px-3 py-2 text-sm font-bold text-sky-800 hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Prev
            </button>
            <button
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
              className="inline-flex items-center gap-1 rounded-xl border-2 border-sky-100 bg-white px-3 py-2 text-sm font-bold text-sky-800 hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Confirm dialog (replaces confirm() and prompt()) */}
      {confirmAct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && !busy && setConfirmAct(null)}
          onKeyDown={(e) => e.key === "Escape" && !busy && setConfirmAct(null)}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="confirm-h" className="w-full max-w-sm rounded-3xl bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 id="confirm-h" className="text-lg font-black text-sky-950">
                {confirmAct.action === "approve" ? "Approve" : "Decline"} {confirmAct.user.name}?
              </h2>
              <button onClick={() => setConfirmAct(null)} disabled={busy} aria-label="Close" className="rounded-lg p-1 hover:bg-gray-100">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {confirmAct.action === "approve"
                ? "They will become a registered participant and get access to their dashboard."
                : "They will not get participant access."}
            </p>
            {confirmAct.action === "decline" && (
              <label className="mt-3 block text-sm font-semibold text-slate-700">
                Reason (optional)
                <textarea
                  rows={3}
                  maxLength={300}
                  autoFocus
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-sky-100 p-3 text-sm outline-none focus:border-cyan-400"
                />
              </label>
            )}
            {actError && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{actError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmAct(null)} disabled={busy} className="rounded-xl border-2 border-sky-100 px-4 py-2 text-sm font-bold text-sky-800 hover:bg-sky-50">
                Cancel
              </button>
              <button
                onClick={runAction}
                disabled={busy}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60 ${
                  confirmAct.action === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {confirmAct.action === "approve" ? "Approve" : "Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}