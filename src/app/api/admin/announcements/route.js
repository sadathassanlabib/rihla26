import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Announcement from "@/models/Announcement";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";
import { sendEmail, announcementEmailHtml } from "@/lib/email";

export async function GET() {
  try {
    await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  await connectDB();
  const items = await Announcement.find({})
    .sort({ pinned: -1, createdAt: -1 })
    .lean();
  return NextResponse.json({ announcements: items });
}

export async function POST(req) {
  let s;
  try {
    s = await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }

  const body = await req.json();
  if (!body.title?.trim() || !body.body?.trim()) {
    return NextResponse.json(
      { error: "Title and body required" },
      { status: 400 }
    );
  }

  await connectDB();

  const shouldPublish = body.published !== false;

  const item = await Announcement.create({
    title: body.title,
    body: body.body,
    pinned: !!body.pinned,
    published: shouldPublish,
    createdBy: s.id,
  });

  await AuditLog.create({
    actor: s.id,
    action: "create",
    entity: "announcement",
    entityId: item._id,
    after: { title: item.title },
  });

  // Publish হলে সব registered user-কে email
  let sentCount = 0;
  if (shouldPublish) {
    const users = await User.find({ role: "registered" })
      .select("name email")
      .lean();

    const results = await Promise.allSettled(
      users.map((u) =>
        sendEmail({
          to: u.email,
          subject: `Rihla'26 — ${body.title}`,
          html: announcementEmailHtml({
            title: body.title,
            body: body.body,
            userName: u.name,
          }),
        })
      )
    );

    sentCount = results.filter(
      (r) => r.status === "fulfilled" && r.value.ok
    ).length;

    await Announcement.findByIdAndUpdate(item._id, {
      emailSent: sentCount > 0,
      emailSentAt: new Date(),
      emailRecipients: sentCount,
    });
  }

  return NextResponse.json({
    ok: true,
    id: item._id,
    emailsSent: sentCount,
  });
}