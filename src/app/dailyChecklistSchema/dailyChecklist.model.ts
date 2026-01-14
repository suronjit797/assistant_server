import { Schema, model } from "mongoose";
import type { IDailyChecklist } from "./dailyChecklist.interface";

const DailyChecklistSchema: Schema = new Schema<IDailyChecklist>(
  {
    user: Schema.ObjectId,
    template: Schema.ObjectId,
    date: { type: Date, index: true, default: Date.now() },
    tasks: [
      {
        name: { type: String, required: true },
        description: { type: String },
        order: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
        completedAt: { type: Date },
      },
    ],
  },
  { timestamps: true },
);

const DailyChecklistModel = model<IDailyChecklist>("DailyChecklist", DailyChecklistSchema);

export default DailyChecklistModel;
