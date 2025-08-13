import mongoose, { Schema, Types } from "mongoose";
import { IEvent } from "./events.interface";

const EventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 5000 },
    location: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    allDay: { type: Boolean, default: false },
    organizer: {
      name: { type: String, trim: true },
      email: { type: String, lowercase: true, trim: true },
      phone: { type: String, trim: true },
    },
    attendees: Number,
    category: { type: String, trim: true },
    tags: { type: [String], default: [], index: true },
    isPublic: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    onlineLink: String,
    user: { type: Types.ObjectId, ref: "user" },
  },
  { timestamps: true },
);

// Index for searching events
EventSchema.index({ title: "text", description: "text" });
EventSchema.index({ startDate: 1, endDate: 1 });

// Validation: endDate must be after startDate
EventSchema.pre("save", function (next) {
  if (this.endDate && this.endDate < this.startDate) {
    return next(new Error("End date must be after start date"));
  }
  next();
});

const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
