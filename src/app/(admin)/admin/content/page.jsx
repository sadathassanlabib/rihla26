"use client";
import { useEffect, useState } from "react";

export default function ContentPage() {
  const [settings, setSettings] = useState(null);
  const [days, setDays] = useState([]);

  async function load() {
    setSettings(await fetch("/api/admin/settings").then(r=>r.json()));
    const d = await fetch("/api/admin/schedule").then(r=>r.json());
    setDays(d.days);
  }
  useEffect(() => { load(); }, []);

  async function saveSettings() {
    await fetch("/api/admin/settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    alert("Saved");
  }

  async function addDay() {
    const day = days.length ? Math.max(...days.map(d=>d.day)) + 1 : 1;
    await fetch("/api/admin/schedule", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, activities: [] }),
    });
    load();
  }

  async function deleteDay(id) {
    if (!confirm("Delete day?")) return;
    await fetch("/api/admin/schedule", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  if (!settings) return <p>Loading…</p>;
  return (
    <div className="space-y-6">
      <section className="card space-y-2">
        <h2 className="font-bold">Home / About / Settings</h2>
        {["homeTitle","homeBody","homeImage","aboutTitle","aboutBody","aboutImage","tourDate","returnDate","contactNumber"].map(f => (
          <input key={f} className="input" placeholder={f}
            defaultValue={settings[f]||""}
            onChange={(e)=>setSettings({...settings,[f]:e.target.value})} />
        ))}
        {["fee","participantLimit"].map(f => (
          <input key={f} className="input" type="number" placeholder={f}
            defaultValue={settings[f]||0}
            onChange={(e)=>setSettings({...settings,[f]:+e.target.value})} />
        ))}
        <button className="btn-primary" onClick={saveSettings}>Save</button>
      </section>

      <section className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">Schedule</h2>
          <button className="btn-secondary py-1" onClick={addDay}>Add Day</button>
        </div>
        {days.map(day => (
          <div key={day._id} className="border rounded p-2 mb-2">
            <div className="flex gap-2 items-center">
              <b>Day {day.day}</b>
              <button className="btn-danger py-0 px-2 text-xs" onClick={()=>deleteDay(day._id)}>Delete</button>
            </div>
            <ul className="text-sm mt-1">
              {day.activities.map((a, i) => (
                <li key={i}>{a.time} — {a.title} @ {a.place}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}