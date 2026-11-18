"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, ArrowUp, ArrowDown } from "lucide-react";

const BLANK_ACT = { startTime: "", endTime: "", title: "", description: "", location: "", note: "" };
const BLANK_DAY = { day: 1, date: "", title: "", summary: "", activities: [] };

export default function AdminSchedule() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/schedule");
      setDays(res.ok ? await res.json() : []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  function openNew() {
    setError("");
    const next = days.length ? Math.max(...days.map((d) => d.day)) + 1 : 1;
    setForm({ ...BLANK_DAY, day: Math.min(next, 10) });
  }
  function openEdit(d) {
    setError("");
    setForm({ ...d, date: d.date ? String(d.date).slice(0, 10) : "", activities: d.activities || [] });
  }

  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setAct = (i, k, v) =>
    setForm({ ...form, activities: form.activities.map((a, j) => (j === i ? { ...a, [k]: v } : a)) });
  const addAct = () => setForm({ ...form, activities: [...form.activities, { ...BLANK_ACT }] });
  const delAct = (i) => setForm({ ...form, activities: form.activities.filter((_, j) => j !== i) });
  const moveAct = (i, dir) => {
    const arr = [...form.activities];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setForm({ ...form, activities: arr });
  };

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const isEdit = !!form._id;
    try {
      const res = await fetch(isEdit ? `/api/admin/schedule/${form._id}` : "/api/admin/schedule", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, day: Number(form.day) }),
      });
      if (!res.ok) {
        setError((await res.json().catch(() => ({}))).error || "Could not save");
        return;
      }
      setForm(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this whole day and its activities?")) return;
    await fetch(`/api/admin/schedule/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500">Days and activities shown on the public Schedule page.</p>
        </div>
        <button onClick={openNew}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-700 text-white rounded-lg text-sm font-medium hover:bg-sky-800">
          <Plus className="w-4 h-4" /> Add day
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-500"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading…</div>
      ) : days.length === 0 ? (
        <p className="bg-white rounded-xl border border-gray-100 text-center py-16 text-sm text-gray-500">
          No days yet. The public page shows a tentative outline until you add one.
        </p>
      ) : (
        <div className="space-y-3">
          {days.map((d) => (
            <div key={d._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">Day {d.day} · {d.title}</p>
                <p className="text-sm text-gray-500">
                  {d.date ? new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " · " : ""}
                  {d.activities?.length || 0} activities
                </p>
              </div>
              <div className="inline-flex gap-1 shrink-0">
                <button onClick={() => openEdit(d)} title="Edit" className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(d._id)} title="Delete" className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setForm(null)}>
          <form onSubmit={save} className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{form._id ? `Edit Day ${form.day}` : "Add day"}</h2>
              <button type="button" onClick={() => setForm(null)} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">Day number *
                <input type="number" min="1" max="10" required className="input mt-1" value={form.day} onChange={setField("day")} />
              </label>
              <label className="text-sm">Date
                <input type="date" className="input mt-1" value={form.date} onChange={setField("date")} />
              </label>
            </div>
            <label className="text-sm block">Day title *
              <input required maxLength={120} className="input mt-1" value={form.title} onChange={setField("title")} />
            </label>
            <label className="text-sm block">Short summary
              <textarea rows={2} maxLength={400} className="input mt-1" value={form.summary} onChange={setField("summary")} />
            </label>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Activities</h3>
                <button type="button" onClick={addAct} className="text-sm text-sky-700 font-medium inline-flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add activity
                </button>
              </div>
              {form.activities.length === 0 && <p className="text-sm text-gray-500">No activities. The day will show only its title and summary.</p>}
              <div className="space-y-3">
                {form.activities.map((a, i) => (
                  <div key={a._id || i} className="rounded-xl border border-gray-200 p-3 space-y-2 bg-gray-50/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">Activity {i + 1}</span>
                      <div className="inline-flex gap-1">
                        <button type="button" onClick={() => moveAct(i, -1)} disabled={i === 0} title="Move up" className="p-1 rounded hover:bg-white disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                        <button type="button" onClick={() => moveAct(i, 1)} disabled={i === form.activities.length - 1} title="Move down" className="p-1 rounded hover:bg-white disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                        <button type="button" onClick={() => delAct(i)} title="Remove" className="p-1 rounded text-red-600 hover:bg-white"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="time" className="input" value={a.startTime || ""} onChange={(e) => setAct(i, "startTime", e.target.value)} aria-label="Start time" />
                      <input type="time" className="input" value={a.endTime || ""} onChange={(e) => setAct(i, "endTime", e.target.value)} aria-label="End time" />
                    </div>
                    <input required maxLength={120} placeholder="Activity title *" className="input" value={a.title} onChange={(e) => setAct(i, "title", e.target.value)} />
                    <textarea rows={2} maxLength={1000} placeholder="Description" className="input" value={a.description || ""} onChange={(e) => setAct(i, "description", e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <input maxLength={120} placeholder="Location" className="input" value={a.location || ""} onChange={(e) => setAct(i, "location", e.target.value)} />
                      <input maxLength={300} placeholder="Important note" className="input" value={a.note || ""} onChange={(e) => setAct(i, "note", e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setForm(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button disabled={saving} className="px-4 py-2 text-sm bg-sky-700 text-white rounded-lg font-medium hover:bg-sky-800 disabled:opacity-50">
                {saving ? "Saving…" : "Save day"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}