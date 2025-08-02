import { Document, Model } from "mongoose";
import { ImageInterface } from "../../global/globalInterfaces";

export type TUser = {
  name: string;
  email: string;
  role: "superAdmin" | "admin" | "user";
  password?: string;
  phone?: string;
  loginId: string;
  isActive?: boolean;
  avatar?: ImageInterface;
  lastLogin?: Date;
  secret: string;
  salt?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
export type LoginRes = { accessToken: string; refreshToken: string };

export interface TUserDocument extends TUser, Document {}

export type TUserModel = Model<TUser, Record<string, unknown>>;
