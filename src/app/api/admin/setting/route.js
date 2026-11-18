import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import AuditLog from "@/models/AuditLog";

export async function GET() {
  await connectDB();
  return NextResponse.json(await Settings.findOne({ key: "site" }).lean());
}
export async function PATCH(req) {
  let s; try { s = await requireRole("admin"); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status }); }
  const body = await req.json();
  await connectDB();
  const before = await Settings.findOne({ key: "site" }).lean();
  const updated = await Settings.findOneAndUpdate(
    { key: "site" }, { $set: body }, { new: true, upsert: true }
  ).lean();
  await AuditLog.create({
    actor: s.id, action: "update", entity: "settings", entityId: updated._id,
    before, after: body,
  });
  return NextResponse.json(updated);
}