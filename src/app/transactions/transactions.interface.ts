import { Model, ObjectId } from "mongoose";

export type TTransactions = {
  title: string;
  type: string;
  amount: number;
  user: ObjectId;
  isPending: boolean;
  isImportant: boolean;
};

export type TTransactionsModel = Model<TTransactions, Record<string, unknown>>;
