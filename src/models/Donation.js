import mongoose from "mongoose";
const DonationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    note: { type: String, default: "" },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);