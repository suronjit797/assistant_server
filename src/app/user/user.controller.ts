import { RequestHandler } from "express";
import httpStatus from "http-status";
import globalController from "../../global/global.controller";
import { ApiError } from "../../global/globalError";
import sendResponse from "../../shared/sendResponse";
import userService from "./user.service";
import UserModel from "./user.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import sendEmail from "../../utils/sendMail";
import { mailTemplate } from "../../utils/makeEmailTemplate";

// variables
const name = "User";
// global
const globalControllers = globalController(userService, name);

// login and register
export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.login(req.body);

    if (!data) {
      // Unauthorized error for failed login attempts
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const { accessToken, refreshToken } = data;

    const cookieOptions = {
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(httpStatus.OK).send({
      success: true,
      message: "User logged in successfully",
      token: accessToken,
    });
    return;
  } catch (error) {
    next(error);
  }
};

const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.getSingle(req.user._id);
    const payload = {
      success: true,
      message: "Profile fetched successfully",
      data,
    };
    sendResponse(res, httpStatus.OK, payload);
    return;
  } catch (error) {
    next(error);
  }
};

const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.update(req.user._id, req.body);
    const payload = {
      success: true,
      message: "Profile updated successfully",
      data,
    };
    sendResponse(res, httpStatus.OK, payload);
    return;
  } catch (error) {
    next(error);
  }
};

const removeProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.remove(req.user._id);
    const payload = {
      success: true,
      message: "Profile deleted successfully",
      data,
    };
    sendResponse(res, httpStatus.OK, payload);
    return;
  } catch (error) {
    next(error);
  }
};

// Request body validation schema

export const forgotPassword: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    // Validate request body
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

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

    res.status(200).json({ message: "Password reset link sent to your email account" });
  } catch (error) {
    next(error);
  }
};

const userController = { ...globalControllers, getProfile, updateProfile, loginUser, removeProfile };
export default userController;
