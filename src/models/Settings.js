import mongoose from "mongoose";
const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true },
    tourDate: { type: String, default: "2026-12-24" },
    returnDate: { type: String, default: "2026-12-28" },
    fee: { type: Number, default: 0 },
    participantLimit: { type: Number, default: 0 },
    contactNumber: { type: String, default: "" },
    homeTitle: { type: String, default: "" },
    homeBody: { type: String, default: "" },
    homeImage: { type: String, default: "" },
    aboutTitle: { type: String, default: "" },
    aboutBody: { type: String, default: "" },
    aboutImage: { type: String, default: "" },
  },
  { timestamps: true }
);
export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);