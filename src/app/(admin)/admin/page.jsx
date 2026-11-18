
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Phone,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
  AlertCircle,
  Eye,
} from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  registered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  declined: "bg-red-50 text-red-700 border-red-200",
  admin: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_LABEL = {
  pending: "Pending",
  registered: "Registered",
  declined: "Declined",
  admin: "Admin",
};

const STATUS_ICONS = {
  pending: Clock,
  registered: CheckCircle2,
  declined: XCircle,
  admin: UserCheck,
};

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState({
    users: [],
    total: 0,
    limit: 20,
  });

  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch users
  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        q: q.trim(),
        status,
        page: String(page),
      });

      try {
        const res = await fetch(
          `/api/admin/users?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result = await res.json();

        if (!res.ok) {
          throw new Error(
            result.message || result.error || "Failed to load users."
          );
        }

        setData({
          users: Array.isArray(result.users) ? result.users : [],
          total: Number(result.total) || 0,
          limit: Number(result.limit) || 20,
        });
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(err.message || "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => controller.abort();
  }, [q, status, page, refreshKey]);

  // Refresh data
  function refreshUsers() {
    setRefreshKey((prev) => prev + 1);
  }

  // Handle approve / decline
  async function act(id, action) {
    let note = "";

    if (action === "decline") {
      const reason = prompt("Enter decline reason (optional):");

      // Cancel means stop the action
      if (reason === null) return;

      note = reason.trim();
    }

    const confirmed = confirm(
      `Are you sure you want to ${action} this user?`
    );

    if (!confirmed) return;

    setActionBusy(id);
    setError("");

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          note,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || result.error || `Failed to ${action} user.`
        );
      }

      alert(
        result.message ||
          `User successfully ${action === "approve" ? "approved" : "declined"}.`
      );

      refreshUsers();
    } catch (err) {
      setError(err.message || "Action failed.");
    } finally {
      setActionBusy(null);
    }
  }

  // Pagination
  const pages = Math.max(
    1,
    Math.ceil(data.total / data.limit)
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Users Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage tour participants and their applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshUsers}
            disabled={loading}
            className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition"
            title="Refresh users"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-600 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">
            <Users className="w-4 h-4" />
            {data.total} Total Users
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

          <div className="flex-1">
            <p className="text-sm font-medium">{error}</p>
          </div>

          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            className="input pl-9 w-full"
            placeholder="Search name, email, or phone..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Status Filter */}
        <select
          className="input w-full sm:max-w-[190px]"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="registered">Registered</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-7 h-7 animate-spin mb-3 text-emerald-600" />
            <p className="text-sm">Loading users...</p>
          </div>
        ) : data.users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />

            <h3 className="font-semibold text-gray-700">
              No users found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-4 px-4">Participant</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.users.map((u) => {
                  const userStatus = u.role || "pending";
                  const StatusIcon =
                    STATUS_ICONS[userStatus] || Clock;

                  return (
                    <tr
                      key={u._id}
                      className="border-b border-gray-50 last:border-0 hover:bg-emerald-50/40 transition-colors group"
                    >
                      {/* Participant */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/admin/users/${u._id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            {u.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                              {u.name || "Unknown User"}
                            </p>

                            <p className="text-xs text-gray-500 truncate">
                              {u.email || "No email"}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        {u.phone ? (
                          <a
                            href={`tel:${u.phone}`}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {u.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            Not provided
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            STATUS_STYLES[userStatus] ||
                            "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />

                          {STATUS_LABEL[userStatus] || userStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">

                          {userStatus === "pending" ? (
                            <>
                              <button
                                disabled={!!actionBusy}
                                onClick={() => act(u._id, "approve")}
                                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                              >
                                {actionBusy === u._id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <UserCheck className="w-3.5 h-3.5" />
                                )}

                                Approve
                              </button>

                              <button
                                disabled={!!actionBusy}
                                onClick={() => act(u._id, "decline")}
                                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                Decline
                              </button>
                            </>
                          ) : (
                            <Link
                              href={`/admin/users/${u._id}`}
                              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-emerald-700 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && data.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {(page - 1) * data.limit + 1}
            </span>
            {" - "}
            <span className="font-semibold text-gray-700">
              {Math.min(page * data.limit, data.total)}
            </span>
            {" of "}
            <span className="font-semibold text-gray-700">
              {data.total}
            </span>
            {" users"}
          </p>

          <div className="flex items-center gap-2">

            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="text-sm text-gray-600 px-2">
              {page} / {pages}
            </span>

            <button
              disabled={page >= pages}
              onClick={() => setPage((prev) => prev + 1)}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
