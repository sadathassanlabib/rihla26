import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";
import { sendEmail, paymentRecordedEmailHtml } from "@/lib/email";

export async function GET() {
  try {
    await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  await connectDB();
  const payments = await Payment.find({})
    .sort({ date: -1 })
    .populate("user", "name email")
    .lean();
  return NextResponse.json({ payments });
}

export async function POST(req) {
  let s;
  try {
    s = await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }

  const { userId, amount, method, transactionId, date, note } = await req.json();
  if (!userId || !(amount > 0) || !method) {
    return NextResponse.json(
      { error: "userId, amount, method required" },
      { status: 400 }
    );
  }

  await connectDB();
  const target = await User.findById(userId);
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const p = await Payment.create({
    user: userId,
    amount,
    method,
    transactionId: transactionId || "",
    date: date ? new Date(date) : new Date(),
    note: note || "",
    recordedBy: s.id,
  });

  await AuditLog.create({
    actor: s.id,
    action: "create",
    entity: "payment",
    entityId: p._id,
    after: { user: userId, amount, method },
  });

  // Email notification — user-কে payment confirm + current balance
  try {
    const allPayments = await Payment.find({ user: userId }).lean();
    const totalPaid = allPayments.reduce((x, y) => x + y.amount, 0);
    const fee = target.packageFee || 0;
    const due = Math.max(0, fee - totalPaid);

    const result = await sendEmail({
      to: target.email,
      subject: `Rihla'26 — Payment recorded (৳${amount})`,
      html: paymentRecordedEmailHtml({
        userName: target.name,
        amount,
        method,
        transactionId: transactionId || "",
        date: p.date,
        totalPaid,
        fee,
        due,
      }),
    });

    if (!result.ok) {
      console.warn("Payment email not sent:", result.error || "skipped");
    }
  } catch (e) {
    // Email fail হলেও payment সেভ থাকে
    console.error("Payment email failed:", e);
  }

  return NextResponse.json({ ok: true, id: p._id });
}