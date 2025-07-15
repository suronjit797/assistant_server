import { Model, ObjectId } from "mongoose";

export interface ITodos {
  description: string;
  dueDate: Date;
  priority: string;
  title: string;
  user: ObjectId;
  isImportant: boolean;
  isCompleted: boolean;
}

export type TTodosModel = Model<ITodos, Record<string, unknown>>;
