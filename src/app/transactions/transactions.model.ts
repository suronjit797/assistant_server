import { Schema, model } from "mongoose";
import { TTransactions, TTransactionsModel } from "./transactions.interface";
import { transactionsTypes } from "../../shared/constant";

const transactionSchema = new Schema<TTransactions>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    isPending: { type: Boolean, default: true },
    isImportant: { type: Boolean, default: false },
    user: { type: Schema.ObjectId, required: true },
    type: {
      type: String,
      enums: transactionsTypes,
      required: true,
    },
  },
  { timestamps: true },
);

const TransactionsModel = model<TTransactions, TTransactionsModel>("Transactions", transactionSchema);

export default TransactionsModel;
