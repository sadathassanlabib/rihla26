import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import { hashPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const PACKAGE_FEES = {
  roundtrip: 3500,
  oneway: 3000,
  destination: 2500,
};

const registerSchema = z.object({
  // Account
  fullName: z.string().min(3).max(80),
  email: z.string().email(),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid phone number"),
  password: z.string().min(6).max(72),

  // Personal
  dob: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.string().min(1),
  tshirtSize: z.string().min(1),
  address: z.string().min(2).max(300),

  // Emergency
  emergencyName: z.string().min(2).max(80),
  emergencyRelation: z.enum([
    "father",
    "mother",
    "spouse",
    "sibling",
    "guardian",
    "relative",
    "friend",
    "other",
  ]),
  emergencyPhone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid emergency phone"),

  // Previous tour + reference
  previousTour: z.enum(["yes", "no"]),
  reference: z.string().min(2).max(200),

  // Package
  packageType: z.enum(["roundtrip", "oneway", "destination"]),

  // Payment
  paymentMode: z.enum(["full", "partial", "cash"]),
  paymentMethod: z.string().optional().default(""),
  transactionId: z.string().optional().default(""),
  amountPaid: z.coerce.number().min(0),
  cashReceiver: z.string().optional().default(""),
  slipId: z.string().optional().default(""),

  // Notes
  notes: z.string().max(500).optional().default(""),
});

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (!rateLimit(`reg:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { message: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 🔒 Server-side fee calculation — client-এর পাঠানো fee বিশ্বাস করি না
    const packageFee = PACKAGE_FEES[data.packageType];
    if (data.amountPaid > packageFee) {
      return NextResponse.json(
        { message: "Amount cannot exceed package fee." },
        { status: 400 }
      );
    }

    // Payment mode অনুযায়ী validation
    if (
      (data.paymentMode === "full" || data.paymentMode === "partial") &&
      (!data.paymentMethod || !data.transactionId.trim())
    ) {
      return NextResponse.json(
        { message: "Payment method and transaction ID required." },
        { status: 400 }
      );
    }
    if (
      data.paymentMode === "cash" &&
      (!data.cashReceiver.trim() || !data.slipId.trim())
    ) {
      return NextResponse.json(
        { message: "Cash receiver and slip ID required." },
        { status: 400 }
      );
    }
    if (
      (data.paymentMode === "partial" || data.paymentMode === "cash") &&
      data.amountPaid <= 0
    ) {
      return NextResponse.json(
        { message: "Amount paid must be greater than 0." },
        { status: 400 }
      );
    }

    await connectDB();

    const exists = await User.findOne({ email: data.email });
    if (exists) {
      return NextResponse.json(
        { message: "Email already registered." },
        { status: 409 }
      );
    }

    const user = await User.create({
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      passwordHash: await hashPassword(data.password),
      role: "pending",

      dob: data.dob,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      tshirtSize: data.tshirtSize,
      address: data.address,

      emergencyName: data.emergencyName,
      emergencyRelation: data.emergencyRelation,
      emergencyPhone: data.emergencyPhone,
      emergencyContact: data.emergencyPhone, // পুরনো ফিল্ডেও রাখি

      previousTour: data.previousTour,
      reference: data.reference,

      packageType: data.packageType,
      packageFee,

      notes: data.notes,
      applicationSubmittedAt: new Date(),
    });

    // Payment record (যদি amountPaid > 0)
    if (data.amountPaid > 0) {
      await Payment.create({
        user: user._id,
        amount: data.amountPaid,
        method:
          data.paymentMode === "cash" ? "cash" : data.paymentMethod || "cash",
        transactionId: data.transactionId || "",
        cashReceiver: data.cashReceiver || "",
        slipId: data.slipId || "",
        mode: data.paymentMode,
        recordedBy: user._id,
        note: "Initial payment (self)",
      });
    }

    return NextResponse.json({ ok: true, id: user._id });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}