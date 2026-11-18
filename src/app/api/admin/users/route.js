import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const status = url.searchParams.get("status") || "";
  const page = Math.max(1, +url.searchParams.get("page") || 1);
  const limit = 20;

  await connectDB();
  const filter = {};
  if (status) filter.role = status;
  if (q) filter.$or = [
    { name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }, { phone: new RegExp(q, "i") },
  ];
  const total = await User.countDocuments(filter);
  const users = await User.find(filter).sort({ createdAt: -1 })
    .skip((page - 1) * limit).limit(limit).lean();

  return NextResponse.json({ users, total, page, limit });
}