import mongoose from "mongoose";
const AuditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true }, // create/update/delete
    entity: { type: String, required: true }, // payment/expense/settings...
    entityId: { type: mongoose.Schema.Types.ObjectId },
    before: { type: mongoose.Schema.Types.Mixed },
    after: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);
export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);