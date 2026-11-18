import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Donation from "@/models/Donation";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";
import { sendEmail, transactionRecordedEmailHtml } from "@/lib/email";

export async function GET() {
  try {
    await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  await connectDB();
  const donations = await Donation.find({}).sort({ date: -1 }).lean();
  return NextResponse.json({ donations });
}

export async function POST(req) {
  let s;
  try {
    s = await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }

  const { donorName, amount, date, note } = await req.json();
  if (!donorName || !(amount > 0)) {
    return NextResponse.json(
      { error: "donorName and amount required" },
      { status: 400 }
    );
  }

  await connectDB();

  const d = await Donation.create({
    donorName,
    amount,
    date: date ? new Date(date) : new Date(),
    note: note || "",
    recordedBy: s.id,
  });

  await AuditLog.create({
    actor: s.id,
    action: "create",
    entity: "donation",
    entityId: d._id,
    after: { donorName, amount },
  });

  try {
    const admins = await User.find({ role: "admin" }).select("email").lean();
    await Promise.allSettled(
      admins.map((a) =>
        sendEmail({
          to: a.email,
          subject: `Rihla'26 — Donation recorded (৳${amount})`,
          html: transactionRecordedEmailHtml({
            kind: "donation",
            title: donorName,
            amount,
            date: d.date,
            note: note || "",
          }),
        })
      )
    );
  } catch (err) {
    console.error("Donation email failed:", err);
  }

  return NextResponse.json({ ok: true, id: d._id });
}