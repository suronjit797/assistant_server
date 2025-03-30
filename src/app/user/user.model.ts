import { Schema, model } from "mongoose";
import type { TUser, TUserModel } from "./user.interface";
import { ImageSchema, userRole } from "../../shared/constant";

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: Object.values(userRole), default: "user" },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    loginId: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: true },
    avatar: ImageSchema,
    lastLogin: { type: Date },
    otp: { type: Number },
    otpExpiredAt: {
      type: Date,
      default: () => new Date(new Date().getTime() + 5 * 60000),
    },
  },
  { timestamps: true },
);

const UserModel = model<TUser, TUserModel>("User", userSchema);


export default UserModel;
