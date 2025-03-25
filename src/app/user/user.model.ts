import { Schema, model } from "mongoose";
import type { TUser, TUserModel } from "./user.interface";
import { userRole } from "../../shared/constant";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      default: "user",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

const UserModel = model<TUser, TUserModel>("User", userSchema);

export default UserModel;
