import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import ScheduleDay from "@/models/ScheduleDay";
import { requireAdmin } from "@/lib/guards";
import { cleanDay } from "@/lib/schedule-input";

export async function PATCH(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const { data, error } = cleanDay(await req.json().catch(() => ({})));
  if (error) return NextResponse.json({ error }, { status: 400 });
  await connectDB();
  try {
    const doc = await ScheduleDay.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    if (e.code === 11000) return NextResponse.json({ error: `Day ${data.day} already exists` }, { status: 409 });
    throw e;
  }
}

export async function DELETE(_req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  await ScheduleDay.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}