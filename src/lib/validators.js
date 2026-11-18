import { z } from "zod";

export const registerSchema = z.object({
  // ─── Account ───
  fullName: z.string().min(3, "Name must be at least 3 characters").max(80),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid BD mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),

  // ─── Personal ───
  dob: z.string().min(1, "Date of birth required"),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  tshirtSize: z.enum(["S", "M", "L", "XL", "XXL"]),
  address: z.string().min(2).max(300),

  // ─── Emergency ───
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
  emergencyPhone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid emergency number"),

  // ─── Previous tour & reference ───
  previousTour: z.enum(["yes", "no"]),
  reference: z.string().min(2, "Please tell us how you heard about us").max(200),

  // ─── Package ───
  packageType: z.enum(["roundtrip", "oneway", "destination"]),
  packageFee: z.coerce.number().min(0),

  // ─── Payment ───
  paymentMode: z.enum(["full", "partial", "cash"]),
  paymentMethod: z.enum(["bkash", "nagad", "rocket", ""]).optional().default(""),
  transactionId: z.string().max(60).optional().default(""),
  amountPaid: z.coerce.number().min(0),
  remaining: z.coerce.number().min(0).optional().default(0),
  paymentStatus: z.enum(["paid", "partial", "unpaid"]).optional(),
  cashReceiver: z.string().max(80).optional().default(""),
  slipId: z.string().max(60).optional().default(""),

  // ─── Misc ───
  notes: z.string().max(500).optional().default(""),
  agree: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

export const applicationSchema = registerSchema; // alias if other code imports it