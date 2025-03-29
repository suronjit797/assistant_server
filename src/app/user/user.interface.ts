import { Model } from "mongoose";
import { ImageInterface } from "../../global/globalInterfaces";

export type TUser = {
  name: string;
  email: string;
  role: "superAdmin" | "admin" | "user";
  password?: string;
  phone: string;
  loginId: string;
  isActive: boolean;
  avatar: ImageInterface;
  lastLogin: Date;
  otp: number;
  otpExpiredAt: Date;
};

export type LoginPayload = {
  email: string;
  password: string;
};
export type LoginRes = { accessToken: string; refreshToken: string };

export type TUserModel = Model<TUser, Record<string, unknown>>;
