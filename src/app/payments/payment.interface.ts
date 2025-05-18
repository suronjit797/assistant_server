import { ObjectId } from "mongoose";

export interface IPayment extends Document {
  product: string;
  donorName: string;
  dateOfTrustDeed: Date | null;
  trustDeedExpiryDate: Date | null;
  tenure: number | null;
  dividendFrequency: string;
  trustDeedNo: string;
  reference: string;
  trustAmount: number | null;
  interestDividendPayableToClient: number | null;
  status: "pending" | "initializing" | "completed";
  type: "auto" | "manual";
  income: number | null;
  payment: string;
  accountNumber: string;
  accountName: string;
  bank: string;
  bankCode: string;
  paymentMode: string;
  name: string;
  nricNo: string;
  name1: string;
  nricPassportNo: string;
  mobileNo: string;
  emailAddress: string;
}

export interface IPaymentHistory extends Document {
  payments: ObjectId[];
}
