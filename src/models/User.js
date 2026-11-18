import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["pending", "registered", "admin", "declined"],
      default: "pending",
      index: true,
    },

    // Personal
    dob: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    bloodGroup: { type: String, default: "" },
    tshirtSize: { type: String, default: "" },
    address: { type: String, default: "" },

    // Emergency
    emergencyName: { type: String, default: "" },
    emergencyRelation: {
      type: String,
      enum: [
        "father",
        "mother",
        "spouse",
        "sibling",
        "guardian",
        "relative",
        "friend",
        "other",
        "",
      ],
      default: "",
    },
    emergencyPhone: { type: String, default: "" },
    // পুরনো ফিল্ডের সাথে compatibility
    emergencyContact: { type: String, default: "" },
    foodNeeds: { type: String, default: "" },

    // Previous tour experience
    previousTour: {
      type: String,
      enum: ["yes", "no", ""],
      default: "",
    },

    // Reference / how they heard about us
    reference: { type: String, default: "" },

    // Package
    packageType: {
      type: String,
      enum: ["roundtrip", "oneway", "destination", ""],
      default: "",
    },
    packageFee: { type: Number, default: 0 },

    // Notes
    notes: { type: String, default: "" },

    // Application state
    applicationSubmittedAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null },
    declinedAt: { type: Date, default: null },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);