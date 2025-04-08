import { Schema, model } from "mongoose";
import type { IPaymentHistory } from "./paymentHistory.interface";

const PaymentHistorySchema: Schema = new Schema<IPaymentHistory>(
  {
    payments: [{ type: Schema.ObjectId, ref: "Payment" }],
  },
  { timestamps: true },
);

const PaymentHistoryModel = model<IPaymentHistory>("PaymentHistory", PaymentHistorySchema);

export default PaymentHistoryModel;
