import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    method: { type: String, required: true }, // bkash, nagad, rocket, cash, correction
    transactionId: { type: String, default: "" },

    // Cash-specific
    cashReceiver: { type: String, default: "" },
    slipId: { type: String, default: "" },

    // Payment mode: full / partial / cash
    mode: {
      type: String,
      enum: ["full", "partial", "cash", "correction", ""],
      default: "",
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: { type: String, default: "" },
    isCorrection: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);