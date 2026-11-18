"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Pin,
  Trash2,
  Megaphone,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  Send,
} from "lucide-react";

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    title: "",
    body: "",
    pinned: false,
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      setItems(data.announcements || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, published: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.emailsSent !== undefined) {
        setErr(`✅ Published · ${data.emailsSent} emails sent`);
        setTimeout(() => setErr(""), 4000);
      }
      setForm({ title: "", body: "", pinned: false });
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function togglePin(item) {
    await fetch(`/api/admin/announcements/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !item.pinned }),
    });
    load();
  }

  async function togglePublish(item) {
    await fetch(`/api/admin/announcements/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    load();
  }

  async function remove(item) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/announcements/${item._id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Announcements</h1>
        <p className="text-sm text-slate-400">
          Publishing an announcement will email all registered participants
        </p>
      </div>

      {err && (
        <div className="flex items-start gap-2 bg-emerald-500/10 text-emerald-300 text-sm p-3 rounded-lg border border-emerald-500/20">
          <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{err}</span>
        </div>
      )}

      <form
        onSubmit={submit}
        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
      >
        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" /> New Announcement
        </h3>
        <input
          className="input"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="input"
          rows={3}
          placeholder="Message body"
          required
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="w-4 h-4 accent-emerald-600"
            />
            Pin to top
          </label>
          <div className="ml-auto inline-flex items-center gap-2 text-xs text-slate-400">
            <Send className="w-3.5 h-3.5" />
            All registered users will be emailed
          </div>
          <button disabled={busy} className="btn-primary">
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending…
              </>
            ) : (
              "Publish & Email"
            )}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-10 h-10 mx-auto text-slate-700 mb-2" />
            <p className="text-sm text-slate-400">No announcements yet.</p>
          </div>
        ) : (
          items.map((a) => (
            <div
              key={a._id}
              className={`bg-slate-900 border rounded-xl p-4 ${
                a.pinned
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.pinned && (
                      <Pin className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <h3 className="font-semibold text-white">{a.title}</h3>
                    {!a.published && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-300 rounded">
                        Draft
                      </span>
                    )}
                    {a.emailSent && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded">
                        <Mail className="w-3 h-3" />
                        {a.emailRecipients} emails sent
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 mt-2 whitespace-pre-line">
                    {a.body}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => togglePin(a)}
                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded"
                    title={a.pinned ? "Unpin" : "Pin"}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => togglePublish(a)}
                    className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 rounded"
                    title={a.published ? "Unpublish" : "Publish"}
                  >
                    {a.published ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => remove(a)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}