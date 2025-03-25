import config from "../../config";
import globalService from "../../global/global.service";
import { ApiError } from "../../global/globalError";
import type { TUser } from "./user.interface";
import UserModel from "./user.model";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginRes = { accessToken: string; refreshToken: string };

const globalServices = globalService(UserModel);

// other services
const login = async (payload: LoginPayload): Promise<LoginRes> => {
  // Find user by email
  const user = await UserModel.findOne({ email: payload.email }).select("+password");
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

  const newUser = await UserModel.create(userData);

  return newUser;
};

const userService = { ...globalServices, login, create };

export default userService;
