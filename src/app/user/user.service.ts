import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../config";
import { ApiError } from "../../global/globalError";
import { CustomJwtPayload } from "../../global/globalInterfaces";
import { extractToken } from "../../middleware/auth";
import { mailTemplate } from "../../utils/makeEmailTemplate";
import sendEmail from "../../utils/sendMail";
import type { TUser } from "./user.interface";
import UserModel from "./user.model";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginRes = { accessToken: string; refreshToken: string };

// other services
const login = async (payload: LoginPayload): Promise<LoginRes> => {
  // Find user by email
  const user = await UserModel.findOne({ $or: [{ email: payload.email }, { loginId: payload.email }] }).select(
    "+password",
  );
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password as string);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Create access and refresh tokens
  const accessToken = jwt.sign({ userId: user._id }, config.token.access_token_secret, {
    expiresIn: config.token.access_token_time,
  });

  const refreshToken = jwt.sign({ userId: user._id }, config.token.refresh_token_secret, {
    expiresIn: config.token.refresh_token_time,
  });

  return { accessToken, refreshToken };
};

// register a user
const create = async (user: TUser): Promise<TUser | null> => {
  const isExist = await UserModel.findOne({ email: user.email });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }

  if (!user.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");
  }

  if (user.password.length < 6) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password must be at least 6 characters long");
  }

  const salt = await bcrypt.genSalt(config.sault_round);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  const userData = { ...user, password: hashedPassword };
  if (!userData.avatar?.url) {
    userData.avatar = {
      name: "default avatar",
      url: `https://ui-avatars.com/api/?name=${userData.name}`,
      size: 0,
      status: "active",
      uid: userData.email,
    };
  }

  const newUser = await UserModel.create(userData);

  return newUser;
};

const forgotPassword = async (email: string): Promise<void> => {
  try {
    const user = await UserModel.findOne({ $or: [{ email: email }, { loginId: email }] });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid User");
    }

    const token = jwt.sign({ userId: user._id }, config.token.access_token_secret, {
      expiresIn: config.token.access_token_time,
    });

    const link = `${config.FRONTEND_URL}/reset-password/${token}`;

    const text = mailTemplate({
      fileName: "forgotPassword",
      name: user.name,
      email,
      link,
    });

    await sendEmail({ email, subject: "UBB Amanah Berhad Password Reset", text });
    return;
  } catch {
    throw new Error("Reset Password Failed");
  }
};

type resetPayload = { token: string; password: string };

const resetPassword = async (payload: resetPayload): Promise<TUser | null> => {
  console.log(payload);
  try {
    const token = extractToken(payload.token);
    console.log(token);
    if (!token) throw new Error(`Invalid Request`);

    const decoded = jwt.verify(token, config.token.access_token_secret) as CustomJwtPayload;
    console.log(decoded);
    const user = UserModel.findById(decoded?._id);
    console.log(user);
    if (!user) throw new Error(`Invalid Request`);

    const salt = await bcrypt.genSalt(config.sault_round);
    const hashedPassword = await bcrypt.hash(payload.password, salt);
    const data = await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true });

    return data;
  } catch {
    throw new Error("Reset Password Failed");
  }
};

const userService = { login, create, forgotPassword, resetPassword };

export default userService;
