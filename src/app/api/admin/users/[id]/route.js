import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import AuditLog from "@/models/AuditLog";

export async function GET(_req, { params }) {
  try {
    await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }

  const { id } = await params;   // ← await করুন

  await connectDB();
  const user = await User.findById(id).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  delete user.passwordHash;

  const payments = await Payment.find({ user: user._id })
    .sort({ date: 1 })
    .lean();

  return NextResponse.json({ user, payments });
}

export async function PATCH(req, { params }) {
  let sessionUser;
  try {
    sessionUser = await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }

  const { id } = await params;   // ← await করুন

  const { action, note } = await req.json();
  await connectDB();

  const user = await User.findById(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const before = user.role;

  if (action === "approve") {
    user.role = "registered";
    user.approvedAt = new Date();
    user.adminNote = note || "";
  } else if (action === "decline") {
    user.role = "declined";
    user.declinedAt = new Date();
    user.adminNote = note || "";
  } else {
    return NextResponse.json({ error: "Bad action" }, { status: 400 });
  }

  await user.save();

  await AuditLog.create({
    actor: sessionUser.id,
    action: "role-change",
    entity: "user",
    entityId: user._id,
    before: { role: before },
    after: { role: user.role, note: note || "" },
  });

  return NextResponse.json({ ok: true });
}