import { Model, ObjectId } from "mongoose";

export interface IRoutine {
  user: ObjectId;
  day: string;
  time: string;
  title: string;
  description: string;
  duration: number;
}

export type IRoutineModel = Model<IRoutine, Record<string, unknown>>;
