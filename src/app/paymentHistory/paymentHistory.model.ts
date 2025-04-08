import { Schema, model } from "mongoose";
import type { IPaymentHistory } from "./paymentHistory.interface";

const PaymentHistorySchema: Schema = new Schema<IPaymentHistory>(
  {
    payments: [{ type: Schema.ObjectId, ref: "Payment" }],
    user: { type: Schema.ObjectId, ref: "User" },
    type: { type: String, default: "auto", enum: ["auto", "manual"] },
    bank: { type: String },
  },
  { timestamps: true },
);

const PaymentHistoryModel = model<IPaymentHistory>("PaymentHistory", PaymentHistorySchema);

export default PaymentHistoryModel;
