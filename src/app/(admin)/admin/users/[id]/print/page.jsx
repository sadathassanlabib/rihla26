"use client";
import { useEffect, useState, use } from "react";

export default function PrintUser({ params }) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  useEffect(() => { fetch(`/api/admin/users/${id}`).then(r=>r.json()).then(setData); }, [id]);
  if (!data) return <p className="p-6">Loading…</p>;
  const u = data.user;
  const paid = data.payments.reduce((s,p)=>s+p.amount,0);
  return (
    <div className="p-8 max-w-2xl mx-auto bg-white text-black">
      <style>{`@media print{button{display:none!important}}`}</style>
      <h1 className="text-2xl font-bold mb-4">Rihla'26 – SOROB</h1>
      <h2 className="text-lg mb-2">Participant Sheet: {u.name}</h2>
      <p>Email: {u.email}</p><p>Phone: {u.phone}</p>
      <p>Address: {u.address}</p><p>Emergency: {u.emergencyContact}</p>
      <p>Food needs: {u.foodNeeds || "—"}</p>
      <p>Status: {u.role}</p>
      <h3 className="font-bold mt-4">Payments (total ৳{paid})</h3>
      <ul>{data.payments.map(p => (
        <li key={p._id}>{new Date(p.date).toLocaleDateString()} — ৳{p.amount} — {p.method} — {p.transactionId}</li>
      ))}</ul>
      <button className="btn-primary mt-4" onClick={()=>window.print()}>Print / Save as PDF</button>
    </div>
  );
}