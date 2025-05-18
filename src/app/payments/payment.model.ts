import { Schema, model } from "mongoose";
import type { IPayment } from "./payment.interface";

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    product: { type: String },
    donorName: { type: String },
    dateOfTrustDeed: { type: Date },
    trustDeedExpiryDate: { type: Date },
    tenure: { type: Number },
    dividendFrequency: { type: String },
    trustDeedNo: { type: String },
    reference: { type: String },
    trustAmount: { type: Number },
    interestDividendPayableToClient: { type: Number },
    income: { type: Number },
    payment: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
    bank: { type: String },
    bankCode: { type: String },
    paymentMode: { type: String },
    name: { type: String },
    nricNo: { type: String },
    name1: { type: String },
    nricPassportNo: { type: String },
    mobileNo: { type: String },
    emailAddress: { type: String },
    status: { type: String, enum: ["pending", "initializing", "completed"], default: "pending" },
    type: { type: String, enum: ["auto", "manual"], default: "manual" },
  },
  { timestamps: true },
);

const PaymentModel = model<IPayment>("Payment", PaymentSchema);

export default PaymentModel;
