import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Announcement from "@/models/Announcement";

export async function GET() {
  const s = await getServerSession(authOptions);
  const role = s?.user?.role;

  if (role !== "registered" && role !== "admin") {
    return NextResponse.json(
      { error: "Announcements are only available to registered participants" },
      { status: 403 }
    );
  }

  await connectDB();
  const items = await Announcement.find({ published: true })
    .sort({ pinned: -1, createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ announcements: items });
}