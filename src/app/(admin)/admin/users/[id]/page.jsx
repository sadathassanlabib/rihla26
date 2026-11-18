"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  User as UserIcon,
  Heart,
  Package,
  Wallet,
  CreditCard,
  Printer,
  Droplet,
  Shirt,
  MapPin,
  CalendarDays,
  IdCard,
} from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  registered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  admin: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function UserDetail({ params }) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!data) return <p className="p-6">Loading…</p>;

  const u = data.user;
  const totalPaid = data.payments.reduce((s, p) => s + p.amount, 0);
  const fee = u.packageFee || 0;
  const due = Math.max(0, fee - totalPaid);
  const advance = Math.max(0, totalPaid - fee);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </Link>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            STATUS_STYLES[u.role] || "bg-gray-100 text-gray-700"
          }`}
        >
          {u.role.toUpperCase()}
        </span>
      </div>

      {/* Hero card */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {u.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">{u.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-emerald-50">
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {u.email}
              </span>
              <a
                href={`tel:${u.phone}`}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" /> {u.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Money summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Package Fee</div>
          <div className="text-xl font-bold text-gray-900">৳ {fee}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Paid</div>
          <div className="text-xl font-bold text-emerald-600">
            ৳ {totalPaid}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">
            {due > 0 ? "Due" : "Advance"}
          </div>
          <div
            className={`text-xl font-bold ${
              due > 0 ? "text-red-600" : "text-emerald-600"
            }`}
          >
            ৳ {due > 0 ? due : advance}
          </div>
        </div>
      </div>

      {/* Personal info */}
      <Section title="Personal Information" icon={<UserIcon className="w-4 h-4" />}>
        <InfoRow icon={<IdCard className="w-4 h-4" />} label="NID / Student ID" value={u.nid} />
        <InfoRow icon={<CalendarDays className="w-4 h-4" />} label="Date of Birth" value={u.dob} />
        <InfoRow icon={<UserIcon className="w-4 h-4" />} label="Gender" value={u.gender} />
        <InfoRow icon={<Droplet className="w-4 h-4" />} label="Blood Group" value={u.bloodGroup} />
        <InfoRow icon={<Shirt className="w-4 h-4" />} label="T-Shirt Size" value={u.tshirtSize} />
        <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={u.address} />
      </Section>

      {/* Emergency */}
      <Section title="Emergency Contact" icon={<Heart className="w-4 h-4" />}>
        <InfoRow icon={<UserIcon className="w-4 h-4" />} label="Name" value={u.emergencyName} />
        <InfoRow
          icon={<Phone className="w-4 h-4" />}
          label="Phone"
          value={u.emergencyPhone}
          href={u.emergencyPhone ? `tel:${u.emergencyPhone}` : undefined}
        />
      </Section>

      {/* Package */}
      <Section title="Package" icon={<Package className="w-4 h-4" />}>
        <InfoRow
          label="Type"
          value={
            u.packageType === "roundtrip"
              ? "Dhaka Round Trip"
              : u.packageType === "oneway"
              ? "Dhaka One-Way"
              : u.packageType === "destination"
              ? "Join at Destination"
              : "—"
          }
        />
        <InfoRow label="Fee" value={`৳ ${fee}`} />
        {u.notes && <InfoRow label="Notes" value={u.notes} />}
      </Section>

      {/* Payment history */}
      <Section
        title={`Payment History (${data.payments.length})`}
        icon={<Wallet className="w-4 h-4" />}
      >
        {data.payments.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            No payments yet.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b">
                  <th className="py-2 px-5">Date</th>
                  <th className="py-2 px-2 text-right">Amount</th>
                  <th className="py-2 px-2 text-center">Method</th>
                  <th className="py-2 px-5 text-right">TxID / Slip</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2 px-5">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-2 text-right font-semibold">
                      ৳ {p.amount}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs">
                        <CreditCard className="w-3 h-3" />
                        {p.method}
                      </span>
                    </td>
                    <td className="py-2 px-5 text-right text-gray-600 font-mono text-xs">
                      {p.transactionId || p.slipId || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        <a
          href={`/admin/users/${u._id}/print`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition"
        >
          <Printer className="w-4 h-4" /> Print Sheet
        </a>
      </div>
    </div>
  );
}

// ─── Helper components ───
function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
        <span className="text-emerald-600">{icon}</span>
        <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
      </div>
      <div className="px-5 py-3 space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value, href }) {
  return (
    <div className="flex items-start gap-3 text-sm py-1">
      {icon && <span className="text-gray-400 mt-0.5">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        {href ? (
          <a href={href} className="font-medium text-emerald-700 hover:underline truncate block">
            {value || "—"}
          </a>
        ) : (
          <div className="font-medium text-gray-900 truncate">
            {value || "—"}
          </div>
        )}
      </div>
    </div>
  );
}