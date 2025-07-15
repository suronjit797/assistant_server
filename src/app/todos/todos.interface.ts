import { Model, ObjectId } from "mongoose";

export interface ITodos {
  title: string;
  type: string;
  amount: number;
  user: ObjectId;
  isPending: boolean;
  isImportant: boolean;
}

export type TTodosModel = Model<ITodos, Record<string, unknown>>;
