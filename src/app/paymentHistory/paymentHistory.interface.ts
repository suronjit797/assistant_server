import { ObjectId } from "mongoose";

export interface IPaymentHistory extends Document {
  payments:ObjectId[]
}