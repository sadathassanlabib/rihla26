import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Donation from "@/models/Donation";
import Expense from "@/models/Expense";
import User from "@/models/User";
import Settings from "@/models/Settings";

export async function GET() {
  try { await requireRole("admin"); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status }); }
  await connectDB();
  const [pAgg] = await Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
  const [dAgg] = await Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
  const [eAgg] = await Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
  const registered = await User.countDocuments({ role: "registered" });
  const pending = await User.countDocuments({ role: "pending" });
  const fee = (await Settings.findOne({ key: "site" }).lean())?.fee || 0;
  const collected = pAgg?.total || 0;
  const donations = dAgg?.total || 0;
  const spent = eAgg?.total || 0;
  const expected = registered * fee;
  const due = Math.max(0, expected - collected);
  return NextResponse.json({
    collected, donations, spent, balance: collected + donations - spent,
    due, registered, pending, fee,
  });
}