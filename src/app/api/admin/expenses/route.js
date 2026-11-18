import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Expense from "@/models/Expense";
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
  const expenses = await Expense.find({}).sort({ date: -1 }).lean();
  return NextResponse.json({ expenses });
}

export async function POST(req) {
  let s;
  try {
    s = await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }

  const { title, category, amount, date, vendor, note, receiptUrl } =
    await req.json();

  if (!title || !category || !(amount > 0)) {
    return NextResponse.json(
      { error: "title, category, amount required" },
      { status: 400 }
    );
  }

  await connectDB();

  const e = await Expense.create({
    title,
    category,
    amount,
    vendor: vendor || "",
    note: note || "",
    receiptUrl: receiptUrl || "",
    date: date ? new Date(date) : new Date(),
    recordedBy: s.id,
  });

  await AuditLog.create({
    actor: s.id,
    action: "create",
    entity: "expense",
    entityId: e._id,
    after: { title, amount },
  });

  // Admin-দের email (fire-and-forget)
  try {
    const admins = await User.find({ role: "admin" }).select("email").lean();
    await Promise.allSettled(
      admins.map((a) =>
        sendEmail({
          to: a.email,
          subject: `Rihla'26 — Expense recorded (৳${amount})`,
          html: transactionRecordedEmailHtml({
            kind: "expense",
            title,
            amount,
            date: e.date,
            note: note || "",
          }),
        })
      )
    );
  } catch (err) {
    console.error("Expense email failed:", err);
  }

  return NextResponse.json({ ok: true, id: e._id });
}