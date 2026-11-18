import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Announcement from "@/models/Announcement";
import AuditLog from "@/models/AuditLog";

export async function PATCH(req, { params }) {
  let s;
  try {
    s = await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }

  const { id } = await params;
  const body = await req.json();
  await connectDB();

  const before = await Announcement.findById(id).lean();
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await Announcement.findByIdAndUpdate(id, body, { new: true }).lean();

  await AuditLog.create({
    actor: s.id,
    action: "update",
    entity: "announcement",
    entityId: id,
    before,
    after: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  let s;
  try {
    s = await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }

  const { id } = await params;
  await connectDB();
  const before = await Announcement.findById(id).lean();
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await Announcement.findByIdAndDelete(id);
  await AuditLog.create({
    actor: s.id,
    action: "delete",
    entity: "announcement",
    entityId: id,
    before,
  });

  return NextResponse.json({ ok: true });
}