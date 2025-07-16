import { Schema, model } from "mongoose";
import { todosPriorities } from "../../shared/constant";
import { ITodos, ITodosModel } from "./todos.interface";

const todosSchema = new Schema<ITodos>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    isCompleted: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: { type: String, enum: todosPriorities, default: "medium" },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  },
  { timestamps: true },
);

export const TodosModel = model<ITodos, ITodosModel>("Todo", todosSchema);
