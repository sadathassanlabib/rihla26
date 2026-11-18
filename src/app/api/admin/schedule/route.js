import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ScheduleDay from "@/models/ScheduleDay";
import { requireAdmin } from "@/lib/guards"; // use YOUR existing admin check
import { cleanDay } from "@/lib/schedule-input";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  await connectDB();
  return NextResponse.json(await ScheduleDay.find().sort({ day: 1 }).lean());
}

export async function POST(req) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { data, error } = cleanDay(await req.json().catch(() => ({})));
  if (error) return NextResponse.json({ error }, { status: 400 });
  await connectDB();
  try {
    return NextResponse.json(await ScheduleDay.create(data), { status: 201 });
  } catch (e) {
    if (e.code === 11000) return NextResponse.json({ error: `Day ${data.day} already exists` }, { status: 409 });
    throw e;
  }
}