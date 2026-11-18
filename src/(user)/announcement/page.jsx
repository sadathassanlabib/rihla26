import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Announcement from "@/models/Announcement";
import { Megaphone, Pin, Mail } from "lucide-react";

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!role) redirect("/login");
  if (role !== "registered" && role !== "admin") redirect("/status");

  await connectDB();
  const items = await Announcement.find({ published: true })
    .sort({ pinned: -1, createdAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-slate-950">
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-300 rounded-full text-sm font-medium mb-4 border border-emerald-500/20">
          <Megaphone className="w-4 h-4" />
          Announcements
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Latest Updates
        </h1>
        <p className="mt-2 text-slate-400">
          Important information for registered participants
        </p>

        <div className="space-y-3 mt-8">
          {items.length === 0 && (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
              <Megaphone className="w-10 h-10 mx-auto text-slate-700 mb-2" />
              <p className="text-sm text-slate-400">No announcements yet.</p>
            </div>
          )}
          {items.map((a) => (
            <div
              key={a._id}
              className={`bg-slate-900 border rounded-xl p-5 ${
                a.pinned
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-slate-800"
              }`}
            >
              <div className="flex items-start gap-2 flex-wrap">
                {a.pinned && <Pin className="w-4 h-4 text-emerald-400 mt-0.5" />}
                <h2 className="font-semibold text-white text-lg">{a.title}</h2>
              </div>
              <p className="text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
                {a.body}
              </p>
              <p className="text-xs text-slate-500 mt-3">
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}