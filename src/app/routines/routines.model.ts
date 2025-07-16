import { Schema, model } from "mongoose";
import { IRoutine, IRoutineModel } from "./routines.interface";
import { dayConstants } from "../../shared/constant";

const routineSchema = new Schema<IRoutine>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    day: {
      type: String,
      enum: dayConstants,
      required: true,
    },
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, default: 60 },
  },
  { timestamps: true },
);

export const RoutineModel = model<IRoutine, IRoutineModel>("Routine", routineSchema);
