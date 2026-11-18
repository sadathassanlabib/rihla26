import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const u = await User.findById(session.user.id).lean();
  if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
  delete u.passwordHash;

  const payments = await Payment.find({ user: u._id }).sort({ date: 1 }).lean();
  const fee = u.packageFee || 0;
  const totalPaid = payments.reduce((x, p) => x + p.amount, 0);

  return NextResponse.json({
    user: u,
    payments,
    fee,
    totalPaid,
    due: Math.max(0, fee - totalPaid),
    advance: Math.max(0, totalPaid - fee),
  });
}