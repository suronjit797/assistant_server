import { Document, ObjectId } from "mongoose";
import { IDailyTask } from "../dailyPlanTemplate/dailyPlanTemplate.interface";

export interface IDailyChecklist extends Document {
  user: ObjectId;
  template: ObjectId;
  date: Date;
  tasks: (IDailyTask & { isCompleted: boolean; completedAt?: Date })[];
}
