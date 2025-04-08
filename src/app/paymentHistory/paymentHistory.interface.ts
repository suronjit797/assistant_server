import { ObjectId } from "mongoose";

export interface IPaymentHistory extends Document {
  payments: ObjectId[];
  type: "auto" | "manual";
  user: ObjectId;
  bank?: string;
}
