import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    startTime: { type: String, trim: true }, // "08:30"
    endTime: { type: String, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000 },
    location: { type: String, trim: true, maxlength: 120 },
    note: { type: String, trim: true, maxlength: 300 },
  },
  { _id: true }
);

const ScheduleDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1, max: 10, unique: true },
    date: Date,
    title: { type: String, required: true, trim: true, maxlength: 120 },
    summary: { type: String, trim: true, maxlength: 400 },
    activities: { type: [ActivitySchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.ScheduleDay || mongoose.model("ScheduleDay", ScheduleDaySchema);