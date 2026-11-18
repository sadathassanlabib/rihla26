"use client";
import { useEffect, useState } from "react";

export default function MyMoney() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch("/api/me").then(r=>r.json()).then(setData); }, []);
  if (!data) return <p>Loading…</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Money Records</h1>
      <div className="grid grid-cols-3 gap-2">
        <div className="card"><div className="text-xs">Fee</div><div className="font-bold">৳{data.fee}</div></div>
        <div className="card"><div className="text-xs">Paid</div><div className="font-bold">৳{data.totalPaid}</div></div>
        <div className="card"><div className="text-xs">{data.due>0?"Due":"Advance"}</div>
          <div className="font-bold">৳{data.due>0?data.due:data.advance}</div></div>
      </div>
      <div className="card">
        <h2 className="font-bold mb-2">Installments</h2>
        <ul className="text-sm">{data.payments.map(p => (
          <li key={p._id}>{new Date(p.date).toLocaleDateString()} — ৳{p.amount} — {p.method} — {p.transactionId}</li>
        ))}</ul>
      </div>
    </div>
  );
}