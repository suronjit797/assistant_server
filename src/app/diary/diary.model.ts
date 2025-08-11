import { model, Schema } from "mongoose";
import { IDiary } from "./diary.interface";

const DiarySchema = new Schema<IDiary>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
    mood: {
      type: String,
      enum: ["happy", "sad", "angry", "excited", "neutral", "anxious"],
    },
    tags: [{ type: String, trim: true }],
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
        type: String,
      },
    ],
    isPublic: { type: Boolean, default: false },
    shareableLink: { type: String, unique: true, sparse: true },
    versionHistory: [
      {
        content: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// Index for quick search
DiarySchema.index({ title: "text", tags: 1, date: 1 });

const DairyModel = model<IDiary>("Diary", DiarySchema);
export default DairyModel;
