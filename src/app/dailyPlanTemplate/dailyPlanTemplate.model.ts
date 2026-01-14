import { Schema, model } from "mongoose";
import type { IDailyPlanTemplate } from "./dailyPlanTemplate.interface";

const DailyPlanTemplateSchema: Schema = new Schema<IDailyPlanTemplate>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    tasks: [
      {
        name: { type: String, required: true },
        description: { type: String },
        order: { type: Number, default: 0 },
        estimatedMinutes: { type: Number }, // optional
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const DailyPlanTemplateModel = model<IDailyPlanTemplate>("DailyPlanTemplate", DailyPlanTemplateSchema);

export default DailyPlanTemplateModel;
