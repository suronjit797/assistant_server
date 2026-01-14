import { Document, ObjectId } from "mongoose";

export interface IDailyTask {
  name: string;
  description: string;
  order: number;
}

export interface IDailyPlanTemplate extends Document {
  user: ObjectId;
  title: string;
  description: string;
  tasks: IDailyTask[];
  isActive: boolean;
}
